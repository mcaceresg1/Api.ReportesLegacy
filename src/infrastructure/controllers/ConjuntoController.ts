import { Request, Response } from 'express';
import { IConjuntoService } from '../../domain/services/IConjuntoService';

/**
 * @swagger
 * components:
 *   schemas:
 *     Conjunto:
 *       type: object
 *       properties:
 *         CONJUNTO:
 *           type: string
 *           description: Código del conjunto
 *         NOMBRE:
 *           type: string
 *           description: Nombre del conjunto
 *         DIREC1:
 *           type: string
 *           description: Dirección 1
 *         DIREC2:
 *           type: string
 *           description: Dirección 2
 *         TELEFONO:
 *           type: string
 *           description: Teléfono
 *         LOGO:
 *           type: string
 *           description: Logo
 *         DOBLE_MONEDA:
 *           type: string
 *           maxLength: 1
 *           description: Doble moneda (S/N)
 *         DOBLE_CONTABILIDAD:
 *           type: string
 *           maxLength: 1
 *           description: Doble contabilidad (S/N)
 *         INVENTARIO_DOLAR:
 *           type: string
 *           maxLength: 1
 *           description: Inventario en dólares (S/N)
 *         USA_LOTES:
 *           type: string
 *           maxLength: 1
 *           description: Usa lotes (S/N)
 *         USAR_CENTROS_COSTO:
 *           type: string
 *           maxLength: 1
 *           description: Usar centros de costo (S/N)
 *         CONSOLIDA:
 *           type: string
 *           maxLength: 1
 *           description: Consolida (S/N)
 *         CONSOLIDADORA:
 *           type: string
 *           description: Consolidadora
 *         BD_CIA_CONSOLIDAD:
 *           type: string
 *           description: Base de datos de la compañía consolidada
 *         CONTA_A_CONSOLID:
 *           type: integer
 *           description: Conta a consolidar
 *         MISMO_CUADRO_CTB:
 *           type: string
 *           maxLength: 1
 *           description: Mismo cuadro contable (S/N)
 *         USUARIO_ULT_MOD:
 *           type: string
 *           description: Usuario de última modificación
 *         FCH_HORA_ULT_MOD:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de última modificación
 *         NOTAS:
 *           type: string
 *           description: Notas
 *         USA_UNIDADES:
 *           type: string
 *           maxLength: 1
 *           description: Usa unidades (S/N)
 *         UNIDAD_OMISION:
 *           type: string
 *           description: Unidad de omisión
 *         MONEDA_CONSOLIDA:
 *           type: string
 *           description: Moneda de consolidación
 *         VERSION_BD:
 *           type: string
 *           description: Versión de la base de datos
 *         USUARIO_MODIF_BD:
 *           type: string
 *           description: Usuario que modificó la base de datos
 *         FCH_HORA_MODIF_BD:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora de modificación de la base de datos
 *         VERSION_INSTALAC:
 *           type: string
 *           description: Versión de instalación
 *         NIT:
 *           type: string
 *           description: NIT
 *         PAIS:
 *           type: string
 *           description: País
 *         GLN:
 *           type: string
 *           description: GLN
 *         UBICACION:
 *           type: string
 *           description: Ubicación
 *         IDIOMA:
 *           type: string
 *           description: Idioma
 *         USA_SUCURSAL:
 *           type: string
 *           maxLength: 1
 *           description: Usa sucursales (S/N)
 *         MASCARA_SUCURSAL:
 *           type: string
 *           description: Máscara de sucursal
 *         DIRECCION_WEB1:
 *           type: string
 *           description: Dirección web 1
 *         DIRECCION_WEB2:
 *           type: string
 *           description: Dirección web 2
 *         NOMBRE_WEB1:
 *           type: string
 *           description: Nombre web 1
 *         NOMBRE_WEB2:
 *           type: string
 *           description: Nombre web 2
 *         DIRECCION_PAG_WEB:
 *           type: string
 *           description: Dirección de la página web
 *         EMAIL_DOC_ELECTRONICO:
 *           type: string
 *           description: Email para documentos electrónicos
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
 *         AGENTE_RETENCION:
 *           type: string
 *           maxLength: 1
 *           description: Agente retención (S/N)
 *         CODIGO_RETENCION_IGV:
 *           type: string
 *           description: Código de retención IGV
 *         TIPO_CAMBIO_IGV:
 *           type: string
 *           description: Tipo de cambio IGV
 *         TIPO_INSTITUCION:
 *           type: string
 *           description: Tipo de institución
 *         PAIS_DIVISION:
 *           type: string
 *           description: División del país
 *         DIVISION_GEOGRAFICA1:
 *           type: string
 *           description: División geográfica 1
 *         DIVISION_GEOGRAFICA2:
 *           type: string
 *           description: División geográfica 2
 *         LOGO_CIA:
 *           type: string
 *           description: Logo de la compañía
 *         ES_PRINCIPAL:
 *           type: string
 *           maxLength: 1
 *           description: Es principal (S/N)
 *         REPLICA:
 *           type: string
 *           maxLength: 1
 *           description: Réplica (S/N)
 *         ES_AGENTE_PERCEPCION:
 *           type: string
 *           maxLength: 1
 *           description: Es agente percepción (S/N)
 *         NUMERO_REGISTRO:
 *           type: string
 *           description: Número de registro
 *         DIREC3:
 *           type: string
 *           description: Dirección 3
 *         COD_POSTAL:
 *           type: string
 *           description: Código postal
 *         UBIGEO_EMPRESA:
 *           type: string
 *           description: Ubigeo de la empresa
 *         DIRECCION_COMPLETA_EMPRESA:
 *           type: string
 *           description: Dirección completa de la empresa
 *         URBANIZACION_EMPRESA:
 *           type: string
 *           description: Urbanización de la empresa
 *         CUENTA_DETRACCION_EMPRESA:
 *           type: string
 *           description: Cuenta de detracción de la empresa
 *         DIVISION_GEOGRAFICA3:
 *           type: string
 *           description: División geográfica 3
 *         DIVISION_GEOGRAFICA4:
 *           type: string
 *           description: División geográfica 4
 *         REGIMEN_FISCAL:
 *           type: string
 *           description: Régimen fiscal
 *         COORDENADAS:
 *           type: string
 *           description: Coordenadas
 *         ACTIVIDAD_COMERCIAL:
 *           type: string
 *           description: Actividad comercial
 *         NUMERO_REGISTRO_IVA:
 *           type: string
 *           description: Número de registro IVA
 *         USA_CONSORCIO:
 *           type: string
 *           maxLength: 1
 *           description: Usa consorcio (S/N)
 *         TIPO_OPERACION:
 *           type: string
 *           maxLength: 2
 *           description: Tipo de operación
 *         AGENTE_PERCEPCION:
 *           type: string
 *           maxLength: 1
 *           description: Agente percepción (S/N)
 *         CALC_PERCE_SOLO_VENTA:
 *           type: string
 *           maxLength: 1
 *           description: Calcula percepción solo venta (S/N)
 *         RETENCION_CLIENTE:
 *           type: string
 *           maxLength: 1
 *           description: Retención cliente (S/N)
 */

export class ConjuntoController {
  constructor(private conjuntoService: IConjuntoService) {}

  /**
   * @swagger
   * /api/conjuntos:
   *   get:
   *     summary: Obtener todos los conjuntos
   *     description: Retorna una lista de todos los conjuntos disponibles
   *     tags: [Conjuntos]
   *     security: []
   *     responses:
   *       200:
   *         description: Lista de conjuntos obtenida exitosamente
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
   *                     $ref: '#/components/schemas/Conjunto'
   *                 message:
   *                   type: string
   *                   example: Conjuntos obtenidos exitosamente
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
   *                   example: Error al obtener conjuntos
   */
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

  /**
   * @swagger
   * /api/conjuntos/{codigo}:
   *   get:
   *     summary: Obtener conjunto por código
   *     description: Retorna un conjunto específico por su código
   *     tags: [Conjuntos]
   *     security: []
   *     parameters:
   *       - in: path
   *         name: codigo
   *         required: true
   *         schema:
   *           type: string
   *         description: Código del conjunto
   *     responses:
   *       200:
   *         description: Conjunto obtenido exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Conjunto'
   *                 message:
   *                   type: string
   *                   example: Conjunto obtenido exitosamente
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
   *       404:
   *         description: Conjunto no encontrado
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
   *                   example: Conjunto no encontrado
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
   *                   example: Error al obtener conjunto
   */
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

  /**
   * @swagger
   * /api/conjuntos/activos:
   *   get:
   *     summary: Obtener conjuntos activos
   *     description: Retorna una lista de conjuntos activos (ES_PRINCIPAL = true o null)
   *     tags: [Conjuntos]
   *     security: []
   *     responses:
   *       200:
   *         description: Lista de conjuntos activos obtenida exitosamente
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
   *                     $ref: '#/components/schemas/Conjunto'
   *                 message:
   *                   type: string
   *                   example: Conjuntos activos obtenidos exitosamente
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
   *                   example: Error al obtener conjuntos activos
   */
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
