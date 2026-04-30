# 🚀 Get Started with Team Task Manager

Welcome! This guide will help you get your Team Task Manager application running in just a few minutes.

## 📋 Prerequisites

Before you begin, make sure you have:

- ✅ **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- ✅ **PostgreSQL** database - Choose one option:
  - Local PostgreSQL installation
  - [Railway](https://railway.app) (Free tier available)
  - [Supabase](https://supabase.com) (Free tier available)
  - [ElephantSQL](https://www.elephantsql.com) (Free tier available)
- ✅ **Git** (optional, for version control)

## 🎯 Quick Start (3 Steps)

### Step 1: Install Dependencies

**Windows:**
```bash
setup.bat
```

**Mac/Linux:**
```bash
chmod +x setup.sh
./setup.sh
```

Or manually:
```bash
npm install
cd client && npm install && cd ..
```

### Step 2: Configure Database

1. Open the `.env` file in the root directory
2. Update the `DATABASE_URL` with your PostgreSQL connection string:

```env
DATABASE_URL="postgresql://username:password@host:5432/database_name"
```

**Example configurations:**

**Local PostgreSQL:**
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskmanager"
```

**Railway/Supabase/ElephantSQL:**
```env
DATABASE_URL="postgresql://user:pass@host.region.provider.com:5432/dbname"
```

3. Update the `JWT_SECRET` to a random string:
```env
JWT_SECRET="your-random-secret-key-min-32-characters-long"
```

### Step 3: Setup Database & Start

```bash
# Generate Prisma client
npm run prisma:generate

# Create database tables
npm run prisma:migrate

# Start the application
npm run dev
```

## 🎉 You're Ready!

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api/health

## 👤 Create Your First Account

1. Go to http://localhost:5173/signup
2. Fill in your details:
   - **Name**: Your full name
   - **Email**: Your email address
   - **Password**: At least 6 characters
   - **Role**: Choose Admin or Member
3. Click "Sign Up"

## 📝 Create Your First Project

1. Click "Projects" in the navigation
2. Click "New Project" button
3. Enter:
   - **Project Name**: e.g., "Website Redesign"
   - **Description**: Brief description of the project
4. Click "Create"

## ✅ Create Your First Task

1. Click on your project to open it
2. Click "New Task" button
3. Fill in task details:
   - **Title**: Task name
   - **Description**: What needs to be done
   - **Status**: To Do, In Progress, or Completed
   - **Priority**: Low, Medium, or High
   - **Due Date**: When it's due
   - **Assign To**: Select a team member
4. Click "Create Task"

## 📊 View Your Dashboard

Click "Dashboard" in the navigation to see:
- Total projects and tasks
- Tasks by status
- Overdue tasks
- Recent activity
- Your assigned tasks

## 🎨 Features to Explore

### Project Management
- ✅ Create multiple projects
- ✅ Add team members
- ✅ Track project progress
- ✅ View team members

### Task Management
- ✅ Create tasks with priorities
- ✅ Assign tasks to team members
- ✅ Set due dates
- ✅ Update task status
- ✅ Kanban board view

### Dashboard
- ✅ Overview statistics
- ✅ Overdue task alerts
- ✅ Recent tasks feed
- ✅ Progress tracking

### Role-Based Access
- **Admin**: Full access to all projects
- **Member**: Access to assigned projects only

## 🔧 Troubleshooting

### Database Connection Error

**Problem**: Can't connect to database

**Solution**:
1. Verify PostgreSQL is running
2. Check `DATABASE_URL` format in `.env`
3. Ensure database exists
4. Test connection: `npm run prisma:studio`

### Port Already in Use

**Problem**: Port 5000 or 5173 is already in use

**Solution**:
1. Change port in `.env`:
   ```env
   PORT=3000
   ```
2. Or kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Mac/Linux
   lsof -ti:5000 | xargs kill -9
   ```

### Module Not Found

**Problem**: Module not found errors

**Solution**:
```bash
# Clean install
rm -rf node_modules
npm install

cd client
rm -rf node_modules
npm install
```

### Prisma Errors

**Problem**: Prisma client errors

**Solution**:
```bash
# Regenerate Prisma client
npm run prisma:generate

# Reset database (WARNING: Deletes all data)
npm run prisma:migrate reset
```

## 📚 Next Steps

### Learn More
- 📖 Read [README.md](README.md) for full documentation
- 🏗️ Check [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for architecture
- ✨ Review [FEATURES.md](FEATURES.md) for all features

### Deploy to Production
- 🚂 Follow [DEPLOYMENT.md](DEPLOYMENT.md) for Railway deployment
- 🌐 Deploy frontend to Vercel/Netlify
- 🔒 Update security settings for production

### Customize
- 🎨 Change theme colors in `client/tailwind.config.js`
- 🔧 Add new features
- 📝 Modify database schema in `prisma/schema.prisma`

## 🆘 Need Help?

### Common Issues
1. **Can't login**: Check if user exists, verify password
2. **Tasks not showing**: Verify project access
3. **Slow performance**: Check database connection
4. **Build errors**: Clear node_modules and reinstall

### Resources
- 📖 [Full Documentation](README.md)
- 🚀 [Quick Start Guide](QUICKSTART.md)
- 🏗️ [Project Structure](PROJECT_STRUCTURE.md)
- 🚂 [Deployment Guide](DEPLOYMENT.md)

### Get Support
- Check console logs for errors
- Review error messages carefully
- Search for similar issues online
- Open an issue on GitHub

## 🎓 Learning Path

### Beginner
1. ✅ Setup and run the application
2. ✅ Create projects and tasks
3. ✅ Explore the dashboard
4. ✅ Understand the UI

### Intermediate
1. 📖 Read the code structure
2. 🔧 Customize the theme
3. 📝 Add new fields to tasks
4. 🎨 Modify the UI

### Advanced
1. 🚀 Deploy to production
2. 🔌 Add new API endpoints
3. 🗄️ Modify database schema
4. 🎯 Add new features

## ✨ Tips for Success

1. **Start Small**: Create one project with a few tasks
2. **Explore Features**: Try all the buttons and options
3. **Read Documentation**: Check the docs when stuck
4. **Experiment**: The app is yours to customize
5. **Deploy Early**: Get it online and share with your team

## 🎉 Congratulations!

You now have a fully functional team task management system. Start managing your projects and tasks efficiently!

---

**Happy Task Managing! 🚀**

For more information, check out:
- [README.md](README.md) - Complete documentation
- [FEATURES.md](FEATURES.md) - All features list
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
