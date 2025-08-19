import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IReporteCatalogoCuentasModificadasRepository } from '../../domain/repositories/IReporteCatalogoCuentasModificadasRepository';
import { FiltrosCatalogoCuentasModificadas } from '../../domain/entities/ReporteCatalogoCuentasModificadas';

/**
 * @swagger
 * components:
 *   schemas:
 *     FiltrosCatalogoCuentasModificadas:
 *       type: object
 *       properties:
 *         fechaInicio:
 *           type: string
 *           format: date
 *           description: Fecha de inicio para el filtro
 *         fechaFin:
 *           type: string
 *           format: date
 *           description: Fecha de fin para el filtro
 */

@injectable()
export class ReporteCatalogoCuentasModificadasController {
  constructor(
    @inject('IReporteCatalogoCuentasModificadasRepository') 
    private readonly reporteCatalogoCuentasModificadasRepository: IReporteCatalogoCuentasModificadasRepository
  ) {}

  /**
   * @swagger
   * /api/reporte-catalogo-cuentas-modificadas/{conjunto}/exportar-excel:
   *   post:
   *     summary: Exportar Reporte de Catálogo de Cuentas Modificadas a Excel
   *     description: Exporta el reporte de catálogo de cuentas modificadas a formato Excel
   *     tags: [Reporte Catalogo Cuentas Modificadas]
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
   *             $ref: '#/components/schemas/FiltrosCatalogoCuentasModificadas'
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
      const { fechaInicio, fechaFin } = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El conjunto es requerido'
        });
        return;
      }

      // Convertir fechas si se proporcionan
      const fechaInicioDate = fechaInicio ? new Date(fechaInicio) : undefined;
      const fechaFinDate = fechaFin ? new Date(fechaFin) : undefined;

      // Generar Excel usando el repositorio
      const excelBuffer = await this.reporteCatalogoCuentasModificadasRepository.exportarExcel(
        conjunto,
        { conjunto, fechaDesde: fechaInicio, fechaHasta: fechaFin }
      );

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="catalogo-cuentas-modificadas-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      
      res.send(excelBuffer);
    } catch (error) {
      console.error('Error al exportar Excel en ReporteCatalogoCuentasModificadasController:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
