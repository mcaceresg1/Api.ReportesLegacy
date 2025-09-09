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
   * /api/libro-mayor-contabilidad/{conjunto}/tipos-asiento:
   *   get:
   *     summary: Obtener tipos de asiento disponibles
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
   *         description: Tipos de asiento obtenidos exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerTiposAsiento(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const tiposAsiento = await this.libroMayorContabilidadService.obtenerTiposAsiento(conjunto);

      res.json({
        success: true,
        data: tiposAsiento,
        message: 'Tipos de asiento obtenidos exitosamente',
        total: tiposAsiento.length
      });
    } catch (error) {
      console.error('Error en obtenerTiposAsiento:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/libro-mayor-contabilidad/{conjunto}/centros-costo:
   *   get:
   *     summary: Obtener centros de costo disponibles
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
   *         description: Centros de costo obtenidos exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
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

      const centrosCosto = await this.libroMayorContabilidadService.obtenerCentrosCosto(conjunto);

      res.json({
        success: true,
        data: centrosCosto,
        message: 'Centros de costo obtenidos exitosamente',
        total: centrosCosto.length
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

  /**
   * @swagger
   * /api/libro-mayor-contabilidad/{conjunto}/paquetes:
   *   get:
   *     summary: Obtener paquetes disponibles
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
   *         description: Paquetes obtenidos exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerPaquetes(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const paquetes = await this.libroMayorContabilidadService.obtenerPaquetes(conjunto);

      res.json({
        success: true,
        data: paquetes,
        message: 'Paquetes obtenidos exitosamente',
        total: paquetes.length
      });
    } catch (error) {
      console.error('Error en obtenerPaquetes:', error);
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
   *               moneda:
   *                 type: string
   *                 enum: [NUEVO_SOL, DOLAR]
   *                 description: Tipo de moneda
   *               clase:
   *                 type: string
   *                 enum: [PRELIMINAR, OFICIAL]
   *                 description: Clase del reporte
   *               contabilidad:
   *                 type: object
   *                 properties:
   *                   fiscal:
   *                     type: boolean
   *                   corporativa:
   *                     type: boolean
   *               tipoReporte:
   *                 type: string
   *                 enum: [DETALLADO, RESUMIDO]
   *                 description: Tipo de reporte
   *               claseReporte:
   *                 type: string
   *                 enum: [ESTANDAR, ANALITICO]
   *                 description: Clase del reporte
   *               origen:
   *                 type: string
   *                 enum: [DIARIO, MAYOR, AMBOS]
   *                 description: Origen de los datos
   *               nivelAnalisis:
   *                 type: integer
   *                 description: Nivel de análisis
   *               ordenadoPor:
   *                 type: string
   *                 enum: [FECHA, ASIENTO, TIPO_ASIENTO]
   *                 description: Criterio de ordenamiento
   *               cuentaContableDesde:
   *                 type: string
   *                 description: Cuenta contable desde
   *               cuentaContableHasta:
   *                 type: string
   *                 description: Cuenta contable hasta
   *               libroElectronico:
   *                 type: boolean
   *                 description: Incluir libro electrónico
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
        moneda: req.body.moneda,
        clase: req.body.clase,
        contabilidad: req.body.contabilidad,
        tipoReporte: req.body.tipoReporte,
        claseReporte: req.body.claseReporte,
        origen: req.body.origen,
        nivelAnalisis: req.body.nivelAnalisis,
        ordenadoPor: req.body.ordenadoPor,
        cuentaContableDesde: req.body.cuentaContableDesde,
        cuentaContableHasta: req.body.cuentaContableHasta,
        libroElectronico: req.body.libroElectronico,
        opcionesAsientos: req.body.opcionesAsientos,
        centroCosto: req.body.centroCosto,
        tiposAsiento: req.body.tiposAsiento,
        nitDesde: req.body.nitDesde,
        nitHasta: req.body.nitHasta,
        usarFiltroPaquete: req.body.usarFiltroPaquete,
        paquetes: req.body.paquetes,
        tituloPrincipal: req.body.tituloPrincipal,
        titulo2: req.body.titulo2,
        titulo3: req.body.titulo3,
        titulo4: req.body.titulo4,
        nivelCuenta: req.body.nivelCuenta,
        operadorCuenta: req.body.operadorCuenta,
        valorCuenta: req.body.valorCuenta,
        conectorCuenta: req.body.conectorCuenta,
        dimensionAdicional: req.body.dimensionAdicional,
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
        message: 'Error al generar el reporte de Libro Mayor de Contabilidad',
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
        moneda: req.body.moneda,
        clase: req.body.clase,
        contabilidad: req.body.contabilidad,
        tipoReporte: req.body.tipoReporte,
        claseReporte: req.body.claseReporte,
        origen: req.body.origen,
        nivelAnalisis: req.body.nivelAnalisis,
        ordenadoPor: req.body.ordenadoPor,
        cuentaContableDesde: req.body.cuentaContableDesde,
        cuentaContableHasta: req.body.cuentaContableHasta,
        libroElectronico: req.body.libroElectronico,
        opcionesAsientos: req.body.opcionesAsientos,
        centroCosto: req.body.centroCosto,
        tiposAsiento: req.body.tiposAsiento,
        nitDesde: req.body.nitDesde,
        nitHasta: req.body.nitHasta,
        usarFiltroPaquete: req.body.usarFiltroPaquete,
        paquetes: req.body.paquetes,
        tituloPrincipal: req.body.tituloPrincipal,
        titulo2: req.body.titulo2,
        titulo3: req.body.titulo3,
        titulo4: req.body.titulo4,
        nivelCuenta: req.body.nivelCuenta,
        operadorCuenta: req.body.operadorCuenta,
        valorCuenta: req.body.valorCuenta,
        conectorCuenta: req.body.conectorCuenta,
        dimensionAdicional: req.body.dimensionAdicional,
        page: req.body.page || 1,
        pageSize: req.body.pageSize || 100,
        limit: req.body.limit || 1000
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
        message: 'Error al obtener el reporte de Libro Mayor de Contabilidad',
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
   *               limit:
   *                 type: integer
   *                 description: Límite de registros
   *                 example: 10000
   *     responses:
   *       200:
   *         description: Archivo Excel generado exitosamente
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
        moneda: req.body.moneda,
        clase: req.body.clase,
        contabilidad: req.body.contabilidad,
        tipoReporte: req.body.tipoReporte,
        claseReporte: req.body.claseReporte,
        origen: req.body.origen,
        nivelAnalisis: req.body.nivelAnalisis,
        ordenadoPor: req.body.ordenadoPor,
        cuentaContableDesde: req.body.cuentaContableDesde,
        cuentaContableHasta: req.body.cuentaContableHasta,
        libroElectronico: req.body.libroElectronico,
        opcionesAsientos: req.body.opcionesAsientos,
        centroCosto: req.body.centroCosto,
        tiposAsiento: req.body.tiposAsiento,
        nitDesde: req.body.nitDesde,
        nitHasta: req.body.nitHasta,
        usarFiltroPaquete: req.body.usarFiltroPaquete,
        paquetes: req.body.paquetes,
        tituloPrincipal: req.body.tituloPrincipal,
        titulo2: req.body.titulo2,
        titulo3: req.body.titulo3,
        titulo4: req.body.titulo4,
        nivelCuenta: req.body.nivelCuenta,
        operadorCuenta: req.body.operadorCuenta,
        valorCuenta: req.body.valorCuenta,
        conectorCuenta: req.body.conectorCuenta,
        dimensionAdicional: req.body.dimensionAdicional,
        limit: req.body.limit || 10000
      };

      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      const excelBuffer = await this.libroMayorContabilidadService.exportarExcel(filtros);

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="libro-mayor-contabilidad-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      res.setHeader('Content-Length', excelBuffer.length);

      res.send(excelBuffer);
    } catch (error) {
      console.error('Error en exportarExcel:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar el reporte a Excel',
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
   *               limit:
   *                 type: integer
   *                 description: Límite de registros
   *                 example: 10000
   *     responses:
   *       200:
   *         description: Archivo PDF generado exitosamente
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
        moneda: req.body.moneda,
        clase: req.body.clase,
        contabilidad: req.body.contabilidad,
        tipoReporte: req.body.tipoReporte,
        claseReporte: req.body.claseReporte,
        origen: req.body.origen,
        nivelAnalisis: req.body.nivelAnalisis,
        ordenadoPor: req.body.ordenadoPor,
        cuentaContableDesde: req.body.cuentaContableDesde,
        cuentaContableHasta: req.body.cuentaContableHasta,
        libroElectronico: req.body.libroElectronico,
        opcionesAsientos: req.body.opcionesAsientos,
        centroCosto: req.body.centroCosto,
        tiposAsiento: req.body.tiposAsiento,
        nitDesde: req.body.nitDesde,
        nitHasta: req.body.nitHasta,
        usarFiltroPaquete: req.body.usarFiltroPaquete,
        paquetes: req.body.paquetes,
        tituloPrincipal: req.body.tituloPrincipal,
        titulo2: req.body.titulo2,
        titulo3: req.body.titulo3,
        titulo4: req.body.titulo4,
        nivelCuenta: req.body.nivelCuenta,
        operadorCuenta: req.body.operadorCuenta,
        valorCuenta: req.body.valorCuenta,
        conectorCuenta: req.body.conectorCuenta,
        dimensionAdicional: req.body.dimensionAdicional,
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

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="libro-mayor-contabilidad-${conjunto}-${new Date().toISOString().split('T')[0]}.pdf"`);
      res.setHeader('Content-Length', pdfBuffer.length);

      res.send(pdfBuffer);
    } catch (error) {
      console.error('Error en exportarPDF:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar el reporte a PDF',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
