# Team Task Manager - Full-Stack Application

A comprehensive team task management system with role-based access control, project management, and real-time task tracking.

## 🚀 Features

- **Authentication & Authorization**
  - User signup/login with JWT
  - Role-based access control (Admin/Member)
  - Secure password hashing with bcrypt

- **Project Management**
  - Create and manage multiple projects
  - Add team members to projects
  - Track project progress

- **Task Management**
  - Create, update, and delete tasks
  - Assign tasks to team members
  - Set priorities (Low, Medium, High)
  - Track task status (To Do, In Progress, Completed)
  - Set due dates and track overdue tasks

- **Dashboard**
  - Overview of all projects and tasks
  - Task statistics and progress tracking
  - Overdue task alerts
  - Recent activity feed

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- PostgreSQL database
- Prisma ORM
- JWT authentication
- Express Validator

### Frontend
- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- Lucide Icons

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone <repository-url>
cd team-task-manager
```

2. **Install backend dependencies**
```bash
npm install
```

3. **Install frontend dependencies**
```bash
cd client
npm install
cd ..
```

4. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and update with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/taskmanager?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this"
PORT=5000
CLIENT_URL=http://localhost:5173
```

5. **Setup database**
```bash
# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate
```

6. **Start the application**

Development mode (runs both frontend and backend):
```bash
npm run dev
```

Or run separately:
```bash
# Backend only
npm run server

# Frontend only (in another terminal)
npm run client
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 🚂 Railway Deployment

### Backend Deployment

1. **Create a new Railway project**
   - Go to [Railway.app](https://railway.app)
   - Click "New Project"
   - Select "Deploy from GitHub repo"

2. **Add PostgreSQL database**
   - Click "New" → "Database" → "PostgreSQL"
   - Railway will automatically create a database and provide the connection string

3. **Configure environment variables**
   Add these variables in Railway dashboard:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=production
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

4. **Add build and start commands**
   Railway will auto-detect from package.json:
   - Build: `npm run prisma:generate`
   - Start: `npm start`

5. **Deploy**
   - Push to GitHub
   - Railway will automatically deploy

### Frontend Deployment (Vercel/Netlify)

**For Vercel:**
1. Go to [Vercel](https://vercel.com)
2. Import your repository
3. Set root directory to `client`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-backend.up.railway.app
   ```
5. Deploy

**For Netlify:**
1. Go to [Netlify](https://netlify.com)
2. Import your repository
3. Set build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-railway-backend.up.railway.app
   ```
5. Deploy

## 📁 Project Structure

```
team-task-manager/
├── server/
│   ├── routes/
│   │   ├── auth.js          # Authentication routes
│   │   ├── projects.js      # Project management routes
│   │   ├── tasks.js         # Task management routes
│   │   └── dashboard.js     # Dashboard statistics routes
│   ├── middleware/
│   │   └── auth.js          # Authentication middleware
│   └── index.js             # Express server setup
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── Layout.jsx   # Main layout component
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication context
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Projects.jsx
│   │   │   └── ProjectDetail.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
├── prisma/
│   └── schema.prisma        # Database schema
├── package.json
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project details
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add team member
- `DELETE /api/projects/:id/members/:memberId` - Remove team member

### Tasks
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/my-tasks` - Get user's assigned tasks

## 👥 User Roles

### Admin
- Full access to all projects
- Can manage all tasks
- Can add/remove team members

### Member
- Access to assigned projects only
- Can create and manage tasks in their projects
- Can view team members

## 🎨 UI Features

- Modern, responsive design with TailwindCSS
- Kanban-style task board
- Real-time progress tracking
- Overdue task alerts
- Priority-based task coloring
- Mobile-friendly interface

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
