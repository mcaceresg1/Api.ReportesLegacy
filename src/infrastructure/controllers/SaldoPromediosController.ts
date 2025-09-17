import { Request, Response } from 'express';
import { inject } from 'inversify';
import { TYPES } from '../container/types';
import { ISaldoPromediosService } from '../../domain/services/ISaldoPromediosService';
import { FiltroSaldoPromedios } from '../../domain/entities/SaldoPromedios';

export class SaldoPromediosController {
  constructor(
    @inject(TYPES.ISaldoPromediosService) private saldoPromediosService: ISaldoPromediosService
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

      console.log('🔍 Obteniendo cuentas contables para conjunto:', conjunto);
      
      const cuentas = await this.saldoPromediosService.obtenerCuentasContables(conjunto);
      
      console.log('✅ Cuentas contables obtenidas:', cuentas.length);
      
      res.json({
        success: true,
        data: cuentas,
        message: `${cuentas.length} cuentas contables encontradas`
      });
    } catch (error) {
      console.error('❌ Error obteniendo cuentas contables:', error);
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
      const { page = 1, limit = 100 } = req.body;
      
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
      
      const paginaActual = parseInt(page.toString());
      const registrosPorPagina = parseInt(limit.toString());
      
      console.log('📊 Solicitando página:', paginaActual, 'con', registrosPorPagina, 'registros');
      
      const resultado = await this.saldoPromediosService.generarReportePaginado(filtros, paginaActual, registrosPorPagina);
      
      console.log('✅ Reporte generado exitosamente, registros en página:', resultado.data.length);
      console.log('📊 Total de registros disponibles:', resultado.pagination.total);
      
      res.json({
        success: resultado.success,
        data: resultado.data,
        pagination: resultado.pagination,
        message: resultado.message
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
}
