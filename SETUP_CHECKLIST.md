# ✅ Setup Checklist

Use this checklist to ensure your Team Task Manager is properly set up.

## 📋 Pre-Setup

- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] PostgreSQL database available (local or cloud)
- [ ] Git installed (optional)
- [ ] Code editor installed (VS Code recommended)

## 🔧 Installation

- [ ] Cloned/downloaded the project
- [ ] Opened terminal in project directory
- [ ] Ran setup script (`setup.bat` or `setup.sh`)
- [ ] Backend dependencies installed (`node_modules/` exists)
- [ ] Frontend dependencies installed (`client/node_modules/` exists)

## ⚙️ Configuration

- [ ] `.env` file exists in root directory
- [ ] `DATABASE_URL` configured with PostgreSQL connection
- [ ] `JWT_SECRET` set to a random string (min 32 chars)
- [ ] `PORT` set (default: 5000)
- [ ] `CLIENT_URL` set (default: http://localhost:5173)

### Example .env Configuration
```env
DATABASE_URL="postgresql://user:pass@localhost:5432/taskmanager"
JWT_SECRET="your-super-secret-random-string-min-32-chars"
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

## 🗄️ Database Setup

- [ ] Prisma client generated (`npm run prisma:generate`)
- [ ] Database migrations created (`npm run prisma:migrate`)
- [ ] Database tables created (users, projects, tasks, team_members)
- [ ] No migration errors in console

### Verify Database
```bash
# Open Prisma Studio to view database
npm run prisma:studio
```

## 🚀 Application Start

- [ ] Development server started (`npm run dev`)
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] No errors in terminal
- [ ] Health check works: http://localhost:5000/api/health

## 🧪 Testing

### Backend API Tests
- [ ] Health endpoint: `GET http://localhost:5000/api/health`
- [ ] Returns: `{"status":"ok","message":"Server is running"}`

### Frontend Tests
- [ ] Open http://localhost:5173
- [ ] Login page loads
- [ ] No console errors in browser
- [ ] Signup page accessible
- [ ] UI looks correct

## 👤 User Account Creation

- [ ] Navigate to signup page
- [ ] Create admin account:
  - Name: Test Admin
  - Email: admin@test.com
  - Password: admin123
  - Role: Admin
- [ ] Signup successful
- [ ] Redirected to dashboard
- [ ] User info shows in navbar

## 📁 Project Creation

- [ ] Navigate to Projects page
- [ ] Click "New Project" button
- [ ] Create test project:
  - Name: Test Project
  - Description: My first project
- [ ] Project created successfully
- [ ] Project appears in list
- [ ] Can click on project

## ✅ Task Creation

- [ ] Open test project
- [ ] Click "New Task" button
- [ ] Create test task:
  - Title: Test Task
  - Description: My first task
  - Status: To Do
  - Priority: Medium
  - Due Date: Tomorrow
  - Assign To: Yourself
- [ ] Task created successfully
- [ ] Task appears in Kanban board
- [ ] Can update task status

## 📊 Dashboard Check

- [ ] Navigate to Dashboard
- [ ] Statistics display correctly
- [ ] Total projects shows 1
- [ ] Total tasks shows 1
- [ ] Recent tasks section shows test task
- [ ] No errors on page

## 🔐 Security Verification

- [ ] Logout works
- [ ] Can't access dashboard when logged out
- [ ] Login works with created account
- [ ] Invalid credentials rejected
- [ ] Token persists on page refresh

## 🎨 UI/UX Verification

- [ ] Responsive design works (resize browser)
- [ ] Navigation works correctly
- [ ] Buttons are clickable
- [ ] Forms validate input
- [ ] Loading states show
- [ ] Error messages display
- [ ] Success messages display
- [ ] Icons display correctly

## 📱 Mobile Responsiveness

- [ ] Open browser dev tools (F12)
- [ ] Toggle device toolbar
- [ ] Test on mobile view (375px)
- [ ] Test on tablet view (768px)
- [ ] Navigation works on mobile
- [ ] Forms work on mobile
- [ ] Cards stack properly

## 🔄 Full Workflow Test

- [ ] Create second user account (Member role)
- [ ] Login as admin
- [ ] Create new project
- [ ] Add member to project (if implemented)
- [ ] Create multiple tasks
- [ ] Assign tasks to different users
- [ ] Update task statuses
- [ ] Check dashboard updates
- [ ] Delete a task
- [ ] Delete a project

## 📚 Documentation Review

- [ ] README.md exists and is readable
- [ ] GET_STARTED.md reviewed
- [ ] QUICKSTART.md reviewed
- [ ] DEPLOYMENT.md reviewed
- [ ] All documentation makes sense

## 🚂 Deployment Preparation (Optional)

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] Environment variables documented
- [ ] Deployment guide reviewed

## ✅ Final Verification

- [ ] All features work as expected
- [ ] No console errors
- [ ] No network errors
- [ ] Database persists data
- [ ] Can logout and login again
- [ ] Data persists after restart

## 🎉 Success Criteria

Your setup is complete when:

✅ Application runs without errors
✅ Can create and login users
✅ Can create projects
✅ Can create and manage tasks
✅ Dashboard shows correct statistics
✅ All pages are accessible
✅ UI is responsive
✅ Data persists in database

## 🆘 Troubleshooting

If any checkbox fails, refer to:

1. **GET_STARTED.md** - Setup instructions
2. **QUICKSTART.md** - Quick fixes
3. **README.md** - Detailed documentation
4. Console logs - Check for error messages
5. Browser console - Check for frontend errors

## 📝 Common Issues

### Database Connection Failed
```bash
# Check DATABASE_URL format
# Verify PostgreSQL is running
# Test connection: npm run prisma:studio
```

### Port Already in Use
```bash
# Change PORT in .env
# Or kill process using port
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Prisma Errors
```bash
# Regenerate client
npm run prisma:generate

# Reset database (WARNING: Deletes data)
npm run prisma:migrate reset
```

## 🎯 Next Steps After Setup

1. [ ] Read full documentation
2. [ ] Explore all features
3. [ ] Customize theme colors
4. [ ] Add more test data
5. [ ] Deploy to Railway
6. [ ] Share with team
7. [ ] Start using for real projects!

---

**Setup Status**: ⬜ Not Started | 🔄 In Progress | ✅ Complete

**Last Updated**: Check each item as you complete it

**Need Help?** Check GET_STARTED.md or README.md
