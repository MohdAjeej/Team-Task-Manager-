import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { authenticate, checkProjectAccess, requireProjectOwnerOrAdmin } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Get all projects for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { creatorId: req.user.id },
          { teamMembers: { some: { userId: req.user.id } } }
        ]
      },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        teamMembers: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } }
          }
        },
        tasks: {
          select: {
            id: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Error fetching projects' });
  }
});

// Get single project
router.get('/:projectId', authenticate, checkProjectAccess, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: req.params.projectId },
      include: {
        creator: { select: { id: true, name: true, email: true } },
        teamMembers: {
          include: {
            user: { select: { id: true, name: true, email: true, role: true } }
          }
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, email: true } },
            creator: { select: { id: true, name: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Error fetching project' });
  }
});

// Create project
router.post('/',
  authenticate,
  [
    body('name').trim().notEmpty(),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;

      const project = await prisma.project.create({
        data: {
          name,
          description,
          creatorId: req.user.id
        },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          teamMembers: true
        }
      });

      res.status(201).json(project);
    } catch (error) {
      console.error('Create project error:', error);
      res.status(500).json({ error: 'Error creating project' });
    }
  }
);

// Update project (Only owner or admin)
router.put('/:projectId',
  authenticate,
  requireProjectOwnerOrAdmin,
  [
    body('name').optional().trim().notEmpty(),
    body('description').optional().trim()
  ],
  async (req, res) => {
    try {
      const { name, description } = req.body;

      const project = await prisma.project.update({
        where: { id: req.params.projectId },
        data: { name, description },
        include: {
          creator: { select: { id: true, name: true, email: true } },
          teamMembers: {
            include: {
              user: { select: { id: true, name: true, email: true } }
            }
          }
        }
      });

      res.json(project);
    } catch (error) {
      console.error('Update project error:', error);
      res.status(500).json({ error: 'Error updating project' });
    }
  }
);

// Delete project (Only owner or admin)
router.delete('/:projectId', authenticate, requireProjectOwnerOrAdmin, async (req, res) => {
  try {
    await prisma.project.delete({
      where: { id: req.params.projectId }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Error deleting project' });
  }
});

// Add team member (Only owner or admin)
router.post('/:projectId/members',
  authenticate,
  requireProjectOwnerOrAdmin,
  [body('userId').notEmpty()],
  async (req, res) => {
    try {
      const { userId, role } = req.body;

      const teamMember = await prisma.teamMember.create({
        data: {
          userId,
          projectId: req.params.projectId,
          role: role || 'MEMBER'
        },
        include: {
          user: { select: { id: true, name: true, email: true, role: true } }
        }
      });

      res.status(201).json(teamMember);
    } catch (error) {
      console.error('Add team member error:', error);
      res.status(500).json({ error: 'Error adding team member' });
    }
  }
);

// Remove team member (Only owner or admin)
router.delete('/:projectId/members/:memberId', authenticate, requireProjectOwnerOrAdmin, async (req, res) => {
  try {
    await prisma.teamMember.delete({
      where: { id: req.params.memberId }
    });

    res.json({ message: 'Team member removed successfully' });
  } catch (error) {
    console.error('Remove team member error:', error);
    res.status(500).json({ error: 'Error removing team member' });
  }
});

export default router;
