/**
 * Configuración de Swagger para el módulo de Diario de Contabilidad
 * Define los esquemas y documentación OpenAPI para todas las operaciones
 * del reporte de Diario de Contabilidad
 */

export const diarioContabilidadSwaggerConfig = {
  // Esquemas de datos
  schemas: {
    DiarioContabilidad: {
      type: 'object',
      description: 'Registro individual del Diario de Contabilidad',
      properties: {
        CUENTA_CONTABLE_DESC: {
          type: 'string',
          description: 'Descripción de la cuenta contable',
          example: 'CAJA GENERAL'
        },
        CORRELATIVO_ASIENTO: {
          type: 'string',
          description: 'Correlativo del asiento',
          example: '001'
        },
        SDESC_TIPO_ASIENTO: {
          type: 'string',
          description: 'Descripción del tipo de asiento',
          example: 'ASIENTO DE APERTURA'
        },
        CUENTA_CONTABLE: {
          type: 'string',
          description: 'Código de la cuenta contable',
          example: '1105001'
        },
        CREDITO_LOCAL: {
          type: 'number',
          format: 'decimal',
          description: 'Crédito en moneda local',
          example: 0.00
        },
        CREDITO_DOLAR: {
          type: 'number',
          format: 'decimal',
          description: 'Crédito en dólares',
          example: 0.00
        },
        CENTRO_COSTO: {
          type: 'string',
          description: 'Código del centro de costo',
          example: '001'
        },
        DEBITO_LOCAL: {
          type: 'number',
          format: 'decimal',
          description: 'Débito en moneda local',
          example: 1000.00
        },
        DEBITO_DOLAR: {
          type: 'number',
          format: 'decimal',
          description: 'Débito en dólares',
          example: 250.00
        },
        TIPO_ASIENTO: {
          type: 'string',
          description: 'Código del tipo de asiento',
          example: '01'
        },
        TIPO_REPORTE: {
          type: 'string',
          description: 'Tipo de reporte (Preliminar/Oficial)',
          enum: ['Preliminar', 'Oficial'],
          example: 'Preliminar'
        },
        CONSECUTIVO: {
          type: 'string',
          description: 'Número consecutivo',
          example: '000001'
        },
        REFERENCIA: {
          type: 'string',
          description: 'Referencia del movimiento',
          example: 'APERTURA 2024'
        },
        TIPO_CAMBIO: {
          type: 'number',
          format: 'decimal',
          description: 'Tipo de cambio',
          example: 3.75
        },
        NOM_USUARIO: {
          type: 'string',
          description: 'Nombre del usuario',
          example: 'ADMIN'
        },
        NIT_NOMBRE: {
          type: 'string',
          description: 'Razón social del NIT',
          example: 'EMPRESA DEMO S.A.S.'
        },
        DOCUMENTO: {
          type: 'string',
          description: 'Número de documento',
          example: 'DOC001'
        },
        ASIENTO: {
          type: 'string',
          description: 'Número de asiento',
          example: '000001'
        },
        TIPO_DOC: {
          type: 'string',
          description: 'Tipo de documento',
          example: 'FAC'
        },
        FINICIO: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha de inicio del período',
          example: '2024-01-01T00:00:00.000Z'
        },
        MODULO: {
          type: 'string',
          description: 'Módulo de origen',
          enum: ['CP', 'CB', 'CC', 'FEE', 'IC', 'CJ'],
          example: 'CP'
        },
        FFINAL: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha final del período',
          example: '2024-12-31T23:59:59.000Z'
        },
        FUENTE: {
          type: 'string',
          description: 'Fuente del movimiento',
          example: 'CPDOC001'
        },
        FECHA: {
          type: 'string',
          format: 'date-time',
          description: 'Fecha del movimiento',
          example: '2024-01-15T00:00:00.000Z'
        },
        NOTAS: {
          type: 'string',
          description: 'Notas del asiento',
          example: 'Asiento de apertura del ejercicio contable 2024'
        },
        NIT: {
          type: 'string',
          description: 'Número de identificación tributaria',
          example: '900123456'
        },
        ROW_ORDER_BY: {
          type: 'integer',
          description: 'Orden de la fila',
          example: 1
        }
      }
    },

    DiarioContabilidadResponse: {
      type: 'object',
      description: 'Respuesta paginada del Diario de Contabilidad',
      properties: {
        data: {
          type: 'array',
          description: 'Array de registros del diario',
          items: {
            $ref: '#/components/schemas/DiarioContabilidad'
          }
        },
        total: {
          type: 'integer',
          description: 'Total de registros que coinciden con los filtros',
          example: 150
        },
        pagina: {
          type: 'integer',
          description: 'Página actual',
          example: 1
        },
        porPagina: {
          type: 'integer',
          description: 'Registros por página',
          example: 25
        },
        totalPaginas: {
          type: 'integer',
          description: 'Total de páginas disponibles',
          example: 6
        }
      }
    },

    GenerarDiarioContabilidadRequest: {
      type: 'object',
      description: 'Parámetros para generar el reporte de Diario de Contabilidad',
      required: ['conjunto', 'usuario', 'fechaInicio', 'fechaFin'],
      properties: {
        conjunto: {
          type: 'string',
          description: 'Código del conjunto contable',
          example: '001'
        },
        usuario: {
          type: 'string',
          description: 'Usuario que genera el reporte',
          example: 'ADMIN'
        },
        fechaInicio: {
          type: 'string',
          format: 'date',
          description: 'Fecha de inicio del período (YYYY-MM-DD)',
          example: '2024-01-01'
        },
        fechaFin: {
          type: 'string',
          format: 'date',
          description: 'Fecha de fin del período (YYYY-MM-DD)',
          example: '2024-12-31'
        },
        contabilidad: {
          type: 'string',
          description: 'Tipo de contabilidad a incluir',
          enum: ['F', 'A', 'F,A'],
          default: 'F,A',
          example: 'F'
        },
        tipoReporte: {
          type: 'string',
          description: 'Tipo de reporte a generar',
          enum: ['Preliminar', 'Oficial'],
          default: 'Preliminar',
          example: 'Preliminar'
        }
      }
    },

    DiarioContabilidadFiltros: {
      type: 'object',
      description: 'Filtros disponibles para consultar el Diario de Contabilidad',
      required: ['conjunto', 'usuario', 'fechaInicio', 'fechaFin'],
      properties: {
        conjunto: {
          type: 'string',
          description: 'Código del conjunto contable',
          example: '001'
        },
        usuario: {
          type: 'string',
          description: 'Usuario propietario del reporte',
          example: 'ADMIN'
        },
        fechaInicio: {
          type: 'string',
          format: 'date',
          description: 'Fecha de inicio del período',
          example: '2024-01-01'
        },
        fechaFin: {
          type: 'string',
          format: 'date',
          description: 'Fecha de fin del período',
          example: '2024-12-31'
        },
        contabilidad: {
          type: 'string',
          description: 'Tipo de contabilidad',
          enum: ['F', 'A', 'F,A'],
          default: 'F,A',
          example: 'F'
        },
        tipoReporte: {
          type: 'string',
          description: 'Tipo de reporte',
          enum: ['Preliminar', 'Oficial'],
          default: 'Preliminar',
          example: 'Preliminar'
        },
        cuentaContable: {
          type: 'string',
          description: 'Filtro por cuenta contable (búsqueda parcial)',
          example: '1105'
        },
        centroCosto: {
          type: 'string',
          description: 'Filtro por centro de costo (búsqueda parcial)',
          example: '001'
        },
        nit: {
          type: 'string',
          description: 'Filtro por NIT (búsqueda parcial)',
          example: '900123'
        },
        tipoAsiento: {
          type: 'string',
          description: 'Filtro por tipo de asiento',
          example: '01'
        },
        asiento: {
          type: 'string',
          description: 'Filtro por número de asiento',
          example: '000001'
        },
        origen: {
          type: 'string',
          description: 'Filtro por origen/módulo',
          enum: ['CP', 'CB', 'CC', 'FEE', 'IC', 'CJ'],
          example: 'CP'
        },
        page: {
          type: 'integer',
          minimum: 1,
          description: 'Número de página para paginación',
          example: 1
        },
        limit: {
          type: 'integer',
          minimum: 1,
          maximum: 1000,
          description: 'Registros por página',
          example: 25
        }
      }
    },

    ApiResponse: {
      type: 'object',
      description: 'Respuesta estándar de la API',
      properties: {
        success: {
          type: 'boolean',
          description: 'Indica si la operación fue exitosa',
          example: true
        },
        message: {
          type: 'string',
          description: 'Mensaje descriptivo del resultado',
          example: 'Operación completada exitosamente'
        },
        data: {
          description: 'Datos de respuesta (varía según el endpoint)',
          example: {}
        },
        error: {
          type: 'string',
          description: 'Mensaje de error (solo presente si success = false)',
          example: 'Error específico que ocurrió'
        }
      }
    },

    ErrorResponse: {
      type: 'object',
      description: 'Respuesta de error estándar',
      properties: {
        success: {
          type: 'boolean',
          example: false
        },
        message: {
          type: 'string',
          example: 'Error al procesar la solicitud'
        },
        error: {
          type: 'string',
          example: 'Descripción específica del error'
        }
      }
    }
  },

  // Tags para agrupar endpoints
  tags: [
    {
      name: 'Diario de Contabilidad',
      description: 'Operaciones del reporte de Diario de Contabilidad. Combina datos de las tablas MAYOR y DIARIO para generar reportes contables detallados con información de asientos, movimientos y balances.'
    }
  ],

  // Ejemplos de respuestas comunes
  examples: {
    DiarioContabilidadExample: {
      summary: 'Ejemplo de registro del Diario de Contabilidad',
      value: {
        CUENTA_CONTABLE_DESC: 'CAJA GENERAL',
        CORRELATIVO_ASIENTO: '001',
        SDESC_TIPO_ASIENTO: 'ASIENTO DE APERTURA',
        CUENTA_CONTABLE: '1105001',
        CREDITO_LOCAL: 0.00,
        CREDITO_DOLAR: 0.00,
        CENTRO_COSTO: '001',
        DEBITO_LOCAL: 1000.00,
        DEBITO_DOLAR: 250.00,
        TIPO_ASIENTO: '01',
        TIPO_REPORTE: 'Preliminar',
        CONSECUTIVO: '000001',
        REFERENCIA: 'APERTURA 2024',
        TIPO_CAMBIO: 3.75,
        NOM_USUARIO: 'ADMIN',
        NIT_NOMBRE: 'EMPRESA DEMO S.A.S.',
        DOCUMENTO: 'DOC001',
        ASIENTO: '000001',
        TIPO_DOC: 'FAC',
        FINICIO: '2024-01-01T00:00:00.000Z',
        MODULO: 'CP',
        FFINAL: '2024-12-31T23:59:59.000Z',
        FUENTE: 'CPDOC001',
        FECHA: '2024-01-15T00:00:00.000Z',
        NOTAS: 'Asiento de apertura del ejercicio contable 2024',
        NIT: '900123456',
        ROW_ORDER_BY: 1
      }
    },

    SuccessResponse: {
      summary: 'Respuesta exitosa',
      value: {
        success: true,
        message: 'Operación completada exitosamente',
        data: {}
      }
    },

    ErrorResponseExample: {
      summary: 'Respuesta de error',
      value: {
        success: false,
        message: 'Error al procesar la solicitud',
        error: 'Los parámetros requeridos no fueron proporcionados'
      }
    }
  }
};

export default diarioContabilidadSwaggerConfig;
