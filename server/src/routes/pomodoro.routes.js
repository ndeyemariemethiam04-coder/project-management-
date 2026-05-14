const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth.middleware');
const prisma = new PrismaClient();

router.post('/', authenticate, async (req, res) => {
  const session = await prisma.pomodoroSession.create({
    data: { userId: req.user.id, duration: req.body.duration, completed: true }
  });
  res.json(session);
});

router.get('/stats', authenticate, async (req, res) => {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const count = await prisma.pomodoroSession.count({
    where: {
      userId: req.user.id,
      completed: true,
      startedAt: { gte: startOfDay }
    }
  });
  res.json({ count });
});

module.exports = router;
