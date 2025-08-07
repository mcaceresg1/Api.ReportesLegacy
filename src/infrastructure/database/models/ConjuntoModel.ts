import { DataTypes, Model } from 'sequelize';
import { exactusSequelize } from '../config/exactus-database';
import { Conjunto } from '../../../domain/entities/Conjunto';

class ConjuntoModel extends Model<Conjunto> implements Conjunto {
  public CONJUNTO!: string;
  public NOMBRE?: string;
  public DIREC1?: string;
  public DIREC2?: string;
  public TELEFONO?: string;
  public LOGO?: string;
}

// Definir solo los campos que necesitamos
const ConjuntoModelInstance = exactusSequelize.define('Conjunto', {
  CONJUNTO: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    allowNull: false,
  },
  NOMBRE: DataTypes.STRING(150),
  DIREC1: DataTypes.STRING(250),
  DIREC2: DataTypes.STRING(250),
  TELEFONO: DataTypes.STRING(30),
  LOGO: DataTypes.STRING(100),
}, {
  tableName: 'CONJUNTO',
  schema: 'ERPADMIN',
  timestamps: false,
  modelName: 'ConjuntoModel'
});

// Extender la clase con el modelo definido
Object.setPrototypeOf(ConjuntoModel, ConjuntoModelInstance.constructor);
Object.setPrototypeOf(ConjuntoModel.prototype, ConjuntoModelInstance.prototype);

export default ConjuntoModel;
