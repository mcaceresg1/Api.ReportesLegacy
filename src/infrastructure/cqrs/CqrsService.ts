import { injectable, inject } from "inversify";
import { ICommandBus } from "../../domain/cqrs/ICommandBus";
import { IQueryBus } from "../../domain/cqrs/IQueryBus";

// Command handlers
import { CreateUsuarioHandler } from "../../application/handlers/usuario/CreateUsuarioHandler";
import { UpdateUsuarioHandler } from "../../application/handlers/usuario/UpdateUsuarioHandler";
import { DeleteUsuarioHandler } from "../../application/handlers/usuario/DeleteUsuarioHandler";

// Query handlers
import { GetAllUsuariosHandler } from "../../application/handlers/usuario/GetAllUsuariosHandler";
import { GetUsuarioByIdHandler } from "../../application/handlers/usuario/GetUsuarioByIdHandler";

// Rol Command handlers
import { CreateRolHandler } from "../../application/handlers/rol/CreateRolHandler";
import { UpdateRolHandler } from "../../application/handlers/rol/UpdateRolHandler";
import { DeleteRolHandler } from "../../application/handlers/rol/DeleteRolHandler";

// Rol Query handlers
import { GetAllRolesHandler } from "../../application/handlers/rol/GetAllRolesHandler";
import { GetRolByIdHandler } from "../../application/handlers/rol/GetRolByIdHandler";

// Diario Contabilidad handlers
import { GenerarReporteDiarioContabilidadHandler } from "../../application/handlers/diario-contabilidad/GenerarReporteDiarioContabilidadHandler";
import { ObtenerDiarioContabilidadHandler } from "../../application/handlers/diario-contabilidad/ObtenerDiarioContabilidadHandler";
import { ExportarDiarioContabilidadExcelHandler } from "../../application/handlers/diario-contabilidad/ExportarDiarioContabilidadExcelHandler";

// Reporte Genérico de Saldos handlers
import { GenerarReporteGenericoSaldosHandler } from "../../application/handlers/reporte-generico-saldos/GenerarReporteGenericoSaldosHandler";

// Libro Diario Asientos handlers
import { ObtenerLibroDiarioAsientosHandler } from "../../application/handlers/libro-diario-asientos/ObtenerLibroDiarioAsientosHandler";
import { GenerarLibroDiarioAsientosHandler } from "../../application/handlers/libro-diario-asientos/GenerarLibroDiarioAsientosHandler";
import { ObtenerFiltrosLibroDiarioAsientosHandler } from "../../application/handlers/libro-diario-asientos/ObtenerFiltrosLibroDiarioAsientosHandler";

@injectable()
export class CqrsService {
  constructor(
    @inject("ICommandBus") private commandBus: ICommandBus,
    @inject("IQueryBus") private queryBus: IQueryBus,
    @inject("CreateUsuarioHandler")
    private createUsuarioHandler: CreateUsuarioHandler,
    @inject("UpdateUsuarioHandler")
    private updateUsuarioHandler: UpdateUsuarioHandler,
    @inject("DeleteUsuarioHandler")
    private deleteUsuarioHandler: DeleteUsuarioHandler,
    @inject("GetAllUsuariosHandler")
    private getAllUsuariosHandler: GetAllUsuariosHandler,
    @inject("GetUsuarioByIdHandler")
    private getUsuarioByIdHandler: GetUsuarioByIdHandler,
    @inject("CreateRolHandler") private createRolHandler: CreateRolHandler,
    @inject("UpdateRolHandler") private updateRolHandler: UpdateRolHandler,
    @inject("DeleteRolHandler") private deleteRolHandler: DeleteRolHandler,
    @inject("GetAllRolesHandler")
    private getAllRolesHandler: GetAllRolesHandler,
    @inject("GetRolByIdHandler") private getRolByIdHandler: GetRolByIdHandler,
    @inject("GenerarReporteDiarioContabilidadHandler")
    private generarReporteDiarioContabilidadHandler: GenerarReporteDiarioContabilidadHandler,
    @inject("ObtenerDiarioContabilidadHandler")
    private obtenerDiarioContabilidadHandler: ObtenerDiarioContabilidadHandler,
    @inject("ExportarDiarioContabilidadExcelHandler")
    private exportarDiarioContabilidadExcelHandler: ExportarDiarioContabilidadExcelHandler,
    @inject("GenerarReporteGenericoSaldosHandler")
    private generarReporteGenericoSaldosHandler: GenerarReporteGenericoSaldosHandler,
    @inject("ObtenerLibroDiarioAsientosHandler")
    private obtenerLibroDiarioAsientosHandler: ObtenerLibroDiarioAsientosHandler,
    @inject("GenerarLibroDiarioAsientosHandler")
    private generarLibroDiarioAsientosHandler: GenerarLibroDiarioAsientosHandler,
    @inject("ObtenerFiltrosLibroDiarioAsientosHandler")
    private obtenerFiltrosLibroDiarioAsientosHandler: ObtenerFiltrosLibroDiarioAsientosHandler
  ) {
    console.log("🔧 Constructor CqrsService ejecutándose...");
    this.registerHandlers();
    console.log("🎯 Constructor CqrsService completado");
  }

  private registerHandlers(): void {
    console.log("🔧 Registrando handlers CQRS...");

    // Register Usuario Command Handlers
    this.commandBus.register("CreateUsuarioCommand", this.createUsuarioHandler);
    this.commandBus.register("UpdateUsuarioCommand", this.updateUsuarioHandler);
    this.commandBus.register("DeleteUsuarioCommand", this.deleteUsuarioHandler);

    // Register Usuario Query Handlers
    this.queryBus.register("GetAllUsuariosQuery", this.getAllUsuariosHandler);
    this.queryBus.register("GetUsuarioByIdQuery", this.getUsuarioByIdHandler);

    // Register Rol Command Handlers
    this.commandBus.register("CreateRolCommand", this.createRolHandler);
    this.commandBus.register("UpdateRolCommand", this.updateRolHandler);
    this.commandBus.register("DeleteRolCommand", this.deleteRolHandler);

    // Register Rol Query Handlers
    this.queryBus.register("GetAllRolesQuery", this.getAllRolesHandler);
    this.queryBus.register("GetRolByIdQuery", this.getRolByIdHandler);

    // Diario Contabilidad
    console.log("📖 Registrando handlers de Diario Contabilidad...");
    this.commandBus.register(
      "GenerarReporteDiarioContabilidadCommand",
      this.generarReporteDiarioContabilidadHandler
    );
    this.queryBus.register(
      "ObtenerDiarioContabilidadQuery",
      this.obtenerDiarioContabilidadHandler
    );
    this.queryBus.register(
      "ExportarDiarioContabilidadExcelQuery",
      this.exportarDiarioContabilidadExcelHandler
    );

    // Reporte Genérico de Saldos
    console.log("📊 Registrando handlers de Reporte Genérico de Saldos...");
    this.commandBus.register(
      "GenerarReporteGenericoSaldosCommand",
      this.generarReporteGenericoSaldosHandler as any
    );

    // Libro Diario Asientos
    console.log("📖 Registrando handlers de Libro Diario Asientos...");
    console.log(
      "🔍 Handler ObtenerLibroDiarioAsientosHandler:",
      this.obtenerLibroDiarioAsientosHandler
    );
    this.queryBus.register(
      "ObtenerLibroDiarioAsientosQuery",
      this.obtenerLibroDiarioAsientosHandler as any
    );
    console.log("✅ ObtenerLibroDiarioAsientosQuery registrado");
    this.queryBus.register(
      "GenerarLibroDiarioAsientosQuery",
      this.generarLibroDiarioAsientosHandler as any
    );
    console.log("✅ GenerarLibroDiarioAsientosQuery registrado");
    this.queryBus.register(
      "ObtenerFiltrosLibroDiarioAsientosQuery",
      this.obtenerFiltrosLibroDiarioAsientosHandler as any
    );
    console.log("✅ ObtenerFiltrosLibroDiarioAsientosQuery registrado");

    console.log("🎉 Todos los handlers CQRS registrados exitosamente");
  }

  getCommandBus(): ICommandBus {
    return this.commandBus;
  }

  getQueryBus(): IQueryBus {
    return this.queryBus;
  }
}
