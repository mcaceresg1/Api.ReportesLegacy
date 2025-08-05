import { Request, Response } from 'express';
import { injectable, inject } from 'inversify';
import { ICompaniaService } from '../../domain/services/ICompaniaService';
import { CompaniaCreate, CompaniaUpdate, CompaniaFilter } from '../../domain/entities/Compania';

@injectable()
export class CompaniaController {
  constructor(
    @inject('ICompaniaService') private companiaService: ICompaniaService
  ) {}

  async getAllCompanias(req: Request, res: Response): Promise<void> {
    try {
      const companias = await this.companiaService.getAllCompanias();
      res.json({
        success: true,
        data: companias,
        message: 'Compañías obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener compañías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las compañías',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getCompaniaById(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const compania = await this.companiaService.getCompaniaById(id);
      
      if (!compania) {
        res.status(404).json({
          success: false,
          message: 'Compañía no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: compania,
        message: 'Compañía obtenida exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener compañía:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la compañía',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getCompaniaByCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const compania = await this.companiaService.getCompaniaByCodigo(codigo);
      
      if (!compania) {
        res.status(404).json({
          success: false,
          message: 'Compañía no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: compania,
        message: 'Compañía obtenida exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener compañía por código:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener la compañía',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getCompaniasByFilter(req: Request, res: Response): Promise<void> {
    try {
      const filter: CompaniaFilter = req.query;
      const companias = await this.companiaService.getCompaniasByFilter(filter);
      
      res.json({
        success: true,
        data: companias,
        message: 'Compañías filtradas exitosamente'
      });
    } catch (error) {
      console.error('Error al filtrar compañías:', error);
      res.status(500).json({
        success: false,
        message: 'Error al filtrar las compañías',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async createCompania(req: Request, res: Response): Promise<void> {
    try {
      const companiaData: CompaniaCreate = req.body;
      const compania = await this.companiaService.createCompania(companiaData);
      
      res.status(201).json({
        success: true,
        data: compania,
        message: 'Compañía creada exitosamente'
      });
    } catch (error) {
      console.error('Error al crear compañía:', error);
      res.status(400).json({
        success: false,
        message: 'Error al crear la compañía',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async updateCompania(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const companiaData: CompaniaUpdate = { ...req.body, id };
      const compania = await this.companiaService.updateCompania(companiaData);
      
      res.json({
        success: true,
        data: compania,
        message: 'Compañía actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error al actualizar compañía:', error);
      res.status(400).json({
        success: false,
        message: 'Error al actualizar la compañía',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async deleteCompania(req: Request, res: Response): Promise<void> {
    try {
      const id = parseInt(req.params.id);
      const deleted = await this.companiaService.deleteCompania(id);
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Compañía no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Compañía eliminada exitosamente'
      });
    } catch (error) {
      console.error('Error al eliminar compañía:', error);
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la compañía',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getCompaniasActivas(req: Request, res: Response): Promise<void> {
    try {
      const companias = await this.companiaService.getCompaniasActivas();
      res.json({
        success: true,
        data: companias,
        message: 'Compañías activas obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error al obtener compañías activas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener las compañías activas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
} 