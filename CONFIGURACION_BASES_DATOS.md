# Configuración de Bases de Datos HMIS

## Variables de Entorno Requeridas

Para que la API funcione correctamente, necesitas configurar las siguientes variables de entorno en tu archivo `.env`:

### Base de Datos Principal HMIS

```env
HMIS_DB_HOST=localhost
HMIS_DB_NAME=IT2_TEST
HMIS_DB_USER=tu_usuario
HMIS_DB_PASSWORD=tu_password
```

### Base de Datos HMIS Arequipa

```env
HMIS_AQP_DB_HOST=localhost
HMIS_AQP_DB_NAME=IT2_TEST_AQP
HMIS_AQP_DB_USER=tu_usuario
HMIS_AQP_DB_PASSWORD=tu_password
```

### Base de Datos HMIS Ica

```env
HMIS_ICA_DB_HOST=localhost
HMIS_ICA_DB_NAME=IT2_TEST_ICA
HMIS_ICA_DB_USER=tu_usuario
HMIS_ICA_DB_PASSWORD=tu_password
```

### Base de Datos HMIS Piura

```env
HMIS_PIURA_DB_HOST=localhost
HMIS_PIURA_DB_NAME=IT2_TEST_PIURA
HMIS_PIURA_DB_USER=tu_usuario
HMIS_PIURA_DB_PASSWORD=tu_password
```

### Base de Datos HMIS Tacna

```env
HMIS_TACNA_DB_HOST=localhost
HMIS_TACNA_DB_NAME=IT2_TEST_TACNA
HMIS_TACNA_DB_USER=tu_usuario
HMIS_TACNA_DB_PASSWORD=tu_password
```

## Solución al Error Actual

El error `getaddrinfo ENOTFOUND bdopmanagerh` indica que:

1. **El host `bdopmanagerh` no existe o no es accesible**
2. **Las variables de entorno no están configuradas correctamente**

### Pasos para Solucionar:

1. **Verifica tu archivo `.env`** y asegúrate de que tenga las variables correctas
2. **Reemplaza `bdopmanagerh`** con la dirección IP o nombre de host correcto de tu servidor de base de datos
3. **Verifica que el servidor de base de datos esté ejecutándose** y sea accesible desde tu aplicación

### Ejemplo de Configuración Correcta:

Si tu servidor de base de datos está en `192.168.1.100`:

```env
HMIS_DB_HOST=192.168.1.100
HMIS_DB_NAME=IT2_TEST
HMIS_DB_USER=sa
HMIS_DB_PASSWORD=tu_password_seguro
```

## Validación de Conexión

La aplicación ahora incluye validación automática de conexión. Si hay un problema de conectividad, verás un mensaje de error más claro que te indicará exactamente qué base de datos no se puede conectar.

## Endpoints Disponibles

- `GET /api/reporte-hmis/databases` - Lista todas las bases de datos disponibles
- `GET /api/reporte-hmis/{dbAlias}/contratos/{contrato}` - Obtiene un contrato específico
- `GET /api/reporte-hmis/contratos/{dbAlias}` - Lista contratos de una base de datos
