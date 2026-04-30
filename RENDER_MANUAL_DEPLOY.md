# 🔄 Trigger Manual Deploy on Render

## ❌ The Issue

Render is deploying an **old commit** (869b18b) that doesn't have the migrations.

The **latest commit** (3bfe8ad) has the migrations, but Render hasn't picked it up yet.

---

## ✅ Solution: Trigger Manual Deploy

### Step 1: Go to Render Dashboard

1. Open https://dashboard.render.com
2. Click on your web service: **team-task-manager-api** (or whatever you named it)

### Step 2: Trigger Manual Deploy

1. Look for **"Manual Deploy"** button (top right corner)
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**
4. Click **"Deploy"**

**OR**

1. Go to **"Settings"** tab
2. Scroll down to **"Build & Deploy"**
3. Click **"Clear build cache"** (optional, but recommended)
4. Go back to main page
5. Click **"Manual Deploy"** → **"Deploy latest commit"**

---

## 🔍 What Should Happen

Render will:

1. ✅ Clone from GitHub
2. ✅ Checkout commit **3bfe8ad** (or later)
3. ✅ Find `prisma/schema.prisma`
4. ✅ Find `prisma/migrations/` folder
5. ✅ Run `npm install`
6. ✅ Run `npx prisma generate` successfully
7. ✅ Build completes
8. ✅ Service starts

---

## 🧪 Verify in Build Logs

Watch the build logs. You should see:

```
==> Checking out commit 3bfe8ad... (or later)
==> Running build command 'npm install && npx prisma generate'...
added 153 packages, and audited 154 packages in 5s
✔ Generated Prisma Client (5.7.1) in 1.2s
==> Build successful 🎉
==> Starting service with 'npm start'
🚀 Server running on port 10000
```

**Key indicator:** The commit hash should be **3bfe8ad** or later, NOT 869b18b

---

## 🆘 If Still Failing

### Option 1: Check GitHub Connection

1. Render Dashboard → Your Service → **Settings**
2. Scroll to **"Source Repo"**
3. Verify it's connected to the correct repository
4. Click **"Reconnect"** if needed

### Option 2: Clear Build Cache

1. Settings → Build & Deploy
2. Click **"Clear build cache"**
3. Trigger manual deploy again

### Option 3: Check Branch

1. Settings → Build & Deploy
2. Verify **Branch** is set to `main`
3. If it's set to something else, change it to `main`
4. Save and redeploy

### Option 4: Verify Files on GitHub

1. Go to your GitHub repository
2. Navigate to `prisma/` folder
3. Verify you see:
   - `schema.prisma` ✅
   - `migrations/` folder ✅
   - `migrations/20260430185602_init/migration.sql` ✅
   - `migrations/migration_lock.toml` ✅

If files are missing on GitHub, push again:
```bash
git push origin main --force
```

---

## 📋 Deployment Checklist

- [x] Migrations committed to git
- [x] Pushed to GitHub
- [ ] Trigger manual deploy on Render
- [ ] Verify correct commit is being deployed
- [ ] Build succeeds
- [ ] Service starts
- [ ] Run migrations in Shell

---

## 🔄 After Successful Build

Once the build succeeds:

### 1. Run Migrations

1. Click **"Shell"** tab in Render
2. Run:
   ```bash
   npx prisma migrate deploy
   ```

### 2. Optional: Seed Test Data

```bash
node prisma/seed.js
```

### 3. Test Health Endpoint

Visit: `https://your-service.onrender.com/api/health`

Should return:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 🎯 Quick Steps

1. **Go to Render Dashboard**
2. **Click your service**
3. **Click "Manual Deploy"** (top right)
4. **Select "Deploy latest commit"**
5. **Wait for build** (~3-5 minutes)
6. **Run migrations in Shell**
7. **Test health endpoint**
8. **Done!** ✅

---

## 💡 Pro Tip: Auto-Deploy

To enable automatic deployments:

1. Settings → Build & Deploy
2. Find **"Auto-Deploy"**
3. Make sure it's set to **"Yes"**
4. Branch: `main`

This way, every time you push to GitHub, Render will automatically deploy!

---

## 🔍 How to Check Current Commit

In Render dashboard:

1. Go to **"Events"** tab
2. Look at the latest deployment
3. You'll see the commit hash
4. It should be **3bfe8ad** or later

**OR**

Look at the build logs:
```
==> Checking out commit 3bfe8ad...
```

---

## ✅ Success Indicators

Your deployment is successful when:

- ✅ Build logs show commit **3bfe8ad** or later
- ✅ Build completes without errors
- ✅ Service status shows **"Live"**
- ✅ Logs show "Server running on port 10000"
- ✅ Health endpoint returns 200 OK
- ✅ Migrations run successfully

---

**Go trigger that manual deploy now!** 🚀

Just click "Manual Deploy" → "Deploy latest commit" in Render dashboard!
