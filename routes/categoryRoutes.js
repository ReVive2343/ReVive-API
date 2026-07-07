const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getCategories,
  createCategory,
} = require("../controllers/categoryController");

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 */
router.get("/", getCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: Phones, laptops and gadgets
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post("/", authMiddleware, adminMiddleware, createCategory);

module.exports = router;