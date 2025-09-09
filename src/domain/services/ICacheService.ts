export interface ICacheService {
  /**
   * Obtiene un valor del cache
   * @param key Clave del cache
   */
  get<T>(key: string): Promise<T | null>;

  /**
   * Establece un valor en el cache
   * @param key Clave del cache
   * @param value Valor a almacenar
   * @param ttl Tiempo de vida en segundos (opcional)
   */
  set<T>(key: string, value: T, ttl?: number): Promise<void>;

  /**
   * Elimina un valor del cache
   * @param key Clave del cache
   */
  delete(key: string): Promise<void>;

  /**
   * Elimina múltiples valores del cache por patrón
   * @param pattern Patrón de claves a eliminar
   */
  deletePattern(pattern: string): Promise<void>;

  /**
   * Verifica si una clave existe en el cache
   * @param key Clave del cache
   */
  exists(key: string): Promise<boolean>;

  /**
   * Obtiene o establece un valor en el cache
   * @param key Clave del cache
   * @param factory Función para generar el valor si no existe
   * @param ttl Tiempo de vida en segundos (opcional)
   */
  getOrSet<T>(key: string, factory: () => Promise<T>, ttl?: number): Promise<T>;
}
