import { Request, Response, NextFunction } from "express";

interface RateLimitConfig {
  windowMs: number; // Ventana de tiempo en ms
  maxRequests: number; // Máximo número de peticiones
  message?: string;
}

interface ClientInfo {
  count: number;
  resetTime: number;
}

/**
 * Middleware para limitar la tasa de peticiones por IP
 * Evita abuso y sobrecarga del servidor
 */
export class RateLimitMiddleware {
  private clients: Map<string, ClientInfo> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Limpiar clientes expirados cada 5 minutos
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredClients();
    }, 5 * 60 * 1000);
  }

  /**
   * Middleware que limita la tasa de peticiones
   */
  rateLimit(config: RateLimitConfig) {
    return (req: Request, res: Response, next: NextFunction): void => {
      const clientIp = req.ip || req.connection.remoteAddress || "unknown";
      const now = Date.now();

      // Obtener información del cliente
      let clientInfo = this.clients.get(clientIp);

      // Si no existe o ha expirado, crear nuevo
      if (!clientInfo || now > clientInfo.resetTime) {
        clientInfo = {
          count: 0,
          resetTime: now + config.windowMs,
        };
        this.clients.set(clientIp, clientInfo);
      }

      // Incrementar contador
      clientInfo.count++;

      // Verificar si ha excedido el límite
      if (clientInfo.count > config.maxRequests) {
        const resetTimeSeconds = Math.ceil((clientInfo.resetTime - now) / 1000);

        res.status(429).json({
          success: false,
          message:
            config.message ||
            `Demasiadas peticiones. Intente nuevamente en ${resetTimeSeconds} segundos.`,
          error: "Rate limit exceeded",
          data: null,
          retryAfter: resetTimeSeconds,
        });
        return;
      }

      // Agregar headers informativos
      res.set({
        "X-RateLimit-Limit": config.maxRequests.toString(),
        "X-RateLimit-Remaining": Math.max(
          0,
          config.maxRequests - clientInfo.count
        ).toString(),
        "X-RateLimit-Reset": new Date(clientInfo.resetTime).toISOString(),
      });

      next();
    };
  }

  /**
   * Middleware específico para endpoints de reportes pesados
   */
  reportRateLimit() {
    return this.rateLimit({
      windowMs: 5 * 60 * 1000, // 5 minutos
      maxRequests: 10, // 10 peticiones por 5 minutos
      message:
        "Demasiadas peticiones de reportes. Los reportes pesados están limitados a 10 peticiones cada 5 minutos.",
    });
  }

  /**
   * Middleware específico para endpoints de consultas rápidas
   */
  quickRateLimit() {
    return this.rateLimit({
      windowMs: 60 * 1000, // 1 minuto
      maxRequests: 100, // 100 peticiones por minuto
      message: "Demasiadas peticiones. Límite de 100 peticiones por minuto.",
    });
  }

  /**
   * Middleware específico para endpoints de exportación
   */
  exportRateLimit() {
    return this.rateLimit({
      windowMs: 10 * 60 * 1000, // 10 minutos
      maxRequests: 5, // 5 exportaciones por 10 minutos
      message:
        "Demasiadas exportaciones. Límite de 5 exportaciones cada 10 minutos.",
    });
  }

  /**
   * Limpia clientes expirados
   */
  private cleanupExpiredClients(): void {
    const now = Date.now();
    for (const [ip, info] of this.clients.entries()) {
      if (now > info.resetTime) {
        this.clients.delete(ip);
      }
    }
  }

  /**
   * Obtiene estadísticas de rate limiting
   */
  getStats(): {
    totalClients: number;
    clients: Array<{ ip: string; count: number; resetTime: number }>;
  } {
    const clients = Array.from(this.clients.entries()).map(([ip, info]) => ({
      ip,
      count: info.count,
      resetTime: info.resetTime,
    }));

    return {
      totalClients: this.clients.size,
      clients,
    };
  }

  /**
   * Limpia todos los clientes (útil para testing)
   */
  clearAll(): void {
    this.clients.clear();
  }

  /**
   * Destruye el middleware y limpia recursos
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.clients.clear();
  }
}

// Instancia singleton
export const rateLimitMiddleware = new RateLimitMiddleware();
