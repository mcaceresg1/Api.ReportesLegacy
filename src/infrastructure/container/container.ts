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
import { IReporteGenericoSaldosRepository } from "../../domain/repositories/IReporteGenericoSaldosRepository";
import { IReporteDocumentosProveedorRepository } from "../../domain/repositories/IReporteDocumentosProveedorRepository";
import { IReporteGNRepository } from "../../domain/repositories/IReporteGNRepository";
import { IReporteHmisRepository } from "../../domain/repositories/IReporteHmisRepository";
import { ILibroMayorAsientosService } from "../../domain/services/ILibroMayorAsientosService";
import { IReporteGNService } from "../../domain/services/IReporteGNService";
import { IReporteDocumentosProveedorService } from "../../domain/services/IReporteDocumentosProveedorService";
import { IReporteHmisService } from "../../domain/services/IReporteHmisService";

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
import { IReporteGenericoSaldosService } from "../../domain/services/IReporteGenericoSaldosService";

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
import { ReporteGenericoSaldosRepository } from "../repositories/ReporteGenericoSaldosRepository";
import { LibroMayorAsientosRepository } from "../repositories/LibroMayorAsientosRepository";
import { ReporteDocumentosProveedorRepository } from "../repositories/ReporteDocumentosProveedorRepository";
import { ReporteGNRepository } from "../repositories/ReporteGNRepository";
import { ReporteHmisRepository } from "../repositories/ReporteHmisRepository";

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
import { ReporteGenericoSaldosService } from "../../application/services/ReporteGenericoSaldosService";
import { LibroMayorAsientosService } from "../../application/services/LibroMayorAsientosService";
import { ReporteGNService } from "../../application/services/ReporteGNService";
import { ReporteDocumentosProveedorService } from "../../application/services/ReporteDocumentosProveedorService";
import { ReporteHmisService } from "../../application/services/ReporteHmisService";

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
import { ReporteGenericoSaldosController } from "../controllers/ReporteGenericoSaldosController";
import { ReporteGenericoSaldosRoutes } from "../routes/ReporteGenericoSaldosRoutes";
import { LibroMayorAsientosController } from "../controllers/LibroMayorAsientosController";
import { ReporteGNController } from "../controllers/ReporteGNController";
import { ReporteDocumentosProveedorController } from "../controllers/ReporteDocumentosProveedorController";
import { HmisController } from "../controllers/HmisController";

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

// Reporte Generico Saldos Handlers
import { GenerarReporteGenericoSaldosHandler } from "../../application/handlers/reporte-generico-saldos/GenerarReporteGenericoSaldosHandler";
import { ObtenerReporteGenericoSaldosHandler } from "../../application/handlers/reporte-generico-saldos/ObtenerReporteGenericoSaldosHandler";
import { ExportarReporteGenericoSaldosExcelHandler } from "../../application/handlers/reporte-generico-saldos/ExportarReporteGenericoSaldosExcelHandler";
import { ObtenerEstadisticasReporteGenericoSaldosHandler } from "../../application/handlers/reporte-generico-saldos/ObtenerEstadisticasReporteGenericoSaldosHandler";

// Libro Mayor Asientos Handlers
import { ObtenerLibroMayorAsientosHandler } from "../../application/handlers/libro-mayor-asientos/ObtenerLibroMayorAsientosHandler";
import { GenerarLibroMayorAsientosHandler } from "../../application/handlers/libro-mayor-asientos/GenerarLibroMayorAsientosHandler";
import { ExportarLibroMayorAsientosExcelHandler } from "../../application/handlers/libro-mayor-asientos/ExportarLibroMayorAsientosExcelHandler";
import { ObtenerFiltrosLibroMayorAsientosHandler } from "../../application/handlers/libro-mayor-asientos/ObtenerFiltrosLibroMayorAsientosHandler";

// CQRS Service
import { CqrsService } from "../cqrs/CqrsService";

// Middleware
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { IReporteClipperRepository } from "../../domain/repositories/IReporteClipperRepository";
import { ReporteClipperRepository } from "../repositories/ReporteClipperRepository";
import { ClipperController } from "../controllers/ClipperController";
import { IReporteClipperService } from "../../domain/services/IReporteClipperService";
import { ReporteClipperService } from "../../application/services/ReporteCliperService";

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
  .bind<IReporteGenericoSaldosRepository>("IReporteGenericoSaldosRepository")
  .to(ReporteGenericoSaldosRepository);
container
  .bind<LibroMayorAsientosRepository>("LibroMayorAsientosRepository")
  .to(LibroMayorAsientosRepository);
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
  .bind<ICuentaContableRepository>("ICuentaContableRepository")
  .to(CuentaContableRepository);
container
  .bind<IReporteClipperRepository>("IReporteClipperRepository")
  .to(ReporteClipperRepository);

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
  .bind<IReporteGenericoSaldosService>("IReporteGenericoSaldosService")
  .to(ReporteGenericoSaldosService);
container
  .bind<ILibroMayorAsientosService>("ILibroMayorAsientosService")
  .to(LibroMayorAsientosService);
container.bind<IReporteGNService>("IReporteGNService").to(ReporteGNService);
container
  .bind<IReporteDocumentosProveedorService>(
    "IReporteDocumentosProveedorService"
  )
  .to(ReporteDocumentosProveedorService);
container
  .bind<IReporteHmisService>("IReporteHmisService")
  .to(ReporteHmisService);

container.bind<IDatabaseService>("IDatabaseService").to(DatabaseService);
container
  .bind<IReporteClipperService>("IReporteClipperService")
  .to(ReporteClipperService);

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
container
  .bind<ReporteGenericoSaldosController>("ReporteGenericoSaldosController")
  .to(ReporteGenericoSaldosController);
container
  .bind<ReporteGenericoSaldosRoutes>("ReporteGenericoSaldosRoutes")
  .to(ReporteGenericoSaldosRoutes);
container.bind<ClipperController>("ClipperController").to(ClipperController);
container
  .bind<LibroMayorAsientosController>("LibroMayorAsientosController")
  .to(LibroMayorAsientosController);
container
  .bind<ReporteGNController>("ReporteGNController")
  .to(ReporteGNController);
container
  .bind<ReporteDocumentosProveedorController>(
    "ReporteDocumentosProveedorController"
  )
  .to(ReporteDocumentosProveedorController);
container.bind<HmisController>("HmisController").to(HmisController);

// CQRS Buses
container.bind<ICommandBus>("ICommandBus").to(CommandBus);
container.bind<IQueryBus>("IQueryBus").to(QueryBus);

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

// Reporte Generico Saldos Handlers
container
  .bind<GenerarReporteGenericoSaldosHandler>(
    "GenerarReporteGenericoSaldosHandler"
  )
  .to(GenerarReporteGenericoSaldosHandler);
container
  .bind<ObtenerReporteGenericoSaldosHandler>(
    "ObtenerReporteGenericoSaldosHandler"
  )
  .to(ObtenerReporteGenericoSaldosHandler);
container
  .bind<ExportarReporteGenericoSaldosExcelHandler>(
    "ExportarReporteGenericoSaldosExcelHandler"
  )
  .to(ExportarReporteGenericoSaldosExcelHandler);
container
  .bind<ObtenerEstadisticasReporteGenericoSaldosHandler>(
    "ObtenerEstadisticasReporteGenericoSaldosHandler"
  )
  .to(ObtenerEstadisticasReporteGenericoSaldosHandler);

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

// CQRS Service
container.bind<CqrsService>("CqrsService").to(CqrsService);

// Middleware
container.bind<AuthMiddleware>("AuthMiddleware").to(AuthMiddleware);

export { container };
