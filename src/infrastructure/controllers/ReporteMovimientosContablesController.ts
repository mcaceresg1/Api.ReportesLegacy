import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import { IReporteMovimientosContablesService } from '../../domain/services/IReporteMovimientosContablesService';
import { FiltrosReporteMovimientosContables } from '../../domain/entities/ReporteMovimientosContables';

@injectable()
export class ReporteMovimientosContablesController {
  constructor(
    @inject('IReporteMovimientosContablesService')
    private readonly reporteMovimientosContablesService: IReporteMovimientosContablesService
  ) {}

  async obtenerReporteMovimientosContables(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const {
        usuario,
        fechaInicio,
        fechaFin,
        contabilidad,
        asientos,
        asientosExcluir,
        rangoAsientos,
        tiposAsiento,
        tiposAsientoExcluir,
        clasesAsiento,
        clasesAsientoExcluir,
        nits,
        nitsExcluir,
        centrosCosto,
        centrosCostoExcluir,
        referencias,
        referenciasExcluir,
        documentos,
        documentosExcluir,
        cuentasContables,
        cuentasContablesExcluir,
        criteriosCuentaContable,
        titulo,
        subtitulo,
        piePagina,
        mostrarTitulo,
        mostrarSubtitulo,
        mostrarPiePagina,
        camposPersonalizados,
        formatoExportacion,
        incluirTotales,
        incluirSubtotales,
        agruparPor,
        ordenarPor,
        orden,
        mostrarFiltros,
        mostrarResumen,
        maximoRegistros,
        incluirGraficos,
        incluirCalculos
      } = req.query;

      // Validar parámetros obligatorios
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es obligatorio'
        });
        return;
      }

      if (!usuario) {
        res.status(400).json({
          success: false,
          message: 'El usuario es obligatorio'
        });
        return;
      }

      if (!fechaInicio || !fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Las fechas de inicio y fin son obligatorias'
        });
        return;
      }

      // Construir objeto de filtros
      const filtros: FiltrosReporteMovimientosContables = {
        usuario: usuario as string,
        fechaInicio: new Date(fechaInicio as string),
        fechaFin: new Date(fechaFin as string),
        contabilidad: (contabilidad as 'F' | 'A' | 'T') || 'T',
        
        // Filtros de Asientos
        asientos: asientos ? (Array.isArray(asientos) ? asientos.map(a => Number(a)) : [Number(asientos)]) : [],
        asientosExcluir: asientosExcluir ? (Array.isArray(asientosExcluir) ? asientosExcluir.map(a => Number(a)) : [Number(asientosExcluir)]) : [],
        rangoAsientos: rangoAsientos ? JSON.parse(rangoAsientos as string) : undefined,
        
        // Filtros de Tipos de Asiento
        tiposAsiento: tiposAsiento ? (Array.isArray(tiposAsiento) ? tiposAsiento as string[] : [tiposAsiento as string]) : [],
        tiposAsientoExcluir: tiposAsientoExcluir ? (Array.isArray(tiposAsientoExcluir) ? tiposAsientoExcluir as string[] : [tiposAsientoExcluir as string]) : [],
        
        // Filtros de Clase Asiento
        clasesAsiento: clasesAsiento ? (Array.isArray(clasesAsiento) ? clasesAsiento as string[] : [clasesAsiento as string]) : [],
        clasesAsientoExcluir: clasesAsientoExcluir ? (Array.isArray(clasesAsientoExcluir) ? clasesAsientoExcluir as string[] : [clasesAsientoExcluir as string]) : [],
        
        // Filtros Otros
        nits: nits ? (Array.isArray(nits) ? nits as string[] : [nits as string]) : [],
        nitsExcluir: nitsExcluir ? (Array.isArray(nitsExcluir) ? nitsExcluir as string[] : [nitsExcluir as string]) : [],
        centrosCosto: centrosCosto ? (Array.isArray(centrosCosto) ? centrosCosto as string[] : [centrosCosto as string]) : [],
        centrosCostoExcluir: centrosCostoExcluir ? (Array.isArray(centrosCostoExcluir) ? centrosCostoExcluir as string[] : [centrosCostoExcluir as string]) : [],
        referencias: referencias ? (Array.isArray(referencias) ? referencias as string[] : [referencias as string]) : [],
        referenciasExcluir: referenciasExcluir ? (Array.isArray(referenciasExcluir) ? referenciasExcluir as string[] : [referenciasExcluir as string]) : [],
        documentos: documentos ? (Array.isArray(documentos) ? documentos as string[] : [documentos as string]) : [],
        documentosExcluir: documentosExcluir ? (Array.isArray(documentosExcluir) ? documentosExcluir as string[] : [documentosExcluir as string]) : [],
        
        // Filtros de Cuenta Contable
        cuentasContables: cuentasContables ? (Array.isArray(cuentasContables) ? cuentasContables as string[] : [cuentasContables as string]) : [],
        cuentasContablesExcluir: cuentasContablesExcluir ? (Array.isArray(cuentasContablesExcluir) ? cuentasContablesExcluir as string[] : [cuentasContablesExcluir as string]) : [],
        criteriosCuentaContable: criteriosCuentaContable ? JSON.parse(criteriosCuentaContable as string) : [],
        
        // Filtros de Títulos
        titulo: titulo as string || '',
        subtitulo: subtitulo as string || '',
        piePagina: piePagina as string || '',
        mostrarTitulo: mostrarTitulo === 'true',
        mostrarSubtitulo: mostrarSubtitulo === 'true',
        mostrarPiePagina: mostrarPiePagina === 'true',
        
        // Filtros de Campos Configurables
        camposPersonalizados: camposPersonalizados ? JSON.parse(camposPersonalizados as string) : [],
        formatoExportacion: (formatoExportacion as 'EXCEL' | 'PDF' | 'CSV' | 'HTML') || 'EXCEL',
        incluirTotales: incluirTotales === 'true',
        incluirSubtotales: incluirSubtotales === 'true',
        agruparPor: (agruparPor as 'NINGUNO' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'FECHA' | 'USUARIO') || 'NINGUNO',
        ordenarPor: (ordenarPor as 'FECHA' | 'CUENTA' | 'CENTRO_COSTO' | 'TIPO_ASIENTO' | 'CLASE_ASIENTO' | 'USUARIO' | 'VALOR') || 'FECHA',
        orden: (orden as 'ASC' | 'DESC') || 'ASC',
        mostrarFiltros: mostrarFiltros === 'true',
        mostrarResumen: mostrarResumen === 'true',
        maximoRegistros: maximoRegistros ? Number(maximoRegistros) : 1000,
        incluirGraficos: incluirGraficos === 'true',
        incluirCalculos: incluirCalculos === 'true'
      };

      console.log('Filtros recibidos en el controlador:', filtros);

      // Obtener el reporte del servicio (ahora retorna formato estandarizado)
      const resultado = await this.reporteMovimientosContablesService.obtenerReporteMovimientosContables(conjunto, filtros);

      // El servicio ya retorna el formato estandarizado, solo agregamos metadatos adicionales
      const respuesta = {
        ...resultado,
        filtrosAplicados: filtros,
        metadata: {
          conjunto,
          fechaGeneracion: new Date().toISOString(),
          usuario: filtros.usuario,
          formatoExportacion: filtros.formatoExportacion,
          agrupamiento: filtros.agruparPor,
          ordenamiento: filtros.ordenarPor,
          orden: filtros.orden,
          incluyeTotales: filtros.incluirTotales,
          incluyeSubtotales: filtros.incluirSubtotales,
          incluyeGraficos: filtros.incluirGraficos,
          incluyeCalculos: filtros.incluirCalculos
        }
      };

      res.json(respuesta);
    } catch (error) {
      console.error('Error en ReporteMovimientosContablesController:', error);
      res.status(500).json({
        success: false,
        message: 'Error al generar el reporte de movimientos contables',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  /**
   * @swagger
   * /api/reporte-movimientos-contables/{conjunto}/exportar-excel:
   *   post:
   *     summary: Exportar Reporte de Movimientos Contables a Excel
   *     description: Exporta el reporte de movimientos contables a formato Excel
   *     tags: [Reporte Movimientos Contables]
   *     parameters:
   *       - in: path
   *         name: conjunto
   *         required: true
   *         description: "Conjunto de datos (ej: EXACTUS)"
   *         schema: { type: string }
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FiltrosReporteMovimientosContables'
   *     responses:
   *       200:
   *         description: "Archivo Excel generado exitosamente"
   *         content:
   *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
   *             schema:
   *               type: string
   *               format: binary
   *       400:
   *         description: "Parámetros inválidos o faltantes"
   *       500:
   *         description: "Error interno del servidor"
   */
  async exportarExcel(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      const filtros = req.body;

      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'El parámetro conjunto es obligatorio'
        });
        return;
      }

      // Validar filtros mínimos
      if (!filtros.usuario || !filtros.fechaInicio || !filtros.fechaFin) {
        res.status(400).json({
          success: false,
          message: 'Los filtros usuario, fechaInicio y fechaFin son obligatorios'
        });
        return;
      }

      // Convertir fechas
      const filtrosValidados = {
        ...filtros,
        fechaInicio: new Date(filtros.fechaInicio),
        fechaFin: new Date(filtros.fechaFin)
      };

      // Obtener el reporte del servicio
      const resultados = await this.reporteMovimientosContablesService.obtenerReporteMovimientosContables(conjunto, filtrosValidados);

      // Generar Excel usando el servicio
      const excelBuffer = await this.reporteMovimientosContablesService.exportarExcel(conjunto, filtrosValidados);

      // Configurar headers para descarga
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="movimientos-contables-${conjunto}-${new Date().toISOString().split('T')[0]}.xlsx"`);
      
      res.send(excelBuffer);
    } catch (error) {
      console.error('Error al exportar Excel en ReporteMovimientosContablesController:', error);
      res.status(500).json({
        success: false,
        message: 'Error al exportar Excel',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
