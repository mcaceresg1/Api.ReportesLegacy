import { Request, Response, NextFunction } from "express";

/**
 * Middleware para establecer timeout en las peticiones
 * Evita que la API se cuelgue con consultas muy largas
 */
export class TimeoutMiddleware {
  private readonly defaultTimeout: number;

  constructor(timeoutMs: number = 30000) {
    // 30 segundos por defecto
    this.defaultTimeout = timeoutMs;
  }

  /**
   * Middleware que establece un timeout para las peticiones
   */
  timeout(timeoutMs?: number) {
    return (req: Request, res: Response, next: NextFunction) => {
      const timeout = timeoutMs || this.defaultTimeout;

      // Establecer timeout en la respuesta
      req.setTimeout(timeout, () => {
        if (!res.headersSent) {
          res.status(408).json({
            success: false,
            message: `La petición ha excedido el tiempo límite de ${timeout}ms`,
            error: "Request timeout",
            data: null,
          });
        }
      });

      // Establecer timeout en la respuesta HTTP
      res.setTimeout(timeout, () => {
        if (!res.headersSent) {
          res.status(408).json({
            success: false,
            message: `La respuesta ha excedido el tiempo límite de ${timeout}ms`,
            error: "Response timeout",
            data: null,
          });
        }
      });

      next();
    };
  }

  /**
   * Middleware específico para endpoints de reportes pesados
   */
  reportTimeout() {
    return this.timeout(60000); // 60 segundos para reportes
  }

  /**
   * Middleware específico para endpoints de consultas rápidas
   */
  quickTimeout() {
    return this.timeout(10000); // 10 segundos para consultas rápidas
  }

  /**
   * Middleware específico para endpoints de exportación
   */
  exportTimeout() {
    return this.timeout(120000); // 2 minutos para exportaciones
  }
}

// Instancia singleton
export const timeoutMiddleware = new TimeoutMiddleware();
