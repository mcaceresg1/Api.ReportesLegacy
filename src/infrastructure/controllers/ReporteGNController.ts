import { injectable, inject } from "inversify";
import { Request, Response } from "express";
import { IUsuarioService } from "../../domain/services/IUsuarioService";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { UsuarioCreate, UsuarioUpdate } from "../../domain/entities/Usuario";
import { CreateUsuarioCommand } from "../../application/commands/usuario/CreateUsuarioCommand";
import { UpdateUsuarioCommand } from "../../application/commands/usuario/UpdateUsuarioCommand";
import { DeleteUsuarioCommand } from "../../application/commands/usuario/DeleteUsuarioCommand";
import { GetAllUsuariosQuery } from "../../application/queries/usuario/GetAllUsuariosQuery";
import { GetUsuarioByIdQuery } from "../../application/queries/usuario/GetUsuarioByIdQuery";
import { IReporteGNService } from "../../domain/services/IReporteGNService";

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
    @inject("IReporteGNService") private reporteGNService: IReporteGNService
  ) {}

  /**
   * @swagger
   * /api/reporte-gn/acciones-de-personal:
   *   get:
   *     summary: Obtener todas las acciones de personal
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
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
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const acciones = await this.reporteGNService.getAccionesDePersonal(
        conjunto,
        {
          fecha_accion_inicio: fecha_accion_inicio as string,
          fecha_accion_fin: fecha_accion_fin as string,
          cod_empleado: id_usuario as string,
        }
      );
      res.json({
        success: acciones?.success,
        data: acciones?.data,
        message: acciones?.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener acciones de personal.",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/contratos:
   *   get:
   *     summary: Obtener todos los contratos
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
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
          message: "El parámetro conjunto es requerido",
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
        message: "Error al obtener contratos.",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/rol-de-vacaciones:
   *   get:
   *     summary: Obtener el rol de vacaciones
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
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
          message: "El parámetro conjunto es requerido",
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
        }
      );
      res.json({
        success: rolDeVacaciones?.success,
        data: rolDeVacaciones,
        message: rolDeVacaciones?.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener rol de vacaciones.",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/anualizado:
   *   get:
   *     summary: Obtener el anualizado
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
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
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const anualizado = await this.reporteGNService.getReporteAnualizado(
        conjunto,
        {
          cod_empleado: id_usuario as string,
          filtro: tipo as "N" | "P",
          codigo_nomina: codigo_nomina as unknown as number,
          periodo: periodo as unknown as number,
          centro_costo: "",
          area: "",
          activo: 1,
        }
      );
      res.json({
        success: anualizado?.success,
        data: anualizado?.data,
        message: anualizado?.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener anualizado.",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/prestamo-cta-cte:
   *   get:
   *     summary: Obtener el prestamo de cuenta corriente
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
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
          naturaleza: "C",
        }
      );
      res.json({
        success: prestamoCtaCte?.success,
        data: prestamoCtaCte?.data,
        message: prestamoCtaCte?.message,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener prestamo de cuenta corriente.",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
