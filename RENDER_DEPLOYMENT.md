# 🚀 Deploy to Render (Backend) + Vercel (Frontend)

Complete guide to deploy your Team Task Manager using **Render** for backend and **Vercel** for frontend.

---

## 📋 What You'll Deploy

- **Backend**: Render (Node.js + Express API)
- **Frontend**: Vercel (React + Vite)
- **Database**: Render PostgreSQL (Free tier available)

**Total Cost: $0/month** (Free tier) 🎉

---

## Part 1: Setup Database on Render 🗄️

### Step 1: Create Render Account

1. Go to https://render.com
2. Click **"Get Started"**
3. Sign up with GitHub (recommended)

### Step 2: Create PostgreSQL Database

1. In Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Fill in the details:
   - **Name**: `team-task-manager-db`
   - **Database**: `taskmanager` (or leave default)
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **PostgreSQL Version**: 16 (or latest)
   - **Plan**: **Free** (select Free tier)
3. Click **"Create Database"**
4. Wait ~2 minutes for database to be ready

### Step 3: Get Database Connection String

1. Once database is created, you'll see the database dashboard
2. Scroll down to **"Connections"** section
3. Copy the **"Internal Database URL"** (starts with `postgresql://`)
4. It looks like:
   ```
   postgresql://user:password@dpg-xxxxx-a.oregon-postgres.render.com/dbname
   ```
5. **SAVE THIS URL** - you'll need it multiple times

---

## Part 2: Deploy Backend to Render 🌐

### Step 1: Push Code to GitHub

Make sure your code is pushed:
```bash
git add .
git commit -m "Ready for Render deployment"
git push origin main
```

### Step 2: Create Web Service

1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Click **"Connect account"** to connect GitHub (if not already)
3. Find and select your repository: **Team-Task-Manager**
4. Click **"Connect"**

### Step 3: Configure Web Service

Fill in these settings:

**Basic Settings:**
- **Name**: `team-task-manager-api` (or any name you like)
- **Region**: Same as your database
- **Branch**: `main`
- **Root Directory**: (leave empty)
- **Runtime**: `Node`
- **Build Command**: `npm install && npx prisma generate`
- **Start Command**: `npm start`

**Instance Type:**
- Select **"Free"** (Free tier)

### Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

Add these 4 variables:

**Variable 1:**
- **Key**: `DATABASE_URL`
- **Value**: Your Render PostgreSQL Internal Database URL from Part 1, Step 3

**Variable 2:**
- **Key**: `JWT_SECRET`
- **Value**: Generate a random secret (see below)

**Variable 3:**
- **Key**: `NODE_ENV`
- **Value**: `production`

**Variable 4:**
- **Key**: `CLIENT_URL`
- **Value**: `*` (we'll update this later with your Vercel URL)

**Variable 5:**
- **Key**: `PORT`
- **Value**: `10000` (Render uses port 10000 by default)

**To generate JWT_SECRET:**

Windows PowerShell:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

Or use any random 32+ character string.

### Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will start building and deploying (~3-5 minutes)
3. Watch the logs for any errors
4. Once complete, you'll see: **"Your service is live"** ✅

### Step 6: Get Your Backend URL

1. At the top of the page, you'll see your service URL:
   ```
   https://team-task-manager-api.onrender.com
   ```
2. **COPY THIS URL** - you'll need it for the frontend
3. Test it by visiting:
   ```
   https://team-task-manager-api.onrender.com/api/health
   ```
4. You should see: `{"status":"ok","message":"Server is running"}`

### Step 7: Run Database Migrations

**Option A: Using Render Shell (Recommended)**

1. In your Render service dashboard, click **"Shell"** tab (top right)
2. Wait for shell to connect
3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Optional - Seed test users:
   ```bash
   node prisma/seed.js
   ```

**Option B: Using Local Terminal**

```bash
# Set DATABASE_URL to your Render database
$env:DATABASE_URL="postgresql://user:password@dpg-xxxxx.render.com/dbname"

# Run migrations
npx prisma migrate deploy

# Optional: Seed test users
node prisma/seed.js
```

---

## Part 3: Deploy Frontend to Vercel 🔺

### Step 1: Update Frontend Configuration

1. Open `client/.env.production`
2. Update with your Render backend URL:
   ```env
   VITE_API_URL=https://team-task-manager-api.onrender.com
   ```
   (Replace with your actual Render URL)

3. Save the file

### Step 2: Commit and Push

```bash
git add client/.env.production
git commit -m "Add Render backend URL"
git push
```

### Step 3: Deploy to Vercel

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Click **"Import"** next to your GitHub repository

### Step 4: Configure Vercel Project

**IMPORTANT Settings:**

- **Framework Preset**: Vite (auto-detected)
- **Root Directory**: Click **"Edit"** → Enter: `client` ← **IMPORTANT!**
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### Step 5: Add Environment Variable

Click **"Environment Variables"** dropdown:

- **Key**: `VITE_API_URL`
- **Value**: `https://team-task-manager-api.onrender.com` (your Render URL)

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait for deployment (~2-3 minutes)
3. Once complete: **"Congratulations!"** 🎉

### Step 7: Get Your Frontend URL

1. You'll see your app URL:
   ```
   https://your-app.vercel.app
   ```
2. **COPY THIS URL**
3. Click **"Visit"** to open your app

---

## Part 4: Update Backend CORS 🔄

Now update the backend to allow requests from your Vercel frontend:

1. Go back to **Render Dashboard**
2. Click on your web service: **team-task-manager-api**
3. Go to **"Environment"** tab (left sidebar)
4. Find the `CLIENT_URL` variable
5. Click **"Edit"**
6. Change value from `*` to your Vercel URL:
   ```
   https://your-app.vercel.app
   ```
7. Click **"Save Changes"**
8. Render will automatically redeploy (~1 minute)

---

## ✅ Test Your Deployment

1. **Visit your Vercel URL**: `https://your-app.vercel.app`

2. **Test Signup:**
   - Click "Sign Up"
   - Enter email: `test@example.com`
   - Enter name: `Test User`
   - Enter password: `password123`
   - Click "Sign Up"
   - Should redirect to dashboard ✅

3. **Test Create Project:**
   - Click "New Project"
   - Enter name and description
   - Click "Create"
   - Project should appear ✅

4. **Test Create Task:**
   - Click on your project
   - Click "New Task"
   - Fill in details
   - Click "Create"
   - Task should appear ✅

---

## 🎉 SUCCESS!

Your app is now live!

**Backend**: https://team-task-manager-api.onrender.com ✅
**Frontend**: https://your-app.vercel.app ✅
**Database**: Render PostgreSQL ✅

---

## 🔧 Important Notes

### Render Free Tier Limitations

⚠️ **Important**: Render free tier services **spin down after 15 minutes of inactivity**.

**What this means:**
- First request after inactivity takes ~30-60 seconds (cold start)
- Subsequent requests are fast
- This is normal for free tier

**Solutions:**
1. **Upgrade to paid tier** ($7/month) - No cold starts
2. **Use a ping service** - Keep service awake (see below)
3. **Accept the delay** - It's free! 🎉

### Keep Service Awake (Optional)

Use a free service like **UptimeRobot** or **Cron-job.org**:

1. Sign up at https://uptimerobot.com (free)
2. Add new monitor:
   - **URL**: `https://your-render-service.onrender.com/api/health`
   - **Interval**: 5 minutes
3. This pings your service every 5 minutes to keep it awake

---

## 🔄 Continuous Deployment

Both Render and Vercel support automatic deployments:

**Render:**
- Auto-deploys when you push to `main` branch
- Monitors your GitHub repository

**Vercel:**
- Auto-deploys when you push to `main` branch
- Creates preview deployments for pull requests

**To deploy updates:**
```bash
git add .
git commit -m "Your update message"
git push

# Both services auto-deploy! 🚀
```

---

## 🆘 Troubleshooting

### Problem: "Network Error" in frontend

**Solution:**
1. Check VITE_API_URL in Vercel environment variables
2. Verify Render backend is running
3. Test: `https://your-render-service.onrender.com/api/health`

### Problem: "CORS Error"

**Solution:**
1. Check CLIENT_URL in Render environment variables
2. Must match your Vercel URL exactly (no trailing slash)
3. Redeploy Render service after changing

### Problem: "Database connection failed"

**Solution:**
1. Verify DATABASE_URL in Render environment variables
2. Use **Internal Database URL** (not External)
3. Ensure migrations ran successfully

### Problem: "Slow first request"

**Solution:**
This is normal for Render free tier (cold start). Options:
1. Wait 30-60 seconds for first request
2. Use UptimeRobot to keep service awake
3. Upgrade to paid tier ($7/month)

### Problem: Build fails on Render

**Solution:**
1. Check build logs in Render dashboard
2. Verify build command: `npm install && npx prisma generate`
3. Verify start command: `npm start`
4. Check all environment variables are set

---

## 📊 Your Deployment URLs

Fill these in after deployment:

**Backend (Render):**
```
https://_____________________.onrender.com
```

**Frontend (Vercel):**
```
https://_____________________.vercel.app
```

**Database (Render):**
```
Render Dashboard → PostgreSQL → team-task-manager-db
```

---

## 💰 Cost Breakdown

### Render Free Tier
- **Web Service**: Free (with cold starts)
- **PostgreSQL**: Free (1GB storage, 90 days retention)
- **Bandwidth**: 100GB/month

### Vercel Free Tier
- **Hosting**: Free
- **Bandwidth**: 100GB/month
- **Deployments**: Unlimited

**Total Cost: $0/month** 🎉

### Upgrade Options (Optional)

**Render Starter Plan**: $7/month
- No cold starts
- Always-on service
- Better performance

**Render PostgreSQL**: $7/month
- 10GB storage
- Continuous backups
- Better performance

---

## 📚 Additional Resources

- **Render Docs**: https://render.com/docs
- **Render Node.js Guide**: https://render.com/docs/deploy-node-express-app
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Deployment**: https://www.prisma.io/docs/guides/deployment

---

## ✅ Deployment Checklist

### Before Deployment
- [x] Code committed to Git
- [x] Repository pushed to GitHub
- [ ] Render account created
- [ ] Vercel account created

### Render Setup
- [ ] PostgreSQL database created
- [ ] Database connection string obtained
- [ ] Web service created from GitHub
- [ ] Build and start commands configured
- [ ] Environment variables set
- [ ] Service deployed successfully
- [ ] Database migrations run
- [ ] Backend URL obtained
- [ ] API health check passed

### Vercel Setup
- [ ] Root directory set to "client"
- [ ] VITE_API_URL configured
- [ ] Deployment successful
- [ ] Frontend URL obtained

### Post-Deployment
- [ ] Backend CORS updated with frontend URL
- [ ] All features tested in production
- [ ] Signup/login works
- [ ] Projects and tasks work
- [ ] Performance verified

---

## 🎯 Quick Commands Reference

### Push to GitHub
```bash
git push origin main
```

### Run Migrations (Local)
```bash
$env:DATABASE_URL="your-render-database-url"
npx prisma migrate deploy
```

### Run Migrations (Render Shell)
```bash
npx prisma migrate deploy
```

### Seed Database
```bash
node prisma/seed.js
```

### Test Backend
```bash
curl https://your-service.onrender.com/api/health
```

---

**Your app is ready to deploy!** Follow the steps above and you'll be live in ~20 minutes! 🚀
