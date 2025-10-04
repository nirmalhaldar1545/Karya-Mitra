# Database Sync Guide - Development ↔ Production

This guide explains how to keep your database synchronized between development and production environments for every change.

## 🎯 Problem Solved

Previously, database changes made in development (like new users, schema updates, data modifications) weren't reflected in production after deployment. This guide provides a complete solution.

## 📋 Database Change Types

### 1. Schema Changes (Structure)
- Adding/removing tables
- Modifying columns
- Changing relationships
- Index updates

### 2. Data Changes (Content)
- New seed data
- User additions
- Configuration updates
- Reference data changes

## 🔄 Sync Workflow

### For Every Database Change:

#### Step 1: Make Changes in Development
```bash
# Start development database
./start-database.sh

# Make your changes (add users, modify data, etc.)
npm run db:studio  # Or use your application
```

#### Step 2: Create Migration (Schema Changes Only)
```bash
# If you modified the schema (prisma/schema.prisma)
npx prisma migrate dev --name "your-change-description"
```

#### Step 3: Update Seed Script (Data Changes)
If you added new data that should exist in production:
```typescript
// Edit prisma/seed.ts
// Add your new data to the seeding logic
```

#### Step 4: Test Locally
```bash
# Reset and test
npm run db:reset
npm run dev
```

#### Step 5: Deploy to Production
```bash
# Deploy your code (git push, vercel deploy, etc.)
```

#### Step 6: Sync Production Database
```bash
# After deployment, run this on your production server/environment
npm run db:setup-production
```

**✅ SUCCESS!** The script will:
- ✅ Handle existing databases without migrations
- ✅ Sync schema changes safely
- ✅ Seed only missing essential data
- ✅ Run custom data migrations
- ✅ Preserve existing data

## 🛠️ Available Commands

### Development
```bash
npm run db:studio          # Open Prisma Studio (database GUI)
npm run db:reset           # Reset database (⚠️ deletes all data)
npm run db:seed            # Run seed script
npm run db:migrate         # Create development migration
```

### Production
```bash
npm run db:setup-production  # Complete production sync (migrations + seed + data fixes)
npm run db:migrate           # Run migrations only
```

## 📝 What `db:setup-production` Does

1. **Runs Migrations**: Applies all pending schema changes
2. **Generates Client**: Updates Prisma client for new schema
3. **Seeds if Empty**: Adds initial data if database is empty
4. **Handles Data Migrations**: Runs custom data migration logic

## 🔧 Customizing Data Migrations

Edit `scripts/setup-production-db.ts` to add custom logic:

```typescript
async function handleDataMigrations() {
  // Add your custom data migration logic here
  // Example: Add new users, update existing data, etc.

  const newUser = await prisma.user.upsert({
    where: { email: "newuser@example.com" },
    update: {},
    create: {
      // user data
    }
  });
}
```

## 🚀 Deployment Integration

### Vercel
Add to your deployment script or run manually after deployment.

### Other Platforms
```bash
# After deployment
npm run db:setup-production
```

### CI/CD Pipeline
Add this step to your deployment pipeline:

```yaml
- name: Sync Database
  run: npm run db:setup-production
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
```

## ⚠️ Important Notes

- **Always backup production data** before running migrations
- **Test migrations locally** before deploying
- **Run setup-production after every deployment** that includes database changes
- **Keep seed data minimal** - only essential data that must exist

## 🔍 Troubleshooting

### Migration Errors
```bash
# Check migration status
npx prisma migrate status

# Resolve issues
npx prisma migrate resolve --applied 20240101120000_migration_name
```

### Connection Issues
- Verify `DATABASE_URL` environment variable
- Check database server is running
- Ensure network connectivity

### Data Issues
- Check `prisma/seed.ts` for correct data
- Verify foreign key relationships
- Check for unique constraint violations

## 📊 Monitoring

After sync, verify:
- [ ] Schema is up to date (`npx prisma db push --preview-feature`)
- [ ] Essential data exists
- [ ] Application functions correctly
- [ ] No orphaned records

## 🎯 Best Practices

1. **Small, frequent changes** rather than large migrations
2. **Test thoroughly** in development before production
3. **Document changes** in commit messages
4. **Backup production** before major changes
5. **Monitor application** after deployment

## 📞 Support

If you encounter issues:
1. Check this guide
2. Review error messages
3. Test locally first
4. Check database logs
5. Verify environment variables

---

**Remember**: Run `npm run db:setup-production` after every deployment to keep your production database in sync! 🚀