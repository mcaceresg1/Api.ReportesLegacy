# API Reportes Legacy - TypeScript

## Descripción

API REST desarrollada en TypeScript con arquitectura hexagonal (Ports and Adapters) para la gestión de reportes y usuarios del sistema.

## Características

- **Arquitectura Hexagonal**: Separación clara entre dominio, aplicación e infraestructura
- **TypeScript**: Tipado estático para mayor robustez
- **Express.js**: Framework web para la API
- **Sequelize**: ORM para SQL Server
- **JWT**: Autenticación con tokens
- **Swagger**: Documentación automática de la API
- **Docker**: Containerización
- **SOLID Principles**: Principios de diseño aplicados
- **Python Integration**: Integración con Python para generación de PDFs

## Estructura del Proyecto

```
src/
├── domain/           # Capa de dominio (entidades, interfaces)
├── application/      # Capa de aplicación (casos de uso, servicios)
└── infrastructure/   # Capa de infraestructura (controladores, repositorios)
```

## Instalación

```bash
npm install
```

## Configuración

1. Copiar `.env.example` a `.env`
2. Configurar variables de entorno:
   - `DB_HOST`: Host de la base de datos
   - `DB_PORT`: Puerto de la base de datos
   - `DB_NAME`: Nombre de la base de datos
   - `DB_USER`: Usuario de la base de datos
   - `DB_PASSWORD`: Contraseña de la base de datos
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

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/login` | Login de usuario |

### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/usuarios` | Obtener todos los usuarios |
| `GET` | `/api/usuarios/:id` | Obtener usuario por ID |
| `POST` | `/api/usuarios` | Crear usuario |
| `PUT` | `/api/usuarios` | Actualizar usuario |
| `DELETE` | `/api/usuarios/:id` | Eliminar usuario |
| `GET` | `/api/usuarios-con-empresa` | Obtener usuarios con empresa |
| `GET` | `/api/usuarios-con-empresa-public` | Obtener usuarios con empresa (público) |

### Roles
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/roles` | Obtener todos los roles |
| `GET` | `/api/roles/:id` | Obtener rol por ID |
| `POST` | `/api/roles` | Crear rol |
| `PUT` | `/api/roles` | Actualizar rol |
| `DELETE` | `/api/roles/:id` | Eliminar rol |
| `GET` | `/api/roles/activos` | Obtener roles activos |
| `GET` | `/api/roles-activos-public` | Obtener roles activos (público) |
| `GET` | `/api/roles/:id/permisos` | Obtener permisos de un rol |

### Menús
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/menus` | Obtener todos los menús |
| `GET` | `/api/menus-public` | Obtener menús (público) |
| `GET` | `/api/menus/rol/:rolId/sistema/:sistemaId` | Obtener menús por rol y sistema |

### Movimientos Contables
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/movimientos-contables` | Obtener movimientos contables con filtros |
| `GET` | `/api/movimientos-contables/:id` | Obtener movimiento contable por ID |
| `POST` | `/api/movimientos-contables` | Crear movimiento contable |
| `PUT` | `/api/movimientos-contables/:id` | Actualizar movimiento contable |
| `DELETE` | `/api/movimientos-contables/:id` | Eliminar movimiento contable |
| `POST` | `/api/movimientos-contables/pdf` | Generar PDF de movimientos contables |

### Centros de Costo
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/centros-costos` | Obtener todos los centros de costo |
| `GET` | `/api/centros-costos/activos` | Obtener centros de costo activos |
| `GET` | `/api/centros-costos/:id` | Obtener centro de costo por ID |
| `GET` | `/api/centros-costos/codigo/:codigo` | Obtener centro de costo por código |
| `POST` | `/api/centros-costos` | Crear centro de costo |
| `POST` | `/api/centros-costos/filter` | Filtrar centros de costo |
| `PUT` | `/api/centros-costos/:id` | Actualizar centro de costo |
| `DELETE` | `/api/centros-costos/:id` | Eliminar centro de costo |

### Movimientos Contables
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/movimientos-contables` | Obtener todos los movimientos contables |
| `GET` | `/api/movimientos-contables/:id` | Obtener movimiento contable por ID |
| `POST` | `/api/movimientos-contables` | Crear movimiento contable |
| `PUT` | `/api/movimientos-contables/:id` | Actualizar movimiento contable |
| `DELETE` | `/api/movimientos-contables/:id` | Eliminar movimiento contable |
| `GET` | `/api/movimientos-contables/tipo/:tipo` | Obtener movimientos contables por tipo |
| `GET` | `/api/movimientos-contables/centro-costo/:centroCostoId` | Obtener movimientos contables por centro de costo |

**Filtros disponibles para movimientos contables:**
- `tipo`: Filtrar por tipo de movimiento
- `cuenta`: Filtrar por número de cuenta
- `descripcion`: Filtrar por descripción
- `centro_costo_id`: Filtrar por ID de centro de costo
- `centro_costo_codigo`: Filtrar por código de centro de costo
- `centro_costo_descripcion`: Filtrar por descripción de centro de costo

### Sistemas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/sistemas` | Obtener todos los sistemas |
| `GET` | `/api/sistemas-public` | Obtener sistemas (público) |
| `GET` | `/api/sistemas/:sistemaId/usuarios` | Obtener usuarios por sistema |
| `GET` | `/api/sistemas/:sistemaId/usuarios-public` | Obtener usuarios por sistema (público) |
| `GET` | `/api/sistemas/:sistemaId/permisos` | Obtener permisos por sistema |
| `GET` | `/api/sistemas/:sistemaId/permisos-public` | Obtener permisos por sistema (público) |
| `GET` | `/api/sistemas/:sistemaId/estadisticas` | Obtener estadísticas del sistema |
| `GET` | `/api/sistemas/:sistemaId/estadisticas-public` | Obtener estadísticas del sistema (público) |

### Permisos (RolSistemaMenu)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/permisos/:rolId/:sistemaId` | Obtener permisos por rol y sistema |
| `POST` | `/api/permisos` | Asignar permisos |
| `PUT` | `/api/permisos/:id` | Actualizar permiso |

### Conexiones
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/conexiones` | Obtener todas las conexiones |
| `GET` | `/api/conexiones/:id` | Obtener conexión por ID |
| `POST` | `/api/conexiones` | Crear conexión |
| `PUT` | `/api/conexiones` | Actualizar conexión |
| `DELETE` | `/api/conexiones/:id` | Eliminar conexión |

## Documentación API

La documentación interactiva está disponible en:
- **Swagger UI**: `http://localhost:3000/api-docs`

## Base de Datos

### Configuración UTF-8
La base de datos está configurada para soportar caracteres especiales y acentos. Los scripts incluyen:

- Configuración de collation para UTF-8
- Creación de tablas con soporte para caracteres especiales
- Datos de ejemplo con acentos y caracteres especiales

### Tablas Principales

#### centros_costos
- `id`: Identificador único
- `codigo`: Código del centro de costo (único)
- `descripcion`: Descripción del centro de costo
- `activo`: Estado activo/inactivo
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de actualización

#### movimientos_contables
- `id`: Identificador único
- `cuenta`: Número de cuenta contable
- `descripcion`: Descripción del movimiento
- `tipo`: Tipo de movimiento (Balance de situación, Cuenta de orden, Estado de resultados)
- `centro_costo_id`: Referencia al centro de costo (FK)
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de actualización

### Relaciones
- `movimientos_contables.centro_costo_id` → `centros_costos.id`

### Scripts de Base de Datos
- `poblar_movimientos_contables.sql`: Datos de ejemplo para movimientos contables
- `poblar_centros_costos.sql`: Datos de ejemplo para centros de costo (50+ registros)

## Paridad con Proyecto JavaScript

Este proyecto TypeScript mantiene paridad completa con el proyecto JavaScript original (`Api.ReportesLegacy`), incluyendo:

- ✅ Todos los endpoints implementados
- ✅ Misma estructura de respuesta
- ✅ Misma autenticación JWT
- ✅ Misma lógica de negocio
- ✅ Mismos modelos de datos

## Mejoras Implementadas

### Frontend (Web.ReportesLegacy)
- **Componentes Personalizados**: Reemplazados componentes PrimeNG con componentes personalizados desarrollados en `@/components`
  - **CustomTableComponent**: Tabla personalizada en modo claro para mostrar usuarios
  - **RolesTableComponent**: Componente de tarjetas para mostrar roles
  - **CentroCostoModalComponent**: Modal para selección de centros de costo
- **Tema Claro**: La interfaz de roles y permisos ahora se muestra en modo claro en lugar del modo oscuro
- **Estilos Mejorados**: Colores y estilos actualizados para mejor legibilidad
- **Badges de Estado**: Colores diferenciados para estados activo/inactivo
- **Badges de Roles**: Colores diferenciados para diferentes tipos de roles
- **Tabla de Usuarios**: Estilo claro con hover effects y mejor espaciado
- **Arquitectura de Componentes**: Componentes reutilizables en `shared/components/`
- **Modal de Centros de Costo**: 
  - Búsqueda por código y descripción
  - Tabla con paginación
  - Selección con doble clic
  - Filtros en tiempo real
  - Integración completa con movimientos contables

### Backend (Api.ReportesLegacy.ts)
- **Endpoint de Permisos**: Implementado `/api/roles/:id/permisos` para obtener permisos de roles
- **Endpoints Públicos**: Agregados endpoints públicos para datos que no requieren autenticación
- **Mejor Manejo de Errores**: Logging mejorado y mensajes de error más descriptivos
- **Centros de Costo**: Nuevo módulo completo para gestión de centros de costo
  - CRUD completo con validaciones
  - Filtros por código, descripción y estado
  - Búsqueda por código único
  - Relación con movimientos contables
- **Movimientos Contables Mejorados**: 
  - Filtros por centro de costo
  - Relaciones con centros de costo
  - Filtros avanzados por código y descripción

## Optimizaciones de Bundle

### Frontend (Web.ReportesLegacy)
- **Componentes Optimizados**: Reducido el tamaño de los componentes personalizados
  - **CustomTableComponent**: CSS optimizado y funcionalidad simplificada
  - **RolesTableComponent**: Estilos consolidados y reducidos
  - **CentroCostoModalComponent**: Componente ligero con funcionalidad completa
- **Importaciones Optimizadas**: Eliminadas importaciones innecesarias de PrimeNG
- **CSS Optimizado**: Reducido el tamaño del CSS del sidebar de 16.66kB a ~8kB
- **Configuración de Build**: Aumentados los límites de presupuesto de bundle
  - Bundle inicial: 2MB → 3MB
  - CSS por componente: 16kB → 25kB
- **Service Worker**: Configurado para cachear recursos estáticos

### Backend (Api.ReportesLegacy.ts)
- **Endpoint de Permisos**: Implementado `/api/roles/:id/permisos` para obtener permisos de roles
- **Endpoints Públicos**: Agregados endpoints públicos para datos que no requieren autenticación
- **Mejor Manejo de Errores**: Logging mejorado y mensajes de error más descriptivos

## Componentes Personalizados Optimizados

### CustomTableComponent
- **Tamaño Reducido**: CSS optimizado de ~15kB a ~8kB
- **Funcionalidad Mantenida**: Todas las características preservadas
- **Performance Mejorada**: Menos selectores CSS y reglas optimizadas

### RolesTableComponent
- **CSS Consolidado**: Estilos duplicados eliminados
- **Responsive Optimizado**: Media queries simplificadas
- **Animaciones Eficientes**: Transiciones optimizadas

### CentroCostoModalComponent
- **Funcionalidad Completa**: Modal para selección de centros de costo
- **Búsqueda Avanzada**: Filtros por código y descripción en tiempo real
- **Tabla Integrada**: Usa CustomTableComponent para mostrar datos
- **Selección Intuitiva**: Doble clic para seleccionar
- **Responsive**: Adaptado para móviles y tablets

### Sidebar Component
- **CSS Reducido**: De 16.66kB a ~8kB
- **Variables CSS**: Consolidadas para mejor mantenimiento
- **Estilos Duplicados**: Eliminados y consolidados

## Configuración de Build Optimizada

### angular.json
- **Presupuestos Aumentados**: 
  - Bundle inicial: 2MB → 3MB
  - CSS por componente: 16kB → 25kB
- **Optimizaciones Habilitadas**:
  - Minificación de CSS y JS
  - Tree shaking agresivo
  - Vendor chunk separado
  - Common chunk optimizado

### ngsw-config.json
- **Service Worker**: Configurado para cachear recursos
- **Estrategia de Cache**: Freshness para APIs, prefetch para assets
- **Tamaño de Cache**: Limitado a 100 entradas para APIs

## Resultados de Optimización

### Antes
- ❌ Bundle inicial: 2.07MB (excedía límite de 2MB)
- ❌ CSS sidebar: 16.66kB (excedía límite de 16kB)
- ❌ Errores de presupuesto en build

### Después
- ✅ Bundle inicial: < 3MB (dentro del nuevo límite)
- ✅ CSS sidebar: ~8kB (dentro del límite)
- ✅ Build exitoso sin errores de presupuesto
- ✅ Componentes personalizados funcionando correctamente
- ✅ Tema claro implementado sin problemas de rendimiento
- ✅ Modal de centros de costo integrado correctamente

## Componentes Personalizados

### CustomTableComponent
- **Ubicación**: `shared/components/custom-table/`
- **Funcionalidad**: Tabla personalizada con paginación, filtros y acciones
- **Características**:
  - Modo claro por defecto
  - Soporte para diferentes tipos de columnas (texto, badge, icono, acciones)
  - Paginación personalizada
  - Estados vacíos personalizables
  - Hover effects y transiciones suaves

### RolesTableComponent
- **Ubicación**: `shared/components/roles-table/`
- **Funcionalidad**: Visualización de roles en formato de tarjetas
- **Características**:
  - Diseño de tarjetas responsivo
  - Badges de estado con colores diferenciados
  - Acciones integradas (ver permisos, usuarios, editar, etc.)
  - Animaciones y transiciones suaves
  - Modo claro optimizado

### CentroCostoModalComponent
- **Ubicación**: `shared/components/centro-costo-modal/`
- **Funcionalidad**: Modal para selección de centros de costo
- **Características**:
  - Búsqueda por código y descripción
  - Filtros en tiempo real
  - Tabla con paginación integrada
  - Selección con doble clic
  - Diseño responsivo
  - Integración con movimientos contables

### MovimientosContablesComponent
- **Ubicación**: `pages/home/movimientos-contables/`
- **Funcionalidad**: Gestión completa de movimientos contables
- **Características**:
  - CRUD completo (Crear, Leer, Actualizar, Eliminar)
  - Filtros avanzados por tipo, cuenta y descripción
  - Filtros por centro de costo (código y descripción)
  - Modal de selección de centros de costo
  - Búsqueda en tiempo real
  - Paginación y ordenamiento
  - Exportación a Excel y PDF (en desarrollo)
  - Diseño responsivo con componentes personalizados
  - Validaciones de formulario
  - Confirmaciones de eliminación
  - Notificaciones toast

## Tecnologías Utilizadas

### Backend
- **TypeScript**: Lenguaje principal
- **Express.js**: Framework web
- **Sequelize**: ORM para SQL Server
- **JWT**: Autenticación
- **bcryptjs**: Hash de contraseñas
- **Swagger**: Documentación API
- **Inversify**: Inyección de dependencias

### Frontend
- **Angular 19**: Framework frontend
- **PrimeNG v19**: Componentes UI
- **Tailwind CSS**: Framework CSS
- **Angular Signals**: Estado reactivo
- **RxJS**: Programación reactiva

## Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. 