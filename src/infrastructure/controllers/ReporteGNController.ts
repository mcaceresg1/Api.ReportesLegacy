import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IUsuarioService } from '../../domain/services/IUsuarioService';
import { ICommandBus } from '../../domain/cqrs/ICommandBus';
import { IQueryBus } from '../../domain/cqrs/IQueryBus';
import { UsuarioCreate, UsuarioUpdate } from '../../domain/entities/Usuario';
import { CreateUsuarioCommand } from '../../application/commands/usuario/CreateUsuarioCommand';
import { UpdateUsuarioCommand } from '../../application/commands/usuario/UpdateUsuarioCommand';
import { DeleteUsuarioCommand } from '../../application/commands/usuario/DeleteUsuarioCommand';
import { GetAllUsuariosQuery } from '../../application/queries/usuario/GetAllUsuariosQuery';
import { GetUsuarioByIdQuery } from '../../application/queries/usuario/GetUsuarioByIdQuery';
import { IReporteGNService } from '../../domain/services/IReporteGNService';
import { ExportarAccionesDePersonalExcelParams } from '../../domain/entities/ReporteGN';

/**
 * @swagger
 * components:
 *   schemas:
 *     GNAccionDePersonal:
 *       type: object
 *       properties:
 *         numero_accion:
 *           type: number
 *         descripcion_accion:
 *           type: string
 *         estado_accion:
 *           type: string
 *         fecha:
 *           type: string
 *         empleado:
 *           type: string
 *         nombre:
 *           type: string
 *         fecha_rige:
 *           type: string
 *         fecha_vence:
 *           type: string
 *         puesto:
 *           type: string
 *         plaza:
 *           type: string
 *         salario_promedio:
 *           type: number
 *         salario_diario_int:
 *           type: number
 *         departamento:
 *           type: string
 *         centro_costo:
 *           type: string
 *         nomina:
 *           type: string
 *         dias_accion:
 *           type: number
 *         saldo:
 *           type: number
 *         numero_accion_cuenta:
 *           type: number
 *         regimen_vacacional:
 *           type: string
 *         descripcion:
 *           type: string
 *         RowPointer:
 *           type: string
 *         origen:
 *           type: string
 *     GNContrato:
 *       type: object
 *       properties:
 *         empleado:
 *           type: string
 *         nombre:
 *           type: string
 *         tipo_contrato:
 *           type: string
 *         fecha_inicio:
 *           type: string
 *         fecha_finalizacion:
 *           type: string
 *         estado_contrato:
 *           type: string
 *     GNRolDeVacaciones:
 *       type: object
 *       properties:
 *         empleado:
 *           type: string
 *         fecha_inicio:
 *           type: string
 *         fecha_fin:
 *           type: string
 *         duracion:
 *           type: number
 *         tipo_vacacion:
 *           type: string
 *         nombre:
 *           type: string
 *     GNPrestamoCuentaCorriente:
 *       type: object
 *       properties:
 *         num_movimiento:
 *           type: number
 *         fecha_ingreso:
 *           type: string
 *         forma_pago:
 *           type: string
 *         estado:
 *           type: string
 *         tipo_movimiento:
 *           type: string
 *         descripcion:
 *           type: string
 *         numero_cuotas:
 *           type: number
 *         moneda:
 *           type: string
 *         tasa_interes:
 *           type: number
 *         monto_local:
 *           type: number
 *         monto_dolar:
 *           type: number
 *         saldo_local:
 *           type: number
 *         saldo_dolar:
 *           type: number
 *         monto_int_local:
 *           type: number
 *         monto_int_dolar:
 *           type: number
 *         saldo_int_local:
 *           type: number
 *         saldo_int_dolar:
 *           type: number
 *         fch_ult_modific:
 *           type: string
 *         usuario_apro:
 *           type: string
 *         fecha_apro:
 *           type: string
 *         usuario_rh:
 *           type: string
 *         fecha_apro_rh:
 *           type: string
 *         tipo_cambio:
 *           type: string
 *         documento:
 *           type: string
 *         observaciones:
 *           type: string
 *         empleado:
 *           type: string
 *         RowPointer:
 *           type: string
 *         esquema_origen:
 *           type: string
 *     GNReporteAnualizado:
 *       type: object
 *       properties:
 *         esquema:
 *           type: string
 *         codigo:
 *           type: string
 *         nomina:
 *           type: string
 *         empleado:
 *           type: string
 *         fecha_ingreso:
 *           type: string
 *         fecha_salida:
 *           type: string
 *         centro_costo:
 *           type: string
 *         sede:
 *           type: string
 *         puesto:
 *           type: string
 *         essalud:
 *           type: string
 *         afp:
 *           type: string
 *         cuspp:
 *           type: string
 *         estado:
 *           type: string
 *
 */

@injectable()
export class ReporteGNController {
  constructor(
    @inject('IReporteGNService') private reporteGNService: IReporteGNService,
  ) {}

  /**
   * @swagger
   * /api/reporte-gn/acciones-de-personal/{conjunto}:
   *   get:
   *     summary: Obtener todas las acciones de personal
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema:
   *           type: string
   *       - in: query
   *         name: fecha_accion_inicio
   *         required: true
   *         description: "Fecha de Inicio"
   *         schema: { type: string }
   *       - in: query
   *         name: fecha_accion_fin
   *         required: true
   *         description: "Fecha de Fin"
   *         schema: { type: string }
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         description: "ID del Usuario"
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Lista de todas las acciones de personal
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
   *                     $ref: '#/components/schemas/GNAccionDePersonal'
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getAccionesDePersonal(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { fecha_accion_inicio, fecha_accion_fin, id_usuario } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const acciones = await this.reporteGNService.getAccionesDePersonal(
        conjunto,
        {
          fecha_accion_inicio: fecha_accion_inicio as string,
          fecha_accion_fin: fecha_accion_fin as string,
          cod_empleado: id_usuario as string,
        },
      );
      res.json({
        success: acciones?.success,
        data: acciones?.data,
        message: acciones?.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener acciones de personal.',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/contratos/{conjunto}:
   *   get:
   *     summary: Obtener todos los contratos
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema:
   *           type: string
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         description: "ID del Usuario"
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Lista de todos los contratos
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
   *                     $ref: '#/components/schemas/GNContrato'
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */

  async getContratos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { id_usuario } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const contratos = await this.reporteGNService.getContratos(conjunto, {
        cod_empleado: id_usuario as string,
      });
      res.json({
        success: contratos?.success,
        data: contratos?.data,
        message: contratos?.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener contratos.',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/rol-de-vacaciones/{conjunto}:
   *   get:
   *     summary: Obtener el rol de vacaciones
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema:
   *           type: string
   *       - in: query
   *         name: fecha_inicio
   *         required: true
   *         description: "Fecha de Inicio"
   *         schema: { type: string }
   *       - in: query
   *         name: fecha_fin
   *         required: true
   *         description: "Fecha de Fin"
   *         schema: { type: string }
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         description: "ID del Usuario"
   *         schema: { type: string }
   *       - in: query
   *         name: pagina
   *         required: true
   *         description: "Página"
   *         schema: { type: number }
   *       - in: query
   *         name: registrosPorPagina
   *         required: true
   *         description: "Registros por página"
   *         schema: { type: number }
   *     responses:
   *       200:
   *         description: Lista de todos los roles de vacaciones
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: object
   *                   properties:
   *                     totalRegistros:
   *                       type: number
   *                     totalPaginas:
   *                       type: number
   *                     paginaActual:
   *                       type: number
   *                     registrosPorPagina:
   *                       type: number
   *                     data:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/GNRolDeVacaciones'
   *                     message:
   *                       type: string
   *                     success:
   *                       type: boolean
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getRolDeVacaciones(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const {
        fecha_inicio,
        fecha_fin,
        id_usuario,
        pagina,
        registrosPorPagina,
      } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const rolDeVacaciones = await this.reporteGNService.getRolDeVacaciones(
        conjunto,
        {
          fecha_fin: fecha_fin as string,
          pagina: pagina as unknown as number,
          registrosPorPagina: registrosPorPagina as unknown as number,
          fecha_inicio: fecha_inicio as string,
          cod_empleado: id_usuario as string,
        },
      );
      res.json({
        success: rolDeVacaciones?.success,
        data: rolDeVacaciones,
        message: rolDeVacaciones?.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener rol de vacaciones.',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/anualizado/{conjunto}:
   *   get:
   *     summary: Obtener el anualizado
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema:
   *           type: string
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         description: "ID del Usuario"
   *         schema: { type: string }
   *       - in: query
   *         name: tipo
   *         required: true
   *         description: "Tipo de reporte"
   *         schema: { type: string }
   *       - in: query
   *         name: codigo_nomina
   *         required: true
   *         description: "Código de nómina"
   *         schema: { type: number }
   *       - in: query
   *         name: periodo
   *         required: true
   *         description: "Período"
   *         schema: { type: number }
   *     responses:
   *       200:
   *         description: Lista de todos los anualizados
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: GNReporteAnualizado
   *
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getAnualizado(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { id_usuario, tipo, codigo_nomina, periodo } = req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const anualizado = await this.reporteGNService.getReporteAnualizado(
        conjunto,
        {
          cod_empleado: id_usuario as string,
          filtro: tipo as 'N' | 'P',
          codigo_nomina: codigo_nomina as unknown as number,
          periodo: periodo as unknown as number,
          centro_costo: '',
          area: '',
          activo: 1,
        },
      );
      res.json({
        success: anualizado?.success,
        data: anualizado?.data,
        message: anualizado?.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener anualizado.',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/prestamo-cta-cte/{conjunto}:
   *   get:
   *     summary: Obtener el prestamo de cuenta corriente
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema:
   *           type: string
   *       - in: query
   *         name: cta_cte
   *         required: true
   *         description: "Código de cuenta corriente"
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Lista de todos los prestamos de cuenta corriente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/GNPrestamoCuentaCorriente'
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getPrestamoCtaCte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, cta_cte } = req.query;
      const prestamoCtaCte = await this.reporteGNService.getPrestamoCtaCte(
        conjunto as string,
        {
          cod_empleado: cta_cte as string,
          naturaleza: 'C',
        },
      );
      res.json({
        success: prestamoCtaCte?.success,
        data: prestamoCtaCte?.data,
        message: prestamoCtaCte?.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener prestamo de cuenta corriente.',
        error: error instanceof Error ? error.message : 'Error desconocido',
      });
    }
  }
  /**
   * Faltantes
   */
  /**
   * @swagger
   * /api/reporte-gn/prestamos/{conjunto}:
   *   get:
   *     summary: Obtener préstamos de empleados
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema: { type: string }
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: num_nomina
   *         required: true
   *         schema: { type: number }
   *       - in: query
   *         name: numero_nomina
   *         required: false
   *         schema: { type: number }
   *       - in: query
   *         name: tipo_prestamo
   *         schema: { type: string }
   *       - in: query
   *         name: estado_prestamo
   *         schema: { type: string }
   *       - in: query
   *         name: estado_empleado
   *         schema: { type: string }
   *       - in: query
   *         name: estado_cuota
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Reporte de préstamos
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getPrestamos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;

      const filtros = {
        cod_empleado: req.query['id_usuario'] as string,
        num_nomina: parseInt(req.query['num_nomina'] as string, 10),
        numero_nomina: parseInt(req.query['numero_nomina'] as string, 10),
        tipo_prestamo: req.query['tipo_prestamo'] as string,
        estado_prestamo: req.query['estado_prestamo'] as string,
        estado_empleado: req.query['estado_empleado'] as string,
        estado_cuota: req.query['estado_cuota'] as string,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const prestamos = await this.reporteGNService.getPrestamos(
        conjunto,
        filtros,
      );
      res.json(prestamos);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener préstamos',
        error: err,
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/boleta-pago/{conjunto}:
   *   get:
   *     summary: Obtener boleta de pago del empleado
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema: { type: string }
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: num_nomina
   *         required: true
   *         schema: { type: number }
   *     responses:
   *       200:
   *         description: Datos de la boleta de pago
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getBoletaDePago(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        cod_empleado: req.query['id_usuario'] as string,
        num_nomina: parseInt(req.query['num_nomina'] as string, 10),
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const boleta = await this.reporteGNService.getBoletaDePago(
        conjunto,
        filtros,
      );
      res.json(boleta);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener boleta de pago',
        error: err,
      });
    }
  }

  /**
   * Exporta el reporte a Excel
   */

  /**
   * @swagger
   * /api/reporte-gn/acciones-de-personal/excel/{conjunto}:
   *   get:
   *     summary: Obtener todas las acciones de personal
   *     tags: [Reportes Gestión de Nómina - Exportaciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema: { type: string }
   *       - in: query
   *         name: fecha_accion_inicio
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: fecha_accion_fin
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Lista de acciones de personal
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async exportarAccionesDePersonalExcel(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        fecha_accion_inicio: req.query['fecha_accion_inicio'] as string,
        fecha_accion_fin: req.query['fecha_accion_fin'] as string,
        cod_empleado: req.query['id_usuario'] as string,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const buffer =
        await this.reporteGNService.exportarAccionesDePersonalExcel(
          conjunto,
          filtros,
        );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="acciones-personal-${conjunto}.xlsx"`,
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error exportando Acciones de Personal',
        error: err,
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/contratos/excel/{conjunto}:
   *   get:
   *     summary: Obtener todos los contratos
   *     tags: [Reportes Gestión de Nómina - Exportaciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema: { type: string }
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Lista de contratos
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async exportarContratosExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = { cod_empleado: req.query['id_usuario'] as string };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarContratosExcel(
        conjunto,
        filtros,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="contratos-${conjunto}.xlsx"`,
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error exportando Contratos',
        error: err,
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/rol-de-vacaciones/excel/{conjunto}:
   *   get:
   *     summary: Exportar Rol de Vacaciones a Excel
   *     tags: [Reportes Gestión de Nómina - Exportaciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema: { type: string }
   *       - in: query
   *         name: fecha_inicio
   *         required: true
   *         description: "Fecha de inicio del rango"
   *         schema: { type: string, format: date }
   *       - in: query
   *         name: fecha_fin
   *         required: true
   *         description: "Fecha de fin del rango"
   *         schema: { type: string, format: date }
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         description: "Código del empleado"
   *         schema: { type: string }
   *       - in: query
   *         name: pagina
   *         required: false
   *         description: "Número de página para paginación"
   *         schema: { type: integer }
   *       - in: query
   *         name: registrosPorPagina
   *         required: false
   *         description: "Cantidad de registros por página"
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: Archivo Excel generado
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async exportarRolDeVacacionesExcel(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        fecha_inicio: req.query['fecha_inicio'] as string,
        fecha_fin: req.query['fecha_fin'] as string,
        cod_empleado: req.query['id_usuario'] as string,
        pagina: parseInt(req.query['pagina'] as string, 10) || 1,
        registrosPorPagina:
          parseInt(req.query['registrosPorPagina'] as string, 10) || 1000,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarRolDeVacacionesExcel(
        conjunto,
        filtros,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="rol-vacaciones-${conjunto}.xlsx"`,
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error exportando Rol de Vacaciones',
        error: err,
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/anualizado/excel/{conjunto}:
   *   get:
   *     summary: Exportar Reporte Anualizado a Excel
   *     tags: [Reportes Gestión de Nómina - Exportaciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema: { type: string }
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         description: "Código del empleado"
   *         schema: { type: string }
   *       - in: query
   *         name: tipo
   *         required: true
   *         description: "Tipo de filtro (N = Nómina, P = Persona)"
   *         schema:
   *           type: string
   *           enum: [N, P]
   *       - in: query
   *         name: codigo_nomina
   *         required: true
   *         description: "Código de la nómina"
   *         schema: { type: integer }
   *       - in: query
   *         name: periodo
   *         required: true
   *         description: "Periodo a consultar"
   *         schema: { type: integer }
   *     responses:
   *       200:
   *         description: Archivo Excel generado
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async exportarAnualizadoExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        cod_empleado: req.query['id_usuario'] as string,
        filtro: req.query['tipo'] as 'N' | 'P',
        codigo_nomina: parseInt(req.query['codigo_nomina'] as string, 10),
        periodo: parseInt(req.query['periodo'] as string, 10),
        centro_costo: '',
        area: '',
        activo: 1,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarAnualizadoExcel(
        conjunto,
        filtros,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="anualizado-${conjunto}.xlsx"`,
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error exportando Anualizado',
        error: err,
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/prestamos/excel/{conjunto}:
   *   get:
   *     summary: Exportar Préstamos a Excel
   *     tags: [Reportes Gestión de Nómina - Exportaciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema: { type: string }
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         description: "Código del empleado"
   *         schema: { type: string }
   *       - in: query
   *         name: num_nomina
   *         required: false
   *         description: "Número de nómina (detalle)"
   *         schema: { type: integer }
   *       - in: query
   *         name: numero_nomina
   *         required: false
   *         description: "Número de la nómina principal"
   *         schema: { type: integer }
   *       - in: query
   *         name: tipo_prestamo
   *         required: false
   *         description: "Tipo de préstamo"
   *         schema: { type: string }
   *       - in: query
   *         name: estado_prestamo
   *         required: false
   *         description: "Estado del préstamo"
   *         schema: { type: string }
   *       - in: query
   *         name: estado_empleado
   *         required: false
   *         description: "Estado del empleado"
   *         schema: { type: string }
   *       - in: query
   *         name: estado_cuota
   *         required: false
   *         description: "Estado de la cuota"
   *         schema: { type: string }
   *     responses:
   *       200:
   *         description: Archivo Excel generado
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async exportarPrestamosExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        cod_empleado: req.query['id_usuario'] as string,
        num_nomina: parseInt(req.query['num_nomina'] as string, 10),
        numero_nomina: parseInt(req.query['numero_nomina'] as string, 10),
        tipo_prestamo: req.query['tipo_prestamo'] as string,
        estado_prestamo: req.query['estado_prestamo'] as string,
        estado_empleado: req.query['estado_empleado'] as string,
        estado_cuota: req.query['estado_cuota'] as string,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarPrestamosExcel(
        conjunto,
        filtros,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="prestamos-${conjunto}.xlsx"`,
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error exportando Préstamos',
        error: err,
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/boleta-pago/excel/{conjunto}:
   *   get:
   *     summary: Exportar Boleta de Pago a Excel
   *     tags: [Reportes Gestión de Nómina - Exportaciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema:
   *           type: string
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         description: "Código del empleado"
   *         schema:
   *           type: string
   *       - in: query
   *         name: num_nomina
   *         required: true
   *         description: "Número de nómina"
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Archivo Excel generado
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async exportarBoletaDePagoExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        cod_empleado: req.query['id_usuario'] as string,
        num_nomina: parseInt(req.query['num_nomina'] as string, 10),
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarBoletaDePagoExcel(
        conjunto,
        filtros,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="boleta-${conjunto}.xlsx"`,
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error exportando Boleta de Pago',
        error: err,
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/prestamo-cta-cte/excel/{conjunto}:
   *   get:
   *     summary: Exportar Préstamo de Cuenta Corriente a Excel
   *     tags: [Reportes Gestión de Nómina - Exportaciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto"
   *         schema:
   *           type: string
   *       - in: query
   *         name: id_usuario
   *         required: true
   *         description: "Código del empleado"
   *         schema:
   *           type: string
   *       - in: query
   *         name: naturaleza
   *         required: false
   *         description: "Naturaleza del préstamo (por defecto 'C')"
   *         schema:
   *           type: string
   *           default: C
   *     responses:
   *       200:
   *         description: Archivo Excel generado
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async exportarPrestamoCtaCteExcel(
    req: Request,
    res: Response,
  ): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        cod_empleado: req.query['id_usuario'] as string,
        naturaleza: 'C',
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido',
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarPrestamoCtaCteExcel(
        conjunto,
        filtros,
      );
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="prestamo-cta-cte-${conjunto}.xlsx"`,
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Error exportando Préstamo Cta Cte',
        error: err,
      });
    }
  }
}
