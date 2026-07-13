const productService = require("../services/product.service");

const createProduct = async (req, res) => {
  try {
    const product = await productService.createProduct(
      req.user.id,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const result = await productService.getProducts(req.query);

    return res.json({
      success: true,
      message: "Products fetched successfully",
      data: result.products,
      pagination: result.pagination,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);

    return res.json({
      success: true,
      message: "Product fetched successfully",
      data: product,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await productService.updateProduct(
      req.params.id,
      req.user.id,
      req.body
    );

    return res.json({
      success: true,
      message: "Product updated successfully",
      data: product,
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
    await productService.deleteProduct(req.params.id, req.user.id);

    return res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const uploadProductImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one image is required",
      });
    }

    const imageUrls = req.files.map(
      (file) =>
        `${req.protocol}://${req.get("host")}/uploads/${file.filename}`
    );

    const images = await productService.uploadProductImages(
      req.params.id,
      req.user.id,
      imageUrls
    );

    return res.status(201).json({
      success: true,
      message: "Images uploaded successfully",
      data: images,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

const getProductImages = async (req, res) => {
  try {
    const images = await productService.getProductImages(req.params.id);

    return res.json({
      success: true,
      message: "Product images fetched successfully",
      data: images,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  getProductImages,
};