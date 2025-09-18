import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IReporteGenericoSaldosService } from '../../domain/services/IReporteGenericoSaldosService';
import { FiltrosReporteGenericoSaldos } from '../../domain/entities/ReporteGenericoSaldos';

/**
 * @swagger
 * components:
 *   schemas:
 *     FiltrosReporteGenericoSaldos:
 *       type: object
 *       properties:
 *         fechaInicio:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del reporte
 *         fechaFin:
 *           type: string
 *           format: date
 *           description: Fecha de fin del reporte
 *         contabilidad:
 *           type: string
 *           description: Tipos de contabilidad (F,A)
 *         origen:
 *           type: string
 *           description: Origen de los datos
 *         cuentasContablesPorFecha:
 *           type: boolean
 *           description: Si filtrar cuentas contables por fecha
 *         agrupadoPor:
 *           type: string
 *           description: Criterio de agrupación
 *         porTipoCambio:
 *           type: boolean
 *           description: Si agrupar por tipo de cambio
 *         filtroChecks:
 *           type: boolean
 *           description: Si aplicar filtro de checks
 *         libroElectronico:
 *           type: boolean
 *           description: Si es para libro electrónico
 *         formatoCuentas:
 *           type: string
 *           description: Formato de las cuentas contables
 *         tituloPrincipal:
 *           type: string
 *           description: Título principal del reporte
 *         titulo2:
 *           type: string
 *           description: Segundo título del reporte
 *         titulo3:
 *           type: string
 *           description: Tercer título del reporte
 *         titulo4:
 *           type: string
 *           description: Cuarto título del reporte
 *         fechaImpresion:
 *           type: string
 *           format: date
 *           description: Fecha de impresión del reporte
 *     ReporteGenericoSaldos:
 *       type: object
 *       properties:
 *         tipo:
 *           type: string
 *           description: Tipo de documento
 *         numero:
 *           type: string
 *           description: Número del documento
 *         apellidosNombres:
 *           type: string
 *           description: Apellidos y nombres o razón social
 *         fecha:
 *           type: string
 *           description: Fecha del documento
 *         concepto:
 *           type: string
 *           description: Concepto o descripción de la operación
 *         monto:
 *           type: number
 *           description: Monto del documento
 */

@injectable()
export class ReporteGenericoSaldosController {
  constructor(
    @inject('IReporteGenericoSaldosService') 
    private reporteGenericoSaldosService: IReporteGenericoSaldosService
  ) {}

  /**
   * @swagger
   * /api/reporte-generico-saldos/{conjunto}/filtro-cuentas-contables:
   *   get:
   *     summary: Obtiene el filtro de cuentas contables para el reporte genérico de saldos
   *     tags: [Reporte Genérico de Saldos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     responses:
   *       200:
   *         description: Lista de cuentas contables para filtro
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
   *                     type: object
   *                     properties:
   *                       cuenta_contable:
   *                         type: string
   *                       descripcion:
   *                         type: string
   *                       uso_restringido:
   *                         type: boolean
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerFiltroCuentasContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const cuentasContables = await this.reporteGenericoSaldosService.obtenerFiltroCuentasContables(conjunto);

      res.json({
        success: true,
        data: cuentasContables
      });
    } catch (error) {
      console.error('Error en obtenerFiltroCuentasContables:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-generico-saldos/{conjunto}/detalle-cuenta-contable/{cuentaContable}:
   *   get:
   *     summary: Obtiene el detalle de una cuenta contable específica
   *     tags: [Reporte Genérico de Saldos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *       - in: path
   *         name: cuentaContable
   *         required: true
   *         schema:
   *           type: string
   *         description: Código de la cuenta contable
   *     responses:
   *       200:
   *         description: Detalle de la cuenta contable
   *       400:
   *         description: Error en los parámetros
   *       404:
   *         description: Cuenta contable no encontrada
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerDetalleCuentaContable(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, cuentaContable } = req.params;

      if (!conjunto || !cuentaContable) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros conjunto y cuentaContable son requeridos'
        });
        return;
      }

      const detalle = await this.reporteGenericoSaldosService.obtenerDetalleCuentaContable(conjunto, cuentaContable);

      if (!detalle) {
        res.status(404).json({
          success: false,
          message: 'Cuenta contable no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: detalle
      });
    } catch (error) {
      console.error('Error en obtenerDetalleCuentaContable:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-generico-saldos/{conjunto}/filtro-tipos-documento:
   *   get:
   *     summary: Obtiene el filtro de tipos de documento
   *     tags: [Reporte Genérico de Saldos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     responses:
   *       200:
   *         description: Lista de tipos de documento
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerFiltroTiposDocumento(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const tiposDocumento = await this.reporteGenericoSaldosService.obtenerFiltroTiposDocumento(conjunto);

      res.json({
        success: true,
        data: tiposDocumento
      });
    } catch (error) {
      console.error('Error en obtenerFiltroTiposDocumento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-generico-saldos/{conjunto}/filtro-tipos-asiento:
   *   get:
   *     summary: Obtiene el filtro de tipos de asiento
   *     tags: [Reporte Genérico de Saldos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     responses:
   *       200:
   *         description: Lista de tipos de asiento
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerFiltroTiposAsiento(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const tiposAsiento = await this.reporteGenericoSaldosService.obtenerFiltroTiposAsiento(conjunto);

      res.json({
        success: true,
        data: tiposAsiento
      });
    } catch (error) {
      console.error('Error en obtenerFiltroTiposAsiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-generico-saldos/{conjunto}/filtro-clases-asiento:
   *   get:
   *     summary: Obtiene el filtro de clases de asiento
   *     tags: [Reporte Genérico de Saldos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     responses:
   *       200:
   *         description: Lista de clases de asiento
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerFiltroClasesAsiento(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const clasesAsiento = await this.reporteGenericoSaldosService.obtenerFiltroClasesAsiento(conjunto);

      res.json({
        success: true,
        data: clasesAsiento
      });
    } catch (error) {
      console.error('Error en obtenerFiltroClasesAsiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-generico-saldos/{conjunto}/generar:
   *   post:
   *     summary: Genera el reporte genérico de saldos
   *     tags: [Reporte Genérico de Saldos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FiltrosReporteGenericoSaldos'
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
   *                     $ref: '#/components/schemas/ReporteGenericoSaldos'
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: FiltrosReporteGenericoSaldos = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!filtros.fechaInicio || !filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Las fechas de inicio y fin son requeridas'
        });
        return;
      }

      const reporte = await this.reporteGenericoSaldosService.generarReporteGenericoSaldos(conjunto, filtros);

      res.json(reporte);
    } catch (error) {
      console.error('Error en generarReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar el reporte genérico de saldos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-generico-saldos/{conjunto}/exportar-excel:
   *   post:
   *     summary: Exporta el reporte genérico de saldos a Excel
   *     tags: [Reporte Genérico de Saldos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FiltrosReporteGenericoSaldos'
   *     responses:
   *       200:
   *         description: Archivo Excel generado exitosamente
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: FiltrosReporteGenericoSaldos = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!filtros.fechaInicio || !filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Las fechas de inicio y fin son requeridas'
        });
        return;
      }

      const excelBuffer = await this.reporteGenericoSaldosService.exportarExcel(conjunto, filtros);

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="reporte-generico-saldos-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      
      res.send(excelBuffer);
    } catch (error) {
      console.error('Error al exportar Excel en ReporteGenericoSaldosController:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-generico-saldos/{conjunto}/exportar-pdf:
   *   post:
   *     summary: Exporta el reporte genérico de saldos a PDF
   *     tags: [Reporte Genérico de Saldos]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FiltrosReporteGenericoSaldos'
   *     responses:
   *       200:
   *         description: Archivo PDF generado exitosamente
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async exportarPDF(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: FiltrosReporteGenericoSaldos = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!filtros.fechaInicio || !filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Las fechas de inicio y fin son requeridas'
        });
        return;
      }

      const pdfBuffer = await this.reporteGenericoSaldosService.exportarPDF(conjunto, filtros);

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="reporte-generico-saldos-${conjunto}-${new Date().toISOString().split('T')[0]}.pdf"`);
      
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error al exportar PDF en ReporteGenericoSaldosController:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar PDF',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-generico-saldos/cache/limpiar:
   *   post:
   *     summary: Limpia el caché de tablas temporales
   *     tags: [Reporte Genérico de Saldos]
   *     responses:
   *       200:
   *         description: Caché limpiado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 estadisticas:
   *                   type: object
   *                   properties:
   *                     totalTablas:
   *                       type: number
   *       500:
   *         description: Error interno del servidor
   */
  async limpiarCache(req: Request, res: Response): Promise<void> {
    try {
      await this.reporteGenericoSaldosService.limpiarCache();
      const estadisticas = this.reporteGenericoSaldosService.obtenerEstadisticasCache();
      
      res.json({
        success: true,
        message: 'Caché limpiado exitosamente',
        estadisticas
      });
    } catch (error) {
      console.error('Error limpiando caché:', error);
      res.status(500).json({
        success: false,
        message: 'Error al limpiar el caché',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-generico-saldos/cache/estadisticas:
   *   get:
   *     summary: Obtiene estadísticas del caché
   *     tags: [Reporte Genérico de Saldos]
   *     responses:
   *       200:
   *         description: Estadísticas del caché obtenidas exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 estadisticas:
   *                   type: object
   *                   properties:
   *                     totalTablas:
   *                       type: number
   *                     tablas:
   *                       type: array
   *                       items:
   *                         type: object
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerEstadisticasCache(req: Request, res: Response): Promise<void> {
    try {
      const estadisticas = this.reporteGenericoSaldosService.obtenerEstadisticasCache();
      
      res.json({
        success: true,
        estadisticas
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas del caché:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estadísticas del caché',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
