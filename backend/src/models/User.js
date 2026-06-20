const db = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  create({ name, email, password, address, role = 'user' }) {
    const password_hash = bcrypt.hashSync(password, 10);
    const stmt = db.prepare(
      `INSERT INTO users (name, email, password_hash, address, role)
       VALUES (?, ?, ?, ?, ?)`
    );
    const info = stmt.run(name, email, password_hash, address, role);
    return this.findById(info.lastInsertRowid);
  },

  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById(id) {
    return db.prepare(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?'
    ).get(id);
  },

  findAll({ search, role, sortBy = 'name', sortOrder = 'ASC', limit = 100, offset = 0 } = {}) {
    const allowedSortColumns = ['name', 'email', 'address', 'role', 'created_at'];
    const column = allowedSortColumns.includes(sortBy) ? sortBy : 'name';
    const order = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    const conditions = [];
    const params = [];

    if (role) {
      conditions.push('role = ?');
      params.push(role);
    }
    if (search) {
      conditions.push('(name LIKE ? OR email LIKE ? OR address LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countRow = db.prepare(`SELECT COUNT(*) as count FROM users ${whereClause}`).get(...params);
    const total = countRow.count;

    const users = db.prepare(
      `SELECT id, name, email, address, role, created_at
       FROM users ${whereClause}
       ORDER BY ${column} ${order}
       LIMIT ? OFFSET ?`
    ).all(...params, limit, offset);

    return { users, total };
  },

  updatePassword(id, newPassword) {
    const password_hash = bcrypt.hashSync(newPassword, 10);
    db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?').run(password_hash, id);
  },

  update(id, fields) {
    const setClauses = [];
    const params = [];

    if (fields.name) {
      setClauses.push('name = ?');
      params.push(fields.name);
    }
    if (fields.email) {
      setClauses.push('email = ?');
      params.push(fields.email);
    }
    if (fields.address) {
      setClauses.push('address = ?');
      params.push(fields.address);
    }
    if (fields.role) {
      setClauses.push('role = ?');
      params.push(fields.role);
    }

    if (setClauses.length === 0) return null;

    setClauses.push('updated_at = datetime(\'now\')');
    params.push(id);

    db.prepare(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`).run(...params);
    return this.findById(id);
  },

  getCount() {
    return db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  },

  getCountByRole(role) {
    return db.prepare('SELECT COUNT(*) as count FROM users WHERE role = ?').get(role).count;
  },

  delete(id) {
    db.prepare('DELETE FROM ratings WHERE user_id = ?').run(id);
    db.prepare('UPDATE stores SET owner_id = NULL WHERE owner_id = ?').run(id);
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
  },
};

module.exports = User;
