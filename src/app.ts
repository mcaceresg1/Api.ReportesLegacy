import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { specs } from "./infrastructure/config/swagger";
import { specs as specsDocker } from "./infrastructure/config/swagger-docker";
import { container } from "./infrastructure/container/container";
import { UsuarioRoutes } from "./infrastructure/routes/UsuarioRoutes";
import { MenuRoutes } from "./infrastructure/routes/MenuRoutes";
import { RolRoutes } from "./infrastructure/routes/RolRoutes";
import { SistemaRoutes } from "./infrastructure/routes/SistemaRoutes";
import { ConexionRoutes } from "./infrastructure/routes/ConexionRoutes";
import { RolMenuRoutes } from "./infrastructure/routes/RolMenuRoutes";
import { RolSistemaMenuRoutes } from "./infrastructure/routes/RolSistemaMenuRoutes";
import { PermisoRoutes } from "./infrastructure/routes/PermisoRoutes";
import { createConjuntoRoutes } from "./infrastructure/routes/ConjuntoRoutes";
import { createExactusRoutes } from "./infrastructure/routes/ExactusRoutes";
import { createMovimientoContableRoutes } from "./infrastructure/routes/MovimientoContableRoutes";
import { createReporteCuentaContableRoutes } from "./infrastructure/routes/ReporteCuentaContableRoutes";
import { createCuentaContableRoutes } from "./infrastructure/routes/cuentaContable.routes";
import { createReporteCentroCostoRoutes } from "./infrastructure/routes/ReporteCentroCostoRoutes";
import { createTipoAsientoRoutes } from "./infrastructure/routes/TipoAsientoRoutes";
import ReporteAsientosSinDimensionRoutes from "./infrastructure/routes/ReporteAsientosSinDimensionRoutes";
import { createResumenAsientosRoutes } from "./infrastructure/routes/resumenAsientos.routes";
import { createReporteMensualCuentaCentroRoutes } from "./infrastructure/routes/ReporteMensualCuentaCentroRoutes";
import { createReporteMovimientosContablesRoutes } from "./infrastructure/routes/ReporteMovimientosContablesRoutes";
import { createReporteMovimientosContablesAgrupadosRoutes } from "./infrastructure/routes/ReporteMovimientosContablesAgrupadosRoutes";
import { createReporteCatalogoCuentasModificadasRoutes } from "./infrastructure/routes/ReporteCatalogoCuentasModificadasRoutes";
import { createReporteGastosDestinoRoutes } from "./infrastructure/routes/ReporteGastosDestinoRoutes";
import { createDiarioContabilidadRoutes } from "./infrastructure/routes/diarioContabilidad.routes";
import { createPlanContableRoutes } from "./infrastructure/routes/planContable.routes";
import { createPeriodoContableRoutes } from "./infrastructure/routes/periodoContable.routes";
import { createMovimientoContableAgrupadoRoutes } from "./infrastructure/routes/movimientoContableAgrupado.routes";
import { createSaldoPromediosRoutes } from "./infrastructure/routes/saldoPromedios.routes";
import { BalanceComprobacionRoutes } from "./infrastructure/routes/BalanceComprobacionRoutes";
import { AuthMiddleware } from "./infrastructure/middleware/AuthMiddleware";
import { QueryOptimizationMiddleware } from "./infrastructure/middleware/QueryOptimizationMiddleware";
import { IUsuarioService } from "./domain/services/IUsuarioService";
import { IAuthService } from "./domain/services/IAuthService";
import { IRolService } from "./domain/services/IRolService";
import { IRolSistemaMenuService } from "./domain/services/IRolSistemaMenuService";
import { ISistemaService } from "./domain/services/ISistemaService";
import { IMenuService } from "./domain/services/IMenuService";
import { IConjuntoService } from "./domain/services/IConjuntoService";
import { ICentroCostoRepository } from "./domain/repositories/ICentroCostoRepository";
import { IMovimientoContableRepository } from "./domain/repositories/IMovimientoContableRepository";
import { IReporteCuentaContableRepository } from "./domain/repositories/IReporteCuentaContableRepository";
import { IReporteCentroCostoRepository } from "./domain/repositories/IReporteCentroCostoRepository";
import { ICuentaContableRepository } from "./domain/repositories/ICuentaContableRepository";
import { CqrsService } from "./infrastructure/cqrs/CqrsService";
import { createReporteClipperRoutes } from "./infrastructure/routes/ReporteClipperRoutes";
import { AnalisisCuentasClipperRoutes } from "./infrastructure/routes/AnalisisCuentasClipperRoutes";
import { createGananciasPerdidasClipperRoutes } from "./infrastructure/routes/GananciasPerdidasClipperRoutes";
import { IReporteClipperRepository } from "./domain/repositories/IReporteClipperRepository";
import libroMayorAsientosRoutes from "./infrastructure/routes/libro-mayor-asientos.routes";
import libroDiarioAsientosRoutes from "./infrastructure/routes/libro-diario-asientos.routes";
import libroMayorRoutes from "./infrastructure/routes/libro-mayor.routes";
import estadoSituacionFinancieraRoutes from "./infrastructure/routes/estado-situacion-financiera.routes";
import estadoResultadosRoutes from "./infrastructure/routes/estado-resultados.routes";
import { createReporteGNRoutes } from "./infrastructure/routes/ReporteGNRoutes";
import { IReporteHmisRepository } from "./domain/repositories/IReporteHmisRepository";
import { IReporteGenericoSaldosRepository } from "./domain/repositories/IReporteGenericoSaldosRepository";
import { createReporteHmisRoutes } from "./infrastructure/routes/ReporteHmisRoutes";
import { createReporteGenericoSaldosRoutes } from "./infrastructure/routes/ReporteGenericoSaldosRoutes";
import { IReporteDocumentosProveedorRepository } from "./domain/repositories/IReporteDocumentosProveedorRepository";
import { createReporteDocumentosProveedorRoutes } from "./infrastructure/routes/ReporteDocumentosProveedorRoutes";
import libroMayorContabilidadRoutes from "./infrastructure/routes/LibroMayorContabilidadRoutes";
import { IClipperLibroDiarioRepository } from "./domain/repositories/IClipperLibroDiarioRepository";
import { createClipperLibroDiarioRoutes } from "./infrastructure/routes/ClipperLibroDiarioRoutes";
import { createClipperLibroCajaRoutes } from "./infrastructure/routes/ClipperLibroCajaRoutes";
import { createTestClipperDatabasesRoutes } from "./infrastructure/routes/TestClipperDatabasesRoutes";
import { createBalanceComprobacionClipperRoutes } from "./infrastructure/routes/BalanceComprobacionClipperRoutes";
import { createBalanceGeneralClipperRoutes } from "./infrastructure/routes/BalanceGeneralClipperRoutes";
import { LibroDiarioOficonRoutes } from "./infrastructure/routes/LibroDiarioOficonRoutes";
import { LibroMayorOficonRoutes } from "./infrastructure/routes/LibroMayorOficonRoutes";
import { RegistroComprasOficonRoutes } from "./infrastructure/routes/RegistroComprasOficonRoutes";
import { BalanceComprobacionOficonRoutes } from "./infrastructure/routes/BalanceComprobacionOficonRoutes";
// Importar controladores para que swagger-jsdoc procese la documentación
import "./infrastructure/controllers/BalanceComprobacionClipperController";
import "./infrastructure/controllers/BalanceGeneralClipperController";
import "./infrastructure/controllers/GananciasPerdidasClipperController";
import "./infrastructure/controllers/ClipperLibroCajaController";
import "./infrastructure/controllers/LibroDiarioOficonController";
import "./infrastructure/controllers/LibroMayorOficonController";
import "./infrastructure/controllers/RegistroComprasOficonController";

const reporteGNRoutes = createReporteGNRoutes();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de optimización de consultas
app.use(QueryOptimizationMiddleware.performanceMonitor);
app.use(QueryOptimizationMiddleware.basicRateLimit);
app.use(QueryOptimizationMiddleware.addCacheHeaders);

// Swagger configuration
const swaggerSpecs =
  process.env["NODE_ENV"] === "production" ? specsDocker : specs;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Obtener servicios del contenedor
const usuarioService = container.get<IUsuarioService>("IUsuarioService");
const authService = container.get<IAuthService>("IAuthService");
const rolService = container.get<IRolService>("IRolService");
const rolSistemaMenuService = container.get<IRolSistemaMenuService>(
  "IRolSistemaMenuService"
);
const authMiddleware = container.get<AuthMiddleware>("AuthMiddleware");
const sistemaService = container.get<ISistemaService>("ISistemaService");
const menuService = container.get<IMenuService>("IMenuService");
const conjuntoService = container.get<IConjuntoService>("IConjuntoService");
const centroCostoRepository = container.get<ICentroCostoRepository>(
  "ICentroCostoRepository"
);
const movimientoContableRepository =
  container.get<IMovimientoContableRepository>("IMovimientoContableRepository");
const reporteCuentaContableRepository =
  container.get<IReporteCuentaContableRepository>(
    "IReporteCuentaContableRepository"
  );
const reporteCentroCostoRepository =
  container.get<IReporteCentroCostoRepository>("IReporteCentroCostoRepository");
const cuentaContableRepository = container.get<ICuentaContableRepository>(
  "ICuentaContableRepository"
);
const reporteClipperRepository = container.get<IReporteClipperRepository>(
  "IReporteClipperRepository"
);
const reporteHmisRepository = container.get<IReporteHmisRepository>(
  "IReporteHmisRepository"
);
const reporteGenericoSaldosRepository =
  container.get<IReporteGenericoSaldosRepository>(
    "IReporteGenericoSaldosRepository"
  );
const reporteDocumentosProveedorRepository =
  container.get<IReporteDocumentosProveedorRepository>(
    "IReporteDocumentosProveedorRepository"
  );

const reporteClipperLibroDiarioRepository =
  container.get<IClipperLibroDiarioRepository>("IClipperLibroDiarioRepository");

// Inicializar CQRS
console.log("🚀 Inicializando CQRS Service...");
const cqrsService = container.get<CqrsService>("CqrsService");

// Registrar handlers manualmente como fallback
console.log("🔧 Registrando handlers manualmente...");
const commandBus = cqrsService.getCommandBus();
const queryBus = cqrsService.getQueryBus();

// Diario Contabilidad Handlers
const generarReporteDiarioContabilidadHandler = container.get(
  "GenerarReporteDiarioContabilidadHandler"
) as any;
const obtenerDiarioContabilidadHandler = container.get(
  "ObtenerDiarioContabilidadHandler"
) as any;
const exportarDiarioContabilidadExcelHandler = container.get(
  "ExportarDiarioContabilidadExcelHandler"
) as any;

commandBus.register(
  "GenerarReporteDiarioContabilidadCommand",
  generarReporteDiarioContabilidadHandler
);
queryBus.register(
  "ObtenerDiarioContabilidadQuery",
  obtenerDiarioContabilidadHandler
);
queryBus.register(
  "ExportarDiarioContabilidadExcelQuery",
  exportarDiarioContabilidadExcelHandler
);

// Balance Comprobación Handlers
const generarReporteBalanceComprobacionHandler = container.get(
  "GenerarReporteBalanceComprobacionHandler"
) as any;
const obtenerBalanceComprobacionHandler = container.get(
  "ObtenerBalanceComprobacionHandler"
) as any;
const exportarBalanceComprobacionExcelHandler = container.get(
  "ExportarBalanceComprobacionExcelHandler"
) as any;

commandBus.register(
  "GenerarReporteBalanceComprobacionCommand",
  generarReporteBalanceComprobacionHandler
);
queryBus.register(
  "ObtenerBalanceComprobacionQuery",
  obtenerBalanceComprobacionHandler
);
queryBus.register(
  "ExportarBalanceComprobacionExcelQuery",
  exportarBalanceComprobacionExcelHandler
);

// Libro Diario Asientos Handlers
console.log("🔧 Registrando handlers de Libro Diario Asientos manualmente...");
const obtenerLibroDiarioAsientosHandler = container.get(
  "ObtenerLibroDiarioAsientosHandler"
) as any;
const generarLibroDiarioAsientosHandler = container.get(
  "GenerarLibroDiarioAsientosHandler"
) as any;
const obtenerFiltrosLibroDiarioAsientosHandler = container.get(
  "ObtenerFiltrosLibroDiarioAsientosHandler"
) as any;

console.log(
  "🔍 Handler ObtenerLibroDiarioAsientosHandler:",
  obtenerLibroDiarioAsientosHandler
);

queryBus.register(
  "ObtenerLibroDiarioAsientosQuery",
  obtenerLibroDiarioAsientosHandler
);
console.log("✅ ObtenerLibroDiarioAsientosQuery registrado manualmente");
queryBus.register(
  "GenerarLibroDiarioAsientosQuery",
  generarLibroDiarioAsientosHandler
);
console.log("✅ GenerarLibroDiarioAsientosQuery registrado manualmente");
queryBus.register(
  "ObtenerFiltrosLibroDiarioAsientosQuery",
  obtenerFiltrosLibroDiarioAsientosHandler
);
console.log("✅ ObtenerFiltrosLibroDiarioAsientosQuery registrado manualmente");

// Balance Comprobación Clipper - No necesita handlers CQRS, usa servicio directamente

console.log("✅ Handlers registrados manualmente");
console.log("✅ CQRS Service inicializado");

// Rutas
const usuarioRoutes = new UsuarioRoutes();
const menuRoutes = new MenuRoutes();
const rolRoutes = new RolRoutes();
const sistemaRoutes = new SistemaRoutes();
const conexionRoutes = new ConexionRoutes();
const rolMenuRoutes = new RolMenuRoutes();
const rolSistemaMenuRoutes = new RolSistemaMenuRoutes();
const permisoRoutes = new PermisoRoutes();

// Rutas de EXACTUS
const conjuntoRoutes = createConjuntoRoutes(conjuntoService);
const exactusRoutes = createExactusRoutes(
  centroCostoRepository,
  cuentaContableRepository
);
const movimientoContableRoutes = createMovimientoContableRoutes(
  movimientoContableRepository
);
const reporteCuentaContableRoutes = createReporteCuentaContableRoutes(
  reporteCuentaContableRepository
);
const reporteCentroCostoRoutes = createReporteCentroCostoRoutes(
  reporteCentroCostoRepository
);
const reporteGastosDestinoRoutes = createReporteGastosDestinoRoutes();
const tipoAsientoRoutes = createTipoAsientoRoutes();
const reporteAsientosSinDimensionRoutes = ReporteAsientosSinDimensionRoutes;
const resumenAsientosRoutes = createResumenAsientosRoutes();
const reporteMensualCuentaCentroRoutes =
  createReporteMensualCuentaCentroRoutes();
const reporteMovimientosContablesRoutes =
  createReporteMovimientosContablesRoutes();
const reporteMovimientosContablesAgrupadosRoutes =
  createReporteMovimientosContablesAgrupadosRoutes();
const reporteCatalogoCuentasModificadasRoutes =
  createReporteCatalogoCuentasModificadasRoutes();
const reporteClipperRoutes = createReporteClipperRoutes(
  reporteClipperRepository
);
const reporteHmisRoutes = createReporteHmisRoutes(reporteHmisRepository);
const reporteGenericoSaldosRoutes = createReporteGenericoSaldosRoutes(
  reporteGenericoSaldosRepository
);

// Balance Comprobación Routes
const balanceComprobacionRoutes = container.get<BalanceComprobacionRoutes>(
  "BalanceComprobacionRoutes"
);

const reporteDocumentosProveedorRoutes = createReporteDocumentosProveedorRoutes(
  reporteDocumentosProveedorRepository
);

const reporteClipperLibroDiarioRoutes = createClipperLibroDiarioRoutes();

// Balance Comprobación Clipper Routes
const balanceComprobacionClipperRoutes =
  createBalanceComprobacionClipperRoutes();

// Balance General Clipper Routes
const balanceGeneralClipperRoutes = createBalanceGeneralClipperRoutes();

// Análisis de Cuentas Clipper Routes
const analisisCuentasClipperRoutes =
  container.get<AnalisisCuentasClipperRoutes>("AnalisisCuentasClipperRoutes");

const libroDiarioOficonRoutes = container.get<LibroDiarioOficonRoutes>(
  "LibroDiarioOficonRoutes"
);
console.log(
  "🔧 LibroDiarioOficonRoutes obtenido del contenedor:",
  !!libroDiarioOficonRoutes
);

const libroMayorOficonRoutes = container.get<LibroMayorOficonRoutes>(
  "LibroMayorOficonRoutes"
);
console.log(
  "🔧 LibroMayorOficonRoutes obtenido del contenedor:",
  !!libroMayorOficonRoutes
);

const registroComprasOficonRoutes = container.get<RegistroComprasOficonRoutes>(
  "RegistroComprasOficonRoutes"
);
console.log(
  "🔧 RegistroComprasOficonRoutes obtenido del contenedor:",
  !!registroComprasOficonRoutes
);

const balanceComprobacionOficonRoutes =
  container.get<BalanceComprobacionOficonRoutes>(
    "BalanceComprobacionOficonRoutes"
  );
console.log(
  "🔧 BalanceComprobacionOficonRoutes obtenido del contenedor:",
  !!balanceComprobacionOficonRoutes
);

// Endpoint de prueba
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend funcionando correctamente",
    timestamp: new Date().toISOString(),
    status: "OK",
  });
});

// Endpoint de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env["NODE_ENV"] || "development",
    version: "1.15.0",
  });
});

// Libro Diario OFICON Routes (antes de las rutas protegidas)
console.log("🔧 Registrando rutas de Libro Diario OFICON...");
const libroDiarioRouter = libroDiarioOficonRoutes.getRouter();
console.log("🔧 Router obtenido:", !!libroDiarioRouter);
app.use("/api/libro-diario-oficon", libroDiarioRouter);
console.log("✅ Libro Diario OFICON routes registradas correctamente");

// Libro Mayor OFICON Routes (antes de las rutas protegidas)
console.log("🔧 Registrando rutas de Libro Mayor OFICON...");
const libroMayorRouter = libroMayorOficonRoutes.getRouter();
console.log("🔧 Router obtenido:", !!libroMayorRouter);
app.use("/api/libro-mayor-oficon", libroMayorRouter);
console.log("✅ Libro Mayor OFICON routes registradas correctamente");

// Registro Compras OFICON Routes (antes de las rutas protegidas)
console.log("🔧 Registrando rutas de Registro Compras OFICON...");
const registroComprasRouter = registroComprasOficonRoutes.getRouter();
console.log("🔧 Router obtenido:", !!registroComprasRouter);
app.use("/api/registro-compras-oficon", registroComprasRouter);
console.log("✅ Registro Compras OFICON routes registradas correctamente");

// Balance Comprobación OFICON Routes (antes de las rutas protegidas)
console.log("🔧 Registrando rutas de Balance Comprobación OFICON...");
const balanceComprobacionRouter = balanceComprobacionOficonRoutes.getRouter();
console.log("🔧 Router obtenido:", !!balanceComprobacionRouter);
app.use("/api/balance-comprobacion-oficon", balanceComprobacionRouter);
console.log("✅ Balance Comprobación OFICON routes registradas correctamente");

// Endpoint de prueba directo para Libro Diario OFICON
app.get("/api/libro-diario-oficon/test", (req, res) => {
  res.json({
    success: true,
    message: "Endpoint de prueba de Libro Diario OFICON funcionando",
    timestamp: new Date().toISOString(),
  });
});
console.log("✅ Endpoint de prueba de Libro Diario OFICON registrado");

// Endpoint de prueba directo para Libro Mayor OFICON
app.get("/api/libro-mayor-oficon/test", (req, res) => {
  res.json({
    success: true,
    message: "Endpoint de prueba de Libro Mayor OFICON funcionando",
    timestamp: new Date().toISOString(),
  });
});
console.log("✅ Endpoint de prueba de Libro Mayor OFICON registrado");

// Endpoint de prueba directo para Registro Compras OFICON
app.get("/api/registro-compras-oficon/test", (req, res) => {
  res.json({
    success: true,
    message: "Endpoint de prueba de Registro Compras OFICON funcionando",
    timestamp: new Date().toISOString(),
  });
});
console.log("✅ Endpoint de prueba de Registro Compras OFICON registrado");

// Endpoint de prueba directo para Balance Comprobación OFICON
app.get("/api/balance-comprobacion-oficon/test", (req, res) => {
  res.json({
    success: true,
    message: "Endpoint de prueba de Balance Comprobación OFICON funcionando",
    timestamp: new Date().toISOString(),
  });
});
console.log("✅ Endpoint de prueba de Balance Comprobación OFICON registrado");

// Rutas de menús (algunas públicas, otras protegidas)
app.use("/api/menus", menuRoutes.getRouter());

// Aplicar middleware de autenticación a rutas protegidas
app.use("/api/usuarios", authMiddleware.verifyToken, usuarioRoutes.getRouter());
app.use("/api/roles", authMiddleware.verifyToken, rolRoutes.getRouter());
app.use("/api/sistemas", authMiddleware.verifyToken, sistemaRoutes.getRouter());
app.use(
  "/api/conexiones",
  authMiddleware.verifyToken,
  conexionRoutes.getRouter()
);
app.use("/api/rol-menu", authMiddleware.verifyToken, rolMenuRoutes.getRouter());
app.use(
  "/api/rol-sistema-menu",
  authMiddleware.verifyToken,
  rolSistemaMenuRoutes.getRouter()
);
app.use("/api/permisos", authMiddleware.verifyToken, permisoRoutes.getRouter());

// Rutas de EXACTUS (solo lectura, sin autenticación)
app.use(
  "/api/conjuntos",
  QueryOptimizationMiddleware.validateQueryParams,
  conjuntoRoutes
);
app.use(
  "/api/exactus",
  QueryOptimizationMiddleware.validateQueryParams,
  exactusRoutes
);
app.use(
  "/api/cuentas-contables",
  QueryOptimizationMiddleware.validateQueryParams,
  createCuentaContableRoutes()
);
app.use(
  "/api/movimientos",
  QueryOptimizationMiddleware.validateQueryParams,
  movimientoContableRoutes
);
app.use(
  "/api/reporte-cuenta-contable",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteCuentaContableRoutes
);
app.use(
  "/api/reporte-centro-costo",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteCentroCostoRoutes
);
app.use(
  "/api/tipos-asiento",
  QueryOptimizationMiddleware.validateQueryParams,
  tipoAsientoRoutes
);
app.use(
  "/api/reporte-gastos-destino",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteGastosDestinoRoutes
);
app.use(
  "/api/reporte-asientos-sin-dimension",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteAsientosSinDimensionRoutes
);
app.use(
  "/api/resumen-asientos",
  QueryOptimizationMiddleware.validateQueryParams,
  resumenAsientosRoutes
);
app.use(
  "/api/reporte-mensual-cuenta-centro",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteMensualCuentaCentroRoutes
);
app.use(
  "/api/reporte-movimientos-contables",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteMovimientosContablesRoutes
);
app.use(
  "/api/reporte-movimientos-contables-agrupados",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteMovimientosContablesAgrupadosRoutes
);
app.use(
  "/api/reporte-catalogo-cuentas-modificadas",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteCatalogoCuentasModificadasRoutes
);

// Libro Mayor Asientos Routes
app.use(
  "/api/libro-mayor-asientos",
  QueryOptimizationMiddleware.validateQueryParams,
  libroMayorAsientosRoutes
);

// Libro Diario Asientos Routes
app.use(
  "/api/libro-diario-asientos",
  QueryOptimizationMiddleware.validateQueryParams,
  libroDiarioAsientosRoutes
);
console.log("✅ Libro Mayor Asientos routes registradas correctamente");

// Libro Mayor Routes
app.use(
  "/api/libro-mayor",
  QueryOptimizationMiddleware.validateQueryParams,
  libroMayorRoutes
);
console.log("✅ Libro Mayor routes registradas correctamente");

// Estado Situación Financiera Routes
app.use(
  "/api/estado-situacion-financiera",
  QueryOptimizationMiddleware.validateQueryParams,
  estadoSituacionFinancieraRoutes
);
console.log("✅ Estado Situación Financiera routes registradas correctamente");

// Estado Resultados Routes
app.use(
  "/api/estado-resultados",
  QueryOptimizationMiddleware.validateQueryParams,
  estadoResultadosRoutes
);
console.log("✅ Estado Resultados routes registradas correctamente");

// Libro Mayor de Contabilidad Routes
app.use(
  "/api/libro-mayor-contabilidad",
  QueryOptimizationMiddleware.validateQueryParams,
  libroMayorContabilidadRoutes
);
console.log("✅ Libro Mayor de Contabilidad routes registradas correctamente");

app.use(
  "/api/diario-contabilidad",
  QueryOptimizationMiddleware.validateQueryParams,
  createDiarioContabilidadRoutes()
);
app.use(
  "/api/plan-contable",
  QueryOptimizationMiddleware.validateQueryParams,
  createPlanContableRoutes()
);
app.use(
  "/api/reporte-periodo-contable",
  QueryOptimizationMiddleware.validateQueryParams,
  createPeriodoContableRoutes()
);
app.use(
  "/api/movimiento-contable-agrupado",
  QueryOptimizationMiddleware.validateQueryParams,
  createMovimientoContableAgrupadoRoutes()
);
app.use(
  "/api/saldo-promedios",
  QueryOptimizationMiddleware.validateQueryParams,
  createSaldoPromediosRoutes()
);
app.use(
  "/api/reporte-clipper",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteClipperRoutes
);
app.use(
  "/api/balance-comprobacion",
  QueryOptimizationMiddleware.validateQueryParams,
  balanceComprobacionRoutes.getRouter()
);
app.use(
  "/api/reporte-hmis",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteHmisRoutes
);
app.use(
  "/api/reporte-generico-saldos",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteGenericoSaldosRoutes
);
app.use(
  "/api/documentos-proveedor",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteDocumentosProveedorRoutes
);

app.use("/api/libro-diario-clipper", createClipperLibroDiarioRoutes());
console.log("✅ REPORTE Libro diario Clipper routes registradas correctamente");

app.use("/api/libro-caja-clipper", createClipperLibroCajaRoutes());
console.log("✅ REPORTE Libro caja Clipper routes registradas correctamente");

// Balance Comprobación Clipper Routes
app.use(
  "/api/balance-comprobacion-clipper",
  QueryOptimizationMiddleware.validateQueryParams,
  balanceComprobacionClipperRoutes
);
console.log("✅ Balance Comprobación Clipper routes registradas correctamente");

// Análisis de Cuentas Clipper Routes
app.use(
  "/api/analisis-cuentas-clipper",
  QueryOptimizationMiddleware.validateQueryParams,
  analisisCuentasClipperRoutes.getRouter()
);
console.log("✅ Análisis de Cuentas Clipper routes registradas correctamente");

// Balance General Clipper Routes
app.use(
  "/api/balance-general-clipper",
  QueryOptimizationMiddleware.validateQueryParams,
  balanceGeneralClipperRoutes
);
console.log("✅ Balance General Clipper routes registradas correctamente");

// Ganancias y Pérdidas Clipper Routes
app.use(
  "/api/ganancias-perdidas-clipper",
  QueryOptimizationMiddleware.validateQueryParams,
  createGananciasPerdidasClipperRoutes()
);
console.log("✅ Ganancias y Pérdidas Clipper routes registradas correctamente");

// Test Clipper Databases Routes
app.use("/api/test-clipper-databases", createTestClipperDatabasesRoutes());
console.log("✅ Test Clipper Databases routes registradas correctamente");

// =================== ENDPOINTS ADICIONALES DEL PROYECTO JS ===================

// Endpoints de usuarios adicionales
app.get("/api/usuarios/con-roles", async (req, res) => {
  try {
    // TODO: Implementar lógica para obtener usuarios con roles
    res.json({
      message: "Endpoint usuarios con roles - pendiente de implementar",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener usuarios con roles",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

app.get(
  "/api/usuarios/con-empresa",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      // TODO: Implementar lógica para obtener usuarios con empresa
      res.json({
        message: "Endpoint usuarios con empresa - pendiente de implementar",
      });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener usuarios con empresa",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
);

/**
 * @swagger
 * /api/usuarios/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Usuarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsuarioCreate'
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Error en los datos de entrada
 *       500:
 *         description: Error interno del servidor
 */
app.post("/api/usuarios/register", async (req, res) => {
  try {
    const usuarioData = req.body;
    const usuario = await usuarioService.createUsuario(usuarioData);
    res.status(201).json({
      success: true,
      data: usuario,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error al registrar usuario",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

app.patch(
  "/api/usuarios/estado",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const { id, estado } = req.body;
      if (!id || estado === undefined) {
        res.status(400).json({
          success: false,
          message: "ID y estado son requeridos",
        });
        return;
      }

      const success = estado
        ? await usuarioService.activateUsuario(id)
        : await usuarioService.deactivateUsuario(id);

      if (!success) {
        res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
        });
        return;
      }

      res.json({
        success: true,
        message: `Usuario ${estado ? "activado" : "desactivado"} correctamente`,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al cambiar estado del usuario",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
);

/**
 * @swagger
 * /api/roles/activos:
 *   get:
 *     summary: Obtener roles activos
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: Lista de roles activos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rol'
 *       500:
 *         description: Error interno del servidor
 */
// Endpoints de roles adicionales
app.get("/api/roles/activos", async (req, res) => {
  try {
    const roles = await rolService.getAllRoles();
    const rolesActivos = roles.filter((rol) => rol.estado);
    res.json(rolesActivos);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener roles activos",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

app.get(
  "/api/roles/:id/permisos",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const id = req.params["id"];
      if (!id) {
        res.status(400).json({
          success: false,
          message: "ID de rol requerido",
        });
        return;
      }

      const rolId = parseInt(id);
      if (isNaN(rolId)) {
        res.status(400).json({
          success: false,
          message: "ID de rol inválido",
        });
        return;
      }

      // Obtener todos los menús asignados al rol (sin filtrar por sistema por ahora)
      const menus = await rolSistemaMenuService.getMenusByRolAndSistema(
        rolId,
        1
      ); // Sistema por defecto

      res.json(menus);
    } catch (error) {
      console.error("Error al obtener permisos del rol:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener permisos del rol",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
);

/**
 * @swagger
 * /api/rol/{rolId}/permisos:
 *   get:
 *     summary: Obtener permisos de un rol específico
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Permisos del rol obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu'
 *       400:
 *         description: ID de rol inválido
 *       500:
 *         description: Error interno del servidor
 */
app.get(
  "/api/rol/:rolId/permisos",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const { rolId } = req.params;
      if (!rolId) {
        res.status(400).json({
          success: false,
          message: "ID de rol requerido",
        });
        return;
      }

      const rolIdNum = parseInt(rolId);
      if (isNaN(rolIdNum)) {
        res.status(400).json({
          success: false,
          message: "ID de rol inválido",
        });
        return;
      }

      // Obtener todos los permisos asignados al rol
      const permisos = await rolSistemaMenuService.getPermisosByRol(rolIdNum);

      res.json(permisos);
    } catch (error) {
      console.error("Error al obtener permisos del rol:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener permisos del rol",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
);

/**
 * @swagger
 * /api/rol/{rolId}/permisos-disponibles:
 *   get:
 *     summary: Obtener todos los permisos disponibles marcando los que están activos para un rol
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: rolId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Permisos disponibles con marcado de activos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   descripcion:
 *                     type: string
 *                   routePath:
 *                     type: string
 *                   sistemaId:
 *                     type: integer
 *                   activo:
 *                     type: boolean
 *       400:
 *         description: ID de rol inválido
 *       500:
 *         description: Error interno del servidor
 */
app.get(
  "/api/rol/:rolId/permisos-disponibles",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const { rolId } = req.params;
      if (!rolId) {
        res.status(400).json({
          success: false,
          message: "ID de rol requerido",
        });
        return;
      }

      const rolIdNum = parseInt(rolId);
      if (isNaN(rolIdNum)) {
        res.status(400).json({
          success: false,
          message: "ID de rol inválido",
        });
        return;
      }

      // Obtener todos los permisos disponibles con marcado de activos para el rol
      const permisosDisponibles =
        await rolSistemaMenuService.getPermisosDisponiblesConMarcado(rolIdNum);

      res.json(permisosDisponibles);
    } catch (error) {
      console.error("Error al obtener permisos disponibles del rol:", error);
      res.status(500).json({
        success: false,
        message: "Error al obtener permisos disponibles del rol",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
);

app.use(
  "/api/reporte-gn",
  QueryOptimizationMiddleware.validateQueryParams,
  reporteGNRoutes
);

app.get(
  "/api/roles/:id/menus",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      // TODO: Implementar lógica para obtener menús de un rol
      res.json({ message: "Endpoint menús de rol - pendiente de implementar" });
    } catch (error) {
      res.status(500).json({
        message: "Error al obtener menús del rol",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
);

// Endpoints de debug/test
app.get("/api/test/usuarios", async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json({
      message: "Prueba de usuarios completada",
      totalUsuarios: usuarios.length,
      usuarios: usuarios.slice(0, 3), // Solo mostrar los primeros 3
    });
  } catch (error) {
    res.status(500).json({
      message: "Error en prueba de usuarios",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

app.get("/api/debug/usuarios-empresa", async (req, res) => {
  try {
    // TODO: Implementar lógica de debug para usuarios con empresa
    res.json({ message: "Debug usuarios empresa - pendiente de implementar" });
  } catch (error) {
    res.status(500).json({
      message: "Error en debug usuarios empresa",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Endpoint adicional para usuarios con empresa (coincide con proyecto JS)
app.get(
  "/api/usuarios-con-empresa",
  authMiddleware.verifyToken,
  async (req, res) => {
    try {
      const usuarios = await usuarioService.getUsuariosConEmpresa();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al obtener usuarios con empresa",
        error: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
);

// Endpoint público para usuarios con empresa (sin autenticación)
app.get("/api/usuarios-con-empresa-public", async (req, res) => {
  try {
    const usuarios = await usuarioService.getUsuariosConEmpresa();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios con empresa",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Endpoint público para sistemas (sin autenticación)
app.get("/api/sistemas-public", async (req, res) => {
  try {
    const sistemas = await sistemaService.getAllSistemas();
    res.json(sistemas);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener sistemas",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Endpoint público para menús (sin autenticación)
app.get("/api/menus-public", async (req, res) => {
  try {
    const menus = await menuService.getAllMenus();
    res.json(menus);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener menús",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Endpoint público para roles activos (sin autenticación)
app.get("/api/roles-activos-public", async (req, res) => {
  try {
    const roles = await rolService.getAllRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener roles activos",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Endpoints públicos para funcionalidades de sistemas
app.get("/api/sistemas/:sistemaId/usuarios-public", async (req, res) => {
  try {
    const { sistemaId } = req.params;
    const usuarios = await sistemaService.getUsuariosPorSistema(
      parseInt(sistemaId)
    );
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener usuarios del sistema",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

app.get("/api/sistemas/:sistemaId/permisos-public", async (req, res) => {
  try {
    const { sistemaId } = req.params;
    const permisos = await sistemaService.getPermisosSistema(
      parseInt(sistemaId)
    );
    res.json(permisos);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener permisos del sistema",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

app.get("/api/sistemas/:sistemaId/estadisticas-public", async (req, res) => {
  try {
    const { sistemaId } = req.params;
    const estadisticas = await sistemaService.getEstadisticasSistema(
      parseInt(sistemaId)
    );
    res.json(estadisticas);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas del sistema",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.json({
    message: "API Reportes Legacy - TypeScript",
    version: "1.0.0",
    docs: "/api-docs",
    endpoints: {
      auth: "/api/login",
      usuarios: "/api/usuarios",
      menus: "/api/menus",
      roles: "/api/roles",
      sistemas: "/api/sistemas",
      conexiones: "/api/conexiones",
      permisos: "/api/permisos",
    },
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Nombre de usuario
 *         password:
 *           type: string
 *           description: Contraseña del usuario
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         data:
 *           type: object
 *           properties:
 *             usuario:
 *               $ref: '#/components/schemas/Usuario'
 *             token:
 *               type: string
 */
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        success: false,
        message: "Username y password son requeridos",
      });
      return;
    }

    const result = await authService.login({ username, password });
    res.json({
      success: true,
      data: {
        token: result.token,
        usuario: result.usuario,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(401).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Error de autenticación",
    });
  }
});

// Endpoint temporal para crear usuario de prueba (sin autenticación)
app.post("/api/create-test-user", async (req, res) => {
  try {
    const usuarioData = {
      username: "testuser",
      email: "testuser@test.com",
      password: "SecurePass2024!",
      estado: true,
      rolId: 1,
      empresa: "TEST",
    };

    const usuario = await usuarioService.createUsuario(usuarioData);
    res.json({
      success: true,
      message: "Usuario de prueba creado exitosamente",
      data: {
        id: usuario.id,
        username: usuario.username,
        email: usuario.email,
        rolId: usuario.rolId,
      },
    });
  } catch (error) {
    console.error("Error creando usuario de prueba:", error);
    res.status(500).json({
      success: false,
      message: "Error creando usuario de prueba",
      error: error instanceof Error ? error.message : "Error desconocido",
    });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Autenticar usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Faltan campos requeridos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar estado del servidor
 *     tags: [Sistema]
 *     responses:
 *       200:
 *         description: Servidor funcionando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

// Middleware de manejo de errores
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      error:
        process.env["NODE_ENV"] === "development"
          ? err.message
          : "Error interno",
    });
  }
);

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Endpoint original modificado para incluir paginación

export default app;
