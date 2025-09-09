import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Reportes Legacy - TypeScript",
      version: "1.0.0",
      description: "API con arquitectura hexagonal en TypeScript",
      contact: {
        name: "Equipo de Desarrollo",
        email: "desarrollo@empresa.com",
      },
    },
    servers: [
      {
        url: process.env["PROD_SWAGGER_URL"] || "http://192.168.90.73:3000",
        description: "Servidor de producción",
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
      schemas: {
        ClipperLibroDiario: {
          type: "object",
          properties: {
            clase: {
              type: "string",
              description: "Clase del comprobante (ej. COMPRAS)",
              example: "COMPRAS",
            },
            numeroComprobante: {
              type: "string",
              description: "Número del comprobante",
              example: "D06/00066",
            },
            nombre: {
              type: "string",
              description: "Nombre del concepto",
              example: "I.G.V.",
            },
            documento: {
              type: "string",
              description: "Número de documento",
              example: "TK/40614",
            },
            glosa: {
              type: "string",
              description: "Descripción o glosa del movimiento",
              example: "GASTOS VARIOS",
            },
            montod: {
              type: "number",
              format: "double",
              description: "Monto débito",
              example: 0,
            },
            montoh: {
              type: "number",
              format: "double",
              description: "Monto haber",
              example: 79.48,
            },
          },
          required: [
            "clase",
            "numeroComprobante",
            "nombre",
            "documento",
            "glosa",
            "montod",
            "montoh",
          ],
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    "./dist/app.js",
    "./dist/infrastructure/controllers/*.js",
    "./dist/infrastructure/routes/*.js",
  ],
};

export const specs = swaggerJsdoc(swaggerOptions);
