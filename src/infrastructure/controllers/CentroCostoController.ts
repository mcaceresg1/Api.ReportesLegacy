import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ICentroCostoService } from '../../domain/services/ICentroCostoService';
import { CentroCostoCreate, CentroCostoUpdate, CentroCostoFilter } from '../../domain/entities/CentroCosto';

@injectable()
export class CentroCostoController {
  constructor(
    @inject('ICentroCostoService') private centroCostoService: ICentroCostoService
  ) {}

  /**
   * @swagger
   * /api/centros-costos:
   *   get:
   *     summary: Obtener todos los centros de costo
   *     tags: [Centros de Costo]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de centros de costo
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/CentroCosto'
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getAllCentrosCostos(req: Request, res: Response): Promise<void> {
    try {
      const centrosCostos = await this.centroCostoService.getAllCentrosCostos();
      res.json(centrosCostos);
    } catch (error) {
      console.error('Error obteniendo centros de costo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * @swagger
   * /api/centros-costos/{id}:
   *   get:
   *     summary: Obtener un centro de costo por ID
   *     tags: [Centros de Costo]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del centro de costo
   *     responses:
   *       200:
   *         description: Centro de costo encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CentroCosto'
   *       404:
   *         description: Centro de costo no encontrado
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getCentroCostoById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const centroCosto = await this.centroCostoService.getCentroCostoById(id);
      
      if (!centroCosto) {
        res.status(404).json({ error: 'Centro de costo no encontrado' });
        return;
      }
      
      res.json(centroCosto);
    } catch (error) {
      console.error('Error obteniendo centro de costo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * @swagger
   * /api/centros-costos/filter:
   *   post:
   *     summary: Filtrar centros de costo
   *     tags: [Centros de Costo]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               codigo:
   *                 type: string
   *               descripcion:
   *                 type: string
   *               activo:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Centros de costo filtrados
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/CentroCosto'
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getCentrosCostosByFilter(req: Request, res: Response): Promise<void> {
    try {
      const filter: CentroCostoFilter = req.body;
      const centrosCostos = await this.centroCostoService.getCentrosCostosByFilter(filter);
      res.json(centrosCostos);
    } catch (error) {
      console.error('Error filtrando centros de costo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * @swagger
   * /api/centros-costos:
   *   post:
   *     summary: Crear un nuevo centro de costo
   *     tags: [Centros de Costo]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - codigo
   *               - descripcion
   *             properties:
   *               codigo:
   *                 type: string
   *                 maxLength: 20
   *               descripcion:
   *                 type: string
   *                 maxLength: 100
   *               activo:
   *                 type: boolean
   *                 default: true
   *     responses:
   *       201:
   *         description: Centro de costo creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CentroCosto'
   *       400:
   *         description: Datos inválidos
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async createCentroCosto(req: Request, res: Response): Promise<void> {
    try {
      const centroCostoData: CentroCostoCreate = req.body;
      const centroCosto = await this.centroCostoService.createCentroCosto(centroCostoData);
      res.status(201).json(centroCosto);
    } catch (error) {
      console.error('Error creando centro de costo:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  /**
   * @swagger
   * /api/centros-costos/{id}:
   *   put:
   *     summary: Actualizar un centro de costo
   *     tags: [Centros de Costo]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del centro de costo
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               codigo:
   *                 type: string
   *                 maxLength: 20
   *               descripcion:
   *                 type: string
   *                 maxLength: 100
   *               activo:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Centro de costo actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CentroCosto'
   *       400:
   *         description: Datos inválidos
   *       404:
   *         description: Centro de costo no encontrado
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async updateCentroCosto(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const centroCostoData: CentroCostoUpdate = { ...req.body, id };
      const centroCosto = await this.centroCostoService.updateCentroCosto(centroCostoData);
      res.json(centroCosto);
    } catch (error) {
      console.error('Error actualizando centro de costo:', error);
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error interno del servidor' });
      }
    }
  }

  /**
   * @swagger
   * /api/centros-costos/{id}:
   *   delete:
   *     summary: Eliminar un centro de costo
   *     tags: [Centros de Costo]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del centro de costo
   *     responses:
   *       200:
   *         description: Centro de costo eliminado exitosamente
   *       404:
   *         description: Centro de costo no encontrado
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async deleteCentroCosto(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const success = await this.centroCostoService.deleteCentroCosto(id);
      
      if (!success) {
        res.status(404).json({ error: 'Centro de costo no encontrado' });
        return;
      }
      
      res.json({ message: 'Centro de costo eliminado exitosamente' });
    } catch (error) {
      console.error('Error eliminando centro de costo:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * @swagger
   * /api/centros-costos/codigo/{codigo}:
   *   get:
   *     summary: Obtener un centro de costo por código
   *     tags: [Centros de Costo]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: codigo
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del centro de costo
   *     responses:
   *       200:
   *         description: Centro de costo encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CentroCosto'
   *       404:
   *         description: Centro de costo no encontrado
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getCentroCostoByCodigo(req: Request, res: Response): Promise<void> {
    try {
      const codigo = req.params['codigo'] || '';
      if (!codigo) {
        res.status(400).json({ error: 'Código requerido' });
        return;
      }
      const centroCosto = await this.centroCostoService.getCentroCostoByCodigo(codigo);
      
      if (!centroCosto) {
        res.status(404).json({ error: 'Centro de costo no encontrado' });
        return;
      }
      
      res.json(centroCosto);
    } catch (error) {
      console.error('Error obteniendo centro de costo por código:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  /**
   * @swagger
   * /api/centros-costos/activos:
   *   get:
   *     summary: Obtener todos los centros de costo activos
   *     tags: [Centros de Costo]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de centros de costo activos
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/CentroCosto'
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getCentrosCostosActivos(req: Request, res: Response): Promise<void> {
    try {
      const centrosCostos = await this.centroCostoService.getCentrosCostosActivos();
      res.json(centrosCostos);
    } catch (error) {
      console.error('Error obteniendo centros de costo activos:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
} 