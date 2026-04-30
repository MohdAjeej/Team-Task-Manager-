# Quick Start Guide

Get your Team Task Manager up and running in 5 minutes!

## 🚀 Quick Setup (Windows)

1. **Run the setup script:**
```bash
setup.bat
```

2. **Configure your database:**
   - Open `.env` file
   - Update `DATABASE_URL` with your PostgreSQL credentials
   - Update `JWT_SECRET` with a random string

3. **Setup database:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **Start the application:**
```bash
npm run dev
```

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🚀 Quick Setup (Mac/Linux)

1. **Run the setup script:**
```bash
chmod +x setup.sh
./setup.sh
```

2. **Configure your database:**
   - Open `.env` file
   - Update `DATABASE_URL` with your PostgreSQL credentials
   - Update `JWT_SECRET` with a random string

3. **Setup database:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

4. **Start the application:**
```bash
npm run dev
```

5. **Open your browser:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📝 First Steps

1. **Sign Up:**
   - Go to http://localhost:5173/signup
   - Create an account (choose Admin or Member role)

2. **Create a Project:**
   - Click "Projects" in the navigation
   - Click "New Project"
   - Enter project name and description

3. **Add Tasks:**
   - Click on your project
   - Click "New Task"
   - Fill in task details and assign to team members

4. **View Dashboard:**
   - Click "Dashboard" to see overview
   - Track progress, overdue tasks, and statistics

## 🗄️ Database Setup Options

### Option 1: Local PostgreSQL

Install PostgreSQL locally and use:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/taskmanager?schema=public"
```

### Option 2: Railway PostgreSQL (Free)

1. Go to https://railway.app
2. Create new project → Add PostgreSQL
3. Copy the DATABASE_URL
4. Paste in your `.env` file

### Option 3: Supabase (Free)

1. Go to https://supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Paste in your `.env` file

### Option 4: ElephantSQL (Free)

1. Go to https://www.elephantsql.com
2. Create free instance
3. Copy URL
4. Paste in your `.env` file

## 🔧 Troubleshooting

### Port Already in Use

If port 5000 or 5173 is already in use:

1. Change backend port in `.env`:
```
PORT=3000
```

2. Change frontend port in `client/vite.config.js`:
```javascript
server: {
  port: 3000
}
```

### Database Connection Error

1. Verify PostgreSQL is running
2. Check DATABASE_URL format
3. Ensure database exists
4. Check username/password

### Prisma Errors

```bash
# Reset database
npm run prisma:migrate reset

# Regenerate client
npm run prisma:generate
```

### Module Not Found

```bash
# Reinstall dependencies
rm -rf node_modules
npm install

cd client
rm -rf node_modules
npm install
```

## 📚 Available Scripts

### Backend
- `npm run server` - Start backend only
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

### Frontend
- `npm run client` - Start frontend only
- `cd client && npm run build` - Build frontend for production

### Full Stack
- `npm run dev` - Start both frontend and backend
- `npm start` - Start production server

## 🎯 Default Test Users

After setup, create these test users:

**Admin User:**
- Email: admin@example.com
- Password: admin123
- Role: Admin

**Member User:**
- Email: member@example.com
- Password: member123
- Role: Member

## 📖 Next Steps

- Read [README.md](README.md) for full documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Explore the API endpoints
- Customize the UI theme in `client/tailwind.config.js`

## 🆘 Need Help?

- Check the [README.md](README.md) for detailed information
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for deployment issues
- Open an issue on GitHub
- Check the console logs for error messages

## 🎉 You're Ready!

Your Team Task Manager is now running. Start creating projects and managing tasks!
