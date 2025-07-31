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
        url: process.env['NODE_ENV'] === 'production' ? 'http://localhost:3000' : 'http://localhost:3000',
        description: process.env['NODE_ENV'] === 'production' ? 'Servidor de producción' : 'Servidor de desarrollo'
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
  apis: process.env['NODE_ENV'] === 'production' 
    ? [
        './dist/app.js',
        './dist/infrastructure/controllers/*.js',
        './dist/infrastructure/routes/*.js'
      ]
    : [
        './src/app.ts',
        './src/infrastructure/controllers/*.ts',
        './src/infrastructure/routes/*.ts'
      ]
};

export const specs = swaggerJsdoc(swaggerOptions); 