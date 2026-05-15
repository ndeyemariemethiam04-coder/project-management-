const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { members: { some: { userId: req.user.id } } },
      include: { 
        columns: { include: { tasks: true } },
        members: true
      }
    });

    const projectsWithRole = projects.map(project => {
      const myMembership = project.members.find(m => m.userId === req.user.id);
      return {
        ...project,
        myRole: myMembership ? myMembership.role : 'MEMBER'
      };
    });

    res.json(projectsWithRole);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        color: color || '#6366f1',
        ownerId: req.user.id,
        members: { create: { userId: req.user.id, role: 'OWNER' } },
        columns: { create: [{ name: 'To Do', order: 0 }, { name: 'Ongoing', order: 1 }, { name: 'Done', order: 2 }] }
      }
    });

    const projectWithData = await prisma.project.findUnique({
      where: { id: project.id },
      include: { 
        columns: { include: { tasks: true } },
        members: true
      }
    });
    
    res.status(201).json({ ...projectWithData, myRole: 'OWNER' });
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { 
        columns: { include: { tasks: true } }, 
        members: { include: { user: true } } 
      }
    });
    
    if (!project) return res.status(404).json({ error: 'Project not found' });
    
    const myMembership = project.members.find(m => m.userId === req.user.id);
    res.json({ ...project, myRole: myMembership ? myMembership.role : 'MEMBER' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

router.delete('/:id', authenticate, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = await prisma.project.findUnique({ where: { id: projectId } });

    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Only the owner can delete the project' });
    }

    await prisma.project.delete({ where: { id: projectId } });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

module.exports = router;
