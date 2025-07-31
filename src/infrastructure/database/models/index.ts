import UsuarioModel from './UsuarioModel';
import RolModel from './RolModel';
import MenuModel from './MenuModel';
import ConexionModel from './ConexionModel';
import SistemaModel from './SistemaModel';
import RolSistemaMenuModel from './RolSistemaMenuModel';
import { MovimientoContableModel } from './MovimientoContableModel';
import { CentroCostoModel } from './CentroCostoModel';

// Definir las asociaciones entre modelos
UsuarioModel.belongsTo(RolModel, { foreignKey: 'rolId', as: 'rol' });
RolModel.hasMany(UsuarioModel, { foreignKey: 'rolId', as: 'usuarios' });

// Auto-referencia para menús (menús padre-hijo)
MenuModel.belongsTo(MenuModel, { foreignKey: 'padreId', as: 'menuPadre' });
MenuModel.hasMany(MenuModel, { foreignKey: 'padreId', as: 'menusHijos' });

// Asociaciones para RolSistemaMenu
RolSistemaMenuModel.belongsTo(RolModel, { foreignKey: 'rolId', as: 'rol' });
RolSistemaMenuModel.belongsTo(SistemaModel, { foreignKey: 'sistemaId', as: 'sistema' });
RolSistemaMenuModel.belongsTo(MenuModel, { foreignKey: 'menuId', as: 'menu' });

RolModel.hasMany(RolSistemaMenuModel, { foreignKey: 'rolId', as: 'rolSistemaMenus' });
SistemaModel.hasMany(RolSistemaMenuModel, { foreignKey: 'sistemaId', as: 'rolSistemaMenus' });
MenuModel.hasMany(RolSistemaMenuModel, { foreignKey: 'menuId', as: 'rolSistemaMenus' });

// Asociaciones para MovimientoContable y CentroCosto
MovimientoContableModel.belongsTo(CentroCostoModel, { foreignKey: 'centro_costo_id', as: 'centroCosto' });
CentroCostoModel.hasMany(MovimientoContableModel, { foreignKey: 'centro_costo_id', as: 'movimientosContables' });

export {
  UsuarioModel,
  RolModel,
  MenuModel,
  ConexionModel,
  SistemaModel,
  RolSistemaMenuModel,
  MovimientoContableModel,
  CentroCostoModel
}; 