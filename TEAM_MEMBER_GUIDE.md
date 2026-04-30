# 👥 Team Member Management Guide

## ✅ New Feature Added: Add Team Members to Projects!

I've added the ability to add and remove team members from projects.

## 🎯 How to Use

### 1. Add Team Members

1. **Open a project** - Click on any project from the Projects page
2. **Find the Team Members section** - You'll see it below the project title
3. **Click "Add Member" button** - Only visible to project owners and admins
4. **Select a user** - Choose from the dropdown list
5. **Choose role** - Select Member or Admin
6. **Click "Add Member"** - The user will be added to the project

### 2. Remove Team Members

1. **Open a project** - Go to the project detail page
2. **Find the team member** - Look in the Team Members section
3. **Click the X button** - Next to the member's name
4. **Confirm removal** - Click OK in the confirmation dialog

### 3. Team Member Count

The team member count now shows:
- **Owner** (always counted)
- **All added members**

Example: "Team Members (3)" means 1 owner + 2 members

## 🔐 Permissions

### Who Can Add Members?
- ✅ Project Owner (creator)
- ✅ Admin users

### Who Can Remove Members?
- ✅ Project Owner (creator)
- ✅ Admin users

### Who Can See the Add Button?
- ✅ Project Owner
- ✅ Admin users
- ❌ Regular members (can only view)

## 🎨 UI Features

### Team Member Display
- **Owner Badge** - Blue badge with "Owner" label
- **Member Badges** - Gray badges with member names
- **Remove Button** - X icon to remove members (only for owners/admins)
- **Add Button** - "Add Member" button with UserPlus icon

### Add Member Modal
- **User Dropdown** - Shows all users not already in the project
- **Role Selection** - Choose Member or Admin role
- **Email Display** - Shows user email for easy identification

## 📝 Example Workflow

### Scenario: Adding a Team Member

1. **Login as project owner**
   - Email: admin@example.com
   - Password: admin123

2. **Create a project**
   - Name: "Website Redesign"
   - Description: "Redesign company website"

3. **Add team members**
   - Click "Add Member"
   - Select "John Doe (john@example.com)"
   - Choose role: "Member"
   - Click "Add Member"

4. **Verify**
   - Team Members count increases
   - John Doe appears in the list
   - John can now see the project

5. **Assign tasks**
   - Create a task
   - Assign to John Doe
   - John can now work on the task

## 🔄 How It Works

### Backend API
- `GET /api/auth/users` - Get all users for the dropdown
- `POST /api/projects/:id/members` - Add a team member
- `DELETE /api/projects/:id/members/:memberId` - Remove a team member

### Database
- **TeamMember table** stores the relationship
- **userId** - The user being added
- **projectId** - The project they're added to
- **role** - Their role (MEMBER or ADMIN)

## ✨ Features

### ✅ What's Included
- Add team members to projects
- Remove team members from projects
- View all team members
- Role-based permissions
- User dropdown with email
- Member count display
- Owner identification
- Remove confirmation dialog

### 🎯 Benefits
- Collaborate with team members
- Assign tasks to specific people
- Control project access
- Track team composition
- Manage permissions

## 🆘 Troubleshooting

### "No users available to add"
- All users are already in the project
- Create more user accounts first

### "Failed to add team member"
- User might already be in the project
- Check server logs for errors
- Verify database connection

### "Add Member button not showing"
- You must be the project owner or admin
- Login with the correct account

### "Can't remove team member"
- Only owners and admins can remove members
- Can't remove the project owner

## 🎉 Try It Now!

1. **Restart your application** (if running):
   ```bash
   # Stop with Ctrl+C
   npm run dev
   ```

2. **Create multiple users**:
   - User 1: admin@example.com (Admin)
   - User 2: member1@example.com (Member)
   - User 3: member2@example.com (Member)

3. **Login as admin**

4. **Create a project**

5. **Add team members**

6. **Assign tasks to them**

7. **See the collaboration in action!**

## 📊 Team Member Roles

### MEMBER Role
- Can view project
- Can create tasks
- Can update tasks
- Can view team members
- Cannot add/remove members

### ADMIN Role
- All MEMBER permissions
- Can add team members
- Can remove team members
- Can manage project settings

## 🚀 Next Steps

Now that you can add team members:
1. Create multiple user accounts
2. Add them to your projects
3. Assign tasks to specific members
4. Track who's working on what
5. Collaborate effectively!

---

**Feature Status**: ✅ Complete and Ready to Use!

**Restart Required**: Yes (restart `npm run dev`)
