const pool = require("../config/db");

const getDashboardStats = async () => {
  const [
    usersResult,
    productsResult,
    requestsResult,
    wishlistResult,
    reviewsResult,
  ] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM users"),
    pool.query("SELECT COUNT(*) FROM products"),
    pool.query("SELECT COUNT(*) FROM product_requests"),
    pool.query("SELECT COUNT(*) FROM wishlist"),
    pool.query("SELECT COUNT(*) FROM product_reviews"),
  ]);

  return {
    users: Number(usersResult.rows[0].count),
    products: Number(productsResult.rows[0].count),
    requests: Number(requestsResult.rows[0].count),
    wishlist: Number(wishlistResult.rows[0].count),
    reviews: Number(reviewsResult.rows[0].count),
  };
};

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, name, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const getAllProducts = async () => {
  const result = await pool.query(
    `SELECT
       p.*,
       u.name AS owner_name,
       u.email AS owner_email
     FROM products p
     JOIN users u ON p.user_id = u.id
     ORDER BY p.created_at DESC`
  );

  return result.rows;
};

const updateUserRole = async (userId, role, currentAdminId) => {
  const allowedRoles = ["user", "admin"];

  if (!allowedRoles.includes(role)) {
    const error = new Error("Invalid role");
    error.statusCode = 400;
    throw error;
  }

  if (Number(userId) === Number(currentAdminId) && role !== "admin") {
    const error = new Error("You cannot remove your own admin role");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `UPDATE users
     SET role = $1
     WHERE id = $2
     RETURNING id, name, email, role`,
    [role, userId]
  );

  if (result.rows.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteUser = async (userId, currentAdminId) => {
  if (Number(userId) === Number(currentAdminId)) {
    const error = new Error("You cannot delete your own account");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `DELETE FROM users
     WHERE id = $1
     RETURNING id, name, email`,
    [userId]
  );

  if (result.rows.length === 0) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteProduct = async (productId) => {
  const result = await pool.query(
    `DELETE FROM products
     WHERE id = $1
     RETURNING *`,
    [productId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllProducts,
  updateUserRole,
  deleteUser,
  deleteProduct,
};
