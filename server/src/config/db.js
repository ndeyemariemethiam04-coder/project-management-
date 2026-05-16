const { PrismaClient } = require('@prisma/client');
const path = require('path');

let dbUrl;

if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:')) {
  // Use Production Database
  dbUrl = process.env.DATABASE_URL;
  console.log('🌐 Connecting to Production Database');
} else {
  // Use Local SQLite Database with encoded path for spaces
  const dbPath = path.join(__dirname, '../../prisma/dev.db');
  // Encode the path to handle spaces safely in the URL
  const encodedPath = dbPath.split(path.sep).map(encodeURIComponent).join(path.sep);
  dbUrl = `file:${dbPath}`; // Prisma actually prefers the raw path on disk for SQLite
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
