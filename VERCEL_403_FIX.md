# 🔧 Vercel 403 Forbidden Error - FIXED!

## ✅ What I Fixed

Removed the root `vercel.json` file that was causing conflicts.

**The issue:** Having `vercel.json` in both root and client folders caused Vercel to get confused about routing.

**The solution:** Keep only `client/vercel.json` and set Root Directory to `client` in Vercel settings.

---

## 🔄 What Happens Now

Vercel will auto-deploy with the fix (~2-3 minutes).

---

## ⚙️ CRITICAL: Set Root Directory in Vercel

You **MUST** set the Root Directory in Vercel Dashboard:

### Step-by-Step:

1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **Settings** → **General**
4. Find **"Root Directory"**
5. Click **"Edit"**
6. Enter: `client`
7. Click **"Save"**
8. Go to **Deployments** → Click **"..."** → **"Redeploy"**

---

## 🧪 What You Should See After Fix

### Successful Deployment:

```
✓ Build Completed
✓ Deployment Complete
✓ Status: Ready
```

### Your App:

Visit your Vercel URL - should load the login page! ✅

---

## 📋 Correct Configuration

### In Vercel Dashboard Settings:

```
Root Directory: client
Build Command: npm run build
Output Directory: dist
Install Command: npm install

Environment Variables:
VITE_API_URL = https://team-task-manager-vr2k.onrender.com
```

### In client/vercel.json:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## 🆘 If Still Getting 403

### Option 1: Clear Cache and Redeploy

1. Deployments → Latest → "..." → Redeploy
2. **Check "Clear build cache"**
3. Redeploy

### Option 2: Check Environment Variables

1. Settings → Environment Variables
2. Verify `VITE_API_URL` is set correctly
3. Should be: `https://team-task-manager-vr2k.onrender.com`

### Option 3: Delete and Recreate Project

If nothing works:

1. **Delete project** in Vercel
2. Go to https://vercel.com/new
3. **Import** your GitHub repository
4. **BEFORE deploying**, set:
   - **Root Directory**: `client`
   - **Environment Variable**: `VITE_API_URL` = your Render URL
5. **Deploy**

---

## 🔍 Why 403 Happened

### The Problem:

```
Root/
├── vercel.json          ← Was causing conflict
└── client/
    ├── vercel.json      ← Correct one
    └── ...
```

Vercel tried to use both configs and got confused about routing!

### The Solution:

```
Root/
└── client/
    ├── vercel.json      ← Only this one
    └── ...
```

Plus setting Root Directory to `client` in Vercel settings.

---

## ✅ After This Works

### 1. Test Your App

Visit your Vercel URL - should see login page!

### 2. Update Render CORS

1. Render Dashboard → Your Service → Environment
2. Update `CLIENT_URL` to your Vercel URL
3. Save

### 3. Test Full Functionality

1. Sign up
2. Login
3. Create project
4. Create task
5. ✅ Everything works!

---

## 📊 Deployment Status

- [x] Root vercel.json removed
- [x] Code pushed to GitHub
- [ ] Vercel auto-deploys
- [ ] Set Root Directory to `client`
- [ ] Redeploy with clear cache
- [ ] Test app loads
- [ ] Update Render CLIENT_URL
- [ ] Test full functionality
- [ ] ✅ Done!

---

## 🎯 Quick Checklist

- [ ] Wait for Vercel to auto-deploy (~2-3 min)
- [ ] Go to Vercel Settings → General
- [ ] Set Root Directory to `client`
- [ ] Save
- [ ] Redeploy with clear cache
- [ ] Visit your Vercel URL
- [ ] Should see login page! ✅

---

## 💡 Key Points

1. **Only one vercel.json** - In client folder only
2. **Root Directory must be set** - To `client` in Vercel settings
3. **Clear cache** - When redeploying
4. **Environment variables** - VITE_API_URL must be set

---

## 🔗 After Successful Deployment

Your full-stack app will be:

- ✅ **Backend**: https://team-task-manager-vr2k.onrender.com
- ✅ **Frontend**: https://your-app.vercel.app
- ✅ **Connected and working!**

---

**The fix is pushed!** Wait for Vercel to deploy, set Root Directory to `client`, and redeploy! 🚀
