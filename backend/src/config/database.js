require('dotenv').config();
const { Pool } = require('pg');

const DB_NAME = process.env.DB_NAME || 'rating_app';

const getPoolConfig = (dbName = DB_NAME) => {
  if (process.env.DATABASE_URL) {
    return {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    };
  }
  return {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: dbName,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  };
};

const adminPool = new Pool(getPoolConfig('postgres'));

const ensureDb = async () => {
  if (process.env.DATABASE_URL) return;
  const { rows } = await adminPool.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`, [DB_NAME]
  );
  if (rows.length === 0) {
    await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);
    console.log(`Database "${DB_NAME}" created.`);
  }
  await adminPool.end();
};

const pool = new Pool(getPoolConfig());

const initSchema = async () => {
  await ensureDb();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(60) NOT NULL CHECK (char_length(name) >= 20),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      address VARCHAR(400) NOT NULL,
      role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'store_owner')),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS stores (
      id SERIAL PRIMARY KEY,
      name VARCHAR(60) NOT NULL,
      email VARCHAR(255) NOT NULL,
      address VARCHAR(400) NOT NULL,
      owner_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ratings (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      store_id INTEGER REFERENCES stores(id) ON DELETE CASCADE,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, store_id)
    );
  `);
  await pool.query('CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_stores_owner ON stores(owner_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_ratings_store ON ratings(store_id)');
  await pool.query('CREATE INDEX IF NOT EXISTS idx_ratings_user ON ratings(user_id)');
};

module.exports = { pool, initSchema };
