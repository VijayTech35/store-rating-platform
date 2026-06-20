const db = require('../config/database');

const Store = {
  create({ name, email, address, owner_id }) {
    const stmt = db.prepare(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES (?, ?, ?, ?)`
    );
    const info = stmt.run(name, email, address, owner_id);
    return this.findById(info.lastInsertRowid);
  },

  findById(id) {
    return db.prepare(
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
              ROUND(AVG(r.rating), 2) as avg_rating,
              COUNT(r.id) as rating_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.id = ?
       GROUP BY s.id`
    ).get(id);
  },

  findAll({ search, sortBy = 'name', sortOrder = 'ASC', limit = 100, offset = 0 } = {}) {
    const allowedSortColumns = ['name', 'email', 'address', 'avg_rating', 'created_at'];
    const column = allowedSortColumns.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const conditions = [];
    const params = [];

    if (search) {
      conditions.push('(s.name LIKE ? OR s.email LIKE ? OR s.address LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = db.prepare(`SELECT COUNT(*) as count FROM stores s ${whereClause}`).get(...params);
    const total = countRow.count;

    const orderBy = column === 'avg_rating' ? 'avg_rating' : `s.${column}`;

    const stores = db.prepare(
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
              ROUND(AVG(r.rating), 2) as avg_rating,
              COUNT(r.id) as rating_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${whereClause}
       GROUP BY s.id
       ORDER BY ${orderBy} ${order}
       LIMIT ? OFFSET ?`
    ).all(...params, limit, offset);

    return { stores, total };
  },

  getCount() {
    return db.prepare('SELECT COUNT(*) as count FROM stores').get().count;
  },

  update(id, fields) {
    const setClauses = [];
    const params = [];
    if (fields.name !== undefined) { setClauses.push('name = ?'); params.push(fields.name); }
    if (fields.email !== undefined) { setClauses.push('email = ?'); params.push(fields.email); }
    if (fields.address !== undefined) { setClauses.push('address = ?'); params.push(fields.address); }
    if (fields.owner_id !== undefined) { setClauses.push('owner_id = ?'); params.push(fields.owner_id); }
    if (setClauses.length === 0) return this.findById(id);
    setClauses.push("updated_at = datetime('now')");
    params.push(id);
    db.prepare(`UPDATE stores SET ${setClauses.join(', ')} WHERE id = ?`).run(...params);
    return this.findById(id);
  },

  delete(id) {
    db.prepare('DELETE FROM ratings WHERE store_id = ?').run(id);
    db.prepare('DELETE FROM stores WHERE id = ?').run(id);
  },
};

module.exports = Store;
