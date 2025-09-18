// TYPES constant for dependency injection
export const TYPES = {
  // Repositories
  IUsuarioRepository: "IUsuarioRepository",
  IMenuRepository: "IMenuRepository",
  IRolRepository: "IRolRepository",
  ISistemaRepository: "ISistemaRepository",
  IConexionRepository: "IConexionRepository",
  IRolSistemaMenuRepository: "IRolSistemaMenuRepository",
  IConjuntoRepository: "IConjuntoRepository",
  ICentroCostoRepository: "ICentroCostoRepository",
  IMovimientoContableRepository: "IMovimientoContableRepository",
  IReporteCuentaContableRepository: "IReporteCuentaContableRepository",
  IReporteCuentaContableModificadaRepository:
    "IReporteCuentaContableModificadaRepository",
  IReporteCentroCostoRepository: "IReporteCentroCostoRepository",
  ITipoAsientoRepository: "ITipoAsientoRepository",
  IReporteGastosDestinoRepository: "IReporteGastosDestinoRepository",
  IReporteAsientosSinDimensionRepository:
    "IReporteAsientosSinDimensionRepository",
  IResumenAsientosRepository: "IResumenAsientosRepository",
  IReporteMensualCuentaCentroRepository:
    "IReporteMensualCuentaCentroRepository",
  IReporteMovimientosContablesRepository:
    "IReporteMovimientosContablesRepository",
  IReporteMovimientosContablesAgrupadosRepository:
    "IReporteMovimientosContablesAgrupadosRepository",
  IReporteCatalogoCuentasModificadasRepository:
    "IReporteCatalogoCuentasModificadasRepository",
  IDiarioContabilidadRepository: "IDiarioContabilidadRepository",
  IPlanContableRepository: "IPlanContableRepository",
  IPeriodoContableRepository: "IPeriodoContableRepository",
  IMovimientoContableAgrupadoRepository:
    "IMovimientoContableAgrupadoRepository",
  ISaldoPromediosRepository: "ISaldoPromediosRepository",
  ICuentaContableRepository: "ICuentaContableRepository",
  EstadoSituacionFinancieraRepository: "EstadoSituacionFinancieraRepository",
  EstadoResultadosRepository: "EstadoResultadosRepository",
  ILibroDiarioOficonRepository: "ILibroDiarioOficonRepository",
  ILibroMayorOficonRepository: "ILibroMayorOficonRepository",

  // Services
  IUsuarioService: "IUsuarioService",
  IAuthService: "IAuthService",
  IMenuService: "IMenuService",
  IRolService: "IRolService",
  ISistemaService: "ISistemaService",
  IConexionService: "IConexionService",
  IRolMenuService: "IRolMenuService",
  IRolSistemaMenuService: "IRolSistemaMenuService",
  IConjuntoService: "IConjuntoService",
  ICuentaContableService: "CuentaContableService",
  IResumenAsientosService: "ResumenAsientosService",
  IReporteMensualCuentaCentroService: "IReporteMensualCuentaCentroService",
  ITipoAsientoService: "TipoAsientoService",
  IReporteMovimientosContablesService: "IReporteMovimientosContablesService",
  IReporteMovimientosContablesAgrupadosService:
    "IReporteMovimientosContablesAgrupadosService",
  ISaldoPromediosService: "ISaldoPromediosService",
  IEstadoSituacionFinancieraService: "IEstadoSituacionFinancieraService",
  IEstadoResultadosService: "IEstadoResultadosService",
  IDatabaseService: "IDatabaseService",
  ILibroDiarioOficonService: "ILibroDiarioOficonService",
  ILibroMayorOficonService: "ILibroMayorOficonService",

  // Controllers
  UsuarioController: "UsuarioController",
  MenuController: "MenuController",
  RolController: "RolController",
  CuentaContableController: "CuentaContableController",
  SistemaController: "SistemaController",
  ConexionController: "ConexionController",
  RolMenuController: "RolMenuController",
  RolSistemaMenuController: "RolSistemaMenuController",
  ReporteCentroCostoController: "ReporteCentroCostoController",
  TipoAsientoController: "TipoAsientoController",
  ReporteGastosDestinoController: "ReporteGastosDestinoController",
  ReporteAsientosSinDimensionController:
    "ReporteAsientosSinDimensionController",
  ResumenAsientosController: "ResumenAsientosController",
  ReporteMensualCuentaCentroController: "ReporteMensualCuentaCentroController",
  ReporteMovimientosContablesController:
    "ReporteMovimientosContablesController",
  ReporteMovimientosContablesAgrupadosController:
    "ReporteMovimientosContablesAgrupadosController",
  ReporteCatalogoCuentasModificadasController:
    "ReporteCatalogoCuentasModificadasController",
  DiarioContabilidadController: "DiarioContabilidadController",
  PeriodoContableController: "PeriodoContableController",
  MovimientoContableAgrupadoController: "MovimientoContableAgrupadoController",
  SaldoPromediosController: "SaldoPromediosController",
  EstadoSituacionFinancieraController: "EstadoSituacionFinancieraController",
  EstadoResultadosController: "EstadoResultadosController",
  LibroMayorContabilidadController: "LibroMayorContabilidadController",
  LibroDiarioOficonController: "LibroDiarioOficonController",
  LibroDiarioOficonRoutes: "LibroDiarioOficonRoutes",
  LibroMayorOficonController: "LibroMayorOficonController",
  LibroMayorOficonRoutes: "LibroMayorOficonRoutes",

  // CQRS
  ICommandBus: "ICommandBus",
  IQueryBus: "IQueryBus",
  CommandBus: "CommandBus",
  QueryBus: "QueryBus",

  // Command Handlers
  CreateUsuarioHandler: "CreateUsuarioHandler",
  UpdateUsuarioHandler: "UpdateUsuarioHandler",
  DeleteUsuarioHandler: "DeleteUsuarioHandler",
  CreateRolHandler: "CreateRolHandler",
  UpdateRolHandler: "UpdateRolHandler",
  DeleteRolHandler: "DeleteRolHandler",

  // Query Handlers
  GetAllUsuariosHandler: "GetAllUsuariosHandler",
  GetUsuarioByIdHandler: "GetUsuarioByIdHandler",
  GetAllRolesHandler: "GetAllRolesHandler",
  GetRolByIdHandler: "GetRolByIdHandler",

  // Reporte Movimientos Contables Agrupados Handlers
  GenerarReporteMovimientosContablesAgrupadosHandler:
    "GenerarReporteMovimientosContablesAgrupadosHandler",
  ObtenerReporteMovimientosContablesAgrupadosHandler:
    "ObtenerReporteMovimientosContablesAgrupadosHandler",

  // Diario Contabilidad Handlers
  GenerarReporteDiarioContabilidadHandler:
    "GenerarReporteDiarioContabilidadHandler",
  ObtenerDiarioContabilidadHandler: "ObtenerDiarioContabilidadHandler",
  ExportarDiarioContabilidadExcelHandler:
    "ExportarDiarioContabilidadExcelHandler",

  // Libro Diario OFICON Handlers
  GenerarReporteLibroDiarioOficonHandler:
    "GenerarReporteLibroDiarioOficonHandler",
  GetLibroDiarioOficonHandler: "GetLibroDiarioOficonHandler",

  // Libro Mayor OFICON Handlers
  GenerarReporteLibroMayorOficonHandler:
    "GenerarReporteLibroMayorOficonHandler",
  GetLibroMayorOficonHandler: "GetLibroMayorOficonHandler",

  // Registro Compras OFICON
  IRegistroComprasOficonRepository: "IRegistroComprasOficonRepository",
  IRegistroComprasOficonService: "IRegistroComprasOficonService",
  RegistroComprasOficonRepository: "RegistroComprasOficonRepository",
  RegistroComprasOficonService: "RegistroComprasOficonService",
  RegistroComprasOficonController: "RegistroComprasOficonController",
  RegistroComprasOficonRoutes: "RegistroComprasOficonRoutes",
  GenerarReporteRegistroComprasOficonHandler:
    "GenerarReporteRegistroComprasOficonHandler",
  GetRegistroComprasOficonHandler: "GetRegistroComprasOficonHandler",

  // Balance Comprobación OFICON
  IBalanceComprobacionOficonRepository: "IBalanceComprobacionOficonRepository",
  IBalanceComprobacionOficonService: "IBalanceComprobacionOficonService",
  BalanceComprobacionOficonRepository: "BalanceComprobacionOficonRepository",
  BalanceComprobacionOficonService: "BalanceComprobacionOficonService",
  BalanceComprobacionOficonController: "BalanceComprobacionOficonController",
  BalanceComprobacionOficonRoutes: "BalanceComprobacionOficonRoutes",
  GetBalanceComprobacionOficonHandler: "GetBalanceComprobacionOficonHandler",

  // CQRS Service
  CqrsService: "CqrsService",

  // Middleware
  AuthMiddleware: "AuthMiddleware",

  // Infrastructure
  Sequelize: "Sequelize",

  // Ganancias y Pérdidas Clipper
  IGananciasPerdidasClipperRepository: "IGananciasPerdidasClipperRepository",
  IGananciasPerdidasClipperService: "IGananciasPerdidasClipperService",
  GananciasPerdidasClipperRepository: "GananciasPerdidasClipperRepository",
  GananciasPerdidasClipperService: "GananciasPerdidasClipperService",
  GananciasPerdidasClipperController: "GananciasPerdidasClipperController",

  // Análisis de Cuentas Clipper
  IAnalisisCuentasClipperRepository: "IAnalisisCuentasClipperRepository",
  IAnalisisCuentasClipperService: "IAnalisisCuentasClipperService",
  AnalisisCuentasClipperRepository: "AnalisisCuentasClipperRepository",
  AnalisisCuentasClipperService: "AnalisisCuentasClipperService",
  AnalisisCuentasClipperController: "AnalisisCuentasClipperController",
  AnalisisCuentasClipperRoutes: "AnalisisCuentasClipperRoutes",

  // Análisis de Cuentas por Rango Clipper
  IAnalisisCuentasRangoClipperRepository:
    "IAnalisisCuentasRangoClipperRepository",
  IAnalisisCuentasRangoClipperService: "IAnalisisCuentasRangoClipperService",
  AnalisisCuentasRangoClipperService: "AnalisisCuentasRangoClipperService",
  AnalisisCuentasRangoClipperController:
    "AnalisisCuentasRangoClipperController",
  AnalisisCuentasRangoClipperRoutes: "AnalisisCuentasRangoClipperRoutes",
};
