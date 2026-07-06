const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/userController");

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

module.exports = router;
