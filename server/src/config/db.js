const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Simple, reliable path calculation
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'prisma/dev.db')}`,
    },
  },
  log: ['error', 'warn'],
});

module.exports = prisma;
