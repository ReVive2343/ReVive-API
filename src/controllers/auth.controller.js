const authService = require("../services/auth.service");

const register = async (req, res) => {
  try {
    const user = await authService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);

    res.json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);

    res.json({
      success: true,
      message: "Password reset link generated successfully. (Check server logs)",
      data: result,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    await authService.resetPassword(req.body);

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
};