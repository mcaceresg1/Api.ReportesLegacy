import { Router } from 'express';
import { container } from '../container/container';
import { LibroMayorAsientosController } from '../controllers/LibroMayorAsientosController';

const router = Router();
const libroMayorAsientosController = container.get<LibroMayorAsientosController>('LibroMayorAsientosController');

// Obtener filtros disponibles
router.get('/:conjunto/filtros', (req, res) => {
  libroMayorAsientosController.obtenerFiltros(req, res);
});

// Generar reporte
router.get('/:conjunto/generar', (req, res) => {
  libroMayorAsientosController.generarReporte(req, res);
});

// Obtener asientos (alias para generar reporte)
router.get('/:conjunto/obtener', (req, res) => {
  libroMayorAsientosController.obtenerAsientos(req, res);
});

// Exportar a Excel
router.get('/:conjunto/excel', (req, res) => {
  libroMayorAsientosController.exportarExcel(req, res);
});

// Exportar a PDF
router.get('/:conjunto/pdf', (req, res) => {
  libroMayorAsientosController.exportarPDF(req, res);
});

export default router;
