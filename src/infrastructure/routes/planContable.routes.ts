import { Router } from 'express';
import { container } from '../container/container';
import { PlanContableController } from '../controllers/PlanContableController';

export function createPlanContableRoutes(): Router {
  const router = Router();
  const controller = new PlanContableController(
    container.get('IPlanContableRepository')
  );

  /**
   * @swagger
   * tags:
   *   name: Plan Contable
   *   description: API para el manejo del reporte de Plan Contable
   */

  /**
   * @swagger
   * components:
   *   schemas:
   *     PlanContable:
   *       type: object
   *       properties:
   *         CuentaContable:
   *           type: string
   *           description: Código de la cuenta contable
   *           example: "01.0.0.0.000"
   *         CuentaContableDesc:
   *           type: string
   *           description: Descripción de la cuenta contable
   *           example: "Clientes"
   *         Estado:
   *           type: string
   *           description: Estado de la cuenta contable
   *           example: "1"
   *         CuentaContableCons:
   *           type: string
   *           description: Cuenta contable consolidada
   *           example: "01.0.0.0.000"
   *         CuentaContableConsDesc:
   *           type: string
   *           description: Descripción de la cuenta consolidada
   *           example: "Clientes Consolidados"
   *     GlobalConfig:
   *       type: object
   *       properties:
   *         modulo:
   *           type: string
   *           description: Módulo de configuración
   *           example: "CG"
   *         nombre:
   *           type: string
   *           description: Nombre de la configuración
   *           example: "PLE-PlanContable"
   *         tipo:
   *           type: string
   *           description: Tipo de configuración
   *           example: "STRING"
   *         valor:
   *           type: string
   *           description: Valor de la configuración
   *           example: "ACTIVO"
   */

  /**
   * @swagger
   * /api/plan-contable/health:
   *   get:
   *     summary: Verificar estado del servicio
   *     tags: [Plan Contable]
   *     responses:
   *       200:
   *         description: Servicio funcionando correctamente
   */
  router.get('/health', (req, res) => controller.health(req, res));

  /**
   * @swagger
   * /api/plan-contable/generar:
   *   post:
   *     summary: Generar reporte de Plan Contable
   *     tags: [Plan Contable]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - conjunto
   *               - usuario
   *             properties:
   *               conjunto:
   *                 type: string
   *                 description: Código del conjunto contable
   *                 example: "ASFSAC"
   *               usuario:
   *                 type: string
   *                 description: Usuario que solicita el reporte
   *                 example: "ADMIN"
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/generar', (req, res) => controller.generarReporte(req, res));

  /**
   * @swagger
   * /api/plan-contable/obtener:
   *   get:
   *     summary: Obtener datos del Plan Contable con filtros y paginación
   *     tags: [Plan Contable]
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
   *         description: Usuario que solicita los datos
   *         example: "ADMIN"
   *       - in: query
   *         name: cuentaContable
   *         schema:
   *           type: string
   *         description: Filtro por cuenta contable
   *         example: "01"
   *       - in: query
   *         name: descripcion
   *         schema:
   *           type: string
   *         description: Filtro por descripción
   *         example: "Clientes"
   *       - in: query
   *         name: estado
   *         schema:
   *           type: string
   *         description: Filtro por estado
   *         example: "1"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *           maximum: 1000
   *         description: Registros por página
   *         example: 100
   *     responses:
   *       200:
   *         description: Datos obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/PlanContable'
   *                     total:
   *                       type: integer
   *                     pagina:
   *                       type: integer
   *                     porPagina:
   *                       type: integer
   *                     totalPaginas:
   *                       type: integer
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/obtener', (req, res) => controller.obtenerPlanContable(req, res));

  /**
   * @swagger
   * /api/plan-contable/cuentas:
   *   get:
   *     summary: Obtener todas las cuentas contables
   *     tags: [Plan Contable]
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
   *         description: Cuentas contables obtenidas exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/cuentas', (req, res) => controller.obtenerCuentasContables(req, res));

  /**
   * @swagger
   * /api/plan-contable/configuracion:
   *   get:
   *     summary: Obtener configuración global del Plan Contable
   *     tags: [Plan Contable]
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
   *         description: Configuración obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/GlobalConfig'
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/configuracion', (req, res) => controller.obtenerConfiguracion(req, res));

  /**
   * @swagger
   * /api/plan-contable/crear:
   *   post:
   *     summary: Crear nueva cuenta contable
   *     tags: [Plan Contable]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - conjunto
   *               - CuentaContable
   *               - CuentaContableDesc
   *               - Estado
   *             properties:
   *               conjunto:
   *                 type: string
   *                 description: Código del conjunto contable
   *                 example: "ASFSAC"
   *               CuentaContable:
   *                 type: string
   *                 description: Código de la cuenta contable
   *                 example: "01.0.0.0.001"
   *               CuentaContableDesc:
   *                 type: string
   *                 description: Descripción de la cuenta contable
   *                 example: "Proveedores"
   *               Estado:
   *                 type: string
   *                 description: Estado de la cuenta contable
   *                 example: "1"
   *               CuentaContableCons:
   *                 type: string
   *                 description: Cuenta contable consolidada (opcional)
   *                 example: "01.0.0.0.000"
   *               CuentaContableConsDesc:
   *                 type: string
   *                 description: Descripción de la cuenta consolidada (opcional)
   *                 example: "Clientes y Proveedores"
   *     responses:
   *       201:
   *         description: Cuenta contable creada exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/crear', (req, res) => controller.crearCuentaContable(req, res));

  /**
   * @swagger
   * /api/plan-contable/exportar-excel:
   *   get:
   *     summary: Exportar Plan Contable a Excel
   *     tags: [Plan Contable]
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
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario que solicita la exportación
   *         example: "ADMIN"
   *       - in: query
   *         name: cuentaContable
   *         schema:
   *           type: string
   *         description: Filtro por cuenta contable
   *         example: "01"
   *       - in: query
   *         name: descripcion
   *         schema:
   *           type: string
   *         description: Filtro por descripción
   *         example: "Clientes"
   *       - in: query
   *         name: estado
   *         schema:
   *           type: string
   *         description: Filtro por estado
   *         example: "1"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10000
   *           maximum: 50000
   *         description: Límite de registros a exportar
   *         example: 10000
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
  router.get('/exportar-excel', (req, res) => controller.exportarExcel(req, res));

  /**
   * @swagger
   * /api/plan-contable/limpiar:
   *   delete:
   *     summary: Limpiar datos temporales del Plan Contable
   *     tags: [Plan Contable]
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
   *         description: Datos limpiados exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.delete('/limpiar', (req, res) => controller.limpiarDatos(req, res));

  return router;
}
