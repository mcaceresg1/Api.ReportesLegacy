import Usuarios from "./Usuarios.js";
import Roles from "./Roles.js";

Roles.hasMany(Usuarios, {
  foreignKey: "roleId",
  sourceKey: "id",
});
Usuarios.belongsTo(Roles, {
  foreignKey: "roleId",
  targetKey: "id",
});
