const { pool } = require('../config/database');

const Store = {
  async create({ name, email, address, owner_id }) {
    const { rows } = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4) RETURNING id`,
      [name, email, address, owner_id]
    );
    return this.findById(rows[0].id);
  },

  async findById(id) {
    const { rows } = await pool.query(
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
              ROUND(AVG(r.rating)::numeric, 2)::float as avg_rating,
              COUNT(r.id)::int as rating_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.id = $1
       GROUP BY s.id`,
      [id]
    );
    return rows[0] || null;
  },

  async findAll({ search, sortBy = 'name', sortOrder = 'ASC', limit = 100, offset = 0 } = {}) {
    const allowedSortColumns = ['name', 'email', 'address', 'avg_rating', 'created_at'];
    const column = allowedSortColumns.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const params = [];
    const clauses = [];

    if (search) {
      clauses.push(`(s.name ILIKE $${params.length + 1} OR s.email ILIKE $${params.length + 2} OR s.address ILIKE $${params.length + 3})`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';
    const orderBy = column === 'avg_rating' ? 'avg_rating' : `s.${column}`;

    const countResult = await pool.query(`SELECT COUNT(*)::int as count FROM stores s ${whereClause}`, params);
    const total = countResult.rows[0].count;

    const { rows: stores } = await pool.query(
      `SELECT s.id, s.name, s.email, s.address, s.owner_id, s.created_at,
              ROUND(AVG(r.rating)::numeric, 2)::float as avg_rating,
              COUNT(r.id)::int as rating_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       ${whereClause}
       GROUP BY s.id
       ORDER BY ${orderBy} ${order}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return { stores, total };
  },

  async getCount() {
    const { rows } = await pool.query('SELECT COUNT(*)::int as count FROM stores');
    return rows[0].count;
  },

  async update(id, fields) {
    const setClauses = [];
    const params = [];
    let idx = 1;
    if (fields.name !== undefined) { setClauses.push(`name = $${idx++}`); params.push(fields.name); }
    if (fields.email !== undefined) { setClauses.push(`email = $${idx++}`); params.push(fields.email); }
    if (fields.address !== undefined) { setClauses.push(`address = $${idx++}`); params.push(fields.address); }
    if (fields.owner_id !== undefined) { setClauses.push(`owner_id = $${idx++}`); params.push(fields.owner_id); }
    if (setClauses.length === 0) return this.findById(id);
    setClauses.push('updated_at = NOW()');
    params.push(id);
    await pool.query(`UPDATE stores SET ${setClauses.join(', ')} WHERE id = $${idx}`, params);
    return this.findById(id);
  },

  async delete(id) {
    await pool.query('DELETE FROM ratings WHERE store_id = $1', [id]);
    await pool.query('DELETE FROM stores WHERE id = $1', [id]);
  },
};

module.exports = Store;
