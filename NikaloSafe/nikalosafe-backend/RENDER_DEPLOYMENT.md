# 🚀 Render Deployment Guide for NikaloSafe Backend

## 📋 Prerequisites
- GitHub repository with your code
- Render account (free tier available)
- Basic understanding of environment variables

## 🗄️ Step 1: Set Up Production Database

### Option A: Render PostgreSQL (Recommended)
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `nikalosafe-db`
   - **Database**: `nikalosafe`
   - **User**: `nikalosafe_user`
   - **Region**: Choose closest to your users
4. Click **"Create Database"**
5. **Save the connection details**

### Option B: External Database
- Use Supabase, Neon, PlanetScale, or any PostgreSQL provider
- Get the connection string

## 🔧 Step 2: Prepare Your Code

### Files Already Created:
- ✅ `render.yaml` - Render configuration
- ✅ `env.production` - Environment variables template
- ✅ Updated `package.json` with production scripts

### What These Files Do:
- **render.yaml**: Tells Render how to deploy your app
- **env.production**: Template for environment variables
- **package.json**: Added `postinstall` script for Prisma

## 🚀 Step 3: Deploy to Render

### Method 1: Using render.yaml (Easiest)
1. **Push your code to GitHub**
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **"New +"** → **"Blueprint"**
4. Connect your GitHub repository
5. Select your repository
6. Render will automatically detect `render.yaml`
7. Click **"Apply"**

### Method 2: Manual Setup
1. **Push your code to GitHub**
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository
5. Configure:
   - **Name**: `nikalosafe-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run db:generate && npm run db:push`
   - **Start Command**: `npm start`
   - **Plan**: Free

## 🔐 Step 4: Environment Variables

### If using render.yaml:
- Database connection is automatic
- Add any additional variables in Render dashboard

### If manual setup:
Add these environment variables in Render dashboard:
```
NODE_ENV=production
DATABASE_URL=postgresql://username:password@host:port/database?schema=core
PORT=10000
```

## 📊 Step 5: Database Schema Setup

### Automatic (Recommended):
- `render.yaml` includes `npm run db:push` in build command
- Schema will be created automatically on deployment

### Manual:
1. After deployment, go to your service logs
2. Run: `npx prisma db push`
3. Or use Render's shell feature

## 🔍 Step 6: Verify Deployment

### Check Your Service:
1. Go to your Render service dashboard
2. Check **"Logs"** tab for any errors
3. Visit your service URL (e.g., `https://nikalosafe-backend.onrender.com`)

### Test API Endpoints:
```bash
# Test root endpoint
curl https://your-app.onrender.com/

# Test customers endpoint
curl https://your-app.onrender.com/api/customers

# Test buildings endpoint
curl https://your-app.onrender.com/api/buildings
```

## 🛠️ Troubleshooting

### Common Issues:

#### 1. Build Failures
- Check if all dependencies are in `package.json`
- Ensure `postinstall` script runs `prisma generate`

#### 2. Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check if database is accessible from Render

#### 3. Schema Issues
- Run `npx prisma db push` manually
- Check Prisma logs in Render

#### 4. 500 Errors
- Check Render logs for specific error messages
- Verify environment variables are set correctly

### Debug Commands:
```bash
# Check Prisma connection
npx prisma db pull

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Open Prisma Studio (for debugging)
npx prisma studio
```

## 🔄 Step 7: Frontend Integration

### Update Frontend API URLs:
1. Change your frontend API calls from:
   ```javascript
   const API_URL = 'http://localhost:5000';
   ```
2. To:
   ```javascript
   const API_URL = 'https://your-app.onrender.com';
   ```

### CORS Configuration:
Your backend already has CORS enabled, so it should work with your frontend.

## 📈 Step 8: Production Optimizations

### Performance:
- Consider upgrading to paid Render plan for better performance
- Add caching if needed
- Optimize database queries

### Monitoring:
- Use Render's built-in monitoring
- Add logging for production debugging
- Set up error tracking (Sentry, etc.)

## 🎯 Final Checklist

- ✅ Database created and accessible
- ✅ Code pushed to GitHub
- ✅ Render service deployed
- ✅ Environment variables configured
- ✅ Database schema applied
- ✅ API endpoints working
- ✅ Frontend updated with production URL

## 🆘 Need Help?

### Render Documentation:
- [Render Docs](https://render.com/docs)
- [PostgreSQL on Render](https://render.com/docs/databases/postgresql)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app)

### Common Render URLs:
- Your app: `https://your-app-name.onrender.com`
- Database: Check Render dashboard for connection details
- Logs: Available in Render service dashboard

---

**🎉 Congratulations! Your NikaloSafe backend should now be live on Render!**
