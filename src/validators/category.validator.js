const validateCreateCategory = (req, res, next) => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Category name is required",
    });
  }

  next();
};

module.exports = {
  validateCreateCategory,
};