import { Container } from "inversify";
import "reflect-metadata";
import { TYPES } from "./types";

// Domain interfaces
import { IUsuarioRepository } from "../../domain/repositories/IUsuarioRepository";
import { IMenuRepository } from "../../domain/repositories/IMenuRepository";
import { IRolRepository } from "../../domain/repositories/IRolRepository";
import { ISistemaRepository } from "../../domain/repositories/ISistemaRepository";
import { IConexionRepository } from "../../domain/repositories/IConexionRepository";
import { IRolSistemaMenuRepository } from "../../domain/repositories/IRolSistemaMenuRepository";
import { IConjuntoRepository } from "../../domain/repositories/IConjuntoRepository";
import { ICentroCostoRepository } from "../../domain/repositories/ICentroCostoRepository";
import { IMovimientoContableRepository } from "../../domain/repositories/IMovimientoContableRepository";
import { IReporteCuentaContableRepository } from "../../domain/repositories/IReporteCuentaContableRepository";
import { IReporteCuentaContableModificadaRepository } from "../../domain/repositories/IReporteCuentaContableModificadaRepository";
import { IReporteCentroCostoRepository } from "../../domain/repositories/IReporteCentroCostoRepository";
import { ITipoAsientoRepository } from "../../domain/repositories/ITipoAsientoRepository";
import { IReporteGastosDestinoRepository } from "../../domain/repositories/IReporteGastosDestinoRepository";
import { IReporteAsientosSinDimensionRepository } from "../../domain/repositories/IReporteAsientosSinDimensionRepository";
import { IResumenAsientosRepository } from "../../domain/repositories/IResumenAsientosRepository";
import { IReporteMensualCuentaCentroRepository } from "../../domain/repositories/IReporteMensualCuentaCentroRepository";
import { IReporteMovimientosContablesRepository } from "../../domain/repositories/IReporteMovimientosContablesRepository";
import { IReporteMovimientosContablesAgrupadosRepository } from "../../domain/repositories/IReporteMovimientosContablesAgrupadosRepository";
import { IReporteCatalogoCuentasModificadasRepository } from "../../domain/repositories/IReporteCatalogoCuentasModificadasRepository";
import { IDiarioContabilidadRepository } from "../../domain/repositories/IDiarioContabilidadRepository";
import { IPlanContableRepository } from "../../domain/repositories/IPlanContableRepository";
import { IPeriodoContableRepository } from "../../domain/repositories/IPeriodoContableRepository";
import { IMovimientoContableAgrupadoRepository } from "../../domain/repositories/IMovimientoContableAgrupadoRepository";
import { ISaldoPromediosRepository } from "../../domain/repositories/ISaldoPromediosRepository";
import { IBalanceComprobacionRepository } from "../../domain/repositories/IBalanceComprobacionRepository";
import { IReporteDocumentosProveedorRepository } from "../../domain/repositories/IReporteDocumentosProveedorRepository";
import { IReporteGNRepository } from "../../domain/repositories/IReporteGNRepository";
import { IReporteHmisRepository } from "../../domain/repositories/IReporteHmisRepository";
import { IReporteGenericoSaldosRepository } from "../../domain/repositories/IReporteGenericoSaldosRepository";
import { IReporteGenericoSaldosService } from "../../domain/services/IReporteGenericoSaldosService";
import { ILibroMayorAsientosService } from "../../domain/services/ILibroMayorAsientosService";
import { ILibroDiarioAsientosService } from "../../domain/services/ILibroDiarioAsientosService";
import { ILibroMayorService } from "../../domain/services/ILibroMayorService";
import { IEstadoSituacionFinancieraService } from "../../domain/services/IEstadoSituacionFinancieraService";
import { IEstadoResultadosService } from "../../domain/services/IEstadoResultadosService";
import { IReporteGNService } from "../../domain/services/IReporteGNService";
import { IReporteDocumentosProveedorService } from "../../domain/services/IReporteDocumentosProveedorService";
import { IReporteHmisService } from "../../domain/services/IReporteHmisService";
import { ILibroMayorContabilidadService } from "../../domain/services/ILibroMayorContabilidadService";
import { ILibroMayorContabilidadRepository } from "../../domain/repositories/ILibroMayorContabilidadRepository";
import { IBalanceComprobacionClipperRepository } from "../../domain/repositories/IBalanceComprobacionClipperRepository";
import { IBalanceGeneralClipperRepository } from "../../domain/repositories/IBalanceGeneralClipperRepository";
import { IBalanceComprobacionClipperService } from "../../domain/services/IBalanceComprobacionClipperService";
import { IBalanceGeneralClipperService } from "../../domain/services/IBalanceGeneralClipperService";
import { ILibroDiarioOficonRepository } from "../../domain/repositories/ILibroDiarioOficonRepository";
import { ILibroDiarioOficonService } from "../../domain/services/ILibroDiarioOficonService";
import { ILibroMayorOficonRepository } from "../../domain/repositories/ILibroMayorOficonRepository";
import { ILibroMayorOficonService } from "../../domain/services/ILibroMayorOficonService";
import { IRegistroComprasOficonRepository } from "../../domain/repositories/IRegistroComprasOficonRepository";
import { IRegistroComprasOficonService } from "../../domain/services/IRegistroComprasOficonService";
import { IBalanceComprobacionOficonRepository } from "../../domain/repositories/IBalanceComprobacionOficonRepository";
import { IBalanceComprobacionOficonService } from "../../domain/services/IBalanceComprobacionOficonService";
import { ILibroInventarioBalanceOficonRepository } from "../../domain/repositories/ILibroInventarioBalanceOficonRepository";
import { ILibroInventarioBalanceOficonService } from "../../domain/services/ILibroInventarioBalanceOficonService";
import { IPatrimonioNetoOficonRepository } from "../../domain/repositories/IPatrimonioNetoOficonRepository";
import { IPatrimonioNetoOficonService } from "../../domain/services/IPatrimonioNetoOficonService";
import { IVentasGeneralesOficonRepository } from "../../domain/repositories/IVentasGeneralesOficonRepository";
import { IVentasGeneralesOficonService } from "../../domain/services/IVentasGeneralesOficonService";
import { IPlanillaAnualizadaOfliplanRepository } from "../../domain/repositories/IPlanillaAnualizadaOfliplanRepository";
import { IPlanillaAnualizadaOfliplanService } from "../../domain/services/IPlanillaAnualizadaOfliplanService";

import { ICuentaContableRepository } from "../../domain/repositories/ICuentaContableRepository";
import { IUsuarioService } from "../../domain/services/IUsuarioService";
import { IAuthService } from "../../domain/services/IAuthService";
import { IMenuService } from "../../domain/services/IMenuService";
import { IRolService } from "../../domain/services/IRolService";
import { ISistemaService } from "../../domain/services/ISistemaService";
import { IConexionService } from "../../domain/services/IConexionService";
import { IRolMenuService } from "../../domain/services/IRolMenuService";
import { IRolSistemaMenuService } from "../../domain/services/IRolSistemaMenuService";
import { IConjuntoService } from "../../domain/services/IConjuntoService";
import { ICuentaContableService } from "../../domain/services/ICuentaContableService";
import { IResumenAsientosService } from "../../domain/services/IResumenAsientosService";
import { IReporteMensualCuentaCentroService } from "../../domain/services/IReporteMensualCuentaCentroService";
import { ITipoAsientoService } from "../../domain/services/ITipoAsientoService";
import { IReporteMovimientosContablesService } from "../../domain/services/IReporteMovimientosContablesService";
import { IReporteMovimientosContablesAgrupadosService } from "../../domain/services/IReporteMovimientosContablesAgrupadosService";
import { ISaldoPromediosService } from "../../domain/services/ISaldoPromediosService";
import { IBalanceComprobacionService } from "../../domain/services/IBalanceComprobacionService";

import { IDatabaseService } from "../../domain/services/IDatabaseService";

// CQRS interfaces
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";

// Infrastructure implementations
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { MenuRepository } from "../repositories/MenuRepository";
import { RolRepository } from "../repositories/RolRepository";
import { SistemaRepository } from "../repositories/SistemaRepository";
import { ConexionRepository } from "../repositories/ConexionRepository";
import { RolSistemaMenuRepository } from "../repositories/RolSistemaMenuRepository";
import { ConjuntoRepository } from "../repositories/ConjuntoRepository";
import { CentroCostoRepository } from "../repositories/CentroCostoRepository";
import { MovimientoContableRepository } from "../repositories/MovimientoContableRepository";
import { ReporteCuentaContableRepository } from "../repositories/ReporteCuentaContableRepository";
import { ReporteCuentaContableModificadaRepository } from "../repositories/ReporteCuentaContableModificadaRepository";
import { ReporteCentroCostoRepository } from "../repositories/ReporteCentroCostoRepository";
import { TipoAsientoRepository } from "../repositories/TipoAsientoRepository";
import { ReporteGastosDestinoRepository } from "../repositories/ReporteGastosDestinoRepository";
import { ReporteAsientosSinDimensionRepository } from "../repositories/ReporteAsientosSinDimensionRepository";
import { ResumenAsientosRepository } from "../repositories/ResumenAsientosRepository";
import { ReporteMensualCuentaCentroRepository } from "../repositories/ReporteMensualCuentaCentroRepository";
import { ReporteMovimientosContablesRepository } from "../repositories/ReporteMovimientosContablesRepository";
import { ReporteMovimientosContablesAgrupadosRepository } from "../repositories/ReporteMovimientosContablesAgrupadosRepository";
import { ReporteCatalogoCuentasModificadasRepository } from "../repositories/ReporteCatalogoCuentasModificadasRepository";
import { DiarioContabilidadRepository } from "../repositories/DiarioContabilidadRepository";
import { PlanContableRepository } from "../repositories/PlanContableRepository";
import { PeriodoContableRepository } from "../repositories/PeriodoContableRepository";
import { MovimientoContableAgrupadoRepository } from "../repositories/MovimientoContableAgrupadoRepository";
import { SaldoPromediosRepository } from "../repositories/SaldoPromediosRepository";
import { BalanceComprobacionRepository } from "../repositories/BalanceComprobacionRepository";
import { LibroMayorAsientosRepository } from "../repositories/LibroMayorAsientosRepository";
import { LibroDiarioAsientosRepository } from "../repositories/LibroDiarioAsientosRepository";
import { LibroMayorRepository } from "../repositories/LibroMayorRepository";
import { EstadoSituacionFinancieraRepository } from "../repositories/EstadoSituacionFinancieraRepository";
import { EstadoResultadosRepository } from "../repositories/EstadoResultadosRepository";
import { ReporteDocumentosProveedorRepository } from "../repositories/ReporteDocumentosProveedorRepository";
import { ReporteGNRepository } from "../repositories/ReporteGNRepository";
import { ReporteHmisRepository } from "../repositories/ReporteHmisRepository";
import { ReporteGenericoSaldosRepository } from "../repositories/ReporteGenericoSaldosRepository";
import { LibroMayorContabilidadRepository } from "../repositories/LibroMayorContabilidadRepository";
import { BalanceComprobacionClipperRepository } from "../repositories/BalanceComprobacionClipperRepository";
import { BalanceGeneralClipperRepository } from "../repositories/BalanceGeneralClipperRepository";
import { LibroDiarioOficonRepository } from "../repositories/LibroDiarioOficonRepository";
import { LibroMayorOficonRepository } from "../repositories/LibroMayorOficonRepository";
import { RegistroComprasOficonRepository } from "../repositories/RegistroComprasOficonRepository";
import { BalanceComprobacionOficonRepository } from "../repositories/BalanceComprobacionOficonRepository";
import { LibroInventarioBalanceOficonRepository } from "../repositories/LibroInventarioBalanceOficonRepository";
import { PatrimonioNetoOficonRepository } from "../repositories/PatrimonioNetoOficonRepository";
import { VentasGeneralesOficonRepository } from "../repositories/VentasGeneralesOficonRepository";
import { PlanillaAnualizadaOfliplanRepository } from "../repositories/PlanillaAnualizadaOfliplanRepository";

import { CuentaContableRepository } from "../repositories/CuentaContableRepository";
import { UsuarioService } from "../../application/services/UsuarioService";
import { AuthService } from "../../application/services/AuthService";
import { MenuService } from "../../application/services/MenuService";
import { RolService } from "../../application/services/RolService";
import { SistemaService } from "../../application/services/SistemaService";
import { ConexionService } from "../../application/services/ConexionService";
import { RolMenuService } from "../../application/services/RolMenuService";
import { RolSistemaMenuService } from "../../application/services/RolSistemaMenuService";
import { ConjuntoService } from "../../application/services/ConjuntoService";
import { CuentaContableService } from "../../application/services/CuentaContableService";
import { ResumenAsientosService } from "../../application/services/ResumenAsientosService";
import { ReporteMensualCuentaCentroService } from "../../application/services/ReporteMensualCuentaCentroService";
import { TipoAsientoService } from "../../application/services/TipoAsientoService";
import { ReporteMovimientosContablesService } from "../../application/services/ReporteMovimientosContablesService";
import { ReporteMovimientosContablesAgrupadosService } from "../../application/services/ReporteMovimientosContablesAgrupadosService";
import { SaldoPromediosService } from "../../application/services/SaldoPromediosService";
import { BalanceComprobacionService } from "../../application/services/BalanceComprobacionService";
import { LibroMayorAsientosService } from "../../application/services/LibroMayorAsientosService";
import { LibroDiarioAsientosService } from "../../application/services/LibroDiarioAsientosService";
import { LibroMayorService } from "../../application/services/LibroMayorService";
import { EstadoSituacionFinancieraService } from "../../application/services/EstadoSituacionFinancieraService";
import { EstadoResultadosService } from "../../application/services/EstadoResultadosService";
import { ReporteGNService } from "../../application/services/ReporteGNService";
import { ReporteDocumentosProveedorService } from "../../application/services/ReporteDocumentosProveedorService";
import { ReporteHmisService } from "../../application/services/ReporteHmisService";
import { ReporteGenericoSaldosService } from "../../application/services/ReporteGenericoSaldosService";
import { LibroMayorContabilidadService } from "../../application/services/LibroMayorContabilidadService";
import { BalanceComprobacionClipperService } from "../../application/services/BalanceComprobacionClipperService";
import { BalanceGeneralClipperService } from "../../application/services/BalanceGeneralClipperService";
import { LibroDiarioOficonService } from "../../application/services/LibroDiarioOficonService";
import { LibroMayorOficonService } from "../../application/services/LibroMayorOficonService";
import { RegistroComprasOficonService } from "../../application/services/RegistroComprasOficonService";
import { BalanceComprobacionOficonService } from "../../application/services/BalanceComprobacionOficonService";
import { LibroInventarioBalanceOficonService } from "../../application/services/LibroInventarioBalanceOficonService";
import { PatrimonioNetoOficonService } from "../../application/services/PatrimonioNetoOficonService";
import { VentasGeneralesOficonService } from "../../application/services/VentasGeneralesOficonService";
import { PlanillaAnualizadaOfliplanService } from "../../application/services/PlanillaAnualizadaOfliplanService";

import { DatabaseService } from "../../application/services/DatabaseService";

// Controllers
import { UsuarioController } from "../controllers/UsuarioController";
import { MenuController } from "../controllers/MenuController";
import { RolController } from "../controllers/RolController";
import { CuentaContableController } from "../controllers/CuentaContableController";
import { SistemaController } from "../controllers/SistemaController";
import { ConexionController } from "../controllers/ConexionController";
import { RolMenuController } from "../controllers/RolMenuController";
import { RolSistemaMenuController } from "../controllers/RolSistemaMenuController";
import { ReporteCentroCostoController } from "../controllers/ReporteCentroCostoController";
import { TipoAsientoController } from "../controllers/TipoAsientoController";
import { ReporteGastosDestinoController } from "../controllers/ReporteGastosDestinoController";
import { ReporteAsientosSinDimensionController } from "../controllers/ReporteAsientosSinDimensionController";
import { ResumenAsientosController } from "../controllers/ResumenAsientosController";
import { ReporteMensualCuentaCentroController } from "../controllers/ReporteMensualCuentaCentroController";
import { ReporteMovimientosContablesController } from "../controllers/ReporteMovimientosContablesController";
import { ReporteMovimientosContablesAgrupadosController } from "../controllers/ReporteMovimientosContablesAgrupadosController";
import { ReporteCatalogoCuentasModificadasController } from "../controllers/ReporteCatalogoCuentasModificadasController";
import { DiarioContabilidadController } from "../controllers/DiarioContabilidadController";
import { PeriodoContableController } from "../controllers/PeriodoContableController";
import { MovimientoContableAgrupadoController } from "../controllers/MovimientoContableAgrupadoController";
import { SaldoPromediosController } from "../controllers/SaldoPromediosController";
import { BalanceComprobacionController } from "../controllers/BalanceComprobacionController";
import { BalanceComprobacionRoutes } from "../routes/BalanceComprobacionRoutes";
import { LibroMayorAsientosController } from "../controllers/LibroMayorAsientosController";
import { LibroDiarioAsientosController } from "../controllers/LibroDiarioAsientosController";
import { LibroMayorController } from "../controllers/LibroMayorController";
import { EstadoSituacionFinancieraController } from "../controllers/EstadoSituacionFinancieraController";
import { EstadoResultadosController } from "../controllers/EstadoResultadosController";
import { ReporteGNController } from "../controllers/ReporteGNController";
import { ReporteDocumentosProveedorController } from "../controllers/ReporteDocumentosProveedorController";
import { HmisController } from "../controllers/HmisController";
import { ReporteGenericoSaldosController } from "../controllers/ReporteGenericoSaldosController";
import { LibroMayorContabilidadController } from "../controllers/LibroMayorContabilidadController";
import { BalanceComprobacionClipperController } from "../controllers/BalanceComprobacionClipperController";
import { BalanceGeneralClipperController } from "../controllers/BalanceGeneralClipperController";
import { LibroDiarioOficonController } from "../controllers/LibroDiarioOficonController";
import { LibroDiarioOficonRoutes } from "../routes/LibroDiarioOficonRoutes";
import { LibroMayorOficonController } from "../controllers/LibroMayorOficonController";
import { LibroMayorOficonRoutes } from "../routes/LibroMayorOficonRoutes";
import { RegistroComprasOficonController } from "../controllers/RegistroComprasOficonController";
import { RegistroComprasOficonRoutes } from "../routes/RegistroComprasOficonRoutes";
import { BalanceComprobacionOficonController } from "../controllers/BalanceComprobacionOficonController";
import { BalanceComprobacionOficonRoutes } from "../routes/BalanceComprobacionOficonRoutes";
import { LibroInventarioBalanceOficonController } from "../controllers/LibroInventarioBalanceOficonController";
import { LibroInventarioBalanceOficonRoutes } from "../routes/LibroInventarioBalanceOficonRoutes";
import { PatrimonioNetoOficonController } from "../controllers/PatrimonioNetoOficonController";
import { PatrimonioNetoOficonRoutes } from "../routes/PatrimonioNetoOficonRoutes";
import { VentasGeneralesOficonController } from "../controllers/VentasGeneralesOficonController";
import { VentasGeneralesOficonRoutes } from "../routes/VentasGeneralesOficonRoutes";
import { PlanillaAnualizadaOfliplanController } from "../controllers/PlanillaAnualizadaOfliplanController";
import { PlanillaAnualizadaOfliplanRoutes } from "../routes/planilla-anualizada-ofliplan.routes";

// CQRS implementations
import { CommandBus } from "../cqrs/CommandBus";
import { QueryBus } from "../cqrs/QueryBus";

// Command handlers
import { CreateUsuarioHandler } from "../../application/handlers/usuario/CreateUsuarioHandler";
import { UpdateUsuarioHandler } from "../../application/handlers/usuario/UpdateUsuarioHandler";
import { DeleteUsuarioHandler } from "../../application/handlers/usuario/DeleteUsuarioHandler";
import { GetAllUsuariosHandler } from "../../application/handlers/usuario/GetAllUsuariosHandler";
import { GetUsuarioByIdHandler } from "../../application/handlers/usuario/GetUsuarioByIdHandler";

// Query handlers
import { CreateRolHandler } from "../../application/handlers/rol/CreateRolHandler";
import { UpdateRolHandler } from "../../application/handlers/rol/UpdateRolHandler";
import { DeleteRolHandler } from "../../application/handlers/rol/DeleteRolHandler";
import { GetAllRolesHandler } from "../../application/handlers/rol/GetAllRolesHandler";
import { GetRolByIdHandler } from "../../application/handlers/rol/GetRolByIdHandler";

// Reporte Movimientos Contables Agrupados Handlers
import { GenerarReporteMovimientosContablesAgrupadosHandler } from "../../application/handlers/reporteMovimientosContablesAgrupados/GenerarReporteMovimientosContablesAgrupadosHandler";
import { ObtenerReporteMovimientosContablesAgrupadosHandler } from "../../application/handlers/reporteMovimientosContablesAgrupados/ObtenerReporteMovimientosContablesAgrupadosHandler";

// Diario Contabilidad Handlers
import { GenerarReporteDiarioContabilidadHandler } from "../../application/handlers/diario-contabilidad/GenerarReporteDiarioContabilidadHandler";
import { ObtenerDiarioContabilidadHandler } from "../../application/handlers/diario-contabilidad/ObtenerDiarioContabilidadHandler";
import { ExportarDiarioContabilidadExcelHandler } from "../../application/handlers/diario-contabilidad/ExportarDiarioContabilidadExcelHandler";

// Balance Comprobación Handlers
import { GenerarReporteBalanceComprobacionHandler } from "../../application/handlers/balance-comprobacion/GenerarReporteBalanceComprobacionHandler";
import { ObtenerBalanceComprobacionHandler } from "../../application/handlers/balance-comprobacion/ObtenerBalanceComprobacionHandler";
import { ExportarBalanceComprobacionExcelHandler } from "../../application/handlers/balance-comprobacion/ExportarBalanceComprobacionExcelHandler";

// Reporte Genérico de Saldos Handlers
import { GenerarReporteGenericoSaldosHandler } from "../../application/handlers/reporte-generico-saldos/GenerarReporteGenericoSaldosHandler";

// Libro Diario OFICON Handlers
import { GenerarReporteLibroDiarioOficonHandler } from "../../application/handlers/libro-diario-oficon/GenerarReporteLibroDiarioOficonHandler";
import { GetLibroDiarioOficonHandler } from "../../application/handlers/libro-diario-oficon/GetLibroDiarioOficonHandler";
import { GenerarReporteLibroMayorOficonHandler } from "../../application/handlers/libro-mayor-oficon/GenerarReporteLibroMayorOficonHandler";
import { GetLibroMayorOficonHandler } from "../../application/handlers/libro-mayor-oficon/GetLibroMayorOficonHandler";
import { GetRegistroComprasOficonHandler } from "../../application/handlers/registro-compras-oficon/GetRegistroComprasOficonHandler";
import { GetBalanceComprobacionOficonHandler } from "../../application/handlers/balance-comprobacion-oficon/GetBalanceComprobacionOficonHandler";
import { GetLibroInventarioBalanceOficonHandler } from "../../application/handlers/libro-inventario-balance-oficon/GetLibroInventarioBalanceOficonHandler";
import { GetPatrimonioNetoOficonHandler } from "../../application/handlers/patrimonio-neto-oficon/GetPatrimonioNetoOficonHandler";
import { GetVentasGeneralesOficonHandler } from "../../application/handlers/ventas-generales-oficon/GetVentasGeneralesOficonHandler";
import { GetPlanillaAnualizadaOfliplanHandler } from "../../application/handlers/planilla-anualizada-ofliplan/GetPlanillaAnualizadaOfliplanHandler";

// Libro Mayor Asientos Handlers
import { ObtenerLibroMayorAsientosHandler } from "../../application/handlers/libro-mayor-asientos/ObtenerLibroMayorAsientosHandler";
import { GenerarLibroMayorAsientosHandler } from "../../application/handlers/libro-mayor-asientos/GenerarLibroMayorAsientosHandler";
import { ExportarLibroMayorAsientosExcelHandler } from "../../application/handlers/libro-mayor-asientos/ExportarLibroMayorAsientosExcelHandler";
import { ObtenerFiltrosLibroMayorAsientosHandler } from "../../application/handlers/libro-mayor-asientos/ObtenerFiltrosLibroMayorAsientosHandler";

// Libro Diario Asientos Handlers
import { ObtenerLibroDiarioAsientosHandler } from "../../application/handlers/libro-diario-asientos/ObtenerLibroDiarioAsientosHandler";
import { GenerarLibroDiarioAsientosHandler } from "../../application/handlers/libro-diario-asientos/GenerarLibroDiarioAsientosHandler";
import { ObtenerFiltrosLibroDiarioAsientosHandler } from "../../application/handlers/libro-diario-asientos/ObtenerFiltrosLibroDiarioAsientosHandler";

// CQRS Service
import { CqrsService } from "../cqrs/CqrsService";

// Middleware
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { IReporteClipperRepository } from "../../domain/repositories/IReporteClipperRepository";
import { ReporteClipperRepository } from "../repositories/ReporteClipperRepository";
import { ClipperController } from "../controllers/ClipperController";
import { IReporteClipperService } from "../../domain/services/IReporteClipperService";
import { ReporteClipperService } from "../../application/services/ReporteCliperService";
import { IClipperLibroDiarioRepository } from "../../domain/repositories/IClipperLibroDiarioRepository";
import { ReporteClipperLibroDiarioRepository } from "../repositories/ReporteClipperLibroDiarioRepository";
import { IClipperLibroDiarioService } from "../../domain/services/IClipperLibroDiarioService";
import { ClipperLibroDiarioService } from "../../application/services/ClipperLibroDiarioService";
import { ClipperLibroDiarioController } from "../controllers/ClipperLibroDiarioController";
import { IClipperLibroCajaRepository } from "../../domain/repositories/IClipperLibroCajaRepository";
import { ReporteClipperLibroCajaRepository } from "../repositories/ReporteClipperLibroCajaRepository";
import { IClipperLibroCajaService } from "../../domain/services/IClipperLibroCajaService";
import { ClipperLibroCajaService } from "../../application/services/ClipperLibroCajaService";
import { ClipperLibroCajaController } from "../controllers/ClipperLibroCajaController";
import { TestClipperDatabasesController } from "../controllers/TestClipperDatabasesController";
import { ICacheService } from "../../domain/services/ICacheService";
import { CacheService } from "../../application/services/CacheService";
import { ClipperLibroDiarioCacheService } from "../../application/services/ClipperLibroDiarioCacheService";

const container = new Container();

// Repositories
container.bind<IUsuarioRepository>("IUsuarioRepository").to(UsuarioRepository);
container.bind<IMenuRepository>("IMenuRepository").to(MenuRepository);
container.bind<IRolRepository>("IRolRepository").to(RolRepository);
container.bind<ISistemaRepository>("ISistemaRepository").to(SistemaRepository);
container
  .bind<IConexionRepository>("IConexionRepository")
  .to(ConexionRepository);
container
  .bind<IRolSistemaMenuRepository>("IRolSistemaMenuRepository")
  .to(RolSistemaMenuRepository);
container
  .bind<IConjuntoRepository>("IConjuntoRepository")
  .to(ConjuntoRepository);
container
  .bind<ICentroCostoRepository>("ICentroCostoRepository")
  .to(CentroCostoRepository);
container
  .bind<IMovimientoContableRepository>("IMovimientoContableRepository")
  .to(MovimientoContableRepository);
container
  .bind<IReporteCuentaContableRepository>("IReporteCuentaContableRepository")
  .to(ReporteCuentaContableRepository);
container
  .bind<IReporteCuentaContableModificadaRepository>(
    "IReporteCuentaContableModificadaRepository"
  )
  .to(ReporteCuentaContableModificadaRepository);
container
  .bind<IReporteCentroCostoRepository>("IReporteCentroCostoRepository")
  .to(ReporteCentroCostoRepository);
container
  .bind<ITipoAsientoRepository>("ITipoAsientoRepository")
  .to(TipoAsientoRepository);
container
  .bind<IReporteGastosDestinoRepository>("IReporteGastosDestinoRepository")
  .to(ReporteGastosDestinoRepository);
container
  .bind<IReporteAsientosSinDimensionRepository>(
    "IReporteAsientosSinDimensionRepository"
  )
  .to(ReporteAsientosSinDimensionRepository);
container
  .bind<IResumenAsientosRepository>("IResumenAsientosRepository")
  .to(ResumenAsientosRepository);
container
  .bind<IReporteMensualCuentaCentroRepository>(
    "IReporteMensualCuentaCentroRepository"
  )
  .to(ReporteMensualCuentaCentroRepository);
container
  .bind<IReporteMovimientosContablesRepository>(
    "IReporteMovimientosContablesRepository"
  )
  .to(ReporteMovimientosContablesRepository);
container
  .bind<IReporteMovimientosContablesAgrupadosRepository>(
    "IReporteMovimientosContablesAgrupadosRepository"
  )
  .to(ReporteMovimientosContablesAgrupadosRepository);
container
  .bind<IReporteCatalogoCuentasModificadasRepository>(
    "IReporteCatalogoCuentasModificadasRepository"
  )
  .to(ReporteCatalogoCuentasModificadasRepository);
container
  .bind<IDiarioContabilidadRepository>("IDiarioContabilidadRepository")
  .to(DiarioContabilidadRepository);
container
  .bind<IPlanContableRepository>("IPlanContableRepository")
  .to(PlanContableRepository);
container
  .bind<IPeriodoContableRepository>("IPeriodoContableRepository")
  .to(PeriodoContableRepository);
container
  .bind<IMovimientoContableAgrupadoRepository>(
    "IMovimientoContableAgrupadoRepository"
  )
  .to(MovimientoContableAgrupadoRepository);
container
  .bind<ISaldoPromediosRepository>("ISaldoPromediosRepository")
  .to(SaldoPromediosRepository);
container
  .bind<IBalanceComprobacionRepository>("IBalanceComprobacionRepository")
  .to(BalanceComprobacionRepository);
container
  .bind<LibroMayorAsientosRepository>("LibroMayorAsientosRepository")
  .to(LibroMayorAsientosRepository);
container
  .bind<LibroDiarioAsientosRepository>("LibroDiarioAsientosRepository")
  .to(LibroDiarioAsientosRepository);
container
  .bind<LibroMayorRepository>("LibroMayorRepository")
  .to(LibroMayorRepository);
container
  .bind<EstadoSituacionFinancieraRepository>(
    "EstadoSituacionFinancieraRepository"
  )
  .to(EstadoSituacionFinancieraRepository);
container
  .bind<EstadoResultadosRepository>("EstadoResultadosRepository")
  .to(EstadoResultadosRepository);
container
  .bind<IReporteDocumentosProveedorRepository>(
    "IReporteDocumentosProveedorRepository"
  )
  .to(ReporteDocumentosProveedorRepository);
container
  .bind<IReporteGNRepository>("IReporteGNRepository")
  .to(ReporteGNRepository);
container
  .bind<IReporteHmisRepository>("IReporteHmisRepository")
  .to(ReporteHmisRepository);
container
  .bind<IReporteGenericoSaldosRepository>("IReporteGenericoSaldosRepository")
  .to(ReporteGenericoSaldosRepository);
container
  .bind<ILibroMayorContabilidadRepository>("ILibroMayorContabilidadRepository")
  .to(LibroMayorContabilidadRepository);

container
  .bind<ICuentaContableRepository>("ICuentaContableRepository")
  .to(CuentaContableRepository);
container
  .bind<IReporteClipperRepository>("IReporteClipperRepository")
  .to(ReporteClipperRepository);
container
  .bind<IClipperLibroDiarioRepository>("IClipperLibroDiarioRepository")
  .to(ReporteClipperLibroDiarioRepository);
container
  .bind<IClipperLibroCajaRepository>("IClipperLibroCajaRepository")
  .to(ReporteClipperLibroCajaRepository);
container
  .bind<IBalanceComprobacionClipperRepository>(
    "IBalanceComprobacionClipperRepository"
  )
  .to(BalanceComprobacionClipperRepository);
container
  .bind<IBalanceGeneralClipperRepository>("IBalanceGeneralClipperRepository")
  .to(BalanceGeneralClipperRepository);
container
  .bind<ILibroDiarioOficonRepository>(TYPES.ILibroDiarioOficonRepository)
  .to(LibroDiarioOficonRepository);
container
  .bind<ILibroMayorOficonRepository>(TYPES.ILibroMayorOficonRepository)
  .to(LibroMayorOficonRepository);
container
  .bind<IRegistroComprasOficonRepository>(
    TYPES.IRegistroComprasOficonRepository
  )
  .to(RegistroComprasOficonRepository);
container
  .bind<IBalanceComprobacionOficonRepository>(
    TYPES.IBalanceComprobacionOficonRepository
  )
  .to(BalanceComprobacionOficonRepository);
container
  .bind<ILibroInventarioBalanceOficonRepository>(
    TYPES.ILibroInventarioBalanceOficonRepository
  )
  .to(LibroInventarioBalanceOficonRepository);
container
  .bind<IPatrimonioNetoOficonRepository>(TYPES.IPatrimonioNetoOficonRepository)
  .to(PatrimonioNetoOficonRepository);
container
  .bind<IVentasGeneralesOficonRepository>(
    TYPES.IVentasGeneralesOficonRepository
  )
  .to(VentasGeneralesOficonRepository);
container
  .bind<IPlanillaAnualizadaOfliplanRepository>(
    TYPES.IPlanillaAnualizadaOfliplanRepository
  )
  .to(PlanillaAnualizadaOfliplanRepository);

// Cache Services
container.bind<ICacheService>("ICacheService").to(CacheService);
container
  .bind<ClipperLibroDiarioCacheService>("ClipperLibroDiarioCacheService")
  .to(ClipperLibroDiarioCacheService);

// Services
container.bind<IUsuarioService>("IUsuarioService").to(UsuarioService);
container.bind<IAuthService>("IAuthService").to(AuthService);
container.bind<IMenuService>("IMenuService").to(MenuService);
container.bind<IRolService>("IRolService").to(RolService);
container.bind<ISistemaService>("ISistemaService").to(SistemaService);
container.bind<IConexionService>("IConexionService").to(ConexionService);
container.bind<IRolMenuService>("IRolMenuService").to(RolMenuService);
container
  .bind<IRolSistemaMenuService>("IRolSistemaMenuService")
  .to(RolSistemaMenuService);
container.bind<IConjuntoService>("IConjuntoService").to(ConjuntoService);
container
  .bind<ICuentaContableService>("CuentaContableService")
  .to(CuentaContableService);
container
  .bind<IResumenAsientosService>("ResumenAsientosService")
  .to(ResumenAsientosService);
container
  .bind<IReporteMensualCuentaCentroService>(
    "IReporteMensualCuentaCentroService"
  )
  .to(ReporteMensualCuentaCentroService);
container
  .bind<ITipoAsientoService>("TipoAsientoService")
  .to(TipoAsientoService);
container
  .bind<IReporteMovimientosContablesService>(
    "IReporteMovimientosContablesService"
  )
  .to(ReporteMovimientosContablesService);
container
  .bind<IReporteMovimientosContablesAgrupadosService>(
    "IReporteMovimientosContablesAgrupadosService"
  )
  .to(ReporteMovimientosContablesAgrupadosService);
container
  .bind<ISaldoPromediosService>("ISaldoPromediosService")
  .to(SaldoPromediosService);
container
  .bind<IBalanceComprobacionService>("IBalanceComprobacionService")
  .to(BalanceComprobacionService);
container
  .bind<ILibroMayorAsientosService>("ILibroMayorAsientosService")
  .to(LibroMayorAsientosService);
container
  .bind<ILibroDiarioAsientosService>("ILibroDiarioAsientosService")
  .to(LibroDiarioAsientosService);
container.bind<ILibroMayorService>("ILibroMayorService").to(LibroMayorService);
container
  .bind<IEstadoSituacionFinancieraService>("IEstadoSituacionFinancieraService")
  .to(EstadoSituacionFinancieraService);
container
  .bind<IEstadoResultadosService>("IEstadoResultadosService")
  .to(EstadoResultadosService);
container.bind<IReporteGNService>("IReporteGNService").to(ReporteGNService);
container
  .bind<IReporteDocumentosProveedorService>(
    "IReporteDocumentosProveedorService"
  )
  .to(ReporteDocumentosProveedorService);
container
  .bind<IReporteHmisService>("IReporteHmisService")
  .to(ReporteHmisService);
container
  .bind<IReporteGenericoSaldosService>("IReporteGenericoSaldosService")
  .to(ReporteGenericoSaldosService);
container
  .bind<ILibroMayorContabilidadService>("ILibroMayorContabilidadService")
  .to(LibroMayorContabilidadService);

container.bind<IDatabaseService>("IDatabaseService").to(DatabaseService);
container
  .bind<IReporteClipperService>("IReporteClipperService")
  .to(ReporteClipperService);
container
  .bind<IClipperLibroDiarioService>("IClipperLibroDiarioService")
  .to(ClipperLibroDiarioService);
container
  .bind<IClipperLibroCajaService>("IClipperLibroCajaService")
  .to(ClipperLibroCajaService);
container
  .bind<IBalanceComprobacionClipperService>(
    "IBalanceComprobacionClipperService"
  )
  .to(BalanceComprobacionClipperService);
container
  .bind<IBalanceGeneralClipperService>("IBalanceGeneralClipperService")
  .to(BalanceGeneralClipperService);
container
  .bind<ILibroDiarioOficonService>(TYPES.ILibroDiarioOficonService)
  .to(LibroDiarioOficonService);
container
  .bind<ILibroMayorOficonService>(TYPES.ILibroMayorOficonService)
  .to(LibroMayorOficonService);
container
  .bind<IRegistroComprasOficonService>(TYPES.IRegistroComprasOficonService)
  .to(RegistroComprasOficonService);
container
  .bind<IBalanceComprobacionOficonService>(
    TYPES.IBalanceComprobacionOficonService
  )
  .to(BalanceComprobacionOficonService);
container
  .bind<ILibroInventarioBalanceOficonService>(
    TYPES.ILibroInventarioBalanceOficonService
  )
  .to(LibroInventarioBalanceOficonService);
container
  .bind<IPatrimonioNetoOficonService>(TYPES.IPatrimonioNetoOficonService)
  .to(PatrimonioNetoOficonService);
container
  .bind<IVentasGeneralesOficonService>(TYPES.IVentasGeneralesOficonService)
  .to(VentasGeneralesOficonService);
container
  .bind<IPlanillaAnualizadaOfliplanService>(
    TYPES.IPlanillaAnualizadaOfliplanService
  )
  .to(PlanillaAnualizadaOfliplanService);

// Controllers
container.bind<UsuarioController>("UsuarioController").to(UsuarioController);
container.bind<MenuController>("MenuController").to(MenuController);
container.bind<RolController>("RolController").to(RolController);
container
  .bind<CuentaContableController>("CuentaContableController")
  .to(CuentaContableController);
container.bind<SistemaController>("SistemaController").to(SistemaController);
container.bind<ConexionController>("ConexionController").to(ConexionController);
container.bind<RolMenuController>("RolMenuController").to(RolMenuController);
container
  .bind<RolSistemaMenuController>("RolSistemaMenuController")
  .to(RolSistemaMenuController);
container
  .bind<ReporteCentroCostoController>("ReporteCentroCostoController")
  .to(ReporteCentroCostoController);
container
  .bind<TipoAsientoController>("TipoAsientoController")
  .to(TipoAsientoController);
container
  .bind<ReporteGastosDestinoController>("ReporteGastosDestinoController")
  .to(ReporteGastosDestinoController);
container
  .bind<ReporteAsientosSinDimensionController>(
    "ReporteAsientosSinDimensionController"
  )
  .to(ReporteAsientosSinDimensionController);
container
  .bind<ResumenAsientosController>("ResumenAsientosController")
  .to(ResumenAsientosController);
container
  .bind<ReporteMensualCuentaCentroController>(
    "ReporteMensualCuentaCentroController"
  )
  .to(ReporteMensualCuentaCentroController);
container
  .bind<ReporteMovimientosContablesController>(
    "ReporteMovimientosContablesController"
  )
  .to(ReporteMovimientosContablesController);
container
  .bind<ReporteMovimientosContablesAgrupadosController>(
    "ReporteMovimientosContablesAgrupadosController"
  )
  .to(ReporteMovimientosContablesAgrupadosController);
container
  .bind<ReporteCatalogoCuentasModificadasController>(
    "ReporteCatalogoCuentasModificadasController"
  )
  .to(ReporteCatalogoCuentasModificadasController);
container
  .bind<DiarioContabilidadController>("DiarioContabilidadController")
  .to(DiarioContabilidadController);
container
  .bind<PeriodoContableController>("PeriodoContableController")
  .to(PeriodoContableController);
container
  .bind<MovimientoContableAgrupadoController>(
    "MovimientoContableAgrupadoController"
  )
  .to(MovimientoContableAgrupadoController);
container
  .bind<SaldoPromediosController>("SaldoPromediosController")
  .to(SaldoPromediosController);
container
  .bind<BalanceComprobacionController>("BalanceComprobacionController")
  .to(BalanceComprobacionController);
container
  .bind<BalanceComprobacionRoutes>("BalanceComprobacionRoutes")
  .to(BalanceComprobacionRoutes);
container.bind<ClipperController>("ClipperController").to(ClipperController);
container
  .bind<LibroMayorAsientosController>("LibroMayorAsientosController")
  .to(LibroMayorAsientosController);
container
  .bind<LibroDiarioAsientosController>("LibroDiarioAsientosController")
  .to(LibroDiarioAsientosController);
container
  .bind<LibroMayorController>("LibroMayorController")
  .to(LibroMayorController);
container
  .bind<EstadoSituacionFinancieraController>(
    "EstadoSituacionFinancieraController"
  )
  .to(EstadoSituacionFinancieraController);
container
  .bind<EstadoResultadosController>("EstadoResultadosController")
  .to(EstadoResultadosController);
container
  .bind<ReporteGNController>("ReporteGNController")
  .to(ReporteGNController);
container
  .bind<ReporteDocumentosProveedorController>(
    "ReporteDocumentosProveedorController"
  )
  .to(ReporteDocumentosProveedorController);
container.bind<HmisController>("HmisController").to(HmisController);
container
  .bind<ReporteGenericoSaldosController>("ReporteGenericoSaldosController")
  .to(ReporteGenericoSaldosController);
container
  .bind<LibroMayorContabilidadController>("LibroMayorContabilidadController")
  .to(LibroMayorContabilidadController);

container
  .bind<ClipperLibroDiarioController>("ClipperLibroDiarioController")
  .to(ClipperLibroDiarioController);
container
  .bind<ClipperLibroCajaController>("ClipperLibroCajaController")
  .to(ClipperLibroCajaController);
container
  .bind<TestClipperDatabasesController>("TestClipperDatabasesController")
  .to(TestClipperDatabasesController);
container
  .bind<BalanceComprobacionClipperController>(
    "BalanceComprobacionClipperController"
  )
  .to(BalanceComprobacionClipperController);
container
  .bind<BalanceGeneralClipperController>("BalanceGeneralClipperController")
  .to(BalanceGeneralClipperController);
container
  .bind<LibroDiarioOficonController>(TYPES.LibroDiarioOficonController)
  .to(LibroDiarioOficonController);
container
  .bind<LibroDiarioOficonRoutes>(TYPES.LibroDiarioOficonRoutes)
  .to(LibroDiarioOficonRoutes);
container
  .bind<LibroMayorOficonController>(TYPES.LibroMayorOficonController)
  .to(LibroMayorOficonController);
container
  .bind<LibroMayorOficonRoutes>(TYPES.LibroMayorOficonRoutes)
  .to(LibroMayorOficonRoutes);
container
  .bind<RegistroComprasOficonController>(TYPES.RegistroComprasOficonController)
  .to(RegistroComprasOficonController);
container
  .bind<RegistroComprasOficonRoutes>(TYPES.RegistroComprasOficonRoutes)
  .to(RegistroComprasOficonRoutes);
container
  .bind<BalanceComprobacionOficonController>(
    TYPES.BalanceComprobacionOficonController
  )
  .to(BalanceComprobacionOficonController);
container
  .bind<BalanceComprobacionOficonRoutes>(TYPES.BalanceComprobacionOficonRoutes)
  .to(BalanceComprobacionOficonRoutes);
container
  .bind<LibroInventarioBalanceOficonController>(
    TYPES.LibroInventarioBalanceOficonController
  )
  .to(LibroInventarioBalanceOficonController);
container
  .bind<LibroInventarioBalanceOficonRoutes>(
    TYPES.LibroInventarioBalanceOficonRoutes
  )
  .to(LibroInventarioBalanceOficonRoutes);
container
  .bind<PatrimonioNetoOficonController>(TYPES.PatrimonioNetoOficonController)
  .to(PatrimonioNetoOficonController);
container
  .bind<PatrimonioNetoOficonRoutes>(TYPES.PatrimonioNetoOficonRoutes)
  .to(PatrimonioNetoOficonRoutes);
container
  .bind<VentasGeneralesOficonController>(TYPES.VentasGeneralesOficonController)
  .to(VentasGeneralesOficonController);
container
  .bind<VentasGeneralesOficonRoutes>(TYPES.VentasGeneralesOficonRoutes)
  .to(VentasGeneralesOficonRoutes);
container
  .bind<PlanillaAnualizadaOfliplanController>(
    TYPES.PlanillaAnualizadaOfliplanController
  )
  .to(PlanillaAnualizadaOfliplanController);
// Planilla Anualizada OFIPLAN se usa directamente como router, no se registra en el container
// BalanceComprobacionClipperRoutes se instancia directamente en app.ts

// CQRS Buses
container.bind<ICommandBus>("ICommandBus").to(CommandBus).inSingletonScope();
container.bind<IQueryBus>("IQueryBus").to(QueryBus).inSingletonScope();

// Command Handlers
container
  .bind<CreateUsuarioHandler>("CreateUsuarioHandler")
  .to(CreateUsuarioHandler);
container
  .bind<UpdateUsuarioHandler>("UpdateUsuarioHandler")
  .to(UpdateUsuarioHandler);
container
  .bind<DeleteUsuarioHandler>("DeleteUsuarioHandler")
  .to(DeleteUsuarioHandler);

// Query Handlers
container
  .bind<GetAllUsuariosHandler>("GetAllUsuariosHandler")
  .to(GetAllUsuariosHandler);
container
  .bind<GetUsuarioByIdHandler>("GetUsuarioByIdHandler")
  .to(GetUsuarioByIdHandler);

// Rol Command Handlers
container.bind<CreateRolHandler>("CreateRolHandler").to(CreateRolHandler);
container.bind<UpdateRolHandler>("UpdateRolHandler").to(UpdateRolHandler);
container.bind<DeleteRolHandler>("DeleteRolHandler").to(DeleteRolHandler);

// Rol Query Handlers
container.bind<GetAllRolesHandler>("GetAllRolesHandler").to(GetAllRolesHandler);
container.bind<GetRolByIdHandler>("GetRolByIdHandler").to(GetRolByIdHandler);

// Reporte Movimientos Contables Agrupados Handlers
container
  .bind<GenerarReporteMovimientosContablesAgrupadosHandler>(
    "GenerarReporteMovimientosContablesAgrupadosHandler"
  )
  .to(GenerarReporteMovimientosContablesAgrupadosHandler);
container
  .bind<ObtenerReporteMovimientosContablesAgrupadosHandler>(
    "ObtenerReporteMovimientosContablesAgrupadosHandler"
  )
  .to(ObtenerReporteMovimientosContablesAgrupadosHandler);

// Diario Contabilidad Handlers
container
  .bind<GenerarReporteDiarioContabilidadHandler>(
    "GenerarReporteDiarioContabilidadHandler"
  )
  .to(GenerarReporteDiarioContabilidadHandler);
container
  .bind<ObtenerDiarioContabilidadHandler>("ObtenerDiarioContabilidadHandler")
  .to(ObtenerDiarioContabilidadHandler);
container
  .bind<ExportarDiarioContabilidadExcelHandler>(
    "ExportarDiarioContabilidadExcelHandler"
  )
  .to(ExportarDiarioContabilidadExcelHandler);

// Balance Comprobación Handlers
container
  .bind<GenerarReporteBalanceComprobacionHandler>(
    "GenerarReporteBalanceComprobacionHandler"
  )
  .to(GenerarReporteBalanceComprobacionHandler);
container
  .bind<ObtenerBalanceComprobacionHandler>("ObtenerBalanceComprobacionHandler")
  .to(ObtenerBalanceComprobacionHandler);
container
  .bind<ExportarBalanceComprobacionExcelHandler>(
    "ExportarBalanceComprobacionExcelHandler"
  )
  .to(ExportarBalanceComprobacionExcelHandler);

// Reporte Genérico de Saldos Handlers
container
  .bind<GenerarReporteGenericoSaldosHandler>(
    "GenerarReporteGenericoSaldosHandler"
  )
  .to(GenerarReporteGenericoSaldosHandler);

// Libro Mayor Asientos Handlers
container
  .bind<ObtenerLibroMayorAsientosHandler>("ObtenerLibroMayorAsientosHandler")
  .to(ObtenerLibroMayorAsientosHandler);
container
  .bind<GenerarLibroMayorAsientosHandler>("GenerarLibroMayorAsientosHandler")
  .to(GenerarLibroMayorAsientosHandler);
container
  .bind<ExportarLibroMayorAsientosExcelHandler>(
    "ExportarLibroMayorAsientosExcelHandler"
  )
  .to(ExportarLibroMayorAsientosExcelHandler);
container
  .bind<ObtenerFiltrosLibroMayorAsientosHandler>(
    "ObtenerFiltrosLibroMayorAsientosHandler"
  )
  .to(ObtenerFiltrosLibroMayorAsientosHandler);

// Libro Diario Asientos Handlers
container
  .bind<ObtenerLibroDiarioAsientosHandler>("ObtenerLibroDiarioAsientosHandler")
  .to(ObtenerLibroDiarioAsientosHandler);
container
  .bind<GenerarLibroDiarioAsientosHandler>("GenerarLibroDiarioAsientosHandler")
  .to(GenerarLibroDiarioAsientosHandler);
container
  .bind<ObtenerFiltrosLibroDiarioAsientosHandler>(
    "ObtenerFiltrosLibroDiarioAsientosHandler"
  )
  .to(ObtenerFiltrosLibroDiarioAsientosHandler);

// Libro Diario OFICON Handlers
container
  .bind<GenerarReporteLibroDiarioOficonHandler>(
    TYPES.GenerarReporteLibroDiarioOficonHandler
  )
  .to(GenerarReporteLibroDiarioOficonHandler);
container
  .bind<GetLibroDiarioOficonHandler>(TYPES.GetLibroDiarioOficonHandler)
  .to(GetLibroDiarioOficonHandler);
container
  .bind<GenerarReporteLibroMayorOficonHandler>(
    TYPES.GenerarReporteLibroMayorOficonHandler
  )
  .to(GenerarReporteLibroMayorOficonHandler);
container
  .bind<GetLibroMayorOficonHandler>(TYPES.GetLibroMayorOficonHandler)
  .to(GetLibroMayorOficonHandler);
container
  .bind<GetRegistroComprasOficonHandler>(TYPES.GetRegistroComprasOficonHandler)
  .to(GetRegistroComprasOficonHandler);
container
  .bind<GetBalanceComprobacionOficonHandler>(
    TYPES.GetBalanceComprobacionOficonHandler
  )
  .to(GetBalanceComprobacionOficonHandler);
container
  .bind<GetLibroInventarioBalanceOficonHandler>(
    TYPES.GetLibroInventarioBalanceOficonHandler
  )
  .to(GetLibroInventarioBalanceOficonHandler);
container
  .bind<GetPatrimonioNetoOficonHandler>(TYPES.GetPatrimonioNetoOficonHandler)
  .to(GetPatrimonioNetoOficonHandler);
container
  .bind<GetVentasGeneralesOficonHandler>(TYPES.GetVentasGeneralesOficonHandler)
  .to(GetVentasGeneralesOficonHandler);
container
  .bind<GetPlanillaAnualizadaOfliplanHandler>(
    TYPES.GetPlanillaAnualizadaOfliplanHandler
  )
  .to(GetPlanillaAnualizadaOfliplanHandler);

// Balance Comprobación Clipper - No necesita handlers CQRS, usa servicio directamente

// Ganancias y Pérdidas Clipper
import { IGananciasPerdidasClipperRepository } from "../../domain/repositories/IGananciasPerdidasClipperRepository";
import { GananciasPerdidasClipperRepository } from "../repositories/GananciasPerdidasClipperRepository";
import { IGananciasPerdidasClipperService } from "../../domain/services/IGananciasPerdidasClipperService";
import { GananciasPerdidasClipperService } from "../../application/services/GananciasPerdidasClipperService";
import { GananciasPerdidasClipperController } from "../controllers/GananciasPerdidasClipperController";

// Análisis de Cuentas Clipper
import { IAnalisisCuentasClipperRepository } from "../../domain/repositories/IAnalisisCuentasClipperRepository";
import { AnalisisCuentasClipperRepository } from "../repositories/AnalisisCuentasClipperRepository";
import { IAnalisisCuentasClipperService } from "../../domain/services/IAnalisisCuentasClipperService";
import { AnalisisCuentasClipperService } from "../../application/services/AnalisisCuentasClipperService";
import { AnalisisCuentasClipperController } from "../controllers/AnalisisCuentasClipperController";
import { AnalisisCuentasClipperRoutes } from "../routes/AnalisisCuentasClipperRoutes";

// Ganancias y Pérdidas Clipper - Repositorio
container
  .bind<IGananciasPerdidasClipperRepository>(
    "IGananciasPerdidasClipperRepository"
  )
  .to(GananciasPerdidasClipperRepository);

// Ganancias y Pérdidas Clipper - Servicio
container
  .bind<IGananciasPerdidasClipperService>("IGananciasPerdidasClipperService")
  .to(GananciasPerdidasClipperService);

// Ganancias y Pérdidas Clipper - Controlador
container
  .bind<GananciasPerdidasClipperController>(
    "GananciasPerdidasClipperController"
  )
  .to(GananciasPerdidasClipperController);

// Análisis de Cuentas Clipper - Repositorio
container
  .bind<IAnalisisCuentasClipperRepository>("IAnalisisCuentasClipperRepository")
  .to(AnalisisCuentasClipperRepository);

// Análisis de Cuentas Clipper - Servicio
container
  .bind<IAnalisisCuentasClipperService>("IAnalisisCuentasClipperService")
  .to(AnalisisCuentasClipperService);

// Análisis de Cuentas Clipper - Controlador
container
  .bind<AnalisisCuentasClipperController>("AnalisisCuentasClipperController")
  .to(AnalisisCuentasClipperController);

// Análisis de Cuentas Clipper - Rutas
container
  .bind<AnalisisCuentasClipperRoutes>("AnalisisCuentasClipperRoutes")
  .to(AnalisisCuentasClipperRoutes);

// CQRS Service
container.bind<CqrsService>("CqrsService").to(CqrsService);

// Middleware
container.bind<AuthMiddleware>("AuthMiddleware").to(AuthMiddleware);

export { container };
