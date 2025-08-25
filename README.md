# API Reportes Legacy - TypeScript

## Descripción

API REST desarrollada en TypeScript con arquitectura hexagonal (Ports and Adapters) para la gestión de reportes y usuarios del sistema.

## Características

- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **CQRS Pattern**: Command Query Responsibility Segregation para separar operaciones de lectura y escritura
- **TypeScript**: Tipado estático para mayor robustez
- **Express.js**: Framework web para la API
- **Sequelize**: ORM para SQL Server
- **JWT**: Autenticación con tokens
- **Swagger**: Documentación automática de la API
- **Docker**: Containerización
- **SOLID Principles**: Principios de diseño aplicados
- **Python Integration**: Integración con Python para generación de PDFs

## Cambios Recientes

### v1.14.0 - Reporte de Saldo Promedios

- **Reporte de Saldo Promedios**: Implementación completa del sistema de reportes de saldos promedios con filtros por cuenta contable y período
- **Cálculos Avanzados**: Sistema de cálculos de saldos promedios combinando saldos históricos, antes del cierre y movimientos de cierre
- **Queries SQL Complejas**: Consultas SQL optimizadas que combinan múltiples fuentes de datos (SALDO, MAYOR, cuenta_contable)
- **Compatibilidad Frontend**: Ruta alternativa `/api/reporte-saldo-promedio` agregada para compatibilidad con el frontend existente
- **Entidades implementadas**:
  - **SaldoPromediosItem**: Para el manejo de reportes de saldos promedios
  - **FiltroSaldoPromedios**: Sistema completo de filtros para reportes
  - **CuentaContableOption**: Opciones de cuentas contables para filtros
- **Nuevos endpoints**:
  - `GET /api/saldo-promedios/{conjunto}/cuentas-contables` - Obtener cuentas contables para filtros
  - `POST /api/saldo-promedios/{conjunto}/generar` - Generar reporte completo de saldos promedios
  - `POST /api/saldo-promedios/{conjunto}/reporte` - Obtener reporte paginado de saldos promedios
  - `DELETE /api/saldo-promedios/limpiar` - Limpiar datos temporales
  - `POST /api/reporte-saldo-promedio/{conjunto}/generar` - **Ruta alternativa para compatibilidad con frontend**
- **Beneficios**:
  - Consultas SQL complejas optimizadas para mejor rendimiento
  - Cálculos automáticos de saldos promedios
  - Filtros dinámicos por cuenta contable y período
  - Paginación automática para grandes volúmenes de datos
  - Documentación Swagger completa
  - Integración con el sistema de conjuntos existente
  - **Compatibilidad total con frontend existente sin cambios**

### v1.13.0 - Reporte de Libro Mayor y Correcciones de Errores

- **Reporte de Libro Mayor**: Implementación completa del sistema de reportes de libro mayor con filtros avanzados
- **Correcciones de Errores TypeScript**: Solucionados todos los errores de compilación del proyecto
- **Nuevo Servicio de Base de Datos**: Implementación de `DatabaseService` para manejo centralizado de conexiones
- **Entidades implementadas**:
  - **ReporteLibroMayor**: Para el manejo de reportes de libro mayor
  - **FiltrosReporteLibroMayor**: Sistema completo de filtros para reportes
  - **ResumenLibroMayor**: Resúmenes estadísticos de los reportes
- **Nuevos endpoints**:
  - `GET /api/reporte-libro-mayor/{conjunto}` - Generar reporte completo
  - `GET /api/reporte-libro-mayor/{conjunto}/datos` - Obtener solo datos del reporte
  - `GET /api/reporte-libro-mayor/{conjunto}/resumen` - Obtener resumen del reporte
  - `GET /api/reporte-libro-mayor/{conjunto}/exportar` - Exportar reporte en diferentes formatos
  - `GET /api/reporte-libro-mayor/validar-filtros` - Validar filtros del reporte
- **Correcciones implementadas**:
  - Handler de reporte de libro mayor corregido con método `handle` correcto
  - Query implementando interfaz `IQuery` correctamente
  - Controlador con manejo de tipos corregido
  - Repositorio con inyección de dependencias corregida
  - Clase `DynamicModel` para consultas SQL dinámicas
  - Servicio `ReporteLibroMayorService` implementado completamente
  - Rutas registradas en la aplicación principal
  - Contenedor de dependencias actualizado
- **Beneficios**:
  - Código TypeScript compilando sin errores
  - Arquitectura CQRS implementada correctamente
  - Inyección de dependencias funcionando
  - Manejo centralizado de conexiones de base de datos
  - Documentación Swagger completa
  - Sistema de reportes completamente funcional

### v1.12.0 - Reporte de Centro de Costos

- **Reporte de Centro de Costos**: Implementación completa del sistema de reportes de centro de costos con filtros por cuenta contable
- **Filtros Dinámicos**: Sistema de filtros para cuentas contables que permite seleccionar centros de costo específicos
- **Queries SQL Optimizados**: Consultas directas a la base de datos para mejor rendimiento
- **Entidades implementadas**:
  - **ReporteCentroCosto**: Para el manejo de reportes de centro de costos
  - **FiltroCuentaContable**: Para el manejo de filtros de cuentas contables
  - **DetalleCuentaContable**: Para el manejo de detalles de cuentas contables
- **Nuevos endpoints con paginación**:
  - `GET /api/reporte-centro-costo/{conjunto}/filtro-cuentas-contables` - Obtener filtro de cuentas contables
  - `GET /api/reporte-centro-costo/{conjunto}/detalle-cuenta-contable/{cuentaContable}` - Obtener detalle de cuenta contable específica
  - `GET /api/reporte-centro-costo/{conjunto}/centros-costo/{cuentaContable}?page=1&limit=10` - Obtener centros de costo por cuenta contable
- **Beneficios**:
  - Consultas SQL directas para mejor rendimiento
  - Filtros dinámicos por cuenta contable
  - Paginación automática para grandes volúmenes de datos
  - Documentación Swagger completa
  - Integración con el sistema de conjuntos existente

### v1.11.0 - Reporte de Cuentas Contables

- **Reporte de Cuentas Contables**: Implementación completa del sistema de reportes de cuentas contables con filtros por centro de costo
- **Filtros Dinámicos**: Sistema de filtros para centros de costo que permite seleccionar cuentas contables específicas
- **Queries SQL Optimizados**: Consultas directas a la base de datos para mejor rendimiento
- **Entidades implementadas**:
  - **ReporteCuentaContable**: Para el manejo de reportes de cuentas contables
  - **FiltroCentroCosto**: Para el manejo de filtros de centros de costo
- **Nuevos endpoints con paginación**:
  - `GET /api/reporte-cuenta-contable/{conjunto}/filtro-centros-costo` - Obtener filtro de centros de costo
  - `GET /api/reporte-cuenta-contable/{conjunto}/centro-costo/{centroCosto}` - Obtener información de centro de costo específico
  - `GET /api/reporte-cuenta-contable/{conjunto}/cuentas-contables/{centroCosto}?limit=100&offset=0` - Obtener cuentas contables por centro de costo
- **Beneficios**:
  - Consultas SQL directas para mejor rendimiento
  - Filtros dinámicos por centro de costo
  - Paginación automática para grandes volúmenes de datos
  - Documentación Swagger completa

### v1.10.0 - Integración con Base de Datos EXACTUS (Solo Lectura) - Optimizada

- **Nueva conexión de solo lectura**: Integración con base de datos EXACTUS para consultas de datos contables
- **Entidades implementadas**:
  - **Conjunto**: Gestión de conjuntos empresariales (ERPADMIN.CONJUNTO)
  - **CentroCosto**: Gestión de centros de costo (dinámico por conjunto)
  - **CuentaContable**: Plan de cuentas contables (dinámico por conjunto)
  - **MovimientoContable**: Reportes de movimientos contables (dinámico por conjunto)
- **Modelos dinámicos**: Sistema de modelos que se adaptan al esquema del conjunto seleccionado
- **Optimizaciones de rendimiento**:
  - **Paginación automática**: Límites configurables (`limit`, `offset`, `page`)
  - **Selección de campos**: Consultas optimizadas seleccionando solo campos necesarios
  - **Pool de conexiones**: Configuración optimizada para consultas concurrentes
  - **Middleware de optimización**: Validación, rate limiting y monitoreo de rendimiento
  - **Caché headers**: Headers de caché para consultas GET
- **Nuevos endpoints con paginación**:
  - `GET /api/conjuntos?limit=100&offset=0&page=1` - Obtener todos los conjuntos
  - `GET /api/conjuntos/activos?limit=100&offset=0&page=1` - Obtener conjuntos activos
  - `GET /api/conjuntos/:codigo` - Obtener conjunto específico
  - `GET /api/exactus/:conjunto/centros-costo?limit=100&offset=0` - Centros de costo por conjunto
  - `GET /api/exactus/:conjunto/centros-costo/:codigo` - Centro de costo específico
  - `GET /api/exactus/:conjunto/centros-costo/tipo/:tipo?limit=100&offset=0` - Centros de costo por tipo
  - `GET /api/exactus/:conjunto/centros-costo/activos?limit=100&offset=0` - Centros de costo activos
  - `GET /api/exactus/:conjunto/cuentas-contables?limit=100&offset=0` - Cuentas contables por conjunto
  - `GET /api/exactus/:conjunto/cuentas-contables/:codigo` - Cuenta específica
  - `GET /api/exactus/:conjunto/cuentas-contables/tipo/:tipo?limit=100&offset=0` - Cuentas por tipo
  - `GET /api/exactus/:conjunto/cuentas-contables/activas?limit=100&offset=0` - Cuentas activas
  - `POST /api/movimientos/:conjunto/generar-reporte` - Generar reporte de movimientos
  - `GET /api/movimientos/:conjunto/por-usuario/:usuario?limit=100&offset=0` - Movimientos por usuario
  - `GET /api/movimientos/:conjunto/por-centro-costo/:centroCosto?limit=100&offset=0` - Movimientos por centro de costo
  - `GET /api/movimientos/:conjunto/por-cuenta-contable/:cuentaContable?limit=100&offset=0` - Movimientos por cuenta contable
- **Arquitectura**: 
  - Patrón Repository para acceso a datos
  - Servicios de dominio para lógica de negocio
  - Controladores para manejo de requests
  - Sin autenticación (solo lectura)
  - Middleware de optimización para rendimiento
- **Configuración**: Variables de entorno para conexión EXACTUS separadas de la base principal
- **Monitoreo de rendimiento**:
  - Logs automáticos para consultas lentas (> 1 segundo)
  - Alertas para consultas muy lentas (> 5 segundos)
  - Métricas de rendimiento en tiempo real
- **Beneficios**:
  - Acceso a datos contables de múltiples empresas
  - Consultas dinámicas basadas en el conjunto seleccionado
  - Separación clara entre datos de gestión y datos contables
  - Escalabilidad para múltiples esquemas empresariales
  - **Rendimiento optimizado**: Consultas más rápidas y eficientes
  - **Paginación inteligente**: Control de memoria y transferencia de datos
  - **Monitoreo proactivo**: Detección temprana de problemas de rendimiento

### v1.9.0 - Corrección de Documentación Swagger y Autenticación
- **Corrección de endpoints públicos**: Actualizada documentación para endpoints que no requieren autenticación
  - `/api/login` - Endpoint de autenticación (público)
  - `/api/usuarios/register` - Registro de usuarios (público)
  - `/api/roles/activos` - Lista de roles activos (público)
  - `/api/menus` - Endpoints de lectura de menús (públicos)
- **Corrección de endpoints protegidos**: Asegurado que todos los endpoints que requieren autenticación tengan documentación correcta
  - `/api/usuarios/*` - Gestión de usuarios (protegido)
  - `/api/roles/*` - Gestión de roles (protegido)
  - `/api/sistemas/*` - Gestión de sistemas (protegido)
  - `/api/conexiones/*` - Gestión de conexiones (protegido)
  - `/api/permisos/*` - Gestión de permisos (protegido)
- **Consistencia en middleware**: Asegurado que la configuración de middleware coincida con la documentación Swagger
- **Beneficios**: 
  - Documentación Swagger precisa y actualizada
  - Seguridad mejorada con autenticación correcta
  - Claridad en qué endpoints requieren token y cuáles no

### v1.8.0 - Implementación de CQRS (Command Query Responsibility Segregation)
- **Patrón CQRS**: Separación de responsabilidades entre comandos (escritura) y queries (lectura)
- **Command Bus**: Sistema de comandos para operaciones de escritura (Create, Update, Delete)
- **Query Bus**: Sistema de queries para operaciones de lectura (Get, GetAll)
- **Handlers**: Manejadores específicos para cada comando y query
- **Entidades implementadas**:
  - **Usuario**: CreateUsuarioCommand, UpdateUsuarioCommand, DeleteUsuarioCommand, GetAllUsuariosQuery, GetUsuarioByIdQuery
  - **Rol**: CreateRolCommand, UpdateRolCommand, DeleteRolCommand, GetAllRolesQuery, GetRolByIdQuery
- **Beneficios**:
  - Separación clara entre operaciones de lectura y escritura
  - Escalabilidad mejorada para diferentes tipos de operaciones
  - Facilita la implementación de Event Sourcing en el futuro
  - Mejor organización del código siguiendo principios SOLID

### v1.7.0 - Nuevo Endpoint de Permisos Disponibles con Marcado
- **Nuevo endpoint**: `/api/rol/{rolId}/permisos-disponibles` para obtener todos los permisos disponibles marcando los activos
  - Implementación en backend con documentación Swagger completa
  - Método `getPermisosDisponiblesConMarcado()` en `RolSistemaMenuService`
  - Retorna todos los permisos con campo `activo` indicando si están asignados al rol
- **Beneficios**: 
  - Permite mostrar todos los permisos disponibles en modal de editar
  - Marca automáticamente los permisos que ya tiene el rol
  - Facilita la gestión completa de permisos por rol

### v1.6.0 - Mejora del Modal de Editar Rol
- **Funcionalidad**: Modal de editar rol ahora incluye gestión de permisos
  - Tabs para información básica y permisos
  - Selector de sistema con permisos pre-seleccionados
  - Árbol de permisos con selección múltiple
  - Vista previa del rol con información de permisos
- **Características**:
  - Carga automática de permisos existentes del rol
  - Filtrado por sistema seleccionado
  - Marcado automático de permisos ya asignados
  - Interfaz consistente con el modal de nuevo rol

### v1.5.0 - Nuevo Endpoint de Permisos por Rol
- **Nuevo endpoint**: `/api/rol/{rolId}/permisos` para obtener permisos específicos de un rol
  - Implementación en backend con documentación Swagger completa
  - Método `getPermisosByRol()` en `RolSistemaMenuService`
  - Integración en frontend con método `obtenerPermisosRol()`
- **Funcionalidad**: "Ver permisos" en roles y permisos ahora usa el endpoint específico
  - Carga permisos sin filtrar por sistema
  - Muestra todos los permisos asignados al rol
  - Compatibilidad con la interfaz existente

### v1.4.0 - Corrección de Endpoint de Permisos
- **Corrección**: Actualización del modal de nuevo rol para usar el endpoint correcto
  - Cambio de `/api/sistemas/{sistemaId}/menus` a `/api/sistemas/{sistemaId}/permisos`
  - Implementación de `convertPermisosToTreeNodes()` para procesar permisos
  - Mejora en el manejo de eventos del selector de sistemas
- **Mejora**: Logs de depuración para facilitar el troubleshooting
- **Beneficios**: Listado correcto de permisos según el sistema seleccionado

### v1.3.0 - Componentes Personalizados
- **TabViewComponent**: Componente de pestañas personalizado con diseño moderno y responsive
- **SelectButtonComponent**: Selector de botones con soporte para selección única y múltiple
- **TreeComponent**: Árbol jerárquico con selección múltiple y expansión/colapso
- **TreeNodeComponent**: Nodos de árbol con checkboxes y estados visuales
- **Diseño responsive**: Todos los componentes adaptados para dispositivos móviles
- **Sin dependencias externas**: Eliminación completa de PrimeNG para estos componentes

### v1.2.0 - Mejora del Modal de Nuevo Rol
- **Selección de permisos**: El modal de "Nuevo Rol" ahora incluye selección de permisos
- **Interfaz con pestañas**: Implementado sistema de pestañas para separar información básica y permisos
- **Selector de sistema**: Permite elegir el sistema para el cual se asignarán los permisos
- **Árbol de permisos**: Visualización jerárquica de permisos disponibles con selección múltiple
- **Resumen de permisos**: Muestra los permisos seleccionados antes de crear el rol
- **Asignación automática**: Los permisos se asignan automáticamente al crear el rol
- **Componentes personalizados**: Implementación de componentes propios sin dependencias externas

### v1.1.0 - Refactorización de Endpoints de Permisos
- **Nuevo archivo de rutas**: Creado `PermisoRoutes.ts` para centralizar endpoints de permisos
- **Documentación Swagger**: Agregada documentación completa para endpoints de permisos
- **Mejora en organización**: Endpoints de permisos ahora siguen el patrón de arquitectura hexagonal
- **Endpoints disponibles**:
  - `GET /api/permisos/:rolId/:sistemaId` - Obtener permisos de un rol en un sistema
  - `POST /api/permisos` - Asignar permisos a un rol en un sistema  
  - `PUT /api/permisos/:id` - Actualizar un permiso específico

## 📊 Reportes Disponibles

### Reportes Contables
- **Reporte de Cuentas Contables**: `/api/reporte-cuenta-contable/{conjunto}`
- **Reporte de Centros de Costo**: `/api/reporte-centro-costo/{conjunto}`
- **Reporte de Gastos por Destino**: `/api/reporte-gastos-destino/{conjunto}`
- **Reporte de Asientos Sin Dimensión**: `/api/reporte-asientos-sin-dimension/{conjunto}`
- **Resumen de Asientos**: `/api/resumen-asientos/{conjunto}`
- **Reporte Mensual Cuenta-Centro**: `/api/reporte-mensual-cuenta-centro/{conjunto}`
- **Reporte de Movimientos Contables**: `/api/reporte-movimientos-contables/{conjunto}`
- **Reporte de Movimientos Contables Agrupados**: `/api/reporte-movimientos-contables-agrupados/{conjunto}`

### Reporte de Movimientos Contables Agrupados por NIT y Dimensión Contable

Este nuevo reporte combina datos del diario y mayor, agrupando movimientos contables por NIT y dimensión contable según el query SQL proporcionado.

#### Endpoints Disponibles:

1. **Obtener Reporte**: `GET /api/reporte-movimientos-contables-agrupados/{conjunto}`
   - Genera el reporte con filtros personalizables
   - Soporta paginación y ordenamiento
   - Incluye totales y subtotales opcionales

2. **Exportar Reporte**: `GET /api/reporte-movimientos-contables-agrupados/{conjunto}/exportar?formato={EXCEL|PDF|CSV}`
   - Exporta el reporte en múltiples formatos
   - Descarga directa del archivo

3. **Obtener Estadísticas**: `GET /api/reporte-movimientos-contables-agrupados/{conjunto}/estadisticas`
   - Proporciona totales y subtotales del reporte
   - Útil para análisis y resúmenes ejecutivos

#### Características Principales:

- **Fuentes de Datos**: Combina movimientos del diario y mayor
- **Agrupamiento**: Por cuenta contable, NIT, dimensión, fecha o ninguno
- **Ordenamiento**: Múltiples criterios de ordenamiento
- **Filtros Avanzados**: Cuentas, NITs, asientos, fechas, fuentes
- **Paginación**: Control de registros por página
- **Exportación**: Múltiples formatos (Excel, PDF, CSV)
- **Estadísticas**: Totales y subtotales por grupos
- **Performance**: Consultas SQL optimizadas

#### Ejemplo de Uso:

```bash
# Obtener reporte básico
GET /api/reporte-movimientos-contables-agrupados/ASFSAC?fechaInicio=2020-01-01&fechaFin=2023-12-31&contabilidad=T

# Con filtros adicionales
GET /api/reporte-movimientos-contables-agrupados/ASFSAC?fechaInicio=2020-01-01&fechaFin=2023-12-31&contabilidad=F&cuentaContableDesde=01.0.0.0.000&cuentaContableHasta=01.9.9.999&agruparPor=CUENTA&ordenarPor=MONTO&orden=DESC

# Exportar a Excel
GET /api/reporte-movimientos-contables-agrupados/ASFSAC/exportar?formato=EXCEL&fechaInicio=2020-01-01&fechaFin=2023-12-31

# Obtener estadísticas
GET /api/reporte-movimientos-contables-agrupados/ASFSAC/estadisticas?fechaInicio=2020-01-01&fechaFin=2023-12-31&agruparPor=CUENTA
```

## Estructura del Proyecto

```
src/
├── domain/           # Capa de dominio (entidades, interfaces)
│   └── cqrs/        # Interfaces CQRS (ICommand, IQuery, ICommandBus, IQueryBus)
├── application/      # Capa de aplicación (casos de uso, servicios)
│   ├── commands/    # Comandos CQRS (Create, Update, Delete)
│   ├── queries/     # Queries CQRS (Get, GetAll)
│   └── handlers/    # Manejadores CQRS (CommandHandlers, QueryHandlers)
└── infrastructure/   # Capa de infraestructura (controladores, repositorios)
    └── cqrs/        # Implementaciones CQRS (CommandBus, QueryBus, CqrsService)
```

## Instalación

```bash
npm install
```

## Configuración

1. Crear archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Configuración de la base de datos principal
DB_HOST=localhost
DB_PORT=1433
DB_NAME=ReportesLegacy
DB_USER=sa
DB_PASSWORD=123456

# Configuración de la base de datos EXACTUS (solo lectura)
EXACTUS_DB_HOST=localhost
EXACTUS_DB_PORT=1433
EXACTUS_DB_NAME=EXACTUS
EXACTUS_DB_USER=sa
EXACTUS_DB_PASSWORD=123456
EXACTUS_DB_DIALECT=mssql

# Configuración del servidor
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=your-secret-key-here
```

**Variables de entorno:**

**Base de datos principal:**
   - `DB_HOST`: Host de la base de datos
   - `DB_PORT`: Puerto de la base de datos
   - `DB_NAME`: Nombre de la base de datos
   - `DB_USER`: Usuario de la base de datos
   - `DB_PASSWORD`: Contraseña de la base de datos

**Base de datos EXACTUS (solo lectura):**
   - `EXACTUS_DB_HOST`: Host de la base de datos EXACTUS
   - `EXACTUS_DB_NAME`: Nombre de la base de datos EXACTUS (default: EXACTUS)
   - `EXACTUS_DB_USER`: Usuario de la base de datos EXACTUS
   - `EXACTUS_DB_PASSWORD`: Contraseña de la base de datos EXACTUS
   - `EXACTUS_DB_DIALECT`: Dialecto de la base de datos (default: mssql)

**Configuración general:**
   - `JWT_SECRET`: Clave secreta para JWT
   - `PORT`: Puerto del servidor (default: 3000)

## Desarrollo

```bash
npm run dev
```

## Producción

```bash
npm run build
npm start
```

## Docker

```bash
docker build -t api-reportes-legacy .
docker run -p 3000:3000 api-reportes-legacy
```

## Generación de PDFs

### Características
- **Script Python**: Utiliza ReportLab para generar PDFs profesionales
- **Datos dinámicos**: Los PDFs incluyen datos actuales de la base de datos
- **Filtros aplicados**: Los filtros de la consulta se reflejan en el PDF
- **Información de empresa**: Incluye datos configurables de la empresa

### Dependencias Python
El contenedor Docker incluye:
- Python 3
- ReportLab (para generación de PDFs)
- Requests (para comunicación HTTP)

### Archivos
- `pdf-generator.py`: Script principal de generación de PDFs
- `requirements.txt`: Dependencias de Python

### Uso
El endpoint `/api/movimientos-contables/pdf` acepta:
- `filtros`: Objeto con filtros para los movimientos contables
- `datosReporte`: Objeto con información del reporte (títulos, empresa, etc.)

## Endpoints Principales

### Autenticación (Públicos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/login` | Login de usuario |
| `POST` | `/api/usuarios/register` | Registro de usuario |

### Menús (Públicos para lectura)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/menus` | Obtener todos los menús |
| `GET` | `/api/menus/rol/{rolId}/sistema/{sistemaId}` | Obtener menús por rol y sistema |
| `GET` | `/api/menus/area/{area}` | Obtener menús por área |
| `GET` | `/api/menus/sistema/{sistemaCode}` | Obtener menús por sistema |

### Roles (Públicos para lectura)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/roles/activos` | Obtener roles activos |

### Conjuntos EXACTUS (Públicos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/conjuntos` | Obtener todos los conjuntos |
| `GET` | `/api/conjuntos/activos` | Obtener conjuntos activos |
| `GET` | `/api/conjuntos/:codigo` | Obtener conjunto por código |

### Datos EXACTUS (Públicos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/exactus/:conjunto/centros-cuenta` | Centros de costo por conjunto |
| `GET` | `/api/exactus/:conjunto/centros-cuenta/cuenta/:cuentaContable` | Centros de costo por cuenta contable |
| `GET` | `/api/exactus/:conjunto/cuentas-contables` | Cuentas contables por conjunto |
| `GET` | `/api/exactus/:conjunto/cuentas-contables/activas` | Cuentas contables activas |
| `GET` | `/api/exactus/:conjunto/cuentas-contables/tipo/:tipo` | Cuentas contables por tipo |
| `GET` | `/api/exactus/:conjunto/cuentas-contables/:codigo` | Cuenta contable por código |

### Usuarios (Protegidos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/usuarios` | Obtener todos los usuarios |
| `GET` | `/api/usuarios/:id` | Obtener usuario por ID |
| `POST` | `/api/usuarios` | Crear usuario |
| `PUT` | `/api/usuarios/:id` | Actualizar usuario |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario |
| `PATCH` | `/api/usuarios/:id/activate` | Activar usuario |
| `PATCH` | `/api/usuarios/:id/deactivate` | Desactivar usuario |
| `PATCH` | `/api/usuarios/:id/cambiar-password` | Cambiar contraseña |

### Roles (Protegidos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/roles` | Obtener todos los roles |
| `GET` | `/api/roles/:id` | Obtener rol por ID |
| `POST` | `/api/roles` | Crear rol |
| `PUT` | `/api/roles/:id` | Actualizar rol |
| `DELETE` | `/api/roles/:id` | Eliminar rol |

### Permisos (Protegidos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/permisos/:rolId/:sistemaId` | Obtener permisos de un rol en un sistema |
| `POST` | `/api/permisos` | Asignar permisos a un rol en un sistema |
| `PUT` | `/api/permisos/:id` | Actualizar un permiso específico |

### Sistemas (Protegidos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/sistemas` | Obtener todos los sistemas |
| `GET` | `/api/sistemas/:id` | Obtener sistema por ID |
| `POST` | `/api/sistemas` | Crear sistema |
| `PUT` | `/api/sistemas/:id` | Actualizar sistema |
| `DELETE` | `/api/sistemas/:id` | Eliminar sistema |

### Conexiones (Protegidos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/conexiones` | Obtener todas las conexiones |
| `GET` | `/api/conexiones/:id` | Obtener conexión por ID |
| `POST` | `/api/conexiones` | Crear conexión |
| `PUT` | `/api/conexiones/:id` | Actualizar conexión |
| `DELETE` | `/api/conexiones/:id` | Eliminar conexión |

## Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Los endpoints protegidos requieren el token en el header:

```
Authorization: Bearer <token>
```

### Endpoints Públicos
- `/api/login` - Autenticación
- `/api/usuarios/register` - Registro de usuarios
- `/api/menus` - Lectura de menús
- `/api/roles/activos` - Roles activos

### Endpoints Protegidos
Todos los demás endpoints requieren autenticación con token JWT válido. 