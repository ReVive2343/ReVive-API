const pool = require("../config/db");

const addReview = async (productId, userId, reviewData) => {
  const { rating, comment } = reviewData;

  if (!Number.isInteger(Number(rating)) || rating < 1 || rating > 5) {
    const error = new Error("Rating must be between 1 and 5");
    error.statusCode = 400;
    throw error;
  }

  const productResult = await pool.query(
    "SELECT id, user_id FROM products WHERE id = $1",
    [productId]
  );

  if (productResult.rows.length === 0) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  if (productResult.rows[0].user_id === userId) {
    const error = new Error("You cannot review your own product");
    error.statusCode = 400;
    throw error;
  }

  const existingResult = await pool.query(
    `SELECT id
     FROM product_reviews
     WHERE product_id = $1 AND user_id = $2`,
    [productId, userId]
  );

  if (existingResult.rows.length > 0) {
    const error = new Error("You have already reviewed this product");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO product_reviews
      (product_id, user_id, rating, comment)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [productId, userId, Number(rating), comment]
  );

  return result.rows[0];
};

const getProductReviews = async (productId) => {
  const productResult = await pool.query(
    "SELECT id FROM products WHERE id = $1",
    [productId]
  );

  if (productResult.rows.length === 0) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const reviewsResult = await pool.query(
    `SELECT
       pr.*,
       u.name AS user_name
     FROM product_reviews pr
     JOIN users u ON pr.user_id = u.id
     WHERE pr.product_id = $1
     ORDER BY pr.created_at DESC`,
    [productId]
  );

  const ratingResult = await pool.query(
    `SELECT
       COALESCE(AVG(rating), 0) AS average_rating,
       COUNT(*) AS total_reviews
     FROM product_reviews
     WHERE product_id = $1`,
    [productId]
  );

  return {
    reviews: reviewsResult.rows,
    averageRating: Number(ratingResult.rows[0].average_rating),
    totalReviews: Number(ratingResult.rows[0].total_reviews),
  };
};

const deleteReview = async (productId, reviewId, userId) => {
  const result = await pool.query(
    `DELETE FROM product_reviews
     WHERE id = $1
       AND product_id = $2
       AND user_id = $3
     RETURNING id`,
    [reviewId, productId, userId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Review not found or unauthorized");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

module.exports = {
  addReview,
  getProductReviews,
  deleteReview,
};
