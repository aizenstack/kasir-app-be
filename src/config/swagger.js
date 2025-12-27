const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kasir App API",
      version: "1.0.0",
      description: "API Documentation for Kasir App",
      contact: {
        name: "API Support",
      },
    },
    servers: [
      {
        url: require('./env').getApiUrl(),
        description: require('./env').isProduction() ? 'Production server' : 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        OAuth2Password: {
          type: "oauth2",
          flows: {
            password: {
              tokenUrl: `${require('./env').getApiUrl()}/auth/token`,
              scopes: {
                administrator: "Administrator access",
                petugas: "Petugas access"
              },
            },
          },
        },
      },
    },
    security: [
      {
        OAuth2Password: [],
      },
    ],
  },
  apis: ["./src/routes/*.js", "./src/controllers/*.js"], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerSetup = (app) => {
  app.use(
    "/sikas/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Kasir App API Documentation",
    })
  );
};

module.exports = { swaggerSetup, swaggerSpec };
