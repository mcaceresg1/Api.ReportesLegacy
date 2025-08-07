import { Request, Response } from 'express';
import { ICentroCuentaRepository } from '../../domain/repositories/ICentroCuentaRepository';
import { ICuentaContableRepository } from '../../domain/repositories/ICuentaContableRepository';

export class ExactusController {
  constructor(
    private centroCuentaRepository: ICentroCuentaRepository,
    private cuentaContableRepository: ICuentaContableRepository
  ) {}

  // Obtener centros cuenta por conjunto
  async getCentrosCuentaByConjunto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const centrosCuenta = await this.centroCuentaRepository.getCentrosCuentaByConjunto(conjunto);
      
      res.json({
        success: true,
        data: centrosCuenta,
        message: 'Centros cuenta obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentrosCuentaByConjunto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centros cuenta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener centros cuenta por cuenta contable
  async getCentrosCuentaByCuenta(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, cuentaContable } = req.params;
      
      if (!conjunto || !cuentaContable) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y cuenta contable son requeridos'
        });
        return;
      }

      const centrosCuenta = await this.centroCuentaRepository.getCentrosCuentaByCuenta(conjunto, cuentaContable);
      
      res.json({
        success: true,
        data: centrosCuenta,
        message: 'Centros cuenta obtenidos exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCentrosCuentaByCuenta:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener centros cuenta',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener cuentas contables por conjunto
  async getCuentasContablesByConjunto(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const cuentasContables = await this.cuentaContableRepository.getCuentasContablesByConjunto(conjunto);
      
      res.json({
        success: true,
        data: cuentasContables,
        message: 'Cuentas contables obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCuentasContablesByConjunto:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuentas contables',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener cuenta contable por código
  async getCuentaContableByCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, codigo } = req.params;
      
      if (!conjunto || !codigo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y código de cuenta son requeridos'
        });
        return;
      }

      const cuentaContable = await this.cuentaContableRepository.getCuentaContableByCodigo(conjunto, codigo);
      
      if (!cuentaContable) {
        res.status(404).json({
          success: false,
          message: 'Cuenta contable no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: cuentaContable,
        message: 'Cuenta contable obtenida exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCuentaContableByCodigo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuenta contable',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener cuentas contables por tipo
  async getCuentasContablesByTipo(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto, tipo } = req.params;
      
      if (!conjunto || !tipo) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto y tipo son requeridos'
        });
        return;
      }

      const cuentasContables = await this.cuentaContableRepository.getCuentasContablesByTipo(conjunto, tipo);
      
      res.json({
        success: true,
        data: cuentasContables,
        message: 'Cuentas contables obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCuentasContablesByTipo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuentas contables',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Obtener cuentas contables activas
  async getCuentasContablesActivas(req: Request, res: Response): Promise<void> {
    try {
      const { conjunto } = req.params;
      
      if (!conjunto) {
        res.status(400).json({
          success: false,
          message: 'Código de conjunto es requerido'
        });
        return;
      }

      const cuentasContables = await this.cuentaContableRepository.getCuentasContablesActivas(conjunto);
      
      res.json({
        success: true,
        data: cuentasContables,
        message: 'Cuentas contables activas obtenidas exitosamente'
      });
    } catch (error) {
      console.error('Error en ExactusController.getCuentasContablesActivas:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener cuentas contables activas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
