const pool = require("../config/db");

const createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      item_condition,
      price,
      location,
    } = req.body;

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
    const result = await pool.query(
      `SELECT p.*, u.name AS owner_name 
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

const getProductById = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*, u.name AS owner_name 
       FROM products p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { title, description, category, item_condition, price, location, status } = req.body;

    const result = await pool.query(
      `UPDATE products 
       SET title=$1, description=$2, category=$3, item_condition=$4, price=$5, location=$6, status=$7, updated_at=CURRENT_TIMESTAMP
       WHERE id=$8 AND user_id=$9
       RETURNING *`,
      [title, description, category, item_condition, price, location, status, req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    res.json({ message: "Product updated successfully", product: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM products WHERE id=$1 AND user_id=$2 RETURNING *",
      [req.params.id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found or unauthorized" });
    }

    res.json({ message: "Product deleted successfully" });
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
};
