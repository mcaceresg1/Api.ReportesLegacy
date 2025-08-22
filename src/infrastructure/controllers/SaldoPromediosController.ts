import { inject } from 'inversify';
import { Request, Response } from 'express';
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

      console.log('Generando reporte de saldos promedios con filtros:', filtros);
      
      const resultado = await this.saldoPromediosService.generarReporte(filtros);
      
      res.json({
        success: true,
        data: resultado,
        total: resultado.length,
        message: 'Reporte generado exitosamente'
      });
    } catch (error) {
      console.error('Error en controlador al generar reporte:', error);
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

      const paginaNum = parseInt(pagina as string) || 1;
      const limiteNum = parseInt(limite as string) || 50;
      
      const resultado = await this.saldoPromediosService.obtenerReporte(filtros, paginaNum, limiteNum);
      
      res.json({
        success: true,
        data: resultado.data,
        total: resultado.total,
        pagina: paginaNum,
        limite: limiteNum,
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
      const resultado = await this.saldoPromediosService.limpiarDatos();
      
      if (resultado) {
        res.json({
          success: true,
          message: 'Datos limpiados exitosamente'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Error al limpiar datos'
        });
      }
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
