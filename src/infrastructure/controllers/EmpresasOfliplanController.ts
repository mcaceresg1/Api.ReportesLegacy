import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";
import { GetEmpresasOfliplanQuery } from "../../application/queries/empresas-ofliplan/GetEmpresasOfliplanQuery";
import { TYPES } from "../container/types";
import {
  EmpresaOfliplan,
  EmpresasOfliplanRequest,
  EmpresasOfliplanResponse,
} from "../../domain/entities/EmpresaOfliplan";

@injectable()
export class EmpresasOfliplanController {
  constructor(
    @inject(TYPES.ICommandBus) private readonly commandBus: ICommandBus,
    @inject(TYPES.IQueryBus) private readonly queryBus: IQueryBus
  ) {}

  /**
   * @swagger
   * /api/empresas-ofliplan:
   *   get:
   *     summary: Obtener lista de empresas OFIPLAN
   *     description: Obtiene la lista de empresas disponibles desde la tabla TMEMPR de la base de datos OFIPLAN
   *     tags: [Empresas OFIPLAN]
   *     responses:
   *       200:
   *         description: Lista de empresas obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       CO_EMPR:
   *                         type: string
   *                         description: Código de empresa
   *                         example: "01"
   *                       DE_NOMB:
   *                         type: string
   *                         description: Nombre de la empresa
   *                         example: "CIA.INM.INV.HISPANA"
   *                 message:
   *                   type: string
   *                   example: "Empresas obtenidas exitosamente"
   *       400:
   *         description: Error en la solicitud
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
   *                   example: "Error al obtener las empresas"
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
   *                   example: "Error interno del servidor"
   */
  async getEmpresas(req: Request, res: Response): Promise<void> {
    try {
      console.log(
        "🏢 [EMPRESAS OFLIPLAN] Iniciando consulta de empresas OFIPLAN"
      );

      const query = new GetEmpresasOfliplanQuery();
      const result = await this.queryBus.execute<
        GetEmpresasOfliplanQuery,
        EmpresasOfliplanResponse
      >(query);

      console.log("🏢 [EMPRESAS OFLIPLAN] Consulta completada:", {
        success: result.success,
        totalEmpresas: result.data?.length || 0,
      });

      res.status(200).json(result);
    } catch (error) {
      console.error("❌ [EMPRESAS OFLIPLAN] Error al obtener empresas:", error);

      const errorResponse: EmpresasOfliplanResponse = {
        success: false,
        data: [],
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
      };

      res.status(500).json(errorResponse);
    }
  }
}
