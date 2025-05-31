const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: { type: String, required: true },        // ID de l’utilisateur qui a créé le post
  content: { type: String, required: true },       // Contenu du post (texte, JSON, etc)
  likesCount: { type: Number, default: 0 },        // Compteur de likes initialisé à 0
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware pour mettre à jour updatedAt à chaque modification
postSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Post', postSchema);
