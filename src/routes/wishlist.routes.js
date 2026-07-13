const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlist.controller");

const router = express.Router();

/**
 * @swagger
 * /wishlist/{productId}:
 *   post:
 *     summary: Add a product to the current user's wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       201:
 *         description: Product added to wishlist
 *       400:
 *         description: Product already exists in wishlist
 *       404:
 *         description: Product not found
 */
router.post("/:productId", authMiddleware, addToWishlist);

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Get the current user's wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist fetched successfully
 */
router.get("/", authMiddleware, getWishlist);

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove a product from the current user's wishlist
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       404:
 *         description: Wishlist item not found
 */
router.delete("/:productId", authMiddleware, removeFromWishlist);

module.exports = router;
