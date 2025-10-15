# Migration Guide: Raw SQL to Prisma Only

## 🚀 Step-by-Step Migration Plan

### Step 1: Environment Setup
Create a `.env` file in your backend root with:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=core"
```

### Step 2: Push Schema to Database
```bash
npm run db:push
```

### Step 3: Migrate Controllers One by One

#### Customer Controller Migration
1. Create new Prisma-based customer controller
2. Test thoroughly
3. Replace old controller
4. Remove old customer model

#### Building Controller Migration
1. Create new Prisma-based building controller
2. Test thoroughly
3. Replace old controller
4. Remove old building model

#### Continue for all controllers...

### Step 4: Clean Up
1. Remove all old model files
2. Remove `pg` dependency
3. Remove `db.js` configuration
4. Update imports

## ⚠️ Important Notes
- Test each migration thoroughly
- Keep backups
- Migrate one controller at a time
- Don't rush the process
