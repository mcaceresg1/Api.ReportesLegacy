import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UsuarioAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  estado: boolean;
  rolId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, 'id'> {}

class UsuarioModel extends Model<UsuarioAttributes, UsuarioCreationAttributes> implements UsuarioAttributes {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare estado: boolean;
  declare rolId: number;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

UsuarioModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    rolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Roles',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'Usuarios',
    schema: 'dbo',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['username'],
      },
      {
        unique: true,
        fields: ['email'],
      },
    ],
  }
);

export default UsuarioModel; 