const pool = require("../config/db");

const getDashboardStats = async (req, res) => {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const products = await pool.query("SELECT COUNT(*) FROM products");
    const requests = await pool.query("SELECT COUNT(*) FROM product_requests");
    const wishlist = await pool.query("SELECT COUNT(*) FROM wishlist");

    res.json({
      users: Number(users.rows[0].count),
      products: Number(products.rows[0].count),
      requests: Number(requests.rows[0].count),
      wishlist: Number(wishlist.rows[0].count),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );

    res.json({
      count: result.rows.length,
      users: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getAllProductsAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS owner_name, u.email AS owner_email
       FROM products p
       JOIN users u ON p.user_id = u.id
       ORDER BY p.created_at DESC`
    );

    res.json({
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["user", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const result = await pool.query(
      "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, name, email, role",
      [role, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User role updated successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUserAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User deleted successfully",
      user: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteProductAdmin = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      message: "Product deleted successfully by admin",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllProductsAdmin,
  updateUserRole,
  deleteUserAdmin,
  deleteProductAdmin,
};