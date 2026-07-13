const wishlistService = require("../services/wishlist.service");

const addToWishlist = async (req, res) => {
  try {
    const wishlistItem = await wishlistService.addToWishlist(
      req.user.id,
      req.params.productId
    );

    return res.status(201).json({
      success: true,
      message: "Product added to wishlist",
      data: wishlistItem,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getWishlist = async (req, res) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user.id);

    return res.json({
      success: true,
      message: "Wishlist fetched successfully",
      count: wishlist.length,
      data: wishlist,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    await wishlistService.removeFromWishlist(
      req.user.id,
      req.params.productId
    );

    return res.json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};