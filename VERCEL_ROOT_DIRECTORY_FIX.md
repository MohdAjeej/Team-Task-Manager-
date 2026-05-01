# 🔧 Vercel Root Directory Fix - MUST DO THIS!

## ❌ The Problem

Vercel is installing dependencies from the **root** directory instead of the **client** directory.

This is why you see:
```
removed 126 packages, and audited 34 packages
sh: line 1: vite: command not found
```

Vercel installed root dependencies (backend), not client dependencies (frontend)!

---

## ✅ The ONLY Solution

You **MUST** set the Root Directory in Vercel Dashboard. There's no way around this.

---

## 🔧 Step-by-Step Fix (5 Minutes)

### Option 1: Update Existing Project (Recommended)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Click on your project** (Team-Task-Manager)

3. **Go to Settings** (top navigation bar)

4. **Click "General"** (left sidebar)

5. **Scroll down to "Root Directory"** section

6. **Click "Edit"** button

7. **Enter**: `client`

8. **Click "Save"**

9. **Go to "Deployments"** tab (top navigation)

10. **Click "..."** (three dots) on the latest deployment

11. **Click "Redeploy"**

12. **Wait ~2-3 minutes**

13. **Done!** ✅

---

### Option 2: Delete and Recreate (If Option 1 Doesn't Work)

1. **Delete the current project**:
   - Vercel Dashboard → Your Project → Settings → General
   - Scroll to bottom → "Delete Project"
   - Type project name to confirm
   - Delete

2. **Create new project**:
   - Go to https://vercel.com/new
   - Click "Import" next to your GitHub repository
   - **BEFORE clicking Deploy**, configure these:

3. **Configure Project**:
   - **Framework Preset**: Vite (auto-detected)
   - **Root Directory**: Click "Edit" → Enter `client` ← **CRITICAL!**
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
   - **Install Command**: `npm install` (auto-detected)

4. **Add Environment Variable**:
   - Click "Environment Variables" dropdown
   - Add:
     - **Key**: `VITE_API_URL`
     - **Value**: `https://team-task-manager-vr2k.onrender.com`

5. **Click "Deploy"**

6. **Wait ~2-3 minutes**

7. **Done!** ✅

---

## 🧪 What You Should See After Fix

### Correct Build Logs:

```
✓ Cloning completed
✓ Running "install" command: `npm install`...
✓ added 152 packages, and audited 153 packages
✓ Running "build" command: `npm run build`...
✓ vite v5.0.8 building for production...
✓ transforming...
✓ ✓ 50 modules transformed.
✓ rendering chunks...
✓ computing gzip size...
✓ dist/index.html                  0.46 kB │ gzip: 0.30 kB
✓ dist/assets/index-abc123.css    12.34 kB │ gzip: 3.21 kB
✓ dist/assets/index-xyz789.js    156.78 kB │ gzip: 51.23 kB
✓ ✓ built in 15.23s
✓ Build Completed in 18s
✓ Deployment Complete
```

---

## 📋 Correct Vercel Configuration

### In Vercel Dashboard Settings:

```
Root Directory: client          ← MUST BE SET!
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install

Environment Variables:
VITE_API_URL = https://team-task-manager-vr2k.onrender.com
```

---

## 🆘 Why vercel.json Didn't Work

The `vercel.json` approach doesn't work because:
1. Vercel still runs install from root first
2. This installs backend dependencies
3. Then tries to build, but vite isn't installed
4. Build fails

**The ONLY way** is to set Root Directory in the dashboard!

---

## ✅ After Successful Deployment

### 1. Get Your Vercel URL

Your app will be at:
```
https://team-task-manager-[random].vercel.app
```

Or whatever custom domain you set.

### 2. Update Render CORS

1. Go to Render Dashboard → Your Service → Environment
2. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://your-app.vercel.app
   ```
3. Save (auto-redeploys)

### 3. Test Your App

1. Visit your Vercel URL
2. Click "Sign Up"
3. Fill in details
4. Should work! ✅

---

## 🎯 Quick Checklist

- [ ] Go to Vercel Dashboard
- [ ] Settings → General → Root Directory
- [ ] Edit → Enter `client` → Save
- [ ] Deployments → Redeploy
- [ ] Wait for build to complete
- [ ] Check build logs show "vite building"
- [ ] Visit your app URL
- [ ] Test signup
- [ ] Update Render CLIENT_URL
- [ ] ✅ Done!

---

## 💡 Why This is Required

Your project structure:
```
Team-Task-Manager/
├── client/              ← React app (frontend)
│   ├── package.json     ← Has vite, react, etc.
│   ├── src/
│   └── vite.config.js
├── server/              ← Express app (backend)
├── package.json         ← Backend dependencies only
└── ...
```

Vercel needs to know:
- Install from `client/package.json` (not root)
- Build from `client/` directory
- Output is in `client/dist`

**Setting Root Directory to `client` tells Vercel all of this!**

---

## 🔍 How to Verify It's Set Correctly

After setting Root Directory:

1. Go to Settings → General
2. Look for "Root Directory" section
3. Should show: `client`
4. If it shows blank or something else, it's not set correctly

---

## ⚠️ Important Notes

- **You cannot skip this step!**
- **vercel.json cannot replace this!**
- **You must set it in the dashboard!**
- **This is a Vercel requirement for monorepo projects!**

---

## 🎉 After This Works

Your full-stack app will be live:

- ✅ Backend on Render: `https://team-task-manager-vr2k.onrender.com`
- ✅ Frontend on Vercel: `https://your-app.vercel.app`
- ✅ Database on Render: PostgreSQL
- ✅ All features working!

---

**Go set the Root Directory to `client` in Vercel NOW!** This is the ONLY way to fix this error! 🚀
