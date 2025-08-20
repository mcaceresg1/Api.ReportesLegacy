import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IDiarioContabilidadRepository } from '../../domain/repositories/IDiarioContabilidadRepository';
import { DiarioContabilidadFiltros, DiarioContabilidadResponse } from '../../domain/entities/DiarioContabilidad';

@injectable()
export class DiarioContabilidadController {
  constructor(
    @inject('IDiarioContabilidadRepository') private diarioContabilidadRepository: IDiarioContabilidadRepository
  ) {}

  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Servicio de Diario de Contabilidad funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Genera el reporte de Diario de Contabilidad
   * @swagger
   * /api/diario-contabilidad/generar:
   *   post:
   *     tags:
   *       - Diario de Contabilidad
   *     summary: Genera el reporte de Diario de Contabilidad
   *     description: Ejecuta el proceso para generar el reporte de Diario de Contabilidad combinando datos de MAYOR y DIARIO
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
   *                 example: "001"
   *               usuario:
   *                 type: string
   *                 description: Usuario que genera el reporte
   *                 example: "ADMIN"
   *               fechaInicio:
   *                 type: string
   *                 format: date
   *                 description: Fecha de inicio del período
   *                 example: "2024-01-01"
   *               fechaFin:
   *                 type: string
   *                 format: date
   *                 description: Fecha de fin del período
   *                 example: "2024-12-31"
   *               contabilidad:
   *                 type: string
   *                 description: Tipo de contabilidad
   *                 enum: ["F", "A", "F,A"]
   *                 default: "F,A"
   *                 example: "F"
   *               tipoReporte:
   *                 type: string
   *                 description: Tipo de reporte
   *                 enum: ["Preliminar", "Oficial"]
   *                 default: "Preliminar"
   *                 example: "Preliminar"
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
   *                   example: "Reporte de Diario de Contabilidad generado exitosamente"
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, usuario, fechaInicio, fechaFin, contabilidad, tipoReporte } = req.body;

      // Validaciones
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Los campos conjunto, usuario, fechaInicio y fechaFin son obligatorios'
        });
        return;
      }

      // Validar fechas
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Las fechas deben tener un formato válido (YYYY-MM-DD)'
        });
        return;
      }

      if (fechaInicioDate > fechaFinDate) {
        res.status(400).json({
          success: false,
          message: 'La fecha de inicio no puede ser mayor que la fecha de fin'
        });
        return;
      }

      // Usar directamente el repositorio
      await this.diarioContabilidadRepository.generarReporteDiarioContabilidad(
        conjunto as string,
        usuario as string,
        fechaInicioDate,
        fechaFinDate,
        contabilidad || 'F,A',
        tipoReporte || 'Preliminar'
      );

      res.status(200).json({
        success: true,
        message: 'Reporte de Diario de Contabilidad generado exitosamente'
      });

    } catch (error) {
      console.error('Error en generarReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar el reporte de Diario de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtiene los datos del Diario de Contabilidad con filtros y paginación
   * @swagger
   * /api/diario-contabilidad/obtener:
   *   get:
   *     tags:
   *       - Diario de Contabilidad
   *     summary: Obtiene los datos del Diario de Contabilidad
   *     description: Recupera los datos del reporte con filtros opcionales y paginación
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "001"
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario propietario del reporte
   *         example: "ADMIN"
   *       - in: query
   *         name: fechaInicio
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio del período
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin del período
   *         example: "2024-12-31"
   *       - in: query
   *         name: cuentaContable
   *         schema:
   *           type: string
   *         description: Filtro por cuenta contable (búsqueda parcial)
   *         example: "1105"
   *       - in: query
   *         name: centroCosto
   *         schema:
   *           type: string
   *         description: Filtro por centro de costo (búsqueda parcial)
   *         example: "001"
   *       - in: query
   *         name: nit
   *         schema:
   *           type: string
   *         description: Filtro por NIT (búsqueda parcial)
   *         example: "12345"
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento
   *         example: "01"
   *       - in: query
   *         name: asiento
   *         schema:
   *           type: string
   *         description: Filtro por número de asiento
   *         example: "000001"
   *       - in: query
   *         name: origen
   *         schema:
   *           type: string
   *         description: Filtro por origen/módulo
   *         enum: ["CP", "CB", "CC", "FEE", "IC", "CJ"]
   *         example: "CP"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *         enum: ["F", "A", "F,A"]
   *         default: "F,A"
   *         example: "F"
   *       - in: query
   *         name: tipoReporte
   *         schema:
   *           type: string
   *         description: Tipo de reporte
   *         enum: ["Preliminar", "Oficial"]
   *         default: "Preliminar"
   *         example: "Preliminar"
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
   *         description: Registros por página
   *         example: 25
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
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Diario de Contabilidad obtenido exitosamente"
   *                 data:
   *                   $ref: '#/components/schemas/DiarioContabilidadResponse'
   *                 paginacion:
   *                   type: object
   *                   properties:
   *                     pagina:
   *                       type: integer
   *                       example: 1
   *                     porPagina:
   *                       type: integer
   *                       example: 25
   *                     total:
   *                       type: integer
   *                       example: 150
   *                     totalPaginas:
   *                       type: integer
   *                       example: 6
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerDiarioContabilidad(req: Request, res: Response): Promise<void> {
    try {
      const { 
        conjunto, usuario, fechaInicio, fechaFin, 
        cuentaContable, centroCosto, nit, tipoAsiento, asiento, origen,
        contabilidad, tipoReporte, page, limit 
      } = req.query;

      // Validaciones
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros conjunto, usuario, fechaInicio y fechaFin son obligatorios'
        });
        return;
      }

      // Validar y convertir fechas
      const fechaInicioDate = new Date(fechaInicio as string);
      const fechaFinDate = new Date(fechaFin as string);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Las fechas deben tener un formato válido (YYYY-MM-DD)'
        });
        return;
      }

      // Validar y convertir paginación
      const pageNum = page ? parseInt(page as string, 10) : 1;
      const limitNum = limit ? parseInt(limit as string, 10) : 25;

      if (pageNum < 1 || limitNum < 1 || limitNum > 1000) {
        res.status(400).json({
          success: false,
          message: 'La página debe ser >= 1 y el límite debe estar entre 1 y 1000'
        });
        return;
      }

      const offset = (pageNum - 1) * limitNum;

      // Preparar filtros
      const filtros: DiarioContabilidadFiltros = {
        conjunto: conjunto as string,
        usuario: usuario as string,
        fechaInicio: fechaInicioDate,
        fechaFin: fechaFinDate,
        contabilidad: contabilidad as string,
        tipoReporte: tipoReporte as string,
        cuentaContable: cuentaContable as string,
        centroCosto: centroCosto as string,
        nit: nit as string,
        tipoAsiento: tipoAsiento as string,
        asiento: asiento as string,
        origen: origen as string,
        limit: limitNum,
        offset
      };

      // Usar directamente el repositorio
      const resultado = await this.diarioContabilidadRepository.obtenerDiarioContabilidad(filtros);

      res.status(200).json({
        success: true,
        message: 'Diario de Contabilidad obtenido exitosamente',
        data: resultado,
        paginacion: {
          pagina: resultado.pagina,
          porPagina: resultado.porPagina,
          total: resultado.total,
          totalPaginas: resultado.totalPaginas
        }
      });

    } catch (error) {
      console.error('Error en obtenerDiarioContabilidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener el Diario de Contabilidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Exporta el Diario de Contabilidad a Excel
   * @swagger
   * /api/diario-contabilidad/exportar-excel:
   *   get:
   *     tags:
   *       - Diario de Contabilidad
   *     summary: Exporta el Diario de Contabilidad a Excel
   *     description: Genera y descarga un archivo Excel con los datos del Diario de Contabilidad
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "001"
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario que exporta
   *         example: "ADMIN"
   *       - in: query
   *         name: fechaInicio
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio del período
   *         example: "2024-01-01"
   *       - in: query
   *         name: fechaFin
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de fin del período
   *         example: "2024-12-31"
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *         enum: ["F", "A", "F,A"]
   *         default: "F,A"
   *         example: "F"
   *       - in: query
   *         name: tipoReporte
   *         schema:
   *           type: string
   *         description: Tipo de reporte
   *         enum: ["Preliminar", "Oficial"]
   *         default: "Preliminar"
   *         example: "Preliminar"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
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
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, usuario, fechaInicio, fechaFin, contabilidad, tipoReporte, limit } = req.query;

      // Validaciones
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros conjunto, usuario, fechaInicio y fechaFin son obligatorios'
        });
        return;
      }

      // Validar fechas
      const fechaInicioDate = new Date(fechaInicio as string);
      const fechaFinDate = new Date(fechaFin as string);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Las fechas deben tener un formato válido (YYYY-MM-DD)'
        });
        return;
      }

      // Validar límite
      const limitNum = limit ? parseInt(limit as string, 10) : 10000;
      if (limitNum < 1 || limitNum > 50000) {
        res.status(400).json({
          success: false,
          message: 'El límite debe estar entre 1 y 50000'
        });
        return;
      }

      // Usar directamente el repositorio
      const excelBuffer = await this.diarioContabilidadRepository.exportarExcel(
        conjunto as string,
        usuario as string,
        fechaInicioDate,
        fechaFinDate,
        contabilidad as string,
        tipoReporte as string,
        limitNum
      );

      // Configurar headers para descarga
      const fileName = `diario-contabilidad-${conjunto}-${fechaInicio}-${fechaFin}.xlsx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', excelBuffer.length);

      // Enviar archivo
      res.send(excelBuffer);

    } catch (error) {
      console.error('Error en exportarExcel:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar Diario de Contabilidad a Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

}
