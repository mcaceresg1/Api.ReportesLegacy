import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Roles = sequelize.define("Roles", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  descripcion: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  descripcion_completa: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

export default Roles;
