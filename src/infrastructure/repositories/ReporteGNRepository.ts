import { injectable } from 'inversify';
import {
  FiltrosBoletaDePago,
  FiltrosReporteAccionesDePersonal,
  FiltrosReporteAnualizado,
  FiltrosReporteContratos,
  FiltrosReportePrestamoCtaCte,
  FiltrosReportePrestamos,
  FiltrosReporteRolDeVacaciones,
  GNAccionDePersonal,
  GNContrato,
  GNPrestamo,
  GNPrestamoCuentaCorriente,
  GNReporteAnualizado,
  GNRolDeVacaciones,
  RespuestaReporteAccionesDePersonal,
  RespuestaReporteAnualizado,
  RespuestaReporteBoletasDePago,
  RespuestaReporteContratos,
  RespuestaReportePrestamoCtaCte,
  RespuestaReportePrestamos,
  RespuestaReporteRolDeVacaciones,
} from '../../domain/entities/ReporteGN';
import { IReporteGNRepository } from '../../domain/repositories/IReporteGNRepository';
import { exactusSequelize } from '../database/config/exactus-database';
import { QueryTypes } from 'sequelize';
import * as XLSX from 'xlsx';

@injectable()
export class ReporteGNRepository implements IReporteGNRepository {
  async getReporteAnualizado(
    conjunto: string,
    filtros: FiltrosReporteAnualizado,
  ): Promise<RespuestaReporteAnualizado | undefined> {
    const { codigo_nomina, centro_costo, area, cod_empleado, activo, periodo } =
      filtros;
    try {
      const query =
        filtros.filtro === 'N'
          ? `
      exec dbo.PA_ERP_CN_DATOSANUALIZADO;1 :conjunto,:codigo_nomina,:centro_costo,:area,:cod_empleado, :activo,'N':periodo
      `
          : `
      exec dbo.PA_ERP_CN_DATOSANUALIZADO;1 :conjunto,:codigo_nomina,:centro_costo,:area,:cod_empleado, :activo,'P':periodo
      `;
      const data = (await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          conjunto,
          codigo_nomina,
          centro_costo,
          area,
          cod_empleado,
          activo,
          periodo,
        },
      })) as GNReporteAnualizado[];
      return {
        data: data?.[0],
        message: 'Reporte anualizado generado exitosamente',
        success: true,
      };
    } catch (error) {
      console.error('Error al obtener el reporte anualizado:', error);
      throw error;
    }
  }
  async getPrestamoCtaCte(
    conjunto: string,
    filtros: FiltrosReportePrestamoCtaCte,
  ): Promise<RespuestaReportePrestamoCtaCte | undefined> {
    try {
      const { cod_empleado, naturaleza } = filtros;
      const query = `
     SELECT 	m.num_movimiento,   m.fecha_ingreso,   m.forma_pago,   m.estado,   m.tipo_movimiento,   tm.descripcion,   m.numero_cuotas,   m.moneda,   
m.tasa_interes,   m.monto_local,   m.monto_dolar,   m.saldo_local,   m.saldo_dolar,   m.monto_int_local,   m.monto_int_dolar,   m.saldo_int_local,  
m.saldo_int_dolar,   m.fch_ult_modific,   m.usuario_apro,   
m.fecha_apro,   m.usuario_rh,   m.fecha_apro_rh,   m.tipo_cambio,   m.documento,   m.observaciones,  
m.empleado, m.RowPointer ,  LTRIM ( RTRIM(  CONVERT( VARCHAR(20 ),m.U_ESQUEMA_ORIGEN ) ) )   FROM 	
${conjunto}.movimiento_cta_cte m,${conjunto}.tipo_movimiento tm                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 WHERE TM.tipo_movimiento = M.tipo_movimiento 
AND  	M.empleado = :cod_empleado AND  	TM.naturaleza = :naturaleza   ORDER BY 1 ASC
      `;
      const data = (await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          cod_empleado,
          naturaleza,
        },
      })) as GNPrestamoCuentaCorriente[];
      return {
        data,
        success: true,
        message:
          'Reporte de prestamo de cuenta corriente generado exitosamente',
      };
    } catch (error) {
      console.error(
        'Error al obtener el reporte de prestamo de cuenta corriente:',
        error,
      );
      throw error;
    }
  }
  async getRolDeVacaciones(
    conjunto: string,
    filtros: FiltrosReporteRolDeVacaciones,
  ): Promise<RespuestaReporteRolDeVacaciones | undefined> {
    try {
      const {
        cod_empleado,
        fecha_fin,
        fecha_inicio,
        pagina,
        registrosPorPagina,
      } = filtros;
      const offset = (pagina - 1) * registrosPorPagina;   
      const limit = registrosPorPagina;

      const totalQuery = `
      SELECT COUNT(*) as total
      FROM (
      select e.empleado, fecha_inicio, fecha_fin, duracion, 'G' as tipo_vacacion, e.nombre        
    from ${conjunto}.empleado e, ${conjunto}.goce_real g  
    where 	e.empleado = g.empleado 
    and fecha_inicio >= :fecha_inicio                    
    and  	fecha_inicio <= :fecha_fin     
    AND e.empleado >= :cod_empleado
    union all  
    select e.empleado, fecha_inicio, fecha_inicio, duracion, 'D' as tipo_vacacion, e.nombre  
    from ${conjunto}.empleado e, ${conjunto}.descuento_real g  where 	e.empleado = g.empleado 
    and fecha_inicio >= :fecha_inicio                    
    and  	fecha_inicio <= :fecha_fin     
    AND e.empleado >= :cod_empleado
      ) as reporte
    `;
      const [totalResult]: any = await exactusSequelize.query(totalQuery, {
        type: QueryTypes.SELECT,
        replacements: {
          fecha_inicio,
          fecha_fin,
          cod_empleado,
        },
      });
      const total = parseInt(totalResult?.total, 10);
      
      const paginatedQuery = `
      SELECT *
      FROM (
       select e.empleado, fecha_inicio, fecha_fin, duracion, 'G' as tipo_vacacion, e.nombre        
    from ${conjunto}.empleado e, ${conjunto}.goce_real g  
    where 	e.empleado = g.empleado 
    and fecha_inicio >= :fecha_inicio                    
    and  	fecha_inicio <= :fecha_fin            
    AND e.empleado >= :cod_empleado   
    union all  
    select e.empleado, fecha_inicio, fecha_inicio, duracion, 'D' as tipo_vacacion, e.nombre  
    from ${conjunto}.empleado e, ${conjunto}.descuento_real g  where 	e.empleado = g.empleado 
    and fecha_inicio >= :fecha_inicio                    
    and  	fecha_inicio <= :fecha_fin            
    AND e.empleado >= :cod_empleado 
      ) as reporte
      ORDER BY empleado ASC
      OFFSET ${offset} ROWS FETCH NEXT ${limit} ROWS ONLY
    `;

      const [data] = await exactusSequelize.query(paginatedQuery, {
        replacements: {
          offset,
          limit: registrosPorPagina,
          cod_empleado,
          fecha_fin,
          fecha_inicio,
        },
      });

      const totalPaginas = Math.ceil(total / registrosPorPagina);
      return {
        success: true,
        message: 'Reporte de vacaciones generado exitosamente',
        totalRegistros: total,
        totalPaginas,
        paginaActual: pagina,
        registrosPorPagina: registrosPorPagina || 1000,
        data: data as GNRolDeVacaciones[],
      };
    } catch (err) {
      console.error('Error en getReportePaginado:', err);
      throw err;
    }
  }
  async getContratos(
    conjunto: string,
    filtros: FiltrosReporteContratos,
  ): Promise<RespuestaReporteContratos | undefined> {
    try {
      const { cod_empleado } = filtros;
      const query = `
     SELECT 	ec.empleado,e.nombre,ec.tipo_contrato,ec.fecha_inicio,ec.fecha_finalizacion,   ec.estado_contrato  
FROM 	 ${conjunto}.empleado_contrato ec(NOLOCK)
INNER JOIN ${conjunto}.empleado e(NOLOCK) ON ec.empleado = e.empleado 
INNER JOIN ${conjunto}.estado_empleado ep(NOLOCK) ON e.estado_empleado = ep.estado_empleado
WHERE e.empleado = ec.empleado AND UPPER( ec.empleado) LIKE :cod_empleado`;
      const data = (await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          cod_empleado,
        },
      })) as GNContrato[];
      return {
        data,
        success: true,
        message: 'Reporte de contratos generado exitosamente',
      };
    } catch (error) {
      console.error('Error al obtener los contratos:', error);
      throw error;
    }
  }

  async getPrestamos(
    conjunto: string,
    filtros: FiltrosReportePrestamos,
  ): Promise<RespuestaReportePrestamos | undefined> {
    try {
      const {
        cod_empleado,
        estado_cuota,
        estado_empleado,
        estado_prestamo,
        num_nomina,
        numero_nomina,
        tipo_prestamo,
      } = filtros;
      const query = `
 exec dbo.PA_RH_PRESTAMOS_DETALLE_RESUMEN;1 :conjunto,'ADMPQUES',:tipo_prestamo,:estado_prestamo,:num_nomina,:cod_empleado,:estado_empleado, :estado_cuota'
      `;

      const data = (await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          cod_empleado,
          estado_cuota,
          estado_empleado,
          estado_prestamo,
          num_nomina,
          numero_nomina,
          tipo_prestamo,
          conjunto,
        },
      })) as GNPrestamo[];
      return {
        data,
        success: true,
        message: 'Reporte de acciones de personal generado exitosamente',
      };
    } catch (error) {
      console.error('Error al obtener las acciones de personal:', error);
      throw error;
    }
  }

  async getBoletaDePago(
    conjunto: string,
    filtros: FiltrosBoletaDePago,
  ): Promise<RespuestaReporteBoletasDePago | undefined> {
    try {
      const { cod_empleado, num_nomina } = filtros;

      // 1. Periodo planilla
      const queryPeriodo = `exec dbo.PA_ERP_CN_PERIODOPLANILLA;1 :conjunto,:num_nomina`;
      const periodoPlanilla = (await exactusSequelize.query(queryPeriodo, {
        type: QueryTypes.SELECT,
        replacements: { conjunto, num_nomina },
      })) as any[];

      // 2. Datos compañía
      const queryCompania = `exec dbo.PA_ERP_CN_BLDATOCOMPANIA_V2;1 :conjunto`;
      const datosCompania = (await exactusSequelize.query(queryCompania, {
        type: QueryTypes.SELECT,
        replacements: { conjunto },
      })) as any[];

      // 3. Datos boleta
      const queryDatosBoleta = `exec dbo.PA_ERP_CN_BLDATOSBOLETA;1 :conjunto,:num_nomina,'','','',:cod_empleado`;
      const datosBoleta = (await exactusSequelize.query(queryDatosBoleta, {
        type: QueryTypes.SELECT,
        replacements: { conjunto, num_nomina, cod_empleado },
      })) as any[];

      // 4. Horas y días
      const queryHorasDias = `exec dbo.PA_ERP_CN_BLDATOSHORASDIAS;1 :conjunto,:num_nomina,'','','',:cod_empleado`;
      const horasDias = (await exactusSequelize.query(queryHorasDias, {
        type: QueryTypes.SELECT,
        replacements: { conjunto, num_nomina, cod_empleado },
      })) as any[];

      // 5. Goce real boleta
      const queryGoceReal = `exec dbo.PA_ERP_CN_GOCEREALBOLETA;1 :conjunto,:num_nomina,'','','',:cod_empleado`;
      const goceReal = (await exactusSequelize.query(queryGoceReal, {
        type: QueryTypes.SELECT,
        replacements: { conjunto, num_nomina, cod_empleado },
      })) as any[];

      // 6. Aportes
      const queryAportes = `exec dbo.PA_ERP_CN_APORTESBOLETA;1 :conjunto,:num_nomina,'','','',:cod_empleado`;
      const aportes = (await exactusSequelize.query(queryAportes, {
        type: QueryTypes.SELECT,
        replacements: { conjunto, num_nomina, cod_empleado },
      })) as any[];

      // 7. Descuentos
      const queryDescuentos = `exec dbo.PA_ERP_CN_DESCUENTOSBOLETA;1 :conjunto,:num_nomina,'','','',:cod_empleado`;
      const descuentos = (await exactusSequelize.query(queryDescuentos, {
        type: QueryTypes.SELECT,
        replacements: { conjunto, num_nomina, cod_empleado },
      })) as any[];

      // 8. Ingresos
      const queryIngresos = `exec dbo.PA_ERP_CN_INGRESOSBOLETA;1 :conjunto,:num_nomina,'','','',:cod_empleado`;
      const ingresos = (await exactusSequelize.query(queryIngresos, {
        type: QueryTypes.SELECT,
        replacements: { conjunto, num_nomina, cod_empleado },
      })) as any[];

      return {
        data: {
          periodo_planilla: periodoPlanilla?.[0],
          boleta: datosBoleta?.[0],
          compania: datosCompania?.[0],
          horas_dias: horasDias?.[0],
          ingresos: ingresos?.[0],
          aportes: aportes?.[0],
          descuentos: descuentos?.[0],
          goce_real: goceReal?.[0],
        },
        success: true,
        message: 'Reporte de acciones de personal generado exitosamente',
      };
    } catch (error) {
      console.error('Error al obtener las acciones de personal:', error);
      throw error;
    }
  }

  async getAccionesDePersonal(
    conjunto: string,
    filtros: FiltrosReporteAccionesDePersonal,
  ): Promise<RespuestaReporteAccionesDePersonal> {
    try {
      const { cod_empleado, fecha_accion_fin, fecha_accion_inicio } = filtros;
      const query = `
USE EXACTUS;
SELECT 	ax.numero_accion,  ta.descripcion AS descripcion_accion,  ax.estado_accion,  ax.fecha,  ax.empleado,  emp.nombre,  
ax.fecha_rige,  ax.fecha_vence,  ax.puesto,  ax.plaza,  ax.salario_promedio,  ax.salario_diario_int, 
ax.departamento,  ax.centro_costo,  ax.nomina,  ax.dias_accion,  ax.saldo,  
axp.numero_accion AS numero_accion_cuenta,  ax.regimen_vacacional,  
ta.descripcion, ax.RowPointer ,  LTRIM ( RTRIM(  LTRIM(STR( ax.U_NUM_ACCION_ORIGEN, 10, 0 ))  ) )  AS origen
FROM 	${conjunto}.empleado_acc_per ax 
inner join ${conjunto}.empleado emp ON ax.empleado = emp.empleado  
left join ${conjunto}.acc_per_impresion axp ON ax.numero_accion = axp.numero_accion AND 'ADMPQUES'=  axp.usuario 
inner join ${conjunto}.tipo_accion ta  ON ax.tipo_accion = ta.tipo_accion                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
WHERE  ( UPPER( ta.tipo_accion ) = 'V004' 
OR UPPER( ta.tipo_accion ) = 'V003' 
OR UPPER( ta.tipo_accion ) = 'V002'
OR UPPER( ta.tipo_accion ) = 'V001' 
OR UPPER( ta.tipo_accion ) = 'SP01' 
OR UPPER( ta.tipo_accion ) = 'S002' 
OR UPPER( ta.tipo_accion ) = 'S001' 
OR UPPER( ta.tipo_accion ) = 'RE01' 
OR UPPER( ta.tipo_accion ) = 'PE03'
OR UPPER( ta.tipo_accion ) = 'PE02' 
OR UPPER( ta.tipo_accion ) = 'PE01' 
OR UPPER( ta.tipo_accion ) = 'IN01' 
OR UPPER( ta.tipo_accion ) = 'GV01' 
OR UPPER( ta.tipo_accion ) = 'D001'
OR UPPER( ta.tipo_accion ) = 'CP01' 
OR UPPER( ta.tipo_accion ) = 'CO01' 
OR UPPER( ta.tipo_accion ) = 'CN01' 
OR UPPER( ta.tipo_accion ) = 'CE02' 
OR UPPER( ta.tipo_accion ) = 'CE01' 
OR UPPER( ta.tipo_accion ) = 'CD01' 
OR UPPER( ta.tipo_accion ) = 'AS01' 
OR UPPER( ta.tipo_accion ) = 'AC01' 
OR UPPER( ta.tipo_accion ) = 'A001'
)  AND  fecha >= :fecha_accion_inicio    AND  fecha <= :fecha_accion_fin           
AND UPPER( ax.empleado ) LIKE :cod_empleado  ORDER BY 1 ASC
    `;

      const data = (await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
        replacements: {
          cod_empleado,
          fecha_accion_fin,
          fecha_accion_inicio,
        },
      })) as GNAccionDePersonal[];
      return {
        data,
        success: true,
        message: 'Reporte de acciones de personal generado exitosamente',
      };
    } catch (error) {
      console.error('Error al obtener las acciones de personal:', error);
      throw error;
    }
  }

  async exportarContratosExcel(
    conjunto: string,
    filtros: FiltrosReporteContratos,
  ): Promise<Buffer> {
    const result = await this.getContratos(conjunto, filtros);

    if (!result || !result.success || !result.data) {
      throw new Error('No se pudo obtener el reporte');
    }

    const excelData = result.data.map((c: GNContrato) => ({
      Empleado: c.empleado,
      Nombre: c.nombre,
      'Tipo Contrato': c.tipo_contrato,
      'Fecha Inicio': c.fecha_inicio
        ? new Date(c.fecha_inicio).toLocaleDateString('es-ES')
        : '',
      'Fecha Finalización': c.fecha_finalizacion
        ? new Date(c.fecha_finalizacion).toLocaleDateString('es-ES')
        : '',
      'Estado Contrato': c.estado_contrato,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Contratos');

    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });
  }

  async exportarRolDeVacacionesExcel(
    conjunto: string,
    filtros: FiltrosReporteRolDeVacaciones,
  ): Promise<Buffer> {
    const result = await this.getRolDeVacaciones(conjunto, filtros);

    if (!result || !result.success || !result.data) {
      throw new Error('No se pudo obtener el reporte');
    }

    const excelData = result.data.map((r: GNRolDeVacaciones) => ({
      Empleado: r.empleado,
      Nombre: r.nombre,
      'Fecha Inicio': r.fecha_inicio
        ? new Date(r.fecha_inicio).toLocaleDateString('es-ES')
        : '',
      'Fecha Fin': r.fecha_fin
        ? new Date(r.fecha_fin).toLocaleDateString('es-ES')
        : '',
      Duración: r.duracion,
      'Tipo Vacación': r.tipo_vacacion,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rol de Vacaciones');

    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });
  }

  async exportarAnualizadoExcel(
    conjunto: string,
    filtros: FiltrosReporteAnualizado,
  ): Promise<Buffer> {
    const result = await this.getReporteAnualizado(conjunto, filtros);

    if (!result || !result.success || !result.data) {
      throw new Error('No se pudo obtener el reporte');
    }
    const data = result.data ? [result.data] : [];

    const excelData = data.map((a: GNReporteAnualizado) => ({
      Esquema: a.esquema,
      Código: a.codigo,
      Nómina: a.nomina,
      Empleado: a.empleado,
      'Fecha Ingreso': a.fecha_ingreso
        ? new Date(a.fecha_ingreso).toLocaleDateString('es-ES')
        : '',
      'Fecha Salida': a.fecha_salida
        ? new Date(a.fecha_salida).toLocaleDateString('es-ES')
        : '',
      'Centro Costo': a.centro_costo,
      Sede: a.sede,
      Puesto: a.puesto,
      Essalud: a.essalud,
      AFP: a.afp,
      CUSPP: a.cuspp,
      Estado: a.estado,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Anualizado');

    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });
  }

  async exportarPrestamoCtaCteExcel(
    conjunto: string,
    filtros: FiltrosReportePrestamoCtaCte,
  ): Promise<Buffer> {
    const result = await this.getPrestamoCtaCte(conjunto, filtros);

    if (!result || !result.success || !result.data) {
      throw new Error('No se pudo obtener el reporte');
    }

    const excelData = result.data.map((p: GNPrestamoCuentaCorriente) => ({
      'N° Movimiento': p.num_movimiento,
      'Fecha Ingreso': p.fecha_ingreso
        ? new Date(p.fecha_ingreso).toLocaleDateString('es-ES')
        : '',
      'Forma Pago': p.forma_pago,
      Estado: p.estado,
      'Tipo Movimiento': p.tipo_movimiento,
      Descripción: p.descripcion,
      'N° Cuotas': p.numero_cuotas,
      Moneda: p.moneda,
      'Tasa Interés': p.tasa_interes,
      'Monto Local': p.monto_local,
      'Monto Dólar': p.monto_dolar,
      'Saldo Local': p.saldo_local,
      'Saldo Dólar': p.saldo_dolar,
      'Monto Interés Local': p.monto_int_local,
      'Monto Interés Dólar': p.monto_int_dolar,
      'Saldo Interés Local': p.saldo_int_local,
      'Saldo Interés Dólar': p.saldo_int_dolar,
      'Última Modificación': p.fch_ult_modific
        ? new Date(p.fch_ult_modific).toLocaleDateString('es-ES')
        : '',
      Documento: p.documento,
      Observaciones: p.observaciones,
      Empleado: p.empleado,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 20 },
      { wch: 30 },
      { wch: 10 },
      { wch: 10 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
    ];
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Prestamos Cta Cte');

    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });
  }

  async exportarAccionesDePersonalExcel(
    conjunto: string,
    filtros: FiltrosReporteAccionesDePersonal,
  ): Promise<Buffer> {
    const result = await this.getAccionesDePersonal(conjunto, filtros);

    if (!result.success || !result.data) {
      throw new Error('No se pudo obtener el reporte de Acciones de Personal');
    }

    // Preparar data para Excel
    const excelData = result.data.map((item: GNAccionDePersonal) => ({
      'Número Acción': item.numero_accion,
      'Descripción Acción': item.descripcion_accion || '',
      'Estado Acción': item.estado_accion || '',
      Fecha: item.fecha ? new Date(item.fecha).toLocaleDateString('es-ES') : '',
      Empleado: item.empleado,
      Nombre: item.nombre,
      'Fecha Rige': item.fecha_rige
        ? new Date(item.fecha_rige).toLocaleDateString('es-ES')
        : '',
      'Fecha Vence': item.fecha_vence
        ? new Date(item.fecha_vence).toLocaleDateString('es-ES')
        : '',
      Puesto: item.puesto,
      Plaza: item.plaza,
      'Salario Promedio': item.salario_promedio,
      'Salario Diario Int': item.salario_diario_int,
      Departamento: item.departamento,
      'Centro Costo': item.centro_costo,
      Nómina: item.nomina,
      'Días Acción': item.dias_accion,
      Saldo: item.saldo,
      'Número Acción Cuenta': item.numero_accion_cuenta,
      'Régimen Vacacional': item.regimen_vacacional,
      Descripción: item.descripcion,
      Origen: item.origen,
    }));

    // Totales
    const totalSalarioPromedio = result.data.reduce(
      (sum, i) => sum + (i.salario_promedio || 0),
      0,
    );
    const totalSalarioDiarioInt = result.data.reduce(
      (sum, i) => sum + (i.salario_diario_int || 0),
      0,
    );
    const totalDiasAccion = result.data.reduce(
      (sum, i) => sum + (i.dias_accion || 0),
      0,
    );
    const totalSaldo = result.data.reduce((sum, i) => sum + (i.saldo || 0), 0);

    const totalRow: any = {
      'Número Acción': '',
      'Descripción Acción': '',
      'Estado Acción': '',
      Fecha: '',
      Empleado: '',
      Nombre: '',
      'Fecha Rige': '',
      'Fecha Vence': '',
      Puesto: '',
      Plaza: 'TOTAL GENERAL',
      'Salario Promedio': totalSalarioPromedio,
      'Salario Diario Int': totalSalarioDiarioInt,
      Departamento: '',
      'Centro Costo': '',
      Nómina: '',
      'Días Acción': totalDiasAccion,
      Saldo: totalSaldo,
      'Número Acción Cuenta': '',
      'Régimen Vacacional': '',
      Descripción: '',
      Origen: '',
    };

    // Insertar fila vacía + totales
    const emptyRow = Object.fromEntries(
      Object.keys(totalRow).map((k) => [k, '']),
    );
    const finalData = [...excelData, emptyRow, totalRow];

    // Crear Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(finalData);

    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 30 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 30 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 25 },
      { wch: 25 },
      { wch: 30 },
      { wch: 20 },
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Acciones de Personal');

    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });
  }

  async exportarPrestamosExcel(
    conjunto: string,
    filtros: FiltrosReportePrestamos,
  ): Promise<Buffer> {
    const result = await this.getPrestamos(conjunto, filtros);

    if (!result?.success || !result.data) {
      throw new Error('No se pudo obtener el reporte de préstamos');
    }

    const excelData = result.data.map((item) => ({
      ESQUEMA: item.ESQUEMA,
      DNI: item.DNI,
      'Apellidos y Nombres': item.APELLIDOS_NOMBRES,
      'Fecha Ingreso Empleado': item.FECHA_INGRESO_EMPLEADO,
      Puesto: item.PUESTO,
      Sede: item.SEDE,
      'Centro Costo': item.CENTRO_COSTO,
      'Descripción CC': item.DESCRIPCION_CC,
      'N° Movimiento': item.NUM_MOVIMIENTO,
      'Cod. Tipo Movimiento': item.COD_TIPO_MOVIMIENTO,
      'Tipo Movimiento': item.TIPO_MOVIMIENTO,
      Moneda: item.MONEDA,
      'N° Nómina': item.NUMERO_NOMINA,
      'Nómina Mes': item.NOMINA_MES,
      'N° Cuota Desc.': item.NUMERO_CUOTA_DESCONTADA,
      'Monto Desc. (S/)': item.MONTO_CUOTA_DESCONTADA,
      'Monto Desc. ($)': item.MONTO_CUOTA_DESCONTADA_DOLAR,
      'Estado Cuota': item.ESTADO_CUOTA_DESCONTADA,
      'Monto Local': item.MONTO_LOCAL,
      'Monto Abonado Cuota': item.MONTO_ABONADO_CUOTA,
      'Saldo Cuota': item.SALDO_CUOTA,
      'Monto Abonado': item.MONTO_ABONADO,
      'Fecha Ingreso': item.FECHA_INGRESO,
      'N° Cuotas': item.NUM_CUOTAS,
      'Saldo Local': item.SALDO_LOCAL,
      'Cod. Estado Préstamo': item.CODIGO_ESTADO_PRESTAMO,
      'Estado Préstamo': item.ESTADO_PRESTAMO,
      Diferencia: item.DIFERENCIA,
      'Estado Saldo': item.ESTADO_SALDO,
      'Fecha Creación Sistema': item.FECHA_CREACION_SISTEMA,
      'Estado Empleado': item.ESTADO_EMPLEADO,
      'Fecha Salida': item.FECHA_SALIDA,
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(excelData);

    if (excelData.length === 0) {
      throw new Error('No hay datos para exportar');
    }

    worksheet['!cols'] = Object.keys(excelData[0]!).map(() => ({ wch: 20 }));
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Préstamos');

    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });
  }

  async exportarBoletaDePagoExcel(
    conjunto: string,
    filtros: FiltrosBoletaDePago,
  ): Promise<Buffer> {
    const result = await this.getBoletaDePago(conjunto, filtros);

    if (!result?.success || !result.data) {
      throw new Error('No se pudo obtener la Boleta de Pago');
    }

    const {
      periodo_planilla,
      compania,
      boleta,
      horas_dias,
      ingresos,
      aportes,
      descuentos,
      goce_real,
    } = result.data;

    // Preparamos cada sección en hojas separadas
    const workbook = XLSX.utils.book_new();

    if (periodo_planilla) {
      const wsPeriodo = XLSX.utils.json_to_sheet([periodo_planilla]);
      XLSX.utils.book_append_sheet(workbook, wsPeriodo, 'Periodo Planilla');
    }

    if (compania) {
      const wsCompania = XLSX.utils.json_to_sheet([compania]);
      XLSX.utils.book_append_sheet(workbook, wsCompania, 'Compañía');
    }

    if (boleta) {
      const wsBoleta = XLSX.utils.json_to_sheet([boleta]);
      XLSX.utils.book_append_sheet(workbook, wsBoleta, 'Boleta');
    }

    if (horas_dias) {
      const wsHoras = XLSX.utils.json_to_sheet([horas_dias]);
      XLSX.utils.book_append_sheet(workbook, wsHoras, 'Horas y Días');
    }

    if (ingresos) {
      const wsIngresos = XLSX.utils.json_to_sheet([ingresos]);
      XLSX.utils.book_append_sheet(workbook, wsIngresos, 'Ingresos');
    }

    if (aportes) {
      const wsAportes = XLSX.utils.json_to_sheet([aportes]);
      XLSX.utils.book_append_sheet(workbook, wsAportes, 'Aportes');
    }

    if (descuentos) {
      const wsDescuentos = XLSX.utils.json_to_sheet([descuentos]);
      XLSX.utils.book_append_sheet(workbook, wsDescuentos, 'Descuentos');
    }

    if (goce_real) {
      const wsGoce = XLSX.utils.json_to_sheet([goce_real]);
      XLSX.utils.book_append_sheet(workbook, wsGoce, 'Goce Real');
    }

    return XLSX.write(workbook, {
      type: 'buffer',
      bookType: 'xlsx',
      compression: true,
    });
  }
}
