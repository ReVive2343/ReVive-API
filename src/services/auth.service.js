const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const registerUser = async ({ name, email, password }) => {
  const existingUser = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (existingUser.rows.length > 0) {
    const error = new Error("User already exists");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING id, name, email, role, created_at`,
    [name, email, hashedPassword]
  );

  const user = newUser.rows[0];

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const loginUser = async ({ email, password }) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  if (result.rows.length === 0) {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }

  const user = result.rows[0];

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

const forgotPassword = async ({ email }) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (result.rows.length === 0) {
    const error = new Error("User with this email does not exist");
    error.statusCode = 404;
    throw error;
  }

  const user = result.rows[0];

  const resetToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const resetLink = `https://reviveapi.defigo.in/reset-password?token=${resetToken}`;
  console.log(`\n\n--- PASSWORD RESET LINK (MOCK EMAIL) ---\nTo: ${email}\nLink: ${resetLink}\n--------------------------------------\n\n`);

  return { resetToken };
};

const resetPassword = async ({ token, newPassword }) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updateResult = await pool.query(
      "UPDATE users SET password = $1 WHERE id = $2 RETURNING id",
      [hashedPassword, decoded.id]
    );

    if (updateResult.rows.length === 0) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    return true;
  } catch (error) {
    if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
      const err = new Error("Invalid or expired password reset token");
      err.statusCode = 400;
      throw err;
    }
    throw error;
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
};
