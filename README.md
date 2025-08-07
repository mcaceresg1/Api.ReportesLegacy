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

### v1.10.0 - Integración con Base de Datos EXACTUS (Solo Lectura)
- **Nueva conexión de solo lectura**: Integración con base de datos EXACTUS para consultas de datos contables
- **Entidades implementadas**:
  - **Conjunto**: Gestión de conjuntos empresariales (ERPADMIN.CONJUNTO)
  - **CentroCuenta**: Relación entre centros de costo y cuentas contables (dinámico por conjunto)
  - **CuentaContable**: Plan de cuentas contables (dinámico por conjunto)
- **Modelos dinámicos**: Sistema de modelos que se adaptan al esquema del conjunto seleccionado
- **Nuevos endpoints**:
  - `/api/conjuntos` - Obtener todos los conjuntos disponibles
  - `/api/conjuntos/activos` - Obtener conjuntos activos
  - `/api/conjuntos/:codigo` - Obtener conjunto específico
  - `/api/exactus/:conjunto/centros-cuenta` - Centros de costo por conjunto
  - `/api/exactus/:conjunto/cuentas-contables` - Cuentas contables por conjunto
  - `/api/exactus/:conjunto/cuentas-contables/activas` - Cuentas contables activas
  - `/api/exactus/:conjunto/cuentas-contables/tipo/:tipo` - Cuentas por tipo
  - `/api/exactus/:conjunto/cuentas-contables/:codigo` - Cuenta específica
- **Arquitectura**: 
  - Patrón Repository para acceso a datos
  - Servicios de dominio para lógica de negocio
  - Controladores para manejo de requests
  - Sin autenticación (solo lectura)
- **Configuración**: Variables de entorno para conexión EXACTUS separadas de la base principal
- **Beneficios**:
  - Acceso a datos contables de múltiples empresas
  - Consultas dinámicas basadas en el conjunto seleccionado
  - Separación clara entre datos de gestión y datos contables
  - Escalabilidad para múltiples esquemas empresariales

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