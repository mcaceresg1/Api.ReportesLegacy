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
        url:
          process.env["NODE_ENV"] === "production"
            ? process.env["PROD_SWAGGER_URL"] || "http://192.168.90.73:3000"
            : process.env["DEV_SWAGGER_URL"] || "http://localhost:3000",
        description:
          process.env["NODE_ENV"] === "production"
            ? "Servidor de producción"
            : "Servidor de desarrollo",
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
        ReporteResumenAsientos: {
          type: "object",
          properties: {
            cuentaContableDesc: {
              type: "string",
              description: "Descripción de la cuenta contable",
            },
            sDescTipoAsiento: {
              type: "string",
              description: "Descripción del tipo de asiento",
            },
            cuentaContable: {
              type: "string",
              description: "Código de la cuenta contable",
            },
            sNombreQuiebre: {
              type: "string",
              description: "Nombre del quiebre",
            },
            creditoLocal: {
              type: "number",
              format: "double",
              description: "Monto de crédito en moneda local",
            },
            creditoDolar: {
              type: "number",
              format: "double",
              description: "Monto de crédito en dólares",
            },
            centroCosto: {
              type: "string",
              description: "Código del centro de costo",
            },
            debitoLocal: {
              type: "number",
              format: "double",
              description: "Monto de débito en moneda local",
            },
            debitoDolar: {
              type: "number",
              format: "double",
              description: "Monto de débito en dólares",
            },
            tipoAsiento: {
              type: "string",
              description: "Tipo de asiento",
            },
            tipoReporte: {
              type: "string",
              description: "Tipo de reporte",
            },
            nomUsuario: {
              type: "string",
              description: "Nombre del usuario",
            },
            finicio: {
              type: "string",
              format: "date-time",
              description: "Fecha de inicio del período",
            },
            quiebre: {
              type: "string",
              description: "Código del quiebre",
            },
            ffinal: {
              type: "string",
              format: "date-time",
              description: "Fecha final del período",
            },
            rowOrderBy: {
              type: "integer",
              description: "Orden de la fila",
            },
          },
          required: [
            "cuentaContableDesc",
            "sDescTipoAsiento",
            "cuentaContable",
            "sNombreQuiebre",
            "creditoLocal",
            "creditoDolar",
            "centroCosto",
            "debitoLocal",
            "debitoDolar",
            "tipoAsiento",
            "tipoReporte",
            "nomUsuario",
            "finicio",
            "quiebre",
            "ffinal",
            "rowOrderBy",
          ],
        },
        TipoAsiento: {
          type: "object",
          properties: {
            tipoAsiento: {
              type: "string",
              description: "Código del tipo de asiento",
            },
            descripcion: {
              type: "string",
              description: "Descripción del tipo de asiento",
            },
            noteExistsFlag: {
              type: "integer",
              description: "Flag de existencia de nota",
            },
            recordDate: {
              type: "string",
              format: "date-time",
              description: "Fecha de registro",
            },
            rowPointer: {
              type: "string",
              description: "Puntero de fila",
            },
            createdBy: {
              type: "string",
              description: "Usuario que creó el registro",
            },
            updatedBy: {
              type: "string",
              description: "Usuario que actualizó el registro",
            },
            createDate: {
              type: "string",
              format: "date-time",
              description: "Fecha de creación",
            },
          },
          required: [
            "tipoAsiento",
            "descripcion",
            "noteExistsFlag",
            "recordDate",
            "rowPointer",
            "createdBy",
            "updatedBy",
            "createDate",
          ],
        },
        // Schemas de Libro Mayor eliminados
        // ReporteLibroMayorItem, FiltrosReporteLibroMayor, ResumenLibroMayor, ReporteLibroMayorResponse
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis:
    process.env["NODE_ENV"] === "production"
      ? [
          "./dist/app.js",
          "./dist/infrastructure/controllers/*.js",
          "./dist/infrastructure/routes/*.js",
        ]
      : [
          "./src/app.ts",
          "./src/infrastructure/controllers/*.ts",
          "./src/infrastructure/routes/*.ts",
        ],
};

export const specs = swaggerJsdoc(swaggerOptions);
