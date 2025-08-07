import { Container } from 'inversify';
import 'reflect-metadata';

// Domain interfaces
import { IUsuarioRepository } from '../../domain/repositories/IUsuarioRepository';
import { IMenuRepository } from '../../domain/repositories/IMenuRepository';
import { IRolRepository } from '../../domain/repositories/IRolRepository';
import { ISistemaRepository } from '../../domain/repositories/ISistemaRepository';
import { IConexionRepository } from '../../domain/repositories/IConexionRepository';
import { IRolSistemaMenuRepository } from '../../domain/repositories/IRolSistemaMenuRepository';
import { IUsuarioService } from '../../domain/services/IUsuarioService';
import { IAuthService } from '../../domain/services/IAuthService';
import { IMenuService } from '../../domain/services/IMenuService';
import { IRolService } from '../../domain/services/IRolService';
import { ISistemaService } from '../../domain/services/ISistemaService';
import { IConexionService } from '../../domain/services/IConexionService';
import { IRolMenuService } from '../../domain/services/IRolMenuService';
import { IRolSistemaMenuService } from '../../domain/services/IRolSistemaMenuService';


// Infrastructure implementations
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { MenuRepository } from '../repositories/MenuRepository';
import { RolRepository } from '../repositories/RolRepository';
import { SistemaRepository } from '../repositories/SistemaRepository';
import { ConexionRepository } from '../repositories/ConexionRepository';
import { RolSistemaMenuRepository } from '../repositories/RolSistemaMenuRepository';
import { UsuarioService } from '../../application/services/UsuarioService';
import { AuthService } from '../../application/services/AuthService';
import { MenuService } from '../../application/services/MenuService';
import { RolService } from '../../application/services/RolService';
import { SistemaService } from '../../application/services/SistemaService';
import { ConexionService } from '../../application/services/ConexionService';
import { RolMenuService } from '../../application/services/RolMenuService';
import { RolSistemaMenuService } from '../../application/services/RolSistemaMenuService';


// Controllers
import { UsuarioController } from '../controllers/UsuarioController';
import { MenuController } from '../controllers/MenuController';
import { RolController } from '../controllers/RolController';
import { SistemaController } from '../controllers/SistemaController';
import { ConexionController } from '../controllers/ConexionController';
import { RolMenuController } from '../controllers/RolMenuController';
import { RolSistemaMenuController } from '../controllers/RolSistemaMenuController';


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


// Services
container.bind<IUsuarioService>('IUsuarioService').to(UsuarioService);
container.bind<IAuthService>('IAuthService').to(AuthService);
container.bind<IMenuService>('IMenuService').to(MenuService);
container.bind<IRolService>('IRolService').to(RolService);
container.bind<ISistemaService>('ISistemaService').to(SistemaService);
container.bind<IConexionService>('IConexionService').to(ConexionService);
container.bind<IRolMenuService>('IRolMenuService').to(RolMenuService);
container.bind<IRolSistemaMenuService>('IRolSistemaMenuService').to(RolSistemaMenuService);


// Controllers
container.bind<UsuarioController>('UsuarioController').to(UsuarioController);
container.bind<MenuController>('MenuController').to(MenuController);
container.bind<RolController>('RolController').to(RolController);
container.bind<SistemaController>('SistemaController').to(SistemaController);
container.bind<ConexionController>('ConexionController').to(ConexionController);
container.bind<RolMenuController>('RolMenuController').to(RolMenuController);
container.bind<RolSistemaMenuController>('RolSistemaMenuController').to(RolSistemaMenuController);


// Middleware
container.bind<AuthMiddleware>('AuthMiddleware').to(AuthMiddleware);

export { container }; 