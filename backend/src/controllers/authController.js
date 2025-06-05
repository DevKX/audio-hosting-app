const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db'); // Import your Postgres pool

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Query the user from the database
    const result = await pool.query(
      'SELECT id, username, password_hash, is_active, role FROM users WHERE username = $1',
      [username]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    if (!user.is_active) {
      return res.status(403).json({ error: "User is not active" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role }, 
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
};