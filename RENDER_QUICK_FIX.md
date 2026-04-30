# ⚡ Quick Fix: Render "Cannot find module" Error

## ✅ Fixed!

I've added a root `index.js` file that redirects to your server. Now you need to update your Render configuration.

---

## 🔧 Fix in Render Dashboard (2 Minutes)

### Step 1: Go to Render Settings

1. Open https://dashboard.render.com
2. Click on your web service
3. Click **"Settings"** (left sidebar)

### Step 2: Update Start Command

1. Scroll to **"Build & Deploy"** section
2. Find **"Start Command"**
3. Click **"Edit"**
4. Change to: `npm start`
5. Click **"Save Changes"**

### Step 3: Redeploy

Render will automatically redeploy with the new settings.

**OR** manually trigger:
1. Go to **"Manual Deploy"** (top right)
2. Click **"Deploy latest commit"**

---

## ✅ Correct Render Configuration

Make sure these are set:

```
Build Command: npm install && npx prisma generate
Start Command: npm start

Environment Variables:
  DATABASE_URL = <your-render-postgres-internal-url>
  JWT_SECRET = <random-32-character-string>
  NODE_ENV = production
  CLIENT_URL = https://your-app.vercel.app
  PORT = 10000
```

---

## 🧪 Test After Fix

**Check Render Logs:**
You should see:
```
🚀 Server running on port 10000
```

**Test Health Endpoint:**
```
https://your-service.onrender.com/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 🆘 If Still Not Working

### Try These Start Commands (in order):

1. `npm start` (recommended)
2. `node server/index.js`
3. `node index.js`

Update in Render Settings → Build & Deploy → Start Command

---

## 📋 Quick Checklist

- [ ] Root `index.js` file exists (✅ created)
- [ ] Code pushed to GitHub (✅ done)
- [ ] Render start command set to `npm start`
- [ ] Render build command includes `npx prisma generate`
- [ ] All environment variables set
- [ ] Service redeployed
- [ ] Health endpoint works
- [ ] Database migrations run

---

## 🔄 Run Database Migrations

After service is running, run migrations:

1. In Render dashboard, click **"Shell"** tab
2. Run:
   ```bash
   npx prisma migrate deploy
   ```
3. Optional - seed test users:
   ```bash
   node prisma/seed.js
   ```

---

## ✨ After Fix

Your Render service will be live at:
```
https://your-service.onrender.com
```

Update this URL in Vercel:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_URL` to your Render URL
3. Redeploy Vercel

---

## 📚 More Help

- **RENDER_FIX.md** - Detailed troubleshooting
- **DEPLOY_RENDER_VERCEL.md** - Complete deployment guide
- **RENDER_DEPLOYMENT.md** - Full Render documentation

---

**That's it!** Just update the start command in Render and you're good to go! 🚀
