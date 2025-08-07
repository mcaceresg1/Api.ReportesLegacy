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
 *         ESTADO:
 *           type: string
 *           description: Estado del centro de costo
 *         TIPO:
 *           type: string
 *           description: Tipo de centro de costo
 *         NIVEL:
 *           type: integer
 *           description: Nivel del centro de costo
 *         CENTRO_PADRE:
 *           type: string
 *           description: Centro de costo padre
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
 *           description: Fecha inicio CE
 *         FECHA_FIN_CE:
 *           type: string
 *           format: date-time
 *           description: Fecha fin CE
 *         COD_AGRUPADOR:
 *           type: string
 *           description: Código agrupador
 *         DESC_COD_AGRUP:
 *           type: string
 *           description: Descripción código agrupador
 *         SUB_CTA_DE:
 *           type: string
 *           description: Sub cuenta de
 *         DESC_SUB_CTA:
 *           type: string
 *           description: Descripción sub cuenta
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
   *     summary: Obtener centros costo por conjunto
   *     description: Retorna una lista de centros costo para un conjunto específico
   *     tags: [Exactus - Centros Costo]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *     responses:
   *       200:
   *         description: Centros cuenta obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/CentroCuenta'
   *                 message:
   *                   type: string
   *                   example: Centros cuenta obtenidos exitosamente
   *       400:
   *         description: Código de conjunto requerido
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
   *                   example: Error al obtener centros cuenta
   */
  // Obtener centros costo por conjunto
  async getCentrosCostoByConjunto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const centrosCosto = await this.centroCostoRepository.getCentrosCostoByConjunto(conjunto);
      
      res.json({
        success: true,
        data: centrosCosto,
        message: 'Centros costo obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentrosCostoByConjunto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centros costo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/centros-costo/{codigo}:
   *   get:
   *     summary: Obtener centro costo por código
   *     description: Retorna un centro costo específico por su código
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
   *         description: Centro costo obtenido exitosamente
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
   *                   example: Centro costo obtenido exitosamente
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
   *         description: Centro costo no encontrado
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
   *                   example: Centro costo no encontrado
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
   *                   example: Error al obtener centro costo
   */
  // Obtener centro costo por código
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
          message: 'Centro costo no encontrado'
        });
        return;
      }

      res.json({
        success: true,
        data: centroCosto,
        message: 'Centro costo obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentroCostoByCodigo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centro costo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/centros-costo/tipo/{tipo}:
   *   get:
   *     summary: Obtener centros costo por tipo
   *     description: Retorna una lista de centros costo filtrados por tipo
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
   *     responses:
   *       200:
   *         description: Centros costo obtenidos exitosamente
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
   *                 message:
   *                   type: string
   *                   example: Centros costo obtenidos exitosamente
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
   *                   example: Error al obtener centros costo
   */
  // Obtener centros costo por tipo
  async getCentrosCostoByTipo(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, tipo } = req.params;
      
      if (!conjunto || !tipo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y tipo son requeridos'
        });
        return;
      }

      const centrosCosto = await this.centroCostoRepository.getCentrosCostoByTipo(conjunto, tipo);
      
      res.json({
        success: true,
        data: centrosCosto,
        message: 'Centros costo obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentrosCostoByTipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centros costo',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/centros-costo/activos:
   *   get:
   *     summary: Obtener centros costo activos
   *     description: Retorna una lista de centros costo activos (ESTADO = 'A')
   *     tags: [Exactus - Centros Costo]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *     responses:
   *       200:
   *         description: Centros costo activos obtenidos exitosamente
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
   *                 message:
   *                   type: string
   *                   example: Centros costo activos obtenidos exitosamente
   *       400:
   *         description: Código de conjunto requerido
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
   *                   example: Error al obtener centros costo activos
   */
  // Obtener centros costo activos
  async getCentrosCostoActivos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const centrosCosto = await this.centroCostoRepository.getCentrosCostoActivos(conjunto);
      
      res.json({
        success: true,
        data: centrosCosto,
        message: 'Centros costo activos obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentrosCostoActivos:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centros costo activos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/centros-cuenta/cuenta/{cuentaContable}:
   *   get:
   *     summary: Obtener centros cuenta por cuenta contable
   *     description: Retorna una lista de centros cuenta filtrados por cuenta contable
   *     tags: [Exactus - Centros Cuenta]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
   *       - in: path
   *         name: cuentaContable
   *         required: true
   *         schema:
   *           type: string
   *         description: Código de la cuenta contable
   *     responses:
   *       200:
   *         description: Centros cuenta obtenidos exitosamente
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
   *                     $ref: '#/components/schemas/CentroCuenta'
   *                 message:
   *                   type: string
   *                   example: Centros cuenta obtenidos exitosamente
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
   *                   example: Código de conjunto y cuenta contable son requeridos
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
   *                   example: Error al obtener centros cuenta
   */
  // Obtener centros cuenta por cuenta contable
  async getCentrosCuentaByCuenta(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, cuentaContable } = req.params;
      
      if (!conjunto || !cuentaContable) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y cuenta contable son requeridos'
        });
        return;
      }

             const centrosCuenta = await this.centroCostoRepository.getCentrosCostoByConjunto(conjunto);
      
      res.json({
        success: true,
        data: centrosCuenta,
        message: 'Centros cuenta obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentrosCuentaByCuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centros cuenta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/exactus/{conjunto}/cuentas-contables:
   *   get:
   *     summary: Obtener cuentas contables por conjunto
   *     description: Retorna una lista de cuentas contables para un conjunto específico
   *     tags: [Exactus - Cuentas Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
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
   *                 message:
   *                   type: string
   *                   example: Cuentas contables obtenidas exitosamente
   *       400:
   *         description: Código de conjunto requerido
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
  // Obtener cuentas contables por conjunto
  async getCuentasContablesByConjunto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const cuentasContables = await this.cuentaContableRepository.getCuentasContablesByConjunto(conjunto);
      
      res.json({
        success: true,
        data: cuentasContables,
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
  // Obtener cuenta contable por código
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
   *     description: Retorna una lista de cuentas contables filtradas por tipo
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
  // Obtener cuentas contables por tipo
  async getCuentasContablesByTipo(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, tipo } = req.params;
      
      if (!conjunto || !tipo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y tipo son requeridos'
        });
        return;
      }

      const cuentasContables = await this.cuentaContableRepository.getCuentasContablesByTipo(conjunto, tipo);
      
      res.json({
        success: true,
        data: cuentasContables,
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
   *     description: Retorna una lista de cuentas contables activas (ACEPTA_DATOS = true)
   *     tags: [Exactus - Cuentas Contables]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto (schema)
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
   *                 message:
   *                   type: string
   *                   example: Cuentas contables activas obtenidas exitosamente
   *       400:
   *         description: Código de conjunto requerido
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
  // Obtener cuentas contables activas
  async getCuentasContablesActivas(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const cuentasContables = await this.cuentaContableRepository.getCuentasContablesActivas(conjunto);
      
      res.json({
        success: true,
        data: cuentasContables,
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
