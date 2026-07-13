const pool = require("../src/config/db");

const createProduct = async (req, res) => {
  try {
    const { title, description, category, item_condition, price, location } =
      req.body;

    const userId = req.user.id;

    const result = await pool.query(
      `INSERT INTO products 
      (title, description, category, item_condition, price, location, user_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`,
      [title, description, category, item_condition, price, location, userId]
    );

    res.status(201).json({
      message: "Product created successfully",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      location,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
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
      WHERE 1=1
    `;

    const values = [];
    let count = 1;

    if (search) {
      query += ` AND (p.title ILIKE $${count} OR p.description ILIKE $${count})`;
      values.push(`%${search}%`);
      count++;
    }

    if (category) {
      query += ` AND p.category ILIKE $${count}`;
      values.push(`%${category}%`);
      count++;
    }

    if (location) {
      query += ` AND p.location ILIKE $${count}`;
      values.push(`%${location}%`);
      count++;
    }

    if (minPrice) {
      query += ` AND p.price >= $${count}`;
      values.push(minPrice);
      count++;
    }

    if (maxPrice) {
      query += ` AND p.price <= $${count}`;
      values.push(maxPrice);
      count++;
    }

    query += `
      GROUP BY p.id, u.name
      ORDER BY p.created_at DESC
      LIMIT $${count} OFFSET $${count + 1}
    `;

    values.push(limit, offset);

    const result = await pool.query(query, values);

    res.json({
      page: Number(page),
      limit: Number(limit),
      count: result.rows.length,
      products: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
const getProductById = async (req, res) => {
  try {
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
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      item_condition,
      price,
      location,
      status,
    } = req.body;

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
        req.params.id,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    res.json({
      message: "Product updated successfully",
      product: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id = $1 AND user_id = $2 RETURNING *",
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const uploadProductImages = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await pool.query(
      "SELECT * FROM products WHERE id = $1 AND user_id = $2",
      [productId, req.user.id]
    );

    if (product.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No images uploaded" });
    }

    const uploadedImages = [];

    for (const file of req.files) {
      const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${
        file.filename
      }`;

      const result = await pool.query(
        `INSERT INTO product_images (product_id, image_url)
         VALUES ($1, $2)
         RETURNING *`,
        [productId, imageUrl]
      );

      uploadedImages.push(result.rows[0]);
    }

    res.status(201).json({
      message: "Images uploaded successfully",
      images: uploadedImages,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getProductImages = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM product_images 
       WHERE product_id = $1 
       ORDER BY created_at DESC`,
      [req.params.id]
    );

    res.json({
      count: result.rows.length,
      images: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
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