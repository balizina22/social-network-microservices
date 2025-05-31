require('dotenv').config();
const express = require('express');
const setupSwagger = require('./swagger');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require('./routes/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/users', authRoutes);

setupSwagger(app);

// Connexion MongoDB + lancement serveur
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("Connecté à MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Serveur Users démarré sur le port ${process.env.PORT}`);
      console.log(`Documentation Swagger disponible sur http://localhost:${process.env.PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error("Erreur connexion MongoDB :", err.message);
  });
