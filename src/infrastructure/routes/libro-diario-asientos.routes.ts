import { Router } from "express";
import { container } from "../container/container";
import { LibroDiarioAsientosController } from "../controllers/LibroDiarioAsientosController";

const router = Router();
const libroDiarioAsientosController =
  container.get<LibroDiarioAsientosController>("LibroDiarioAsientosController");

/**
 * @swagger
 * components:
 *   schemas:
 *     LibroDiarioAsientos:
 *       type: object
 *       properties:
 *         asiento:
 *           type: string
 *           description: Número del asiento
 *           example: "0700000483"
 *         paquete:
 *           type: string
 *           description: Código del paquete
 *           example: "001"
 *         descripcion:
 *           type: string
 *           description: Descripción del paquete
 *           example: "Paquete Principal"
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
 *         total_debito_loc:
 *           type: number
 *           description: Total débito en moneda local
 *           example: 1000.00
 *         total_credito_loc:
 *           type: number
 *           description: Total crédito en moneda local
 *           example: 1000.00
 *         total_control_loc:
 *           type: number
 *           description: Total control en moneda local
 *           example: 1000.00
 *         diferencia_local:
 *           type: number
 *           description: Diferencia en moneda local
 *           example: 0.00
 *         total_debito_dol:
 *           type: number
 *           description: Total débito en dólares
 *           example: 1000.00
 *         total_credito_dol:
 *           type: number
 *           description: Total crédito en dólares
 *           example: 1000.00
 *         total_control_dol:
 *           type: number
 *           description: Total control en dólares
 *           example: 1000.00
 *         diferencia_dolar:
 *           type: number
 *           description: Diferencia en dólares
 *           example: 0.00
 */

// Health check
router.get(
  "/health",
  libroDiarioAsientosController.health.bind(libroDiarioAsientosController)
);

// Obtener filtros disponibles
router.get(
  "/:conjunto/filtros",
  libroDiarioAsientosController.obtenerFiltros.bind(libroDiarioAsientosController)
);

// Generar reporte
router.post(
  "/:conjunto/generar",
  libroDiarioAsientosController.generarReporte.bind(libroDiarioAsientosController)
);

// Obtener datos paginados
router.get(
  "/:conjunto/obtener",
  libroDiarioAsientosController.obtenerAsientos.bind(libroDiarioAsientosController)
);

// Exportar a Excel
router.get(
  "/:conjunto/exportar/excel",
  libroDiarioAsientosController.exportarExcel.bind(libroDiarioAsientosController)
);

// Exportar a PDF
router.get(
  "/:conjunto/exportar/pdf",
  libroDiarioAsientosController.exportarPDF.bind(libroDiarioAsientosController)
);

export default router;
