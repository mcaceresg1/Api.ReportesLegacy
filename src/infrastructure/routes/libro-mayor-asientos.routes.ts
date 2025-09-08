import { Router } from "express";
import { container } from "../container/container";
import { LibroMayorAsientosController } from "../controllers/LibroMayorAsientosController";

const router = Router();
const libroMayorAsientosController =
  container.get<LibroMayorAsientosController>("LibroMayorAsientosController");

/**
 * @swagger
 * components:
 *   schemas:
 *     LibroMayorAsientos:
 *       type: object
 *       properties:
 *         asiento:
 *           type: string
 *           description: Número del asiento
 *           example: "000001"
 *         contabilidad:
 *           type: string
 *           description: Tipo de contabilidad
 *           example: "F"
 *         tipo_asiento:
 *           type: string
 *           description: Tipo de asiento
 *           example: "N"
 *         fecha:
 *           type: string
 *           format: date
 *           description: Fecha del asiento
 *           example: "2024-01-15"
 *         origen:
 *           type: string
 *           description: Origen del asiento
 *           example: "01"
 *         documento_global:
 *           type: string
 *           description: Documento global
 *           example: "DOC001"
 *         monto_total_local:
 *           type: number
 *           description: Monto total en moneda local
 *           example: 1000.00
 *         monto_total_dolar:
 *           type: number
 *           description: Monto total en dólares
 *           example: 1000.00
 *         mayor_auditoria:
 *           type: string
 *           description: Estado de mayor auditoría
 *           example: "N"
 *         exportado:
 *           type: string
 *           description: Estado de exportación
 *           example: "S"
 *         tipo_ingreso_mayor:
 *           type: string
 *           description: Tipo de ingreso mayor
 *           example: "NORMAL"
 */

// Health check
router.get(
  "/health",
  libroMayorAsientosController.health.bind(libroMayorAsientosController)
);

// Obtener filtros disponibles
router.get(
  "/:conjunto/filtros",
  libroMayorAsientosController.obtenerFiltros.bind(libroMayorAsientosController)
);

// Generar reporte
router.get(
  "/:conjunto/generar",
  libroMayorAsientosController.generarReporte.bind(libroMayorAsientosController)
);

// Obtener datos paginados
router.get(
  "/:conjunto/obtener",
  libroMayorAsientosController.obtenerAsientos.bind(
    libroMayorAsientosController
  )
);

// Exportar a Excel
router.get(
  "/:conjunto/excel",
  libroMayorAsientosController.exportarExcel.bind(libroMayorAsientosController)
);

// Exportar a PDF
router.get(
  "/:conjunto/pdf",
  libroMayorAsientosController.exportarPDF.bind(libroMayorAsientosController)
);

export default router;




