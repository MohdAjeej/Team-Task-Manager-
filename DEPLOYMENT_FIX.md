# 🔧 Deployment Fix Guide

## Error: Build Command Failed

If you're getting `Error: Command exited with 1`, follow these steps:

---

## For Netlify (Backend + Frontend Combined)

### Option 1: Deploy Everything on Netlify

**Step 1: Update netlify.toml**

The `netlify.toml` file has been updated with the correct build command.

**Step 2: Configure Netlify**

1. Go to https://app.netlify.com
2. Site settings → Build & deploy → Build settings
3. **Build command**: 
   ```
   npm install && npx prisma generate && cd client && npm install && npm run build
   ```
4. **Publish directory**: `client/dist`
5. **Functions directory**: `netlify/functions`

**Step 3: Add Environment Variables**

Site settings → Environment variables → Add:
```
DATABASE_URL=your-database-url
JWT_SECRET=your-secret-key
NODE_ENV=production
CLIENT_URL=https://your-site.netlify.app
```

**Step 4: Deploy**

Click "Trigger deploy" → "Deploy site"

---

## For Vercel (Frontend Only - Recommended)

### Deploy Frontend to Vercel, Backend to Netlify

**Netlify (Backend Only):**

1. **Update netlify.toml** to NOT build frontend:

```toml
[build]
  command = "npm install && npx prisma generate"
  functions = "netlify/functions"
  publish = "."

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

2. **Deploy to Netlify**

**Vercel (Frontend Only):**

1. Go to https://vercel.com
2. New Project → Import from GitHub
3. **Configure:**
   - **Root Directory**: `client`
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variable:**
   ```
   VITE_API_URL=https://your-netlify-site.netlify.app
   ```

5. **Deploy**

---

## Common Build Errors & Fixes

### Error 1: "Cannot find module"

**Fix:**
```bash
# Ensure all dependencies are installed
cd client
npm install
cd ..
npm install
```

### Error 2: "Prisma Client not generated"

**Fix:**
Add to build command:
```bash
npx prisma generate
```

### Error 3: "Environment variable not found"

**Fix:**
- Ensure all environment variables are set in Netlify/Vercel dashboard
- Check variable names match exactly (case-sensitive)

### Error 4: "Build timeout"

**Fix:**
- Increase build timeout in Netlify settings
- Or split deployment (backend on Netlify, frontend on Vercel)

---

## Recommended Deployment Strategy

### Strategy 1: Separate Deployments (Recommended)

**Backend (Netlify):**
- Deploy serverless functions only
- No frontend build
- Faster deployments

**Frontend (Vercel):**
- Deploy React app only
- Optimized for static sites
- Better performance

### Strategy 2: Combined Deployment

**Everything on Netlify:**
- Single deployment
- Simpler setup
- Longer build times

---

## Step-by-Step: Separate Deployment

### Part 1: Backend on Netlify

1. **Create `netlify-backend.toml`:**

```toml
[build]
  command = "npm install && npx prisma generate"
  functions = "netlify/functions"
  publish = "."

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

2. **Rename to `netlify.toml`**

3. **Deploy to Netlify:**
   - Import from GitHub
   - Use settings from netlify.toml
   - Add environment variables
   - Deploy

4. **Get Backend URL:**
   - Copy: `https://your-backend.netlify.app`

### Part 2: Frontend on Vercel

1. **Update `client/.env.production`:**
```env
VITE_API_URL=https://your-backend.netlify.app
```

2. **Commit and push:**
```bash
git add .
git commit -m "Update backend URL"
git push
```

3. **Deploy to Vercel:**
   - Import from GitHub
   - Root directory: `client`
   - Framework: Vite
   - Add VITE_API_URL environment variable
   - Deploy

4. **Update Backend CORS:**
   - Go to Netlify
   - Update CLIENT_URL: `https://your-app.vercel.app`
   - Redeploy

---

## Quick Fix Commands

### Test Build Locally

```bash
# Test backend
npm install
npx prisma generate

# Test frontend
cd client
npm install
npm run build
cd ..
```

### Check for Errors

```bash
# Check Node version
node --version  # Should be 18+

# Check npm version
npm --version

# Check dependencies
npm list
cd client && npm list
```

### Clean Install

```bash
# Remove node_modules
rm -rf node_modules client/node_modules

# Remove lock files
rm package-lock.json client/package-lock.json

# Reinstall
npm install
cd client && npm install
```

---

## Environment Variables Checklist

### Netlify
- [ ] DATABASE_URL
- [ ] JWT_SECRET
- [ ] NODE_ENV=production
- [ ] CLIENT_URL

### Vercel
- [ ] VITE_API_URL

---

## Deployment Checklist

### Before Deployment
- [ ] All code committed
- [ ] Dependencies installed locally
- [ ] Build works locally (`npm run build`)
- [ ] Environment variables documented

### Netlify Setup
- [ ] netlify.toml configured
- [ ] Build command correct
- [ ] Functions directory set
- [ ] Environment variables added
- [ ] Node version set to 18

### Vercel Setup
- [ ] Root directory set to `client`
- [ ] Framework preset: Vite
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] VITE_API_URL added

---

## Still Having Issues?

### Check Netlify Logs

1. Go to Netlify dashboard
2. Click on failed deployment
3. View deploy log
4. Look for specific error message

### Check Vercel Logs

1. Go to Vercel dashboard
2. Click on deployment
3. View build logs
4. Look for specific error

### Common Log Errors

**"ENOENT: no such file or directory"**
- File path is wrong
- Check build command paths

**"Module not found"**
- Dependency not installed
- Run `npm install` locally first

**"Command not found"**
- Build command syntax error
- Check netlify.toml or Vercel settings

---

## Contact Support

If still stuck:
- Netlify Support: https://answers.netlify.com
- Vercel Support: https://vercel.com/support
- Share your build logs for faster help

---

## ✅ Success Indicators

Your deployment is successful when:
- ✅ Build completes without errors
- ✅ Site is published
- ✅ API health check works: `/api/health`
- ✅ Frontend loads
- ✅ Can signup/login
- ✅ Can create projects and tasks

---

**Good luck!** 🚀
