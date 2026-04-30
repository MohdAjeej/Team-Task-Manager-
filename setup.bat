@echo off
echo 🚀 Team Task Manager Setup Script
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    exit /b 1
)

node --version
echo.

REM Install backend dependencies
echo 📦 Installing backend dependencies...
call npm install

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
call npm install
cd ..

REM Create .env file if it doesn't exist
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please update .env file with your database credentials and JWT secret
) else (
    echo ✅ .env file already exists
)

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update .env file with your database credentials
echo 2. Run 'npm run prisma:generate' to generate Prisma client
echo 3. Run 'npm run prisma:migrate' to create database tables
echo 4. Run 'npm run dev' to start the application
echo.
echo For deployment instructions, see DEPLOYMENT.md
pause
