# ⚡ Quick Deployment Guide

## 🚀 Deploy in 15 Minutes

### Step 1: Push to GitHub (2 min)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Setup Database (3 min)

**Option A: Supabase (Recommended - Free)**
1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database → Connection String → URI
4. Copy the connection string

**Option B: ElephantSQL (Free)**
1. Go to https://www.elephantsql.com
2. Create free instance
3. Copy the URL

**Option C: Neon (Free)**
1. Go to https://neon.tech
2. Create new project
3. Copy connection string

### Step 3: Deploy Backend to Netlify (5 min)

1. Go to https://netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm install && npx prisma generate`
   - **Publish directory**: `client/dist`
   - **Functions directory**: `netlify/functions`
5. Add Environment Variables (click "Show advanced" → "New variable"):
   ```
   DATABASE_URL=your-database-url-from-step-2
   JWT_SECRET=your-random-secret-32-chars-min
   NODE_ENV=production
   CLIENT_URL=https://your-app.vercel.app
   ```
6. Click "Deploy site"
7. After deployment, go to Site settings → Functions
8. Copy your Netlify URL: `https://your-app.netlify.app`

### Step 4: Run Database Migrations (2 min)

**Install Netlify CLI:**
```bash
npm install -g netlify-cli
netlify login
netlify link
```

**Run migrations:**
```bash
netlify env:set DATABASE_URL "your-database-url"
netlify build
npx prisma migrate deploy
```

Or manually connect to your database and run:
```sql
-- Your migrations will be in prisma/migrations folder
```

### Step 5: Deploy Frontend to Vercel (5 min)

1. Go to https://vercel.com
2. Click "New Project" → Import your GitHub repo
3. Configure:
   - **Root Directory**: `client`
   - **Framework**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-netlify-site.netlify.app`
5. Click "Deploy"
6. Copy your Vercel URL: `https://your-app.vercel.app`

### Step 6: Update CORS (2 min)

1. Go back to Netlify
2. Site settings → Environment variables
3. Update `CLIENT_URL` with your Vercel URL
4. Trigger redeploy

### Step 7: Test (1 min)

Visit your Vercel URL and test:
- ✅ Signup
- ✅ Login
- ✅ Create project
- ✅ Create task

## 🎉 Done!

Your app is live at:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.netlify.app

---

## 🔑 Important URLs

**Netlify Dashboard**: https://app.netlify.com
**Vercel Dashboard**: https://vercel.com/dashboard
**Supabase Dashboard**: https://app.supabase.com

**Netlify CLI**:
```bash
npm i -g netlify-cli
netlify login
netlify link
netlify dev  # Test locally
```

---

## 🆘 Quick Fixes

**Backend not working?**
```bash
netlify logs:function api
```

**Frontend not connecting?**
- Check VITE_API_URL in Vercel
- Check CLIENT_URL in Netlify
- Verify both URLs match

**Database issues?**
```bash
# Connect to your database directly
psql "your-database-url"

# Or use Prisma Studio
npx prisma studio
```

---

## 📝 Environment Variables

### Netlify (Backend)
```env
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=<generate-random-32-chars>
NODE_ENV=production
CLIENT_URL=https://your-app.vercel.app
```

### Vercel (Frontend)
```env
VITE_API_URL=https://your-netlify-site.netlify.app
```

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Database created (Supabase/ElephantSQL/Neon)
- [ ] Netlify site created
- [ ] Environment variables set in Netlify
- [ ] Netlify deployed successfully
- [ ] Database migrations run
- [ ] Netlify URL copied
- [ ] Vercel project created
- [ ] Root directory set to "client"
- [ ] VITE_API_URL set in Vercel
- [ ] Vercel URL copied
- [ ] CLIENT_URL updated in Netlify
- [ ] App tested in production

---

**Total Time**: ~15 minutes
**Cost**: $0/month (Free tier)
**Status**: Production-Ready ✅
