const pool = require("../config/db");

const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    const existing = await pool.query(
      "SELECT * FROM wishlist WHERE user_id=$1 AND product_id=$2",
      [userId, productId]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        message: "Product already in wishlist",
      });
    }

    const result = await pool.query(
      `INSERT INTO wishlist (user_id, product_id)
       VALUES ($1,$2)
       RETURNING *`,
      [userId, productId]
    );

    res.status(201).json({
      message: "Product added to wishlist",
      wishlist: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        w.id,
        p.*,
        u.name AS owner_name
      FROM wishlist w
      JOIN products p ON w.product_id=p.id
      JOIN users u ON p.user_id=u.id
      WHERE w.user_id=$1
      ORDER BY w.created_at DESC
      `,
      [userId]
    );

    res.json({
      count: result.rows.length,
      wishlist: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

const removeWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    await pool.query(
      "DELETE FROM wishlist WHERE user_id=$1 AND product_id=$2",
      [userId, productId]
    );

    res.json({
      message: "Removed from wishlist",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeWishlist,
};