import { Request, Response } from 'express';
import { ICentroCostoRepository } from '../../domain/repositories/ICentroCostoRepository';
import { ICuentaContableRepository } from '../../domain/repositories/ICuentaContableRepository';

/**
 * @swagger
 * components:
 *   schemas:
 *     CentroCosto:
 *       type: object
 *       properties:
 *         CENTRO_COSTO:
 *           type: string
 *           description: Código del centro de costo
 *         DESCRIPCION:
 *           type: string
 *           description: Descripción del centro de costo
 *         ACEPTA_DATOS:
 *           type: boolean
 *           description: Indica si acepta datos
 *         TIPO:
 *           type: string
 *           description: Tipo de centro de costo
 *         NoteExistsFlag:
 *           type: integer
 *           description: Flag de existencia de nota
 *         RecordDate:
 *           type: string
 *           format: date-time
 *           description: Fecha del registro
 *         RowPointer:
 *           type: string
 *           description: Puntero de fila
 *         CreatedBy:
 *           type: string
 *           description: Creado por
 *         UpdatedBy:
 *           type: string
 *           description: Actualizado por
 *         CreateDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *     CuentaContable:
 *       type: object
 *       properties:
 *         CUENTA_CONTABLE:
 *           type: string
 *           description: Código de la cuenta contable
 *         SECCION_CUENTA:
 *           type: string
 *           description: Sección de la cuenta
 *         UNIDAD:
 *           type: string
 *           description: Unidad
 *         DESCRIPCION:
 *           type: string
 *           description: Descripción de la cuenta
 *         TIPO:
 *           type: string
 *           description: Tipo de cuenta
 *         TIPO_DETALLADO:
 *           type: string
 *           description: Tipo detallado
 *         TIPO_OAF:
 *           type: string
 *           description: Tipo OAF
 *         SALDO_NORMAL:
 *           type: string
 *           description: Saldo normal
 *         CONVERSION:
 *           type: string
 *           description: Conversión
 *         TIPO_CAMBIO:
 *           type: string
 *           description: Tipo de cambio
 *         ACEPTA_DATOS:
 *           type: boolean
 *           description: Indica si acepta datos
 *         CONSOLIDA:
 *           type: boolean
 *           description: Indica si consolida
 *         USA_CENTRO_COSTO:
 *           type: boolean
 *           description: Indica si usa centro de costo
 *         NOTAS:
 *           type: string
 *           description: Notas
 *         USUARIO:
 *           type: string
 *           description: Usuario
 *         FECHA_HORA:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora
 *         USUARIO_ULT_MOD:
 *           type: string
 *           description: Usuario de última modificación
 *         FCH_HORA_ULT_MOD:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de última modificación
 *         ACEPTA_UNIDADES:
 *           type: boolean
 *           description: Indica si acepta unidades
 *         USO_RESTRINGIDO:
 *           type: boolean
 *           description: Indica si tiene uso restringido
 *         ORIGEN_CONVERSION:
 *           type: string
 *           description: Origen de conversión
 *         NoteExistsFlag:
 *           type: integer
 *           description: Flag de existencia de nota
 *         RecordDate:
 *           type: string
 *           format: date-time
 *           description: Fecha del registro
 *         RowPointer:
 *           type: string
 *           description: Puntero de fila
 *         CreatedBy:
 *           type: string
 *           description: Creado por
 *         UpdatedBy:
 *           type: string
 *           description: Actualizado por
 *         CreateDate:
 *           type: string
 *           format: date-time
 *           description: Fecha de creación
 *         RUBRO_FLUJO_DEBITO:
 *           type: string
 *           description: Rubro flujo débito
 *         RUBRO_FLUJO_CREDITO:
 *           type: string
 *           description: Rubro flujo crédito
 *         INCLUIR_REP_CP:
 *           type: boolean
 *           description: Indica si incluir en reporte CP
 *         INCLUIR_REP_CB:
 *           type: boolean
 *           description: Indica si incluir en reporte CB
 *         ENTIDAD_FINANCIERA_CB:
 *           type: string
 *           description: Entidad financiera CB
 *         INCLUIR_REP_CC:
 *           type: boolean
 *           description: Indica si incluir en reporte CC
 *         VALIDA_PRESUP_CR:
 *           type: boolean
 *           description: Indica si valida presupuesto CR
 *         CUENTA_PDT:
 *           type: string
 *           description: Cuenta PDT
 *         PARTE_SIGNIFICATIVA_PDT:
 *           type: string
 *           description: Parte significativa PDT
 *         CUENTA_IFRS:
 *           type: string
 *           description: Cuenta IFRS
 *         USA_CONTA_ELECTRO:
 *           type: boolean
 *           description: Indica si usa contabilidad electrónica
 *         VERSION:
 *           type: string
 *           description: Versión
 *         FECHA_INI_CE:
 *           type: string
 *           format: date-time
 *           description: Fecha inicio contabilidad electrónica
 *         FECHA_FIN_CE:
 *           type: string
 *           format: date-time
 *           description: Fecha fin contabilidad electrónica
 *         COD_AGRUPADOR:
 *           type: string
 *           description: Código agrupador
 *         DESC_COD_AGRUP:
 *           type: string
 *           description: Descripción código agrupador
 *         SUB_CTA_DE:
 *           type: string
 *           description: Subcuenta de
 *         DESC_SUB_CTA:
 *           type: string
 *           description: Descripción subcuenta
 *         NIVEL:
 *           type: integer
 *           description: Nivel
 *         MANEJA_TERCERO:
 *           type: boolean
 *           description: Indica si maneja tercero
 *         DESCRIPCION_IFRS:
 *           type: string
 *           description: Descripción IFRS
 */

export class ExactusController {
  constructor(
    private centroCostoRepository: ICentroCostoRepository,
    private cuentaContableRepository: ICuentaContableRepository
  ) {}

  /**
   * @swagger
   * /api/exactus/{conjunto}/centros-costo:
   *   get:
   *     summary: Obtener centros de costo por conjunto
   *     description: Retorna todos los centros de costo de un conjunto específico
   *     tags: [Exactus - Centros Costo]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Número máximo de registros a retornar
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Número de registros a omitir
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *     responses:
   *       200:
   *         description: Centros de costo obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/CentroCosto'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 100
   *                     offset:
   *                       type: integer
   *                       example: 0
   *                     total:
   *                       type: integer
   *                       example: 150
   *                     totalPages:
   *                       type: integer
   *                       example: 2
   *                 message:
   *                   type: string
   *                   example: Centros de costo obtenidos exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Código de conjunto es requerido
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
   *                   example: Error al obtener centros de costo
   */
  async getCentrosCostoByConjunto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const limit = parseInt(req.query["limit"] as string) || 100;
      const offset = parseInt(req.query["offset"] as string) || 0;
      const page = parseInt(req.query["page"] as string) || 1;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedOffset = Math.max(offset, 0);

      const [centrosCosto, totalCount] = await Promise.all([
        this.centroCostoRepository.getCentrosCostoByConjunto(conjunto, validatedLimit, validatedOffset),
        this.centroCostoRepository.getCentrosCostoByConjuntoCount(conjunto)
      ]);
      
      res.json({
        success: true,
        data: centrosCosto,
        pagination: {
          page,
          limit: validatedLimit,
          offset: validatedOffset,
          total: totalCount,
          totalPages: Math.ceil(totalCount / validatedLimit)
        },
        message: 'Centros de costo obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentrosCostoByConjunto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centros de costo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/centros-costo/{codigo}:
   *   get:
   *     summary: Obtener centro de costo por código
   *     description: Retorna un centro de costo específico por su código
   *     tags: [Exactus - Centros Costo]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: path
   *         name: codigo
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del centro de costo
   *     responses:
   *       200:
   *         description: Centro de costo obtenido exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/CentroCosto'
   *                 message:
   *                   type: string
   *                   example: Centro de costo obtenido exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Código de conjunto y código de centro son requeridos
   *       404:
   *         description: Centro de costo no encontrado
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
   *                   example: Centro de costo no encontrado
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
   *                   example: Error al obtener centro de costo
   */
  async getCentroCostoByCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, codigo } = req.params;
      
      if (!conjunto || !codigo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y código de centro son requeridos'
        });
        return;
      }

      const centroCosto = await this.centroCostoRepository.getCentroCostoByCodigo(conjunto, codigo);
      
      if (!centroCosto) {
        res.status(404).json({
          success: false,
          message: 'Centro de costo no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: centroCosto,
        message: 'Centro de costo obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentroCostoByCodigo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centro de costo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/centros-costo/tipo/{tipo}:
   *   get:
   *     summary: Obtener centros de costo por tipo
   *     description: Retorna todos los centros de costo de un tipo específico
   *     tags: [Exactus - Centros Costo]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: path
   *         name: tipo
   *         required: true
   *         schema:
   *           type: string
   *         description: Tipo de centro de costo
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Número máximo de registros a retornar
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Número de registros a omitir
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *     responses:
   *       200:
   *         description: Centros de costo obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/CentroCosto'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 100
   *                     offset:
   *                       type: integer
   *                       example: 0
   *                     total:
   *                       type: integer
   *                       example: 50
   *                     totalPages:
   *                       type: integer
   *                       example: 1
   *                 message:
   *                   type: string
   *                   example: Centros de costo obtenidos exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Código de conjunto y tipo son requeridos
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
   *                   example: Error al obtener centros de costo
   */
  async getCentrosCostoByTipo(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, tipo } = req.params;
      const limit = parseInt(req.query["limit"] as string) || 100;
      const offset = parseInt(req.query["offset"] as string) || 0;
      const page = parseInt(req.query["page"] as string) || 1;
      
      if (!conjunto || !tipo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y tipo son requeridos'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedOffset = Math.max(offset, 0);

      const [centrosCosto, totalCount] = await Promise.all([
        this.centroCostoRepository.getCentrosCostoByTipo(conjunto, tipo, validatedLimit, validatedOffset),
        this.centroCostoRepository.getCentrosCostoByTipoCount(conjunto, tipo)
      ]);
      
      res.json({
        success: true,
        data: centrosCosto,
        pagination: {
          page,
          limit: validatedLimit,
          offset: validatedOffset,
          total: totalCount,
          totalPages: Math.ceil(totalCount / validatedLimit)
        },
        message: 'Centros de costo obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentrosCostoByTipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centros de costo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/centros-costo/activos:
   *   get:
   *     summary: Obtener centros de costo activos
   *     description: Retorna todos los centros de costo activos de un conjunto específico
   *     tags: [Exactus - Centros Costo]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Número máximo de registros a retornar
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Número de registros a omitir
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *     responses:
   *       200:
   *         description: Centros de costo activos obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/CentroCosto'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 100
   *                     offset:
   *                       type: integer
   *                       example: 0
   *                     total:
   *                       type: integer
   *                       example: 120
   *                     totalPages:
   *                       type: integer
   *                       example: 2
   *                 message:
   *                   type: string
   *                   example: Centros de costo activos obtenidos exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Código de conjunto es requerido
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
   *                   example: Error al obtener centros de costo activos
   */
  async getCentrosCostoActivos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const limit = parseInt(req.query["limit"] as string) || 100;
      const offset = parseInt(req.query["offset"] as string) || 0;
      const page = parseInt(req.query["page"] as string) || 1;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedOffset = Math.max(offset, 0);

      const [centrosCosto, totalCount] = await Promise.all([
        this.centroCostoRepository.getCentrosCostoActivos(conjunto, validatedLimit, validatedOffset),
        this.centroCostoRepository.getCentrosCostoActivosCount(conjunto)
      ]);
      
      res.json({
        success: true,
        data: centrosCosto,
        pagination: {
          page,
          limit: validatedLimit,
          offset: validatedOffset,
          total: totalCount,
          totalPages: Math.ceil(totalCount / validatedLimit)
        },
        message: 'Centros de costo activos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentrosCostoActivos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centros de costo activos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/cuentas-contables:
   *   get:
   *     summary: Obtener cuentas contables por conjunto
   *     description: Retorna todas las cuentas contables de un conjunto específico
   *     tags: [Exactus - Cuentas Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Número máximo de registros a retornar
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Número de registros a omitir
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *     responses:
   *       200:
   *         description: Cuentas contables obtenidas exitosamente
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
   *                     $ref: '#/components/schemas/CuentaContable'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 100
   *                     offset:
   *                       type: integer
   *                       example: 0
   *                     total:
   *                       type: integer
   *                       example: 150
   *                     totalPages:
   *                       type: integer
   *                       example: 2
   *                 message:
   *                   type: string
   *                   example: Cuentas contables obtenidas exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Código de conjunto es requerido
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
   *                   example: Error al obtener cuentas contables
   */
  async getCuentasContablesByConjunto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const limit = parseInt(req.query["limit"] as string) || 100;
      const offset = parseInt(req.query["offset"] as string) || 0;
      const page = parseInt(req.query["page"] as string) || 1;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedOffset = Math.max(offset, 0);

      const [cuentasContables, totalCount] = await Promise.all([
        this.cuentaContableRepository.getCuentasContablesByConjunto(conjunto, validatedLimit, validatedOffset),
        this.cuentaContableRepository.getCuentasContablesByConjuntoCount(conjunto)
      ]);
      
      res.json({
        success: true,
        data: cuentasContables,
        pagination: {
          page,
          limit: validatedLimit,
          offset: validatedOffset,
          total: totalCount,
          totalPages: Math.ceil(totalCount / validatedLimit)
        },
        message: 'Cuentas contables obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCuentasContablesByConjunto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuentas contables',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/cuentas-contables/{codigo}:
   *   get:
   *     summary: Obtener cuenta contable por código
   *     description: Retorna una cuenta contable específica por su código
   *     tags: [Exactus - Cuentas Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: path
   *         name: codigo
   *         required: true
   *         schema:
   *           type: string
   *         description: Código de la cuenta contable
   *     responses:
   *       200:
   *         description: Cuenta contable obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/CuentaContable'
   *                 message:
   *                   type: string
   *                   example: Cuenta contable obtenida exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Código de conjunto y código de cuenta son requeridos
   *       404:
   *         description: Cuenta contable no encontrada
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
   *                   example: Cuenta contable no encontrada
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
   *                   example: Error al obtener cuenta contable
   */
  async getCuentaContableByCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, codigo } = req.params;
      
      if (!conjunto || !codigo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y código de cuenta son requeridos'
        });
        return;
      }

      const cuentaContable = await this.cuentaContableRepository.getCuentaContableByCodigo(conjunto, codigo);
      
      if (!cuentaContable) {
        res.status(404).json({
          success: false,
          message: 'Cuenta contable no encontrada'
        });
        return;
      }
      
      res.json({
        success: true,
        data: cuentaContable,
        message: 'Cuenta contable obtenida exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCuentaContableByCodigo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuenta contable',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/cuentas-contables/tipo/{tipo}:
   *   get:
   *     summary: Obtener cuentas contables por tipo
   *     description: Retorna todas las cuentas contables de un tipo específico
   *     tags: [Exactus - Cuentas Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: path
   *         name: tipo
   *         required: true
   *         schema:
   *           type: string
   *         description: Tipo de cuenta contable
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Número máximo de registros a retornar
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Número de registros a omitir
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *     responses:
   *       200:
   *         description: Cuentas contables obtenidas exitosamente
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
   *                     $ref: '#/components/schemas/CuentaContable'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 100
   *                     offset:
   *                       type: integer
   *                       example: 0
   *                     total:
   *                       type: integer
   *                       example: 50
   *                     totalPages:
   *                       type: integer
   *                       example: 1
   *                 message:
   *                   type: string
   *                   example: Cuentas contables obtenidas exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Código de conjunto y tipo son requeridos
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
   *                   example: Error al obtener cuentas contables
   */
  async getCuentasContablesByTipo(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, tipo } = req.params;
      const limit = parseInt(req.query["limit"] as string) || 100;
      const offset = parseInt(req.query["offset"] as string) || 0;
      const page = parseInt(req.query["page"] as string) || 1;
      
      if (!conjunto || !tipo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y tipo son requeridos'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedOffset = Math.max(offset, 0);

      const [cuentasContables, totalCount] = await Promise.all([
        this.cuentaContableRepository.getCuentasContablesByTipo(conjunto, tipo, validatedLimit, validatedOffset),
        this.cuentaContableRepository.getCuentasContablesByTipoCount(conjunto, tipo)
      ]);
      
      res.json({
        success: true,
        data: cuentasContables,
        pagination: {
          page,
          limit: validatedLimit,
          offset: validatedOffset,
          total: totalCount,
          totalPages: Math.ceil(totalCount / validatedLimit)
        },
        message: 'Cuentas contables obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCuentasContablesByTipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuentas contables',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/cuentas-contables/activas:
   *   get:
   *     summary: Obtener cuentas contables activas
   *     description: Retorna todas las cuentas contables activas de un conjunto específico
   *     tags: [Exactus - Cuentas Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 100
   *         description: Número máximo de registros a retornar
   *       - in: query
   *         name: offset
   *         schema:
   *           type: integer
   *           default: 0
   *         description: Número de registros a omitir
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Número de página
   *     responses:
   *       200:
   *         description: Cuentas contables activas obtenidas exitosamente
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
   *                     $ref: '#/components/schemas/CuentaContable'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     page:
   *                       type: integer
   *                       example: 1
   *                     limit:
   *                       type: integer
   *                       example: 100
   *                     offset:
   *                       type: integer
   *                       example: 0
   *                     total:
   *                       type: integer
   *                       example: 120
   *                     totalPages:
   *                       type: integer
   *                       example: 2
   *                 message:
   *                   type: string
   *                   example: Cuentas contables activas obtenidas exitosamente
   *       400:
   *         description: Parámetros requeridos
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
   *                   example: Código de conjunto es requerido
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
   *                   example: Error al obtener cuentas contables activas
   */
  async getCuentasContablesActivas(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const limit = parseInt(req.query["limit"] as string) || 100;
      const offset = parseInt(req.query["offset"] as string) || 0;
      const page = parseInt(req.query["page"] as string) || 1;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const maxLimit = 1000;
      const validatedLimit = Math.min(limit, maxLimit);
      const validatedOffset = Math.max(offset, 0);

      const [cuentasContables, totalCount] = await Promise.all([
        this.cuentaContableRepository.getCuentasContablesActivas(conjunto, validatedLimit, validatedOffset),
        this.cuentaContableRepository.getCuentasContablesActivasCount(conjunto)
      ]);
      
      res.json({
        success: true,
        data: cuentasContables,
        pagination: {
          page,
          limit: validatedLimit,
          offset: validatedOffset,
          total: totalCount,
          totalPages: Math.ceil(totalCount / validatedLimit)
        },
        message: 'Cuentas contables activas obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCuentasContablesActivas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuentas contables activas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
