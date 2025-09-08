import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IClipperLibroDiarioService } from '../../domain/services/IClipperLibroDiarioService';

/**
 * @swagger
 * tags:
 *   - name: Clipper - Libro Diario
 *     description: Endpoints del módulo de Libro Diario Contable
 */
@injectable()
export class ClipperLibroDiarioController {
  constructor(
    @inject('IClipperLibroDiarioService')
    private readonly clipperLibroDiarioService: IClipperLibroDiarioService
  ) {}

  /**
   * @swagger
   * /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes:
   *   get:
   *     summary: Listar comprobantes del libro diario
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna todos los comprobantes contables para un libro y mes determinado."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           example: "bdclipperGPC"
   *       - in: path
   *         name: libro
   *         required: true
   *         schema:
   *           type: string
   *           example: "D"
   *       - in: path
   *         name: mes
   *         required: true
   *         schema:
   *           type: string
   *           example: "08"
   *     responses:
   *       200: { description: Lista de comprobantes }
   *       400: { description: Parámetros inválidos }
   *       500: { description: Error interno }
   */
  async listarComprobantes(req: Request, res: Response): Promise<void> {
    const { bdClipperGPC, libro, mes } = req.params;

    if (!bdClipperGPC || !libro || !mes) {
      res.status(400).json({
        success: false,
        message: 'Parámetros bdClipperGPC, libro y mes son requeridos',
        data: [],
      });
      return;
    }

    try {
      const comprobantes = await this.clipperLibroDiarioService.listarComprobantes(libro, mes, bdClipperGPC);
      res.json({ success: true, message: 'Comprobantes obtenidos', data: comprobantes });
    } catch (error) {
      console.error('❌ Error en listarComprobantes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno',
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: [],
      });
    }
  }

  /**
   * @swagger
   * /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/comprobantes-agrupados:
   *   get:
   *     summary: Listar comprobantes agrupados por número
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna los comprobantes agrupados por número, con totales de debe y haber."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           example: "bdclipperGPC"
   *       - in: path
   *         name: libro
   *         required: true
   *         schema:
   *           type: string
   *           example: "D"
   *       - in: path
   *         name: mes
   *         required: true
   *         schema:
   *           type: string
   *           example: "08"
   *     responses:
   *       200: { description: Lista de comprobantes agrupados }
   *       400: { description: Parámetros inválidos }
   *       500: { description: Error interno }
   */
  async listarComprobantesAgrupados(req: Request, res: Response): Promise<void> {
    const { bdClipperGPC, libro, mes } = req.params;

    if (!bdClipperGPC || !libro || !mes) {
      res.status(400).json({
        success: false,
        message: 'Parámetros bdClipperGPC, libro y mes son requeridos',
        data: [],
      });
      return;
    }

    try {
      const agrupados = await this.clipperLibroDiarioService.listarComprobantesAgrupados(libro, mes, bdClipperGPC);
      res.json({ success: true, message: 'Comprobantes agrupados obtenidos', data: agrupados });
    } catch (error) {
      console.error('❌ Error en listarComprobantesAgrupados:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno',
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: [],
      });
    }
  }

  /**
   * @swagger
   * /api/libro-diario-clipper/{bdClipperGPC}/{libro}/{mes}/totales:
   *   get:
   *     summary: Obtener totales generales del libro diario
   *     tags: [Clipper - Libro Diario]
   *     description: "Retorna el total del debe y haber del libro diario."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           example: "bdclipperGPC"
   *       - in: path
   *         name: libro
   *         required: true
   *         schema:
   *           type: string
   *           example: "D"
   *       - in: path
   *         name: mes
   *         required: true
   *         schema:
   *           type: string
   *           example: "08"
   *     responses:
   *       200: { description: Totales obtenidos exitosamente }
   *       400: { description: Parámetros inválidos }
   *       500: { description: Error interno }
   */
  async obtenerTotalesGenerales(req: Request, res: Response): Promise<void> {
    const { bdClipperGPC, libro, mes } = req.params;

    if (!bdClipperGPC || !libro || !mes) {
      res.status(400).json({
        success: false,
        message: 'Parámetros bdClipperGPC, libro y mes son requeridos',
        data: null,
      });
      return;
    }

    try {
      const totales = await this.clipperLibroDiarioService.obtenerTotalesGenerales(libro, mes, bdClipperGPC);
      res.json({ success: true, message: 'Totales generales obtenidos', data: totales });
    } catch (error) {
      console.error('❌ Error en obtenerTotalesGenerales:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno',
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: null,
      });
    }
  }

  /**
   * @swagger
   * /api/libro-diario-clipper/{bdClipperGPC}/comprobante/{numeroComprobante}:
   *   get:
   *     summary: Obtener detalle de un comprobante
   *     tags: [Clipper - Libro Diario]
   *     description: "Devuelve el detalle de un comprobante contable específico (por ejemplo: 'D00/00001')."
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           example: "bdclipperGPC"
   *       - in: path
   *         name: numeroComprobante
   *         required: true
   *         schema:
   *           type: string
   *           example: "D00/00001"
   *     responses:
   *       200: { description: Detalle del comprobante obtenido exitosamente }
   *       400: { description: Parámetro inválido }
   *       404: { description: Comprobante no encontrado }
   *       500: { description: Error interno }
   */
  async obtenerDetalleComprobante(req: Request, res: Response): Promise<void> {
    const { bdClipperGPC, numeroComprobante } = req.params;

    if (!bdClipperGPC || !numeroComprobante) {
      res.status(400).json({
        success: false,
        message: 'Parámetros bdClipperGPC y número de comprobante son requeridos',
        data: null,
      });
      return;
    }
  
    try {
      const detalle = await this.clipperLibroDiarioService.obtenerDetalleComprobante(numeroComprobante, bdClipperGPC);
      if (!detalle || detalle.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Comprobante no encontrado',
          data: null,
        });
        return;
      }
      res.json({ success: true, message: 'Detalle comprobante obtenido', data: detalle });
    } catch (error) {
      console.error('❌ Error en obtenerDetalleComprobante:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno',
        error: error instanceof Error ? error.message : 'Error desconocido',
        data: null,
      });
    }
  }
  }
  