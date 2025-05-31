// script generateSwagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Utilisateurs',
      version: '1.0.0',
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

fs.writeFileSync('./swagger-output.json', JSON.stringify(swaggerSpec, null, 2));
