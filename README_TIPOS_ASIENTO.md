# API de Tipos de Asiento

## Descripción
Este API permite obtener la lista de tipos de asiento disponibles para un conjunto contable específico. Los tipos de asiento son configuraciones que definen cómo se procesan y categorizan los asientos contables en el sistema.

## Endpoints

### GET /api/tipos-asiento/{conjunto}

Obtiene la lista de tipos de asiento para un conjunto contable específico.

#### Parámetros de Ruta
- `conjunto` (string, requerido): Código del conjunto contable (ej: "ASFSAC")

#### Parámetros de Consulta
- `tipoAsiento` (string, opcional): Filtro por tipo de asiento (búsqueda parcial)
- `descripcion` (string, opcional): Filtro por descripción (búsqueda parcial)
- `limit` (integer, opcional): Número máximo de registros a retornar (1-1000, por defecto: 50)

#### Ejemplos de Uso

```bash
# Obtener todos los tipos de asiento (máximo 50)
GET /api/tipos-asiento/ASFSAC

# Obtener máximo 10 tipos de asiento
GET /api/tipos-asiento/ASFSAC?limit=10

# Filtrar por tipo de asiento que contenga "DIARIO"
GET /api/tipos-asiento/ASFSAC?tipoAsiento=DIARIO

# Filtrar por descripción que contenga "Asiento"
GET /api/tipos-asiento/ASFSAC?descripcion=Asiento

# Combinar filtros
GET /api/tipos-asiento/ASFSAC?tipoAsiento=DIARIO&descripcion=Asiento&limit=5
```

#### Respuesta Exitosa (200)

```json
{
  "success": true,
  "message": "Tipos de asiento obtenidos exitosamente con 25 registros",
  "data": [
    {
      "tipoAsiento": "DIARIO",
      "descripcion": "Asiento de Diario",
      "noteExistsFlag": 0,
      "recordDate": "2024-01-15T10:30:00.000Z",
      "rowPointer": "ABC123",
      "createdBy": "ADMIN",
      "updatedBy": "ADMIN",
      "createDate": "2024-01-15T10:30:00.000Z"
    }
  ],
  "totalRegistros": 25,
  "conjunto": "ASFSAC"
}
```

#### Respuesta de Error (400)

```json
{
  "success": false,
  "message": "El conjunto es requerido"
}
```

#### Respuesta de Error (500)

```json
{
  "success": false,
  "message": "Error al obtener tipos de asiento: Error de conexión a la base de datos"
}
```

## Estructura de Datos

### TipoAsiento
```typescript
interface TipoAsiento {
  tipoAsiento: string;      // Código del tipo de asiento
  descripcion: string;      // Descripción del tipo de asiento
  noteExistsFlag: number;   // Flag de existencia de nota
  recordDate: Date;         // Fecha de registro
  rowPointer: string;       // Puntero de fila
  createdBy: string;        // Usuario que creó el registro
  updatedBy: string;        // Usuario que actualizó el registro
  createDate: Date;         // Fecha de creación
}
```

### Filtros Disponibles
```typescript
interface FiltrosTipoAsiento {
  tipoAsiento?: string;     // Filtro por tipo de asiento
  descripcion?: string;     // Filtro por descripción
  limit?: number;           // Límite de registros (1-1000)
}
```

## Características Técnicas

- **Base de Datos**: SQL Server con esquema dinámico basado en el conjunto
- **ORM**: Sequelize con consultas nativas optimizadas
- **Filtros**: Búsqueda parcial (LIKE) en campos de texto
- **Límites**: Control de límite máximo para evitar sobrecarga
- **Ordenamiento**: Ordenado por código de tipo de asiento
- **Performance**: Uso de hints NOLOCK para consultas de solo lectura

## Consideraciones de Seguridad

- Validación de parámetros de entrada
- Límite máximo de registros para prevenir ataques de denegación de servicio
- Sanitización de parámetros de consulta
- Logging de operaciones para auditoría

## Dependencias

- **Repository**: `ITipoAsientoRepository` → `TipoAsientoRepository`
- **Service**: `ITipoAsientoService` → `TipoAsientoService`
- **Controller**: `TipoAsientoController`
- **Middleware**: `QueryOptimizationMiddleware`

## Archivos Relacionados

- `src/domain/entities/TipoAsiento.ts` - Entidades y filtros
- `src/domain/dto/TipoAsientoResponse.ts` - DTO de respuesta
- `src/domain/repositories/ITipoAsientoRepository.ts` - Interfaz del repositorio
- `src/domain/services/ITipoAsientoService.ts` - Interfaz del servicio
- `src/infrastructure/repositories/TipoAsientoRepository.ts` - Implementación del repositorio
- `src/application/services/TipoAsientoService.ts` - Implementación del servicio
- `src/infrastructure/controllers/TipoAsientoController.ts` - Controlador
- `src/infrastructure/routes/tiposAsiento.routes.ts` - Definición de rutas
- `src/infrastructure/container/container.ts` - Configuración de dependencias
- `src/app.ts` - Registro de rutas

## Testing

Para probar el API, puedes usar el archivo `test_tipos_asiento.http` que incluye ejemplos de todas las operaciones disponibles.

