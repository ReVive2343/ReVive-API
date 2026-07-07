const pool = require("../config/db");

const getCategories = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY name ASC"
    );

    res.json({
      count: result.rows.length,
      categories: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const result = await pool.query(
      `INSERT INTO categories (name, description)
       VALUES ($1, $2)
       RETURNING *`,
      [name, description]
    );

    res.status(201).json({
      message: "Category created successfully",
      category: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
};