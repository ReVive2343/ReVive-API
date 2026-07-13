const pool = require("../config/db");

const createProduct = async (userId, productData) => {
  const {
    title,
    description,
    category,
    item_condition,
    price,
    location,
  } = productData;

  const result = await pool.query(
    `INSERT INTO products
      (title, description, category, item_condition, price, location, user_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      title,
      description,
      category,
      item_condition,
      price,
      location,
      userId,
    ]
  );

  return result.rows[0];
};

const getProducts = async (filters) => {
  const {
    search,
    category,
    location,
    minPrice,
    maxPrice,
    page = 1,
    limit = 10,
  } = filters;

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const offset = (pageNumber - 1) * limitNumber;

  const conditions = [];
  const values = [];
  let parameterIndex = 1;

  if (search) {
    conditions.push(
      `(p.title ILIKE $${parameterIndex} OR p.description ILIKE $${parameterIndex})`
    );
    values.push(`%${search}%`);
    parameterIndex++;
  }

  if (category) {
    conditions.push(`p.category ILIKE $${parameterIndex}`);
    values.push(category);
    parameterIndex++;
  }

  if (location) {
    conditions.push(`p.location ILIKE $${parameterIndex}`);
    values.push(`%${location}%`);
    parameterIndex++;
  }

  if (minPrice !== undefined && minPrice !== "") {
    conditions.push(`p.price >= $${parameterIndex}`);
    values.push(Number(minPrice));
    parameterIndex++;
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    conditions.push(`p.price <= $${parameterIndex}`);
    values.push(Number(maxPrice));
    parameterIndex++;
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const countValues = [...values];

  const countResult = await pool.query(
    `SELECT COUNT(DISTINCT p.id)
     FROM products p
     ${whereClause}`,
    countValues
  );

  values.push(limitNumber, offset);

  const result = await pool.query(
    `SELECT
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
     FROM products p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN product_images pi ON p.id = pi.product_id
     ${whereClause}
     GROUP BY p.id, u.name
     ORDER BY p.created_at DESC
     LIMIT $${parameterIndex}
     OFFSET $${parameterIndex + 1}`,
    values
  );

  const total = Number(countResult.rows[0].count);

  return {
    products: result.rows,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

const getProductById = async (productId) => {
  const result = await pool.query(
    `SELECT
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
     FROM products p
     JOIN users u ON p.user_id = u.id
     LEFT JOIN product_images pi ON p.id = pi.product_id
     WHERE p.id = $1
     GROUP BY p.id, u.name`,
    [productId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

const updateProduct = async (productId, userId, productData) => {
  const {
    title,
    description,
    category,
    item_condition,
    price,
    location,
    status,
  } = productData;

  const result = await pool.query(
    `UPDATE products
     SET
       title = $1,
       description = $2,
       category = $3,
       item_condition = $4,
       price = $5,
       location = $6,
       status = $7,
       updated_at = CURRENT_TIMESTAMP
     WHERE id = $8 AND user_id = $9
     RETURNING *`,
    [
      title,
      description,
      category,
      item_condition,
      price,
      location,
      status,
      productId,
      userId,
    ]
  );

  if (result.rows.length === 0) {
    const error = new Error("Product not found or unauthorized");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

const deleteProduct = async (productId, userId) => {
  const result = await pool.query(
    `DELETE FROM products
     WHERE id = $1 AND user_id = $2
     RETURNING id`,
    [productId, userId]
  );

  if (result.rows.length === 0) {
    const error = new Error("Product not found or unauthorized");
    error.statusCode = 404;
    throw error;
  }

  return result.rows[0];
};

const uploadProductImages = async (productId, userId, imageUrls) => {
  const productResult = await pool.query(
    `SELECT id
     FROM products
     WHERE id = $1 AND user_id = $2`,
    [productId, userId]
  );

  if (productResult.rows.length === 0) {
    const error = new Error("Product not found or unauthorized");
    error.statusCode = 404;
    throw error;
  }

  const uploadedImages = [];

  for (const imageUrl of imageUrls) {
    const result = await pool.query(
      `INSERT INTO product_images (product_id, image_url)
       VALUES ($1, $2)
       RETURNING *`,
      [productId, imageUrl]
    );

    uploadedImages.push(result.rows[0]);
  }

  return uploadedImages;
};

const getProductImages = async (productId) => {
  const result = await pool.query(
    `SELECT *
     FROM product_images
     WHERE product_id = $1
     ORDER BY created_at DESC`,
    [productId]
  );

  return result.rows;
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getProductImages,
};
