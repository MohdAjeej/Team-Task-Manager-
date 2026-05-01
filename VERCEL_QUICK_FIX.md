# ⚡ QUICK FIX - Vercel "vite: command not found"

## 🎯 THE ONE THING YOU MUST DO

**Go to Vercel Dashboard and set Root Directory to `client`**

This is the ONLY way to fix the error. It cannot be done via code.

---

## 📋 EXACT STEPS (2 MINUTES)

### 1️⃣ Open Vercel Dashboard
Go to: https://vercel.com/dashboard

### 2️⃣ Navigate to Settings
- Click your project: **Team-Task-Manager**
- Click **Settings** tab (top)
- Click **General** (left sidebar)

### 3️⃣ Set Root Directory
- Scroll down to **Root Directory** section
- Click **Edit** button
- Type: `client`
- Click **Save**

### 4️⃣ Redeploy with Clear Cache
- Click **Deployments** tab (top)
- Find latest deployment
- Click **⋮** (three dots)
- Click **Redeploy**
- **UNCHECK** "Use existing Build Cache"
- Click **Redeploy** button

---

## ✅ WHAT THIS FIXES

**Before (Wrong):**
```
Root Directory: (empty)
→ Vercel installs from root folder
→ Installs 34 packages (backend)
→ vite not found ❌
```

**After (Correct):**
```
Root Directory: client
→ Vercel installs from client folder
→ Installs 153 packages (frontend with vite)
→ Build succeeds ✅
```

---

## 🔍 HOW TO VERIFY IT WORKED

After redeploying, check the build log:

**Look for this line:**
```
added 153 packages, and audited 154 packages
```

**NOT this:**
```
added 33 packages, and audited 34 packages  ← Wrong!
```

If you see 153 packages, the build will succeed! 🎉

---

## 📱 VISUAL GUIDE

```
Vercel Dashboard
├── Your Project (Team-Task-Manager)
│   ├── Settings
│   │   ├── General
│   │   │   └── Root Directory: [Edit] → Type "client" → [Save]
│   │   
│   └── Deployments
│       └── Latest → ⋮ → Redeploy (clear cache)
```

---

## 🚀 AFTER SUCCESS

Once deployed, your app will be live at:
`https://your-app.vercel.app`

Then update your backend:
1. Go to Render Dashboard
2. Environment tab
3. Add `CLIENT_URL` = `https://your-app.vercel.app`
4. Save (auto-redeploys)

Done! 🎉
