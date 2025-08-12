import { Container } from 'inversify';
import 'reflect-metadata';

// Domain interfaces
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { IRolRepository } from '../../domain/repositories/IRolRepository';
import { ISistemaRepository } from '../../domain/repositories/ISistemaRepository';
import { IConexionRepository } from '../../domain/repositories/IConexionRepository';
import { IRolSistemaMenuRepository } from '../../domain/repositories/IRolSistemaMenuRepository';
import { IConjuntoRepository } from '../../domain/repositories/IConjuntoRepository';
import { ICentroCostoRepository } from '../../domain/repositories/ICentroCostoRepository';
import { IMovimientoContableRepository } from '../../domain/repositories/IMovimientoContableRepository';
import { IReporteCuentaContableRepository } from '../../domain/repositories/IReporteCuentaContableRepository';
import { IReporteCuentaContableModificadaRepository } from '../../domain/repositories/IReporteCuentaContableModificadaRepository';
import { IReporteCentroCostoRepository } from '../../domain/repositories/IReporteCentroCostoRepository';
import { ITipoAsientoRepository } from '../../domain/repositories/ITipoAsientoRepository';
import { IReporteGastosDestinoRepository } from '../../domain/repositories/IReporteGastosDestinoRepository';
import { IReporteAsientosSinDimensionRepository } from '../../domain/repositories/IReporteAsientosSinDimensionRepository';
import { IResumenAsientosRepository } from '../../domain/repositories/IResumenAsientosRepository';

import { ICuentaContableRepository } from '../../domain/repositories/ICuentaContableRepository';
import { IUsuarioService } from '../../domain/services/IUsuarioService';
import { IAuthService } from '../../domain/services/IAuthService';
import { IMenuService } from '../../domain/services/IMenuService';
import { IRolService } from '../../domain/services/IRolService';
import { ISistemaService } from '../../domain/services/ISistemaService';
import { IConexionService } from '../../domain/services/IConexionService';
import { IRolMenuService } from '../../domain/services/IRolMenuService';
import { IRolSistemaMenuService } from '../../domain/services/IRolSistemaMenuService';
import { IConjuntoService } from '../../domain/services/IConjuntoService';
import { ICuentaContableService } from '../../domain/services/ICuentaContableService';
import { IResumenAsientosService } from '../../domain/services/IResumenAsientosService';
import { ITipoAsientoService } from '../../domain/services/ITipoAsientoService';

// CQRS interfaces
import { ICommandBus } from '../../domain/cqrs/ICommandBus';
import { IQueryBus } from '../../domain/cqrs/IQueryBus';

// Infrastructure implementations
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { MenuRepository } from '../repositories/MenuRepository';
import { RolRepository } from '../repositories/RolRepository';
import { SistemaRepository } from '../repositories/SistemaRepository';
import { ConexionRepository } from '../repositories/ConexionRepository';
import { RolSistemaMenuRepository } from '../repositories/RolSistemaMenuRepository';
import { ConjuntoRepository } from '../repositories/ConjuntoRepository';
import { CentroCostoRepository } from '../repositories/CentroCostoRepository';
import { MovimientoContableRepository } from '../repositories/MovimientoContableRepository';
import { ReporteCuentaContableRepository } from '../repositories/ReporteCuentaContableRepository';
import { ReporteCuentaContableModificadaRepository } from '../repositories/ReporteCuentaContableModificadaRepository';
import { ReporteCentroCostoRepository } from '../repositories/ReporteCentroCostoRepository';
import { TipoAsientoRepository } from '../repositories/TipoAsientoRepository';
import { ReporteGastosDestinoRepository } from '../repositories/ReporteGastosDestinoRepository';
import { ReporteAsientosSinDimensionRepository } from '../repositories/ReporteAsientosSinDimensionRepository';
import { ResumenAsientosRepository } from '../repositories/ResumenAsientosRepository';

import { CuentaContableRepository } from '../repositories/CuentaContableRepository';
import { UsuarioService } from '../../application/services/UsuarioService';
import { AuthService } from '../../application/services/AuthService';
import { MenuService } from '../../application/services/MenuService';
import { RolService } from '../../application/services/RolService';
import { SistemaService } from '../../application/services/SistemaService';
import { ConexionService } from '../../application/services/ConexionService';
import { RolMenuService } from '../../application/services/RolMenuService';
import { RolSistemaMenuService } from '../../application/services/RolSistemaMenuService';
import { ConjuntoService } from '../../application/services/ConjuntoService';
import { CuentaContableService } from '../../application/services/CuentaContableService';
import { ResumenAsientosService } from '../../application/services/ResumenAsientosService';
import { TipoAsientoService } from '../../application/services/TipoAsientoService';


// Controllers
import { UsuarioController } from '../controllers/UsuarioController';
import { MenuController } from '../controllers/MenuController';
import { RolController } from '../controllers/RolController';
import { CuentaContableController } from '../controllers/CuentaContableController';
import { SistemaController } from '../controllers/SistemaController';
import { ConexionController } from '../controllers/ConexionController';
import { RolMenuController } from '../controllers/RolMenuController';
import { RolSistemaMenuController } from '../controllers/RolSistemaMenuController';
import { ReporteCentroCostoController } from '../controllers/ReporteCentroCostoController';
import { TipoAsientoController } from '../controllers/TipoAsientoController';
import { ReporteGastosDestinoController } from '../controllers/ReporteGastosDestinoController';
import { ReporteAsientosSinDimensionController } from '../controllers/ReporteAsientosSinDimensionController';
import { ResumenAsientosController } from '../controllers/ResumenAsientosController';

// CQRS implementations
import { CommandBus } from '../cqrs/CommandBus';
import { QueryBus } from '../cqrs/QueryBus';

// Command handlers
import { CreateUsuarioHandler } from '../../application/handlers/usuario/CreateUsuarioHandler';
import { UpdateUsuarioHandler } from '../../application/handlers/usuario/UpdateUsuarioHandler';
import { DeleteUsuarioHandler } from '../../application/handlers/usuario/DeleteUsuarioHandler';
import { GetAllUsuariosHandler } from '../../application/handlers/usuario/GetAllUsuariosHandler';
import { GetUsuarioByIdHandler } from '../../application/handlers/usuario/GetUsuarioByIdHandler';

// Query handlers
import { CreateRolHandler } from '../../application/handlers/rol/CreateRolHandler';
import { UpdateRolHandler } from '../../application/handlers/rol/UpdateRolHandler';
import { DeleteRolHandler } from '../../application/handlers/rol/DeleteRolHandler';
import { GetAllRolesHandler } from '../../application/handlers/rol/GetAllRolesHandler';
import { GetRolByIdHandler } from '../../application/handlers/rol/GetRolByIdHandler';

// CQRS Service
import { CqrsService } from '../cqrs/CqrsService';

// Middleware
import { AuthMiddleware } from '../middleware/AuthMiddleware';

const container = new Container();

// Repositories
container.bind<IUsuarioRepository>('IUsuarioRepository').to(UsuarioRepository);
container.bind<IMenuRepository>('IMenuRepository').to(MenuRepository);
container.bind<IRolRepository>('IRolRepository').to(RolRepository);
container.bind<ISistemaRepository>('ISistemaRepository').to(SistemaRepository);
container.bind<IConexionRepository>('IConexionRepository').to(ConexionRepository);
container.bind<IRolSistemaMenuRepository>('IRolSistemaMenuRepository').to(RolSistemaMenuRepository);
container.bind<IConjuntoRepository>('IConjuntoRepository').to(ConjuntoRepository);
container.bind<ICentroCostoRepository>('ICentroCostoRepository').to(CentroCostoRepository);
container.bind<IMovimientoContableRepository>('IMovimientoContableRepository').to(MovimientoContableRepository);
container.bind<IReporteCuentaContableRepository>('IReporteCuentaContableRepository').to(ReporteCuentaContableRepository);
container.bind<IReporteCuentaContableModificadaRepository>('IReporteCuentaContableModificadaRepository').to(ReporteCuentaContableModificadaRepository);
container.bind<IReporteCentroCostoRepository>('IReporteCentroCostoRepository').to(ReporteCentroCostoRepository);
container.bind<ITipoAsientoRepository>('ITipoAsientoRepository').to(TipoAsientoRepository);
container.bind<IReporteGastosDestinoRepository>('IReporteGastosDestinoRepository').to(ReporteGastosDestinoRepository);
container.bind<IReporteAsientosSinDimensionRepository>('IReporteAsientosSinDimensionRepository').to(ReporteAsientosSinDimensionRepository);
container.bind<IResumenAsientosRepository>('IResumenAsientosRepository').to(ResumenAsientosRepository);

container.bind<ICuentaContableRepository>('ICuentaContableRepository').to(CuentaContableRepository);


// Services
container.bind<IUsuarioService>('IUsuarioService').to(UsuarioService);
container.bind<IAuthService>('IAuthService').to(AuthService);
container.bind<IMenuService>('IMenuService').to(MenuService);
container.bind<IRolService>('IRolService').to(RolService);
container.bind<ISistemaService>('ISistemaService').to(SistemaService);
container.bind<IConexionService>('IConexionService').to(ConexionService);
container.bind<IRolMenuService>('IRolMenuService').to(RolMenuService);
container.bind<IRolSistemaMenuService>('IRolSistemaMenuService').to(RolSistemaMenuService);
container.bind<IConjuntoService>('IConjuntoService').to(ConjuntoService);
container.bind<ICuentaContableService>('CuentaContableService').to(CuentaContableService);
container.bind<IResumenAsientosService>('ResumenAsientosService').to(ResumenAsientosService);
container.bind<ITipoAsientoService>('TipoAsientoService').to(TipoAsientoService);


// Controllers
container.bind<UsuarioController>('UsuarioController').to(UsuarioController);
container.bind<MenuController>('MenuController').to(MenuController);
container.bind<RolController>('RolController').to(RolController);
container.bind<CuentaContableController>('CuentaContableController').to(CuentaContableController);
container.bind<SistemaController>('SistemaController').to(SistemaController);
container.bind<ConexionController>('ConexionController').to(ConexionController);
container.bind<RolMenuController>('RolMenuController').to(RolMenuController);
container.bind<RolSistemaMenuController>('RolSistemaMenuController').to(RolSistemaMenuController);
container.bind<ReporteCentroCostoController>('ReporteCentroCostoController').to(ReporteCentroCostoController);
container.bind<TipoAsientoController>('TipoAsientoController').to(TipoAsientoController);
container.bind<ReporteGastosDestinoController>('ReporteGastosDestinoController').to(ReporteGastosDestinoController);
container.bind<ReporteAsientosSinDimensionController>('ReporteAsientosSinDimensionController').to(ReporteAsientosSinDimensionController);
container.bind<ResumenAsientosController>('ResumenAsientosController').to(ResumenAsientosController);


// CQRS Buses
container.bind<ICommandBus>('ICommandBus').to(CommandBus);
container.bind<IQueryBus>('IQueryBus').to(QueryBus);

// Command Handlers
container.bind<CreateUsuarioHandler>('CreateUsuarioHandler').to(CreateUsuarioHandler);
container.bind<UpdateUsuarioHandler>('UpdateUsuarioHandler').to(UpdateUsuarioHandler);
container.bind<DeleteUsuarioHandler>('DeleteUsuarioHandler').to(DeleteUsuarioHandler);

// Query Handlers
container.bind<GetAllUsuariosHandler>('GetAllUsuariosHandler').to(GetAllUsuariosHandler);
container.bind<GetUsuarioByIdHandler>('GetUsuarioByIdHandler').to(GetUsuarioByIdHandler);

// Rol Command Handlers
container.bind<CreateRolHandler>('CreateRolHandler').to(CreateRolHandler);
container.bind<UpdateRolHandler>('UpdateRolHandler').to(UpdateRolHandler);
container.bind<DeleteRolHandler>('DeleteRolHandler').to(DeleteRolHandler);

// Rol Query Handlers
container.bind<GetAllRolesHandler>('GetAllRolesHandler').to(GetAllRolesHandler);
container.bind<GetRolByIdHandler>('GetRolByIdHandler').to(GetRolByIdHandler);

// CQRS Service
container.bind<CqrsService>('CqrsService').to(CqrsService);

// Middleware
container.bind<AuthMiddleware>('AuthMiddleware').to(AuthMiddleware);

export { container }; 