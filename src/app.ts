import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './infrastructure/config/swagger';
import { specs as specsDocker } from './infrastructure/config/swagger-docker';
import { container } from './infrastructure/container/container';
import { UsuarioRoutes } from './infrastructure/routes/UsuarioRoutes';
import { MenuRoutes } from './infrastructure/routes/MenuRoutes';
import { RolRoutes } from './infrastructure/routes/RolRoutes';
import { SistemaRoutes } from './infrastructure/routes/SistemaRoutes';
import { ConexionRoutes } from './infrastructure/routes/ConexionRoutes';
import { RolMenuRoutes } from './infrastructure/routes/RolMenuRoutes';
import { RolSistemaMenuRoutes } from './infrastructure/routes/RolSistemaMenuRoutes';
import { PermisoRoutes } from './infrastructure/routes/PermisoRoutes';
import { createConjuntoRoutes } from './infrastructure/routes/ConjuntoRoutes';
import { createExactusRoutes } from './infrastructure/routes/ExactusRoutes';

import { AuthMiddleware } from './infrastructure/middleware/AuthMiddleware';
import { QueryOptimizationMiddleware } from './infrastructure/middleware/QueryOptimizationMiddleware';
import { IUsuarioService } from './domain/services/IUsuarioService';
import { IAuthService } from './domain/services/IAuthService';
import { IRolService } from './domain/services/IRolService';
import { IRolSistemaMenuService } from './domain/services/IRolSistemaMenuService';
import { ISistemaService } from './domain/services/ISistemaService';
import { IMenuService } from './domain/services/IMenuService';
import { IConjuntoService } from './domain/services/IConjuntoService';
import { ICentroCostoRepository } from './domain/repositories/ICentroCostoRepository';
import { ICuentaContableRepository } from './domain/repositories/ICuentaContableRepository';
import { CqrsService } from './infrastructure/cqrs/CqrsService';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de optimización de consultas
app.use(QueryOptimizationMiddleware.performanceMonitor);
app.use(QueryOptimizationMiddleware.basicRateLimit);
app.use(QueryOptimizationMiddleware.addCacheHeaders);

// Swagger configuration
const swaggerSpecs = process.env['NODE_ENV'] === 'production' ? specsDocker : specs;
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Obtener servicios del contenedor
const usuarioService = container.get<IUsuarioService>('IUsuarioService');
const authService = container.get<IAuthService>('IAuthService');
const rolService = container.get<IRolService>('IRolService');
const rolSistemaMenuService = container.get<IRolSistemaMenuService>('IRolSistemaMenuService');
const authMiddleware = container.get<AuthMiddleware>('AuthMiddleware');
const sistemaService = container.get<ISistemaService>('ISistemaService');
const menuService = container.get<IMenuService>('IMenuService');
const conjuntoService = container.get<IConjuntoService>('IConjuntoService');
  const centroCostoRepository = container.get<ICentroCostoRepository>('ICentroCostoRepository');
const cuentaContableRepository = container.get<ICuentaContableRepository>('ICuentaContableRepository');

// Inicializar CQRS
const cqrsService = container.get<CqrsService>('CqrsService');

// Rutas
const usuarioRoutes = new UsuarioRoutes();
const menuRoutes = new MenuRoutes();
const rolRoutes = new RolRoutes();
const sistemaRoutes = new SistemaRoutes();
const conexionRoutes = new ConexionRoutes();
const rolMenuRoutes = new RolMenuRoutes();
const rolSistemaMenuRoutes = new RolSistemaMenuRoutes();
const permisoRoutes = new PermisoRoutes();

// Rutas de EXACTUS
const conjuntoRoutes = createConjuntoRoutes(conjuntoService);
const exactusRoutes = createExactusRoutes(centroCostoRepository, cuentaContableRepository);

// Rutas de menús (algunas públicas, otras protegidas)
app.use('/api/menus', menuRoutes.getRouter());

// Aplicar middleware de autenticación a rutas protegidas
app.use('/api/usuarios', authMiddleware.verifyToken, usuarioRoutes.getRouter());
app.use('/api/roles', authMiddleware.verifyToken, rolRoutes.getRouter());
app.use('/api/sistemas', authMiddleware.verifyToken, sistemaRoutes.getRouter());
app.use('/api/conexiones', authMiddleware.verifyToken, conexionRoutes.getRouter());
app.use('/api/rol-menu', authMiddleware.verifyToken, rolMenuRoutes.getRouter());
app.use('/api/rol-sistema-menu', authMiddleware.verifyToken, rolSistemaMenuRoutes.getRouter());
app.use('/api/permisos', authMiddleware.verifyToken, permisoRoutes.getRouter());

// Rutas de EXACTUS (solo lectura, sin autenticación)
app.use('/api/conjuntos', QueryOptimizationMiddleware.validateQueryParams, conjuntoRoutes);
app.use('/api/exactus', QueryOptimizationMiddleware.validateQueryParams, exactusRoutes);


// =================== ENDPOINTS ADICIONALES DEL PROYECTO JS ===================

// Endpoints de usuarios adicionales
app.get('/api/usuarios/con-roles', async (req, res) => {
  try {
    // TODO: Implementar lógica para obtener usuarios con roles
    res.json({ message: 'Endpoint usuarios con roles - pendiente de implementar' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener usuarios con roles',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.get('/api/usuarios/con-empresa', authMiddleware.verifyToken, async (req, res) => {
  try {
    // TODO: Implementar lógica para obtener usuarios con empresa
    res.json({ message: 'Endpoint usuarios con empresa - pendiente de implementar' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error al obtener usuarios con empresa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreate'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
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
 *         description: Error en los datos de entrada
 *       500:
 *         description: Error interno del servidor
 */
app.post('/api/usuarios/register', async (req, res) => {
  try {
    const usuarioData = req.body;
    const usuario = await usuarioService.createUsuario(usuarioData);
    res.status(201).json({
      success: true,
      data: usuario
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.patch('/api/usuarios/estado', authMiddleware.verifyToken, async (req, res) => {
  try {
    const { id, estado } = req.body;
    if (!id || estado === undefined) {
      res.status(400).json({
        success: false,
        message: 'ID y estado son requeridos'
      });
      return;
    }
    
    const success = estado ? 
      await usuarioService.activateUsuario(id) : 
      await usuarioService.deactivateUsuario(id);
    
    if (!success) {
      res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
      return;
    }
    
    res.json({
      success: true,
      message: `Usuario ${estado ? 'activado' : 'desactivado'} correctamente`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado del usuario',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @swagger
 * /api/roles/activos:
 *   get:
 *     summary: Obtener roles activos
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles activos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 *       500:
 *         description: Error interno del servidor
 */
// Endpoints de roles adicionales
app.get('/api/roles/activos', async (req, res) => {
  try {
    const roles = await rolService.getAllRoles();
    const rolesActivos = roles.filter(rol => rol.estado);
    res.json(rolesActivos);
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener roles activos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.get('/api/roles/:id/permisos', authMiddleware.verifyToken, async (req, res) => {
  try {
    const id = req.params['id'];
    if (!id) {
      res.status(400).json({
        success: false,
        message: 'ID de rol requerido'
      });
      return;
    }
    
    const rolId = parseInt(id);
    if (isNaN(rolId)) {
      res.status(400).json({
        success: false,
        message: 'ID de rol inválido'
      });
      return;
    }

    // Obtener todos los menús asignados al rol (sin filtrar por sistema por ahora)
    const menus = await rolSistemaMenuService.getMenusByRolAndSistema(rolId, 1); // Sistema por defecto
    
    res.json(menus);
  } catch (error) {
    console.error('Error al obtener permisos del rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener permisos del rol',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @swagger
 * /api/rol/{rolId}/permisos:
 *   get:
 *     summary: Obtener permisos de un rol específico
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Permisos del rol obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       400:
 *         description: ID de rol inválido
 *       500:
 *         description: Error interno del servidor
 */
app.get('/api/rol/:rolId/permisos', authMiddleware.verifyToken, async (req, res) => {
  try {
    const { rolId } = req.params;
    if (!rolId) {
      res.status(400).json({
        success: false,
        message: 'ID de rol requerido'
      });
      return;
    }
    
    const rolIdNum = parseInt(rolId);
    if (isNaN(rolIdNum)) {
      res.status(400).json({
        success: false,
        message: 'ID de rol inválido'
      });
      return;
    }

    // Obtener todos los permisos asignados al rol
    const permisos = await rolSistemaMenuService.getPermisosByRol(rolIdNum);
    
    res.json(permisos);
  } catch (error) {
    console.error('Error al obtener permisos del rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener permisos del rol',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

/**
 * @swagger
 * /api/rol/{rolId}/permisos-disponibles:
 *   get:
 *     summary: Obtener todos los permisos disponibles marcando los que están activos para un rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Permisos disponibles con marcado de activos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   descripcion:
 *                     type: string
 *                   routePath:
 *                     type: string
 *                   sistemaId:
 *                     type: integer
 *                   activo:
 *                     type: boolean
 *       400:
 *         description: ID de rol inválido
 *       500:
 *         description: Error interno del servidor
 */
app.get('/api/rol/:rolId/permisos-disponibles', authMiddleware.verifyToken, async (req, res) => {
  try {
    const { rolId } = req.params;
    if (!rolId) {
      res.status(400).json({
        success: false,
        message: 'ID de rol requerido'
      });
      return;
    }
    
    const rolIdNum = parseInt(rolId);
    if (isNaN(rolIdNum)) {
      res.status(400).json({
        success: false,
        message: 'ID de rol inválido'
      });
      return;
    }

    // Obtener todos los permisos disponibles con marcado de activos para el rol
    const permisosDisponibles = await rolSistemaMenuService.getPermisosDisponiblesConMarcado(rolIdNum);
    
    res.json(permisosDisponibles);
  } catch (error) {
    console.error('Error al obtener permisos disponibles del rol:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener permisos disponibles del rol',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.get('/api/roles/:id/menus', authMiddleware.verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    // TODO: Implementar lógica para obtener menús de un rol
    res.json({ message: 'Endpoint menús de rol - pendiente de implementar' });
  } catch (error) {
    res.status(500).json({
      message: 'Error al obtener menús del rol',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});



// Endpoints de debug/test
app.get('/api/test/usuarios', async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json({
      message: 'Prueba de usuarios completada',
      totalUsuarios: usuarios.length,
      usuarios: usuarios.slice(0, 3) // Solo mostrar los primeros 3
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error en prueba de usuarios',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.get('/api/debug/usuarios-empresa', async (req, res) => {
  try {
    // TODO: Implementar lógica de debug para usuarios con empresa
    res.json({ message: 'Debug usuarios empresa - pendiente de implementar' });
  } catch (error) {
    res.status(500).json({
      message: 'Error en debug usuarios empresa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Endpoint adicional para usuarios con empresa (coincide con proyecto JS)
app.get('/api/usuarios-con-empresa', authMiddleware.verifyToken, async (req, res) => {
  try {
    const usuarios = await usuarioService.getUsuariosConEmpresa();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios con empresa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Endpoint público para usuarios con empresa (sin autenticación)
app.get('/api/usuarios-con-empresa-public', async (req, res) => {
  try {
    const usuarios = await usuarioService.getUsuariosConEmpresa();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios con empresa',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Endpoint público para sistemas (sin autenticación)
app.get('/api/sistemas-public', async (req, res) => {
  try {
    const sistemas = await sistemaService.getAllSistemas();
    res.json(sistemas);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener sistemas',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Endpoint público para menús (sin autenticación)
app.get('/api/menus-public', async (req, res) => {
  try {
    const menus = await menuService.getAllMenus();
    res.json(menus);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener menús',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Endpoint público para roles activos (sin autenticación)
app.get('/api/roles-activos-public', async (req, res) => {
  try {
    const roles = await rolService.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener roles activos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Endpoints públicos para funcionalidades de sistemas
app.get('/api/sistemas/:sistemaId/usuarios-public', async (req, res) => {
  try {
    const { sistemaId } = req.params;
    const usuarios = await sistemaService.getUsuariosPorSistema(parseInt(sistemaId));
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios del sistema',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.get('/api/sistemas/:sistemaId/permisos-public', async (req, res) => {
  try {
    const { sistemaId } = req.params;
    const permisos = await sistemaService.getPermisosSistema(parseInt(sistemaId));
    res.json(permisos);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener permisos del sistema',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

app.get('/api/sistemas/:sistemaId/estadisticas-public', async (req, res) => {
  try {
    const { sistemaId } = req.params;
    const estadisticas = await sistemaService.getEstadisticasSistema(parseInt(sistemaId));
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas del sistema',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API Reportes Legacy - TypeScript',
    version: '1.0.0',
    docs: '/api-docs',
    endpoints: {
      auth: '/api/login',
      usuarios: '/api/usuarios',
      menus: '/api/menus',
      roles: '/api/roles',
      sistemas: '/api/sistemas',
      conexiones: '/api/conexiones',
      permisos: '/api/permisos'
    }
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             usuario:
 *               $ref: '#/components/schemas/Usuario'
 *             token:
 *               type: string
 */
app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: 'Username y password son requeridos'
      });
      return;
    }
    
    const result = await authService.login({ username, password });
    res.json({
      success: true,
      data: {
        token: result.token,
        usuario: result.usuario
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(401).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error de autenticación'
    });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autenticar usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Faltan campos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar estado del servidor
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Globalis API'
  });
});

// Middleware de manejo de errores
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env['NODE_ENV'] === 'development' ? err.message : 'Error interno'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

export default app; 