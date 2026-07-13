const pool = require("../../config/db");

const getCategories = async () => {
  const result = await pool.query(
    `SELECT *
     FROM categories
     ORDER BY name ASC`
  );

  return result.rows;
};

const createCategory = async ({ name, description }) => {
  const existingResult = await pool.query(
    `SELECT id
     FROM categories
     WHERE LOWER(name) = LOWER($1)`,
    [name]
  );

  if (existingResult.rows.length > 0) {
    const error = new Error("Category already exists");
    error.statusCode = 400;
    throw error;
  }

  const result = await pool.query(
    `INSERT INTO categories (name, description)
     VALUES ($1, $2)
     RETURNING *`,
    [name, description]
  );

  return result.rows[0];
};

module.exports = {
  getCategories,
  createCategory,
};