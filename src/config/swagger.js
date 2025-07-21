import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Configuración básica de Swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Reportes Legacy',
      version: '1.0.0',
      description: 'API REST para gestión de reportes legacy con sistema de autenticación y autorización basado en roles',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'desarrollo@globalis.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor de desarrollo'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          required: ['username', 'password', 'email', 'rolId'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del usuario'
            },
            username: {
              type: 'string',
              description: 'Nombre de usuario único'
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario (hash)'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email único del usuario'
            },
            estado: {
              type: 'boolean',
              description: 'Estado del usuario (activo/inactivo)'
            },
            rolId: {
              type: 'integer',
              description: 'ID del rol asignado al usuario'
            }
          }
        },
        Rol: {
          type: 'object',
          required: ['descripcion', 'descripcion_completa', 'estado'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del rol'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción corta del rol'
            },
            descripcion_completa: {
              type: 'string',
              description: 'Descripción detallada del rol'
            },
            estado: {
              type: 'boolean',
              description: 'Estado del rol (activo/inactivo)'
            }
          }
        },
        Menu: {
          type: 'object',
          required: ['descripcion', 'estado'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del menú'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del menú'
            },
            padreId: {
              type: 'integer',
              description: 'ID del menú padre (para estructura jerárquica)',
              nullable: true
            },
            icon: {
              type: 'string',
              description: 'Ícono del menú',
              nullable: true
            },
            estado: {
              type: 'boolean',
              description: 'Estado del menú (activo/inactivo)'
            }
          }
        },
        Sistema: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único del sistema'
            },
            descripcion: {
              type: 'string',
              description: 'Descripción del sistema'
            },
            estado: {
              type: 'boolean',
              description: 'Estado del sistema (activo/inactivo)'
            }
          }
        },
        Conexion: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único de la conexión'
            },
            nombre: {
              type: 'string',
              description: 'Nombre de la conexión'
            },
            servidor: {
              type: 'string',
              description: 'Servidor de base de datos'
            },
            baseDatos: {
              type: 'string',
              description: 'Nombre de la base de datos'
            },
            usuario: {
              type: 'string',
              description: 'Usuario de conexión'
            },
            password: {
              type: 'string',
              description: 'Contraseña de conexión'
            },
            puerto: {
              type: 'integer',
              description: 'Puerto de conexión'
            },
            estado: {
              type: 'boolean',
              description: 'Estado de la conexión'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Nombre de usuario'
            },
            password: {
              type: 'string',
              description: 'Contraseña del usuario'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensaje de respuesta'
            },
            token: {
              type: 'string',
              description: 'Token JWT de autenticación'
            },
            role: {
              type: 'string',
              description: 'Rol del usuario'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Mensaje de error'
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js'], // Rutas donde están los comentarios de Swagger
};

const specs = swaggerJSDoc(options);

export { swaggerUi, specs }; 