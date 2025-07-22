import Usuarios from "./Usuarios.js";
import Roles from "./Roles.js";
import Menus from "./Menus.js";
import Sistemas from "./Sistemas.js";
import RolSistemaMenu from "./RolSistemaMenu.js";
import RolMenu from "./RolMenu.js";

// 👉 Usuario → Rol
Roles.hasMany(Usuarios, {
  foreignKey: "rolId",
  sourceKey: "id",
});
Usuarios.belongsTo(Roles, {
  foreignKey: "rolId",
  as: "rol",
  targetKey: "id",
});

// 👉 Rol → RolMenu
Roles.hasMany(RolMenu, {
  foreignKey: "rolId",
  sourceKey: "id",
});
RolMenu.belongsTo(Roles, {
  foreignKey: "rolId",
  as: "rol",
  targetKey: "id",
});

// 👉 Menu → RolMenu
Menus.hasMany(RolMenu, {
  foreignKey: "menuId",
  sourceKey: "id",
});
RolMenu.belongsTo(Menus, {
  foreignKey: "menuId",
  as: "menu",
  targetKey: "id",
});

// ✅ Relaciones jerárquicas para Menu
Menus.hasMany(Menus, {
  as: "submenus",
  foreignKey: "padreId",
});
Menus.belongsTo(Menus, {
  as: "padre",
  foreignKey: "padreId",
});

// 👉 RolSistemaMenu associations
Roles.hasMany(RolSistemaMenu, {
  foreignKey: "rolId",
  sourceKey: "id",
});
RolSistemaMenu.belongsTo(Roles, {
  foreignKey: "rolId",
  as: "rol",
  targetKey: "id",
});

Sistemas.hasMany(RolSistemaMenu, {
  foreignKey: "sistemaId",
  sourceKey: "id",
});
RolSistemaMenu.belongsTo(Sistemas, {
  foreignKey: "sistemaId",
  as: "sistema",
  targetKey: "id",
});

Menus.hasMany(RolSistemaMenu, {
  foreignKey: "menuId",
  sourceKey: "id",
});
RolSistemaMenu.belongsTo(Menus, {
  foreignKey: "menuId",
  as: "menu",
  targetKey: "id",
});

// Exportar todos los modelos para uso en otros archivos
export {
  Usuarios,
  Roles,
  Menus,
  Sistemas,
  RolSistemaMenu,
  RolMenu,
};
