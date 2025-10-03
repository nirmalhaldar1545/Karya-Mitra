# 🔐 Karya-Mitra User Credentials

## Test User Accounts

Below are the test user accounts available in the database for development and testing.

---

## 👤 User Accounts

### 1. Admin User
```
Name:       System Administrator
Email:      admin@karyamitra.gov.in
Password:   admin123
Role:       Admin
Department: Human Resources
Status:     Active
```

**Permissions:**
- Full system access
- Manage users and roles
- View audit trail
- System configuration
- All administrative functions

**Dashboard Access:**
- ❌ Employee Dashboard (Access Denied)
- ✅ Admin Dashboard (To be implemented)

---

### 2. Employee User
```
Name:       Rajesh Kumar
Email:      rajesh.kumar@karyamitra.gov.in
Password:   employee123
Role:       Employee
Department: Engineering
Team:       Core Development Team
Status:     Active
```

**Permissions:**
- View own performance
- View and edit own goals
- View own feedback
- Enroll in training programs
- View own dashboard

**Sample Data:**
- ✅ Assigned to Core Development Team
- ✅ Has 1 active goal: "Complete training on performance management system"

---

## 🔒 Security Notes

### ⚠️ IMPORTANT
1. **Change all default passwords immediately after first login**
2. These credentials are for **development and testing only**
3. **Never use these credentials in production**
4. Implement proper password policies before deployment

### Password Requirements (Recommended)
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

---

## 🎯 Testing Scenarios

### Test as Admin
1. Login with admin credentials
2. Access all system features
3. Manage users and departments
4. View organization-wide analytics
5. Configure system settings

### Test as Employee
1. Login with employee credentials
2. View personal dashboard
3. Check assigned goals
4. View performance metrics
5. Access training programs

---

## 🚀 Quick Login Test

### Using Prisma Studio
```bash
npm run db:studio
```
Navigate to: http://localhost:5555
- Go to `users` table
- View both user accounts
- Verify roles and departments

### Using psql
```bash
psql -U nirmal -h localhost -d karya_mitra
```

```sql
-- View all users
SELECT 
  email, 
  "firstName", 
  "lastName", 
  status,
  (SELECT "roleName" FROM roles WHERE id = "roleId") as role
FROM users;
```

---

## 📊 User Comparison

| Feature | Admin | Employee |
|---------|-------|----------|
| **Full Name** | System Administrator | Rajesh Kumar |
| **Email** | admin@karyamitra.gov.in | rajesh.kumar@karyamitra.gov.in |
| **Password** | admin123 | employee123 |
| **Role** | Admin | Employee |
| **Department** | Human Resources | Engineering |
| **Team** | Core Development Team (Manager) | Core Development Team (Member) |
| **Permissions** | Full Access | Limited Access |
| **Can Manage Users** | ✅ Yes | ❌ No |
| **Can View All Performance** | ✅ Yes | ❌ No (Own only) |
| **Can Manage Teams** | ✅ Yes | ❌ No |
| **Can Enroll in Training** | ✅ Yes | ✅ Yes |
| **Can Set Own Goals** | ✅ Yes | ✅ Yes |

---

## 🔄 Adding More Users

### Add Another Employee
```bash
npx tsx scripts/add-employee.ts
```

### Add Custom User (via Prisma Studio)
1. Run `npm run db:studio`
2. Navigate to `users` table
3. Click "Add record"
4. Fill in details (remember to hash password!)

### Add User Programmatically
```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hashedPassword = await bcrypt.hash("yourpassword", 10);

await prisma.user.create({
  data: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@karyamitra.gov.in",
    passwordHash: hashedPassword,
    roleId: 2, // Manager role
    departmentId: 3, // Engineering
    status: "active",
    emailVerified: new Date(),
  },
});
```

---

## 🎭 Role-Based Testing

### Test Different Roles

To test different role capabilities, you can create users with different roles:

**Employee Role (ID: 1)**
- Basic access to own data

**Manager Role (ID: 2)**
- Team management capabilities
- View team performance

**HR Role (ID: 3)**
- Employee management
- Training management

**Admin Role (ID: 4)**
- Full system access

**Executive Role (ID: 5)**
- Analytics and reporting

---

## 📝 Password Reset (Development)

If you forget a password during development:

```typescript
// Run this script to reset password
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const newPassword = await bcrypt.hash("newpassword123", 10);

await prisma.user.update({
  where: { email: "user@karyamitra.gov.in" },
  data: { passwordHash: newPassword },
});
```

---

## 🔍 Verify User Accounts

### Check Users in Database
```sql
-- List all users with their roles
SELECT 
  u.email,
  u."firstName",
  u."lastName",
  r."roleName",
  d."departmentName",
  u.status
FROM users u
LEFT JOIN roles r ON u."roleId" = r.id
LEFT JOIN departments d ON u."departmentId" = d.id;
```

### Check Team Memberships
```sql
-- List team members
SELECT 
  u."firstName" || ' ' || u."lastName" as name,
  u.email,
  t."teamName",
  tm.status
FROM team_membership tm
JOIN users u ON tm."userId" = u.id
JOIN teams t ON tm."teamId" = t.id
WHERE tm.status = 'active';
```

---

## 🆘 Troubleshooting

### Can't Login?
1. Verify user exists in database
2. Check password is correct
3. Verify user status is 'active'
4. Check role assignment

### Need to Reset Everything?
```bash
# Reset database and reseed
npm run db:reset

# Add employee again
npx tsx scripts/add-employee.ts
```

---

## 📚 Next Steps

1. ✅ Users created and ready
2. 🔄 Test login functionality
3. 🔄 Implement authentication
4. 🔄 Build role-based dashboards
5. 🔄 Add more test users as needed

---

**Last Updated:** 2024  
**Total Users:** 2 (1 Admin, 1 Employee)  
**Status:** Ready for Testing ✅

---

*For security best practices, refer to `DATABASE-README.md`*
