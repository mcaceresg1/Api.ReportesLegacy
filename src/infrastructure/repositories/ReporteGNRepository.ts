import { injectable } from "inversify";
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
} from "../../domain/entities/ReporteGN";
import { IReporteGNRepository } from "../../domain/repositories/IReporteGNRepository";
import { exactusSequelize } from "../database/config/exactus-database";
import { QueryTypes } from "sequelize";

@injectable()
export class ReporteGNRepository implements IReporteGNRepository {
  async getReporteAnualizado(
    conjunto: string,
    {
      codigo_nomina,
      periodo,
      filtro,
      cod_empleado,
    }: FiltrosReporteAnualizado
  ): Promise<RespuestaReporteAnualizado | undefined> {
    try {
      const query =
        filtro === "N"
          ? `
      exec dbo.PA_ERP_CN_DATOSANUALIZADO;1 '${conjunto}','E001','','','${cod_empleado}',2,'N',${codigo_nomina}
      `
          : `
      exec dbo.PA_ERP_CN_DATOSANUALIZADO;1 '${conjunto}','E001','','','${cod_empleado}',2,'P',${periodo}
      `;
      const data = (await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
      })) as GNReporteAnualizado[];
      return {
        data: data?.[0],
        message: "Reporte anualizado generado exitosamente",
        success: true,
      };
    } catch (error) {
      console.error("Error al obtener el reporte anualizado:", error);
      throw error;
    }
  }
  async getPrestamoCtaCte({
    cod_empleado,
    naturaleza,
  }: FiltrosReportePrestamoCtaCte): Promise<
    RespuestaReportePrestamoCtaCte | undefined
  > {
    try {
      const query = `
     SELECT 	m.num_movimiento,   m.fecha_ingreso,   m.forma_pago,   m.estado,   m.tipo_movimiento,   tm.descripcion,   m.numero_cuotas,   m.moneda,   
m.tasa_interes,   m.monto_local,   m.monto_dolar,   m.saldo_local,   m.saldo_dolar,   m.monto_int_local,   m.monto_int_dolar,   m.saldo_int_local,  
m.saldo_int_dolar,   m.fch_ult_modific,   m.usuario_apro,   
m.fecha_apro,   m.usuario_rh,   m.fecha_apro_rh,   m.tipo_cambio,   m.documento,   m.observaciones,  
m.empleado, m.RowPointer ,  LTRIM ( RTRIM(  CONVERT( VARCHAR(20 ),m.U_ESQUEMA_ORIGEN ) ) )   FROM 	
FIDPLAN.movimiento_cta_cte m,FIDPLAN. tipo_movimiento tm                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 WHERE TM.tipo_movimiento = M.tipo_movimiento 
AND  	M.empleado = '${cod_empleado}' AND  	TM.naturaleza = '${naturaleza}'   ORDER BY 1 ASC
      `;
      const data = (await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
      })) as GNPrestamoCuentaCorriente[];
      return {
        data,
        success: true,
        message:
          "Reporte de prestamo de cuenta corriente generado exitosamente",
      };
    } catch (error) {
      console.error(
        "Error al obtener el reporte de prestamo de cuenta corriente:",
        error
      );
      throw error;
    }
  }
  async getRolDeVacaciones(
    conjunto: string,
    {
      pagina = 1,
      registrosPorPagina = 10,
      fecha_fin,
      fecha_inicio,
      cod_empleado,
    }: FiltrosReporteRolDeVacaciones
  ): Promise<RespuestaReporteRolDeVacaciones | undefined> {
    try {
      const offset = (pagina - 1) * registrosPorPagina;

      const totalQuery = `
      SELECT COUNT(*) as total
      FROM (
      select e.empleado, fecha_inicio, fecha_fin, duracion, 'G' as tipo_vacacion, e.nombre        
    from FIDPLAN.empleado e, FIDPLAN.goce_real g  
    where 	e.empleado = g.empleado 
    and fecha_inicio >= '${fecha_inicio}'                    
    and  	fecha_inicio <= '${fecha_fin}'            
    AND e.empleado >= '${cod_empleado}'   
    union all  
    select e.empleado, fecha_inicio, fecha_inicio, duracion, 'D' as tipo_vacacion, e.nombre  
    from FIDPLAN.empleado e, FIDPLAN.descuento_real g  where 	e.empleado = g.empleado 
    and fecha_inicio >= '${fecha_inicio}'                    
    and  	fecha_inicio <= '${fecha_fin}'            
    AND e.empleado >= '${cod_empleado}' 
      ) as reporte
    `;
      const [totalResult]: any = await exactusSequelize.query(totalQuery, {
        type: QueryTypes.SELECT,
      });
      const total = parseInt(totalResult?.total, 10);
      const paginatedQuery = `
      SELECT *
      FROM (
       select e.empleado, fecha_inicio, fecha_fin, duracion, 'G' as tipo_vacacion, e.nombre        
    from FIDPLAN.empleado e, FIDPLAN.goce_real g  
    where 	e.empleado = g.empleado 
    and fecha_inicio >= '${fecha_inicio}'                    
    and  	fecha_inicio <= '${fecha_fin}'            
    AND e.empleado >= '${cod_empleado}'   
    union all  
    select e.empleado, fecha_inicio, fecha_inicio, duracion, 'D' as tipo_vacacion, e.nombre  
    from FIDPLAN.empleado e, FIDPLAN.descuento_real g  where 	e.empleado = g.empleado 
    and fecha_inicio >= '${fecha_inicio}'                    
    and  	fecha_inicio <= '${fecha_fin}'            
    AND e.empleado >= '${cod_empleado}' 
      ) as reporte
      ORDER BY empleado ASC
      OFFSET :offset ROWS FETCH NEXT ${registrosPorPagina} ROWS ONLY
    `;

      const [data] = await exactusSequelize.query(paginatedQuery, {
        replacements: { offset, limit: registrosPorPagina },
      });

      const totalPaginas = Math.ceil(total / registrosPorPagina);
      return {
        success: true,
        message: "Reporte de vacaciones generado exitosamente",
        totalRegistros: total,
        totalPaginas,
        paginaActual: pagina,
        registrosPorPagina: registrosPorPagina || 1000,
        data: data as GNRolDeVacaciones[],
      };
    } catch (err) {
      console.error("Error en getReportePaginado:", err);
      throw err;
    }
  }
  async getContratos(
    conjunto: string,
    { cod_empleado }: FiltrosReporteContratos
  ): Promise<RespuestaReporteContratos | undefined> {
    try {
      const query = `
     SELECT 	ec.empleado,e.nombre,ec.tipo_contrato,ec.fecha_inicio,ec.fecha_finalizacion,   ec.estado_contrato  
FROM 	 ${conjunto}.empleado_contrato ec(NOLOCK)
INNER JOIN ${conjunto}.empleado e(NOLOCK) ON ec.empleado = e.empleado 
INNER JOIN ${conjunto}.estado_empleado ep(NOLOCK) ON e.estado_empleado = ep.estado_empleado
WHERE e.empleado = ec.empleado AND UPPER(e.empleado) LIKE '${cod_empleado}'`;
      const data = (await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
      })) as GNContrato[];
      return {
        data,
        success: true,
        message: "Reporte de contratos generado exitosamente",
      };
    } catch (error) {
      console.error("Error al obtener los contratos:", error);
      throw error;
    }
  }

  async getAccionesDePersonal(
    conjunto: string,
    {
      fecha_accion_fin,
      fecha_accion_inicio,
      cod_empleado,
    }: FiltrosReporteAccionesDePersonal
  ): Promise<RespuestaReporteAccionesDePersonal | undefined> {
    try {
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
)  AND  fecha >= '${fecha_accion_inicio}'    AND  fecha <= '${fecha_accion_fin}'                
AND UPPER( ax.empleado ) LIKE '${cod_empleado}'  ORDER BY 1 ASC
      `;

      const data = (await exactusSequelize.query(query, {
        type: QueryTypes.SELECT,
      })) as GNAccionDePersonal[];
      return {
        data,
        success: true,
        message: "Reporte de acciones de personal generado exitosamente",
      };
    } catch (error) {
      console.error("Error al obtener las acciones de personal:", error);
      throw error;
    }
  }

  async getPrestamos(
    conjunto: string,
    filtros: FiltrosReportePrestamos
  ): Promise<RespuestaReportePrestamos | undefined> {
    // TODO: Implement getPrestamos method
    throw new Error("Method not implemented.");
  }

  async getBoletaDePago(
    conjunto: string,
    filtros: FiltrosBoletaDePago
  ): Promise<RespuestaReporteBoletasDePago | undefined> {
    // TODO: Implement getBoletaDePago method
    throw new Error("Method not implemented.");
  }
}
