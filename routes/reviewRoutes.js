const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  addReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

/**
 * @swagger
 * /products/{id}/reviews:
 *   post:
 *     summary: Add product review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 */
router.post("/:id/reviews", authMiddleware, addReview);

/**
 * @swagger
 * /products/{id}/reviews:
 *   get:
 *     summary: Get product reviews
 *     tags:
 *       - Reviews
 */
router.get("/:id/reviews", getProductReviews);

/**
 * @swagger
 * /products/{productId}/reviews/{reviewId}:
 *   delete:
 *     summary: Delete own review
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:productId/reviews/:reviewId", authMiddleware, deleteReview);

module.exports = router;