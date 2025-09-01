import { injectable, inject } from "inversify";
import { Router } from "express";
import { ReporteGenericoSaldosController } from "../controllers/ReporteGenericoSaldosController";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

@injectable()
export class ReporteGenericoSaldosRoutes {
  private router: Router;

  constructor(
    @inject("ReporteGenericoSaldosController")
    private reporteGenericoSaldosController: ReporteGenericoSaldosController,
    @inject("AuthMiddleware")
    private authMiddleware: AuthMiddleware
  ) {
    this.router = Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Aplicar middleware de autenticación a todas las rutas
    this.router.use(this.authMiddleware.verifyToken);

    /**
     * @swagger
     * /api/reporte-generico-saldos/generar:
     *   post:
     *     summary: Genera el reporte genérico de saldos
     *     tags: [Reporte Generico Saldos]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - conjunto
     *               - usuario
     *               - fechaInicio
     *               - fechaFin
     *             properties:
     *               conjunto:
     *                 type: string
     *                 description: Código del conjunto contable
     *                 example: "ASFSAC"
     *               usuario:
     *                 type: string
     *                 description: Usuario que genera el reporte
     *                 example: "ADMIN"
     *               fechaInicio:
     *                 type: string
     *                 format: date
     *                 description: Fecha de inicio del reporte
     *                 example: "2020-01-01"
     *               fechaFin:
     *                 type: string
     *                 format: date
     *                 description: Fecha fin del reporte
     *                 example: "2023-12-31"
     *               contabilidad:
     *                 type: string
     *                 description: Tipo de contabilidad (F=Fiscal, A=Administrativa)
     *                 example: "F,A"
     *               tipoAsiento:
     *                 type: string
     *                 description: Tipo de asiento a excluir
     *                 example: "06"
     *               claseAsiento:
     *                 type: string
     *                 description: Clase de asiento a excluir
     *                 example: "C"
     *     responses:
     *       200:
     *         description: Reporte generado exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 message:
     *                   type: string
     *                   example: "Reporte genérico de saldos generado exitosamente"
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    this.router.post(
      "/generar",
      this.reporteGenericoSaldosController.generarReporte.bind(
        this.reporteGenericoSaldosController
      )
    );

    /**
     * @swagger
     * /api/reporte-generico-saldos/obtener:
     *   get:
     *     summary: Obtiene los datos del reporte genérico de saldos con filtros y paginación
     *     tags: [Reporte Generico Saldos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: conjunto
     *         required: true
     *         schema:
     *           type: string
     *         description: Código del conjunto contable
     *         example: "ASFSAC"
     *       - in: query
     *         name: usuario
     *         schema:
     *           type: string
     *         description: Usuario que genera el reporte
     *         example: "ADMIN"
     *       - in: query
     *         name: fechaInicio
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha de inicio del reporte
     *         example: "2020-01-01"
     *       - in: query
     *         name: fechaFin
     *         schema:
     *           type: string
     *           format: date
     *         description: Fecha fin del reporte
     *         example: "2023-12-31"
     *       - in: query
     *         name: page
     *         schema:
     *           type: integer
     *           minimum: 1
     *         description: Número de página
     *         example: 1
     *       - in: query
     *         name: limit
     *         schema:
     *           type: integer
     *           minimum: 1
     *           maximum: 1000
     *         description: Número de registros por página
     *         example: 25
     *     responses:
     *       200:
     *         description: Datos del reporte obtenidos exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     data:
     *                       type: array
     *                       items:
     *                         type: object
     *                         properties:
     *                           sCuentaContable:
     *                             type: string
     *                             example: "110501"
     *                           sDescCuentaContable:
     *                             type: string
     *                             example: "Caja General"
     *                           sNit:
     *                             type: string
     *                             example: "12345678"
     *                           sRazonSocial:
     *                             type: string
     *                             example: "Empresa Ejemplo S.A."
     *                           sReferencia:
     *                             type: string
     *                             example: "Cuenta corriente 12345678"
     *                           sCodTipoDoc:
     *                             type: string
     *                             example: "01"
     *                           sTipoDocSunat:
     *                             type: string
     *                             example: "DNI"
     *                           sAsiento:
     *                             type: string
     *                             example: "000001"
     *                           nConsecutivo:
     *                             type: integer
     *                             example: 1
     *                           dtFechaAsiento:
     *                             type: string
     *                             format: date-time
     *                             example: "2023-01-01T00:00:00.000Z"
     *                           nSaldoLocal:
     *                             type: number
     *                             example: 1000.50
     *                           nSaldoDolar:
     *                             type: number
     *                             example: 250.25
     *                     total:
     *                       type: integer
     *                       example: 100
     *                     totalPaginas:
     *                       type: integer
     *                       example: 4
     *                     paginaActual:
     *                       type: integer
     *                       example: 1
     *                     limite:
     *                       type: integer
     *                       example: 25
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    this.router.get(
      "/obtener",
      this.reporteGenericoSaldosController.obtenerReporte.bind(
        this.reporteGenericoSaldosController
      )
    );

    /**
     * @swagger
     * /api/reporte-generico-saldos/exportar-excel:
     *   post:
     *     summary: Exporta el reporte genérico de saldos a Excel
     *     tags: [Reporte Generico Saldos]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required:
     *               - conjunto
     *               - usuario
     *               - fechaInicio
     *               - fechaFin
     *             properties:
     *               conjunto:
     *                 type: string
     *                 description: Código del conjunto contable
     *                 example: "ASFSAC"
     *               usuario:
     *                 type: string
     *                 description: Usuario que genera el reporte
     *                 example: "ADMIN"
     *               fechaInicio:
     *                 type: string
     *                 format: date
     *                 description: Fecha de inicio del reporte
     *                 example: "2020-01-01"
     *               fechaFin:
     *                 type: string
     *                 format: date
     *                 description: Fecha fin del reporte
     *                 example: "2023-12-31"
     *               limit:
     *                 type: integer
     *                 description: Límite de registros a exportar
     *                 example: 10000
     *     responses:
     *       200:
     *         description: Archivo Excel generado exitosamente
     *         content:
     *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
     *             schema:
     *               type: string
     *               format: binary
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    this.router.post(
      "/exportar-excel",
      this.reporteGenericoSaldosController.exportarExcel.bind(
        this.reporteGenericoSaldosController
      )
    );

    /**
     * @swagger
     * /api/reporte-generico-saldos/estadisticas:
     *   get:
     *     summary: Obtiene estadísticas del reporte genérico de saldos
     *     tags: [Reporte Generico Saldos]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: query
     *         name: conjunto
     *         required: true
     *         schema:
     *           type: string
     *         description: Código del conjunto contable
     *         example: "ASFSAC"
     *     responses:
     *       200:
     *         description: Estadísticas obtenidas exitosamente
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 success:
     *                   type: boolean
     *                   example: true
     *                 data:
     *                   type: object
     *                   properties:
     *                     totalRegistros:
     *                       type: integer
     *                       example: 1000
     *                     totalSaldoLocal:
     *                       type: number
     *                       example: 50000.75
     *                     totalSaldoDolar:
     *                       type: number
     *                       example: 12500.25
     *                     cuentasConSaldo:
     *                       type: integer
     *                       example: 150
     *                     nitsUnicos:
     *                       type: integer
     *                       example: 75
     *                     tiposDocumento:
     *                       type: object
     *                       example: {"01": 50, "06": 25}
     *                     fechaGeneracion:
     *                       type: string
     *                       format: date-time
     *       400:
     *         description: Parámetros inválidos
     *       500:
     *         description: Error interno del servidor
     */
    this.router.get(
      "/estadisticas",
      this.reporteGenericoSaldosController.obtenerEstadisticas.bind(
        this.reporteGenericoSaldosController
      )
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
