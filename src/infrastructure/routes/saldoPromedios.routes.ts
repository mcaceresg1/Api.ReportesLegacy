import { Router } from 'express';
import { SaldoPromediosController } from '../controllers/SaldoPromediosController';
import { container } from '../container/container';
import { TYPES } from '../container/types';

/**
 * @swagger
 * components:
 *   schemas:
 *     FiltroSaldoPromedios:
 *       type: object
 *       required:
 *         - fecha_desde
 *         - fecha_hasta
 *       properties:
 *         fecha_desde:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del período
 *         fecha_hasta:
 *           type: string
 *           format: date
 *           description: Fecha de fin del período
 *         cuenta_contable_desde:
 *           type: string
 *           description: Cuenta contable desde (opcional)
 *         cuenta_contable_hasta:
 *           type: string
 *           description: Cuenta contable hasta (opcional)
 *         saldosAntesCierre:
 *           type: boolean
 *           description: Incluir saldos antes del cierre
 *         page:
 *           type: number
 *           description: Número de página (por defecto 1)
 *         limit:
 *           type: number
 *           description: Registros por página (por defecto 100)
 *     
 *     SaldoPromediosItem:
 *       type: object
 *       properties:
 *         centro_costo:
 *           type: string
 *           description: Centro de costo
 *         cuenta_contable:
 *           type: string
 *           description: Cuenta contable
 *         saldo_inicial_local:
 *           type: number
 *           description: Saldo inicial en moneda local
 *         saldo_inicial_dolar:
 *           type: number
 *           description: Saldo inicial en dólares
 *         saldo_inicial_corp_local:
 *           type: number
 *           description: Saldo inicial corporativo en moneda local
 *         saldo_inicial_corp_dolar:
 *           type: number
 *           description: Saldo inicial corporativo en dólares
 *         saldo_inicial_fisc_und:
 *           type: number
 *           description: Saldo inicial fiscal en unidades
 *         saldo_inicial_corp_und:
 *           type: number
 *           description: Saldo inicial corporativo en unidades
 *         debito_fisc_local:
 *           type: number
 *           description: Débito fiscal en moneda local
 *         credito_fisc_local:
 *           type: number
 *           description: Crédito fiscal en moneda local
 *         debito_fisc_dolar:
 *           type: number
 *           description: Débito fiscal en dólares
 *         credito_fisc_dolar:
 *           type: number
 *           description: Crédito fiscal en dólares
 *         debito_corp_local:
 *           type: number
 *           description: Débito corporativo en moneda local
 *         credito_corp_local:
 *           type: number
 *           description: Crédito corporativo en moneda local
 *         debito_corp_dolar:
 *           type: number
 *           description: Débito corporativo en dólares
 *         credito_corp_dolar:
 *           type: number
 *           description: Crédito corporativo en dólares
 *         debito_fisc_und:
 *           type: number
 *           description: Débito fiscal en unidades
 *         credito_fisc_und:
 *           type: number
 *           description: Crédito fiscal en unidades
 *         debito_corp_und:
 *           type: number
 *           description: Débito corporativo en unidades
 *         credito_corp_und:
 *           type: number
 *           description: Crédito corporativo en unidades
 *         saldo_final_local:
 *           type: number
 *           description: Saldo final en moneda local
 *         saldo_final_dolar:
 *           type: number
 *           description: Saldo final en dólares
 *         saldo_final_corp_local:
 *           type: number
 *           description: Saldo final corporativo en moneda local
 *         saldo_final_corp_dolar:
 *           type: number
 *           description: Saldo final corporativo en dólares
 *         saldo_final_fisc_und:
 *           type: number
 *           description: Saldo final fiscal en unidades
 *         saldo_final_corp_und:
 *           type: number
 *           description: Saldo final corporativo en unidades
 *         saldo_promedio_local:
 *           type: number
 *           description: Saldo promedio en moneda local
 *         saldo_promedio_dolar:
 *           type: number
 *           description: Saldo promedio en dólares
 *         saldo_promedio_corp_local:
 *           type: number
 *           description: Saldo promedio corporativo en moneda local
 *         saldo_promedio_corp_dolar:
 *           type: number
 *           description: Saldo promedio corporativo en dólares
 *         saldo_promedio_fisc_und:
 *           type: number
 *           description: Saldo promedio fiscal en unidades
 *         saldo_promedio_corp_und:
 *           type: number
 *           description: Saldo promedio corporativo en unidades
 *     
 *     CuentaContableOption:
 *       type: object
 *       properties:
 *         cuenta_contable:
 *           type: string
 *           description: Código de la cuenta contable
 *         descripcion:
 *           type: string
 *           description: Descripción de la cuenta
 *         descripcion_ifrs:
 *           type: string
 *           nullable: true
 *           description: Descripción IFRS de la cuenta
 *         Uso_restringido:
 *           type: string
 *           description: Indica si el uso está restringido
 *     
 *     PaginationInfo:
 *       type: object
 *       properties:
 *         page:
 *           type: number
 *           description: Página actual
 *         limit:
 *           type: number
 *           description: Registros por página
 *         total:
 *           type: number
 *           description: Total de registros disponibles
 *         totalPages:
 *           type: number
 *           description: Total de páginas
 *         hasNext:
 *           type: boolean
 *           description: Indica si hay página siguiente
 *         hasPrev:
 *           type: boolean
 *           description: Indica si hay página anterior
 */

export function createSaldoPromediosRoutes(): Router {
  const router = Router();
  
  // Obtener instancia del controlador desde el contenedor
  const saldoPromediosController = container.get<SaldoPromediosController>('SaldoPromediosController');

  /**
   * @swagger
   * /api/saldo-promedios/{conjunto}/cuentas-contables:
   *   get:
   *     summary: Obtener cuentas contables para filtros
   *     tags: [Saldo Promedios]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *     responses:
   *       200:
   *         description: Lista de cuentas contables obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/CuentaContableOption'
   *                 message:
   *                   type: string
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.get('/:conjunto/cuentas-contables', 
    saldoPromediosController.obtenerCuentasContables.bind(saldoPromediosController)
  );

  /**
   * @swagger
   * /api/saldo-promedios/{conjunto}/generar:
   *   post:
   *     summary: Generar reporte de saldos promedios con paginación
   *     tags: [Saldo Promedios]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FiltroSaldoPromedios'
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
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/SaldoPromediosItem'
   *                 pagination:
   *                   $ref: '#/components/schemas/PaginationInfo'
   *                 message:
   *                   type: string
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  router.post('/:conjunto/generar', 
    saldoPromediosController.generarReporte.bind(saldoPromediosController)
  );

  return router;
}
