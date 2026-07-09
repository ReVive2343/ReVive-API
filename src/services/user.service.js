const bcrypt = require("bcryptjs");
const pool = require("../../config/db");

const getProfile = async (user) => {
  return user;
};

const updateProfile = async (userId, { name, email }) => {
  const result = await pool.query(
    `UPDATE users
     SET name = $1, email = $2
     WHERE id = $3
     RETURNING id, name, email, role, created_at`,
    [name, email, userId]
  );

  return result.rows[0];
};

const changePassword = async (userId, { oldPassword, newPassword }) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [userId]);

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    const error = new Error("Old password is incorrect");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
    hashedPassword,
    userId,
  ]);

  return true;
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};