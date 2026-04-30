# ⚡ Quick Deployment Guide

## 🚀 Deploy in 15 Minutes

### Step 1: Push to GitHub (2 min)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy Backend to Railway (5 min)

1. Go to https://railway.app
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Click "New" → "Database" → "PostgreSQL"
5. Click on your service → "Variables" → Add:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-random-secret-32-chars-min
   NODE_ENV=production
   CLIENT_URL=https://your-app.vercel.app
   ```
6. Run migrations:
   ```bash
   railway login
   railway link
   railway run npx prisma migrate deploy
   ```
7. Copy your Railway URL: `https://xxx.up.railway.app`

### Step 3: Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com
2. Click "New Project" → Import your GitHub repo
3. Configure:
   - **Root Directory**: `client`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-railway-url.up.railway.app`
5. Click "Deploy"
6. Copy your Vercel URL: `https://your-app.vercel.app`

### Step 4: Update CORS (2 min)

1. Go back to Railway
2. Update `CLIENT_URL` variable with your Vercel URL
3. Redeploy

### Step 5: Test (1 min)

Visit your Vercel URL and test:
- ✅ Signup
- ✅ Login
- ✅ Create project
- ✅ Create task

## 🎉 Done!

Your app is live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-railway-url.up.railway.app

---

## 🔑 Important URLs

**Railway Dashboard**: https://railway.app/dashboard
**Vercel Dashboard**: https://vercel.com/dashboard

**Railway CLI**:
```bash
npm i -g @railway/cli
railway login
railway link
railway run npx prisma migrate deploy
```

---

## 🆘 Quick Fixes

**Backend not working?**
```bash
railway logs
```

**Frontend not connecting?**
- Check VITE_API_URL in Vercel
- Check CLIENT_URL in Railway
- Verify both URLs match

**Database issues?**
```bash
railway run npx prisma migrate deploy
railway run npx prisma generate
```

---

## 📝 Environment Variables

### Railway (Backend)
```env
DATABASE_URL=${{Postgres.DATABASE_URL}}
JWT_SECRET=<generate-random-32-chars>
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

### Vercel (Frontend)
```env
VITE_API_URL=https://your-railway-backend.up.railway.app
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Railway project created
- [ ] PostgreSQL added to Railway
- [ ] Environment variables set in Railway
- [ ] Migrations run on Railway
- [ ] Railway URL copied
- [ ] Vercel project created
- [ ] Root directory set to "client"
- [ ] VITE_API_URL set in Vercel
- [ ] Vercel URL copied
- [ ] CLIENT_URL updated in Railway
- [ ] App tested in production

---

**Total Time**: ~15 minutes
**Cost**: $0-5/month
**Status**: Production-Ready ✅
