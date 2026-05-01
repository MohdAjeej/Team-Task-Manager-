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

    // Get user's projects (with team-member counts in one shot)
    const userProjects = await prisma.project.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { teamMembers: { some: { userId } } }
        ]
      },
      select: {
        id: true,
        name: true,
        _count: { select: { teamMembers: true } }
      }
    });

    const projectIds = userProjects.map(p => p.id);

    // Get all tasks for user's projects
    const allTasks = await prisma.task.findMany({
      where: { projectId: { in: projectIds } },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { name: true, email: true } }
      },
      orderBy: { updatedAt: 'desc' }
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

    // Per-project progress (creator counts as a member, so +1)
    const projectProgress = userProjects.map(p => {
      const projTasks = allTasks.filter(t => t.projectId === p.id);
      const projDone = projTasks.filter(t => t.status === 'COMPLETED').length;
      return {
        id: p.id,
        name: p.name,
        completedTasks: projDone,
        totalTasks: projTasks.length,
        memberCount: (p._count?.teamMembers || 0) + 1
      };
    }).sort((a, b) => b.totalTasks - a.totalTasks);

    // Shipped this week
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const shippedThisWeek = allTasks.filter(t =>
      t.status === 'COMPLETED' && new Date(t.updatedAt) >= weekAgo
    ).length;

    res.json({
      totalProjects: projectIds.length,
      totalTasks,
      todoTasks,
      inProgressTasks,
      completedTasks,
      overdueCount: overdueTasks.length,
      myTasksCount: myTasks.length,
      shippedThisWeek,
      overdueTasks: overdueTasks.slice(0, 6).map(t => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        project: t.project.name,
        projectId: t.project.id,
        assignee: t.assignee?.name
      })),
      recentTasks: allTasks.slice(0, 5).map(t => ({
        id: t.id,
        title: t.title,
        status: t.status,
        priority: t.priority,
        project: t.project.name,
        projectId: t.project.id,
        assignee: t.assignee?.name,
        dueDate: t.dueDate
      })),
      projectProgress
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Error fetching dashboard statistics' });
  }
});

// Recent activity feed (last 10 task changes for user's projects)
router.get('/activity', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
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

    const recentTasks = await prisma.task.findMany({
      where: { projectId: { in: projectIds } },
      include: {
        project: { select: { id: true, name: true } },
        assignee: { select: { name: true } },
        creator: { select: { name: true } }
      },
      orderBy: { updatedAt: 'desc' },
      take: 10
    });

    res.json(recentTasks.map(t => ({
      id: t.id,
      title: t.title,
      status: t.status,
      priority: t.priority,
      project: t.project.name,
      projectId: t.project.id,
      assignee: t.assignee?.name || null,
      creator: t.creator?.name || null,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt
    })));
  } catch (error) {
    console.error('Dashboard activity error:', error);
    res.status(500).json({ error: 'Error fetching activity' });
  }
});

// Get my team — everyone who shares at least one project with me (myself included)
router.get('/team', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Projects the current user belongs to (as creator OR team member)
    const myProjects = await prisma.project.findMany({
      where: {
        OR: [
          { creatorId: userId },
          { teamMembers: { some: { userId } } }
        ]
      },
      select: {
        creatorId: true,
        teamMembers: { select: { userId: true } }
      }
    });

    // Collect every distinct userId across those projects, plus self
    const userIds = new Set([userId]);
    for (const p of myProjects) {
      userIds.add(p.creatorId);
      p.teamMembers.forEach(tm => userIds.add(tm.userId));
    }

    const users = await prisma.user.findMany({
      where: { id: { in: [...userIds] } },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
      orderBy: { name: 'asc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Team fetch error:', error);
    res.status(500).json({ error: 'Error fetching team' });
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
