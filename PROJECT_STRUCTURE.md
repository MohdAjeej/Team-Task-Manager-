# Project Structure Overview

## 📁 Directory Structure

```
team-task-manager/
├── 📂 server/                    # Backend application
│   ├── 📂 routes/               # API route handlers
│   │   ├── auth.js             # Authentication endpoints
│   │   ├── projects.js         # Project management endpoints
│   │   ├── tasks.js            # Task management endpoints
│   │   └── dashboard.js        # Dashboard statistics endpoints
│   ├── 📂 middleware/          # Express middleware
│   │   └── auth.js             # JWT authentication & authorization
│   └── index.js                # Express server setup
│
├── 📂 client/                   # Frontend application
│   ├── 📂 src/
│   │   ├── 📂 components/      # Reusable React components
│   │   │   └── Layout.jsx      # Main layout with navigation
│   │   ├── 📂 context/         # React context providers
│   │   │   └── AuthContext.jsx # Authentication state management
│   │   ├── 📂 pages/           # Page components
│   │   │   ├── Login.jsx       # Login page
│   │   │   ├── Signup.jsx      # Registration page
│   │   │   ├── Dashboard.jsx   # Dashboard with statistics
│   │   │   ├── Projects.jsx    # Projects list page
│   │   │   └── ProjectDetail.jsx # Single project with Kanban board
│   │   ├── App.jsx             # Main app component with routing
│   │   ├── main.jsx            # React entry point
│   │   └── index.css           # Global styles with Tailwind
│   ├── index.html              # HTML template
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   ├── postcss.config.js       # PostCSS configuration
│   └── package.json            # Frontend dependencies
│
├── 📂 prisma/                   # Database configuration
│   └── schema.prisma           # Database schema definition
│
├── 📄 Configuration Files
│   ├── package.json            # Backend dependencies & scripts
│   ├── .env                    # Environment variables (local)
│   ├── .env.example            # Environment variables template
│   ├── .gitignore              # Git ignore rules
│   ├── nixpacks.toml           # Railway build configuration
│   └── Procfile                # Process configuration
│
└── 📄 Documentation
    ├── README.md               # Main documentation
    ├── QUICKSTART.md           # Quick setup guide
    ├── DEPLOYMENT.md           # Deployment instructions
    └── PROJECT_STRUCTURE.md    # This file
```

## 🗄️ Database Schema

### User Model
- **Fields**: id, email, password, name, role
- **Relations**: Created projects, team memberships, assigned tasks, created tasks
- **Roles**: ADMIN, MEMBER

### Project Model
- **Fields**: id, name, description, creatorId
- **Relations**: Creator (User), team members, tasks

### TeamMember Model
- **Fields**: id, userId, projectId, role, joinedAt
- **Relations**: User, Project
- **Purpose**: Many-to-many relationship between users and projects

### Task Model
- **Fields**: id, title, description, status, priority, dueDate, projectId, assigneeId, creatorId
- **Status**: TODO, IN_PROGRESS, COMPLETED, OVERDUE
- **Priority**: LOW, MEDIUM, HIGH
- **Relations**: Project, assignee (User), creator (User)

## 🔌 API Endpoints

### Authentication (`/api/auth`)
- `POST /signup` - Register new user
- `POST /login` - Login user
- `GET /me` - Get current user info

### Projects (`/api/projects`)
- `GET /` - List all user's projects
- `GET /:id` - Get project details
- `POST /` - Create new project
- `PUT /:id` - Update project
- `DELETE /:id` - Delete project
- `POST /:id/members` - Add team member
- `DELETE /:id/members/:memberId` - Remove team member

### Tasks (`/api/tasks`)
- `GET /project/:projectId` - Get all tasks for a project
- `GET /:id` - Get task details
- `POST /` - Create new task
- `PUT /:id` - Update task
- `DELETE /:id` - Delete task

### Dashboard (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics
- `GET /my-tasks` - Get user's assigned tasks

## 🎨 Frontend Architecture

### Routing Structure
```
/ (root)
├── /login          - Public route
├── /signup         - Public route
└── / (authenticated)
    ├── /dashboard      - Dashboard overview
    ├── /projects       - Projects list
    └── /projects/:id   - Project detail with Kanban board
```

### Component Hierarchy
```
App
├── AuthProvider (Context)
│   ├── PublicRoute
│   │   ├── Login
│   │   └── Signup
│   └── PrivateRoute
│       └── Layout
│           ├── Navbar
│           └── Outlet
│               ├── Dashboard
│               ├── Projects
│               └── ProjectDetail
```

### State Management
- **Global State**: AuthContext (user authentication)
- **Local State**: Component-level useState for forms and UI
- **Server State**: Axios requests with loading states

## 🔐 Security Features

### Backend
- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Role-based access control (RBAC)
- Input validation with express-validator
- Project access verification middleware
- SQL injection protection (Prisma ORM)

### Frontend
- Protected routes with authentication check
- Token storage in localStorage
- Automatic token inclusion in requests
- Form validation
- XSS protection (React's built-in escaping)

## 🎨 UI/UX Features

### Design System
- **Colors**: Primary blue theme (customizable in tailwind.config.js)
- **Typography**: System font stack
- **Components**: Card-based layout
- **Icons**: Lucide React icons
- **Responsive**: Mobile-first design

### Key UI Components
- **Badges**: Status and priority indicators
- **Cards**: Project and task containers
- **Modals**: Forms for creating projects/tasks
- **Kanban Board**: Drag-and-drop task management
- **Progress Bars**: Visual project completion
- **Statistics Cards**: Dashboard metrics

## 🚀 Build & Deployment

### Development
1. Backend runs on port 5000 (Express)
2. Frontend runs on port 5173 (Vite)
3. Vite proxy forwards `/api` to backend
4. Hot module replacement for fast development

### Production
1. Frontend builds to static files (`client/dist`)
2. Backend serves static files in production
3. Single deployment with both frontend and backend
4. Environment-based configuration

## 📦 Dependencies

### Backend
- **express**: Web framework
- **@prisma/client**: Database ORM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **express-validator**: Input validation
- **cors**: Cross-origin resource sharing
- **dotenv**: Environment variables

### Frontend
- **react**: UI library
- **react-router-dom**: Routing
- **axios**: HTTP client
- **tailwindcss**: Utility-first CSS
- **lucide-react**: Icon library
- **date-fns**: Date formatting
- **vite**: Build tool

## 🔄 Data Flow

### Authentication Flow
1. User submits login form
2. Frontend sends credentials to `/api/auth/login`
3. Backend validates and returns JWT token
4. Frontend stores token in localStorage
5. Token included in all subsequent requests
6. Backend middleware verifies token

### Task Creation Flow
1. User fills task form in ProjectDetail
2. Frontend sends POST to `/api/tasks`
3. Backend validates user has project access
4. Task created in database
5. Backend returns created task
6. Frontend updates UI with new task

### Dashboard Statistics Flow
1. Dashboard component mounts
2. Frontend requests `/api/dashboard/stats`
3. Backend queries all user's projects
4. Backend aggregates task statistics
5. Backend returns computed statistics
6. Frontend displays in stat cards

## 🧪 Testing Checklist

### Authentication
- [ ] User can sign up
- [ ] User can login
- [ ] Invalid credentials rejected
- [ ] Token persists across page refresh
- [ ] Logout clears token

### Projects
- [ ] User can create project
- [ ] User can view their projects
- [ ] User can update project
- [ ] User can delete project
- [ ] User can add team members

### Tasks
- [ ] User can create task
- [ ] User can update task status
- [ ] User can assign task
- [ ] User can set priority
- [ ] User can set due date
- [ ] User can delete task

### Dashboard
- [ ] Statistics display correctly
- [ ] Overdue tasks highlighted
- [ ] Recent tasks shown
- [ ] Progress calculated correctly

### Authorization
- [ ] Members can only access their projects
- [ ] Admins can access all projects
- [ ] Unauthorized access blocked
- [ ] Project access verified

## 🔧 Customization Guide

### Change Theme Colors
Edit `client/tailwind.config.js`:
```javascript
colors: {
  primary: {
    600: '#your-color',
    // ... other shades
  }
}
```

### Add New Task Status
1. Update `prisma/schema.prisma` enum
2. Run `npm run prisma:migrate`
3. Update frontend badge styles in `client/src/index.css`
4. Update status options in forms

### Add New User Role
1. Update `prisma/schema.prisma` enum
2. Run `npm run prisma:migrate`
3. Update middleware in `server/middleware/auth.js`
4. Update signup form in `client/src/pages/Signup.jsx`

## 📈 Performance Considerations

- Database indexes on foreign keys (Prisma default)
- Pagination for large task lists (to be implemented)
- Lazy loading of project details
- Optimistic UI updates
- Debounced search inputs
- Memoized computed values

## 🔮 Future Enhancements

- Real-time updates with WebSockets
- File attachments for tasks
- Task comments and activity log
- Email notifications
- Task filtering and search
- Drag-and-drop Kanban board
- Time tracking
- Gantt chart view
- Export to CSV/PDF
- Mobile app (React Native)
