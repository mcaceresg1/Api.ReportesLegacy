import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IResumenAsientosService } from '../../domain/services/IResumenAsientosService';
import { FiltrosResumenAsientos } from '../../domain/entities/ReporteResumenAsientos';
import { ResumenAsientosResponse } from '../../domain/dto/ResumenAsientosResponse';

@injectable()
export class ResumenAsientosController {
  constructor(
    @inject('ResumenAsientosService') 
    private resumenAsientosService: IResumenAsientosService
  ) {}

  /**
   * @swagger
   * /api/resumen-asientos/{conjunto}/resumen:
   *   get:
   *     summary: Obtener reporte de resumen de asientos contables
   *     description: Genera un reporte resumido de movimientos contables agrupados por tipo de asiento, cuenta contable y centro de costo
   *     tags: [Reportes Contables]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *       - in: query
   *         name: fechaInicio
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha de inicio del período (YYYY-MM-DD)
   *       - in: query
   *         name: fechaFin
   *         schema:
   *           type: string
   *           format: date
   *         description: Fecha final del período (YYYY-MM-DD)
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento específico
   *       - in: query
   *         name: cuentaContable
   *         schema:
   *           type: string
   *         description: Filtro por cuenta contable específica
   *       - in: query
   *         name: centroCosto
   *         schema:
   *           type: string
   *         description: Filtro por centro de costo específico
   *       - in: query
   *         name: usuario
   *         schema:
   *           type: string
   *         description: Filtro por usuario específico
   *       - in: query
   *         name: contabilidad
   *         schema:
   *           type: string
   *           enum: [F, SF, C, SC, T]
   *         description: Tipo de contabilidad (F=Fiscal, SF=Sin Fiscal, C=Contable, SC=Sin Contable, T=Todos)
   *       - in: query
   *         name: origen
   *         schema:
   *           type: string
   *           enum: [DIARIO, MAYOR, AMBOS]
   *         description: Origen de los asientos (DIARIO, MAYOR, AMBOS)
   *       - in: query
   *         name: nitDesde
   *         schema:
   *           type: string
   *         description: NIT desde para filtrar
   *       - in: query
   *         name: nitHasta
   *         schema:
   *           type: string
   *         description: NIT hasta para filtrar
   *       - in: query
   *         name: cuentaContableDesde
   *         schema:
   *           type: string
   *         description: Cuenta contable desde para filtrar
   *       - in: query
   *         name: cuentaContableHasta
   *         schema:
   *           type: string
   *         description: Cuenta contable hasta para filtrar
   *       - in: query
   *         name: asientoDesde
   *         schema:
   *           type: string
   *         description: Número de asiento desde para filtrar
   *       - in: query
   *         name: asientoHasta
   *         schema:
   *           type: string
   *         description: Número de asiento hasta para filtrar
   *       - in: query
   *         name: tiposAsiento
   *         schema:
   *           type: array
   *           items:
   *             type: string
   *         description: Array de tipos de asiento para filtrar
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
   *                   example: "Reporte generado exitosamente con 150 registros"
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       cuentaContableDesc:
   *                         type: string
   *                         example: "Clientes"
   *                       sDescTipoAsiento:
   *                         type: string
   *                         example: "Asiento de Diario"
   *                       cuentaContable:
   *                         type: string
   *                         example: "01.1.0.0.000"
   *                       sNombreQuiebre:
   *                         type: string
   *                         example: "DIARIO"
   *                       creditoLocal:
   *                         type: number
   *                         format: double
   *                         example: 1000000.00
   *                       creditoDolar:
   *                         type: number
   *                         format: double
   *                         example: 250.00
   *                       centroCosto:
   *                         type: string
   *                         example: "ADMIN"
   *                       debitoLocal:
   *                         type: number
   *                         format: double
   *                         example: 0.00
   *                       debitoDolar:
   *                         type: number
   *                         format: double
   *                         example: 0.00
   *                       tipoAsiento:
   *                         type: string
   *                         example: "DIARIO"
   *                       tipoReporte:
   *                         type: string
   *                         example: "Resumen de Asientos"
   *                       nomUsuario:
   *                         type: string
   *                         example: "ADMIN"
   *                       finicio:
   *                         type: string
   *                         format: date-time
   *                         example: "2020-01-01T00:00:00.000Z"
   *                       quiebre:
   *                         type: string
   *                         example: "DIARIO"
   *                       ffinal:
   *                         type: string
   *                         format: date-time
   *                         example: "2022-12-31T23:59:59.999Z"
   *                       rowOrderBy:
   *                         type: integer
   *                         example: 1
   *                 totalRegistros:
   *                   type: integer
   *                   example: 150
   *                 fechaInicio:
   *                   type: string
   *                   format: date-time
   *                 fechaFin:
   *                   type: string
   *                   format: date-time
   *                 conjunto:
   *                   type: string
   *                   example: "ASFSAC"
   *       400:
   *         description: Error en los parámetros de entrada
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "El conjunto es requerido"
   *       500:
   *         description: Error interno del servidor
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: false
   *                 message:
   *                   type: string
   *                   example: "Error al generar reporte: Error de conexión a la base de datos"
   */
  async obtenerResumenAsientos(req: Request, res: Response): Promise<void> {
    try {
      const conjunto = req.params['conjunto'];
      
      // Crear objeto de filtros solo con propiedades definidas
      const filtros: Partial<FiltrosResumenAsientos> = {};
      
      if (req.query['fechaInicio']) {
        filtros.fechaInicio = new Date(req.query['fechaInicio'] as string);
      }
      
      if (req.query['fechaFin']) {
        filtros.fechaFin = new Date(req.query['fechaFin'] as string);
      }
      
      if (req.query['tipoAsiento']) {
        filtros.tipoAsiento = req.query['tipoAsiento'] as string;
      }
      
      if (req.query['cuentaContable']) {
        filtros.cuentaContable = req.query['cuentaContable'] as string;
      }
      
      if (req.query['centroCosto']) {
        filtros.centroCosto = req.query['centroCosto'] as string;
      }
      
      if (req.query['usuario']) {
        filtros.usuario = req.query['usuario'] as string;
      }
      
      if (req.query['contabilidad']) {
        filtros.contabilidad = req.query['contabilidad'] as 'F' | 'SF' | 'C' | 'SC' | 'T';
      }
      
      if (req.query['origen']) {
        filtros.origen = req.query['origen'] as 'DIARIO' | 'MAYOR' | 'AMBOS';
      }
      
      if (req.query['nitDesde']) {
        filtros.nitDesde = req.query['nitDesde'] as string;
      }
      
      if (req.query['nitHasta']) {
        filtros.nitHasta = req.query['nitHasta'] as string;
      }
      
      if (req.query['cuentaContableDesde']) {
        filtros.cuentaContableDesde = req.query['cuentaContableDesde'] as string;
      }
      
      if (req.query['cuentaContableHasta']) {
        filtros.cuentaContableHasta = req.query['cuentaContableHasta'] as string;
      }
      
      if (req.query['asientoDesde']) {
        filtros.asientoDesde = req.query['asientoDesde'] as string;
      }
      
      if (req.query['asientoHasta']) {
        filtros.asientoHasta = req.query['asientoHasta'] as string;
      }
      
      if (req.query['tiposAsiento']) {
        // Los tipos de asiento pueden venir como múltiples parámetros
        const tiposAsiento = Array.isArray(req.query['tiposAsiento']) 
          ? req.query['tiposAsiento'] as string[]
          : [req.query['tiposAsiento'] as string];
        filtros.tiposAsientoSeleccionados = tiposAsiento;
      }

      console.log(`🚀 Controlador - Obteniendo resumen de asientos para conjunto: ${conjunto}`);
      console.log('📋 Filtros recibidos:', filtros);

      // Validar conjunto
      if (!conjunto) {
        const response: ResumenAsientosResponse = {
          success: false,
          message: 'El conjunto es requerido'
        };
        res.status(400).json(response);
        return;
      }

      // Generar reporte
      const resultado = await this.resumenAsientosService.generarReporteResumenAsientos(conjunto, filtros);

      // Crear respuesta solo con propiedades definidas
      const response: ResumenAsientosResponse = {
        success: true,
        message: `Reporte generado exitosamente con ${resultado.length} registros`,
        data: resultado,
        totalRegistros: resultado.length,
        conjunto: conjunto
      };
      
      // Agregar fechas solo si están definidas
      if (filtros.fechaInicio) {
        response.fechaInicio = filtros.fechaInicio;
      }
      
      if (filtros.fechaFin) {
        response.fechaFin = filtros.fechaFin;
      }

      console.log(`✅ Controlador - Reporte enviado con ${resultado.length} registros`);
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Error en ResumenAsientosController.obtenerResumenAsientos:', error);
      
      const response: ResumenAsientosResponse = {
        success: false,
        message: `Error al generar reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
      
      res.status(500).json(response);
    }
  }
}
