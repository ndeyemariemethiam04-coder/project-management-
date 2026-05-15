const app = require('./src/app');
const prisma = require('./src/config/db');

const PORT = process.env.PORT || 5000;

function main() {
  // Prisma will connect lazily on the first request, speeding up startup
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

main();
