const notificationService = require("../services/notification.service");

const getNotifications = async (req, res) => {
  try {
    const notifications =
      await notificationService.getNotifications(req.user.id);

    return res.json({
      success: true,
      message: "Notifications fetched successfully",
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const updatedCount =
      await notificationService.markAllAsRead(req.user.id);

    return res.json({
      success: true,
      message: "All notifications marked as read",
      data: {
        updatedCount,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await notificationService.deleteNotification(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};