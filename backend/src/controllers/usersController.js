const pool = require('../db');
const bcrypt = require('bcrypt');

exports.listUsers = async (req, res) => {
  try {
    const result = await pool.query("SELECT id, username, email, is_active FROM users WHERE role != 'admin'");
    res.status(200).json({
      message: "Users fetched successfully",
      users: result.rows
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

exports.createUser = async (req, res) => {
  const { username, password, email, is_active } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ message: 'Username, password, and email are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      "INSERT INTO users (username, password_hash, email, is_active) VALUES ($1, $2, $3, $4) RETURNING id, username, email, is_active",
      [username, hashedPassword, email, is_active]
    );
    res.status(201).json({
      message: "User created successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to create user' });
  }
};


exports.updateUser = async (req, res) => {
  const { username, password, email, is_active } = req.body;
  const userId = req.params.id;
  if (!username || !email) {
    return res.status(400).json({ message: 'Username and email are required' });
  }

  try {
    let result;
    // If password is provided, hash it and update the user
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
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: "User updated successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to update user' });
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
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: "User deleted successfully",
      id: result.rows[0].id
    });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to delete user' });
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
      return res.status(401).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: "Current user fetched successfully",
      user: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Failed to fetch logon user' });
  }
};