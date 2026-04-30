# 🚀 Deployment Guide: Netlify + Vercel

Complete guide to deploy your Team Task Manager to production using **free** services.

**Architecture:**
- **Backend**: Netlify Functions (Node.js serverless)
- **Frontend**: Vercel (React)
- **Database**: Supabase/ElephantSQL/Neon (PostgreSQL - Free)

---

## 📋 Prerequisites

- GitHub account
- Netlify account (https://netlify.com)
- Vercel account (https://vercel.com)
- Database account (Supabase/ElephantSQL/Neon)
- Git installed locally

---

## Part 1: Setup Database 🗄️

### Option A: Supabase (Recommended)

1. **Go to Supabase**: https://supabase.com
2. **Create account** and **New project**
3. **Wait for database** to be ready (~2 minutes)
4. **Get connection string**:
   - Go to **Settings** → **Database**
   - Scroll to **Connection string** → **URI**
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password

**Connection string format:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres
```

### Option B: ElephantSQL

1. **Go to ElephantSQL**: https://www.elephantsql.com
2. **Create account** and **Create New Instance**
3. **Select "Tiny Turtle" (Free)**
4. **Copy the URL** from the instance details

### Option C: Neon

1. **Go to Neon**: https://neon.tech
2. **Create account** and **New project**
3. **Copy connection string** from dashboard

---

## Part 2: Deploy Backend to Netlify 🌐

### Step 1: Prepare Your Code

1. **Install serverless-http:**
```bash
npm install serverless-http
```

2. **Commit all changes:**
```bash
git add .
git commit -m "Prepare for Netlify deployment"
```

3. **Push to GitHub:**
```bash
git push origin main
```

### Step 2: Create Netlify Site

1. **Go to Netlify**: https://app.netlify.com
2. **Click "Add new site"** → **"Import an existing project"**
3. **Connect to GitHub** and authorize Netlify
4. **Select your repository**

### Step 3: Configure Build Settings

**Build settings:**
- **Base directory**: (leave empty)
- **Build command**: `npm install && npx prisma generate && cd client && npm install && npm run build`
- **Publish directory**: `client/dist`
- **Functions directory**: `netlify/functions`

### Step 4: Add Environment Variables

Click **"Show advanced"** → **"New variable"** and add:

```env
DATABASE_URL=your-database-url-from-part-1
JWT_SECRET=your-super-secret-random-string-min-32-characters
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

**Generate JWT_SECRET:**
```bash
# On Mac/Linux
openssl rand -hex 32

# On Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use any random 32+ character string
```

### Step 5: Deploy

1. **Click "Deploy site"**
2. **Wait for deployment** (~3-5 minutes)
3. **Check deployment logs** for any errors
4. **Copy your Netlify URL**: `https://your-app.netlify.app`

### Step 6: Run Database Migrations

**Option A: Using Netlify CLI (Recommended)**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to your site
netlify link

# Set DATABASE_URL (if not already set)
netlify env:set DATABASE_URL "your-database-url"

# Run migrations
npx prisma migrate deploy
```

**Option B: Using Database Client**

Connect to your database directly and run migrations:

```bash
# Using psql
psql "your-database-url"

# Then run the SQL from prisma/migrations folder
```

**Option C: Using Prisma Studio**

```bash
# Set DATABASE_URL in your local .env
DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy
```

### Step 7: Test Backend

Visit: `https://your-app.netlify.app/api/health`

You should see:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

✅ **Backend is now deployed!**

---

## Part 3: Deploy Frontend to Vercel 🔺

### Step 1: Update Frontend Configuration

1. **Update `client/.env.production`:**
```env
VITE_API_URL=https://your-netlify-site.netlify.app
```

Replace with your actual Netlify URL from Part 2, Step 5.

2. **Commit changes:**
```bash
git add .
git commit -m "Add Netlify backend URL"
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
   - Value: `https://your-netlify-site.netlify.app`

6. **Click "Deploy"**

### Step 3: Update Backend CORS

1. **Go back to Netlify**
2. **Site settings** → **Environment variables**
3. **Update `CLIENT_URL`:**
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
4. **Trigger redeploy**: Deploys → Trigger deploy → Deploy site

### Step 4: Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`
2. **Try signing up**
3. **Create a project**
4. **Create tasks**
5. **Test all features**

✅ **Frontend is now deployed!**

---

## 🔧 Post-Deployment Configuration

### Netlify Environment Variables

Go to Netlify → Site settings → Environment variables:

```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=<your-generated-secret>
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

### Vercel Environment Variables

Go to Vercel → Your Project → Settings → Environment Variables:

```env
VITE_API_URL=https://your-netlify-site.netlify.app
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
- [ ] **API Health** - Visit `/api/health` endpoint

---

## 🆘 Troubleshooting

### Backend Issues

**Problem**: "Function invocation failed"
**Solution**: 
- Check Netlify function logs
- Verify DATABASE_URL is set correctly
- Ensure migrations ran successfully

**Problem**: "Database connection failed"
**Solution**:
```bash
# Test connection locally
DATABASE_URL="your-production-url" npx prisma studio

# Run migrations
npx prisma migrate deploy
```

**Problem**: "JWT errors"
**Solution**: Verify JWT_SECRET is set in Netlify environment variables

### Frontend Issues

**Problem**: "Network Error" or "Failed to fetch"
**Solution**:
- Verify VITE_API_URL is correct in Vercel
- Check Netlify backend is running
- Test API health endpoint
- Verify CORS settings (CLIENT_URL in Netlify)

**Problem**: "404 on refresh"
**Solution**: Vercel should handle this automatically with vercel.json

### CORS Issues

**Problem**: "CORS policy blocked"
**Solution**:
1. Verify CLIENT_URL in Netlify matches your Vercel URL exactly
2. Ensure no trailing slash in URLs
3. Redeploy Netlify after changing CLIENT_URL
4. Clear browser cache

### Database Issues

**Problem**: "Prisma Client not generated"
**Solution**:
```bash
npx prisma generate
```

**Problem**: "Migration failed"
**Solution**:
```bash
# Reset and re-run migrations
npx prisma migrate reset
npx prisma migrate deploy
```

---

## 📊 Deployment URLs

After deployment, you'll have:

**Backend (Netlify):**
```
https://your-app.netlify.app
API: https://your-app.netlify.app/api/*
```

**Frontend (Vercel):**
```
https://your-app.vercel.app
```

**Database:**
```
Supabase: https://app.supabase.com
ElephantSQL: https://customer.elephantsql.com
Neon: https://console.neon.tech
```

---

## 🔄 Continuous Deployment

Both Netlify and Vercel support automatic deployments:

**Netlify:**
- Automatically deploys when you push to `main` branch
- Monitors your GitHub repository
- Builds and deploys backend functions

**Vercel:**
- Automatically deploys when you push to `main` branch
- Creates preview deployments for pull requests
- Builds and deploys frontend

**To deploy updates:**
```bash
git add .
git commit -m "Your update message"
git push
```

Both services will automatically detect changes and redeploy! 🚀

---

## 💰 Cost Estimation

### Netlify
- **Free Tier**: 
  - 100GB bandwidth/month
  - 300 build minutes/month
  - 125k function requests/month
- **Estimated**: $0/month for small apps

### Vercel
- **Free Tier**: 
  - 100GB bandwidth/month
  - Unlimited deployments
- **Estimated**: $0/month for small apps

### Database
- **Supabase Free**: 500MB database, 2GB bandwidth
- **ElephantSQL Free**: 20MB database
- **Neon Free**: 3GB storage

**Total Estimated Cost**: $0/month (Free!) 🎉

---

## 🎯 Quick Deployment Commands

### Initial Deployment
```bash
# 1. Install dependencies
npm install serverless-http

# 2. Commit and push
git add .
git commit -m "Initial deployment"
git push

# 3. Deploy backend (Netlify)
# - Use Netlify dashboard
# - Connect GitHub repo
# - Configure environment variables
# - Deploy

# 4. Run migrations
netlify login
netlify link
npx prisma migrate deploy

# 5. Deploy frontend (Vercel)
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

# Netlify and Vercel will auto-deploy!
```

---

## 📚 Additional Resources

- **Netlify Docs**: https://docs.netlify.com
- **Netlify Functions**: https://docs.netlify.com/functions/overview/
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] All code committed to Git
- [ ] Repository pushed to GitHub
- [ ] serverless-http installed
- [ ] Database created (Supabase/ElephantSQL/Neon)
- [ ] Database connection string obtained

### Netlify Setup
- [ ] Netlify account created
- [ ] Site created from GitHub
- [ ] Build settings configured
- [ ] Environment variables set
- [ ] Site deployed successfully
- [ ] Database migrations run
- [ ] Backend URL obtained
- [ ] API health check passed

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
- [ ] Database connection verified

---

## 🎉 Success!

Your Team Task Manager is now live in production - **completely free**!

**Backend**: Netlify Functions ✅
**Frontend**: Vercel ✅
**Database**: PostgreSQL (Supabase/ElephantSQL/Neon) ✅

Share your app with the world! 🚀

---

**Need Help?**
- Netlify Support: https://answers.netlify.com
- Vercel Discord: https://vercel.com/discord
- Supabase Discord: https://discord.supabase.com
- Check logs in Netlify/Vercel dashboards
