const getProfile = async (req, res) => {
  res.json({
    message: "Protected profile data",
    user: req.user,
  });
};
const pool = require("../config/db");
const bcrypt = require("bcryptjs");

const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const result = await pool.query(
      `UPDATE users 
       SET name = $1, email = $2
       WHERE id = $3 
       RETURNING id, name, email, role, created_at`,
      [name, email, req.user.id]
    );

    res.json({
      message: "Profile updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      req.user.id,
    ]);

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
      hashedPassword,
      req.user.id,
    ]);

    res.json({
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};
