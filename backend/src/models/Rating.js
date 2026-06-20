const db = require('../config/database');

const Rating = {
  upsert({ user_id, store_id, rating }) {
    const existing = db.prepare(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?'
    ).get(user_id, store_id);

    if (existing) {
      db.prepare(
        'UPDATE ratings SET rating = ?, updated_at = datetime(\'now\') WHERE user_id = ? AND store_id = ?'
      ).run(rating, user_id, store_id);
    } else {
      db.prepare(
        'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)'
      ).run(user_id, store_id, rating);
    }

    return this.findByUserAndStore(user_id, store_id);
  },

  findByUserAndStore(user_id, store_id) {
    return db.prepare(
      'SELECT * FROM ratings WHERE user_id = ? AND store_id = ?'
    ).get(user_id, store_id);
  },

  findByStore(store_id) {
    return db.prepare(
      `SELECT r.id, r.rating, r.created_at, r.updated_at,
              u.id as user_id, u.name as user_name, u.email as user_email
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`
    ).all(store_id);
  },

  getAverageRating(store_id) {
    const row = db.prepare(
      'SELECT ROUND(AVG(rating), 2) as avg FROM ratings WHERE store_id = ?'
    ).get(store_id);
    return row.avg || 0;
  },

  getCount() {
    return db.prepare('SELECT COUNT(*) as count FROM ratings').get().count;
  },

  delete(id) {
    db.prepare('DELETE FROM ratings WHERE id = ?').run(id);
  },
};

module.exports = Rating;
