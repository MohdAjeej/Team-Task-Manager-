# 🎥 Video Tutorial Script: Deploy Full-Stack App (Render + Vercel)

## 📋 Video Overview
**Title**: How to Deploy Full-Stack Team Task Manager (React + Node.js + PostgreSQL)  
**Duration**: 15-20 minutes  
**Difficulty**: Beginner-Friendly

---

## 🎬 INTRO (0:00 - 1:00)

### Opening Scene
"Hey everyone! In this tutorial, I'll show you how to deploy a full-stack application completely FREE using Render for the backend and Vercel for the frontend."

### What We're Building
- **Frontend**: React with Vite
- **Backend**: Node.js + Express + Prisma
- **Database**: PostgreSQL
- **Features**: Authentication, Projects, Tasks, Team Management

### What You'll Learn
1. Deploy PostgreSQL database on Render
2. Deploy Node.js backend on Render
3. Deploy React frontend on Vercel
4. Connect everything together

---

## 📦 PART 1: SETUP ACCOUNTS (1:00 - 3:00)

### Scene 1: Create Render Account
**Show on screen:**
1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub (recommended)
4. Verify email

**Voiceover:**
"First, we need a Render account. Render offers free hosting for web services and databases. Click 'Get Started' and sign up with your GitHub account for easier deployment."

### Scene 2: Create Vercel Account
**Show on screen:**
1. Go to https://vercel.com
2. Click "Sign Up"
3. Connect with GitHub
4. Authorize Vercel

**Voiceover:**
"Next, create a Vercel account. Vercel is perfect for deploying React apps and offers automatic deployments from GitHub."

---

## 🗄️ PART 2: DEPLOY DATABASE (3:00 - 6:00)

### Scene 3: Create PostgreSQL Database
**Show on screen:**
1. Render Dashboard → "New +"
2. Select "PostgreSQL"
3. Fill in details:
   - Name: `team-task-manager-db`
   - Database: `taskmanager`
   - User: `taskmanager_user`
   - Region: Choose closest to you
   - Plan: Free
4. Click "Create Database"

**Voiceover:**
"Now let's create our database. In Render, click 'New' and select PostgreSQL. Give it a name, choose the free plan, and create it. This will take about 30 seconds."

### Scene 4: Copy Database URL
**Show on screen:**
1. Wait for database to be "Available"
2. Scroll to "Connections"
3. Copy "External Database URL"
4. Save it in notepad

**Voiceover:**
"Once the database is ready, scroll down to find the connection string. This is your DATABASE_URL - copy it and save it somewhere safe. We'll need this in a moment."

---

## 🚀 PART 3: DEPLOY BACKEND (6:00 - 10:00)

### Scene 5: Create Web Service
**Show on screen:**
1. Render Dashboard → "New +"
2. Select "Web Service"
3. Connect GitHub repository
4. Select your repository
5. Configure:
   - Name: `team-task-manager`
   - Region: Same as database
   - Branch: `main`
   - Root Directory: (leave empty)
   - Runtime: Node
   - Build Command: `npm install && npx prisma generate && npx prisma migrate deploy`
   - Start Command: `npm start`
   - Plan: Free

**Voiceover:**
"Back to the Render dashboard, create a new Web Service. Connect your GitHub repository, and configure the build settings. The build command installs dependencies and runs database migrations automatically."

### Scene 6: Add Environment Variables
**Show on screen:**
1. Scroll to "Environment Variables"
2. Add these variables:
   ```
   DATABASE_URL = [paste your database URL]
   JWT_SECRET = your-super-secret-key-change-this
   NODE_ENV = production
   CLIENT_URL = https://your-app.vercel.app
   PORT = 10000
   ```
3. Click "Create Web Service"

**Voiceover:**
"Now add your environment variables. Paste the database URL we copied earlier. Set a strong JWT secret - this encrypts your user tokens. For CLIENT_URL, we'll update this after deploying the frontend. Click create and wait for the build to complete."

### Scene 7: Wait for Deployment
**Show on screen:**
1. Watch build logs
2. Wait for "Build successful"
3. Wait for "Deploy live"
4. Copy the service URL (e.g., `https://team-task-manager-vr2k.onrender.com`)

**Voiceover:**
"The first deployment takes 2-3 minutes. You can watch the logs to see the build progress. Once it says 'Deploy live', copy your backend URL - we'll need this for the frontend."

### Scene 8: Test Backend
**Show on screen:**
1. Open backend URL in browser
2. Should see: "Team Task Manager API 🚀"
3. Show the JSON response

**Voiceover:**
"Let's test it! Open your backend URL in a browser. You should see a welcome message confirming the API is running. Perfect!"

---

## 🎨 PART 4: DEPLOY FRONTEND (10:00 - 14:00)

### Scene 9: Update Frontend Environment
**Show on screen:**
1. Open VS Code
2. Open `client/.env.production`
3. Update:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
4. Save file

**Voiceover:**
"Before deploying the frontend, we need to tell it where the backend is. Open your project in VS Code, find the .env.production file in the client folder, and paste your backend URL. Make sure there's no trailing slash!"

### Scene 10: Commit and Push
**Show on screen:**
1. Terminal: `git add .`
2. Terminal: `git commit -m "update production API URL"`
3. Terminal: `git push`

**Voiceover:**
"Save the file, then commit and push to GitHub. This ensures Vercel will use the correct backend URL."

### Scene 11: Create Vercel Project
**Show on screen:**
1. Vercel Dashboard → "Add New" → "Project"
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: `client` ⚠️ IMPORTANT!
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click "Deploy"

**Voiceover:**
"Now go to Vercel and create a new project. Import your repository. Here's the critical part - set the Root Directory to 'client'. This tells Vercel to build from the client folder, not the root. Click deploy and wait."

### Scene 12: Wait for Deployment
**Show on screen:**
1. Watch build progress
2. Wait for "Build successful"
3. Click "Visit" to see your app
4. Copy the Vercel URL

**Voiceover:**
"Vercel is super fast - usually takes less than a minute. Once it's done, click 'Visit' to see your live app! Copy the Vercel URL - we need to update the backend with this."

---

## 🔗 PART 5: CONNECT FRONTEND & BACKEND (14:00 - 16:00)

### Scene 13: Update Backend CORS
**Show on screen:**
1. Go back to Render Dashboard
2. Click your web service
3. Go to "Environment" tab
4. Find `CLIENT_URL`
5. Update to your Vercel URL: `https://your-app.vercel.app`
6. Click "Save Changes"
7. Wait for auto-redeploy

**Voiceover:**
"Almost done! We need to tell the backend about the frontend URL for CORS security. Go back to Render, find your web service, and update the CLIENT_URL environment variable with your Vercel URL. Save it and Render will automatically redeploy."

---

## ✅ PART 6: TEST THE APP (16:00 - 18:00)

### Scene 14: Create Account
**Show on screen:**
1. Open your Vercel URL
2. Click "Sign Up"
3. Fill in:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Role: Admin
4. Click "Sign Up"
5. Show success message

**Voiceover:**
"Let's test everything! Open your app, click Sign Up, and create an account. If this works, it means your frontend is talking to the backend, and the backend is saving to the database. Success!"

### Scene 15: Test Features
**Show on screen:**
1. Login with the account
2. Create a new project
3. Add a task
4. Show the dashboard
5. Add a team member

**Voiceover:**
"Now let's test the features. Create a project, add some tasks, and invite team members. Everything is working perfectly and it's all deployed for free!"

---

## 🎓 PART 7: TROUBLESHOOTING (18:00 - 19:30)

### Common Issues

**Issue 1: "vite: command not found" on Vercel**
**Show on screen:**
- Settings → General → Root Directory
- Must be set to `client`
- Save and redeploy

**Voiceover:**
"If you see 'vite command not found', make sure you set the Root Directory to 'client' in Vercel settings. This is the most common mistake."

**Issue 2: "Failed to fetch" or CORS errors**
**Show on screen:**
- Check `client/.env.production` has correct backend URL
- Check Render `CLIENT_URL` has correct frontend URL
- Both should have NO trailing slash

**Voiceover:**
"If you get CORS errors, double-check your environment variables. The frontend needs the backend URL, and the backend needs the frontend URL. No trailing slashes!"

**Issue 3: Backend shows "Application failed to respond"**
**Show on screen:**
- Render free tier spins down after 15 minutes
- First request takes 30-60 seconds (cold start)
- Just wait and refresh

**Voiceover:**
"Render's free tier goes to sleep after 15 minutes of inactivity. The first request will take up to a minute to wake it up. This is normal - just be patient!"

---

## 🎉 OUTRO (19:30 - 20:00)

### Recap
**Show on screen:**
- ✅ Database on Render
- ✅ Backend on Render
- ✅ Frontend on Vercel
- ✅ All connected and working
- ✅ 100% FREE!

**Voiceover:**
"And that's it! You now have a fully deployed full-stack application. Database on Render, backend on Render, frontend on Vercel - all free! The app is live and accessible from anywhere in the world."

### Call to Action
**Show on screen:**
- GitHub repo link
- Like and subscribe
- Comment if you have questions

**Voiceover:**
"If you found this helpful, give it a thumbs up and subscribe for more tutorials. The complete code is on GitHub - link in the description. Drop a comment if you have any questions. Thanks for watching, and happy coding!"

---

## 📝 VIDEO DESCRIPTION

```
🚀 Deploy a Full-Stack Team Task Manager App for FREE!

In this tutorial, you'll learn how to deploy a complete full-stack application using:
- React + Vite (Frontend)
- Node.js + Express (Backend)
- PostgreSQL (Database)
- Render (Backend & Database Hosting)
- Vercel (Frontend Hosting)

⏱️ TIMESTAMPS:
0:00 - Introduction
1:00 - Setup Accounts (Render & Vercel)
3:00 - Deploy PostgreSQL Database
6:00 - Deploy Node.js Backend
10:00 - Deploy React Frontend
14:00 - Connect Frontend & Backend
16:00 - Test the Application
18:00 - Troubleshooting Common Issues
19:30 - Recap & Conclusion

🔗 LINKS:
- GitHub Repository: [your-repo-link]
- Render: https://render.com
- Vercel: https://vercel.com
- Documentation: [link to your docs]

💡 FEATURES:
✅ User Authentication (JWT)
✅ Role-Based Access Control
✅ Project Management
✅ Task Management
✅ Team Collaboration
✅ Responsive Design

🛠️ TECH STACK:
- Frontend: React, Vite, TailwindCSS, Axios
- Backend: Node.js, Express, Prisma ORM
- Database: PostgreSQL
- Authentication: JWT, bcrypt

📚 PREREQUISITES:
- Basic JavaScript knowledge
- GitHub account
- Git installed locally

❓ COMMON ISSUES COVERED:
- "vite: command not found" error
- CORS errors
- Database connection issues
- Cold start delays

👨‍💻 Perfect for beginners learning full-stack development!

#webdevelopment #react #nodejs #postgresql #deployment #tutorial #coding
```

---

## 🎬 FILMING TIPS

### Screen Recording
- Use OBS Studio or Loom
- Record in 1920x1080 (1080p)
- 30 FPS is fine
- Use a good microphone

### Editing Tips
- Add zoom-ins for important steps
- Use arrows/highlights for buttons
- Add text overlays for key points
- Background music (low volume)
- Speed up waiting times (2x-3x)

### Thumbnail Ideas
- Split screen: Code + Live App
- Text: "Deploy Full-Stack App FREE"
- Logos: React + Node.js + PostgreSQL
- Bright colors, high contrast

---

## 📋 CHECKLIST BEFORE RECORDING

- [ ] Test the entire deployment process yourself
- [ ] Prepare a fresh GitHub repository
- [ ] Have all accounts ready (Render, Vercel)
- [ ] Clear browser cache/cookies
- [ ] Close unnecessary tabs/apps
- [ ] Test microphone audio
- [ ] Prepare script notes
- [ ] Have water nearby
- [ ] Good lighting for webcam (if showing face)

---

## 🎯 KEY POINTS TO EMPHASIZE

1. **It's completely FREE** - mention this multiple times
2. **Root Directory = client** - this is the #1 mistake
3. **No trailing slashes** in URLs
4. **Cold start is normal** on free tier
5. **Automatic deployments** from GitHub
6. **Professional deployment** - same tools used by companies

---

Good luck with your video! 🎥✨
