import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IMenuService } from '../../domain/services/IMenuService';
import { MenuCreate, MenuUpdate } from '../../domain/entities/Menu';

/**
 * @swagger
 * components:
 *   schemas:
 *     Menu:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         descripcion:
 *           type: string
 *         padreId:
 *           type: integer
 *           nullable: true
 *         icon:
 *           type: string
 *         ruta:
 *           type: string
 *         areaUsuaria:
 *           type: string
 *         sistemaCode:
 *           type: string
 *         routePath:
 *           type: string
 *         estado:
 *           type: boolean
 *         hijos:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Menu'
 *     MenuCreate:
 *       type: object
 *       required:
 *         - descripcion
 *       properties:
 *         descripcion:
 *           type: string
 *         padreId:
 *           type: integer
 *           nullable: true
 *         icon:
 *           type: string
 *         ruta:
 *           type: string
 *         areaUsuaria:
 *           type: string
 *         sistemaCode:
 *           type: string
 *         routePath:
 *           type: string
 *         estado:
 *           type: boolean
 *     MenuUpdate:
 *       type: object
 *       properties:
 *         descripcion:
 *           type: string
 *         padreId:
 *           type: integer
 *           nullable: true
 *         icon:
 *           type: string
 *         ruta:
 *           type: string
 *         areaUsuaria:
 *           type: string
 *         sistemaCode:
 *           type: string
 *         routePath:
 *           type: string
 *         estado:
 *           type: boolean
 */

@injectable()
export class MenuController {
  constructor(
    @inject('IMenuService') private menuService: IMenuService
  ) {}

  /**
   * @swagger
   * /api/menus:
   *   get:
   *     summary: Obtener todos los menús jerárquicos
   *     tags: [Menús]
   *     responses:
   *       200:
   *         description: Lista de menús obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Menu'
   *       500:
   *         description: Error interno del servidor
   */
  async getAllMenus(req: Request, res: Response): Promise<void> {
    try {
      const menus = await this.menuService.getAllMenus();
      res.json(menus);
    } catch (error) {
      console.error("Error al obtener el menú jerárquico:", error);
      res.status(500).json({ 
        message: "Error al obtener el árbol de menús",
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/menus/rol/{rolId}/sistema/{sistemaId}:
   *   get:
   *     summary: Obtener menús por rol y sistema
   *     tags: [Menús]
   *     parameters:
   *       - in: path
   *         name: rolId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del rol
   *       - in: path
   *         name: sistemaId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del sistema
   *     responses:
   *       200:
   *         description: Menús obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Menu'
   *       400:
   *         description: Parámetros inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async getMenusByRolAndSistema(req: Request, res: Response): Promise<void> {
    try {
      const { rolId, sistemaId } = req.params;

      if (!rolId || !sistemaId) {
        res.status(400).json({ 
          message: "rolId y sistemaId son requeridos" 
        });
        return;
      }

      const menus = await this.menuService.getMenusByRolAndSistema(parseInt(rolId), parseInt(sistemaId));
      res.json(menus);
    } catch (error) {
      console.error("Error al obtener menús por rol y sistema:", error);
      res.status(500).json({ message: "Error al obtener menús filtrados" });
    }
  }

  /**
   * @swagger
   * /api/menus/area/{area}:
   *   get:
   *     summary: Obtener menús por área usuaria
   *     tags: [Menús]
   *     parameters:
   *       - in: path
   *         name: area
   *         required: true
   *         schema:
   *           type: string
   *         description: Área usuaria
   *     responses:
   *       200:
   *         description: Menús obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Menu'
   *       400:
   *         description: Parámetro área requerido
   *       500:
   *         description: Error interno del servidor
   */
  async getMenusByArea(req: Request, res: Response): Promise<void> {
    try {
      const { area } = req.params;

      if (!area) {
        res.status(400).json({ 
          message: "El parámetro 'area' es requerido" 
        });
        return;
      }

      const menus = await this.menuService.getMenusByArea(area);
      res.json(menus);
    } catch (error) {
      console.error("Error al obtener menús por área:", error);
      res.status(500).json({ message: "Error al obtener menús por área" });
    }
  }

  /**
   * @swagger
   * /api/menus/sistema/{sistemaCode}:
   *   get:
   *     summary: Obtener menús por sistema
   *     tags: [Menús]
   *     parameters:
   *       - in: path
   *         name: sistemaCode
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del sistema
   *     responses:
   *       200:
   *         description: Menús obtenidos exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Menu'
   *       400:
   *         description: Parámetro sistemaCode requerido
   *       500:
   *         description: Error interno del servidor
   */
  async getMenusBySistema(req: Request, res: Response): Promise<void> {
    try {
      const { sistemaCode } = req.params;

      if (!sistemaCode) {
        res.status(400).json({ 
          message: "El parámetro 'sistemaCode' es requerido" 
        });
        return;
      }

      const menus = await this.menuService.getMenusBySistema(sistemaCode);
      res.json(menus);
    } catch (error) {
      console.error("Error al obtener menús por sistema:", error);
      res.status(500).json({ message: "Error al obtener menús por sistema" });
    }
  }

  /**
   * @swagger
   * /api/menus/poblar:
   *   post:
   *     summary: Poblar menús desde tabla de datos
   *     tags: [Menús]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       201:
   *         description: Menús poblados exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 menus:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Menu'
   *                 relaciones:
   *                   type: integer
   *       500:
   *         description: Error interno del servidor
   */
  async poblarMenusDesdeTabla(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.menuService.poblarMenusDesdeTabla();
      res.status(201).json(result);
    } catch (error) {
      console.error("Error al poblar menús:", error);
      res.status(500).json({ 
        message: "Error al poblar menús desde tabla", 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      });
    }
  }

  /**
   * @swagger
   * /api/menus:
   *   post:
   *     summary: Crear nuevo menú
   *     tags: [Menús]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MenuCreate'
   *     responses:
   *       201:
   *         description: Menú creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 menu:
   *                   $ref: '#/components/schemas/Menu'
   *       400:
   *         description: Datos inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async createMenu(req: Request, res: Response): Promise<void> {
    try {
      const menuData: MenuCreate = req.body;
      const menu = await this.menuService.createMenu(menuData);
      
      res.status(201).json({
        message: "Menú agregado exitosamente",
        menu
      });
    } catch (error) {
      console.error("Error al guardar el menú:", error);
      res.status(500).json({ message: "Error al guardar el menú" });
    }
  }

  /**
   * @swagger
   * /api/menus:
   *   put:
   *     summary: Actualizar menú
   *     tags: [Menús]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MenuUpdate'
   *     responses:
   *       200:
   *         description: Menú actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                 menu:
   *                   $ref: '#/components/schemas/Menu'
   *       400:
   *         description: Datos inválidos
   *       404:
   *         description: Menú no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async updateMenu(req: Request, res: Response): Promise<void> {
    try {
      const menuData: MenuUpdate = req.body;
      const menu = await this.menuService.updateMenu(menuData);
      
      res.json({
        message: "Menú actualizado correctamente",
        menu
      });
    } catch (error) {
      console.error("Error al actualizar el menú:", error);
      res.status(500).json({ message: "Error al actualizar el menú" });
    }
  }

  /**
   * @swagger
   * /api/menus/{id}:
   *   delete:
   *     summary: Eliminar menú
   *     tags: [Menús]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del menú
   *     responses:
   *       200:
   *         description: Menú eliminado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *       400:
   *         description: No se puede eliminar menú con submenús activos
   *       404:
   *         description: Menú no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async deleteMenu(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const success = await this.menuService.deleteMenu(id);
      
      if (!success) {
        res.status(404).json({ message: "Menú no encontrado" });
        return;
      }

      res.json({ message: "Menú desactivado correctamente" });
    } catch (error) {
      console.error("Error al desactivar el menú:", error);
      res.status(500).json({ message: "Error al desactivar el menú" });
    }
  }
} 