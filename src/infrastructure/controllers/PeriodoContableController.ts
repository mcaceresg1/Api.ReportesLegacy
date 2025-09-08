import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import * as ExcelJS from 'exceljs';
import { IPeriodoContableRepository } from '../../domain/repositories/IPeriodoContableRepository';
import { FiltroPeriodoContable } from '../../domain/entities/PeriodoContable';

@injectable()
export class PeriodoContableController {
  constructor(
    @inject('IPeriodoContableRepository') private periodoContableRepository: IPeriodoContableRepository
  ) {}

  async obtenerCentrosCosto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const centrosCosto = await this.periodoContableRepository.obtenerCentrosCosto(conjunto);

      res.json({
        success: true,
        data: centrosCosto,
        message: 'Centros de costo obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en obtenerCentrosCosto:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async obtenerPeriodosContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const periodosContables = await this.periodoContableRepository.obtenerPeriodosContables(conjunto);

      res.json({
        success: true,
        data: periodosContables,
        message: 'Periodos contables obtenidos exitosamente',
        total: periodosContables.length
      });
    } catch (error) {
      console.error('Error en obtenerPeriodosContables:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      console.log('=== DEBUG GENERAR REPORTE ===');
      console.log('Conjunto:', conjunto);
      console.log('Body completo:', req.body);
      console.log('Content-Type:', req.headers['content-type']);
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const filtros: FiltroPeriodoContable = {
        conjunto,
        centro_costo: req.body.centro_costo,
        periodo: req.body.periodo,
        soloCuentasMovimiento: req.body.soloCuentasMovimiento || false,
        saldosAntesCierre: req.body.saldosAntesCierre || false
      };

      console.log('Filtros procesados:', filtros);

      if (!filtros.periodo) {
        res.status(400).json({
          success: false,
          message: 'El período es requerido'
        });
        return;
      }

      const reporte = await this.periodoContableRepository.generarReporte(filtros);

      res.json({
        success: true,
        data: reporte,
        message: 'Reporte generado exitosamente',
        total: reporte.length
      });
    } catch (error) {
      console.error('Error en generarReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-periodo-contable/{conjunto}/exportar-excel:
   *   post:
   *     summary: Exportar Reporte de Períodos Contables a Excel
   *     description: Exporta el reporte de períodos contables a formato Excel
   *     tags: [Períodos Contables]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Código del conjunto contable"
   *         schema: { type: string }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               centro_costo:
   *                 type: string
   *                 description: Centro de costo
   *               periodo:
   *                 type: string
   *                 description: Período contable
   *               soloCuentasMovimiento:
   *                 type: boolean
   *                 description: Solo cuentas con movimiento
   *               saldosAntesCierre:
   *                 type: boolean
   *                 description: Saldos antes del cierre
   *     responses:
   *       200:
   *         description: "Archivo Excel generado exitosamente"
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: "Parámetros inválidos o faltantes"
   *       500:
   *         description: "Error interno del servidor"
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const filtros: FiltroPeriodoContable = {
        conjunto,
        centro_costo: req.body.centro_costo,
        periodo: req.body.periodo,
        soloCuentasMovimiento: req.body.soloCuentasMovimiento || false,
        saldosAntesCierre: req.body.saldosAntesCierre || false
      };

      if (!filtros.periodo) {
        res.status(400).json({
          success: false,
          message: 'El período es requerido'
        });
        return;
      }

      // Obtener los datos del reporte
      const reporte = await this.periodoContableRepository.generarReporte(filtros);

      // Crear archivo Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Períodos Contables');

      // Configurar columnas
      worksheet.columns = [
        { header: 'Centro de Costo', key: 'centro_costo', width: 15 },
        { header: 'Cuenta Contable', key: 'cuenta_contable', width: 20 },
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'Saldo Normal', key: 'saldo_normal', width: 15 },
        { header: 'Descripción', key: 'descripcion', width: 40 },
        { header: 'Saldo Inicial Local', key: 'saldo_inicial_local', width: 20 },
        { header: 'Débito Fisc Local', key: 'debito_fisc_local', width: 20 },
        { header: 'Crédito Fisc Local', key: 'credito_fisc_local', width: 20 },
        { header: 'Saldo Fisc Local', key: 'saldo_fisc_local', width: 20 },
        { header: 'Saldo Inicial Dólar', key: 'saldo_inicial_dolar', width: 20 },
        { header: 'Débito Fisc Dólar', key: 'debito_fisc_dolar', width: 20 },
        { header: 'Crédito Fisc Dólar', key: 'credito_fisc_dolar', width: 20 },
        { header: 'Saldo Fisc Dólar', key: 'saldo_fisc_dolar', width: 20 },
        { header: 'Saldo Inicial Und', key: 'saldo_inicial_und', width: 20 },
        { header: 'Débito Fisc Und', key: 'debito_fisc_und', width: 20 },
        { header: 'Crédito Fisc Und', key: 'credito_fisc_und', width: 20 },
        { header: 'Saldo Fisc Und', key: 'saldo_fisc_und', width: 20 }
      ];

      // Agregar datos
      reporte.forEach(item => {
        worksheet.addRow({
          centro_costo: item.centro_costo,
          cuenta_contable: item.cuenta_contable,
          fecha: item.fecha,
          saldo_normal: item.saldo_normal,
          descripcion: item.descripcion,
          saldo_inicial_local: item.saldo_inicial_local,
          debito_fisc_local: item.debito_fisc_local,
          credito_fisc_local: item.credito_fisc_local,
          saldo_fisc_local: item.saldo_fisc_local,
          saldo_inicial_dolar: item.saldo_inicial_dolar,
          debito_fisc_dolar: item.debito_fisc_dolar,
          credito_fisc_dolar: item.credito_fisc_dolar,
          saldo_fisc_dolar: item.saldo_fisc_dolar,
          saldo_inicial_und: item.saldo_inicial_und,
          debito_fisc_und: item.debito_fisc_und,
          credito_fisc_und: item.credito_fisc_und,
          saldo_fisc_und: item.saldo_fisc_und
        });
      });

      // Configurar respuesta
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="periodos-contables-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al exportar Excel en PeriodoContableController:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
