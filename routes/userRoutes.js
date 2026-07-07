const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get protected user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @swagger
 * /users/profile:
 *   put:
 *     summary: Update user profile
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Arnab Mishra
 *               email:
 *                 type: string
 *                 example: arnab@test.com
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put("/profile", authMiddleware, updateProfile);

/**
 * @swagger
 * /users/change-password:
 *   put:
 *     summary: Change user password
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: "123456"
 *               newPassword:
 *                 type: string
 *                 example: "newpassword123"
 *     responses:
 *       200:
 *         description: Password changed successfully
 */
router.put("/change-password", authMiddleware, changePassword);

module.exports = router;