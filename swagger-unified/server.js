const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const _ = require('lodash');

const app = express();

const usersSpec = JSON.parse(fs.readFileSync('../user-service/swagger-output.json'));
const postsSpec = JSON.parse(fs.readFileSync('../post-service/swagger-output.json'));
const likesSpec = JSON.parse(fs.readFileSync('../like-service/swagger-output.json'));

const mergedSpec = {
  openapi: '3.0.0',
  info: {
    title: 'API Réseau Social - Documentation Unifiée',
    version: '1.0.0',
  },
  servers: [
    { url: 'http://localhost:3001', description: 'Service Utilisateurs' },
    { url: 'http://localhost:3002', description: 'Service Posts' },
    { url: 'http://localhost:3003', description: 'Service Likes' },
  ],
  paths: {
    ...usersSpec.paths,
    ...postsSpec.paths,
    ...likesSpec.paths,
  },
  components: {
    ...usersSpec.components,
    ...postsSpec.components,
    ...likesSpec.components,
  },
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(mergedSpec));

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Documentation unifiée Swagger disponible sur http://localhost:${PORT}/api-docs`);
});
