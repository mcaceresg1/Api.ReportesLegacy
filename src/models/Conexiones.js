import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Conexiones = sequelize.define(
  "Conexiones",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    usernameDB: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    passwordDB: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nameDB: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nameServer: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    nameTable: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    codEmpresa: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    desEmpresa: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    sistema: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "Conexiones",
    schema: "dbo",
    timestamps: true,
  }
);

export default Conexiones;
