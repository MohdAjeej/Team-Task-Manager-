# ⚡ Quick Deploy: Render + Vercel

Your deployment setup:
- **Frontend** → Vercel ✅
- **Backend** → Render ✅

---

## 🚀 Step-by-Step (20 Minutes)

### 1️⃣ Create Render Database (5 min)

1. Go to https://render.com → Sign up with GitHub
2. Click **"New +"** → **"PostgreSQL"**
3. Name: `team-task-manager-db`
4. Plan: **Free**
5. Click **"Create Database"**
6. **Copy the "Internal Database URL"** (save it!)

---

### 2️⃣ Deploy Backend to Render (5 min)

1. In Render, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   ```
   Name: team-task-manager-api
   Runtime: Node
   Build Command: npm install && npx prisma generate
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variables:**
   ```
   DATABASE_URL = <your-render-database-url>
   JWT_SECRET = <random-32-character-string>
   NODE_ENV = production
   CLIENT_URL = *
   PORT = 10000
   ```

5. Click **"Create Web Service"**
6. Wait for deployment (~3 min)
7. **Copy your Render URL**: `https://your-service.onrender.com`

---

### 3️⃣ Run Database Migrations (2 min)

In Render service dashboard:
1. Click **"Shell"** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   ```
3. Optional - seed test users:
   ```bash
   node prisma/seed.js
   ```

---

### 4️⃣ Deploy Frontend to Vercel (5 min)

1. Update `client/.env.production`:
   ```env
   VITE_API_URL=https://your-service.onrender.com
   ```

2. Commit and push:
   ```bash
   git add client/.env.production
   git commit -m "Add Render backend URL"
   git push
   ```

3. Go to https://vercel.com
4. Click **"New Project"** → Import your repo
5. **IMPORTANT**: Set **Root Directory** to `client`
6. Add environment variable:
   ```
   VITE_API_URL = https://your-service.onrender.com
   ```
7. Click **"Deploy"**
8. **Copy your Vercel URL**: `https://your-app.vercel.app`

---

### 5️⃣ Update CORS (2 min)

1. Go back to Render → Your web service
2. **Environment** tab
3. Edit `CLIENT_URL`:
   ```
   CLIENT_URL = https://your-app.vercel.app
   ```
4. Save (auto-redeploys)

---

### 6️⃣ Test (1 min)

1. Visit: `https://your-app.vercel.app`
2. Sign up with test account
3. Create a project
4. Create a task
5. ✅ **Done!**

---

## 🔑 Environment Variables Summary

### Render (Backend)
```env
DATABASE_URL=postgresql://user:pass@dpg-xxx.render.com/dbname
JWT_SECRET=your-random-32-character-secret
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
PORT=10000
```

### Vercel (Frontend)
```env
VITE_API_URL=https://your-service.onrender.com
```

---

## ⚠️ Important: Render Free Tier

Render free tier **spins down after 15 minutes of inactivity**.

**First request after inactivity = 30-60 seconds delay (cold start)**

This is normal! Options:
1. Accept the delay (it's free!)
2. Use UptimeRobot to ping every 5 minutes
3. Upgrade to paid tier ($7/month) for always-on

---

## 🧪 Test Your Deployment

**Backend Health Check:**
```
https://your-service.onrender.com/api/health
```
Should return: `{"status":"ok","message":"Server is running"}`

**Frontend:**
```
https://your-app.vercel.app
```
Should load login page

---

## 🆘 Quick Fixes

### "Network Error" in frontend
→ Check VITE_API_URL in Vercel matches your Render URL

### "CORS Error"
→ Check CLIENT_URL in Render matches your Vercel URL exactly

### "Database connection failed"
→ Use **Internal Database URL** from Render (not External)

### "Slow first request"
→ Normal for Render free tier (cold start)

---

## 🔄 Deploy Updates

```bash
git add .
git commit -m "Your changes"
git push

# Both Render and Vercel auto-deploy! 🚀
```

---

## 📊 Your URLs

**Backend (Render):**
```
https://_____________________.onrender.com
```

**Frontend (Vercel):**
```
https://_____________________.vercel.app
```

---

## 💰 Cost

**Total: $0/month** (100% Free!) 🎉

- Render Web Service: Free
- Render PostgreSQL: Free (1GB)
- Vercel Hosting: Free

---

## 📚 Full Guide

For detailed instructions and troubleshooting, see:
- **RENDER_DEPLOYMENT.md** - Complete guide
- **VERCEL_FIX.md** - Vercel troubleshooting
- **FIX_NOW.md** - Quick Vercel fixes

---

**Ready?** Follow the 6 steps above and you'll be live in 20 minutes! 🚀
