const express = require("express");
const authMiddleware = require("../../middleware/authMiddleware");

const {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
} = require("../controllers/request.controller");

const router = express.Router();

/**
 * @swagger
 * /requests/my:
 *   get:
 *     summary: Get requests sent by the current user
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 */
router.get("/my", authMiddleware, getMyRequests);

/**
 * @swagger
 * /requests/received:
 *   get:
 *     summary: Get requests received on the current user's products
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 */
router.get("/received", authMiddleware, getReceivedRequests);

/**
 * @swagger
 * /requests/{productId}:
 *   post:
 *     summary: Create a request for a product
 *     tags: [Requests]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               request_type:
 *                 type: string
 *                 enum: [buy, donate, exchange, claim]
 *                 example: buy
 *               message:
 *                 type: string
 *                 example: I am interested in this item.
 */
router.post("/:productId", authMiddleware, createRequest);

/**
 * @swagger
 * /requests/{id}/status:
 *   put:
 *     summary: Update the status of a received request
 *     tags: [Requests]
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
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, accepted, rejected, completed, cancelled]
 */
router.put("/:id/status", authMiddleware, updateRequestStatus);

module.exports = router;