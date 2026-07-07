const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controllers/notificationController");

const router = express.Router();

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get my notifications
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 */
router.get("/", authMiddleware, getNotifications);

/**
 * @swagger
 * /notifications/{id}/read:
 *   put:
 *     summary: Mark notification as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id/read", authMiddleware, markAsRead);

/**
 * @swagger
 * /notifications/read-all:
 *   put:
 *     summary: Mark all notifications as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 */
router.put("/read-all", authMiddleware, markAllAsRead);

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete notification
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", authMiddleware, deleteNotification);

module.exports = router;