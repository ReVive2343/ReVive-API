const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
require("dotenv").config();

const swaggerSpec = require("./src/config/swagger");

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const productRoutes = require("./src/routes/product.routes");
const wishlistRoutes = require("./src/routes/wishlist.routes");
const requestRoutes = require("./src/routes/request.routes");
const categoryRoutes = require("./src/routes/category.routes");
const adminRoutes = require("./src/routes/admin.routes");
const reviewRoutes = require("./src/routes/review.routes");
const notificationRoutes = require("./src/routes/notification.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static("uploads"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.json({
    message: "Revive API is running",
    status: "success",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    project: "Revive",
  });
});

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/products", reviewRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/requests", requestRoutes);
app.use("/categories", categoryRoutes);
app.use("/notifications", notificationRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Revive API running on port ${PORT}`);
});