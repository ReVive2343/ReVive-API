const pool = require("../../config/db");

const addToWishlist = async (userId, productId) => {
  const productResult = await pool.query(
    "SELECT id FROM products WHERE id = $1",
    [productId]
  );

  if (productResult.rows.length === 0) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const existingResult = await pool.query(
    `SELECT id
     FROM wishlist
     WHERE user_id = $1 AND product_id = $2`,
    [userId, productId]
  );

  if (existingResult.rows.length > 0) {
    const error = new Error("Product already exists in wishlist");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO wishlist (user_id, product_id)
     VALUES ($1, $2)
     RETURNING *`,
    [userId, productId]
  );

  return result.rows[0];
};

const getWishlist = async (userId) => {
  const result = await pool.query(
    `SELECT
       w.id AS wishlist_id,
       w.created_at AS wishlist_created_at,
       p.*,
       u.name AS owner_name,
       COALESCE(
         JSON_AGG(
           JSON_BUILD_OBJECT(
             'id', pi.id,
             'image_url', pi.image_url
           )
         ) FILTER (WHERE pi.id IS NOT NULL),
         '[]'
       ) AS images
     FROM wishlist w
     JOIN products p ON w.product_id = p.id
     JOIN users u ON p.user_id = u.id
     LEFT JOIN product_images pi ON p.id = pi.product_id
     WHERE w.user_id = $1
     GROUP BY w.id, p.id, u.name
     ORDER BY w.created_at DESC`,
    [userId]
  );

  return result.rows;
};

const removeFromWishlist = async (userId, productId) => {
  const result = await pool.query(
    `DELETE FROM wishlist
     WHERE user_id = $1 AND product_id = $2
     RETURNING id`,
    [userId, productId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Wishlist item not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};