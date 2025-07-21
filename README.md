# API Reportes Legacy

API REST para gestión de reportes legacy con sistema de autenticación y autorización basado en roles.

## 🚀 Características Principales

- **Autenticación JWT** con tokens de seguridad
- **Sistema de roles y permisos** granulares
- **Gestión de usuarios, roles, sistemas y menús**
- **Estructura jerárquica de menús**
- **Conexiones de base de datos** configurables
- **Documentación interactiva con Swagger UI**

## 🛠️ Tecnologías

- **Backend**: Node.js + Express.js
- **Base de datos**: SQL Server
- **ORM**: Sequelize
- **Autenticación**: JWT + bcryptjs
- **Documentación**: Swagger UI + JSDoc

## ⚙️ Instalación

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd Api.ReportesLegacy
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env` en la raíz del proyecto:
```env
# Base de datos
DB_NAME=tu_database
DB_USER=usuario
DB_PASSWORD=password
DB_HOST=localhost
DB_DIALECT=mssql

# JWT
JWT_SECRET=tu_secreto_super_secreto

# Servidor
PORT=3000
```

4. **Ejecutar la aplicación**
```bash
# Desarrollo (con hot-reload)
npm run dev

# O directamente
node index.js
```

## 📖 Documentación API

### Swagger UI
Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva:

**🔗 [http://localhost:3000/api-docs](http://localhost:3000/api-docs)**

### Endpoints principales

#### Autenticación
- `POST /api/login` - Iniciar sesión

#### Usuarios
- `GET /api/usuarios` - Listar usuarios (requiere token)
- `POST /api/usuarios/register` - Registrar usuario
- `PUT /api/usuarios` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

#### Roles
- `GET /api/roles` - Listar roles
- `POST /api/roles` - Crear rol
- `PUT /api/roles` - Actualizar rol
- `PATCH /api/roles` - Cambiar estado de rol

#### Conexiones
- `GET /api/conexiones` - Listar conexiones
- `POST /api/conexiones` - Crear conexión
- `PUT /api/conexiones` - Actualizar conexión
- `DELETE /api/conexiones/:id` - Eliminar conexión

#### Menús
- `GET /api/menus` - Listar menús
- `POST /api/menus` - Crear menú
- `PUT /api/menus` - Actualizar menú
- `DELETE /api/menus/:id` - Eliminar menú

#### Permisos
- `GET /api/permisos/:rolId/:sistemaId` - Obtener menús por rol y sistema
- `POST /api/permisos` - Asignar permisos
- `PUT /api/permisos/:id` - Actualizar permisos

## 🔐 Autenticación

### Login
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "tu_usuario",
    "password": "tu_password"
  }'
```

### Usar token en peticiones
```bash
curl -X GET http://localhost:3000/api/usuarios \
  -H "Authorization: Bearer tu_token_jwt"
```

## 📊 Estructura de Base de Datos

### Entidades principales:
- **Usuarios**: Gestión de usuarios del sistema
- **Roles**: Definición de roles y permisos
- **Sistemas**: Módulos o sistemas de la aplicación
- **Menús**: Estructura jerárquica de navegación
- **Conexiones**: Configuraciones de conexión a BD
- **RolMenu**: Permisos básicos rol-menú
- **RolSistemaMenu**: Permisos granulares rol-sistema-menú

## 🧪 Testing

### Probar con Swagger UI
1. Ir a [http://localhost:3000/api-docs](http://localhost:3000/api-docs)
2. Expandir el endpoint deseado
3. Hacer clic en "Try it out"
4. Completar los parámetros necesarios
5. Ejecutar la petición

### Probar autenticación
1. Usar el endpoint `/login` para obtener token
2. Copiar el token de la respuesta
3. Hacer clic en "Authorize" 🔒 en la parte superior
4. Ingresar: `Bearer tu_token_jwt`
5. Ahora puedes usar endpoints protegidos

## 🔧 Desarrollo

### Estructura del proyecto
```
Api.ReportesLegacy/
├── index.js                  # Punto de entrada
├── src/
│   ├── app.js               # Configuración Express + Swagger
│   ├── config/
│   │   ├── db.js           # Configuración Sequelize
│   │   └── swagger.js      # Configuración Swagger
│   ├── controllers/         # Lógica de negocio
│   ├── middleware/          # Middlewares de auth
│   ├── models/              # Modelos Sequelize
│   └── routes/              # Definición de rutas
└── README.md
```

### Scripts disponibles
```json
{
  "dev": "nodemon index.js",    // Desarrollo con auto-reload
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

## 🌐 URLs importantes

- **API Base**: `http://localhost:3000/api`
- **Swagger UI**: `http://localhost:3000/api-docs`
- **Health Check**: `http://localhost:3000/`

## 📝 Notas de desarrollo

- **Logs de BD**: Deshabilitados en producción (`logging: false`)
- **Sincronización**: `{ alter: true }` actualiza esquemas automáticamente
- **CORS**: Habilitado para desarrollo frontend
- **Timestamps**: Automáticos en la mayoría de modelos

## 🤝 Contribuir

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Add: nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia ISC. 