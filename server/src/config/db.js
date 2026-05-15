const { PrismaClient } = require('@prisma/client');
const path = require('path');

let dbUrl;

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
  // Use Production Database (MySQL/Postgres/etc) if provided in environment
  dbUrl = process.env.DATABASE_URL;
  console.log('🌐 Connecting to Production Database');
} else {
  // Use Local SQLite Database
  const dbPath = path.join(__dirname, '../../prisma/dev.db');
  dbUrl = `file:${dbPath}`;
  console.log(`🏠 Connecting to Local SQLite: ${dbUrl}`);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
  log: ['error', 'warn'],
});

module.exports = prisma;
