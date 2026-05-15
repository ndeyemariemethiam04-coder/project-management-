const express = require('express');
const router = express.Router();
const prisma = require('../config/db');
const { authenticate } = require('../middleware/auth.middleware');

router.get('/', authenticate, async (req, res) => {
  const columns = await prisma.column.findMany({ where: { projectId: parseInt(req.query.projectId) } });
  res.json(columns);
});

module.exports = router;
