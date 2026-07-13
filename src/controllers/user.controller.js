const userService = require("../services/user.service");

const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user);

    res.json({
      success: true,
      message: "Profile fetched successfully",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateProfile(req.user.id, req.body);

    res.json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    await userService.changePassword(req.user.id, req.body);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
};