const { initSchema } = require('../config/database');

console.log('Initializing PostgreSQL schema...');
initSchema()
  .then(() => {
    console.log('Schema initialized successfully.');
    console.log('Database: rating_app');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Schema initialization failed:', err.message);
    process.exit(1);
  });
