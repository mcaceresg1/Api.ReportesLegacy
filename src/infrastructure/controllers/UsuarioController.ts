import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IUsuarioService } from '../../domain/services/IUsuarioService';
import { UsuarioCreate, UsuarioUpdate } from '../../domain/entities/Usuario';

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         estado:
 *           type: boolean
 *         rolId:
 *           type: integer
 *         empresa:
 *           type: string
 *     UsuarioCreate:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *         - rolId
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         rolId:
 *           type: integer
 *         empresa:
 *           type: string
 *     UsuarioUpdate:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         rolId:
 *           type: integer
 *         empresa:
 *           type: string
 */

@injectable()
export class UsuarioController {
  constructor(
    @inject('IUsuarioService') private usuarioService: IUsuarioService
  ) {}

  /**
   * @swagger
   * /api/usuarios:
   *   get:
   *     summary: Obtener todos los usuarios
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuarios obtenida exitosamente
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
   *                     $ref: '#/components/schemas/Usuario'
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getAllUsuarios(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await this.usuarioService.getAllUsuarios();
      res.json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/usuarios/{id}:
   *   get:
   *     summary: Obtener usuario por ID
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del usuario
   *     responses:
   *       200:
   *         description: Usuario encontrado
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Usuario'
   *       404:
   *         description: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async getUsuarioById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const usuario = await this.usuarioService.getUsuarioById(id);
      
      if (!usuario) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: usuario
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/usuarios:
   *   post:
   *     summary: Crear nuevo usuario
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UsuarioCreate'
   *     responses:
   *       201:
   *         description: Usuario creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Usuario'
   *       400:
   *         description: Datos inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async createUsuario(req: Request, res: Response): Promise<void> {
    try {
      const usuarioData: UsuarioCreate = req.body;
      const usuario = await this.usuarioService.createUsuario(usuarioData);
      
      res.status(201).json({
        success: true,
        data: usuario
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error al crear usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/usuarios/{id}:
   *   put:
   *     summary: Actualizar usuario
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UsuarioUpdate'
   *     responses:
   *       200:
   *         description: Usuario actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Usuario'
   *       404:
   *         description: Usuario no encontrado
   *       400:
   *         description: Datos inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async updateUsuario(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔧 PUT /api/usuarios/:id - Iniciando actualización');
      console.log('📋 Parámetros:', req.params);
      console.log('📦 Body:', req.body);
      
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        console.error('❌ ID inválido:', req.params['id']);
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      
      console.log('🆔 ID del usuario a actualizar:', id);
      const usuarioData: UsuarioUpdate = req.body;
      console.log('📝 Datos a actualizar:', usuarioData);
      console.log('🏢 Campo empresa recibido:', usuarioData.empresa);
      
      const usuario = await this.usuarioService.updateUsuario(id, usuarioData);
      
      if (!usuario) {
        console.error('❌ Usuario no encontrado con ID:', id);
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      console.log('✅ Usuario actualizado exitosamente:', usuario);
      res.json({
        success: true,
        data: usuario
      });
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      res.status(400).json({
        success: false,
        message: 'Error al actualizar usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/usuarios/{id}:
   *   delete:
   *     summary: Eliminar usuario
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del usuario
   *     responses:
   *       200:
   *         description: Usuario eliminado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       404:
   *         description: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async deleteUsuario(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const success = await this.usuarioService.deleteUsuario(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Usuario eliminado correctamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/usuarios/{id}/activate:
   *   patch:
   *     summary: Activar usuario
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del usuario
   *     responses:
   *       200:
   *         description: Usuario activado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       404:
   *         description: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async activateUsuario(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const success = await this.usuarioService.activateUsuario(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Usuario activado correctamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al activar usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/usuarios/{id}/deactivate:
   *   patch:
   *     summary: Desactivar usuario
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del usuario
   *     responses:
   *       200:
   *         description: Usuario desactivado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       404:
   *         description: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async deactivateUsuario(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const success = await this.usuarioService.deactivateUsuario(id);
      
      if (!success) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Usuario desactivado correctamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al desactivar usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/usuarios-con-empresa:
   *   get:
   *     summary: Obtener usuarios con información de empresa
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuarios con empresa obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   id:
   *                     type: integer
   *                   username:
   *                     type: string
   *                   email:
   *                     type: string
   *                   estado:
   *                     type: boolean
   *                   rolId:
   *                     type: integer
   *                   empresa:
   *                     type: string
   *                   rol:
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       descripcion:
   *                         type: string
   *                       descripcion_completa:
   *                         type: string
   *                       estado:
   *                         type: boolean
   *       401:
   *         description: No autorizado
   *       500:
   *         description: Error interno del servidor
   */
  async getUsuariosConEmpresa(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await this.usuarioService.getUsuariosConEmpresa();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios con empresa',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/usuarios/{id}/cambiar-password:
   *   patch:
   *     summary: Cambiar contraseña de usuario
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del usuario
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - nuevaPassword
   *             properties:
   *               nuevaPassword:
   *                 type: string
   *                 description: Nueva contraseña del usuario
   *     responses:
   *       200:
   *         description: Contraseña cambiada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *       400:
   *         description: Datos inválidos
   *       404:
   *         description: Usuario no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async cambiarPassword(req: Request, res: Response): Promise<void> {
    try {
      console.log('🔧 PATCH /api/usuarios/:id/cambiar-password - Iniciando cambio de contraseña');
      console.log('📋 Parámetros:', req.params);
      console.log('📦 Body:', req.body);
      
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        console.error('❌ ID inválido:', req.params['id']);
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      
      const { nuevaPassword } = req.body;
      if (!nuevaPassword) {
        console.error('❌ Nueva contraseña no proporcionada');
        res.status(400).json({ 
          success: false,
          message: 'Nueva contraseña es requerida' 
        });
        return;
      }
      
      console.log('🆔 ID del usuario:', id);
      console.log('🔐 Nueva contraseña recibida');
      
      const success = await this.usuarioService.cambiarPassword(id, nuevaPassword);
      
      if (!success) {
        console.error('❌ Usuario no encontrado con ID:', id);
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }

      console.log('✅ Contraseña cambiada exitosamente para usuario ID:', id);
      res.json({
        success: true,
        message: 'Contraseña cambiada exitosamente'
      });
    } catch (error) {
      console.error('❌ Error al cambiar contraseña:', error);
      
      // Check if it's a validation error
      if (error instanceof Error && error.message.includes('Validación de contraseña fallida')) {
        res.status(400).json({
          success: false,
          message: 'Error de validación de contraseña',
          error: error.message
        });
        return;
      }
      
      res.status(500).json({
        success: false,
        message: 'Error al cambiar contraseña',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
} 