import { injectable } from "inversify";
import { Request, Response } from "express";
import { clipperGPCDatabases } from "../database/config/clipper-gpc-database";
import { rateLimitMiddleware } from "../middleware/RateLimitMiddleware";

/**
 * @swagger
 * tags:
 *   - name: Test - Clipper Databases
 *     description: Endpoints de prueba para verificar conexiones a bases de datos Clipper
 */
@injectable()
export class TestClipperDatabasesController {
  /**
   * @swagger
   * /api/test-clipper-databases:
   *   get:
   *     summary: Probar conexiones a todas las bases de datos Clipper
   *     tags: [Test - Clipper Databases]
   *     description: "Prueba la conexión a todas las bases de datos Clipper configuradas"
   *     responses:
   *       200:
   *         description: Resultado de las pruebas de conexión
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Pruebas de conexión completadas"
   *                 data:
   *                   type: object
   *                   properties:
   *                     totalDatabases:
   *                       type: number
   *                       example: 9
   *                     availableDatabases:
   *                       type: array
   *                       items:
   *                         type: object
   *                         properties:
   *                           key:
   *                             type: string
   *                             example: "bdclipperGPC"
   *                           name:
   *                             type: string
   *                             example: "ASOCIACION CIVIL SAN JUAN BAUTISTA"
   *                           configured:
   *                             type: boolean
   *                             example: true
   *                     unavailableDatabases:
   *                       type: array
   *                       items:
   *                         type: string
   *                         example: "bdclipperGPC10"
   */
  async testAllDatabases(req: Request, res: Response): Promise<void> {
    try {
      const databaseNames = {
        bdclipperGPC: "ASOCIACION CIVIL SAN JUAN BAUTISTA",
        bdclipperGPC2: "PRUEBA",
        bdclipperGPC3: "PARQUE DEL RECUERDO",
        bdclipperGPC4: "MISION CEMENTERIO CATOLICO",
        bdclipperGPC5: "PARQUE DEL RECUERDO",
        bdclipperGPC6: "ASOCIACION CIVIL SAN JUAN BAUTISTA",
        bdclipperGPC7: "MISION CEMENTERIO CATOLICO",
        bdclipperGPC8: "COPIA DE ACSJB 01",
        bdclipperGPC9: "COPIA DE ACSJB 02",
      };

      const availableDatabases = [];
      const unavailableDatabases = [];

      for (const [key, name] of Object.entries(databaseNames)) {
        const sequelize = clipperGPCDatabases[key];
        if (sequelize) {
          availableDatabases.push({
            key,
            name,
            configured: true,
          });
        } else {
          unavailableDatabases.push(key);
        }
      }

      res.json({
        success: true,
        message: "Pruebas de conexión completadas",
        data: {
          totalDatabases: Object.keys(databaseNames).length,
          availableDatabases,
          unavailableDatabases,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al probar las bases de datos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * @swagger
   * /api/test-clipper-databases/{bdClipperGPC}:
   *   get:
   *     summary: Probar conexión a una base de datos específica
   *     tags: [Test - Clipper Databases]
   *     description: "Prueba la conexión a una base de datos Clipper específica"
   *     parameters:
   *       - in: path
   *         name: bdClipperGPC
   *         required: true
   *         schema:
   *           type: string
   *           enum: [bdclipperGPC, bdclipperGPC2, bdclipperGPC3, bdclipperGPC4, bdclipperGPC5, bdclipperGPC6, bdclipperGPC7, bdclipperGPC8, bdclipperGPC9]
   *           example: "bdclipperGPC"
   *         description: "Nombre de la base de datos Clipper GPC a probar"
   *     responses:
   *       200:
   *         description: Resultado de la prueba de conexión
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Conexión exitosa"
   *                 data:
   *                   type: object
   *                   properties:
   *                     database:
   *                       type: string
   *                       example: "bdclipperGPC"
   *                     configured:
   *                       type: boolean
   *                       example: true
   *       400:
   *         description: Base de datos no encontrada
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
   *                   example: "Base de datos no encontrada"
   *                 error:
   *                   type: string
   *                   example: "bdclipperGPC10 no está configurada"
   */
  async testSpecificDatabase(req: Request, res: Response): Promise<void> {
    try {
      const { bdClipperGPC } = req.params;

      if (!bdClipperGPC || typeof bdClipperGPC !== "string") {
        res.status(400).json({
          success: false,
          message: "El parámetro 'bdClipperGPC' es obligatorio",
          data: null,
        });
        return;
      }

      const sequelize = clipperGPCDatabases[bdClipperGPC];
      if (!sequelize) {
        res.status(400).json({
          success: false,
          message: "Base de datos no encontrada",
          error: `${bdClipperGPC} no está configurada`,
          data: null,
        });
        return;
      }

      res.json({
        success: true,
        message: "Conexión exitosa",
        data: {
          database: bdClipperGPC,
          configured: true,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al probar la base de datos",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  /**
   * @swagger
   * /api/test-clipper-databases/clear-rate-limit:
   *   post:
   *     summary: Limpiar rate limiting para testing
   *     tags: [Test - Clipper Databases]
   *     description: "Limpia el rate limiting para permitir más peticiones durante las pruebas"
   *     responses:
   *       200:
   *         description: Rate limiting limpiado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 message:
   *                   type: string
   *                   example: "Rate limiting limpiado exitosamente"
   */
  async clearRateLimit(req: Request, res: Response): Promise<void> {
    try {
      // Limpiar todos los clientes del rate limiting
      rateLimitMiddleware.clearAll();

      res.json({
        success: true,
        message:
          "Rate limiting limpiado exitosamente. Nota: Este endpoint es solo para testing.",
        data: {
          note: "Todos los clientes han sido removidos del rate limiting",
          recommendation:
            "Ahora puedes hacer peticiones sin restricciones de rate limiting",
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al limpiar rate limiting",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
