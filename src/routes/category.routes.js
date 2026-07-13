const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const adminMiddleware = require("../middleware/admin.middleware");

const {
  getCategories,
  createCategory,
} = require("../controllers/category.controller");

const {
  validateCreateCategory,
} = require("../validators/category.validator");

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Categories fetched successfully
 */
router.get("/", getCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
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
 *                 example: Phones, laptops and accessories
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input or duplicate category
 *       403:
 *         description: Admin access required
 */
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  validateCreateCategory,
  createCategory
);

module.exports = router;
