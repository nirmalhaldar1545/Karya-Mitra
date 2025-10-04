import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
      department: string;
    } & DefaultSession["user"];
  }

  interface User {
    firstName: string;
    lastName: string;
    roleId: number | null;
    departmentId: number | null;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Find user in database
        const user = await db.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            role: true,
            department: true,
          },
        });

        // Check if user exists
        if (!user) {
          throw new Error("Invalid email or password");
        }

        // Check if user is active
        if (user.status !== "active") {
          throw new Error("Account is inactive. Please contact administrator.");
        }

        // Check if user has password hash
        if (!user.passwordHash) {
          throw new Error("Invalid login method. Please use OAuth provider.");
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          departmentId: user.departmentId,
          role: user.role?.roleName ?? null,
          department: user.department?.departmentName ?? null,
        };
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.roleId = user.roleId;
        token.departmentId = user.departmentId;
        
        // Fetch role and department info
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          include: {
            role: true,
            department: true,
          },
        });
        
        token.role = dbUser?.role?.roleName ?? null;
        token.department = dbUser?.department?.departmentName ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.email = (token.email as string) ?? "";
        session.user.firstName = (token.firstName as string) ?? "";
        session.user.lastName = (token.lastName as string) ?? "";
        session.user.role = (token.role as string) ?? "";
        session.user.department = (token.department as string) ?? "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
