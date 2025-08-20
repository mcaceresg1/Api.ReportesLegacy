import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { IPlanContableRepository } from '../../domain/repositories/IPlanContableRepository';
import { PlanContableFiltros, PlanContableResponse, PlanContableCreate } from '../../domain/entities/PlanContable';

@injectable()
export class PlanContableController {
  constructor(
    @inject('IPlanContableRepository') private planContableRepository: IPlanContableRepository
  ) {}

  /**
   * Health check endpoint
   */
  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Servicio de Plan Contable funcionando correctamente',
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Genera el reporte del Plan Contable
   * @swagger
   * /api/plan-contable/generar:
   *   post:
   *     tags:
   *       - Plan Contable
   *     summary: Genera el reporte del Plan Contable
   *     description: Crea la tabla temporal y genera los datos del Plan Contable
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - conjunto
   *               - usuario
   *             properties:
   *               conjunto:
   *                 type: string
   *                 description: Código del conjunto contable
   *                 example: "ASFSAC"
   *               usuario:
   *                 type: string
   *                 description: Usuario que solicita el reporte
   *                 example: "ADMIN"
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
      const { conjunto, usuario } = req.body;

      // Validaciones
      if (!conjunto || typeof conjunto !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro "conjunto" es requerido y debe ser una cadena'
        });
        return;
      }

      if (!usuario || typeof usuario !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro "usuario" es requerido y debe ser una cadena'
        });
        return;
      }

      console.log(`Generando reporte Plan Contable para conjunto: ${conjunto}, usuario: ${usuario}`);

      // Usar directamente el repositorio
      await this.planContableRepository.generarReportePlanContable(
        conjunto as string,
        usuario as string
      );

      res.status(200).json({
        success: true,
        message: 'Reporte del Plan Contable generado exitosamente',
        data: {
          conjunto,
          usuario,
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error en generarReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar el reporte del Plan Contable',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtiene los datos del Plan Contable con filtros y paginación
   * @swagger
   * /api/plan-contable/obtener:
   *   get:
   *     tags:
   *       - Plan Contable
   *     summary: Obtiene los datos del Plan Contable
   *     description: Recupera los datos del reporte con filtros opcionales y paginación
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *       - in: query
   *         name: usuario
   *         schema:
   *           type: string
   *         description: Usuario que solicita los datos
   *         example: "ADMIN"
   *       - in: query
   *         name: cuentaContable
   *         schema:
   *           type: string
   *         description: Filtro por cuenta contable (búsqueda parcial)
   *         example: "01"
   *       - in: query
   *         name: descripcion
   *         schema:
   *           type: string
   *         description: Filtro por descripción (búsqueda parcial)
   *         example: "Clientes"
   *       - in: query
   *         name: estado
   *         schema:
   *           type: string
   *         description: Filtro por estado
   *         example: "1"
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *         example: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *           maximum: 1000
   *         description: Registros por página
   *         example: 100
   *     responses:
   *       200:
   *         description: Datos obtenidos exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerPlanContable(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, usuario, cuentaContable, descripcion, estado, page, limit } = req.query;

      // Validaciones
      if (!conjunto || typeof conjunto !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro "conjunto" es requerido'
        });
        return;
      }

      console.log(`Obteniendo Plan Contable para conjunto: ${conjunto}, usuario: ${usuario}`);
      console.log(`Filtros: cuentaContable=${cuentaContable}, descripcion=${descripcion}, estado=${estado}`);
      console.log(`Paginación: página ${page || 1}, ${limit || 100} registros por página`);

      const filtros: PlanContableFiltros = {
        conjunto: conjunto as string,
        usuario: usuario as string,
        cuentaContable: cuentaContable as string,
        descripcion: descripcion as string,
        estado: estado as string,
        page: page ? parseInt(page as string, 10) : 1,
        limit: limit ? parseInt(limit as string, 10) : 100
      };

      // Validar límite
      if (filtros.limit && (filtros.limit < 1 || filtros.limit > 1000)) {
        res.status(400).json({
          success: false,
          message: 'El límite debe estar entre 1 y 1000'
        });
        return;
      }

      // Usar directamente el repositorio
      const response: PlanContableResponse = await this.planContableRepository.obtenerPlanContable(filtros);

      res.status(200).json({
        success: true,
        message: 'Datos del Plan Contable obtenidos exitosamente',
        data: response
      });

    } catch (error) {
      console.error('Error en obtenerPlanContable:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener datos del Plan Contable',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtiene las cuentas contables básicas
   * @swagger
   * /api/plan-contable/cuentas:
   *   get:
   *     tags:
   *       - Plan Contable
   *     summary: Obtiene todas las cuentas contables
   *     description: Recupera la lista completa de cuentas contables del conjunto
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
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
      const { conjunto } = req.query;

      // Validaciones
      if (!conjunto || typeof conjunto !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro "conjunto" es requerido'
        });
        return;
      }

      console.log(`Obteniendo cuentas contables para conjunto: ${conjunto}`);

      // Usar directamente el repositorio
      const cuentas = await this.planContableRepository.obtenerCuentasContables(conjunto as string);

      res.status(200).json({
        success: true,
        message: 'Cuentas contables obtenidas exitosamente',
        data: cuentas
      });

    } catch (error) {
      console.error('Error en obtenerCuentasContables:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuentas contables',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Obtiene la configuración global del Plan Contable
   * @swagger
   * /api/plan-contable/configuracion:
   *   get:
   *     tags:
   *       - Plan Contable
   *     summary: Obtiene la configuración global
   *     description: Recupera la configuración del módulo CG para PLE-PlanContable
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *     responses:
   *       200:
   *         description: Configuración obtenida exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async obtenerConfiguracion(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.query;

      // Validaciones
      if (!conjunto || typeof conjunto !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro "conjunto" es requerido'
        });
        return;
      }

      console.log(`Obteniendo configuración global para conjunto: ${conjunto}`);

      // Usar directamente el repositorio
      const configuracion = await this.planContableRepository.obtenerConfiguracionGlobal(conjunto as string);

      res.status(200).json({
        success: true,
        message: 'Configuración global obtenida exitosamente',
        data: configuracion
      });

    } catch (error) {
      console.error('Error en obtenerConfiguracion:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener configuración global',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Crea una nueva cuenta contable
   * @swagger
   * /api/plan-contable/crear:
   *   post:
   *     tags:
   *       - Plan Contable
   *     summary: Crea una nueva cuenta contable
   *     description: Inserta una nueva cuenta contable en la tabla temporal
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - conjunto
   *               - CuentaContable
   *               - CuentaContableDesc
   *               - Estado
   *             properties:
   *               conjunto:
   *                 type: string
   *                 description: Código del conjunto contable
   *                 example: "ASFSAC"
   *               CuentaContable:
   *                 type: string
   *                 description: Código de la cuenta contable
   *                 example: "01.0.0.0.001"
   *               CuentaContableDesc:
   *                 type: string
   *                 description: Descripción de la cuenta contable
   *                 example: "Proveedores"
   *               Estado:
   *                 type: string
   *                 description: Estado de la cuenta contable
   *                 example: "1"
   *               CuentaContableCons:
   *                 type: string
   *                 description: Cuenta contable consolidada (opcional)
   *                 example: "01.0.0.0.000"
   *               CuentaContableConsDesc:
   *                 type: string
   *                 description: Descripción de la cuenta consolidada (opcional)
   *                 example: "Clientes y Proveedores"
   *     responses:
   *       201:
   *         description: Cuenta contable creada exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async crearCuentaContable(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, ...cuentaData } = req.body;

      // Validaciones
      if (!conjunto || typeof conjunto !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro "conjunto" es requerido'
        });
        return;
      }

      if (!cuentaData.CuentaContable || !cuentaData.CuentaContableDesc || !cuentaData.Estado) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros "CuentaContable", "CuentaContableDesc" y "Estado" son requeridos'
        });
        return;
      }

      console.log(`Creando cuenta contable para conjunto: ${conjunto}`);

      // Usar directamente el repositorio
      const nuevaCuenta = await this.planContableRepository.crearCuentaContable(conjunto, cuentaData as PlanContableCreate);

      res.status(201).json({
        success: true,
        message: 'Cuenta contable creada exitosamente',
        data: nuevaCuenta
      });

    } catch (error) {
      console.error('Error en crearCuentaContable:', error);
      res.status(500).json({
        success: false,
        message: 'Error al crear cuenta contable',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Exporta el Plan Contable a Excel
   * @swagger
   * /api/plan-contable/exportar-excel:
   *   get:
   *     tags:
   *       - Plan Contable
   *     summary: Exporta el Plan Contable a Excel
   *     description: Genera un archivo Excel con los datos del Plan Contable
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *       - in: query
   *         name: usuario
   *         required: true
   *         schema:
   *           type: string
   *         description: Usuario que solicita la exportación
   *         example: "ADMIN"
   *       - in: query
   *         name: cuentaContable
   *         schema:
   *           type: string
   *         description: Filtro por cuenta contable
   *         example: "01"
   *       - in: query
   *         name: descripcion
   *         schema:
   *           type: string
   *         description: Filtro por descripción
   *         example: "Clientes"
   *       - in: query
   *         name: estado
   *         schema:
   *           type: string
   *         description: Filtro por estado
   *         example: "1"
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 10000
   *           maximum: 50000
   *         description: Límite de registros a exportar
   *         example: 10000
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
      const { conjunto, usuario, cuentaContable, descripcion, estado, limit } = req.query;

      // Validaciones
      if (!conjunto || typeof conjunto !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro "conjunto" es requerido'
        });
        return;
      }

      if (!usuario || typeof usuario !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro "usuario" es requerido'
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

      console.log(`Exportando Plan Contable a Excel para conjunto: ${conjunto}, límite: ${limitNum}`);

      const filtros: PlanContableFiltros = {
        conjunto: conjunto as string,
        usuario: usuario as string,
        cuentaContable: cuentaContable as string,
        descripcion: descripcion as string,
        estado: estado as string
      };

      // Usar directamente el repositorio
      const excelBuffer = await this.planContableRepository.exportarExcel(
        conjunto as string,
        usuario as string,
        filtros,
        limitNum
      );

      // Configurar headers para descarga
      const fileName = `plan-contable-${conjunto}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      res.setHeader('Content-Length', excelBuffer.length);

      // Enviar archivo
      res.send(excelBuffer);

    } catch (error) {
      console.error('Error en exportarExcel:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar Plan Contable a Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Limpia los datos temporales del Plan Contable
   * @swagger
   * /api/plan-contable/limpiar:
   *   delete:
   *     tags:
   *       - Plan Contable
   *     summary: Limpia los datos temporales
   *     description: Elimina la tabla temporal del Plan Contable
   *     parameters:
   *       - in: query
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *         example: "ASFSAC"
   *     responses:
   *       200:
   *         description: Datos limpiados exitosamente
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async limpiarDatos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.query;

      // Validaciones
      if (!conjunto || typeof conjunto !== 'string') {
        res.status(400).json({
          success: false,
          message: 'El parámetro "conjunto" es requerido'
        });
        return;
      }

      console.log(`Limpiando datos temporales del Plan Contable para conjunto: ${conjunto}`);

      // Usar directamente el repositorio
      await this.planContableRepository.limpiarDatosTemporales(conjunto as string);

      res.status(200).json({
        success: true,
        message: 'Datos temporales del Plan Contable limpiados exitosamente'
      });

    } catch (error) {
      console.error('Error en limpiarDatos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al limpiar datos temporales',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
