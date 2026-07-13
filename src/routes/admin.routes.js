const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");
const adminMiddleware = require("../../middleware/adminMiddleware");

const {
  getDashboardStats,
  getAllUsers,
  getAllProducts,
  updateUserRole,
  deleteUser,
  deleteProduct,
} = require("../controllers/admin.controller");

const {
  validateRoleUpdate,
} = require("../validators/admin.validator");

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/dashboard", getDashboardStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/users", getAllUsers);

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 */
router.get("/products", getAllProducts);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   put:
 *     summary: Update a user's role
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 */
router.put("/users/:id/role", validateRoleUpdate, updateUserRole);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete("/users/:id", deleteUser);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete("/products/:id", deleteProduct);

module.exports = router;