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
          process.env["SWAGGER_SERVER_URL"] ||
          (process.env["NODE_ENV"] === "production"
            ? "http://192.168.90.73:3000"
            : "http://192.168.90.73:3000"),
        description:
          process.env["SWAGGER_SERVER_DESCRIPTION"] ||
          (process.env["NODE_ENV"] === "production"
            ? "Servidor de producción"
            : "Servidor de desarrollo"),
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
            cuenta: {
              type: "string",
              description: "Código de la cuenta contable",
              example: "40111101",
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
            "cuenta",
            "nombre",
            "documento",
            "glosa",
            "montod",
            "montoh",
          ],
        },
        ClipperBalanceComprobacion: {
          type: "object",
          properties: {
            cuenta: {
              type: "string",
              description: "Código de la cuenta contable",
              example: "101010001",
            },
            nombre: {
              type: "string",
              description: "Nombre de la cuenta contable",
              example: "EFECTIVO SOLES LIMA",
            },
            saldoAcumuladoDebe: {
              type: "number",
              format: "double",
              description: "Saldo acumulado en debe (enero a noviembre)",
              example: 1077484.66,
            },
            saldoAcumuladoHaber: {
              type: "number",
              format: "double",
              description: "Saldo acumulado en haber (enero a noviembre)",
              example: 757125.3,
            },
            movimientoMesDebe: {
              type: "number",
              format: "double",
              description: "Movimiento del mes en debe (diciembre)",
              example: 4294156.76,
            },
            movimientoMesHaber: {
              type: "number",
              format: "double",
              description: "Movimiento del mes en haber (diciembre)",
              example: 4614516.12,
            },
            saldoActualDebe: {
              type: "number",
              format: "double",
              description: "Saldo actual en debe (enero a diciembre)",
              example: 5371641.42,
            },
            saldoActualHaber: {
              type: "number",
              format: "double",
              description: "Saldo actual en haber (enero a diciembre)",
              example: 5371641.42,
            },
          },
          required: [
            "cuenta",
            "nombre",
            "saldoAcumuladoDebe",
            "saldoAcumuladoHaber",
            "movimientoMesDebe",
            "movimientoMesHaber",
            "saldoActualDebe",
            "saldoActualHaber",
          ],
        },
        ClipperBalanceGeneral: {
          type: "object",
          properties: {
            cuenta: {
              type: "string",
              description: "Código de la cuenta contable",
              example: "101010001",
            },
            nombre: {
              type: "string",
              description: "Nombre de la cuenta contable",
              example: "EFECTIVO SOLES LIMA",
            },
            saldoAcumuladoDebe: {
              type: "number",
              format: "double",
              description:
                "Saldo acumulado en debe (enero a noviembre o hasta mes anterior)",
              example: 1077484.66,
            },
            saldoAcumuladoHaber: {
              type: "number",
              format: "double",
              description:
                "Saldo acumulado en haber (enero a noviembre o hasta mes anterior)",
              example: 757125.3,
            },
            movimientoMesDebe: {
              type: "number",
              format: "double",
              description:
                "Movimiento del mes en debe (diciembre o mes especificado)",
              example: 4294156.76,
            },
            movimientoMesHaber: {
              type: "number",
              format: "double",
              description:
                "Movimiento del mes en haber (diciembre o mes especificado)",
              example: 4614516.12,
            },
            saldoActualDebe: {
              type: "number",
              format: "double",
              description:
                "Saldo actual en debe (enero a diciembre o hasta mes especificado)",
              example: 5371641.42,
            },
            saldoActualHaber: {
              type: "number",
              format: "double",
              description:
                "Saldo actual en haber (enero a diciembre o hasta mes especificado)",
              example: 5371641.42,
            },
          },
          required: [
            "cuenta",
            "nombre",
            "saldoAcumuladoDebe",
            "saldoAcumuladoHaber",
            "movimientoMesDebe",
            "movimientoMesHaber",
            "saldoActualDebe",
            "saldoActualHaber",
          ],
        },
        ClipperEstadoGananciasYResultados: {
          type: "object",
          properties: {
            concepto: {
              type: "string",
              description:
                "Concepto del estado de ganancias y pérdidas (ej. VENTAS, GASTOS ADMINISTRATIVOS)",
              example: "VENTAS",
            },
            monto: {
              type: "string",
              description:
                "Monto formateado como string para mantener formato N2",
              example: "6,110,267.20",
            },
            orden: {
              type: "integer",
              description: "Orden de presentación en el reporte",
              example: 1,
            },
          },
          required: ["concepto", "monto", "orden"],
        },
        FiltrosGananciasPerdidasClipper: {
          type: "object",
          properties: {
            periodoDesde: {
              type: "integer",
              minimum: 1,
              maximum: 12,
              description: "Mes de inicio del período (1-12)",
              example: 1,
            },
            periodoHasta: {
              type: "integer",
              minimum: 1,
              maximum: 12,
              description: "Mes de fin del período (1-12)",
              example: 12,
            },
          },
          required: ["periodoDesde", "periodoHasta"],
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
