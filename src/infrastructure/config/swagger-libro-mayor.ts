/**
 * @swagger
 * components:
 *   schemas:
 *     LibroMayor:
 *       type: object
 *       properties:
 *         CUENTA_CONTABLE:
 *           type: string
 *           description: Código de la cuenta contable
 *           example: "11"
 *         DESCRIPCION:
 *           type: string
 *           description: Descripción de la cuenta contable
 *           example: "Caja y Bancos"
 *         ASIENTO:
 *           type: string
 *           description: Número del asiento contable
 *           example: "2023-001"
 *         TIPO:
 *           type: string
 *           description: Tipo de documento
 *           example: "FA"
 *         DOCUMENTO:
 *           type: string
 *           description: Número del documento
 *           example: "001-001-000000001"
 *         REFERENCIA:
 *           type: string
 *           description: Referencia del asiento
 *           example: "Factura de venta"
 *         SALDO_DEUDOR:
 *           type: number
 *           description: Saldo deudor en moneda local
 *           example: 1000.00
 *         SALDO_ACREEDOR:
 *           type: number
 *           description: Saldo acreedor en moneda local
 *           example: 0.00
 *         DEBITO_LOCAL:
 *           type: number
 *           description: Débito en moneda local
 *           example: 1000.00
 *         CREDITO_LOCAL:
 *           type: number
 *           description: Crédito en moneda local
 *           example: 0.00
 *         SALDO_DEUDOR_DOLAR:
 *           type: number
 *           description: Saldo deudor en dólares
 *           example: 250.00
 *         SALDO_ACREEDOR_DOLAR:
 *           type: number
 *           description: Saldo acreedor en dólares
 *           example: 0.00
 *         DEBITO_DOLAR:
 *           type: number
 *           description: Débito en dólares
 *           example: 250.00
 *         CREDITO_DOLAR:
 *           type: number
 *           description: Crédito en dólares
 *           example: 0.00
 *         DEBITO_DOLAR_MAYOR:
 *           type: number
 *           description: Débito en dólares del mayor
 *           example: 250.00
 *         CREDITO_DOLAR_MAYOR:
 *           type: number
 *           description: Crédito en dólares del mayor
 *           example: 0.00
 *         CENTRO_COSTO:
 *           type: string
 *           description: Código del centro de costo
 *           example: "ADMIN"
 *         TIPO_ASIENTO:
 *           type: string
 *           description: Tipo de asiento contable
 *           example: "FA"
 *         FECHA:
 *           type: string
 *           format: date-time
 *           description: Fecha del asiento
 *           example: "2023-01-15T00:00:00.000Z"
 *         CONSECUTIVO:
 *           type: number
 *           description: Número consecutivo del asiento
 *           example: 1
 *         CORRELATIVO_ASIENTO:
 *           type: string
 *           description: Correlativo del asiento
 *           example: "2023-001"
 *         TIPO_LINEA:
 *           type: number
 *           description: Tipo de línea (1=Saldos iniciales, 2=Movimientos)
 *           example: 2
 *         NIT:
 *           type: string
 *           description: NIT del tercero
 *           example: "12345678"
 *         NIT_NOMBRE:
 *           type: string
 *           description: Razón social del tercero
 *           example: "EMPRESA EJEMPLO S.A.S"
 *         FUENTE:
 *           type: string
 *           description: Fuente del asiento
 *           example: "FA001-001-000000001"
 *         PERIODO_CONTABLE:
 *           type: string
 *           format: date-time
 *           description: Período contable
 *           example: "2023-12-31T00:00:00.000Z"
 *         USUARIO:
 *           type: string
 *           description: Usuario que generó el reporte
 *           example: "ADMPQUES"
 *         ROW_ORDER_BY:
 *           type: number
 *           description: Orden de la fila
 *           example: 1
 *       required:
 *         - CUENTA_CONTABLE
 *         - DESCRIPCION
 *         - ASIENTO
 *         - TIPO
 *         - DOCUMENTO
 *         - REFERENCIA
 *         - SALDO_DEUDOR
 *         - SALDO_ACREEDOR
 *         - DEBITO_LOCAL
 *         - CREDITO_LOCAL
 *         - SALDO_DEUDOR_DOLAR
 *         - SALDO_ACREEDOR_DOLAR
 *         - DEBITO_DOLAR
 *         - CREDITO_DOLAR
 *         - DEBITO_DOLAR_MAYOR
 *         - CREDITO_DOLAR_MAYOR
 *         - CENTRO_COSTO
 *         - TIPO_ASIENTO
 *         - FECHA
 *         - CONSECUTIVO
 *         - CORRELATIVO_ASIENTO
 *         - TIPO_LINEA
 *         - NIT
 *         - NIT_NOMBRE
 *         - FUENTE
 *     
 *     LibroMayorFiltros:
 *       type: object
 *       properties:
 *         conjunto:
 *           type: string
 *           description: Código del conjunto contable
 *           example: "PRLTRA"
 *         usuario:
 *           type: string
 *           description: Usuario que solicita el reporte
 *           example: "ADMPQUES"
 *         fechaInicio:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del período
 *           example: "2023-01-01"
 *         fechaFin:
 *           type: string
 *           format: date
 *           description: Fecha de fin del período
 *           example: "2025-07-15"
 *         cuentaContable:
 *           type: string
 *           description: Filtro por cuenta contable
 *           example: "11"
 *         centroCosto:
 *           type: string
 *           description: Filtro por centro de costo
 *           example: "ADMIN"
 *         nit:
 *           type: string
 *           description: Filtro por NIT
 *           example: "12345678"
 *         tipoAsiento:
 *           type: string
 *           description: Filtro por tipo de asiento
 *           example: "FA"
 *         limit:
 *           type: number
 *           description: Límite de registros por página
 *           example: 100
 *         offset:
 *           type: number
 *           description: Desplazamiento para paginación
 *           example: 0
 *       required:
 *         - conjunto
 *         - usuario
 *         - fechaInicio
 *         - fechaFin
 *     
 *     LibroMayorResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/LibroMayor'
 *         total:
 *           type: number
 *           description: Total de registros
 *           example: 1500
 *         pagina:
 *           type: number
 *           description: Página actual
 *           example: 1
 *         porPagina:
 *           type: number
 *           description: Registros por página
 *           example: 100
 *         totalPaginas:
 *           type: number
 *           description: Total de páginas
 *           example: 15
 *       required:
 *         - data
 *         - total
 *         - pagina
 *         - porPagina
 *         - totalPaginas
 *     
 *     GenerarReporteLibroMayorRequest:
 *       type: object
 *       properties:
 *         conjunto:
 *           type: string
 *           description: Código del conjunto contable
 *           example: "PRLTRA"
 *         usuario:
 *           type: string
 *           description: Usuario que solicita el reporte
 *           example: "ADMPQUES"
 *         fechaInicio:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del período
 *           example: "2023-01-01"
 *         fechaFin:
 *           type: string
 *           format: date
 *           description: Fecha de fin del período
 *           example: "2025-07-15"
 *       required:
 *         - conjunto
 *         - usuario
 *         - fechaInicio
 *         - fechaFin
 *     
 *     GenerarReporteLibroMayorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *           example: true
 *         message:
 *           type: string
 *           description: Mensaje de respuesta
 *           example: "Reporte del libro mayor generado exitosamente"
 *         data:
 *           type: object
 *           properties:
 *             conjunto:
 *               type: string
 *               example: "PRLTRA"
 *             usuario:
 *               type: string
 *               example: "ADMPQUES"
 *             fechaInicio:
 *               type: string
 *               format: date-time
 *               example: "2023-01-01T00:00:00.000Z"
 *             fechaFin:
 *               type: string
 *               format: date-time
 *               example: "2025-07-15T00:00:00.000Z"
 *             timestamp:
 *               type: string
 *               format: date-time
 *               example: "2024-01-15T10:30:00.000Z"
 *       required:
 *         - success
 *         - message
 *         - data
 *     
 *     ObtenerLibroMayorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *           example: true
 *         message:
 *           type: string
 *           description: Mensaje de respuesta
 *           example: "Libro mayor obtenido exitosamente"
 *         data:
 *           $ref: '#/components/schemas/LibroMayorResponse'
 *         paginacion:
 *           type: object
 *           properties:
 *             pagina:
 *               type: number
 *               example: 1
 *             porPagina:
 *               type: number
 *               example: 100
 *             total:
 *               type: number
 *               example: 1500
 *             totalPaginas:
 *               type: number
 *               example: 15
 *       required:
 *         - success
 *         - message
 *         - data
 *         - paginacion
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si la operación fue exitosa
 *           example: false
 *         message:
 *           type: string
 *           description: Mensaje de error
 *           example: "Error interno del servidor"
 *         error:
 *           type: string
 *           description: Detalle del error
 *           example: "No se pudo conectar a la base de datos"
 *       required:
 *         - success
 *         - message
 */
