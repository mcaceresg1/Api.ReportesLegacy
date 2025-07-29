import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface ConexionAttributes {
  id: number;
  usernameDB: string;
  passwordDB: string;
  nameDB: string;
  nameServer: string;
  nameTable: string;
  codEmpresa: string;
  desEmpresa: string;
  sistema: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ConexionCreationAttributes extends Optional<ConexionAttributes, 'id'> {}

class ConexionModel extends Model<ConexionAttributes, ConexionCreationAttributes> implements ConexionAttributes {
  declare id: number;
  declare usernameDB: string;
  declare passwordDB: string;
  declare nameDB: string;
  declare nameServer: string;
  declare nameTable: string;
  declare codEmpresa: string;
  declare desEmpresa: string;
  declare sistema: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

ConexionModel.init(
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
    sequelize,
    tableName: 'Conexiones',
    schema: 'dbo',
    timestamps: true,
  }
);

export default ConexionModel; 