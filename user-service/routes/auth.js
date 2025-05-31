const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs et authentification
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       description: Informations pour créer un utilisateur
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: monUser
 *               password:
 *                 type: string
 *                 example: monPass123
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur créé avec succès
 *       400:
 *         description: Utilisateur déjà existant ou données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Utilisateur déjà existant
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Connexion d’un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       description: Informations de connexion
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *               - password
 *             properties:
 *               userName:
 *                 type: string
 *                 example: monUser
 *               password:
 *                 type: string
 *                 example: monPass123
 *     responses:
 *       200:
 *         description: Connexion réussie, retourne un token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 message:
 *                   type: string
 *                   example: Connexion réussie
 *       400:
 *         description: Champs manquants ou identifiants incorrects
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mot de passe incorrect
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/request-reset-password:
 *   post:
 *     summary: Demande de réinitialisation du mot de passe (génère un token temporaire)
 *     tags: [Utilisateurs]
 *     requestBody:
 *       description: Nom d’utilisateur pour lequel on veut réinitialiser le mot de passe
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userName
 *             properties:
 *               userName:
 *                 type: string
 *                 example: monUser
 *     responses:
 *       200:
 *         description: Token de réinitialisation généré (à envoyer par mail en prod)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token de reset généré
 *                 resetToken:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Nom d’utilisateur manquant
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /users/reset-password:
 *   post:
 *     summary: Réinitialisation du mot de passe avec un token
 *     tags: [Utilisateurs]
 *     requestBody:
 *       description: Token de reset et nouveau mot de passe
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - resetToken
 *               - newPassword
 *             properties:
 *               resetToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               newPassword:
 *                 type: string
 *                 example: monNouveauPass123
 *     responses:
 *       200:
 *         description: Mot de passe réinitialisé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Mot de passe réinitialisé avec succès
 *       400:
 *         description: Token invalide ou données manquantes
 *       401:
 *         description: Token expiré
 *       404:
 *         description: Utilisateur non trouvé
 */

router.post('/register', async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) return res.status(400).json({ message: "Champs manquants" });

    // Vérifier si utilisateur existe déjà
    const userExist = await User.findOne({ userName });
    if (userExist) return res.status(400).json({ message: "Utilisateur déjà existant" });

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ userName, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { userName, password } = req.body;
    if (!userName || !password) return res.status(400).json({ message: "Champs manquants" });

    const user = await User.findOne({ userName });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign({ userId: user._id, userName: user.userName }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token, message: "Connexion réussie" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.post('/request-reset-password', async (req, res) => {
  const { userName } = req.body;
  if (!userName) return res.status(400).json({ message: "userName requis" });

  try {
    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const resetToken = jwt.sign(
      { userId: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Simuler l’envoi par mail (ici on renvoie le token en réponse)
    res.json({ message: "Token de reset généré", resetToken });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return res.status(400).json({ message: "Token et nouveau mot de passe requis" });

  try {
    const payload = jwt.verify(resetToken, process.env.JWT_SECRET);

    const user = await User.findById(payload.userId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Token expiré" });
    }
    res.status(400).json({ message: "Token invalide ou erreur", error: err.message });
  }
});

module.exports = router;
