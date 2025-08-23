# Configuración del Proyecto Globalis API

## Resumen de Configuración

Este documento describe la configuración actual del proyecto para desarrollo y producción.

## Ambientes Configurados

### 🚀 DESARROLLO
- **Puerto**: 3002
- **Host**: localhost
- **URL Base**: http://localhost:3002
- **Swagger**: http://localhost:3002/api-docs
- **Archivo Config**: `config.development.env`

### 🚀 PRODUCCIÓN
- **Puerto**: 3000
- **Host**: 192.168.90.73
- **URL Base**: http://192.168.90.73:3000
- **Swagger**: http://192.168.90.73:3000/api-docs
- **Archivo Config**: `config.production.env`

## Archivos de Configuración

### config.development.env
```env
NODE_ENV=development
PORT=3002
HOST=localhost
DB_NAME=ConfiguracionesConexionDB
DB_USER=springuser
DB_PASSWORD=springpass123
DB_HOST=localhost
DB_DIALECT=mssql
EXACTUS_DB_NAME=EXACTUS
EXACTUS_DB_USER=usrGlobalis
EXACTUS_DB_PASSWORD=/@0srGl0b2l3s**
EXACTUS_DB_HOST=BDOPMANAGER
EXACTUS_DB_DIALECT=mssql
JWT_SECRET=mi_clave_secreta_super_segura
API_BASE_URL=http://localhost:3002
SWAGGER_HOST=localhost:3002
```

### config.production.env
```env
NODE_ENV=production
PORT=3000
HOST=192.168.90.73
DB_NAME=ConfiguracionesConexionDB
DB_USER=springuser
DB_PASSWORD=springpass123
DB_HOST=localhost
DB_DIALECT=mssql
EXACTUS_DB_NAME=EXACTUS
EXACTUS_DB_USER=usrGlobalis
EXACTUS_DB_PASSWORD=/@0srGl0b2l3s**
EXACTUS_DB_HOST=BDOPMANAGER
EXACTUS_DB_DIALECT=mssql
JWT_SECRET=mi_clave_secreta_super_segura
API_BASE_URL=http://192.168.90.73:3000
SWAGGER_HOST=192.168.90.73:3000
```

## Scripts Disponibles

### Package.json Scripts
```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "start:dev": "node -r dotenv/config dist/index.js dotenv_config_path=config.development.env",
    "start:prod": "node -r dotenv/config dist/index.js dotenv_config_path=config.production.env",
    "dev": "tsx -r dotenv/config src/index.ts dotenv_config_path=config.development.env",
    "dev:watch": "nodemon --exec \"tsx -r dotenv/config src/index.ts dotenv_config_path=config.development.env\"",
    "prod": "npm run build && npm run start:prod"
  }
}
```

### Scripts de Windows
- **`start-dev.bat`**: Inicia el servidor en modo desarrollo
- **`start-prod.bat`**: Inicia el servidor en modo producción

## Comandos de Ejecución

### Desarrollo
```bash
# Con reinicio automático (recomendado)
npm run dev:watch

# Sin reinicio automático
npm run dev

# Script de Windows
start-dev.bat
```

### Producción
```bash
# Compilar y ejecutar
npm run prod

# Compilar por separado
npm run build
npm run start:prod

# Script de Windows
start-prod.bat
```

## Configuración de Swagger

### Desarrollo
- **URL**: http://localhost:3002/api-docs
- **Host**: localhost:3002
- **Descripción**: Servidor de desarrollo

### Producción
- **URL**: http://192.168.90.73:3000/api-docs
- **Host**: 192.168.90.73:3000
- **Descripción**: Servidor de producción

## Variables de Entorno Clave

| Variable | Desarrollo | Producción | Descripción |
|----------|------------|------------|-------------|
| `NODE_ENV` | development | production | Ambiente de ejecución |
| `PORT` | 3002 | 3000 | Puerto del servidor |
| `HOST` | localhost | 192.168.90.73 | Host del servidor |
| `SWAGGER_HOST` | localhost:3002 | 192.168.90.73:3000 | Host para Swagger |

## Cambios Realizados

### ✅ Completado
- [x] Configuración de ambientes separados
- [x] Archivos de configuración para desarrollo y producción
- [x] Scripts de npm actualizados
- [x] Scripts de Windows creados
- [x] Configuración de Swagger para ambos ambientes
- [x] Eliminación de configuraciones Docker
- [x] README actualizado con nuevas instrucciones
- [x] Manejo de variables de entorno por ambiente

### 🔧 Configurado
- **Desarrollo**: Puerto 3002, localhost
- **Producción**: Puerto 3000, 192.168.90.73
- **Swagger**: URLs específicas por ambiente
- **Variables**: Mismas variables para ambos ambientes
- **Scripts**: Comandos específicos por ambiente

## Notas Importantes

1. **Variables de Entorno**: Las mismas variables se usan en ambos ambientes, solo cambian los valores de puerto y host
2. **Base de Datos**: La configuración de base de datos es la misma para ambos ambientes
3. **Swagger**: Se configura automáticamente según el ambiente
4. **Scripts**: Los scripts de Windows verifican la disponibilidad de puertos antes de iniciar
5. **Compilación**: En producción se compila automáticamente antes de ejecutar

## Verificación

### Desarrollo
```bash
# Verificar que el puerto 3002 esté libre
netstat -an | find "3002"

# Iniciar en desarrollo
npm run dev:watch

# Verificar funcionamiento
curl http://localhost:3002/health
curl http://localhost:3002/api-docs
```

### Producción
```bash
# Verificar que el puerto 3000 esté libre
netstat -an | find "3000"

# Iniciar en producción
npm run prod

# Verificar funcionamiento
curl http://192.168.90.73:3000/health
curl http://192.168.90.73:3000/api-docs
```
