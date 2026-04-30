import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get dashboard statistics
router.get('/stats', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Get user's projects
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { teamMembers: { some: { userId } } }
        ]
      },
      select: { id: true }
    });

    const projectIds = userProjects.map(p => p.id);

    // Get all tasks for user's projects
    const allTasks = await prisma.task.findMany({
      where: {
        projectId: { in: projectIds }
      },
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true, email: true } }
      }
    });

    // Calculate statistics
    const totalTasks = allTasks.length;
    const todoTasks = allTasks.filter(t => t.status === 'TODO').length;
    const inProgressTasks = allTasks.filter(t => t.status === 'IN_PROGRESS').length;
    const completedTasks = allTasks.filter(t => t.status === 'COMPLETED').length;
    
    const overdueTasks = allTasks.filter(t => 
      t.dueDate && new Date(t.dueDate) < now && t.status !== 'COMPLETED'
    );

    const myTasks = allTasks.filter(t => t.assigneeId === userId);

    res.json({
      totalProjects: projectIds.length,
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueCount: overdueTasks.length,
      myTasksCount: myTasks.length,
      overdueTasks: overdueTasks.map(t => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        project: t.project.name,
        assignee: t.assignee?.name
      })),
      recentTasks: allTasks.slice(0, 5).map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        project: t.project.name,
        assignee: t.assignee?.name,
        dueDate: t.dueDate
      }))
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
});

// Get my assigned tasks
router.get('/my-tasks', authenticate, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { assigneeId: req.user.id },
      include: {
        project: { select: { id: true, name: true } },
        creator: { select: { name: true } }
      },
      orderBy: { dueDate: 'asc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error('My tasks error:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

export default router;
