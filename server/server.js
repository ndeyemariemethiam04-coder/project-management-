require('dotenv').config();
const app = require('./src/app');
const prisma = require('./src/config/db');

const PORT = process.env.PORT || 5001;

function main() {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

main();
