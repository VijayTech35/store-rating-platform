const { pool } = require('../config/database');

const Rating = {
  async upsert({ user_id, store_id, rating }) {
    await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = $3, updated_at = NOW()`,
      [user_id, store_id, rating]
    );
    return this.findByUserAndStore(user_id, store_id);
  },

  async findByUserAndStore(user_id, store_id) {
    const { rows } = await pool.query(
      'SELECT * FROM ratings WHERE user_id = $1 AND store_id = $2',
      [user_id, store_id]
    );
    return rows[0] || null;
  },

  async findByStore(store_id) {
    const { rows } = await pool.query(
      `SELECT r.id, r.rating, r.created_at, r.updated_at,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [store_id]
    );
    return rows;
  },

  async getAverageRating(store_id) {
    const { rows } = await pool.query(
      'SELECT ROUND(AVG(rating)::numeric, 2)::float as avg FROM ratings WHERE store_id = $1',
      [store_id]
    );
    return rows[0]?.avg || 0;
  },

  async getCount() {
    const { rows } = await pool.query('SELECT COUNT(*)::int as count FROM ratings');
    return rows[0].count;
  },

  async delete(id) {
    await pool.query('DELETE FROM ratings WHERE id = $1', [id]);
  },
};

module.exports = Rating;
