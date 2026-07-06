const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *                 example: Old Study Table
 *               description:
 *                 type: string
 *                 example: Wooden table in good condition
 *               category:
 *                 type: string
 *                 example: Furniture
 *               item_condition:
 *                 type: string
 *                 example: Good
 *               price:
 *                 type: number
 *                 example: 500
 *               location:
 *                 type: string
 *                 example: Bhubaneswar
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", authMiddleware, createProduct);

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Products
 *     responses:
 *       200:
 *         description: Product list fetched successfully
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags:
 *       - Products
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product fetched successfully
 *       404:
 *         description: Product not found
 */

router.get("/:id", getProductById);
/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Study Table
 *               description:
 *                 type: string
 *                 example: Updated description
 *               category:
 *                 type: string
 *                 example: Furniture
 *               item_condition:
 *                 type: string
 *                 example: Good
 *               price:
 *                 type: number
 *                 example: 700
 *               location:
 *                 type: string
 *                 example: Bhubaneswar
 *               status:
 *                 type: string
 *                 example: available
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found or unauthorized
 */

router.put("/:id", authMiddleware, updateProduct);
/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Delete product by ID
 *     tags:
 *       - Products
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found or unauthorized
 */
router.delete("/:id", authMiddleware, deleteProduct);

module.exports = router;
