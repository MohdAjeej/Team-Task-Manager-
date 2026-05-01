# 🔥 VERCEL BUILD FIX - "vite: command not found"

## ❌ THE PROBLEM
Your Vercel build shows:
```
added 33 packages, and audited 34 packages in 3s
sh: line 1: vite: command not found
```

**Root Cause**: Vercel is installing from the **root directory** (34 packages = backend) instead of the **client directory** (153 packages = frontend with vite).

---

## ✅ THE SOLUTION (2 STEPS)

### 🔧 STEP 1: Set Root Directory in Vercel Dashboard (CRITICAL - MUST DO MANUALLY)

**This CANNOT be automated via code or vercel.json. You MUST do this manually:**

1. Go to: https://vercel.com/dashboard
2. Click your project: `Team-Task-Manager`
3. Click **Settings** tab
4. Click **General** in left sidebar
5. Scroll to **Root Directory** section
6. Click **Edit** button
7. Type: `client` (exactly, no slashes)
8. Click **Save**
9. Go to **Deployments** tab
10. Click the **⋮** (three dots) on latest deployment
11. Click **Redeploy** → Select **"Use existing Build Cache"** OFF → Click **Redeploy**

**Why this is required:**
- Vercel needs to know to build from the `client` folder
- Without this, it installs root `package.json` (34 packages - backend only)
- With this, it installs `client/package.json` (153 packages - frontend with vite)

---

### 🔧 STEP 2: Commit and Push Fixed API URL

I've already fixed your `.env.production` file. Now commit and push:

```bash
git add client/.env.production
git commit -m "fix: correct VITE_API_URL in production"
git push
```

**What was wrong:**
- ❌ Old: `VITE_API_URL=https://team-task-manager-vr2k.onrender.com/api/auth/signup`
- ✅ New: `VITE_API_URL=https://team-task-manager-vr2k.onrender.com`

The API URL should be the **base URL only**. Your React code adds the specific endpoints like `/api/auth/signup`.

---

## 🎯 VERIFICATION

After Step 1 (setting Root Directory), your next Vercel build should show:

```
✅ added 153 packages (not 33)
✅ vite build succeeds
✅ Build completed
```

---

## 📋 CURRENT CONFIGURATION STATUS

✅ **Backend (Render)**: Working perfectly
- URL: https://team-task-manager-vr2k.onrender.com
- Status: Running ✅
- Database: Connected ✅
- Migrations: Auto-run on startup ✅

✅ **Frontend Files**: All correct
- `client/package.json`: Has vite in devDependencies ✅
- `client/vercel.json`: Correct routing config ✅
- `client/.env.production`: Fixed API URL ✅

❌ **Vercel Settings**: Needs manual fix
- Root Directory: Currently empty → Must set to `client`

---

## 🚀 AFTER SUCCESSFUL DEPLOYMENT

Once Vercel deploys successfully:

1. **Get your Vercel URL** (e.g., `https://your-app.vercel.app`)

2. **Update Render Backend**:
   - Go to: https://dashboard.render.com
   - Click your service
   - Go to **Environment** tab
   - Find or add: `CLIENT_URL`
   - Set to: `https://your-app.vercel.app` (no trailing slash)
   - Click **Save** (auto-redeploys)

3. **Test Full Stack**:
   - Open your Vercel URL
   - Try Sign Up → Create account
   - Try Login → Login with credentials
   - Create a project
   - Add tasks
   - Add team members

---

## 💡 WHY VERCEL.JSON DOESN'T WORK

Many guides suggest adding `vercel.json` in root with:
```json
{
  "builds": [{ "src": "client/package.json", ... }]
}
```

**This doesn't work reliably** because:
- Vercel's build system prioritizes Dashboard settings over vercel.json
- The Root Directory setting is the authoritative source
- Having conflicting configs causes unpredictable behavior

**The correct approach**: Set Root Directory in Dashboard, keep `vercel.json` only in `client/` folder.

---

## 🆘 IF STILL FAILING

If after setting Root Directory to `client` it still fails:

1. **Clear all caches**:
   - Deployments → ⋮ → Redeploy → Uncheck "Use existing Build Cache"

2. **Check build logs show**:
   ```
   Running "install" command: `npm install`...
   added 153 packages  ← Should be 153, not 33
   ```

3. **Verify Root Directory saved**:
   - Settings → General → Root Directory should show: `client`

4. **Try re-importing project**:
   - Delete project from Vercel
   - Add New → Import from GitHub
   - During import, set Root Directory to `client`

---

## 📞 NEED HELP?

If you see any errors after following these steps, share:
1. Screenshot of Vercel Settings → General → Root Directory
2. Full build log from Vercel
3. Any browser console errors (F12 → Console tab)
