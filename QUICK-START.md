# ⚡ Karya-Mitra Database - Quick Start Guide

## 🎯 Your Database is Ready!

Everything is set up and operational. Here's what you need to know to get started immediately.

---

## 🔐 Login Credentials

### Admin Access
```
Email:    admin@karyamitra.gov.in
Password: admin123
Role:     Admin
```

### Employee Access
```
Email:    rajesh.kumar@karyamitra.gov.in
Password: employee123
Role:     Employee
```

**⚠️ Change these passwords immediately after first login!**

### Database Access
```
Host:     localhost
Port:     5432
Database: karya_mitra
Username: nirmal
Password: vikram
```

---

## 🚀 Essential Commands

### Start Development Server
```bash
npm run dev
```
Opens at: **http://localhost:3000**

### View Database (Prisma Studio)
```bash
npm run db:studio
```
Opens at: **http://localhost:5555**

### User Management
```bash
# List all users
npm run db:list-users

# Add another employee
npm run db:add-employee
```

### Other Useful Commands
```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes
npx prisma db push

# Seed database
npm run db:seed

# Reset database (⚠️ deletes all data)
npm run db:reset
```

---

## 📊 What's in Your Database

### Users & Roles
- ✅ 2 Users ready (1 Admin, 1 Employee)
- ✅ 5 Roles configured (Employee, Manager, HR, Admin, Executive)
- ✅ 34 Permissions set up

### Organization
- ✅ 8 Departments created
- ✅ 1 Sample team ready
- ✅ Hierarchical structure in place

### Performance System
- ✅ 12 KPI templates configured
  - 4 for HQ staff
  - 4 for Field staff
  - 4 Common KPIs
- ✅ Performance tracking ready
- ✅ Feedback system ready
- ✅ Goal management ready

### HR Features
- ✅ Promotion/demotion tracking
- ✅ Training management
- ✅ Career progression tracking

### Security
- ✅ Audit trail enabled
- ✅ Role-based access control
- ✅ Password encryption
- ✅ Session management

---

## 📁 Important Files

### Documentation
```
📄 USER-CREDENTIALS.md             - All user credentials
📄 DATABASE-README.md              - Complete documentation
📄 DATABASE-SETUP-COMPLETE.md      - Setup summary
📄 DATABASE-SCHEMA-DIAGRAM.md      - Visual schema
📄 IMPLEMENTATION-SUMMARY.md       - Implementation details
📄 QUICK-START.md                  - This file
```

### Database Files
```
📄 prisma/schema.prisma            - Database schema
📄 prisma/seed.ts                  - Seed script
📄 .env                            - Environment config
```

### Scripts
```
📄 scripts/add-employee.ts         - Add employee user
📄 scripts/list-users.ts           - List all users
```

---

## 🎯 Next Steps

### 1. Verify Setup
```bash
# List all users
npm run db:list-users

# Open Prisma Studio
npm run db:studio

# Browse to http://localhost:5555
```

### 2. Start Development
```bash
# Start dev server
npm run dev

# Open browser
# Go to http://localhost:3000
```

### 3. Test User Accounts
- Log in as Admin to test full access
- Log in as Employee to test limited access
- Verify role-based permissions

### 4. Change Default Passwords
- Log in with each account
- Navigate to profile settings
- Update passwords immediately

### 5. Begin Development
- Implement authentication flows
- Create API endpoints
- Build frontend components
- Connect to database

---

## 🔍 Quick Database Queries

### Check All Users
```bash
npm run db:list-users
```

### Using SQL
```sql
-- Check users
SELECT 
  email, 
  "firstName", 
  "lastName", 
  status,
  (SELECT "roleName" FROM roles WHERE id = "roleId") as role
FROM users;

-- Check team memberships
SELECT 
  u."firstName" || ' ' || u."lastName" as name,
  t."teamName",
  tm.status
FROM team_membership tm
JOIN users u ON tm."userId" = u.id
JOIN teams t ON tm."teamId" = t.id
WHERE tm.status = 'active';
```

---

## 🆘 Troubleshooting

### Can't connect to database?
```bash
# Check if PostgreSQL is running
# Windows:
sc query postgresql-x64-14

# Test connection
psql -U nirmal -h localhost -d karya_mitra
```

### Prisma issues?
```bash
# Regenerate client
npx prisma generate

# Reset if needed
npm run db:reset
```

### Need to add more users?
```bash
# Add employee
npm run db:add-employee

# Or use Prisma Studio
npm run db:studio
```

---

## 📚 Learn More

- **User Credentials:** `USER-CREDENTIALS.md`
- **Full Documentation:** `DATABASE-README.md`
- **Schema Diagram:** `DATABASE-SCHEMA-DIAGRAM.md`
- **Setup Guide:** `prisma/setup-database.md`

---

## ✅ Checklist

- [x] Database created
- [x] Schema deployed
- [x] Data seeded
- [x] Admin user created
- [x] Employee user created
- [x] Prisma Client generated
- [ ] Admin password changed
- [ ] Employee password changed
- [ ] Development server started
- [ ] First API endpoint created
- [ ] Authentication implemented

---

## 🎉 You're All Set!

Your database is **fully operational** with **2 test users** ready for development.

**Start building:** `npm run dev`  
**Explore data:** `npm run db:studio`  
**List users:** `npm run db:list-users`

---

**Status:** ✅ Ready  
**Database:** karya_mitra  
**Tables:** 20+  
**Users:** 2 (Admin + Employee)  
**Records:** 60+  

Happy coding! 🚀
