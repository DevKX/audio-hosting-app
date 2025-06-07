const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db'); // Import your Postgres pool

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    // Fetch user from database
    const result = await pool.query(
      'SELECT id, username, password_hash, is_active, role FROM users WHERE username = $1',
      [username]
    );

    // username column is unique in db, so we expect one user or none
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Compare password with hashed password in database
    // Passwords are hashed using bcrypt in DB
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Check if user is active
    if (!user.is_active) {
      return res.status(403).json({ message: "User is not active" });
    }

    // Generate JSON Web Token (JWT) that expires in 1 hour
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role }, 
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ 
      message: "Login successful",
      token : {token}
    });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Login failed" });
  }
};