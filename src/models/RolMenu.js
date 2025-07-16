import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const RolMenu = sequelize.define(
  "RolMenu",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Roles", // Debe coincidir con el nombre del modelo
        key: "id",
      },
    },
    menuId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Menus",
        key: "id",
      },
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "RolMenu",
    schema: "dbo", // importante para MSSQL
    timestamps: true,
  }
);

export default RolMenu;
