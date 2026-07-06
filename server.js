const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const pool = require("./config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const authMiddleware = require("./middleware/authMiddleware");
const swaggerUi = require("swagger-ui-express");

const swaggerSpec = require("./config/swagger");
const express = require("express");

const cors = require("cors");

require("dotenv").config();



const app = express();



app.use(cors());

app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Check Revive API status
 *     responses:
 *       200:
 *         description: API is running
 */

app.get("/", (req, res) => {

  res.json({

    message: "Revive API is running",

    status: "success"

  });

});

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Server health status
 */

app.get("/health", (req, res) => {

  res.json({

    status: "healthy",

    project: "Revive"

  });

});



const PORT = process.env.PORT || 5000;


app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.listen(PORT, "0.0.0.0", () => {

  console.log(`Revive API running on port ${PORT}`);

});
