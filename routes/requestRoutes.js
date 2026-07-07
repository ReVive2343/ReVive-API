const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  updateRequestStatus,
} = require("../controllers/requestController");

const router = express.Router();

/**
 * @swagger
 * /requests/{productId}:
 *   post:
 *     summary: Create request for a product
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 */
router.post("/:productId", authMiddleware, createRequest);

/**
 * @swagger
 * /requests/my:
 *   get:
 *     summary: Get my sent requests
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 */
router.get("/my", authMiddleware, getMyRequests);

/**
 * @swagger
 * /requests/received:
 *   get:
 *     summary: Get requests received on my products
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 */
router.get("/received", authMiddleware, getReceivedRequests);

/**
 * @swagger
 * /requests/{id}/status:
 *   put:
 *     summary: Update request status
 *     tags:
 *       - Requests
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id/status", authMiddleware, updateRequestStatus);

module.exports = router;