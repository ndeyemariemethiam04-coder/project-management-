const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { authenticate } = require('../middleware/auth.middleware');
const prisma = new PrismaClient();

router.get('/', authenticate, async (req, res) => {
  const columns = await prisma.column.findMany({ where: { projectId: parseInt(req.query.projectId) } });
  res.json(columns);
});

module.exports = router;
