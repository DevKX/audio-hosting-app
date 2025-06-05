const pool = require('../db');
const bcrypt = require('bcrypt');

exports.listUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email, is_active FROM users WHERE role != 'admin'");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

exports.createUser = async (req, res) => {
  const { username, password, email, is_active } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'Username, password, and email are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash, email, is_active) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_active",
      [username, hashedPassword, email, is_active]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

exports.updateUser = async (req, res) => {
  const { username, password, email, is_active } = req.body;
  const userId = req.params.id;
  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email are required' });
  }

  try {
    let result;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      result = await pool.query(
        "UPDATE users SET username = $1, password_hash = $2, email = $3, is_active = $4 WHERE id = $5 RETURNING id, username, email, is_active",
        [username, hashedPassword, email, is_active, userId]
      );
    } else {
      result = await pool.query(
        "UPDATE users SET username = $1, email = $2, is_active = $3 WHERE id = $4 RETURNING id, username, email, is_active",
        [username, email, is_active, userId]
      );
    }
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id",
      [userId]  
    )
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: result.rows[0].id });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  } 
};

exports.getUserByUsername = async (req, res) => {
  const { username } = req.params;
  try {
    const result = await pool.query(
      "SELECT id, username, email, is_active FROM users WHERE username = $1",
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    console.log("Fetched user:", result.rows[0]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

exports.currentLogonUser = async (req, res) => {
  const userId = req.user.id; // Get user ID from JWT token
  try {
    const result = await pool.query(
      "SELECT id, username, email, is_active, role FROM users WHERE id = $1",
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
};