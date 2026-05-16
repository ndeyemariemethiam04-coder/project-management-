const { PrismaClient } = require('@prisma/client');

// Using PostgreSQL via DATABASE_URL
const prisma = new PrismaClient({
  log: ['error', 'warn'],
});

module.exports = prisma;
