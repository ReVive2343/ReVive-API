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
        url: "https://reviveapi.defigo.in",
        description: "Production Server",
      },
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
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
  apis: ["./src/routes/*.js", "./routes/*.js"],
};

module.exports = swaggerJsdoc(options);