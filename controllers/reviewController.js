const pool = require("../config/db");

const addReview = async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;
    const { rating, comment } = req.body;

    const result = await pool.query(
      `INSERT INTO product_reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [productId, userId, rating, comment]
    );

    res.status(201).json({
      message: "Review added successfully",
      review: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT pr.*, u.name AS user_name
       FROM product_reviews pr
       JOIN users u ON pr.user_id = u.id
       WHERE pr.product_id = $1
       ORDER BY pr.created_at DESC`,
      [req.params.id]
    );

    res.json({
      count: result.rows.length,
      reviews: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM product_reviews
       WHERE id = $1 AND product_id = $2 AND user_id = $3
       RETURNING *`,
      [req.params.reviewId, req.params.productId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  deleteReview,
};