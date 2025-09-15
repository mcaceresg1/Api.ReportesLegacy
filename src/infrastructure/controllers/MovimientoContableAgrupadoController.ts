import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { IMovimientoContableAgrupadoRepository } from '../../domain/repositories/IMovimientoContableAgrupadoRepository';
import { FiltroMovimientoContableAgrupado } from '../../domain/entities/MovimientoContableAgrupado';

@injectable()
export class MovimientoContableAgrupadoController {
  constructor(
    @inject('IMovimientoContableAgrupadoRepository')
    private movimientoContableAgrupadoRepository: IMovimientoContableAgrupadoRepository
  ) {}

  /**
   * Health check del servicio
   */
  async health(req: Request, res: Response): Promise<void> {
    try {
      const isHealthy = await this.movimientoContableAgrupadoRepository.health();
      
      res.status(200).json({
        success: true,
        message: 'Servicio de movimientos contables agrupados funcionando correctamente',
        timestamp: new Date().toISOString(),
        healthy: isHealthy
      });
    } catch (error) {
      console.error('Error en health check:', error);
      res.status(500).json({
        success: false,
        message: 'Error en el servicio de movimientos contables agrupados',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * Generar reporte completo de movimientos contables agrupados
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      console.log('=== DEBUG GENERAR REPORTE ===');
      console.log('Conjunto:', conjunto);
      console.log('Body completo:', req.body);
      console.log('Content-Type:', req.headers['content-type']);

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const filtros: FiltroMovimientoContableAgrupado = {
        conjunto,
        fechaDesde: req.body.fechaDesde,
        fechaHasta: req.body.fechaHasta,
        contabilidad: req.body.contabilidad || ['F', 'A'],
        cuentaContable: req.body.cuentaContable,
        nit: req.body.nit,
        dimension: req.body.dimension,
        asiento: req.body.asiento,
        fuente: req.body.fuente
      };

      console.log('Filtros procesados:', filtros);

      // Validaciones
      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas de inicio (fechaDesde) y fin (fechaHasta) son requeridas'
        });
        return;
      }

      const resultado = await this.movimientoContableAgrupadoRepository.generarReporte(filtros);

      console.log('=== DEBUG RESULTADO ===');
      console.log('Total registros:', resultado.length);
      console.log('Primer registro:', resultado[0] || 'No hay datos');

      res.status(200).json({
        success: true,
        message: 'Reporte generado exitosamente',
        data: resultado,
        total: resultado.length,
        filtros: filtros
      });

    } catch (error) {
      console.error('Error al generar reporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error al generar el reporte de movimientos contables agrupados'
      });
    }
  }

  /**
   * Obtener movimientos contables agrupados con paginación
   */
  async obtenerMovimientos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      // Parámetros de paginación
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || undefined; // Sin límite por defecto
      const offset = limit ? (page - 1) * limit : 0;

      const filtros: FiltroMovimientoContableAgrupado = {
        conjunto,
        fechaDesde: req.body.fechaDesde || req.query['fechaDesde'] as string,
        fechaHasta: req.body.fechaHasta || req.query['fechaHasta'] as string,
        contabilidad: req.body.contabilidad || req.query['contabilidad'] as string[] || ['F', 'A'],
        cuentaContable: req.body.cuentaContable || req.query['cuentaContable'] as string,
        nit: req.body.nit || req.query['nit'] as string,
        dimension: req.body.dimension || req.query['dimension'] as string,
        asiento: req.body.asiento || req.query['asiento'] as string,
        fuente: req.body.fuente || req.query['fuente'] as string
      };

      // Validaciones
      if (!filtros.fechaDesde || !filtros.fechaHasta) {
        res.status(400).json({
          success: false,
          message: 'Las fechas de inicio (fechaDesde) y fin (fechaHasta) son requeridas'
        });
        return;
      }

      const resultado = await this.movimientoContableAgrupadoRepository.obtenerMovimientos(
        filtros, 
        limit, 
        offset
      );

      res.status(200).json({
        success: true,
        message: 'Datos obtenidos exitosamente',
        data: {
          data: resultado.data,
          total: resultado.total,
          pagina: page,
          porPagina: limit || 'Sin límite',
          totalPaginas: limit ? Math.ceil(resultado.total / limit) : 1
        },
        filtros: filtros
      });

    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error al obtener los movimientos contables agrupados'
      });
    }
  }

  /**
   * Obtener cuentas contables para filtros
   */
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

      const cuentas = await this.movimientoContableAgrupadoRepository.obtenerCuentasContables(conjunto);

      res.status(200).json({
        success: true,
        message: 'Cuentas contables obtenidas exitosamente',
        data: cuentas
      });

    } catch (error) {
      console.error('Error al obtener cuentas contables:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error al obtener las cuentas contables'
      });
    }
  }

  /**
   * Obtener NITs para filtros
   */
  async obtenerNits(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const nits = await this.movimientoContableAgrupadoRepository.obtenerNits(conjunto);

      res.status(200).json({
        success: true,
        message: 'NITs obtenidos exitosamente',
        data: nits
      });

    } catch (error) {
      console.error('Error al obtener NITs:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error al obtener los NITs'
      });
    }
  }

  /**
   * Obtener dimensiones contables para filtros
   */
  async obtenerDimensiones(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const dimensiones = await this.movimientoContableAgrupadoRepository.obtenerDimensiones(conjunto);

      res.status(200).json({
        success: true,
        message: 'Dimensiones obtenidas exitosamente',
        data: dimensiones
      });

    } catch (error) {
      console.error('Error al obtener dimensiones:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error al obtener las dimensiones contables'
      });
    }
  }

  /**
   * Obtener fuentes para filtros
   */
  async obtenerFuentes(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      const fuentes = await this.movimientoContableAgrupadoRepository.obtenerFuentes(conjunto);

      res.status(200).json({
        success: true,
        message: 'Fuentes obtenidas exitosamente',
        data: fuentes
      });

    } catch (error) {
      console.error('Error al obtener fuentes:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error al obtener las fuentes'
      });
    }
  }

  /**
   * Obtener información completa de un NIT específico
   */
  async obtenerNitCompleto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, nit } = req.params;
      
      if (!conjunto || !nit) {
        res.status(400).json({
          success: false,
          message: 'Los parámetros conjunto y nit son requeridos'
        });
        return;
      }

      const nitCompleto = await this.movimientoContableAgrupadoRepository.obtenerNitCompleto(conjunto, nit);

      if (!nitCompleto) {
        res.status(404).json({
          success: false,
          message: 'NIT no encontrado'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'NIT obtenido exitosamente',
        data: nitCompleto
      });

    } catch (error) {
      console.error('Error al obtener NIT completo:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error al obtener el NIT'
      });
    }
  }

  /**
   * Obtener lista de NITs completos con paginación
   */
  async obtenerNitsCompletos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      // Parámetros de consulta
      const page = parseInt(req.query['page'] as string) || 1;
      const limit = parseInt(req.query['limit'] as string) || undefined; // Sin límite por defecto
      const filtro = req.query['filtro'] as string;

      const offset = limit ? (page - 1) * limit : 0;

      const resultado = await this.movimientoContableAgrupadoRepository.obtenerNitsCompletos(
        conjunto, 
        limit, 
        offset, 
        filtro
      );

      const totalPaginas = limit ? Math.ceil(resultado.total / limit) : 1;

      res.status(200).json({
        success: true,
        message: 'NITs obtenidos exitosamente',
        data: {
          data: resultado.data,
          total: resultado.total,
          pagina: page,
          porPagina: limit || 'Sin límite',
          totalPaginas
        }
      });

    } catch (error) {
      console.error('Error al obtener NITs completos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error al obtener los NITs'
      });
    }
  }

  /**
   * Limpiar tabla temporal
   */
  async limpiarDatos(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es requerido'
        });
        return;
      }

      await this.movimientoContableAgrupadoRepository.limpiarTablaTemp(conjunto);

      res.status(200).json({
        success: true,
        message: 'Datos temporales limpiados exitosamente'
      });

    } catch (error) {
      console.error('Error al limpiar datos:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error al limpiar los datos temporales'
      });
    }
  }
}
