import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  next();
};

export const requireProjectOwnerOrAdmin = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Allow if user is admin or project creator
    if (req.user.role === 'ADMIN' || project.creatorId === req.user.id) {
      next();
    } else {
      return res.status(403).json({ error: 'Access denied. Only project owner or admin can perform this action.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error checking permissions' });
  }
};

export const checkProjectAccess = async (req, res, next) => {
  try {
    const projectId = req.params.projectId || req.body.projectId;
    
    const access = await prisma.teamMember.findFirst({
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

    if (!access && !isCreator && req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Access denied to this project' });
    }

    req.projectAccess = access || isCreator;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Error checking project access' });
  }
};
