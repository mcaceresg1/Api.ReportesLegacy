import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Menus = sequelize.define(
  "Menus",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    padreId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Menus", // self-reference
        key: "id",
      },
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ruta: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    areaUsuaria: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    sistemaCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    routePath: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "Menus",
    schema: "dbo",
    timestamps: false,
  }
);

export default Menus;
