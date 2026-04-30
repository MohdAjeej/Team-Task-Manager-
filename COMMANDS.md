# 🛠️ Useful Commands Reference

Quick reference for all commands you'll need while working with Team Task Manager.

## 📦 Installation Commands

### Initial Setup
```bash
# Windows
setup.bat

# Mac/Linux
chmod +x setup.sh
./setup.sh

# Manual installation
npm install
cd client && npm install && cd ..
```

## 🗄️ Database Commands

### Prisma Commands
```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migrations
npm run prisma:migrate

# Create migration without applying
npx prisma migrate dev --create-only

# Apply pending migrations
npx prisma migrate deploy

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Open Prisma Studio (Database GUI)
npm run prisma:studio

# Format schema file
npx prisma format

# Validate schema
npx prisma validate

# Pull database schema
npx prisma db pull

# Push schema to database (dev only)
npx prisma db push
```

## 🚀 Development Commands

### Start Application
```bash
# Start both frontend and backend
npm run dev

# Start backend only
npm run server

# Start frontend only
npm run client

# Start with nodemon (auto-restart)
nodemon server/index.js
```

### Build Commands
```bash
# Build frontend for production
cd client && npm run build

# Preview production build
cd client && npm run preview

# Build and start production
npm run build && npm start
```

## 🧪 Testing Commands

### API Testing with curl
```bash
# Health check
curl http://localhost:5000/api/health

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123","role":"MEMBER"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Get current user (replace TOKEN)
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create project (replace TOKEN)
curl -X POST http://localhost:5000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"name":"Test Project","description":"Test description"}'

# Get all projects (replace TOKEN)
curl http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 🔧 Maintenance Commands

### Clean Up
```bash
# Remove node_modules
rm -rf node_modules client/node_modules

# Remove build files
rm -rf client/dist

# Clean npm cache
npm cache clean --force

# Remove package-lock
rm package-lock.json client/package-lock.json
```

### Reinstall Dependencies
```bash
# Reinstall all dependencies
npm install
cd client && npm install && cd ..

# Update dependencies
npm update
cd client && npm update && cd ..

# Check for outdated packages
npm outdated
cd client && npm outdated && cd ..
```

## 🐛 Debugging Commands

### Check Versions
```bash
# Node version
node --version

# npm version
npm --version

# Check all versions
node --version && npm --version
```

### View Logs
```bash
# View backend logs (if running in background)
# Check terminal where npm run dev is running

# View npm debug log
cat npm-debug.log

# View error log
cat error.log
```

### Port Management
```bash
# Windows - Find process using port
netstat -ano | findstr :5000
netstat -ano | findstr :5173

# Windows - Kill process by PID
taskkill /PID <PID> /F

# Mac/Linux - Find process using port
lsof -ti:5000
lsof -ti:5173

# Mac/Linux - Kill process using port
lsof -ti:5000 | xargs kill -9
lsof -ti:5173 | xargs kill -9
```

## 📝 Git Commands

### Basic Git Workflow
```bash
# Initialize repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit"

# Add remote repository
git remote add origin <your-repo-url>

# Push to GitHub
git push -u origin main

# Check status
git status

# View changes
git diff

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout main

# Merge branch
git merge feature/new-feature
```

## 🚂 Railway Deployment Commands

### Railway CLI
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Link to project
railway link

# Deploy
railway up

# Run command on Railway
railway run npm run prisma:migrate

# View logs
railway logs

# Open project in browser
railway open

# Add environment variable
railway variables set KEY=value

# List environment variables
railway variables
```

## 🔍 Useful Checks

### Verify Installation
```bash
# Check if Node.js is installed
node --version

# Check if npm is installed
npm --version

# Check if PostgreSQL is running (Windows)
sc query postgresql-x64-14

# Check if PostgreSQL is running (Mac)
brew services list | grep postgresql

# Check if PostgreSQL is running (Linux)
sudo systemctl status postgresql
```

### Test Database Connection
```bash
# Using psql
psql -h localhost -U postgres -d taskmanager

# Using Prisma Studio
npm run prisma:studio
```

### Check Application Status
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test frontend
curl http://localhost:5173

# Check if ports are in use
netstat -an | findstr :5000
netstat -an | findstr :5173
```

## 📊 Database Queries

### Direct PostgreSQL Commands
```sql
-- Connect to database
psql -U postgres -d taskmanager

-- List all tables
\dt

-- Describe table
\d users

-- Count users
SELECT COUNT(*) FROM users;

-- View all users
SELECT id, name, email, role FROM users;

-- View all projects
SELECT * FROM projects;

-- View all tasks
SELECT * FROM tasks;

-- Exit psql
\q
```

## 🎨 Frontend Development

### Vite Commands
```bash
# Start dev server
cd client && npm run dev

# Build for production
cd client && npm run build

# Preview production build
cd client && npm run preview

# Clear Vite cache
cd client && rm -rf node_modules/.vite
```

### TailwindCSS
```bash
# Rebuild CSS
cd client && npx tailwindcss -i ./src/index.css -o ./dist/output.css

# Watch mode
cd client && npx tailwindcss -i ./src/index.css -o ./dist/output.css --watch
```

## 🔐 Security Commands

### Generate JWT Secret
```bash
# Generate random string (Node.js)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate random string (OpenSSL)
openssl rand -hex 32

# Generate random string (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

## 📦 Package Management

### npm Commands
```bash
# Install specific package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Uninstall package
npm uninstall package-name

# List installed packages
npm list

# List outdated packages
npm outdated

# Update package
npm update package-name

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

## 🎯 Quick Commands Summary

### Most Used Commands
```bash
# Start development
npm run dev

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open database GUI
npm run prisma:studio

# Build for production
cd client && npm run build

# Start production
npm start
```

### One-Line Setup
```bash
# Complete setup (after cloning)
npm install && cd client && npm install && cd .. && npm run prisma:generate && npm run prisma:migrate
```

## 🆘 Emergency Commands

### When Things Break
```bash
# Nuclear option - complete reset
rm -rf node_modules client/node_modules package-lock.json client/package-lock.json
npm install && cd client && npm install && cd ..
npm run prisma:generate

# Reset database
npm run prisma:migrate reset

# Clear all caches
npm cache clean --force
cd client && npm cache clean --force

# Restart from scratch
rm -rf node_modules client/node_modules client/dist
npm install && cd client && npm install && cd ..
npm run prisma:generate && npm run prisma:migrate
```

## 📚 Help Commands

### Get Help
```bash
# npm help
npm help

# Prisma help
npx prisma --help

# Specific command help
npm run --help
npx prisma migrate --help

# View package.json scripts
npm run
```

---

**Pro Tip**: Bookmark this file for quick reference!

**Need More Help?** Check:
- [GET_STARTED.md](GET_STARTED.md) - Setup guide
- [README.md](README.md) - Full documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick start
