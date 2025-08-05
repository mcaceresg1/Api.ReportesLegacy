import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IMovimientoContableService } from '../../domain/services/IMovimientoContableService';
import { MovimientoContableCreate, MovimientoContableUpdate, MovimientoContableFilter } from '../../domain/entities/MovimientoContable';

/**
 * @swagger
 * components:
 *   schemas:
 *     MovimientoContable:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         cuenta:
 *           type: string
 *           maxLength: 20
 *         descripcion:
 *           type: string
 *           maxLength: 50
 *         tipo:
 *           type: string
 *           maxLength: 50
 *         centro_costo_id:
 *           type: integer
 *         centroCosto:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *             codigo:
 *               type: string
 *             descripcion:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     MovimientoContableCreate:
 *       type: object
 *       required:
 *         - cuenta
 *         - descripcion
 *         - tipo
 *       properties:
 *         cuenta:
 *           type: string
 *           maxLength: 20
 *         descripcion:
 *           type: string
 *           maxLength: 50
 *         tipo:
 *           type: string
 *           maxLength: 50
 *         centro_costo_id:
 *           type: integer
 *     MovimientoContableUpdate:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         cuenta:
 *           type: string
 *           maxLength: 20
 *         descripcion:
 *           type: string
 *           maxLength: 50
 *         tipo:
 *           type: string
 *           maxLength: 50
 *         centro_costo_id:
 *           type: integer
 *     MovimientoContableFilter:
 *       type: object
 *       properties:
 *         tipo:
 *           type: string
 *         cuenta:
 *           type: string
 *         descripcion:
 *           type: string
 *         centro_costo_id:
 *           type: integer
 *         centro_costo_codigo:
 *           type: string
 *         centro_costo_descripcion:
 *           type: string
 *         periodoDesde:
 *           type: string
 *           format: date
 *           description: Fecha de inicio del período (YYYY-MM-DD)
 *         periodoHasta:
 *           type: string
 *           format: date
 *           description: Fecha de fin del período (YYYY-MM-DD)
 */

@injectable()
export class MovimientoContableController {
  constructor(
    @inject('IMovimientoContableService') private movimientoContableService: IMovimientoContableService
  ) {}

  /**
   * @swagger
   * /api/movimientos-contables:
   *   get:
   *     summary: Obtener todos los movimientos contables
   *     tags: [Movimientos Contables]
   *     parameters:
   *       - in: query
   *         name: tipo
   *         schema:
   *           type: string
   *         description: Filtrar por tipo
   *       - in: query
   *         name: cuenta
   *         schema:
   *           type: string
   *         description: Filtrar por cuenta
   *       - in: query
   *         name: descripcion
   *         schema:
   *           type: string
   *         description: Filtrar por descripción
   *       - in: query
   *         name: centro_costo_id
   *         schema:
   *           type: integer
   *         description: Filtrar por ID de centro de costo
   *       - in: query
   *         name: centro_costo_codigo
   *         schema:
   *           type: string
   *         description: Filtrar por código de centro de costo
   *       - in: query
   *         name: centro_costo_descripcion
   *         schema:
   *           type: string
   *         description: Filtrar por descripción de centro de costo
   *     responses:
   *       200:
   *         description: Lista de movimientos contables obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MovimientoContable'
   *       500:
   *         description: Error interno del servidor
   */
  async getAllMovimientosContables(req: Request, res: Response): Promise<void> {
    try {
      const { 
        tipo, 
        cuenta, 
        descripcion, 
        centro_costo_id, 
        centro_costo_codigo, 
        centro_costo_descripcion,
        periodoDesde,
        periodoHasta,
        compania_id
      } = req.query;
      
      if (tipo || cuenta || descripcion || centro_costo_id || centro_costo_codigo || centro_costo_descripcion || periodoDesde || periodoHasta || compania_id) {
        const filter: any = {};
        
        if (tipo) filter.tipo = tipo as string;
        if (cuenta) filter.cuenta = cuenta as string;
        if (descripcion) filter.descripcion = descripcion as string;
        if (centro_costo_id) filter.centro_costo_id = parseInt(centro_costo_id as string);
        if (centro_costo_codigo) filter.centro_costo_codigo = centro_costo_codigo as string;
        if (centro_costo_descripcion) filter.centro_costo_descripcion = centro_costo_descripcion as string;
        if (periodoDesde) filter.periodoDesde = periodoDesde as string;
        if (periodoHasta) filter.periodoHasta = periodoHasta as string;
        if (compania_id) filter.compania_id = parseInt(compania_id as string);
        
        console.log('Filtro aplicado en controlador:', filter);
        const movimientosContables = await this.movimientoContableService.getMovimientosContablesByFilter(filter);
        console.log('Movimientos contables encontrados:', movimientosContables.length);
        
        // Verificar si hay datos con compania_id
        if (filter.compania_id) {
          console.log(`Buscando movimientos contables para compañía ID: ${filter.compania_id}`);
        }
        
        res.json(movimientosContables);
      } else {
        const movimientosContables = await this.movimientoContableService.getAllMovimientosContables();
        console.log('Total de movimientos contables sin filtro:', movimientosContables.length);
        res.json(movimientosContables);
      }
    } catch (error) {
      console.error('Error al obtener movimientos contables:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Endpoint temporal para actualizar movimientos contables sin compania_id
  async updateMovimientosCompania(req: Request, res: Response): Promise<void> {
    try {
      const { companiaId = 1 } = req.body;
      await this.movimientoContableService.updateMovimientosCompania(companiaId);
      res.json({ 
        success: true, 
        message: `Movimientos contables actualizados con compania_id ${companiaId}` 
      });
    } catch (error) {
      console.error('Error al actualizar movimientos contables:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/movimientos-contables/{id}:
   *   get:
   *     summary: Obtener un movimiento contable por ID
   *     tags: [Movimientos Contables]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del movimiento contable
   *     responses:
   *       200:
   *         description: Movimiento contable encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovimientoContable'
   *       404:
   *         description: Movimiento contable no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async getMovimientoContableById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const movimientoContable = await this.movimientoContableService.getMovimientoContableById(id);
      if (!movimientoContable) {
        res.status(404).json({ error: 'Movimiento contable no encontrado' });
        return;
      }

      res.json(movimientoContable);
    } catch (error) {
      console.error('Error al obtener movimiento contable por ID:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/movimientos-contables:
   *   post:
   *     summary: Crear un nuevo movimiento contable
   *     tags: [Movimientos Contables]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MovimientoContableCreate'
   *     responses:
   *       201:
   *         description: Movimiento contable creado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovimientoContable'
   *       400:
   *         description: Datos inválidos
   *       500:
   *         description: Error interno del servidor
   */
  async createMovimientoContable(req: Request, res: Response): Promise<void> {
    try {
      const movimientoContableData: MovimientoContableCreate = req.body;
      
      const nuevoMovimientoContable = await this.movimientoContableService.createMovimientoContable(movimientoContableData);
      res.status(201).json(nuevoMovimientoContable);
    } catch (error) {
      console.error('Error al crear movimiento contable:', error);
      if (error instanceof Error && error.message.includes('requerida')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor',
          message: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    }
  }

  /**
   * @swagger
   * /api/movimientos-contables/{id}:
   *   put:
   *     summary: Actualizar un movimiento contable
   *     tags: [Movimientos Contables]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del movimiento contable
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MovimientoContableUpdate'
   *     responses:
   *       200:
   *         description: Movimiento contable actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MovimientoContable'
   *       400:
   *         description: Datos inválidos
   *       404:
   *         description: Movimiento contable no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async updateMovimientoContable(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const movimientoContableData: MovimientoContableUpdate = {
        id,
        ...req.body
      };

      const movimientoContableActualizado = await this.movimientoContableService.updateMovimientoContable(movimientoContableData);
      res.json(movimientoContableActualizado);
    } catch (error) {
      console.error('Error al actualizar movimiento contable:', error);
      if (error instanceof Error && error.message.includes('no encontrado')) {
        res.status(404).json({ error: error.message });
      } else if (error instanceof Error && error.message.includes('requerido')) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ 
          error: 'Error interno del servidor',
          message: error instanceof Error ? error.message : 'Error desconocido'
        });
      }
    }
  }

  /**
   * @swagger
   * /api/movimientos-contables/{id}:
   *   delete:
   *     summary: Eliminar un movimiento contable
   *     tags: [Movimientos Contables]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del movimiento contable
   *     responses:
   *       200:
   *         description: Movimiento contable eliminado exitosamente
   *       400:
   *         description: ID inválido
   *       404:
   *         description: Movimiento contable no encontrado
   *       500:
   *         description: Error interno del servidor
   */
  async deleteMovimientoContable(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params['id'] || '');
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }

      const eliminado = await this.movimientoContableService.deleteMovimientoContable(id);
      if (!eliminado) {
        res.status(404).json({ error: 'Movimiento contable no encontrado' });
        return;
      }

      res.json({ message: 'Movimiento contable eliminado exitosamente' });
    } catch (error) {
      console.error('Error al eliminar movimiento contable:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/movimientos-contables/tipo/{tipo}:
   *   get:
   *     summary: Obtener movimientos contables por tipo
   *     tags: [Movimientos Contables]
   *     parameters:
   *       - in: path
   *         name: tipo
   *         required: true
   *         schema:
   *           type: string
   *         description: Tipo de movimiento contable
   *     responses:
   *       200:
   *         description: Lista de movimientos contables por tipo
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MovimientoContable'
   *       500:
   *         description: Error interno del servidor
   */
  async getMovimientosContablesByTipo(req: Request, res: Response): Promise<void> {
    try {
      const tipo = req.params['tipo'];
      if (!tipo) {
        res.status(400).json({ error: 'Parámetro tipo requerido' });
        return;
      }
      const movimientosContables = await this.movimientoContableService.getMovimientosContablesByTipo(tipo);
      res.json(movimientosContables);
    } catch (error) {
      console.error('Error al obtener movimientos contables por tipo:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/movimientos-contables/centro-costo/{centroCostoId}:
   *   get:
   *     summary: Obtener movimientos contables por centro de costo
   *     tags: [Movimientos Contables]
   *     parameters:
   *       - in: path
   *         name: centroCostoId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID del centro de costo
   *     responses:
   *       200:
   *         description: Lista de movimientos contables por centro de costo
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MovimientoContable'
   *       400:
   *         description: ID de centro de costo inválido
   *       500:
   *         description: Error interno del servidor
   */
  async getMovimientosContablesByCentroCosto(req: Request, res: Response): Promise<void> {
    try {
      const centroCostoId = parseInt(req.params['centroCostoId'] || '');
      if (isNaN(centroCostoId)) {
        res.status(400).json({ error: 'ID de centro de costo inválido' });
        return;
      }

      const movimientosContables = await this.movimientoContableService.getMovimientosContablesByCentroCosto(centroCostoId);
      res.json(movimientosContables);
    } catch (error) {
      console.error('Error al obtener movimientos contables por centro de costo:', error);
      res.status(500).json({ 
        error: 'Error interno del servidor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/movimientos-contables/pdf:
   *   post:
   *     summary: Generar PDF de movimientos contables
   *     tags: [Movimientos Contables]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               filtros:
   *                 type: object
   *                 description: Filtros para los movimientos contables
   *               datosReporte:
   *                 type: object
   *                 description: Datos del reporte (títulos, información de empresa, etc.)
   *     responses:
   *       200:
   *         description: PDF generado exitosamente
   *         content:
   *           application/pdf:
   *             schema:
   *               type: string
   *               format: binary
   *       500:
   *         description: Error interno del servidor
   */
  async generatePDF(req: Request, res: Response): Promise<void> {
    try {
      const { filtros, datosReporte } = req.body;
      
      // Obtener movimientos contables con filtros
      const movimientos = await this.movimientoContableService.getMovimientosContablesByFilter(filtros);
      
      // Preparar datos para el script de Python
      const pdfData = {
        ...datosReporte,
        movimientos: movimientos
      };
      
      // Importar módulos necesarios para ejecutar Python
      const { spawn } = require('child_process');
      const path = require('path');
      
      // Ruta al script de Python
      const pythonScript = path.join(__dirname, '../../../pdf-generator.py');
      
      // Ejecutar script de Python
      const pythonProcess = spawn('python', [
        pythonScript,
        JSON.stringify(pdfData),
        'temp_movimientos_contables.pdf'
      ]);
      
      let pdfBuffer = Buffer.alloc(0);
      let errorOutput = '';
      
      // Capturar salida del script
      pythonProcess.stdout.on('data', (data: Buffer) => {
        console.log('Python output:', data.toString());
      });
      
      pythonProcess.stderr.on('data', (data: Buffer) => {
        errorOutput += data.toString();
      });
      
      // Esperar a que termine el proceso
      await new Promise<void>((resolve, reject) => {
        pythonProcess.on('close', (code: number) => {
          if (code === 0) {
            // Leer el archivo PDF generado
            const fs = require('fs');
            const pdfPath = path.join(process.cwd(), 'temp_movimientos_contables.pdf');
            
            if (fs.existsSync(pdfPath)) {
              pdfBuffer = fs.readFileSync(pdfPath);
              // Eliminar archivo temporal
              fs.unlinkSync(pdfPath);
              resolve();
            } else {
              reject(new Error('No se pudo generar el archivo PDF'));
            }
          } else {
            reject(new Error(`Error en script de Python: ${errorOutput}`));
          }
        });
      });
      
      // Enviar PDF como respuesta
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="movimientos_contables.pdf"');
      res.send(pdfBuffer);
      
    } catch (error) {
      console.error('Error generando PDF:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error generando PDF',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
} 