const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Revive API",
      version: "1.0.0",
      description: "API documentation for Revive project",
    },
    servers: [
      {
        url: "http://3.7.173.134:5000",
        description: "AWS Lightsail Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./server.js", "./routes/*.js"],
};

module.exports = swaggerJsdoc(options);
