import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, checkProjectAccess } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all tasks for a project
router.get('/project/:projectId', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { projectId: req.params.projectId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Get single task
router.get('/:taskId', authenticate, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
      include: {
        assignee: { select: { id: true, name: true, email: true } },
        creator: { select: { id: true, name: true } },
        project: { select: { id: true, name: true } }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Error fetching task' });
  }
});

// Create task (Only project members, owner, or admin)
router.post('/',
  authenticate,
  [
    body('title').trim().notEmpty(),
    body('description').optional().trim(),
    body('projectId').notEmpty(),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('dueDate').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, projectId, assigneeId, status, priority, dueDate } = req.body;

      // Check if user has access to this project
      const hasAccess = await prisma.teamMember.findFirst({
        where: {
          projectId,
          userId: req.user.id
        }
      });

      const isCreator = await prisma.project.findFirst({
        where: {
          id: projectId,
          creatorId: req.user.id
        }
      });

      if (!hasAccess && !isCreator && req.user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Access denied. You must be a project member to create tasks.' });
      }

      const task = await prisma.task.create({
        data: {
          title,
          description,
          projectId,
          creatorId: req.user.id,
          assigneeId,
          status: status || 'TODO',
          priority: priority || 'MEDIUM',
          dueDate: dueDate ? new Date(dueDate) : null
        },
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          creator: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } }
        }
      });

      res.status(201).json(task);
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({ error: 'Error creating task' });
    }
  }
);

// Update task
router.put('/:taskId',
  authenticate,
  [
    body('title').optional().trim().notEmpty(),
    body('description').optional().trim(),
    body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE']),
    body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']),
    body('dueDate').optional().isISO8601()
  ],
  async (req, res) => {
    try {
      const { title, description, assigneeId, status, priority, dueDate } = req.body;

      // Get the task to check permissions
      const task = await prisma.task.findUnique({
        where: { id: req.params.taskId },
        include: { project: true }
      });

      if (!task) {
        return res.status(404).json({ error: 'Task not found' });
      }

      // Check if user has access to this project
      const hasAccess = await prisma.teamMember.findFirst({
        where: {
          projectId: task.projectId,
          userId: req.user.id
        }
      });

      const isCreator = task.project.creatorId === req.user.id;
      const isAssignee = task.assigneeId === req.user.id;

      // Members can only update status of their assigned tasks
      if (req.user.role === 'MEMBER' && !isCreator) {
        if (!isAssignee) {
          return res.status(403).json({ error: 'Access denied. Members can only update their assigned tasks.' });
        }
        // Members can only update status
        if (title || description || assigneeId || priority || dueDate) {
          return res.status(403).json({ error: 'Access denied. Members can only update task status.' });
        }
      }

      // Admins and project owners can update everything
      if (req.user.role !== 'ADMIN' && !isCreator && !hasAccess) {
        return res.status(403).json({ error: 'Access denied.' });
      }

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (assigneeId !== undefined) updateData.assigneeId = assigneeId;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

      const updatedTask = await prisma.task.update({
        where: { id: req.params.taskId },
        data: updateData,
        include: {
          assignee: { select: { id: true, name: true, email: true } },
          creator: { select: { id: true, name: true } },
          project: { select: { id: true, name: true } }
        }
      });

      res.json(updatedTask);
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({ error: 'Error updating task' });
    }
  }
);

// Delete task (Only admin or project owner)
router.delete('/:taskId', authenticate, async (req, res) => {
  try {
    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
      include: { project: true }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Only admin or project owner can delete tasks
    if (req.user.role !== 'ADMIN' && task.project.creatorId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied. Only admin or project owner can delete tasks.' });
    }

    await prisma.task.delete({
      where: { id: req.params.taskId }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});

export default router;
