# 🚀 Deployment Guide: Vercel + Railway

Complete guide to deploy your Team Task Manager to production.

**Architecture:**
- **Backend**: Railway (Node.js + PostgreSQL)
- **Frontend**: Vercel (React)

---

## 📋 Prerequisites

- GitHub account
- Railway account (https://railway.app)
- Vercel account (https://vercel.com)
- Git installed locally

---

## Part 1: Deploy Backend to Railway 🚂

### Step 1: Prepare Your Code

1. **Commit all changes to Git:**
```bash
git add .
git commit -m "Prepare for deployment"
```

2. **Push to GitHub:**
```bash
# If you haven't created a repo yet:
# Go to GitHub and create a new repository

git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 2: Create Railway Project

1. **Go to Railway**: https://railway.app
2. **Click "New Project"**
3. **Select "Deploy from GitHub repo"**
4. **Authorize Railway** to access your GitHub
5. **Select your repository**

### Step 3: Add PostgreSQL Database

1. **In your Railway project**, click **"New"**
2. **Select "Database"** → **"PostgreSQL"**
3. Railway will create a PostgreSQL database
4. **Copy the DATABASE_URL** (you'll need it)

### Step 4: Configure Environment Variables

1. **Click on your service** (not the database)
2. **Go to "Variables" tab**
3. **Add these variables:**

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=your-super-secret-random-string-min-32-characters-long
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-app.vercel.app
```

**Important:**
- `DATABASE_URL` will auto-reference your PostgreSQL database
- Generate a strong `JWT_SECRET` (use: `openssl rand -hex 32`)
- `CLIENT_URL` will be your Vercel URL (update after frontend deployment)

### Step 5: Configure Build Settings

Railway should auto-detect, but verify:

1. **Go to "Settings" tab**
2. **Build Command**: (leave empty, uses package.json)
3. **Start Command**: `npm start`
4. **Root Directory**: `/` (leave empty)

### Step 6: Run Database Migrations

After deployment, run migrations:

**Option A: Using Railway CLI**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations
railway run npx prisma migrate deploy
```

**Option B: Using Railway Dashboard**
1. Go to your service
2. Click "Settings" → "Deploy"
3. Add custom start command temporarily:
   ```
   npx prisma migrate deploy && npm start
   ```
4. Redeploy
5. Change back to `npm start` after first deployment

### Step 7: Get Your Backend URL

1. **Go to your service** in Railway
2. **Click "Settings"** → **"Networking"**
3. **Generate Domain** (if not auto-generated)
4. **Copy the URL**: `https://your-app.up.railway.app`

✅ **Backend is now deployed!**

---

## Part 2: Deploy Frontend to Vercel 🔺

### Step 1: Update Frontend Configuration

1. **Update `client/.env.production`:**
```env
VITE_API_URL=https://your-railway-backend.up.railway.app
```

Replace with your actual Railway backend URL from Part 1, Step 7.

2. **Commit changes:**
```bash
git add .
git commit -m "Add production environment config"
git push
```

### Step 2: Deploy to Vercel

1. **Go to Vercel**: https://vercel.com
2. **Click "New Project"**
3. **Import your GitHub repository**
4. **Configure project:**

**Framework Preset**: Vite
**Root Directory**: `client`
**Build Command**: `npm run build`
**Output Directory**: `dist`
**Install Command**: `npm install`

5. **Add Environment Variable:**
   - Key: `VITE_API_URL`
   - Value: `https://your-railway-backend.up.railway.app`

6. **Click "Deploy"**

### Step 3: Update Backend CORS

1. **Go back to Railway**
2. **Update `CLIENT_URL` variable:**
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. **Redeploy** (Railway will auto-redeploy)

### Step 4: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Try signing up**
3. **Create a project**
4. **Create tasks**
5. **Test all features**

✅ **Frontend is now deployed!**

---

## 🔧 Post-Deployment Configuration

### Update Railway Environment Variables

Go to Railway → Your Service → Variables:

```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<your-generated-secret>
NODE_ENV=production
PORT=3000
CLIENT_URL=https://your-app.vercel.app
```

### Update Vercel Environment Variables

Go to Vercel → Your Project → Settings → Environment Variables:

```env
VITE_API_URL=https://your-railway-backend.up.railway.app
```

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] **Signup** - Create new account
- [ ] **Login** - Login with credentials
- [ ] **Create Project** - Create a new project
- [ ] **Add Team Member** - Add another user
- [ ] **Create Task** - Create and assign tasks
- [ ] **Update Task** - Change task status
- [ ] **Dashboard** - View statistics
- [ ] **Logout** - Logout and login again
- [ ] **Mobile** - Test on mobile device

---

## 🆘 Troubleshooting

### Backend Issues

**Problem**: "Application failed to respond"
**Solution**: 
- Check Railway logs
- Verify DATABASE_URL is set
- Ensure migrations ran successfully

**Problem**: "Database connection failed"
**Solution**:
```bash
railway run npx prisma migrate deploy
```

**Problem**: "JWT errors"
**Solution**: Verify JWT_SECRET is set in Railway

### Frontend Issues

**Problem**: "Network Error" or "Failed to fetch"
**Solution**:
- Verify VITE_API_URL is correct
- Check Railway backend is running
- Verify CORS settings (CLIENT_URL in Railway)

**Problem**: "404 on refresh"
**Solution**: Vercel should handle this automatically with vercel.json

### CORS Issues

**Problem**: "CORS policy blocked"
**Solution**:
1. Verify CLIENT_URL in Railway matches your Vercel URL
2. Ensure no trailing slash in URLs
3. Redeploy Railway after changing CLIENT_URL

---

## 📊 Deployment URLs

After deployment, you'll have:

**Backend (Railway):**
```
https://your-app.up.railway.app
```

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Database (Railway):**
```
Internal PostgreSQL (managed by Railway)
```

---

## 🔄 Continuous Deployment

Both Railway and Vercel support automatic deployments:

**Railway:**
- Automatically deploys when you push to `main` branch
- Monitors your GitHub repository

**Vercel:**
- Automatically deploys when you push to `main` branch
- Creates preview deployments for pull requests

**To deploy updates:**
```bash
git add .
git commit -m "Your update message"
git push
```

Both services will automatically detect changes and redeploy! 🚀

---

## 💰 Cost Estimation

### Railway
- **Free Tier**: $5 credit/month
- **Hobby Plan**: $5/month + usage
- **Estimated**: $5-15/month for small apps

### Vercel
- **Free Tier**: Generous free tier
- **Pro Plan**: $20/month (if needed)
- **Estimated**: $0/month for small apps

**Total Estimated Cost**: $5-15/month

---

## 🎯 Quick Deployment Commands

### Initial Deployment
```bash
# 1. Commit and push
git add .
git commit -m "Initial deployment"
git push

# 2. Deploy backend (Railway)
# - Use Railway dashboard
# - Add PostgreSQL
# - Configure environment variables
# - Run migrations

# 3. Deploy frontend (Vercel)
# - Use Vercel dashboard
# - Import repository
# - Set root directory to "client"
# - Add VITE_API_URL environment variable
```

### Update Deployment
```bash
# Just push to GitHub
git add .
git commit -m "Update feature"
git push

# Railway and Vercel will auto-deploy!
```

---

## 📚 Additional Resources

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] Environment variables documented
- [ ] Database schema finalized
- [ ] All features tested locally

### Railway Setup
- [ ] Railway account created
- [ ] Project created from GitHub
- [ ] PostgreSQL database added
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Backend URL obtained

### Vercel Setup
- [ ] Vercel account created
- [ ] Project imported from GitHub
- [ ] Root directory set to "client"
- [ ] VITE_API_URL configured
- [ ] Deployment successful
- [ ] Frontend URL obtained

### Post-Deployment
- [ ] Backend CORS updated with frontend URL
- [ ] All features tested in production
- [ ] Mobile responsiveness verified
- [ ] Error handling tested
- [ ] Performance checked

---

## 🎉 Success!

Your Team Task Manager is now live in production!

**Backend**: Railway ✅
**Frontend**: Vercel ✅
**Database**: PostgreSQL ✅

Share your app with the world! 🚀

---

**Need Help?**
- Railway Discord: https://discord.gg/railway
- Vercel Discord: https://vercel.com/discord
- Check logs in Railway/Vercel dashboards
