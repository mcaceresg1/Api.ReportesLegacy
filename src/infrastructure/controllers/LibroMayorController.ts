import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ILibroMayorRepository } from '../../domain/repositories/ILibroMayorRepository';
import { LibroMayorFiltros, LibroMayorResponse } from '../../domain/entities/LibroMayor';

@injectable()
export class LibroMayorController {
  constructor(
    @inject('ILibroMayorRepository') private libroMayorRepository: ILibroMayorRepository
  ) {}

  /**
   * POST /api/libro-mayor/generar
   * Genera el reporte completo del libro mayor
   */
  async generarReporte(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, usuario, fechaInicio, fechaFin } = req.body;

      // Validaciones básicas
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin'
        });
        return;
      }

      // Validar formato de fechas
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Formato de fecha inválido'
        });
        return;
      }

      if (fechaInicioDate >= fechaFinDate) {
        res.status(400).json({
          success: false,
          message: 'La fecha de inicio debe ser menor que la fecha de fin'
        });
        return;
      }

      console.log(`Generando reporte libro mayor para conjunto: ${conjunto}, usuario: ${usuario}`);
      console.log(`Período: ${fechaInicioDate.toISOString()} - ${fechaFinDate.toISOString()}`);

      // Usar directamente el repositorio
      await this.libroMayorRepository.generarReporteLibroMayor(
        conjunto as string,
        usuario as string,
        fechaInicioDate,
        fechaFinDate
      );

      res.status(200).json({
        success: true,
        message: 'Reporte del libro mayor generado exitosamente',
        data: {
          conjunto,
          usuario,
          fechaInicio: fechaInicioDate.toISOString(),
          fechaFin: fechaFinDate.toISOString(),
          timestamp: new Date().toISOString()
        }
      });

    } catch (error) {
      console.error('Error en generarReporte:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * GET /api/libro-mayor/obtener
   * Obtiene los datos del libro mayor con filtros y paginación
   */
  async obtenerLibroMayor(req: Request, res: Response): Promise<void> {
    try {
      const {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        cuentaContable,
        centroCosto,
        nit,
        tipoAsiento,
        page = '1',
        limit = '100'
      } = req.query;

      // Validaciones básicas
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin'
        });
        return;
      }

      // Validar formato de fechas
      const fechaInicioDate = new Date(fechaInicio as string);
      const fechaFinDate = new Date(fechaFin as string);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Formato de fecha inválido'
        });
        return;
      }

      // Validar paginación
      const pageNum = parseInt(page as string) || 1;
      const limitNum = parseInt(limit as string) || 100;
      const offset = (pageNum - 1) * limitNum;

      if (pageNum < 1 || limitNum < 1 || limitNum > 1000) {
        res.status(400).json({
          success: false,
          message: 'Parámetros de paginación inválidos. page >= 1, limit entre 1 y 1000'
        });
        return;
      }

      console.log(`Obteniendo libro mayor para conjunto: ${conjunto}, usuario: ${usuario}`);
      console.log(`Filtros: cuentaContable=${cuentaContable}, centroCosto=${centroCosto}, nit=${nit}, tipoAsiento=${tipoAsiento}`);
      console.log(`Paginación: página ${pageNum}, ${limitNum} registros por página`);

      // Construir filtros
      const filtros: LibroMayorFiltros = {
        conjunto: conjunto as string,
        usuario: usuario as string,
        fechaInicio: fechaInicioDate,
        fechaFin: fechaFinDate,
        cuentaContable: cuentaContable as string,
        centroCosto: centroCosto as string,
        nit: nit as string,
        tipoAsiento: tipoAsiento as string,
        limit: limitNum,
        offset
      };

      // Usar directamente el repositorio
      const resultado = await this.libroMayorRepository.obtenerLibroMayor(filtros);

      res.status(200).json({
        success: true,
        message: 'Libro mayor obtenido exitosamente',
        data: resultado,
        paginacion: {
          pagina: resultado.pagina,
          porPagina: resultado.porPagina,
          total: resultado.total,
          totalPaginas: resultado.totalPaginas
        }
      });

    } catch (error) {
      console.error('Error en obtenerLibroMayor:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * GET /api/libro-mayor/exportar-excel
   * Exporta el libro mayor a Excel
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const {
        conjunto,
        usuario,
        fechaInicio,
        fechaFin,
        limit = '1000'
      } = req.query;

      // Validaciones básicas
      if (!conjunto || !usuario || !fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros requeridos: conjunto, usuario, fechaInicio, fechaFin'
        });
        return;
      }

      // Validar formato de fechas
      const fechaInicioDate = new Date(fechaInicio as string);
      const fechaFinDate = new Date(fechaFin as string);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        res.status(400).json({
          success: false,
          message: 'Formato de fecha inválido'
        });
        return;
      }

      // Validar límite
      const limitNum = parseInt(limit as string) || 1000;
      if (limitNum < 1 || limitNum > 10000) {
        res.status(400).json({
          success: false,
          message: 'Límite debe estar entre 1 y 10000'
        });
        return;
      }

      console.log(`Exportando Excel del libro mayor para conjunto: ${conjunto}, usuario: ${usuario}`);
      console.log(`Período: ${fechaInicioDate.toISOString()} - ${fechaFinDate.toISOString()}`);
      console.log(`Límite: ${limitNum} registros`);

      // Usar directamente el repositorio
      const excelBuffer = await this.libroMayorRepository.exportarExcel(
        conjunto as string,
        usuario as string,
        fechaInicioDate,
        fechaFinDate,
        limitNum
      );

      // Configurar headers para descarga
      const filename = `LibroMayor_${conjunto}_${usuario}_${fechaInicioDate.toISOString().split('T')[0]}_${fechaFinDate.toISOString().split('T')[0]}.xlsx`;
      
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.setHeader('Content-Length', (excelBuffer as Buffer).length.toString());

      res.status(200).send(excelBuffer);

      console.log('Archivo Excel enviado exitosamente');

    } catch (error) {
      console.error('Error en exportarExcel:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * GET /api/libro-mayor/health
   * Endpoint de salud para verificar que el servicio esté funcionando
   */
  async health(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: 'Libro Mayor Controller funcionando correctamente',
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    });
  }
}
