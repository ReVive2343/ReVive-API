const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  addToWishlist,
  getWishlist,
  removeWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

/**
 * @swagger
 * /wishlist/{productId}:
 *   post:
 *     summary: Add product to wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 */
router.post("/:productId", authMiddleware, addToWishlist);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get user wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, getWishlist);

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove product from wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:productId", authMiddleware, removeWishlist);

module.exports = router;