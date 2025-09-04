import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IEstadoSituacionFinancieraService } from '../../domain/services/IEstadoSituacionFinancieraService';
import { TYPES } from '../container/types';
import { 
  EstadoSituacionFinancieraRequest,
  GenerarEstadoSituacionFinancieraParams,
  ExportarEstadoSituacionFinancieraExcelParams,
  ExportarEstadoSituacionFinancieraPDFParams
} from '../../domain/entities/EstadoSituacionFinanciera';

@injectable()
export class EstadoSituacionFinancieraController {
  constructor(
    @inject(TYPES.IEstadoSituacionFinancieraService) 
    private service: IEstadoSituacionFinancieraService
  ) {}

  /**
   * @swagger
   * /api/estado-situacion-financiera/{conjunto}/health:
   *   get:
   *     summary: Health check del servicio
   *     tags: [Estado Situación Financiera]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Conjunto de datos
   *     responses:
   *       200:
   *         description: Servicio funcionando correctamente
   */
  async health(req: Request, res: Response): Promise<void> {
    try {
      res.status(200).json({
        success: true,
        message: 'Estado de Situación Financiera service is running',
        timestamp: new Date().toISOString(),
        conjunto: req.params['conjunto']
      });
    } catch (error) {
      console.error('Error en health check:', error);
      res.status(500).json({
        success: false,
        message: 'Error en health check'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-situacion-financiera/{conjunto}/tipos-balance:
   *   get:
   *     summary: Obtiene los tipos de balance disponibles
   *     tags: [Estado Situación Financiera]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Conjunto de datos
   *       - in: query
   *         name: usuario
   *         required: false
   *         schema:
   *           type: string
   *         description: Usuario para filtrar tipos de balance
   *     responses:
   *       200:
   *         description: Tipos de balance obtenidos correctamente
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerTiposBalance(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { usuario } = req.query;

      console.log(`🔍 Controller: Obteniendo tipos de balance para conjunto: ${conjunto}`);

      const result = await this.service.obtenerTiposBalance(conjunto!, usuario as string);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('❌ Error en controller al obtener tipos de balance:', error);
      res.status(500).json({
        success: false,
        data: [],
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-situacion-financiera/{conjunto}/periodos-contables:
   *   get:
   *     summary: Obtiene los períodos contables disponibles
   *     tags: [Estado Situación Financiera]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Conjunto de datos
   *       - in: query
   *         name: fecha
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha para filtrar períodos contables
   *     responses:
   *       200:
   *         description: Períodos contables obtenidos correctamente
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerPeriodosContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { fecha } = req.query;

      if (!fecha) {
        res.status(400).json({
          success: false,
          data: [],
          message: 'La fecha es requerida'
        });
        return;
      }

      console.log(`🔍 Controller: Obteniendo períodos contables para conjunto: ${conjunto}, fecha: ${fecha}`);

      const result = await this.service.obtenerPeriodosContables(conjunto!, fecha as string);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('❌ Error en controller al obtener períodos contables:', error);
      res.status(500).json({
        success: false,
        data: [],
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-situacion-financiera/{conjunto}/generar:
   *   post:
   *     summary: Genera el reporte de Estado de Situación Financiera
   *     tags: [Estado Situación Financiera]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Conjunto de datos
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               tipoBalance:
   *                 type: string
   *                 description: Tipo de balance
   *               moneda:
   *                 type: string
   *                 enum: [AMBAS, NUEVO_SOL, DOLAR]
   *                 description: Moneda del reporte
   *               comparacion:
   *                 type: string
   *                 enum: [ANUAL, MENSUAL, FECHA]
   *                 description: Tipo de comparación
   *               origen:
   *                 type: string
   *                 enum: [DIARIO, MAYOR, AMBOS]
   *                 description: Origen de los datos
   *               fecha:
   *                 type: string
   *                 format: date
   *                 description: Fecha del reporte
   *               contabilidad:
   *                 type: string
   *                 enum: [FISCAL, CORPORATIVA]
   *                 description: Tipo de contabilidad
   *               excluirAsientoCierre:
   *                 type: boolean
   *                 description: Excluir asiento de cierre
   *               libroElectronico:
   *                 type: boolean
   *                 description: Incluir libro electrónico
   *               versionLibroElectronico:
   *                 type: string
   *                 description: Versión del libro electrónico
   *               centroCostoTipo:
   *                 type: string
   *                 enum: [RANGO, AGRUPACION]
   *                 description: Tipo de centro de costo
   *               centroCostoDesde:
   *                 type: string
   *                 description: Centro de costo desde
   *               centroCostoHasta:
   *                 type: string
   *                 description: Centro de costo hasta
   *               centroCostoAgrupacion:
   *                 type: string
   *                 description: Agrupación de centro de costo
   *               criterio:
   *                 type: string
   *                 description: Criterio adicional
   *               dimensionAdicional:
   *                 type: string
   *                 description: Dimensión adicional
   *               dimensionTexto:
   *                 type: string
   *                 description: Texto de dimensión
   *               tituloPrincipal:
   *                 type: string
   *                 description: Título principal
   *               titulo2:
   *                 type: string
   *                 description: Título 2
   *               titulo3:
   *                 type: string
   *                 description: Título 3
   *               titulo4:
   *                 type: string
   *                 description: Título 4
   *     responses:
   *       200:
   *         description: Reporte generado correctamente
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const params: GenerarEstadoSituacionFinancieraParams = {
        conjunto,
        ...req.body
      };

      console.log('🚀 Controller: Generando reporte de Estado de Situación Financiera:', params);

      const result = await this.service.generarReporte(params);

      res.status(200).json({
        success: true,
        message: 'Reporte generado correctamente'
      });
    } catch (error) {
      console.error('❌ Error en controller al generar reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-situacion-financiera/{conjunto}/obtener:
   *   get:
   *     summary: Obtiene los datos del Estado de Situación Financiera
   *     tags: [Estado Situación Financiera]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Conjunto de datos
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           default: 25
   *         description: Registros por página
   *       - in: query
   *         name: tipoBalance
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de balance
   *       - in: query
   *         name: moneda
   *         required: false
   *         schema:
   *           type: string
   *         description: Moneda del reporte
   *       - in: query
   *         name: comparacion
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de comparación
   *       - in: query
   *         name: origen
   *         required: false
   *         schema:
   *           type: string
   *         description: Origen de los datos
   *       - in: query
   *         name: fecha
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha del reporte
   *       - in: query
   *         name: contabilidad
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *       - in: query
   *         name: excluirAsientoCierre
   *         required: false
   *         schema:
   *           type: boolean
   *         description: Excluir asiento de cierre
   *       - in: query
   *         name: libroElectronico
   *         required: false
   *         schema:
   *           type: boolean
   *         description: Incluir libro electrónico
   *       - in: query
   *         name: versionLibroElectronico
   *         required: false
   *         schema:
   *           type: string
   *         description: Versión del libro electrónico
   *       - in: query
   *         name: centroCostoTipo
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de centro de costo
   *       - in: query
   *         name: centroCostoDesde
   *         required: false
   *         schema:
   *           type: string
   *         description: Centro de costo desde
   *       - in: query
   *         name: centroCostoHasta
   *         required: false
   *         schema:
   *           type: string
   *         description: Centro de costo hasta
   *       - in: query
   *         name: centroCostoAgrupacion
   *         required: false
   *         schema:
   *           type: string
   *         description: Agrupación de centro de costo
   *       - in: query
   *         name: criterio
   *         required: false
   *         schema:
   *           type: string
   *         description: Criterio adicional
   *       - in: query
   *         name: dimensionAdicional
   *         required: false
   *         schema:
   *           type: string
   *         description: Dimensión adicional
   *       - in: query
   *         name: dimensionTexto
   *         required: false
   *         schema:
   *           type: string
   *         description: Texto de dimensión
   *       - in: query
   *         name: tituloPrincipal
   *         required: false
   *         schema:
   *           type: string
   *         description: Título principal
   *       - in: query
   *         name: titulo2
   *         required: false
   *         schema:
   *           type: string
   *         description: Título 2
   *       - in: query
   *         name: titulo3
   *         required: false
   *         schema:
   *           type: string
   *         description: Título 3
   *       - in: query
   *         name: titulo4
   *         required: false
   *         schema:
   *           type: string
   *         description: Título 4
   *     responses:
   *       200:
   *         description: Datos obtenidos correctamente
   *       400:
   *         description: Error en los parámetros
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerEstadoSituacionFinanciera(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const request: EstadoSituacionFinancieraRequest = {
        conjunto: conjunto!,
        fecha: (req.query['fecha'] as string) ?? new Date().toISOString().split('T')[0],
        ...req.query
      };

      console.log('📊 Controller: Obteniendo datos del Estado de Situación Financiera:', request);

      const result = await this.service.obtenerEstadoSituacionFinanciera(request);

      if (result.success) {
        res.status(200).json(result);
      } else {
        res.status(400).json(result);
      }
    } catch (error) {
      console.error('❌ Error en controller al obtener datos:', error);
      res.status(500).json({
        success: false,
        data: [],
        pagination: {
          page: 1,
          limit: 25,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        },
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-situacion-financiera/{conjunto}/exportar-excel:
   *   get:
   *     summary: Exporta el reporte a Excel
   *     tags: [Estado Situación Financiera]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Conjunto de datos
   *       - in: query
   *         name: tipoBalance
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de balance
   *       - in: query
   *         name: moneda
   *         required: false
   *         schema:
   *           type: string
   *         description: Moneda del reporte
   *       - in: query
   *         name: comparacion
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de comparación
   *       - in: query
   *         name: origen
   *         required: false
   *         schema:
   *           type: string
   *         description: Origen de los datos
   *       - in: query
   *         name: fecha
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha del reporte
   *       - in: query
   *         name: contabilidad
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *       - in: query
   *         name: excluirAsientoCierre
   *         required: false
   *         schema:
   *           type: boolean
   *         description: Excluir asiento de cierre
   *       - in: query
   *         name: libroElectronico
   *         required: false
   *         schema:
   *           type: boolean
   *         description: Incluir libro electrónico
   *       - in: query
   *         name: versionLibroElectronico
   *         required: false
   *         schema:
   *           type: string
   *         description: Versión del libro electrónico
   *       - in: query
   *         name: centroCostoTipo
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de centro de costo
   *       - in: query
   *         name: centroCostoDesde
   *         required: false
   *         schema:
   *           type: string
   *         description: Centro de costo desde
   *       - in: query
   *         name: centroCostoHasta
   *         required: false
   *         schema:
   *           type: string
   *         description: Centro de costo hasta
   *       - in: query
   *         name: centroCostoAgrupacion
   *         required: false
   *         schema:
   *           type: string
   *         description: Agrupación de centro de costo
   *       - in: query
   *         name: criterio
   *         required: false
   *         schema:
   *           type: string
   *         description: Criterio adicional
   *       - in: query
   *         name: dimensionAdicional
   *         required: false
   *         schema:
   *           type: string
   *         description: Dimensión adicional
   *       - in: query
   *         name: dimensionTexto
   *         required: false
   *         schema:
   *           type: string
   *         description: Texto de dimensión
   *       - in: query
   *         name: tituloPrincipal
   *         required: false
   *         schema:
   *           type: string
   *         description: Título principal
   *       - in: query
   *         name: titulo2
   *         required: false
   *         schema:
   *           type: string
   *         description: Título 2
   *       - in: query
   *         name: titulo3
   *         required: false
   *         schema:
   *           type: string
   *         description: Título 3
   *       - in: query
   *         name: titulo4
   *         required: false
   *         schema:
   *           type: string
   *         description: Título 4
   *     responses:
   *       200:
   *         description: Archivo Excel generado correctamente
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
      const params: ExportarEstadoSituacionFinancieraExcelParams = {
        conjunto: conjunto!,
        fecha: (req.query['fecha'] as string) ?? new Date().toISOString().split('T')[0],
        ...req.query
      };

      console.log('📊 Controller: Exportando Estado de Situación Financiera a Excel:', params);

      const buffer = await this.service.exportarExcel(params);

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="estado-situacion-financiera-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.send(buffer);
    } catch (error) {
      console.error('❌ Error en controller al exportar Excel:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-situacion-financiera/{conjunto}/exportar-pdf:
   *   get:
   *     summary: Exporta el reporte a PDF
   *     tags: [Estado Situación Financiera]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Conjunto de datos
   *       - in: query
   *         name: tipoBalance
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de balance
   *       - in: query
   *         name: moneda
   *         required: false
   *         schema:
   *           type: string
   *         description: Moneda del reporte
   *       - in: query
   *         name: comparacion
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de comparación
   *       - in: query
   *         name: origen
   *         required: false
   *         schema:
   *           type: string
   *         description: Origen de los datos
   *       - in: query
   *         name: fecha
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha del reporte
   *       - in: query
   *         name: contabilidad
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de contabilidad
   *       - in: query
   *         name: excluirAsientoCierre
   *         required: false
   *         schema:
   *           type: boolean
   *         description: Excluir asiento de cierre
   *       - in: query
   *         name: libroElectronico
   *         required: false
   *         schema:
   *           type: boolean
   *         description: Incluir libro electrónico
   *       - in: query
   *         name: versionLibroElectronico
   *         required: false
   *         schema:
   *           type: string
   *         description: Versión del libro electrónico
   *       - in: query
   *         name: centroCostoTipo
   *         required: false
   *         schema:
   *           type: string
   *         description: Tipo de centro de costo
   *       - in: query
   *         name: centroCostoDesde
   *         required: false
   *         schema:
   *           type: string
   *         description: Centro de costo desde
   *       - in: query
   *         name: centroCostoHasta
   *         required: false
   *         schema:
   *           type: string
   *         description: Centro de costo hasta
   *       - in: query
   *         name: centroCostoAgrupacion
   *         required: false
   *         schema:
   *           type: string
   *         description: Agrupación de centro de costo
   *       - in: query
   *         name: criterio
   *         required: false
   *         schema:
   *           type: string
   *         description: Criterio adicional
   *       - in: query
   *         name: dimensionAdicional
   *         required: false
   *         schema:
   *           type: string
   *         description: Dimensión adicional
   *       - in: query
   *         name: dimensionTexto
   *         required: false
   *         schema:
   *           type: string
   *         description: Texto de dimensión
   *       - in: query
   *         name: tituloPrincipal
   *         required: false
   *         schema:
   *           type: string
   *         description: Título principal
   *       - in: query
   *         name: titulo2
   *         required: false
   *         schema:
   *           type: string
   *         description: Título 2
   *       - in: query
   *         name: titulo3
   *         required: false
   *         schema:
   *           type: string
   *         description: Título 3
   *       - in: query
   *         name: titulo4
   *         required: false
   *         schema:
   *           type: string
   *         description: Título 4
   *     responses:
   *       200:
   *         description: Archivo PDF generado correctamente
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
      const params: ExportarEstadoSituacionFinancieraPDFParams = {
        conjunto: conjunto!,
        fecha: (req.query['fecha'] as string) ?? new Date().toISOString().split('T')[0],
        ...req.query
      };

      console.log('📊 Controller: Exportando Estado de Situación Financiera a PDF:', params);

      const buffer = await this.service.exportarPDF(params);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="estado-situacion-financiera-${conjunto}-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.send(buffer);
    } catch (error) {
      console.error('❌ Error en controller al exportar PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  }
}
