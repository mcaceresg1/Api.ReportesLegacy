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
        url: process.env['NODE_ENV'] === 'production' 
          ? process.env['PROD_SWAGGER_URL'] || 'http://192.168.90.73:3000'
          : process.env['DEV_SWAGGER_URL'] || 'http://localhost:3000',
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
        ReporteLibroMayorItem: {
          type: 'object',
          properties: {
            saldoAcreedorDolar: {
              type: 'number',
              format: 'double',
              description: 'Saldo acreedor en dólares'
            },
            creditoDolarMayor: {
              type: 'number',
              format: 'double',
              description: 'Crédito en dólares del mayor'
            },
            saldoDeudorDolar: {
              type: 'number',
              format: 'double',
              description: 'Saldo deudor en dólares'
            },
            debitoDolarMayor: {
              type: 'number',
              format: 'double',
              description: 'Débito en dólares del mayor'
            },
            cuentaContable: {
              type: 'string',
              description: 'Código de la cuenta contable'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción de la cuenta'
            },
            saldoAcreedor: {
              type: 'number',
              format: 'double',
              description: 'Saldo acreedor en moneda local'
            },
            saldoDeudor: {
              type: 'number',
              format: 'double',
              description: 'Saldo deudor en moneda local'
            },
            creditoDolar: {
              type: 'number',
              format: 'double',
              description: 'Crédito en dólares'
            },
            creditoLocal: {
              type: 'number',
              format: 'double',
              description: 'Crédito en moneda local'
            },
            debitoDolar: {
              type: 'number',
              format: 'double',
              description: 'Débito en dólares'
            },
            debitoLocal: {
              type: 'number',
              format: 'double',
              description: 'Débito en moneda local'
            },
            asiento: {
              type: 'string',
              description: 'Número de asiento'
            },
            consecutivo: {
              type: 'integer',
              description: 'Consecutivo del asiento'
            },
            correlativoAsiento: {
              type: 'string',
              description: 'Correlativo del asiento'
            },
            centroCosto: {
              type: 'string',
              description: 'Código del centro de costo'
            },
            tipoAsiento: {
              type: 'string',
              description: 'Tipo de asiento'
            },
            referencia: {
              type: 'string',
              description: 'Referencia del asiento'
            },
            documento: {
              type: 'string',
              description: 'Documento de referencia'
            },
            nit: {
              type: 'string',
              description: 'NIT del tercero'
            },
            nitNombre: {
              type: 'string',
              description: 'Nombre del tercero'
            },
            origen: {
              type: 'string',
              description: 'Origen del asiento'
            },
            fuente: {
              type: 'string',
              description: 'Fuente del asiento'
            },
            periodoContable: {
              type: 'string',
              description: 'Período contable'
            },
            usuario: {
              type: 'string',
              description: 'Usuario que creó el asiento'
            },
            tipoLinea: {
              type: 'integer',
              description: 'Tipo de línea (1=Saldo Inicial, 2=Movimiento)'
            },
            fecha: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha del movimiento'
            },
            acepta: {
              type: 'boolean',
              description: 'Indica si el asiento es aceptado'
            },
            tipo: {
              type: 'string',
              description: 'Tipo de registro'
            }
          },
          required: [
            'cuentaContable',
            'descripcion',
            'centroCosto',
            'tipoAsiento',
            'usuario',
            'tipoLinea',
            'fecha'
          ]
        },
        FiltrosReporteLibroMayor: {
          type: 'object',
          properties: {
            usuario: {
              type: 'string',
              description: 'Usuario que solicita el reporte'
            },
            fechaInicio: {
              type: 'string',
              format: 'date',
              description: 'Fecha de inicio del reporte'
            },
            fechaFin: {
              type: 'string',
              format: 'date',
              description: 'Fecha de fin del reporte'
            },
            contabilidad: {
              type: 'string',
              enum: ['F', 'A', 'T'],
              description: 'Tipo de contabilidad (F=Fiscal, A=Administrativa, T=Todas)'
            },
            cuentasContables: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lista de cuentas contables a incluir'
            },
            centrosCosto: {
              type: 'array',
              items: { type: 'string' },
              description: 'Lista de centros de costo a incluir'
            },
            incluirSaldosIniciales: {
              type: 'boolean',
              description: 'Incluir saldos iniciales'
            },
            incluirMovimientos: {
              type: 'boolean',
              description: 'Incluir movimientos'
            },
            agruparPor: {
              type: 'string',
              enum: ['NINGUNO', 'CUENTA', 'CENTRO_COSTO', 'TIPO_ASIENTO', 'CLASE_ASIENTO', 'FECHA', 'USUARIO', 'PERIODO_CONTABLE'],
              description: 'Criterio de agrupación'
            },
            ordenarPor: {
              type: 'string',
              enum: ['FECHA', 'CUENTA', 'CENTRO_COSTO', 'TIPO_ASIENTO', 'CLASE_ASIENTO', 'USUARIO', 'VALOR', 'PERIODO_CONTABLE'],
              description: 'Campo por el cual ordenar'
            },
            orden: {
              type: 'string',
              enum: ['ASC', 'DESC'],
              description: 'Dirección del ordenamiento'
            },
            maximoRegistros: {
              type: 'integer',
              description: 'Número máximo de registros a retornar'
            }
          },
          required: ['usuario', 'fechaInicio', 'fechaFin']
        },
        ResumenLibroMayor: {
          type: 'object',
          properties: {
            totalCuentas: {
              type: 'integer',
              description: 'Total de cuentas contables'
            },
            totalCentrosCosto: {
              type: 'integer',
              description: 'Total de centros de costo'
            },
            totalAsientos: {
              type: 'integer',
              description: 'Total de asientos'
            },
            totalMovimientos: {
              type: 'integer',
              description: 'Total de movimientos'
            },
            saldoTotalDeudor: {
              type: 'number',
              format: 'double',
              description: 'Saldo total deudor'
            },
            saldoTotalAcreedor: {
              type: 'number',
              format: 'double',
              description: 'Saldo total acreedor'
            },
            saldoTotalDeudorDolar: {
              type: 'number',
              format: 'double',
              description: 'Saldo total deudor en dólares'
            },
            saldoTotalAcreedorDolar: {
              type: 'number',
              format: 'double',
              description: 'Saldo total acreedor en dólares'
            },
            totalDebito: {
              type: 'number',
              format: 'double',
              description: 'Total de débitos'
            },
            totalCredito: {
              type: 'number',
              format: 'double',
              description: 'Total de créditos'
            },
            totalDebitoDolar: {
              type: 'number',
              format: 'double',
              description: 'Total de débitos en dólares'
            },
            totalCreditoDolar: {
              type: 'number',
              format: 'double',
              description: 'Total de créditos en dólares'
            },
            periodoContableInicio: {
              type: 'string',
              description: 'Inicio del período contable'
            },
            periodoContableFin: {
              type: 'string',
              description: 'Fin del período contable'
            },
            fechaGeneracion: {
              type: 'string',
              format: 'date-time',
              description: 'Fecha de generación del reporte'
            },
            usuarioGeneracion: {
              type: 'string',
              description: 'Usuario que generó el reporte'
            }
          }
        },
        ReporteLibroMayorResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/ReporteLibroMayorItem' },
              description: 'Lista de items del reporte'
            },
            resumen: {
              $ref: '#/components/schemas/ResumenLibroMayor',
              description: 'Resumen del reporte'
            },
            filtrosAplicados: {
              $ref: '#/components/schemas/FiltrosReporteLibroMayor',
              description: 'Filtros aplicados al reporte'
            },
            metadata: {
              type: 'object',
              properties: {
                totalRegistros: {
                  type: 'integer',
                  description: 'Total de registros'
                },
                tiempoProcesamiento: {
                  type: 'integer',
                  description: 'Tiempo de procesamiento en milisegundos'
                },
                fechaGeneracion: {
                  type: 'string',
                  format: 'date-time',
                  description: 'Fecha de generación'
                },
                version: {
                  type: 'string',
                  description: 'Versión del reporte'
                }
              }
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