// TYPES constant for dependency injection
export const TYPES = {
    // Repositories
    IUsuarioRepository: 'IUsuarioRepository',
    IMenuRepository: 'IMenuRepository',
    IRolRepository: 'IRolRepository',
    ISistemaRepository: 'ISistemaRepository',
    IConexionRepository: 'IConexionRepository',
    IRolSistemaMenuRepository: 'IRolSistemaMenuRepository',
    IConjuntoRepository: 'IConjuntoRepository',
    ICentroCostoRepository: 'ICentroCostoRepository',
    IMovimientoContableRepository: 'IMovimientoContableRepository',
    IReporteCuentaContableRepository: 'IReporteCuentaContableRepository',
    IReporteCuentaContableModificadaRepository: 'IReporteCuentaContableModificadaRepository',
    IReporteCentroCostoRepository: 'IReporteCentroCostoRepository',
    ITipoAsientoRepository: 'ITipoAsientoRepository',
    IReporteGastosDestinoRepository: 'IReporteGastosDestinoRepository',
    IReporteAsientosSinDimensionRepository: 'IReporteAsientosSinDimensionRepository',
    IResumenAsientosRepository: 'IResumenAsientosRepository',
    IReporteMensualCuentaCentroRepository: 'IReporteMensualCuentaCentroRepository',
    IReporteMovimientosContablesRepository: 'IReporteMovimientosContablesRepository',
    IReporteMovimientosContablesAgrupadosRepository: 'IReporteMovimientosContablesAgrupadosRepository',
    IReporteCatalogoCuentasModificadasRepository: 'IReporteCatalogoCuentasModificadasRepository',
ILibroMayorRepository: 'ILibroMayorRepository',
    
IDiarioContabilidadRepository: 'IDiarioContabilidadRepository',
    IPlanContableRepository: 'IPlanContableRepository',
    IPeriodoContableRepository: 'IPeriodoContableRepository',
    IMovimientoContableAgrupadoRepository: 'IMovimientoContableAgrupadoRepository',
    ISaldoPromediosRepository: 'ISaldoPromediosRepository',
    ICuentaContableRepository: 'ICuentaContableRepository',

    // Services
    IUsuarioService: 'IUsuarioService',
    IAuthService: 'IAuthService',
    IMenuService: 'IMenuService',
    IRolService: 'IRolService',
    ISistemaService: 'ISistemaService',
    IConexionService: 'IConexionService',
    IRolMenuService: 'IRolMenuService',
    IRolSistemaMenuService: 'IRolSistemaMenuService',
    IConjuntoService: 'IConjuntoService',
    ICuentaContableService: 'CuentaContableService',
    IResumenAsientosService: 'ResumenAsientosService',
    IReporteMensualCuentaCentroService: 'IReporteMensualCuentaCentroService',
    ITipoAsientoService: 'TipoAsientoService',
    IReporteMovimientosContablesService: 'IReporteMovimientosContablesService',
    IReporteMovimientosContablesAgrupadosService: 'IReporteMovimientosContablesAgrupadosService',
    ISaldoPromediosService: 'ISaldoPromediosService',
    IDatabaseService: 'IDatabaseService',

    // Controllers
    UsuarioController: 'UsuarioController',
    MenuController: 'MenuController',
    RolController: 'RolController',
    CuentaContableController: 'CuentaContableController',
    SistemaController: 'SistemaController',
    ConexionController: 'ConexionController',
    RolMenuController: 'RolMenuController',
    RolSistemaMenuController: 'RolSistemaMenuController',
    ReporteCentroCostoController: 'ReporteCentroCostoController',
    TipoAsientoController: 'TipoAsientoController',
    ReporteGastosDestinoController: 'ReporteGastosDestinoController',
    ReporteAsientosSinDimensionController: 'ReporteAsientosSinDimensionController',
    ResumenAsientosController: 'ResumenAsientosController',
    ReporteMensualCuentaCentroController: 'ReporteMensualCuentaCentroController',
    ReporteMovimientosContablesController: 'ReporteMovimientosContablesController',
    ReporteMovimientosContablesAgrupadosController: 'ReporteMovimientosContablesAgrupadosController',
    ReporteCatalogoCuentasModificadasController: 'ReporteCatalogoCuentasModificadasController',
LibroMayorController: 'LibroMayorController',
    
DiarioContabilidadController: 'DiarioContabilidadController',
    PeriodoContableController: 'PeriodoContableController',
    MovimientoContableAgrupadoController: 'MovimientoContableAgrupadoController',
    SaldoPromediosController: 'SaldoPromediosController',

    // CQRS
    ICommandBus: 'ICommandBus',
    IQueryBus: 'IQueryBus',
    CommandBus: 'CommandBus',
    QueryBus: 'QueryBus',

    // Command Handlers
    CreateUsuarioHandler: 'CreateUsuarioHandler',
    UpdateUsuarioHandler: 'UpdateUsuarioHandler',
    DeleteUsuarioHandler: 'DeleteUsuarioHandler',
    CreateRolHandler: 'CreateRolHandler',
    UpdateRolHandler: 'UpdateRolHandler',
    DeleteRolHandler: 'DeleteRolHandler',

    // Query Handlers
    GetAllUsuariosHandler: 'GetAllUsuariosHandler',
    GetUsuarioByIdHandler: 'GetUsuarioByIdHandler',
    GetAllRolesHandler: 'GetAllRolesHandler',
    GetRolByIdHandler: 'GetRolByIdHandler',

    // Reporte Movimientos Contables Agrupados Handlers
    GenerarReporteMovimientosContablesAgrupadosHandler: 'GenerarReporteMovimientosContablesAgrupadosHandler',
    ObtenerReporteMovimientosContablesAgrupadosHandler: 'ObtenerReporteMovimientosContablesAgrupadosHandler',

    // Libro Mayor Handlers
    

    // Diario Contabilidad Handlers
    GenerarReporteDiarioContabilidadHandler: 'GenerarReporteDiarioContabilidadHandler',
    ObtenerDiarioContabilidadHandler: 'ObtenerDiarioContabilidadHandler',
    ExportarDiarioContabilidadExcelHandler: 'ExportarDiarioContabilidadExcelHandler',

    // CQRS Service
    CqrsService: 'CqrsService',

    // Middleware
    AuthMiddleware: 'AuthMiddleware',

    // Infrastructure
    Sequelize: 'Sequelize'
};
