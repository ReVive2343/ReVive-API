const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getAllUsers,
  getAllProductsAdmin,
  updateUserRole,
  deleteUserAdmin,
  deleteProductAdmin,
} = require("../controllers/adminController");

const router = express.Router();

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics fetched successfully
 *       403:
 *         description: Access denied. Admin only.
 */
router.get("/dashboard", authMiddleware, adminMiddleware, getDashboardStats);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *       403:
 *         description: Access denied. Admin only.
 */
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);

/**
 * @swagger
 * /admin/products:
 *   get:
 *     summary: Get all products (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Products fetched successfully
 *       403:
 *         description: Access denied. Admin only.
 */
router.get("/products", authMiddleware, adminMiddleware, getAllProductsAdmin);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   put:
 *     summary: Update user role (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 */
router.put("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete user (Admin only)
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 */
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUserAdmin);

/**
 * @swagger
 * /admin/products/{id}:
 *   delete:
 *     summary: Delete product as admin
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 */
router.delete("/products/:id", authMiddleware, adminMiddleware, deleteProductAdmin);
module.exports = router;