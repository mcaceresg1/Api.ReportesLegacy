import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { ITipoAsientoService } from '../../domain/services/ITipoAsientoService';
import { FiltrosTipoAsiento } from '../../domain/entities/TipoAsiento';
import { TipoAsientoResponse } from '../../domain/dto/TipoAsientoResponse';

@injectable()
export class TipoAsientoController {
  constructor(
    @inject('TipoAsientoService')
    private tipoAsientoService: ITipoAsientoService
  ) {}

  /**
   * @swagger
   * /api/tipos-asiento/{conjunto}:
   *   get:
   *     summary: Obtener tipos de asiento
   *     description: Obtiene la lista de tipos de asiento disponibles para un conjunto contable
   *     tags: [Tipos de Asiento]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto contable
   *       - in: query
   *         name: tipoAsiento
   *         schema:
   *           type: string
   *         description: Filtro por tipo de asiento (búsqueda parcial)
   *       - in: query
   *         name: descripcion
   *         schema:
   *           type: string
   *         description: Filtro por descripción (búsqueda parcial)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 1000
   *           default: 50
   *         description: Número máximo de registros a retornar
   *     responses:
   *       200:
   *         description: Tipos de asiento obtenidos exitosamente
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
   *                   example: "Tipos de asiento obtenidos exitosamente con 25 registros"
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/TipoAsiento'
   *                 totalRegistros:
   *                   type: integer
   *                   example: 25
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
   *                   example: "Error al obtener tipos de asiento: Error de conexión a la base de datos"
   */
  async obtenerTiposAsiento(req: Request, res: Response): Promise<void> {
    try {
      const conjunto = req.params['conjunto'];
      
      // Crear objeto de filtros solo con propiedades definidas
      const filtros: Partial<FiltrosTipoAsiento> = {};
      
      if (req.query['tipoAsiento']) {
        filtros.tipoAsiento = req.query['tipoAsiento'] as string;
      }
      
      if (req.query['descripcion']) {
        filtros.descripcion = req.query['descripcion'] as string;
      }
      
      if (req.query['limit']) {
        const limit = parseInt(req.query['limit'] as string);
        if (!isNaN(limit)) {
          filtros.limit = limit;
        }
      }

      console.log(`🚀 Controlador - Obteniendo tipos de asiento para conjunto: ${conjunto}`);
      console.log('📋 Filtros recibidos:', filtros);

      // Validar conjunto
      if (!conjunto) {
        const response: TipoAsientoResponse = {
          success: false,
          message: 'El conjunto es requerido'
        };
        res.status(400).json(response);
        return;
      }

      // Obtener tipos de asiento
      const resultado = await this.tipoAsientoService.obtenerTiposAsiento(conjunto, filtros);

      // Crear respuesta solo con propiedades definidas
      const response: TipoAsientoResponse = {
        success: true,
        message: `Tipos de asiento obtenidos exitosamente con ${resultado.length} registros`,
        data: resultado,
        totalRegistros: resultado.length,
        conjunto: conjunto
      };

      console.log(`✅ Controlador - Tipos de asiento enviados con ${resultado.length} registros`);
      res.status(200).json(response);

    } catch (error) {
      console.error('❌ Error en TipoAsientoController.obtenerTiposAsiento:', error);
      
      const response: TipoAsientoResponse = {
        success: false,
        message: `Error al obtener tipos de asiento: ${error instanceof Error ? error.message : 'Error desconocido'}`
      };
      
      res.status(500).json(response);
    }
  }
}


