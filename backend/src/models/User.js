const { pool } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  async create({ name, email, password, address, role = 'user' }) {
    const password_hash = bcrypt.hashSync(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role, created_at`,
      [name, email, password_hash, address, role]
    );
    return rows[0];
  },

  async findByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
  },

  async findById(id) {
    const { rows } = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
      [id]
    );
    return rows[0] || null;
  },

  async findAll({ search, role, excludeRole, sortBy = 'name', sortOrder = 'ASC', limit = 100, offset = 0 } = {}) {
    const allowedSortColumns = ['name', 'email', 'address', 'role', 'created_at'];
    const column = allowedSortColumns.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const params = [];
    const clauses = [];

    if (role) {
      const roles = Array.isArray(role) ? role : [role];
      clauses.push(`role = ANY($${params.length + 1}::text[])`);
      params.push(roles);
    }
    if (excludeRole) {
      const exRoles = Array.isArray(excludeRole) ? excludeRole : [excludeRole];
      clauses.push(`role != ALL($${params.length + 1}::text[])`);
      params.push(exRoles);
    }
    if (search) {
      clauses.push(`(name ILIKE $${params.length + 1} OR email ILIKE $${params.length + 2} OR address ILIKE $${params.length + 3})`);
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '';

    const countResult = await pool.query(`SELECT COUNT(*)::int as count FROM users ${whereClause}`, params);
    const total = countResult.rows[0].count;

    const { rows: users } = await pool.query(
      `SELECT id, name, email, address, role, created_at
       FROM users ${whereClause}
       ORDER BY ${column} ${order}
       LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
      [...params, limit, offset]
    );

    return { users, total };
  },

  async updatePassword(id, newPassword) {
    const password_hash = bcrypt.hashSync(newPassword, 10);
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [password_hash, id]
    );
  },

  async update(id, fields) {
    const setClauses = [];
    const params = [];
    let idx = 1;

    if (fields.name) {
      setClauses.push(`name = $${idx++}`);
      params.push(fields.name);
    }
    if (fields.email) {
      setClauses.push(`email = $${idx++}`);
      params.push(fields.email);
    }
    if (fields.address) {
      setClauses.push(`address = $${idx++}`);
      params.push(fields.address);
    }
    if (fields.role) {
      setClauses.push(`role = $${idx++}`);
      params.push(fields.role);
    }

    if (setClauses.length === 0) return null;

    setClauses.push(`updated_at = NOW()`);
    params.push(id);

    await pool.query(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idx}`,
      params
    );
    return this.findById(id);
  },

  async getCount() {
    const { rows } = await pool.query('SELECT COUNT(*)::int as count FROM users');
    return rows[0].count;
  },

  async getCountByRole(role) {
    const { rows } = await pool.query('SELECT COUNT(*)::int as count FROM users WHERE role = $1', [role]);
    return rows[0].count;
  },

  async delete(id) {
    await pool.query('DELETE FROM ratings WHERE user_id = $1', [id]);
    await pool.query('UPDATE stores SET owner_id = NULL WHERE owner_id = $1', [id]);
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
  },
};

module.exports = User;
