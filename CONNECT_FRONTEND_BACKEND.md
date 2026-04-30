# 🔗 Connect Frontend to Backend

Your React app is already configured correctly! You just need to set the backend URL.

---

## ✅ Your React Code is Correct

Your `client/src/context/AuthContext.jsx` already has:

```javascript
const API_URL = import.meta.env.VITE_API_URL || '';

// Configure axios base URL
if (API_URL) {
  axios.defaults.baseURL = API_URL;
}
```

This is perfect! ✅

---

## 🔧 What You Need to Do

### Option 1: Update .env.production File (Recommended)

1. **Get your Render URL**
   - Go to https://dashboard.render.com
   - Click on your web service
   - Copy the URL (e.g., `https://team-task-manager-api.onrender.com`)

2. **Update `client/.env.production`**
   ```env
   VITE_API_URL=https://your-actual-render-url.onrender.com
   ```
   Replace with your actual Render URL!

3. **Commit and push**
   ```bash
   git add client/.env.production
   git commit -m "Update backend URL for production"
   git push
   ```

4. **Vercel will auto-deploy** with the new URL!

### Option 2: Set in Vercel Dashboard (Alternative)

If you prefer to set it in Vercel instead of committing the file:

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add or update:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-render-service.onrender.com`
5. Click **Save**
6. Go to **Deployments** → **Redeploy**

**Note:** Vercel environment variables override `.env.production` file.

---

## 🔄 Update Backend CORS

Your backend also needs to know about your frontend URL:

1. Go to https://dashboard.render.com
2. Click on your web service
3. Go to **Environment** tab
4. Find or add `CLIENT_URL`
5. Set value to: `https://your-app.vercel.app`
6. Click **Save** (auto-redeploys)

---

## 🧪 Test the Connection

### 1. Check Environment Variable in Vercel

After deploying, you can verify the variable is set:

1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify `VITE_API_URL` is set correctly

### 2. Test in Browser Console

Visit your Vercel app and open browser console (F12):

```javascript
// Check if API URL is set
console.log(import.meta.env.VITE_API_URL);
// Should show your Render URL
```

### 3. Test Signup

1. Visit your Vercel URL
2. Click "Sign Up"
3. Enter email, name, password
4. Click "Sign Up"
5. Should redirect to dashboard ✅

If you see "Network Error":
- Check VITE_API_URL is set correctly
- Check Render backend is running
- Check CORS (CLIENT_URL) is set in Render

---

## 📋 Complete Setup Checklist

### Backend (Render)
- [x] Backend deployed
- [x] Migrations run automatically
- [x] Health endpoint works
- [ ] `CLIENT_URL` set to Vercel URL
- [ ] Service is "Live"

### Frontend (Vercel)
- [ ] `VITE_API_URL` set to Render URL
- [ ] Deployed to Vercel
- [ ] Can access the app
- [ ] Signup/login works

### Testing
- [ ] Can sign up
- [ ] Can log in
- [ ] Can create projects
- [ ] Can create tasks
- [ ] Can add team members

---

## 🆘 Troubleshooting

### Error: "Network Error" or "Failed to fetch"

**Cause:** Frontend can't reach backend

**Solutions:**
1. Verify `VITE_API_URL` is set correctly in Vercel
2. Check Render backend is running (visit `/api/health`)
3. Check browser console for actual error
4. Verify no typos in URL (no trailing slash!)

### Error: "CORS policy blocked"

**Cause:** Backend doesn't allow requests from frontend

**Solutions:**
1. Verify `CLIENT_URL` in Render matches your Vercel URL exactly
2. No trailing slash in CLIENT_URL
3. Redeploy Render after changing CLIENT_URL
4. Clear browser cache

### Error: "404 Not Found"

**Cause:** API endpoint doesn't exist

**Solutions:**
1. Check you're using correct endpoint (e.g., `/api/auth/signup`)
2. Verify backend is running
3. Check Render logs for errors

### Signup works but login fails

**Cause:** Database or JWT issue

**Solutions:**
1. Check `JWT_SECRET` is set in Render
2. Check database migrations ran successfully
3. Check Render logs for errors

---

## 🎯 Quick Setup Commands

### Update .env.production and Deploy

```bash
# 1. Edit client/.env.production with your Render URL
# 2. Commit and push
git add client/.env.production
git commit -m "Update backend URL"
git push

# Vercel auto-deploys!
```

### Or Set in Vercel Dashboard

1. Vercel → Settings → Environment Variables
2. Add `VITE_API_URL` = `https://your-render-url.onrender.com`
3. Redeploy

---

## 📊 Your URLs

Fill these in:

**Backend (Render):**
```
https://_____________________.onrender.com
```

**Frontend (Vercel):**
```
https://_____________________.vercel.app
```

---

## ✅ Success Indicators

Your app is fully connected when:

- ✅ Vercel app loads without errors
- ✅ Can sign up with new account
- ✅ Redirects to dashboard after signup
- ✅ Can create projects
- ✅ Can create tasks
- ✅ Can add team members
- ✅ Dashboard shows statistics

---

## 🎉 After Connection

Your full-stack app will be live!

**Features that work:**
- ✅ User authentication (signup/login)
- ✅ Project management
- ✅ Task creation and assignment
- ✅ Team member management
- ✅ Dashboard with statistics
- ✅ Role-based access control

---

## 🔄 Future Updates

After initial setup, updates are automatic:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Both Render and Vercel auto-deploy! 🚀
```

---

**Your React code is already perfect!** Just set the `VITE_API_URL` and you're done! 🚀
