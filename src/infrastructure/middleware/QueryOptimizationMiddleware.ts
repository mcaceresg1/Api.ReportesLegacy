import { Request, Response, NextFunction } from 'express';

/**
 * Middleware para optimizar consultas y agregar índices virtuales
 */
export class QueryOptimizationMiddleware {
  
  /**
   * Middleware para validar y optimizar parámetros de consulta
   */
  static validateQueryParams(req: Request, res: Response, next: NextFunction): void {
    // Validar límites de paginación
    const limit = parseInt(req.query["limit"] as string) || 100;
    const offset = parseInt(req.query["offset"] as string) || 0;
    const page = parseInt(req.query["page"] as string) || 1;

    // Límites máximos para evitar consultas muy grandes
    const maxLimit = 1000;
    const maxOffset = 10000;

    if (limit > maxLimit) {
      res.status(400).json({
        success: false,
        message: `El límite máximo permitido es ${maxLimit}`,
        error: 'LIMIT_EXCEEDED'
      });
      return;
    }

    if (offset > maxOffset) {
      res.status(400).json({
        success: false,
        message: `El offset máximo permitido es ${maxOffset}`,
        error: 'OFFSET_EXCEEDED'
      });
      return;
    }

    if (page < 1) {
      res.status(400).json({
        success: false,
        message: 'La página debe ser mayor a 0',
        error: 'INVALID_PAGE'
      });
      return;
    }

    // Agregar parámetros validados al request
    req.query["limit"] = Math.min(limit, maxLimit).toString();
    req.query["offset"] = Math.max(offset, 0).toString();
    req.query["page"] = Math.max(page, 1).toString();

    next();
  }

  /**
   * Middleware para agregar headers de caché para consultas de solo lectura
   */
  static addCacheHeaders(req: Request, res: Response, next: NextFunction): void {
    // Agregar headers de caché para consultas GET
    if (req.method === 'GET') {
      res.set({
        'Cache-Control': 'public, max-age=300', // 5 minutos
        'ETag': `"${Date.now()}"`,
        'Last-Modified': new Date().toUTCString()
      });
    }
    next();
  }

  /**
   * Middleware para monitorear el rendimiento de las consultas
   */
  static performanceMonitor(req: Request, res: Response, next: NextFunction): void {
    const startTime = Date.now();
    
    // Interceptar el final de la respuesta
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      const { method, url } = req;
      const { statusCode } = res;
      
      // Log de rendimiento para consultas lentas (> 1 segundo)
      if (duration > 1000) {
        console.warn(`Consulta lenta detectada: ${method} ${url} - ${duration}ms - Status: ${statusCode}`);
      }
      
      // Log de rendimiento para consultas muy lentas (> 5 segundos)
      if (duration > 5000) {
        console.error(`Consulta muy lenta detectada: ${method} ${url} - ${duration}ms - Status: ${statusCode}`);
      }
    });
    
    next();
  }

  /**
   * Middleware para limitar la frecuencia de consultas (rate limiting básico)
   */
  static basicRateLimit(req: Request, res: Response, next: NextFunction): void {
    // Implementación básica de rate limiting
    // En producción se recomienda usar Redis o similar
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    const currentTime = Date.now();
    
    // Limpiar registros antiguos (más de 1 minuto)
    if (!req.app.locals["rateLimit"]) {
      req.app.locals["rateLimit"] = {};
    }
    
    if (!req.app.locals["rateLimit"][clientIP]) {
      req.app.locals["rateLimit"][clientIP] = [];
    }
    
    // Filtrar registros antiguos
    req.app.locals["rateLimit"][clientIP] = req.app.locals["rateLimit"][clientIP].filter(
      (timestamp: number) => currentTime - timestamp < 60000
    );
    
    // Verificar límite (100 requests por minuto)
    if (req.app.locals["rateLimit"][clientIP].length >= 100) {
      res.status(429).json({
        success: false,
        message: 'Demasiadas solicitudes. Intente nuevamente en 1 minuto.',
        error: 'RATE_LIMIT_EXCEEDED'
      });
      return;
    }
    
    // Agregar timestamp actual
    req.app.locals["rateLimit"][clientIP].push(currentTime);
    
    next();
  }
}
