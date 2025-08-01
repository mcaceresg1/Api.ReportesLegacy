import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Reportes Legacy - TypeScript',
      version: '1.0.0',
      description: 'API con arquitectura hexagonal en TypeScript',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'desarrollo@empresa.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor Docker'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './dist/app.js',
    './dist/infrastructure/controllers/*.js',
    './dist/infrastructure/routes/*.js'
  ]
};

export const specs = swaggerJsdoc(swaggerOptions); 