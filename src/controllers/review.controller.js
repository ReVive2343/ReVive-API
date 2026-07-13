const reviewService = require("../services/review.service");

const addReview = async (req, res) => {
  try {
    const review = await reviewService.addReview(
      req.params.id,
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getProductReviews = async (req, res) => {
  try {
    const result = await reviewService.getProductReviews(req.params.id);

    return res.json({
      success: true,
      message: "Reviews fetched successfully",
      data: result.reviews,
      summary: {
        averageRating: result.averageRating,
        totalReviews: result.totalReviews,
      },
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    await reviewService.deleteReview(
      req.params.productId,
      req.params.reviewId,
      req.user.id
    );

    return res.json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  addReview,
  getProductReviews,
  deleteReview,
};