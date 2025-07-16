import Usuarios from "./Usuarios.js";
import Roles from "./Roles.js";
import Menus from "./Menus.js";
import Sistemas from "./Sistemas.js";
import RolSistemaMenu from "./RolSistemaMenu.js";
import RolMenu from "./RolMenu.js";

// // 👉 Usuario → Rol
Roles.hasMany(Usuarios, {
  foreignKey: "rolId",
  sourceKey: "id",
});
Usuarios.belongsTo(Roles, {
  foreignKey: "rolId",
  as: "rol",
  targetKey: "id",
});


Roles.hasMany(RolMenu, {
  foreignKey: "rolId",
  sourceKey: "id",
});
RolMenu.belongsTo(Roles, {
  foreignKey: "rolId",
  as: "rol",
  targetKey: "id",
});


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


RolSistemaMenu.belongsTo(Menus, {
  foreignKey: "menuId",
  as: "menu",
});

// // 👉 Sistema → Menú
// Sistemas.hasMany(Menus, {
//   foreignKey: "sistemaId",
//   sourceKey: "id",
// });
// Menus.belongsTo(Sistemas, {
//   foreignKey: "sistemaId",
//   as: "sistema",
//   targetKey: "id",
// });


// // // 👉 Relación 1:N para tabla intermedia explícita RolSistemaMenu

// Roles.hasMany(RolSistemaMenu, {
//   foreignKey: "rolId",
//   sourceKey: "id",
// });

// RolSistemaMenu.belongsTo(Roles, {
//   foreignKey: "rolId",
//   as: "rol",
//   targetKey: "id",
// });


// // // Sistema → RolSistemaMenu

// Sistemas.hasMany(RolSistemaMenu, {
//   foreignKey: "sistemaId",
//   sourceKey: "id",
// });

// RolSistemaMenu.belongsTo(Sistemas, {
//   foreignKey: "sistemaId",
//   as: "sistema",
//   targetKey: "id",
// });


// Menus.hasMany(RolSistemaMenu,{
//    foreignKey: "menuId"
// });


// RolSistemaMenu.belongsTo(Menus, {
//   foreignKey: "menuId"
// });



// // ✅ Exporta los modelos
// export {
//   Roles,
//   Sistemas,
//   Menus,
//   Usuarios,
//   RolSistemaMenu,
// };
