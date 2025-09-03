# Configuración de Variables de Entorno

## Variables de Entorno para Swagger

Para configurar correctamente la URL del servidor en Swagger, se han definido las siguientes variables de entorno:

### Variables Disponibles

- `NODE_ENV`: Entorno de ejecución (`development` o `production`)
- `SWAGGER_SERVER_URL`: URL del servidor para Swagger (por defecto: `http://192.168.90.73:3000`)
- `SWAGGER_SERVER_DESCRIPTION`: Descripción del servidor en Swagger

### Configuración por Defecto

- **Desarrollo**: `http://192.168.90.73:3000` (Servidor de desarrollo - producción)
- **Producción**: `http://192.168.90.73:3000` (Servidor de producción)

### Scripts de NPM

Los siguientes scripts ya están configurados con las variables de entorno correctas:

```bash
# Desarrollo
npm run dev
npm run start:dev
npm run dev:watch

# Producción
npm run start:prod
```

### Configuración Manual

Si necesitas configurar variables de entorno manualmente, puedes:

1. **Crear un archivo `.env`** en la raíz del proyecto:

```env
NODE_ENV=development
SWAGGER_SERVER_URL=http://192.168.90.73:3000
SWAGGER_SERVER_DESCRIPTION=Servidor de desarrollo (producción)
```

2. **O configurar las variables en el sistema**:

```bash
# Windows
set SWAGGER_SERVER_URL=http://192.168.90.73:3000
set SWAGGER_SERVER_DESCRIPTION=Servidor de desarrollo (producción)

# Linux/Mac
export SWAGGER_SERVER_URL=http://192.168.90.73:3000
export SWAGGER_SERVER_DESCRIPTION=Servidor de desarrollo (producción)
```

### Verificación

Para verificar que la configuración es correcta:

1. Inicia el servidor: `npm run dev`
2. Ve a: `http://192.168.90.73:3000/api-docs`
3. Verifica que la URL del servidor en Swagger sea `http://192.168.90.73:3000`

### Notas

- El archivo `.env` está en `.gitignore` por seguridad
- Las variables de entorno se cargan automáticamente con `dotenv`
- La configuración de Swagger se aplica tanto en desarrollo como en producción
