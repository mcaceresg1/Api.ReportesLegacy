import { injectable, inject } from 'inversify';
import { IReporteLibroMayorRepository } from '../../domain/repositories/IReporteLibroMayorRepository';
import { ReporteLibroMayorItem, FiltrosReporteLibroMayor, ResumenLibroMayor } from '../../domain/entities/ReporteLibroMayor';
import { IDatabaseService } from '../../domain/services/IDatabaseService';
import { DynamicModel } from '../database/models/DynamicModel';

@injectable()
export class ReporteLibroMayorRepository implements IReporteLibroMayorRepository {
  constructor(
    @inject('IDatabaseService') private readonly databaseService: IDatabaseService
  ) {}

  async generarReporteLibroMayor(filtros: FiltrosReporteLibroMayor): Promise<ReporteLibroMayorItem[]> {
    try {
      // Limpiar datos temporales anteriores
      await this.limpiarDatosTemporales(filtros.usuario);

      // Obtener período contable reciente
      const periodoContable = await this.obtenerPeriodoContableReciente(filtros.fechaInicio, filtros.contabilidad);

      // Insertar saldos iniciales
      await this.insertarSaldosIniciales(filtros.usuario, filtros.fechaInicio, filtros.fechaFin, filtros.contabilidad);

      // Insertar movimientos del mayor
      await this.insertarMovimientosMayor(filtros.usuario, filtros.fechaInicio, filtros.fechaFin, filtros.contabilidad);

      // Insertar movimientos del diario
      await this.insertarMovimientosDiario(filtros.usuario, filtros.fechaInicio, filtros.fechaFin, filtros.contabilidad);

      // Actualizar períodos contables
      await this.actualizarPeriodosContables(filtros.usuario);

      // Transferir datos a tabla XML
      await this.transferirDatosATablaXML(filtros.usuario);

      // Ejecutar procedimiento almacenado
      const datos = await this.ejecutarProcedimientoReporte();

      return datos;
    } catch (error) {
      console.error('Error al generar reporte de Libro Mayor:', error);
      throw new Error(`Error al generar reporte de Libro Mayor: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async obtenerResumenLibroMayor(filtros: FiltrosReporteLibroMayor): Promise<ResumenLibroMayor> {
    try {
      const datos = await this.generarReporteLibroMayor(filtros);
      
      const resumen: ResumenLibroMayor = {
        totalCuentas: new Set(datos.map(d => d.cuentaContable)).size,
        totalCentrosCosto: new Set(datos.map(d => d.centroCosto)).size,
        totalAsientos: new Set(datos.map(d => d.asiento)).size,
        totalMovimientos: datos.filter(d => d.tipoLinea === 2).length,
        saldoTotalDeudor: datos.reduce((sum, d) => sum + (d.saldoDeudor || 0), 0),
        saldoTotalAcreedor: datos.reduce((sum, d) => sum + (d.saldoAcreedor || 0), 0),
        saldoTotalDeudorDolar: datos.reduce((sum, d) => sum + (d.saldoDeudorDolar || 0), 0),
        saldoTotalAcreedorDolar: datos.reduce((sum, d) => sum + (d.saldoAcreedorDolar || 0), 0),
        totalDebito: datos.reduce((sum, d) => sum + (d.debitoLocal || 0), 0),
        totalCredito: datos.reduce((sum, d) => sum + (d.creditoLocal || 0), 0),
        totalDebitoDolar: datos.reduce((sum, d) => sum + (d.debitoDolar || 0), 0),
        totalCreditoDolar: datos.reduce((sum, d) => sum + (d.creditoDolar || 0), 0),
        periodoContableInicio: filtros.fechaInicio.toISOString().split('T')[0] || '',
        periodoContableFin: filtros.fechaFin.toISOString().split('T')[0] || '',
        fechaGeneracion: new Date(),
        usuarioGeneracion: filtros.usuario
      };

      return resumen;
    } catch (error) {
      console.error('Error al obtener resumen del Libro Mayor:', error);
      throw new Error(`Error al obtener resumen del Libro Mayor: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  async limpiarDatosTemporales(usuario: string): Promise<boolean> {
    try {
      const conexion = await this.databaseService.obtenerConexion();
      const dynamicModel = new DynamicModel(conexion);

      // Limpiar tabla temporal REPCG_MAYOR
      const queryDelete = `DELETE FROM PRLTRA.REPCG_MAYOR WHERE USUARIO = ?`;
      await dynamicModel.executeQuery(queryDelete, [usuario]);

      // Limpiar tabla de reporte XML
      const queryDeleteXML = `DELETE FROM PRLTRA.R_XML_8DDC3925E54E9CF`;
      await dynamicModel.executeQuery(queryDeleteXML, []);

      return true;
    } catch (error) {
      console.error('Error al limpiar datos temporales:', error);
      return false;
    }
  }

  async obtenerPeriodoContableReciente(fecha: Date, contabilidad: 'F' | 'A' | 'T'): Promise<Date> {
    try {
      const conexion = await this.databaseService.obtenerConexion();
      const dynamicModel = new DynamicModel(conexion);

      const query = `
        SELECT MAX(fecha_final) as fecha_final
        FROM PRLTRA.periodo_contable 
        WHERE contabilidad = ? 
        AND fecha_final < ?
      `;

      const resultado = await dynamicModel.executeQuery(query, [contabilidad, fecha]);
      
      if (resultado && resultado.length > 0 && resultado[0].fecha_final) {
        return new Date(resultado[0].fecha_final);
      }

      // Si no hay período contable, usar la fecha actual
      return new Date();
    } catch (error) {
      console.error('Error al obtener período contable reciente:', error);
      return new Date();
    }
  }

  async insertarSaldosIniciales(
    usuario: string, 
    fechaInicio: Date, 
    fechaFin: Date, 
    contabilidad: 'F' | 'A' | 'T'
  ): Promise<boolean> {
    try {
      const conexion = await this.databaseService.obtenerConexion();
      const dynamicModel = new DynamicModel(conexion);

      const query = `
        INSERT INTO PRLTRA.REPCG_MAYOR  
        (CUENTA, FECHA, SALDO_DEUDOR, SALDO_DEUDOR_DOLAR, SALDO_ACREEDOR, 
        SALDO_ACREEDOR_DOLAR, ASIENTO, ORIGEN, FUENTE, REFERENCIA, TIPO_LINEA,  
        CENTRO_COSTO, DESCRIPCION, ACEPTA, CONSECUTIVO, TIPO_ASIENTO, NIT, NIT_NOMBRE, USUARIO)
        SELECT 
          SUBSTRING(M.CUENTA_CONTABLE, 1, 2) AS CUENTA,  
          ? AS FECHA,   
          (CASE CC.SALDO_NORMAL WHEN 'D' THEN ISNULL(DEBITO_LOCAL, 0) - ISNULL(CREDITO_LOCAL, 0) ELSE 0 END) AS DEBITO_LOCAL, 
          (CASE CC.SALDO_NORMAL WHEN 'D' THEN ISNULL(DEBITO_DOLAR, 0) - ISNULL(CREDITO_DOLAR, 0) ELSE 0 END) AS DEBITO_DOLAR,  
          (CASE CC.SALDO_NORMAL WHEN 'A' THEN ISNULL(CREDITO_LOCAL, 0) - ISNULL(DEBITO_LOCAL, 0) ELSE 0 END) AS CREDITO_LOCAL,  
          (CASE CC.SALDO_NORMAL WHEN 'A' THEN ISNULL(CREDITO_DOLAR, 0) - ISNULL(DEBITO_DOLAR, 0) ELSE 0 END) AS CREDITO_DOLAR, 
          '' AS ASIENTO,  
          '' AS ORIGEN,  
          '' AS FUENTE,  
          '' AS REFERENCIA,   
          '1' AS TIPO_LINEA,  
          '' AS CENTRO_COSTO, 
          CC.DESCRIPCION AS DESCRIPCION,  
          CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END AS ACEPTA,  
          NULL AS CONSECUTIVO,  
          NULL AS TIPO_ASIENTO,  
          NULL AS NIT,  
          NULL AS NIT_NOMBRE,  
          ? AS USUARIO    
        FROM (    
          SELECT  
            M.centro_costo,  
            M.cuenta_contable,  	
            CASE WHEN M.saldo_fisc_local > 0 THEN ABS(M.saldo_fisc_local) ELSE 0 END AS debito_local,  	
            CASE WHEN M.saldo_fisc_local < 0 THEN ABS(M.saldo_fisc_local) ELSE 0 END AS credito_local,  	
            CASE WHEN M.saldo_fisc_dolar > 0 THEN ABS(M.saldo_fisc_dolar) ELSE 0 END AS debito_dolar,  	
            CASE WHEN M.saldo_fisc_dolar < 0 THEN ABS(M.saldo_fisc_dolar) ELSE 0 END AS credito_dolar   	 
          FROM PRLTRA.saldo M  
          INNER JOIN ( 
            SELECT M.centro_costo, M.cuenta_contable, MAX(M.fecha) AS fecha  
            FROM PRLTRA.saldo M  	
            WHERE M.fecha <= ?  
            GROUP BY M.centro_costo, M.cuenta_contable  
          ) smax ON (M.centro_costo = smax.centro_costo AND M.cuenta_contable = smax.cuenta_contable AND M.fecha = smax.fecha)  
          WHERE 1 = 1   
          UNION ALL    	
          SELECT  
            M.centro_costo,  
            M.cuenta_contable,  	
            COALESCE(M.debito_local, 0) AS debito_local,  	
            COALESCE(M.credito_local, 0) AS credito_local,  	
            COALESCE(M.debito_dolar, 0) AS debito_dolar,  	
            COALESCE(M.credito_dolar, 0) AS credito_dolar  	 
          FROM PRLTRA.asiento_de_diario AM
          INNER JOIN PRLTRA.diario M ON (AM.asiento = M.asiento) 
          WHERE AM.fecha <= ?                                      
          AND contabilidad IN ('F', 'A')  
        ) M  	
        INNER JOIN PRLTRA.CUENTA_CONTABLE CC  		
        ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'  
        GROUP BY CUENTA, FECHA, DESCRIPCION, ACEPTA
      `;

      await dynamicModel.executeQuery(query, [
        fechaInicio.toISOString().split('T')[0],
        usuario,
        fechaFin.toISOString().split('T')[0],
        fechaFin.toISOString().split('T')[0]
      ]);

      return true;
    } catch (error) {
      console.error('Error al insertar saldos iniciales:', error);
      return false;
    }
  }

  async insertarMovimientosMayor(
    usuario: string, 
    fechaInicio: Date, 
    fechaFin: Date, 
    contabilidad: 'F' | 'A' | 'T'
  ): Promise<boolean> {
    try {
      const conexion = await this.databaseService.obtenerConexion();
      const dynamicModel = new DynamicModel(conexion);

      const query = `
        INSERT INTO PRLTRA.REPCG_MAYOR  
        (CUENTA, FECHA, ASIENTO, ORIGEN, FUENTE, REFERENCIA, TIPO_LINEA, 
        DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL, CREDITO_DOLAR, 
        CENTRO_COSTO, DESCRIPCION, ACEPTA, CONSECUTIVO, TIPO_ASIENTO, 
        NIT, NIT_NOMBRE, TIPO, DOCUMENTO, USUARIO)   
        SELECT  
          SUBSTRING(M.CUENTA_CONTABLE, 1, 2) AS CUENTA,  
          M.FECHA,  
          M.ASIENTO,  
          M.ORIGEN,  
          M.FUENTE,   
          M.REFERENCIA,   
          '2' AS TIPO_LINEA,  
          M.DEBITO_LOCAL,  
          M.DEBITO_DOLAR,  
          M.CREDITO_LOCAL,  
          M.CREDITO_DOLAR,  
          M.CENTRO_COSTO,  
          CC.DESCRIPCION AS DESCRIPCION, 
          CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END AS ACEPTA,  
          M.CONSECUTIVO,  
          M.TIPO_ASIENTO,  
          M.NIT,  
          N.RAZON_SOCIAL AS NIT_NOMBRE, 
          CASE 
            WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'PY', 'MT', 'IC') THEN SUBSTRING(M.FUENTE, 1, 3)  
            WHEN M.ORIGEN = 'CJ' THEN SUBSTRING(M.FUENTE, 1, 3)  
            ELSE ''  
          END AS TIPO,  
          CASE 
            WHEN M.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'IC') THEN SUBSTRING(M.FUENTE, 4, 40)	 
            WHEN M.ORIGEN = 'CJ' THEN SUBSTRING(M.FUENTE, 4, 40)  
            ELSE ''  
          END AS DOCUMENTO, 
          ? AS USUARIO                
        FROM PRLTRA.MAYOR M   
        INNER JOIN PRLTRA.CUENTA_CONTABLE CC  		
        ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'  	
        INNER JOIN PRLTRA.NIT N ON M.NIT = N.NIT  	   
        WHERE M.CONTABILIDAD IN (?, ?) 
        AND M.FECHA >= ?                        
        AND M.FECHA <= ?                      
        AND M.CLASE_ASIENTO != 'C'
      `;

      await dynamicModel.executeQuery(query, [
        usuario,
        contabilidad,
        contabilidad === 'F' ? 'A' : 'F', // Incluir ambos tipos si es 'T'
        fechaInicio.toISOString().split('T')[0],
        fechaFin.toISOString().split('T')[0]
      ]);

      return true;
    } catch (error) {
      console.error('Error al insertar movimientos del mayor:', error);
      return false;
    }
  }

  async insertarMovimientosDiario(
    usuario: string, 
    fechaInicio: Date, 
    fechaFin: Date, 
    contabilidad: 'F' | 'A' | 'T'
  ): Promise<boolean> {
    try {
      const conexion = await this.databaseService.obtenerConexion();
      const dynamicModel = new DynamicModel(conexion);

      const query = `
        INSERT INTO PRLTRA.REPCG_MAYOR  
        (CUENTA, FECHA, ASIENTO, ORIGEN, FUENTE, REFERENCIA, TIPO_LINEA, 
        DEBITO_LOCAL, DEBITO_DOLAR, CREDITO_LOCAL, CREDITO_DOLAR,  
        CENTRO_COSTO, DESCRIPCION, ACEPTA, CONSECUTIVO, TIPO_ASIENTO, 
        NIT, NIT_NOMBRE, TIPO, DOCUMENTO, USUARIO)    
        SELECT  
          SUBSTRING(M.CUENTA_CONTABLE, 1, 2) AS CUENTA,  
          A.FECHA,  
          M.ASIENTO,  
          A.ORIGEN,  
          M.FUENTE,   
          M.REFERENCIA,   
          '2' AS TIPO_LINEA,  
          M.DEBITO_LOCAL,  
          M.DEBITO_DOLAR,  
          M.CREDITO_LOCAL,  
          M.CREDITO_DOLAR,  
          M.CENTRO_COSTO,  
          CC.DESCRIPCION AS DESCRIPCION,  
          CASE CC.ACEPTA_DATOS WHEN 'N' THEN 0 ELSE 1 END AS ACEPTA,  
          M.CONSECUTIVO,  
          A.TIPO_ASIENTO,  
          M.NIT,  
          N.RAZON_SOCIAL AS NIT_NOMBRE, 
          CASE 
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'PY', 'MT', 'IC') THEN SUBSTRING(M.FUENTE, 1, 3) 
            WHEN A.ORIGEN = 'CJ' THEN SUBSTRING(M.FUENTE, 1, 3)  
            ELSE ''  
          END AS TIPO,  
          CASE 
            WHEN A.ORIGEN IN ('CP', 'CB', 'CC', 'FEE', 'IC') THEN SUBSTRING(M.FUENTE, 4, 40) 
            WHEN A.ORIGEN = 'CJ' THEN SUBSTRING(M.FUENTE, 4, 40)  
            ELSE ''  
          END AS DOCUMENTO,  
          ? AS USUARIO              
        FROM PRLTRA.DIARIO M  	
        INNER JOIN PRLTRA.ASIENTO_DE_DIARIO A ON M.ASIENTO = A.ASIENTO  	
        INNER JOIN PRLTRA.CUENTA_CONTABLE CC ON CC.CUENTA_CONTABLE = SUBSTRING(M.CUENTA_CONTABLE, 1, 2) + '.0.0.0.000'	
        INNER JOIN PRLTRA.NIT N ON M.NIT = N.NIT  	    
        WHERE A.CONTABILIDAD IN (?, ?) 
        AND A.FECHA >= ?                         
        AND A.FECHA <= ?                       
        AND A.CLASE_ASIENTO != 'C'
      `;

      await dynamicModel.executeQuery(query, [
        usuario,
        contabilidad,
        contabilidad === 'F' ? 'A' : 'F', // Incluir ambos tipos si es 'T'
        fechaInicio.toISOString().split('T')[0],
        fechaFin.toISOString().split('T')[0]
      ]);

      return true;
    } catch (error) {
      console.error('Error al insertar movimientos del diario:', error);
      return false;
    }
  }

  async actualizarPeriodosContables(usuario: string): Promise<boolean> {
    try {
      const conexion = await this.databaseService.obtenerConexion();
      const dynamicModel = new DynamicModel(conexion);

      const query = `
        UPDATE PRLTRA.REPCG_MAYOR  	
        SET PERIODO_CONTABLE = ( 
          SELECT MIN(FECHA_FINAL) 
          FROM PRLTRA.PERIODO_CONTABLE P  
          WHERE P.CONTABILIDAD IN ('A', 'F')  
          AND PRLTRA.REPCG_MAYOR.FECHA < P.FECHA_FINAL + 1 
        )	  	
        WHERE USUARIO = ?
      `;

      await dynamicModel.executeQuery(query, [usuario]);
      return true;
    } catch (error) {
      console.error('Error al actualizar períodos contables:', error);
      return false;
    }
  }

  async transferirDatosATablaXML(usuario: string): Promise<boolean> {
    try {
      const conexion = await this.databaseService.obtenerConexion();
      const dynamicModel = new DynamicModel(conexion);

      const query = `
        INSERT INTO PRLTRA.R_XML_8DDC3925E54E9CF (  
          PERIODO_CONTABLE, CUENTA_CONTABLE, DESCRIPCION, ASIENTO, TIPO, DOCUMENTO, REFERENCIA,  
          DEBITO_LOCAL, DEBITO_DOLAR_MAYOR, CREDITO_LOCAL, CREDITO_DOLAR_MAYOR, SALDO_DEUDOR, SALDO_DEUDOR_DOLAR, SALDO_ACREEDOR,  
          SALDO_ACREEDOR_DOLAR, CENTRO_COSTO, TIPO_ASIENTO, FECHA, NIT, NIT_NOMBRE, FUENTE, CONSECUTIVO, CORRELATIVO_ASIENTO, TIPO_LINEA   
        )
        SELECT  
          PERIODO_CONTABLE, CUENTA, DESCRIPCION, ASIENTO, TIPO, DOCUMENTO, REFERENCIA,  
          COALESCE(DEBITO_LOCAL, 0), COALESCE(DEBITO_DOLAR, 0), COALESCE(CREDITO_LOCAL, 0), COALESCE(CREDITO_DOLAR, 0),  
          COALESCE(SALDO_DEUDOR, 0), COALESCE(SALDO_DEUDOR_DOLAR, 0), COALESCE(SALDO_ACREEDOR, 0), COALESCE(SALDO_ACREEDOR_DOLAR, 0),  
          CENTRO_COSTO, TIPO_ASIENTO, FECHA, NIT, NIT_NOMBRE, FUENTE, CONSECUTIVO, CORRELATIVO_ASIENTO, TIPO_LINEA  
        FROM PRLTRA.REPCG_MAYOR  
        WHERE USUARIO = ?
      `;

      await dynamicModel.executeQuery(query, [usuario]);
      return true;
    } catch (error) {
      console.error('Error al transferir datos a tabla XML:', error);
      return false;
    }
  }

  async ejecutarProcedimientoReporte(): Promise<ReporteLibroMayorItem[]> {
    try {
      const conexion = await this.databaseService.obtenerConexion();
      const dynamicModel = new DynamicModel(conexion);

      const query = `
        SELECT 
          ISNULL(SALDO_ACREEDOR_DOLAR, 0) AS SALDO_ACREEDOR_DOLAR,
          ISNULL(CREDITO_DOLAR_MAYOR, 0) AS CREDITO_DOLAR_MAYOR,
          ISNULL(CORRELATIVO_ASIENTO, '') AS CORRELATIVO_ASIENTO,
          ISNULL(SALDO_DEUDOR_DOLAR, 0) AS SALDO_DEUDOR_DOLAR,
          ISNULL(DEBITO_DOLAR_MAYOR, 0) AS DEBITO_DOLAR_MAYOR,
          ISNULL(CUENTA_CONTABLE, '') AS CUENTA_CONTABLE,
          ISNULL(SALDO_ACREEDOR, 0) AS SALDO_ACREEDOR,
          ISNULL(CREDITO_DOLAR, 0) AS CREDITO_DOLAR,
          ISNULL(CREDITO_LOCAL, 0) AS CREDITO_LOCAL,
          ISNULL(SALDO_DEUDOR, 0) AS SALDO_DEUDOR,
          ISNULL(DEBITO_DOLAR, 0) AS DEBITO_DOLAR,
          ISNULL(DEBITO_LOCAL, 0) AS DEBITO_LOCAL,
          ISNULL(CENTRO_COSTO, '') AS CENTRO_COSTO,
          ISNULL(TIPO_ASIENTO, '') AS TIPO_ASIENTO,
          ISNULL(DESCRIPCION, '') AS DESCRIPCION,
          ISNULL(CONSECUTIVO, 0) AS CONSECUTIVO,
          ISNULL(REFERENCIA, '') AS REFERENCIA,
          ISNULL(NIT_NOMBRE, '') AS NIT_NOMBRE,
          ISNULL(DOCUMENTO, '') AS DOCUMENTO,
          ISNULL(CREDITO, 0) AS CREDITO,
          ISNULL(ASIENTO, '') AS ASIENTO,
          ISNULL(DEBITO, 0) AS DEBITO,
          FECHA AS FECHA,
          ISNULL(TIPO, '') AS TIPO,
          ISNULL(NIT, '') AS NIT,
          ISNULL(FUENTE, '') AS FUENTE
        FROM PRLTRA.R_XML_8DDC3925E54E9CF 
        ORDER BY PERIODO_CONTABLE, CUENTA_CONTABLE, TIPO_LINEA, FECHA, ASIENTO
      `;

      const resultado = await dynamicModel.executeQuery(query, []);
      
      return resultado.map((row: any) => ({
        saldoAcreedorDolar: row.SALDO_ACREEDOR_DOLAR || 0,
        creditoDolarMayor: row.CREDITO_DOLAR_MAYOR || 0,
        saldoDeudorDolar: row.SALDO_DEUDOR_DOLAR || 0,
        debitoDolarMayor: row.DEBITO_DOLAR_MAYOR || 0,
        cuentaContable: row.CUENTA_CONTABLE || '',
        descripcion: row.DESCRIPCION || '',
        saldoAcreedor: row.SALDO_ACREEDOR || 0,
        saldoDeudor: row.SALDO_DEUDOR || 0,
        creditoDolar: row.CREDITO_DOLAR || 0,
        creditoLocal: row.CREDITO_LOCAL || 0,
        debitoDolar: row.DEBITO_DOLAR || 0,
        debitoLocal: row.DEBITO_LOCAL || 0,
        asiento: row.ASIENTO || '',
        consecutivo: row.CONSECUTIVO || 0,
        correlativoAsiento: row.CORRELATIVO_ASIENTO || '',
        centroCosto: row.CENTRO_COSTO || '',
        tipoAsiento: row.TIPO_ASIENTO || '',
        referencia: row.REFERENCIA || '',
        documento: row.DOCUMENTO || '',
        nit: row.NIT || '',
        nitNombre: row.NIT_NOMBRE || '',
        origen: '',
        fuente: row.FUENTE || '',
        periodoContable: '',
        usuario: '',
        tipoLinea: 0,
        fecha: new Date(row.FECHA),
        acepta: true,
        tipo: row.TIPO || ''
      }));
    } catch (error) {
      console.error('Error al ejecutar procedimiento del reporte:', error);
      return [];
    }
  }

  async validarDatosReporte(usuario: string): Promise<boolean> {
    try {
      const conexion = await this.databaseService.obtenerConexion();
      const dynamicModel = new DynamicModel(conexion);

      // Verificar que existan datos en la tabla temporal
      const queryVerificar = `
        SELECT COUNT(*) as total 
        FROM PRLTRA.REPCG_MAYOR 
        WHERE USUARIO = ?
      `;

      const resultado = await dynamicModel.executeQuery(queryVerificar, [usuario]);
      
      if (resultado && resultado.length > 0) {
        return resultado[0].total > 0;
      }

      return false;
    } catch (error) {
      console.error('Error al validar datos del reporte:', error);
      return false;
    }
  }
}
