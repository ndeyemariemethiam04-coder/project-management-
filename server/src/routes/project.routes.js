const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth.middleware');
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { members: { some: { userId: req.user.id } } },
    include: { columns: { include: { tasks: true } } }
  });
  res.json(projects);
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
      include: { columns: { include: { tasks: true } } }
    });
    
    res.status(201).json(projectWithData);
  } catch (err) {
    console.error('Project creation error:', err);
    res.status(500).json({ error: 'Failed to create project. Please try again.' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(req.params.id) },
    include: { columns: { include: { tasks: true } }, members: { include: { user: true } } }
  });
  res.json(project);
});

module.exports = router;
