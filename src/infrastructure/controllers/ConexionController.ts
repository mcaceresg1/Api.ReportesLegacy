import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IConexionService } from '../../domain/services/IConexionService';
import { ConexionCreate, ConexionUpdate } from '../../domain/entities/Conexion';

/**
 * @swagger
 * components:
 *   schemas:
 *     Conexion:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         servidor:
 *           type: string
 *         puerto:
 *           type: integer
 *         baseDatos:
 *           type: string
 *         usuario:
 *           type: string
 *         password:
 *           type: string
 *         estado:
 *           type: boolean
 *     ConexionCreate:
 *       type: object
 *       required:
 *         - nombre
 *         - servidor
 *         - baseDatos
 *         - usuario
 *         - password
 *       properties:
 *         nombre:
 *           type: string
 *         servidor:
 *           type: string
 *         puerto:
 *           type: integer
 *         baseDatos:
 *           type: string
 *         usuario:
 *           type: string
 *         password:
 *           type: string
 *         estado:
 *           type: boolean
 *     ConexionUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         nombre:
 *           type: string
 *         servidor:
 *           type: string
 *         puerto:
 *           type: integer
 *         baseDatos:
 *           type: string
 *         usuario:
 *           type: string
 *         password:
 *           type: string
 *         estado:
 *           type: boolean
 */

@injectable()
export class ConexionController {
  constructor(
    @inject('IConexionService') private conexionService: IConexionService
  ) {}

  /**
   * @swagger
   * /api/conexiones:
   *   get:
   *     summary: Obtener todas las conexiones
   *     tags: [Conexiones]
   *     responses:
   *       200:
   *         description: Lista de conexiones obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Conexion'
   *       500:
   *         description: Error interno del servidor
   */
  async getAllConexiones(req: Request, res: Response): Promise<void> {
    try {
      const conexiones = await this.conexionService.getAllConexiones();
      res.json(conexiones);
    } catch (error) {
      console.error("Error al obtener conexiones:", error);
      res.status(500).json({ 
        message: "Error al obtener conexiones",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/conexiones/{id}:
   *   get:
   *     summary: Obtener conexión por ID
   *     tags: [Conexiones]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la conexión
   *     responses:
   *       200:
   *         description: Conexión encontrada
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Conexion'
   *       404:
   *         description: Conexión no encontrada
   *       500:
   *         description: Error interno del servidor
   */
  async getConexionById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const conexion = await this.conexionService.getConexionById(parseInt(id));

      if (!conexion) {
        res.status(404).json({ message: "No encontrado" });
        return;
      }

      res.json(conexion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al buscar la conexión" });
    }
  }

  /**
   * @swagger
   * /api/conexiones:
   *   post:
   *     summary: Crear nueva conexión
   *     tags: [Conexiones]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ConexionCreate'
   *     responses:
   *       201:
   *         description: Conexión creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       500:
   *         description: Error interno del servidor
   */
  async createConexion(req: Request, res: Response): Promise<void> {
    try {
      const conexionData: ConexionCreate = req.body;
      await this.conexionService.createConexion(conexionData);
      res.status(201).json({ message: "Conexión agregada exitosamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al guardar la conexión" });
    }
  }

  /**
   * @swagger
   * /api/conexiones:
   *   put:
   *     summary: Actualizar conexión
   *     tags: [Conexiones]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ConexionUpdate'
   *     responses:
   *       200:
   *         description: Conexión actualizada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 dato:
   *                   $ref: '#/components/schemas/Conexion'
   *       400:
   *         description: ID requerido
   *       404:
   *         description: Conexión no encontrada
   *       500:
   *         description: Error interno del servidor
   */
  async updateConexion(req: Request, res: Response): Promise<void> {
    try {
      const conexionData: ConexionUpdate = req.body;
      const conexion = await this.conexionService.updateConexion(conexionData);
      
      res.json({ 
        message: "Conexión actualizada correctamente", 
        dato: conexion 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al actualizar la conexión" });
    }
  }

  /**
   * @swagger
   * /api/conexiones/{id}:
   *   delete:
   *     summary: Eliminar conexión
   *     tags: [Conexiones]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID de la conexión
   *     responses:
   *       200:
   *         description: Conexión eliminada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       404:
   *         description: Conexión no encontrada
   *       500:
   *         description: Error interno del servidor
   */
  async deleteConexion(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.conexionService.deleteConexion(parseInt(id));

      if (!success) {
        res.status(404).json({ message: "No encontrado" });
        return;
      }

      res.json({ message: "Conexión eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al eliminar la conexion" });
    }
  }
} 