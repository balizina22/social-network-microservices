require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const postsRoutes = require('./routes/posts');
const setupSwagger = require('./swagger');

const app = express();

app.use(cors());
app.use(express.json());

// Setup Swagger UI
setupSwagger(app);

// Routes posts
app.use('/posts', postsRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB PostsDB');
    app.listen(process.env.PORT, () => {
      console.log(`Serveur Posts démarré sur le port ${process.env.PORT}`);
      console.log(`Documentation Swagger disponible sur http://localhost:${process.env.PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('Erreur connexion MongoDB:', err.message);
  });
