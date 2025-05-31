require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const likesRoutes = require('./routes/likes');
const setupSwagger = require('./swagger');

const app = express();

app.use(cors());
app.use(express.json());

// Swagger UI
setupSwagger(app);

// Routes Likes
app.use('/likes', likesRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connecté à MongoDB LikesDB');
    app.listen(process.env.PORT, () => {
      console.log(`Serveur Likes démarré sur le port ${process.env.PORT}`);
      console.log(`Documentation Swagger disponible sur http://localhost:${process.env.PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('Erreur connexion MongoDB:', err.message);
  });
