import { Request, Response, NextFunction } from "express";

/**
 * Middleware para limitar el tamaño de las respuestas
 * Evita que se envíen respuestas demasiado grandes que puedan causar problemas
 */
export class ResponseLimitMiddleware {
  private readonly defaultMaxSize: number;

  constructor(maxSizeBytes: number = 10 * 1024 * 1024) {
    // 10MB por defecto
    this.defaultMaxSize = maxSizeBytes;
  }

  /**
   * Middleware que limita el tamaño de las respuestas
   */
  limitResponseSize(maxSizeBytes?: number) {
    return (req: Request, res: Response, next: NextFunction) => {
      const maxSize = maxSizeBytes || this.defaultMaxSize;

      // Interceptar el método json para verificar el tamaño
      const originalJson = res.json;
      res.json = function (obj: any) {
        const jsonString = JSON.stringify(obj);
        const sizeInBytes = Buffer.byteLength(jsonString, "utf8");

        if (sizeInBytes > maxSize) {
          console.warn(
            `⚠️ Respuesta demasiado grande: ${sizeInBytes} bytes (límite: ${maxSize} bytes)`
          );

          // Si la respuesta es demasiado grande, devolver un error
          return res.status(413).json({
            success: false,
            message: `La respuesta es demasiado grande (${Math.round(
              sizeInBytes / 1024 / 1024
            )}MB). Use paginación para obtener los datos.`,
            error: "Response too large",
            data: null,
            suggestion: "Use pagination parameters: ?page=1&limit=50",
          });
        }

        return originalJson.call(this, obj);
      };

      next();
    };
  }

  /**
   * Middleware específico para endpoints de reportes
   */
  reportLimit() {
    return this.limitResponseSize(50 * 1024 * 1024); // 50MB para reportes
  }

  /**
   * Middleware específico para endpoints de listados
   */
  listLimit() {
    return this.limitResponseSize(5 * 1024 * 1024); // 5MB para listados
  }

  /**
   * Middleware específico para endpoints de consultas rápidas
   */
  quickLimit() {
    return this.limitResponseSize(1 * 1024 * 1024); // 1MB para consultas rápidas
  }
}

// Instancia singleton
export const responseLimitMiddleware = new ResponseLimitMiddleware();
