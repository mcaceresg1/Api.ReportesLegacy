import { DataTypes } from "sequelize"; // Función que siempre se llama para crear el ORM
import sequelize from "../config/db.js"; // Llamamos a la BD

const Conexiones = sequelize.define( //Definir los campos de la BD
  "Conexiones", // Nombre del modelo
  {
    id: {
      type: DataTypes.INTEGER, //Tipo de dato
      autoIncrement: true, //Estamos diciendo que se autoincrementable
      primaryKey: true, //Será la PK
    },

    usernameDB: {
      type: DataTypes.STRING, //Tipo de dato
      allowNull: false, // Para que el campo no sea nulo
    },

    passwordDB: {
      type: DataTypes.STRING, //Tipo de dato
      allowNull: false, // Para que el campo no sea nulo
    },

    nameDB: {
      type: DataTypes.STRING, //Tipo de dato
      allowNull: false, // Para que el campo no sea nulo
    },

    nameServer: {
      type: DataTypes.STRING, //Tipo de dato
      allowNull: false, // Para que el campo no sea nulo
    },

    nameTable: {
      type: DataTypes.STRING, //Tipo de dato
      allowNull: false, // Para que el campo no sea nulo
    },
    
    codEmpresa: {
      type: DataTypes.STRING, //Tipo de dato
      allowNull: false, // Para que el campo no sea nulo
    },
    
    desEmpresa: {
      type: DataTypes.STRING, //Tipo de dato
      allowNull: false,
    },

    sistema: {
      type: DataTypes.STRING, //Tipo de dato
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