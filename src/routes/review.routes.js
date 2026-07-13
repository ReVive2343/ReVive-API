const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");

const {
  addReview,
  getProductReviews,
  deleteReview,
} = require("../controllers/review.controller");

const router = express.Router();

/**
 * @swagger
 * /products/{id}/reviews:
 *   post:
 *     summary: Add a review to a product
 *     tags: [Reviews]
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
 *               - rating
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 example: Product was in excellent condition.
 */
router.post("/:id/reviews", authMiddleware, addReview);

/**
 * @swagger
 * /products/{id}/reviews:
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/:id/reviews", getProductReviews);

/**
 * @swagger
 * /products/{productId}/reviews/{reviewId}:
 *   delete:
 *     summary: Delete the current user's review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: reviewId
 *         required: true
 *         schema:
 *           type: integer
 */
router.delete(
  "/:productId/reviews/:reviewId",
  authMiddleware,
  deleteReview
);

module.exports = router;