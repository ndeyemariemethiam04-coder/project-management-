const { PrismaClient } = require('@prisma/client');
const path = require('path');

let dbUrl;
const isSqlite = true; // Set this to false if you ever switch the schema.prisma back to mysql

if (process.env.DATABASE_URL && process.env.DATABASE_URL.startsWith('file:')) {
  // Use SQLite path from environment if provided
  dbUrl = process.env.DATABASE_URL;
  console.log('🌐 Connecting to Production SQLite Database');
} else if (process.env.DATABASE_URL && !isSqlite) {
  // Use Production MySQL/Postgres if we are NOT using SQLite schema
  dbUrl = process.env.DATABASE_URL;
  console.log('🌐 Connecting to Production MySQL/Postgres Database');
} else {
  // Default to Local SQLite
  const dbPath = path.join(__dirname, '../../prisma/dev.db');
  dbUrl = `file:${dbPath}`;
  console.log(`🏠 Using SQLite Database: ${dbUrl}`);
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
