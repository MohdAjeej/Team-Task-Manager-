# 🔧 Vercel Deployment Fix

## ❌ The Error

```
sh: line 1: cd: client: No such file or directory
Error: Command "cd client && npm install && npm run build" exited with 1
```

## ✅ The Problem

Vercel is trying to build from the root directory, but your React app is in the `client` folder. You need to tell Vercel to use `client` as the root directory.

---

## 🔧 Fix: Configure Root Directory in Vercel

### Option 1: Update Existing Deployment (Recommended)

1. **Go to your Vercel project**: https://vercel.com/dashboard
2. **Click on your project** (Team-Task-Manager)
3. **Go to Settings** (top navigation)
4. **Click "General"** in the left sidebar
5. **Scroll down to "Root Directory"**
6. **Click "Edit"**
7. **Enter**: `client`
8. **Click "Save"**
9. **Go to "Deployments"** tab
10. **Click the "..." menu** on the latest deployment
11. **Click "Redeploy"**

### Option 2: Delete and Redeploy (If Option 1 Doesn't Work)

1. **Delete the current project** in Vercel dashboard
2. **Create a new project**:
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - **IMPORTANT**: Click "Edit" next to "Root Directory"
   - Enter: `client`
   - Framework Preset: Vite (auto-detected)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `dist` (auto-detected)
   - Install Command: `npm install` (auto-detected)
3. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-netlify-backend.netlify.app`
4. **Click "Deploy"**

---

## 📋 Correct Vercel Configuration

When setting up Vercel, use these settings:

```
Framework Preset: Vite
Root Directory: client          ← IMPORTANT!
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

**Environment Variables:**
```
VITE_API_URL=https://your-netlify-backend.netlify.app
```

---

## ✅ How to Verify It's Fixed

After redeploying, you should see in the build logs:

```
✓ Running "install" command: `npm install`...
✓ added 152 packages
✓ Running "build" command: `npm run build`...
✓ vite v5.0.8 building for production...
✓ Build Completed
```

Then visit your Vercel URL and you should see your app! 🎉

---

## 🆘 Still Getting Errors?

### Error: "VITE_API_URL is not defined"

**Fix:**
1. Go to Vercel → Settings → Environment Variables
2. Add: `VITE_API_URL` = `https://your-netlify-backend.netlify.app`
3. Redeploy

### Error: "Failed to fetch" or "Network Error"

**Fix:**
1. Verify your Netlify backend is deployed and working
2. Test: `https://your-netlify-backend.netlify.app/api/health`
3. Should return: `{"status":"ok","message":"Server is running"}`
4. If backend works, check VITE_API_URL is correct in Vercel

### Error: "404 Not Found" on page refresh

**Fix:**
This should be handled by `client/vercel.json`. If still happening:
1. Verify `client/vercel.json` exists
2. Redeploy

---

## 📸 Visual Guide

### Step 1: Go to Settings
```
Vercel Dashboard → Your Project → Settings
```

### Step 2: Edit Root Directory
```
General → Root Directory → Edit → Enter "client" → Save
```

### Step 3: Redeploy
```
Deployments → Latest Deployment → ... → Redeploy
```

---

## ✨ After Fix

Your deployment should succeed and you'll have:

**Frontend URL**: `https://your-app.vercel.app`

Test it:
- ✅ Login page loads
- ✅ Can sign up
- ✅ Can create projects
- ✅ Can create tasks

---

## 🔄 Alternative: Deploy from Client Folder Only

If you want to deploy ONLY the client folder as a separate repository:

1. **Create a new GitHub repository** for just the frontend
2. **Copy the client folder** contents to the new repo
3. **Deploy to Vercel** from the new repo (no root directory needed)

But the recommended approach is to keep everything in one repo and just set the root directory to `client`.

---

## 💡 Why This Happens

Your project structure is:
```
Team-Task-Manager/
├── client/          ← React app is here
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── server/          ← Backend is here
├── package.json     ← Root package.json (for backend)
└── netlify.toml
```

Vercel needs to know to build from the `client` folder, not the root!

---

## ✅ Quick Fix Summary

1. **Vercel Dashboard** → Your Project → **Settings**
2. **General** → **Root Directory** → **Edit** → Enter `client` → **Save**
3. **Deployments** → **Redeploy**
4. **Done!** ✨

---

**That's it!** Your Vercel deployment should now work perfectly! 🚀
