const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/', authenticate, async (req, res) => {
  const task = await prisma.task.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority,
      columnId: parseInt(req.body.columnId)
    }
  });
  res.json(task);
});

router.patch('/:id/move', authenticate, async (req, res) => {
  const task = await prisma.task.update({
    where: { id: parseInt(req.params.id) },
    data: { columnId: parseInt(req.body.columnId), order: req.body.order }
  });
  res.json(task);
});

router.delete('/:id', authenticate, async (req, res) => {
  await prisma.task.delete({ where: { id: parseInt(req.params.id) } });
  res.json({ success: true });
});

module.exports = router;
