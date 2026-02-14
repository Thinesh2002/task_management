const db = require('../config/db');

const userModel = {

  findByLogin: async (login) => {
    let query = `
      SELECT * FROM users
      WHERE email = ? OR user_id = ?
      LIMIT 1
    `;
    let params = [login, login];

    if (!isNaN(login)) {
      query = `
        SELECT * FROM users
        WHERE email = ? OR user_id = ? OR id = ?
        LIMIT 1
      `;
      params = [login, login, Number(login)];
    }

    const [rows] = await db.query(query, params);
    return rows[0] || null;
  },

  findById: async (id) => {
    const [rows] = await db.query(
      `SELECT id, name, user_id, email, role, employee_code, created_at
       FROM users
       WHERE id = ?
       LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  createUser: async ({ name, user_id, email, password, role, employee_code }) => {
    try {
      const [result] = await db.query(
        `INSERT INTO users 
         (name, user_id, email, password, role, employee_code)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          name || null,
          user_id || null,
          email,
          password,
          role || 'team_member',
          employee_code || null
        ]
      );
      return result.insertId;
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error('Email or User ID already exists');
      }
      throw error;
    }
  },

  updateUser: async (id, data) => {
    const { name, user_id, email, role, employee_code } = data;

    await db.query(
      `UPDATE users
       SET name = ?, user_id = ?, email = ?, role = ?, employee_code = ?
       WHERE id = ?`,
      [name, user_id, email, role, employee_code, id]
    );
  },

  updatePassword: async (id, hashedPassword) => {
    await db.query(
      `UPDATE users SET password = ? WHERE id = ?`,
      [hashedPassword, id]
    );
  },

  deleteUser: async (id) => {
    await db.query(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );
  },

  getAllUsers: async () => {
    const [rows] = await db.query(
      `SELECT id, name, user_id, email, role, employee_code, created_at
       FROM users
       ORDER BY id DESC`
    );
    return rows;
  }

};

module.exports = userModel;
