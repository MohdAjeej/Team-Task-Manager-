# 🔐 Role-Based Access Control (RBAC) Documentation

## Overview

The Team Task Manager implements comprehensive role-based access control with two user roles: **ADMIN** and **MEMBER**.

---

## 👥 User Roles

### ADMIN Role
**Full System Access** - Can perform all operations

**Permissions:**
- ✅ Create projects
- ✅ Update any project
- ✅ Delete any project
- ✅ Add team members to any project
- ✅ Remove team members from any project
- ✅ Create tasks in any project
- ✅ Update any task (title, description, status, priority, assignee, due date)
- ✅ Delete any task
- ✅ View all projects and tasks
- ✅ Assign tasks to anyone

### MEMBER Role
**Limited Access** - Can only work on assigned projects and tasks

**Permissions:**
- ✅ View projects they're a member of
- ✅ Create tasks in their projects
- ✅ Update **status only** of tasks assigned to them
- ✅ View all tasks in their projects
- ❌ Cannot create projects
- ❌ Cannot add/remove team members
- ❌ Cannot update task details (title, description, priority, assignee, due date)
- ❌ Cannot delete tasks
- ❌ Cannot update tasks not assigned to them

### Project Owner (Special)
**Project Creator** - Has admin-like permissions for their own projects

**Permissions:**
- ✅ Full control over their own projects
- ✅ Add/remove team members from their projects
- ✅ Create, update, and delete tasks in their projects
- ✅ Assign tasks to team members
- ✅ Update and delete their projects

---

## 🛡️ Access Control Rules

### Project Operations

#### Create Project
```
✅ ADMIN: Can create
✅ MEMBER: Can create
✅ Project Owner: N/A
```

#### Update Project
```
✅ ADMIN: Can update any project
✅ Project Owner: Can update their own projects
❌ MEMBER: Cannot update projects
```

#### Delete Project
```
✅ ADMIN: Can delete any project
✅ Project Owner: Can delete their own projects
❌ MEMBER: Cannot delete projects
```

#### Add Team Member
```
✅ ADMIN: Can add to any project
✅ Project Owner: Can add to their own projects
❌ MEMBER: Cannot add team members
```

#### Remove Team Member
```
✅ ADMIN: Can remove from any project
✅ Project Owner: Can remove from their own projects
❌ MEMBER: Cannot remove team members
```

### Task Operations

#### Create Task
```
✅ ADMIN: Can create in any project
✅ Project Owner: Can create in their own projects
✅ MEMBER: Can create in projects they're a member of
```

#### Update Task (Full)
```
✅ ADMIN: Can update any task
✅ Project Owner: Can update tasks in their own projects
❌ MEMBER: Cannot update task details
```

#### Update Task Status Only
```
✅ ADMIN: Can update any task status
✅ Project Owner: Can update any task status in their projects
✅ MEMBER: Can update status of tasks assigned to them
```

#### Delete Task
```
✅ ADMIN: Can delete any task
✅ Project Owner: Can delete tasks in their own projects
❌ MEMBER: Cannot delete tasks
```

---

## 🔒 Middleware Implementation

### Authentication Middleware
```javascript
export const authenticate = async (req, res, next) => {
  // Verifies JWT token
  // Attaches user to req.user
}
```

### Admin-Only Middleware
```javascript
export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ 
      error: 'Access denied. Admin privileges required.' 
    });
  }
  next();
}
```

### Project Owner or Admin Middleware
```javascript
export const requireProjectOwnerOrAdmin = async (req, res, next) => {
  // Checks if user is admin OR project creator
  // Returns 403 if neither
}
```

### Project Access Middleware
```javascript
export const checkProjectAccess = async (req, res, next) => {
  // Checks if user is admin, project creator, or team member
  // Returns 403 if no access
}
```

---

## 📋 API Endpoint Permissions

### Authentication Endpoints
| Endpoint | Method | Access |
|----------|--------|--------|
| `/api/auth/signup` | POST | Public |
| `/api/auth/login` | POST | Public |
| `/api/auth/me` | GET | Authenticated |
| `/api/auth/users` | GET | Authenticated |

### Project Endpoints
| Endpoint | Method | Access |
|----------|--------|--------|
| `/api/projects` | GET | Authenticated (own projects) |
| `/api/projects/:id` | GET | Project Member/Owner/Admin |
| `/api/projects` | POST | Authenticated |
| `/api/projects/:id` | PUT | Owner/Admin |
| `/api/projects/:id` | DELETE | Owner/Admin |
| `/api/projects/:id/members` | POST | Owner/Admin |
| `/api/projects/:id/members/:memberId` | DELETE | Owner/Admin |

### Task Endpoints
| Endpoint | Method | Access |
|----------|--------|--------|
| `/api/tasks/project/:projectId` | GET | Project Member/Owner/Admin |
| `/api/tasks/:id` | GET | Project Member/Owner/Admin |
| `/api/tasks` | POST | Project Member/Owner/Admin |
| `/api/tasks/:id` | PUT | Owner/Admin (full), Assignee (status only) |
| `/api/tasks/:id` | DELETE | Owner/Admin |

### Dashboard Endpoints
| Endpoint | Method | Access |
|----------|--------|--------|
| `/api/dashboard/stats` | GET | Authenticated |
| `/api/dashboard/my-tasks` | GET | Authenticated |

---

## 🎯 Usage Examples

### Example 1: Admin Creates Project and Adds Members
```javascript
// 1. Admin creates project
POST /api/projects
Headers: { Authorization: "Bearer <admin-token>" }
Body: { name: "New Project", description: "..." }
✅ Success

// 2. Admin adds team member
POST /api/projects/:projectId/members
Headers: { Authorization: "Bearer <admin-token>" }
Body: { userId: "member-id", role: "MEMBER" }
✅ Success
```

### Example 2: Member Tries to Add Team Member
```javascript
// Member tries to add team member
POST /api/projects/:projectId/members
Headers: { Authorization: "Bearer <member-token>" }
Body: { userId: "another-user-id" }
❌ 403 Forbidden: "Access denied. Only project owner or admin can perform this action."
```

### Example 3: Member Updates Their Task Status
```javascript
// Member updates status of assigned task
PUT /api/tasks/:taskId
Headers: { Authorization: "Bearer <member-token>" }
Body: { status: "IN_PROGRESS" }
✅ Success (status only)

// Member tries to update task title
PUT /api/tasks/:taskId
Headers: { Authorization: "Bearer <member-token>" }
Body: { title: "New Title" }
❌ 403 Forbidden: "Access denied. Members can only update task status."
```

### Example 4: Member Tries to Update Unassigned Task
```javascript
// Member tries to update task not assigned to them
PUT /api/tasks/:taskId
Headers: { Authorization: "Bearer <member-token>" }
Body: { status: "COMPLETED" }
❌ 403 Forbidden: "Access denied. Members can only update their assigned tasks."
```

---

## 🔍 Error Responses

### 401 Unauthorized
```json
{
  "error": "Authentication required"
}
```
**Cause**: No token or invalid token

### 403 Forbidden
```json
{
  "error": "Access denied. Admin privileges required."
}
```
**Cause**: User doesn't have required permissions

```json
{
  "error": "Access denied. Only project owner or admin can perform this action."
}
```
**Cause**: User is not project owner or admin

```json
{
  "error": "Access denied. Members can only update their assigned tasks."
}
```
**Cause**: Member trying to update task not assigned to them

```json
{
  "error": "Access denied. Members can only update task status."
}
```
**Cause**: Member trying to update task fields other than status

### 404 Not Found
```json
{
  "error": "Project not found"
}
```
**Cause**: Project doesn't exist

---

## 🧪 Testing Role-Based Access

### Test Scenario 1: Admin Permissions
1. Create admin user
2. Login as admin
3. Create project ✅
4. Add team members ✅
5. Create tasks ✅
6. Update any task ✅
7. Delete tasks ✅

### Test Scenario 2: Member Permissions
1. Create member user
2. Login as member
3. Try to add team member ❌ (should fail)
4. View assigned tasks ✅
5. Update status of assigned task ✅
6. Try to update task title ❌ (should fail)
7. Try to delete task ❌ (should fail)

### Test Scenario 3: Project Owner Permissions
1. Create member user
2. Login as member
3. Create project ✅
4. Add team members to own project ✅
5. Update own project ✅
6. Delete own project ✅

---

## 🎓 Best Practices

### 1. Always Check Permissions
```javascript
// ❌ Bad: No permission check
router.delete('/projects/:id', authenticate, async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
});

// ✅ Good: Permission check
router.delete('/projects/:id', authenticate, requireProjectOwnerOrAdmin, async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
});
```

### 2. Use Middleware for Reusable Checks
```javascript
// ✅ Good: Reusable middleware
router.put('/projects/:id', authenticate, requireProjectOwnerOrAdmin, updateProject);
router.delete('/projects/:id', authenticate, requireProjectOwnerOrAdmin, deleteProject);
```

### 3. Provide Clear Error Messages
```javascript
// ✅ Good: Clear error message
if (req.user.role !== 'ADMIN') {
  return res.status(403).json({ 
    error: 'Access denied. Admin privileges required.' 
  });
}
```

### 4. Log Access Attempts
```javascript
// ✅ Good: Log unauthorized attempts
if (req.user.role !== 'ADMIN') {
  console.log(`Unauthorized access attempt by user ${req.user.id}`);
  return res.status(403).json({ error: 'Access denied' });
}
```

---

## 📊 Permission Matrix

| Action | Admin | Project Owner | Member |
|--------|-------|---------------|--------|
| Create Project | ✅ | ✅ | ✅ |
| Update Own Project | ✅ | ✅ | ❌ |
| Update Any Project | ✅ | ❌ | ❌ |
| Delete Own Project | ✅ | ✅ | ❌ |
| Delete Any Project | ✅ | ❌ | ❌ |
| Add Team Member (Own) | ✅ | ✅ | ❌ |
| Add Team Member (Any) | ✅ | ❌ | ❌ |
| Remove Team Member (Own) | ✅ | ✅ | ❌ |
| Remove Team Member (Any) | ✅ | ❌ | ❌ |
| Create Task (Own Project) | ✅ | ✅ | ✅ |
| Create Task (Any Project) | ✅ | ❌ | ❌ |
| Update Task (Full) | ✅ | ✅ (own) | ❌ |
| Update Task Status (Assigned) | ✅ | ✅ | ✅ |
| Update Task Status (Any) | ✅ | ✅ (own) | ❌ |
| Delete Task (Own Project) | ✅ | ✅ | ❌ |
| Delete Task (Any Project) | ✅ | ❌ | ❌ |

---

## ✅ Summary

**Role-Based Access Control is now fully implemented!**

- ✅ Admin can do everything
- ✅ Project owners have full control over their projects
- ✅ Members can only view and update status of assigned tasks
- ✅ All endpoints are protected with proper middleware
- ✅ Clear error messages for unauthorized access
- ✅ Comprehensive permission checks

**Status**: Production-Ready ✅
