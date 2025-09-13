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
import { ExportarAccionesDePersonalExcelParams } from "../../domain/entities/ReporteGN";

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
 *     GNReporteAnualizadoCabecera:
 *       type: object
 *       properties:
 *         ESQUEMA:
 *           type: string
 *         CODIGO:
 *           type: string
 *         NOMINA:
 *           type: string
 *         EMPLEADO:
 *           type: string
 *         FECHA_INGRESO:
 *           type: string
 *         FECHA_SALIDA:
 *           type: string
 *         CENTRO_COSTO:
 *           type: string
 *         SEDE:
 *           type: string
 *         PUESTO:
 *           type: string
 *         ESSALUD:
 *           type: string
 *         AFP:
 *           type: string
 *         CUSPP:
 *           type: string
 *         ESTADO:
 *           type: string
 *     GNReporteAnualizadoDetalle:
 *       type: object
 *       properties:
 *         CODIGO:
 *           type: string
 *         TPCONCEP:
 *           type: string
 *         CONCEPTO:
 *           type: string
 *         DESCR:
 *           type: string
 *         COL1:
 *           type: number
 *         COL2:
 *           type: number
 *         COL3:
 *           type: number
 *         COL4:
 *           type: number
 *         COL5:
 *           type: number
 *         COL6:
 *           type: number
 *         COL7:
 *           type: number
 *         COL8:
 *           type: number
 *         COL9:
 *           type: number
 *         COL10:
 *           type: number
 *         COL11:
 *           type: number
 *         COL12:
 *           type: number
 *         TOTAL:
 *           type: number
 *
 */

@injectable()
export class ReporteGNController {
  constructor(
    @inject("IReporteGNService") private reporteGNService: IReporteGNService
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
   * /api/reporte-gn/anualizado/{conjunto}:
   *   get:
   *     summary: Obtener reporte anualizado con cabecera y detalle
   *     description: |
   *       Obtiene el reporte anualizado con información de cabecera y detalle según el tipo de reporte.
   *
   *       **Tipos de reporte:**
   *       - **N (Nómina)**: Genera reporte por período de nómina específico
   *       - **P (Período)**: Genera reporte por año específico
   *
   *       **Estructura de respuesta:**
   *       - **Cabecera**: Información del empleado (datos personales, puesto, centro de costo, etc.)
   *       - **Detalle**: Conceptos con valores mensuales (COL1-COL12) y total anual
   *
   *       El parámetro `conjunto` se usa directamente en las consultas SQL para identificar el esquema de la base de datos.
   *     tags: [Reportes Gestion de Nómina]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto de la base de datos"
   *         schema:
   *           type: string
   *           example: "FIDPLAN"
   *           pattern: "^[A-Z0-9_]+$"
   *       - in: query
   *         name: nomina
   *         required: true
   *         description: "Código de nómina a consultar"
   *         schema:
   *           type: string
   *           example: "E001"
   *           pattern: "^[A-Z0-9]+$"
   *       - in: query
   *         name: centro_costo
   *         required: false
   *         description: "Centro de costo (opcional, vacío para todos)"
   *         schema:
   *           type: string
   *           example: "01.02.10.01.03"
   *       - in: query
   *         name: area
   *         required: false
   *         description: "Área (opcional, vacío para todas)"
   *         schema:
   *           type: string
   *           example: "128"
   *       - in: query
   *         name: empleado
   *         required: true
   *         description: "Código del empleado a consultar"
   *         schema:
   *           type: string
   *           example: "10525894"
   *           pattern: "^[0-9]+$"
   *       - in: query
   *         name: activo
   *         required: false
   *         description: "Estado del empleado (1=Activo, 2=Inactivo)"
   *         schema:
   *           type: number
   *           enum: [1, 2]
   *           default: 2
   *       - in: query
   *         name: filtro
   *         required: true
   *         description: "Tipo de filtro para el reporte"
   *         schema:
   *           type: string
   *           enum: [N, P]
   *           example: "N"
   *       - in: query
   *         name: pernomi
   *         required: true
   *         description: "Período de nómina (para filtro N) o año (para filtro P)"
   *         schema:
   *           type: number
   *           example: 142
   *           minimum: 1
   *     responses:
   *       200:
   *         description: Reporte anualizado con cabecera y detalle generado exitosamente
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
   *                   example: "Reporte anualizado generado exitosamente"
   *                 data:
   *                   type: object
   *                   properties:
   *                     cabecera:
   *                       type: array
   *                       description: "Información de cabecera del empleado"
   *                       items:
   *                         $ref: '#/components/schemas/GNReporteAnualizadoCabecera'
   *                     detalle:
   *                       type: array
   *                       description: "Detalle de conceptos con valores mensuales"
   *                       items:
   *                         $ref: '#/components/schemas/GNReporteAnualizadoDetalle'
   *             example:
   *               success: true
   *               message: "Reporte anualizado generado exitosamente"
   *               data:
   *                 cabecera:
   *                   - ESQUEMA: "FIDPLAN"
   *                     CODIGO: "10525894"
   *                     NOMINA: "E001 - Empleados Tradicional"
   *                     EMPLEADO: "JARPI HUAMANCHA LAVINIA"
   *                     FECHA_INGRESO: "01/09/2006"
   *                     FECHA_SALIDA: ""
   *                     CENTRO_COSTO: "01.02.10.01.03 - Sede Callao"
   *                     SEDE: "128 - Callao"
   *                     PUESTO: "2549 - Jefe De Ventas"
   *                     ESSALUD: ""
   *                     AFP: "AFP PROFUTURO"
   *                     CUSPP: "580940LJHPM1"
   *                     ESTADO: "Activo"
   *                 detalle:
   *                   - CODIGO: "10525894"
   *                     TPCONCEP: "I"
   *                     CONCEPTO: "IAFA"
   *                     DESCR: "Asignacion Familiar Fija"
   *                     COL1: 93.00
   *                     COL2: 93.00
   *                     COL3: 93.00
   *                     COL4: 93.00
   *                     COL5: 93.00
   *                     COL6: 93.00
   *                     COL7: 93.00
   *                     COL8: 93.00
   *                     COL9: 0.00
   *                     COL10: 102.50
   *                     COL11: 102.50
   *                     COL12: 102.50
   *                     TOTAL: 1051.50
   *       400:
   *         description: Parámetros requeridos faltantes
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
   *                   example: "Los parámetros nomina, empleado, filtro y pernomi son requeridos"
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   *     examples:
   *       reporte_nomina:
   *         summary: Reporte por Nómina
   *         description: Ejemplo de consulta por período de nómina
   *         value:
   *           url: "/api/reporte-gn/anualizado/FIDPLAN?nomina=E001&empleado=10525894&filtro=N&pernomi=142"
   *       reporte_periodo:
   *         summary: Reporte por Período
   *         description: Ejemplo de consulta por año
   *         value:
   *           url: "/api/reporte-gn/anualizado/FIDPLAN?nomina=E001&empleado=10525894&filtro=P&pernomi=2020"
   */
  async getAnualizado(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { nomina, centro_costo, area, empleado, activo, filtro, pernomi } =
        req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      // Validar parámetros requeridos
      if (!nomina || !empleado || !filtro || !pernomi) {
        res.status(400).json({
          success: false,
          message:
            "Los parámetros nomina, empleado, filtro y pernomi son requeridos",
        });
        return;
      }

      const anualizado = await this.reporteGNService.getReporteAnualizado(
        conjunto,
        {
          nomina: nomina as string,
          centro_costo: (centro_costo as string) || "",
          area: (area as string) || "",
          empleado: empleado as string,
          activo: activo ? parseInt(activo as string) : 2,
          filtro: filtro as "N" | "P",
          pernomi: parseInt(pernomi as string),
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
      const { conjunto } = req.params;
      const { cta_cte } = req.query;

      console.log("🔍 [CONTROLLER] getPrestamoCtaCte - conjunto:", conjunto);
      console.log("🔍 [CONTROLLER] getPrestamoCtaCte - cta_cte:", cta_cte);

      const prestamoCtaCte = await this.reporteGNService.getPrestamoCtaCte(
        conjunto as string,
        {
          cod_empleado: cta_cte as string,
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
        cod_empleado: req.query["id_usuario"] as string,
        num_nomina: parseInt(req.query["num_nomina"] as string, 10),
        numero_nomina: parseInt(req.query["numero_nomina"] as string, 10),
        tipo_prestamo: req.query["tipo_prestamo"] as string,
        estado_prestamo: req.query["estado_prestamo"] as string,
        estado_empleado: req.query["estado_empleado"] as string,
        estado_cuota: req.query["estado_cuota"] as string,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const prestamos = await this.reporteGNService.getPrestamos(
        conjunto,
        filtros
      );
      res.json(prestamos);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error al obtener préstamos",
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
        cod_empleado: req.query["id_usuario"] as string,
        num_nomina: parseInt(req.query["num_nomina"] as string, 10),
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const boleta = await this.reporteGNService.getBoletaDePago(
        conjunto,
        filtros
      );
      res.json(boleta);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error al obtener boleta de pago",
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
    res: Response
  ): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        fecha_accion_inicio: req.query["fecha_accion_inicio"] as string,
        fecha_accion_fin: req.query["fecha_accion_fin"] as string,
        cod_empleado: req.query["id_usuario"] as string,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const buffer =
        await this.reporteGNService.exportarAccionesDePersonalExcel(
          conjunto,
          filtros
        );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="acciones-personal-${conjunto}.xlsx"`
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error exportando Acciones de Personal",
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
      const filtros = { cod_empleado: req.query["id_usuario"] as string };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarContratosExcel(
        conjunto,
        filtros
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="contratos-${conjunto}.xlsx"`
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error exportando Contratos",
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
    res: Response
  ): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        fecha_inicio: req.query["fecha_inicio"] as string,
        fecha_fin: req.query["fecha_fin"] as string,
        cod_empleado: req.query["id_usuario"] as string,
        pagina: parseInt(req.query["pagina"] as string, 10) || 1,
        registrosPorPagina:
          parseInt(req.query["registrosPorPagina"] as string, 10) || 1000,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarRolDeVacacionesExcel(
        conjunto,
        filtros
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="rol-vacaciones-${conjunto}.xlsx"`
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error exportando Rol de Vacaciones",
        error: err,
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-gn/anualizado/excel/{conjunto}:
   *   get:
   *     summary: Exportar reporte anualizado a Excel
   *     description: |
   *       Exporta el reporte anualizado con cabecera y detalle a un archivo Excel con dos hojas.
   *
   *       **Archivo Excel generado:**
   *       - **Hoja "Cabecera"**: Información del empleado (datos personales, puesto, centro de costo, etc.)
   *       - **Hoja "Detalle"**: Conceptos con valores mensuales (Ene, Feb, Mar, ..., Dic) y total anual
   *
   *       **Tipos de reporte:**
   *       - **N (Nómina)**: Genera reporte por período de nómina específico
   *       - **P (Período)**: Genera reporte por año específico
   *
   *       El parámetro `conjunto` se usa directamente en las consultas SQL para identificar el esquema de la base de datos.
   *     tags: [Reportes Gestión de Nómina - Exportaciones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Nombre del esquema/conjunto de la base de datos"
   *         schema:
   *           type: string
   *           example: "FIDPLAN"
   *           pattern: "^[A-Z0-9_]+$"
   *       - in: query
   *         name: nomina
   *         required: true
   *         description: "Código de nómina a consultar"
   *         schema:
   *           type: string
   *           example: "E001"
   *           pattern: "^[A-Z0-9]+$"
   *       - in: query
   *         name: centro_costo
   *         required: false
   *         description: "Centro de costo (opcional, vacío para todos)"
   *         schema:
   *           type: string
   *           example: "01.02.10.01.03"
   *       - in: query
   *         name: area
   *         required: false
   *         description: "Área (opcional, vacío para todas)"
   *         schema:
   *           type: string
   *           example: "128"
   *       - in: query
   *         name: empleado
   *         required: true
   *         description: "Código del empleado a consultar"
   *         schema:
   *           type: string
   *           example: "10525894"
   *           pattern: "^[0-9]+$"
   *       - in: query
   *         name: activo
   *         required: false
   *         description: "Estado del empleado (1=Activo, 2=Inactivo)"
   *         schema:
   *           type: number
   *           enum: [1, 2]
   *           default: 2
   *       - in: query
   *         name: filtro
   *         required: true
   *         description: "Tipo de filtro para el reporte"
   *         schema:
   *           type: string
   *           enum: [N, P]
   *           example: "N"
   *       - in: query
   *         name: pernomi
   *         required: true
   *         description: "Período de nómina (para filtro N) o año (para filtro P)"
   *         schema:
   *           type: number
   *           example: 142
   *           minimum: 1
   *     responses:
   *       200:
   *         description: Archivo Excel generado exitosamente con dos hojas (Cabecera y Detalle)
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *             example: "Archivo Excel con hojas 'Cabecera' y 'Detalle'"
   *       400:
   *         description: Parámetros requeridos faltantes
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
   *                   example: "Los parámetros nomina, empleado, filtro y pernomi son requeridos"
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   *     examples:
   *       exportar_nomina:
   *         summary: Exportar por Nómina
   *         description: Ejemplo de exportación por período de nómina
   *         value:
   *           url: "/api/reporte-gn/anualizado/excel/FIDPLAN?nomina=E001&empleado=10525894&filtro=N&pernomi=142"
   *       exportar_periodo:
   *         summary: Exportar por Período
   *         description: Ejemplo de exportación por año
   *         value:
   *           url: "/api/reporte-gn/anualizado/excel/FIDPLAN?nomina=E001&empleado=10525894&filtro=P&pernomi=2020"
   */
  async exportarAnualizadoExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { nomina, centro_costo, area, empleado, activo, filtro, pernomi } =
        req.query;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      // Validar parámetros requeridos
      if (!nomina || !empleado || !filtro || !pernomi) {
        res.status(400).json({
          success: false,
          message:
            "Los parámetros nomina, empleado, filtro y pernomi son requeridos",
        });
        return;
      }

      const filtros = {
        nomina: nomina as string,
        centro_costo: (centro_costo as string) || "",
        area: (area as string) || "",
        empleado: empleado as string,
        activo: activo ? parseInt(activo as string) : 2,
        filtro: filtro as "N" | "P",
        pernomi: parseInt(pernomi as string),
      };

      const buffer = await this.reporteGNService.exportarAnualizadoExcel(
        conjunto,
        filtros
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="anualizado-${conjunto}.xlsx"`
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error exportando Anualizado",
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
        cod_empleado: req.query["id_usuario"] as string,
        num_nomina: parseInt(req.query["num_nomina"] as string, 10),
        numero_nomina: parseInt(req.query["numero_nomina"] as string, 10),
        tipo_prestamo: req.query["tipo_prestamo"] as string,
        estado_prestamo: req.query["estado_prestamo"] as string,
        estado_empleado: req.query["estado_empleado"] as string,
        estado_cuota: req.query["estado_cuota"] as string,
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarPrestamosExcel(
        conjunto,
        filtros
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="prestamos-${conjunto}.xlsx"`
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error exportando Préstamos",
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
        cod_empleado: req.query["id_usuario"] as string,
        num_nomina: parseInt(req.query["num_nomina"] as string, 10),
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarBoletaDePagoExcel(
        conjunto,
        filtros
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="boleta-${conjunto}.xlsx"`
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error exportando Boleta de Pago",
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
    res: Response
  ): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = {
        cod_empleado: req.query["id_usuario"] as string,
        naturaleza: "C",
      };

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: "El parámetro conjunto es requerido",
        });
        return;
      }

      const buffer = await this.reporteGNService.exportarPrestamoCtaCteExcel(
        conjunto,
        filtros
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="prestamo-cta-cte-${conjunto}.xlsx"`
      );
      res.send(buffer);
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Error exportando Préstamo Cta Cte",
        error: err,
      });
    }
  }
}
