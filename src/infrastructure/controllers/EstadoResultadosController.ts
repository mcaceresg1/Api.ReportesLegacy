import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IEstadoResultadosService } from '../../domain/services/IEstadoResultadosService';
import { TYPES } from '../container/types';
import { EstadoResultados, EstadoResultadosRequest, EstadoResultadosResponse } from '../../domain/entities/EstadoResultados';
import * as ExcelJS from 'exceljs';

@injectable()
export class EstadoResultadosController {
  constructor(
    @inject(TYPES.IEstadoResultadosService) private estadoResultadosService: IEstadoResultadosService
  ) {}

  /**
   * @swagger
   * /api/estado-resultados/{conjunto}/tipos-egp:
   *   get:
   *     summary: Obtener tipos de EGP
   *     tags: [Estado de Resultados]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Conjunto de datos
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario
   *     responses:
   *       200:
   *         description: Lista de tipos de EGP
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
   *                       tipo:
   *                         type: string
   *                       descripcion:
   *                         type: string
   *                       qrp:
   *                         type: string
   */
  async getTiposEgp(req: Request, res: Response): Promise<void> {
    try {
      const conjunto = req.params['conjunto'];
      const usuario = req.query['usuario'] as string;

      if (!conjunto || !usuario) {
        res.status(400).json({
          success: false,
          message: 'Conjunto y usuario son requeridos'
        });
        return;
      }

      const tiposEgp = await this.estadoResultadosService.getTiposEgp(conjunto!, usuario!);

      res.json({
        success: true,
        data: tiposEgp
      });
    } catch (error) {
      console.error('Error getting tipos EGP:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener tipos de EGP',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-resultados/{conjunto}/periodos-contables:
   *   get:
   *     summary: Obtener períodos contables
   *     tags: [Estado de Resultados]
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
   *         description: Fecha
   *     responses:
   *       200:
   *         description: Lista de períodos contables
   */
  async getPeriodosContables(req: Request, res: Response): Promise<void> {
    try {
      const conjunto = req.params['conjunto'];
      const fecha = req.query['fecha'] as string;

      if (!conjunto || !fecha) {
        res.status(400).json({
          success: false,
          message: 'Conjunto y fecha son requeridos'
        });
        return;
      }

      const periodos = await this.estadoResultadosService.getPeriodosContables(conjunto!, fecha!);

      res.json({
        success: true,
        data: periodos
      });
    } catch (error) {
      console.error('Error getting periodos contables:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener períodos contables',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-resultados/{conjunto}/reporte:
   *   get:
   *     summary: Obtener reporte de estado de resultados
   *     tags: [Estado de Resultados]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Conjunto de datos
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Número de página
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *         description: Tamaño de página
   *     responses:
   *       200:
   *         description: Reporte de estado de resultados
   */
  async getReporte(req: Request, res: Response): Promise<void> {
    try {
      const conjunto = req.params['conjunto'];
      const usuario = req.query['usuario'] as string;
      const page = parseInt(req.query['page'] as string) || 1;
      const pageSize = parseInt(req.query['pageSize'] as string) || 20;

      if (!conjunto || !usuario) {
        res.status(400).json({
          success: false,
          message: 'Conjunto y usuario son requeridos'
        });
        return;
      }

      const filtros: EstadoResultadosRequest = {
        conjunto: conjunto!,
        usuario: usuario!,
        fecha: (req.query['fecha'] as string) ?? new Date().toISOString().split('T')[0],
        tipoEgp: req.query['tipoEgp'] as string,
        moneda: req.query['moneda'] as 'NUEVO_SOL' | 'DOLAR' | 'AMBOS',
        origen: req.query['origen'] as 'DIARIO' | 'MAYOR' | 'AMBOS',
        contabilidad: req.query['contabilidad'] as 'FISCAL' | 'CORPORATIVA',
        comparativo: req.query['comparativo'] as 'ANUAL' | 'MENSUAL',
        resultado: req.query['resultado'] as 'ANUAL' | 'MENSUAL' | 'RANGO_FECHAS',
        excluirAsientoCierreAnual: req.query['excluirAsientoCierreAnual'] === 'true',
        incluirAsientoCierreAnual: req.query['incluirAsientoCierreAnual'] === 'true',
        incluirDoceUltimosPeriodos: req.query['incluirDoceUltimosPeriodos'] === 'true',
        mostrarInformacionAnual: req.query['mostrarInformacionAnual'] === 'true',
        libroElectronico: req.query['libroElectronico'] === 'true',
        versionLibroElectronico: req.query['versionLibroElectronico'] as string,
        centroCostoTipo: req.query['centroCostoTipo'] as 'RANGO' | 'AGRUPACION',
        centroCostoDesde: req.query['centroCostoDesde'] as string,
        centroCostoHasta: req.query['centroCostoHasta'] as string,
        centroCostoAgrupacion: req.query['centroCostoAgrupacion'] as string,
        gruposCentroCosto: req.query['gruposCentroCosto'] ? (req.query['gruposCentroCosto'] as string).split(',') : [],
        incluirInformacionPresupuestos: req.query['incluirInformacionPresupuestos'] === 'true',
        presupuesto: req.query['presupuesto'] as string,
        tiposAsiento: req.query['tiposAsiento'] ? (req.query['tiposAsiento'] as string).split(',') : [],
        dimensionAdicional: req.query['dimensionAdicional'] as string,
        tituloPrincipal: req.query['tituloPrincipal'] as string,
        titulo2: req.query['titulo2'] as string,
        titulo3: req.query['titulo3'] as string,
        titulo4: req.query['titulo4'] as string,
        page,
        pageSize
      };

      const [estadoResultados, totalRecords] = await Promise.all([
        this.estadoResultadosService.getEstadoResultados(conjunto!, usuario!, filtros, page, pageSize),
        this.estadoResultadosService.getTotalRecords(conjunto!, usuario!, filtros)
      ]);

      // Obtener validación de balance si está disponible
      const validacionBalance = estadoResultados.data.length > 0 ? 
        await this.estadoResultadosService.validarBalance(conjunto!, usuario!, filtros) : 
        undefined;

      const response: EstadoResultadosResponse = {
        success: estadoResultados.success,
        data: estadoResultados.data,
        pagination: estadoResultados.pagination,
        validacionBalance
      };

      res.json(response);
    } catch (error) {
      console.error('Error getting estado resultados:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estado de resultados',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-resultados/{conjunto}/exportar-excel:
   *   post:
   *     summary: Exportar estado de resultados a Excel
   *     tags: [Estado de Resultados]
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
   *             $ref: '#/components/schemas/EstadoResultadosRequest'
   *     responses:
   *       200:
   *         description: Archivo Excel generado
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const conjunto = req.params['conjunto'];
      const filtros: EstadoResultadosRequest = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Conjunto es requerido'
        });
        return;
      }

      const estadoResultados = await this.estadoResultadosService.getEstadoResultados(
        conjunto!,
        filtros.usuario,
        filtros,
        1,
        10000 // Obtener todos los registros para exportar
      );

      // Crear archivo Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Estado de Resultados');

      // Configurar columnas
      worksheet.columns = [
        { header: 'Cuenta Contable', key: 'cuenta_contable', width: 20 },
        { header: 'Nombre Cuenta', key: 'nombre_cuenta', width: 40 },
        { header: 'Posición', key: 'posicion', width: 15 },
        { header: 'Moneda', key: 'moneda', width: 15 },
        { header: 'Saldo Inicial', key: 'saldo_inicial', width: 20 },
        { header: 'Saldo Final', key: 'saldo_final', width: 20 },
        { header: 'Orden', key: 'orden', width: 10 }
      ];

      // Agregar datos
      estadoResultados.data.forEach((item: EstadoResultados) => {
        worksheet.addRow({
          cuenta_contable: item.cuenta_contable,
          nombre_cuenta: item.nombre_cuenta,
          posicion: item.posicion,
          moneda: item.moneda,
          saldo_inicial: item.saldo_inicial,
          saldo_final: item.saldo_final,
          orden: item.orden
        });
      });

      // Configurar respuesta
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="estado-resultados-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error exporting Excel:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar Excel',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * @swagger
   * /api/estado-resultados/{conjunto}/exportar-pdf:
   *   post:
   *     summary: Exportar estado de resultados a PDF
   *     tags: [Estado de Resultados]
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
   *             $ref: '#/components/schemas/EstadoResultadosRequest'
   *     responses:
   *       200:
   *         description: Archivo PDF generado
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   */
  async exportarPDF(req: Request, res: Response): Promise<void> {
    try {
      const conjunto = req.params['conjunto'];
      const filtros: EstadoResultadosRequest = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Conjunto es requerido'
        });
        return;
      }

      // TODO: Implementar exportación a PDF
      res.status(501).json({
        success: false,
        message: 'Exportación a PDF no implementada aún'
      });
    } catch (error) {
      console.error('Error exporting PDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar PDF',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
