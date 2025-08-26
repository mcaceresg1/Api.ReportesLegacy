import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Reportes Legacy - TypeScript',
      version: '1.0.0',
      description: 'API con arquitectura hexagonal en TypeScript',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'desarrollo@empresa.com'
      }
    },
    servers: [
      {
        url: process.env['NODE_ENV'] === 'production' ? 'http://localhost:3000' : 'http://localhost:3000',
        description: process.env['NODE_ENV'] === 'production' ? 'Servidor de producción' : 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        ReporteResumenAsientos: {
          type: 'object',
          properties: {
            cuentaContableDesc: {
              type: 'string',
              description: 'Descripción de la cuenta contable'
            },
            sDescTipoAsiento: {
              type: 'string',
              description: 'Descripción del tipo de asiento'
            },
            cuentaContable: {
              type: 'string',
              description: 'Código de la cuenta contable'
            },
            sNombreQuiebre: {
              type: 'string',
              description: 'Nombre del quiebre'
            },
            creditoLocal: {
              type: 'number',
              format: 'double',
              description: 'Monto de crédito en moneda local'
            },
            creditoDolar: {
              type: 'number',
              format: 'double',
              description: 'Monto de crédito en dólares'
            },
            centroCosto: {
              type: 'string',
              description: 'Código del centro de costo'
            },
            debitoLocal: {
              type: 'number',
              format: 'double',
              description: 'Monto de débito en moneda local'
            },
            debitoDolar: {
              type: 'number',
              format: 'double',
              description: 'Monto de débito en dólares'
            },
            tipoAsiento: {
              type: 'string',
              description: 'Tipo de asiento'
            },
            tipoReporte: {
              type: 'string',
              description: 'Tipo de reporte'
            },
            nomUsuario: {
              type: 'string',
              description: 'Nombre del usuario'
            },
            finicio: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de inicio del período'
            },
            quiebre: {
              type: 'string',
              description: 'Código del quiebre'
            },
            ffinal: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha final del período'
            },
            rowOrderBy: {
              type: 'integer',
              description: 'Orden de la fila'
            }
          },
          required: [
            'cuentaContableDesc',
            'sDescTipoAsiento',
            'cuentaContable',
            'sNombreQuiebre',
            'creditoLocal',
            'creditoDolar',
            'centroCosto',
            'debitoLocal',
            'debitoDolar',
            'tipoAsiento',
            'tipoReporte',
            'nomUsuario',
            'finicio',
            'quiebre',
            'ffinal',
            'rowOrderBy'
          ]
        },
        TipoAsiento: {
          type: 'object',
          properties: {
            tipoAsiento: {
              type: 'string',
              description: 'Código del tipo de asiento'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del tipo de asiento'
            },
            noteExistsFlag: {
              type: 'integer',
              description: 'Flag de existencia de nota'
            },
            recordDate: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de registro'
            },
            rowPointer: {
              type: 'string',
              description: 'Puntero de fila'
            },
            createdBy: {
              type: 'string',
              description: 'Usuario que creó el registro'
            },
            updatedBy: {
              type: 'string',
              description: 'Usuario que actualizó el registro'
            },
            createDate: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de creación'
            }
          },
          required: [
            'tipoAsiento',
            'descripcion',
            'noteExistsFlag',
            'recordDate',
            'rowPointer',
            'createdBy',
            'updatedBy',
            'createDate'
          ]
        },
        LibroMayor: {
          type: 'object',
          properties: {
            cuentaContable: {
              type: 'string',
              description: 'Código de la cuenta contable'
            },
            centroCosto: {
              type: 'string',
              description: 'Código del centro de costo'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de la cuenta'
            },
            saldoNormal: {
              type: 'string',
              description: 'Saldo normal de la cuenta'
            },
            fecha: {
              type: 'string',
              description: 'Fecha del movimiento'
            },
            fechaCreacion: {
              type: 'string',
              description: 'Fecha de creación del asiento'
            },
            tipo: {
              type: 'string',
              description: 'Tipo de registro'
            },
            debitoLocal: {
              type: 'number',
              format: 'double',
              description: 'Débito en moneda local'
            },
            creditoLocal: {
              type: 'number',
              format: 'double',
              description: 'Crédito en moneda local'
            },
            saldoInicialLocal: {
              type: 'number',
              format: 'double',
              description: 'Saldo inicial en moneda local'
            },
            saldoFinalLocal: {
              type: 'number',
              format: 'double',
              description: 'Saldo final en moneda local'
            }
          },
          required: [
            'cuentaContable',
            'centroCosto',
            'descripcion',
            'saldoNormal',
            'fecha',
            'fechaCreacion',
            'tipo',
            'debitoLocal',
            'creditoLocal',
            'saldoInicialLocal',
            'saldoFinalLocal'
          ]
        },
        LibroMayorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indica si la operación fue exitosa'
            },
            message: {
              type: 'string',
              description: 'Mensaje de respuesta'
            },
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/LibroMayor' },
              description: 'Lista de registros del Libro Mayor'
            },
            total: {
              type: 'integer',
              description: 'Total de registros'
            },
            page: {
              type: 'integer',
              description: 'Página actual'
            },
            limit: {
              type: 'integer',
              description: 'Registros por página'
            },
            totalPages: {
              type: 'integer',
              description: 'Total de páginas'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: process.env['NODE_ENV'] === 'production' 
    ? [
        './dist/app.js',
        './dist/infrastructure/controllers/*.js',
        './dist/infrastructure/routes/*.js'
      ]
    : [
        './src/app.ts',
        './src/infrastructure/controllers/*.ts',
        './src/infrastructure/routes/*.ts'
      ]
};

export const specs = swaggerJsdoc(swaggerOptions); 