// src/models/RolSistemaMenu.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const RolSistemaMenu = sequelize.define(
  "RolSistemaMenu",
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
    sistemaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Sistemas",
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
    tableName: "RolSistemaMenu",
    schema: "dbo", // importante para MSSQL
    timestamps: true,
  }
);

export default RolSistemaMenu;
