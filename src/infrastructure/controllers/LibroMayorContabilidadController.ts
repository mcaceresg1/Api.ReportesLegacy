import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import * as ExcelJS from 'exceljs';
import { ILibroMayorContabilidadService } from '../../domain/services/ILibroMayorContabilidadService';
import { FiltrosLibroMayorContabilidad } from '../../domain/entities/LibroMayorContabilidad';

@injectable()
export class LibroMayorContabilidadController {
  constructor(
    @inject('ILibroMayorContabilidadService') 
    private libroMayorContabilidadService: ILibroMayorContabilidadService
  ) {}

  /**
   * @swagger
   * /api/libro-mayor-contabilidad/health:
   *   get:
   *     summary: Health check para Libro Mayor de Contabilidad
   *     tags: [Libro Mayor de Contabilidad]
   *     responses:
   *       200:
   *         description: Servicio funcionando correctamente
   */
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      success: true,
      message: 'Libro Mayor de Contabilidad service is running',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * @swagger
   * /api/libro-mayor-contabilidad/{conjunto}/cuentas-contables:
   *   get:
   *     summary: Obtener cuentas contables disponibles
   *     tags: [Libro Mayor de Contabilidad]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "PRLTRA"
   *     responses:
   *       200:
   *         description: Cuentas contables obtenidas exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerCuentasContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const cuentasContables = await this.libroMayorContabilidadService.obtenerCuentasContables(conjunto);

      res.json({
        success: true,
        data: cuentasContables,
        message: 'Cuentas contables obtenidas exitosamente',
        total: cuentasContables.length
      });
    } catch (error) {
      console.error('Error en obtenerCuentasContables:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/libro-mayor-contabilidad/{conjunto}/periodos-contables:
   *   get:
   *     summary: Obtener períodos contables disponibles
   *     tags: [Libro Mayor de Contabilidad]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "PRLTRA"
   *     responses:
   *       200:
   *         description: Períodos contables obtenidos exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
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

      const periodosContables = await this.libroMayorContabilidadService.obtenerPeriodosContables(conjunto);

      res.json({
        success: true,
        data: periodosContables,
        message: 'Períodos contables obtenidos exitosamente',
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

  /**
   * @swagger
   * /api/libro-mayor-contabilidad/{conjunto}/generar:
   *   post:
   *     summary: Generar reporte de Libro Mayor de Contabilidad
   *     tags: [Libro Mayor de Contabilidad]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "PRLTRA"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fechaDesde
   *               - fechaHasta
   *             properties:
   *               fechaDesde:
   *                 type: string
   *                 format: date
   *                 description: Fecha de inicio
   *                 example: "2023-01-01"
   *               fechaHasta:
   *                 type: string
   *                 format: date
   *                 description: Fecha de fin
   *                 example: "2025-07-15"
   *               cuentaContableDesde:
   *                 type: string
   *                 description: Cuenta contable desde
   *                 example: "01"
   *               cuentaContableHasta:
   *                 type: string
   *                 description: Cuenta contable hasta
   *                 example: "99"
   *               centroCosto:
   *                 type: string
   *                 description: Centro de costo
   *                 example: "001"
   *               tipoAsiento:
   *                 type: string
   *                 description: Tipo de asiento
   *                 example: "N"
   *               origen:
   *                 type: string
   *                 description: Origen del asiento
   *                 example: "CP"
   *               contabilidad:
   *                 type: string
   *                 description: Tipo de contabilidad
   *                 example: "F"
   *               claseAsiento:
   *                 type: string
   *                 description: Clase de asiento
   *                 example: "N"
   *               limit:
   *                 type: integer
   *                 description: Límite de registros
   *                 example: 1000
   *     responses:
   *       200:
   *         description: Reporte generado exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const filtros: FiltrosLibroMayorContabilidad = {
        conjunto,
        fechaDesde: req.body.fechaDesde,
        fechaHasta: req.body.fechaHasta,
        cuentaContableDesde: req.body.cuentaContableDesde,
        cuentaContableHasta: req.body.cuentaContableHasta,
        centroCosto: req.body.centroCosto,
        tipoAsiento: req.body.tipoAsiento,
        origen: req.body.origen,
        contabilidad: req.body.contabilidad,
        claseAsiento: req.body.claseAsiento,
        limit: req.body.limit || 1000
      };

      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      const reporte = await this.libroMayorContabilidadService.generarReporte(filtros);

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
   * /api/libro-mayor-contabilidad/{conjunto}/obtener:
   *   post:
   *     summary: Obtener reporte de Libro Mayor de Contabilidad con paginación
   *     tags: [Libro Mayor de Contabilidad]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "PRLTRA"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fechaDesde
   *               - fechaHasta
   *             properties:
   *               fechaDesde:
   *                 type: string
   *                 format: date
   *                 description: Fecha de inicio
   *                 example: "2023-01-01"
   *               fechaHasta:
   *                 type: string
   *                 format: date
   *                 description: Fecha de fin
   *                 example: "2025-07-15"
   *               page:
   *                 type: integer
   *                 description: Número de página
   *                 example: 1
   *               pageSize:
   *                 type: integer
   *                 description: Tamaño de página
   *                 example: 100
   *               cuentaContableDesde:
   *                 type: string
   *                 description: Cuenta contable desde
   *                 example: "01"
   *               cuentaContableHasta:
   *                 type: string
   *                 description: Cuenta contable hasta
   *                 example: "99"
   *               centroCosto:
   *                 type: string
   *                 description: Centro de costo
   *                 example: "001"
   *               tipoAsiento:
   *                 type: string
   *                 description: Tipo de asiento
   *                 example: "N"
   *               origen:
   *                 type: string
   *                 description: Origen del asiento
   *                 example: "CP"
   *               contabilidad:
   *                 type: string
   *                 description: Tipo de contabilidad
   *                 example: "F"
   *               claseAsiento:
   *                 type: string
   *                 description: Clase de asiento
   *                 example: "N"
   *               limit:
   *                 type: integer
   *                 description: Límite de registros
   *                 example: 1000
   *     responses:
   *       200:
   *         description: Reporte obtenido exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerLibroMayorContabilidad(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const filtros: FiltrosLibroMayorContabilidad = {
        conjunto,
        fechaDesde: req.body.fechaDesde,
        fechaHasta: req.body.fechaHasta,
        cuentaContableDesde: req.body.cuentaContableDesde,
        cuentaContableHasta: req.body.cuentaContableHasta,
        centroCosto: req.body.centroCosto,
        tipoAsiento: req.body.tipoAsiento,
        origen: req.body.origen,
        contabilidad: req.body.contabilidad,
        claseAsiento: req.body.claseAsiento,
        limit: req.body.pageSize || req.body.limit || 1000
      };

      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      const resultado = await this.libroMayorContabilidadService.obtenerLibroMayorContabilidad(filtros);

      res.json({
        success: true,
        data: resultado.data,
        message: 'Reporte obtenido exitosamente',
        total: resultado.total,
        pagination: {
          page: resultado.page,
          pageSize: resultado.pageSize,
          totalRecords: resultado.total,
          totalPages: resultado.totalPages
        }
      });
    } catch (error) {
      console.error('Error en obtenerLibroMayorContabilidad:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/libro-mayor-contabilidad/{conjunto}/exportar-excel:
   *   post:
   *     summary: Exportar reporte de Libro Mayor de Contabilidad a Excel
   *     tags: [Libro Mayor de Contabilidad]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "PRLTRA"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fechaDesde
   *               - fechaHasta
   *             properties:
   *               fechaDesde:
   *                 type: string
   *                 format: date
   *                 description: Fecha de inicio
   *                 example: "2023-01-01"
   *               fechaHasta:
   *                 type: string
   *                 format: date
   *                 description: Fecha de fin
   *                 example: "2025-07-15"
   *               cuentaContableDesde:
   *                 type: string
   *                 description: Cuenta contable desde
   *                 example: "01"
   *               cuentaContableHasta:
   *                 type: string
   *                 description: Cuenta contable hasta
   *                 example: "99"
   *               centroCosto:
   *                 type: string
   *                 description: Centro de costo
   *                 example: "001"
   *               tipoAsiento:
   *                 type: string
   *                 description: Tipo de asiento
   *                 example: "N"
   *               origen:
   *                 type: string
   *                 description: Origen del asiento
   *                 example: "CP"
   *               contabilidad:
   *                 type: string
   *                 description: Tipo de contabilidad
   *                 example: "F"
   *               claseAsiento:
   *                 type: string
   *                 description: Clase de asiento
   *                 example: "N"
   *               limit:
   *                 type: integer
   *                 description: Límite de registros
   *                 example: 1000
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
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const filtros: FiltrosLibroMayorContabilidad = {
        conjunto,
        fechaDesde: req.body.fechaDesde,
        fechaHasta: req.body.fechaHasta,
        cuentaContableDesde: req.body.cuentaContableDesde,
        cuentaContableHasta: req.body.cuentaContableHasta,
        centroCosto: req.body.centroCosto,
        tipoAsiento: req.body.tipoAsiento,
        origen: req.body.origen,
        contabilidad: req.body.contabilidad,
        claseAsiento: req.body.claseAsiento,
        limit: req.body.limit || 10000
      };

      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      // Obtener los datos del reporte
      const reporte = await this.libroMayorContabilidadService.generarReporte(filtros);

      // Crear archivo Excel
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Libro Mayor de Contabilidad');

      // Configurar columnas
      worksheet.columns = [
        { header: 'Período Contable', key: 'periodo_contable', width: 15 },
        { header: 'Cuenta Contable', key: 'cuenta_contable', width: 20 },
        { header: 'Descripción', key: 'descripcion', width: 40 },
        { header: 'Asiento', key: 'asiento', width: 15 },
        { header: 'Tipo', key: 'tipo', width: 10 },
        { header: 'Documento', key: 'documento', width: 20 },
        { header: 'Referencia', key: 'referencia', width: 20 },
        { header: 'Débito Local', key: 'debito_local', width: 15 },
        { header: 'Débito Dólar Mayor', key: 'debito_dolar_mayor', width: 18 },
        { header: 'Crédito Local', key: 'credito_local', width: 15 },
        { header: 'Crédito Dólar Mayor', key: 'credito_dolar_mayor', width: 18 },
        { header: 'Saldo Deudor', key: 'saldo_deudor', width: 15 },
        { header: 'Saldo Deudor Dólar', key: 'saldo_deudor_dolar', width: 18 },
        { header: 'Saldo Acreedor', key: 'saldo_acreedor', width: 15 },
        { header: 'Saldo Acreedor Dólar', key: 'saldo_acreedor_dolar', width: 18 },
        { header: 'Centro de Costo', key: 'centro_costo', width: 15 },
        { header: 'Tipo Asiento', key: 'tipo_asiento', width: 15 },
        { header: 'Fecha', key: 'fecha', width: 12 },
        { header: 'NIT', key: 'nit', width: 15 },
        { header: 'NIT Nombre', key: 'nit_nombre', width: 30 },
        { header: 'Fuente', key: 'fuente', width: 15 },
        { header: 'Consecutivo', key: 'consecutivo', width: 12 },
        { header: 'Correlativo Asiento', key: 'correlativo_asiento', width: 18 },
        { header: 'Tipo Línea', key: 'tipo_linea', width: 12 }
      ];

      // Agregar datos
      reporte.forEach(item => {
        worksheet.addRow({
          periodo_contable: item.periodo_contable,
          cuenta_contable: item.cuenta_contable,
          descripcion: item.descripcion,
          asiento: item.asiento,
          tipo: item.tipo,
          documento: item.documento,
          referencia: item.referencia,
          debito_local: item.debito_local,
          debito_dolar_mayor: item.debito_dolar_mayor,
          credito_local: item.credito_local,
          credito_dolar_mayor: item.credito_dolar_mayor,
          saldo_deudor: item.saldo_deudor,
          saldo_deudor_dolar: item.saldo_deudor_dolar,
          saldo_acreedor: item.saldo_acreedor,
          saldo_acreedor_dolar: item.saldo_acreedor_dolar,
          centro_costo: item.centro_costo,
          tipo_asiento: item.tipo_asiento,
          fecha: item.fecha,
          nit: item.nit,
          nit_nombre: item.nit_nombre,
          fuente: item.fuente,
          consecutivo: item.consecutivo,
          correlativo_asiento: item.correlativo_asiento,
          tipo_linea: item.tipo_linea
        });
      });

      // Configurar respuesta
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="libro-mayor-contabilidad-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al exportar Excel en LibroMayorContabilidadController:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/libro-mayor-contabilidad/{conjunto}/exportar-pdf:
   *   post:
   *     summary: Exportar reporte de Libro Mayor de Contabilidad a PDF
   *     tags: [Libro Mayor de Contabilidad]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "PRLTRA"
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - fechaDesde
   *               - fechaHasta
   *             properties:
   *               fechaDesde:
   *                 type: string
   *                 format: date
   *                 description: Fecha de inicio
   *                 example: "2023-01-01"
   *               fechaHasta:
   *                 type: string
   *                 format: date
   *                 description: Fecha de fin
   *                 example: "2025-07-15"
   *               cuentaContableDesde:
   *                 type: string
   *                 description: Cuenta contable desde
   *                 example: "01"
   *               cuentaContableHasta:
   *                 type: string
   *                 description: Cuenta contable hasta
   *                 example: "99"
   *               centroCosto:
   *                 type: string
   *                 description: Centro de costo
   *                 example: "001"
   *               tipoAsiento:
   *                 type: string
   *                 description: Tipo de asiento
   *                 example: "N"
   *               origen:
   *                 type: string
   *                 description: Origen del asiento
   *                 example: "CP"
   *               contabilidad:
   *                 type: string
   *                 description: Tipo de contabilidad
   *                 example: "F"
   *               claseAsiento:
   *                 type: string
   *                 description: Clase de asiento
   *                 example: "N"
   *               limit:
   *                 type: integer
   *                 description: Límite de registros
   *                 example: 1000
   *     responses:
   *       200:
   *         description: Archivo PDF generado exitosamente
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async exportarPDF(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const filtros: FiltrosLibroMayorContabilidad = {
        conjunto,
        fechaDesde: req.body.fechaDesde,
        fechaHasta: req.body.fechaHasta,
        cuentaContableDesde: req.body.cuentaContableDesde,
        cuentaContableHasta: req.body.cuentaContableHasta,
        centroCosto: req.body.centroCosto,
        tipoAsiento: req.body.tipoAsiento,
        origen: req.body.origen,
        contabilidad: req.body.contabilidad,
        claseAsiento: req.body.claseAsiento,
        limit: req.body.limit || 10000
      };

      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      const pdfBuffer = await this.libroMayorContabilidadService.exportarPDF(filtros);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="libro-mayor-contabilidad-${conjunto}-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error al exportar PDF en LibroMayorContabilidadController:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar PDF',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
