// src/infrastructure/repositories/ReporteClipperRepository.ts
import { injectable } from 'inversify';
import { ClipperContrato } from '../../domain/entities/ClipperContrato';
import { QueryTypes } from 'sequelize';
import { IReporteClipperRepository } from '../../domain/repositories/IReporteClipperRepository';
import { clipperDatabases } from '../database/config/clipper-database';

@injectable()
export class ReporteClipperRepository implements IReporteClipperRepository {
  async obtenerContratos(ruta: string): Promise<ClipperContrato[]> {
    try {
      // Validar que la ruta sea válida y exista conexión
      if (!['clipper-lurin', 'clipper-tacna', 'clipper-lima'].includes(ruta)) {
        throw new Error('Ruta no válida');
      }

      // Obtener la instancia Sequelize según la ruta
      const rutaKey = ruta as keyof typeof clipperDatabases;
      const sequelizeInstance = clipperDatabases[rutaKey];
      if (!sequelizeInstance) {
        throw new Error(`No se encontró conexión para la ruta: ${ruta}`);
      }

      // Define los queries según la ruta
      let query = '';
      switch (ruta) {
        case 'clipper-lurin':
          query = `
            SELECT 
              T0.NO_CONT + '/' + T0.CONTROL AS contratoControl,
              T0.SECTOR + ' ' + T0.ESPACIO AS sectorEspacio,
              T1.APELLIDOS + ' ' + T1.NOMBRE AS cliente,
              T0.NO_CONT as contrato,
              T0.CONTROL as control
            FROM Ventas T0
            INNER JOIN CLIENTES T1 ON T0.CLIENTE = T1.CODIGO;
          `;
          break;

        case 'clipper-tacna':
          // Reemplaza con el query para Tacna cuando lo tengas
          query = `
            SELECT 
              T0.NO_CONT + '/' + T0.CONTROL AS contratoControl,
              T0.SECTOR + ' ' + T0.ESPACIO AS sectorEspacio,
              T1.APELLIDOS + ' ' + T1.NOMBRE AS cliente,
              T0.NO_CONT as contrato,
              T0.CONTROL as control
            FROM Ventas T0
            INNER JOIN CLIENTES T1 ON T0.CLIENTE = T1.CODIGO;
          `;
          break;

        case 'clipper-lima':
          // Reemplaza con el query para Lima cuando lo tengas
          query = `
            SELECT 
              T0.NO_CONT + '/' + T0.CONTROL AS contratoControl,
              T0.SECTOR + ' ' + T0.ESPACIO AS sectorEspacio,
              T1.APELLIDOS + ' ' + T1.NOMBRE AS cliente,
              T0.NO_CONT as contrato,
              T0.CONTROL as control
            FROM Ventas T0
            INNER JOIN CLIENTES T1 ON T0.CLIENTE = T1.CODIGO;
          `;
          break;
      }

      // Ejecutar el query en la conexión correcta
      const results = await sequelizeInstance.query(query, {
        type: QueryTypes.SELECT,
      });

      return results as ClipperContrato[];
    } catch (error) {
      console.error('Error obteniendo contratos:', error);
      throw new Error(`Error al obtener contratos: ${error}`);
    }
  }
}
