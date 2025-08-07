import { Request, Response } from 'express';
import { IConjuntoService } from '../../domain/services/IConjuntoService';

export class ConjuntoController {
  constructor(private conjuntoService: IConjuntoService) {}

  async getAllConjuntos(req: Request, res: Response): Promise<void> {
    try {
      const conjuntos = await this.conjuntoService.getAllConjuntos();
      res.json({
        success: true,
        data: conjuntos,
        message: 'Conjuntos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ConjuntoController.getAllConjuntos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener conjuntos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getConjuntoByCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      
      if (!codigo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const conjunto = await this.conjuntoService.getConjuntoByCodigo(codigo);
      
      if (!conjunto) {
        res.status(404).json({
          success: false,
          message: 'Conjunto no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: conjunto,
        message: 'Conjunto obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error en ConjuntoController.getConjuntoByCodigo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener conjunto',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getConjuntosActivos(req: Request, res: Response): Promise<void> {
    try {
      const conjuntos = await this.conjuntoService.getConjuntosActivos();
      res.json({
        success: true,
        data: conjuntos,
        message: 'Conjuntos activos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ConjuntoController.getConjuntosActivos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener conjuntos activos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
