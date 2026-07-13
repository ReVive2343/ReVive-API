const adminService = require("../services/admin.service");

const getDashboardStats = async (req, res) => {
  try {
    const stats = await adminService.getDashboardStats();

    return res.json({
      success: true,
      message: "Dashboard statistics fetched successfully",
      data: stats,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await adminService.getAllUsers();

    return res.json({
      success: true,
      message: "Users fetched successfully",
      count: users.length,
      data: users,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await adminService.getAllProducts();

    return res.json({
      success: true,
      message: "Products fetched successfully",
      count: products.length,
      data: products,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const user = await adminService.updateUserRole(
      req.params.id,
      req.body.role,
      req.user.id
    );

    return res.json({
      success: true,
      message: "User role updated successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await adminService.deleteUser(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      message: "User deleted successfully",
      data: user,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await adminService.deleteProduct(req.params.id);

    return res.json({
      success: true,
      message: "Product deleted successfully",
      data: product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  getAllProducts,
  updateUserRole,
  deleteUser,
  deleteProduct,
};