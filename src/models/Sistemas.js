// src/models/Sistemas.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Sistemas = sequelize.define(
  "Sistemas",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  {
    tableName: "Sistemas",
    schema: "dbo",
    timestamps: true,
  }
);

export default Sistemas;
