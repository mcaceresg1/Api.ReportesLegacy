import { Request, Response } from 'express';
import { ISaldoPromediosService } from '../../domain/services/ISaldoPromediosService';
import { FiltroSaldoPromedios } from '../../domain/entities/SaldoPromedios';

export class SaldoPromediosController {
  constructor(
    private saldoPromediosService: ISaldoPromediosService
  ) {}

  async obtenerCuentasContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const cuentas = await this.saldoPromediosService.obtenerCuentasContables(conjunto);
      
      res.json({
        success: true,
        data: cuentas
      });
    } catch (error) {
      console.error('Error en controlador al obtener cuentas contables:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros: FiltroSaldoPromedios = req.body;
      const { page = 1, limit = 100 } = req.body; // Agregar parámetros de paginación
      
      console.log('🔍 Controlador generarReporte llamado con:');
      console.log('  - Parámetros:', req.params);
      console.log('  - Body:', req.body);
      console.log('  - Conjunto:', conjunto);
      console.log('  - Filtros:', filtros);
      console.log('  - Paginación:', { page, limit });
      
      if (!conjunto) {
        console.log('❌ Error: Conjunto no proporcionado');
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!filtros.fecha_desde || !filtros.fecha_hasta) {
        console.log('❌ Error: Fechas no proporcionadas');
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      // Asignar el conjunto del parámetro de la URL
      filtros.conjunto = conjunto;

      console.log('✅ Generando reporte de saldos promedios con filtros:', filtros);
      
      // Obtener datos paginados directamente del servicio
      const paginaActual = parseInt(page.toString());
      const registrosPorPagina = parseInt(limit.toString());
      
      console.log('📊 Solicitando página:', paginaActual, 'con', registrosPorPagina, 'registros');
      
      const resultado = await this.saldoPromediosService.generarReportePaginado(filtros, paginaActual, registrosPorPagina);
      
      console.log('✅ Reporte generado exitosamente, registros en página:', resultado.length);
      
      // Para obtener el total real, necesitamos hacer una consulta COUNT separada
      // Por ahora usamos una aproximación basada en la página actual
      // En producción esto debería ser una consulta COUNT optimizada
      const totalRegistros = resultado.length === registrosPorPagina ? 
        (paginaActual * registrosPorPagina) + 100 : // Aproximación si hay más páginas
        (paginaActual - 1) * registrosPorPagina + resultado.length; // Total exacto si es la última página
      
      console.log('📊 Total estimado de registros disponibles:', totalRegistros);
      
      res.json({
        success: true,
        data: resultado,
        pagination: {
          page: paginaActual,
          limit: registrosPorPagina,
          total: totalRegistros,
          totalPages: Math.ceil(totalRegistros / registrosPorPagina),
          hasNext: resultado.length === registrosPorPagina,
          hasPrev: paginaActual > 1
        },
        message: `Página ${paginaActual} con ${resultado.length} registros`
      });
    } catch (error) {
      console.error('❌ Error en controlador al generar reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async obtenerReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const { pagina = 1, limite = 50 } = req.query;
      const filtros: FiltroSaldoPromedios = req.body;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      if (!filtros.fecha_desde || !filtros.fecha_hasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas desde y hasta son requeridas'
        });
        return;
      }

      // Asignar el conjunto del parámetro de la URL
      filtros.conjunto = conjunto;

      const resultado = await this.saldoPromediosService.obtenerReporte(filtros, Number(pagina), Number(limite));
      
      res.json({
        success: true,
        data: resultado.data,
        total: resultado.total,
        pagina: Number(pagina),
        limite: Number(limite),
        message: 'Reporte obtenido exitosamente'
      });
    } catch (error) {
      console.error('Error en controlador al obtener reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async limpiarDatos(req: Request, res: Response): Promise<void> {
    try {
      await this.saldoPromediosService.limpiarDatos();
      
      res.json({
        success: true,
        message: 'Datos limpiados exitosamente'
      });
    } catch (error) {
      console.error('Error en controlador al limpiar datos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
