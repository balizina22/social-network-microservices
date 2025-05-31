const express = require('express');
const router = express.Router();
const Like = require('../models/Like');
const axios = require('axios');

const POSTS_SERVICE_URL = process.env.POSTS_SERVICE_URL;

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Gestion des likes
 */

/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Ajouter un like à un post par un utilisateur
 *     tags: [Likes]
 *     requestBody:
 *       description: ID utilisateur et ID du post à liker
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - postId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 608c1f2f9a1d3b0015a4b123
 *               postId:
 *                 type: string
 *                 example: 608c1f2f9a1d3b0015a4b456
 *     responses:
 *       201:
 *         description: Like créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Like'
 *       400:
 *         description: Like déjà existant ou données manquantes
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /likes/{id}:
 *   delete:
 *     summary: Supprimer un like par son ID
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du like à supprimer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Like supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Like supprimé
 *       404:
 *         description: Like non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /likes:
 *   get:
 *     summary: Liste tous les likes (optionnel)
 *     tags: [Likes]
 *     responses:
 *       200:
 *         description: Liste des likes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Like'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Like:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 60af8844c25e5b0022a7f5b2
 *         userId:
 *           type: string
 *           example: 608c1f2f9a1d3b0015a4b123
 *         postId:
 *           type: string
 *           example: 608c1f2f9a1d3b0015a4b456
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-05-30T10:30:00.000Z
 */

router.post('/', async (req, res) => {
  try {
    const { userId, postId } = req.body;
    if (!userId || !postId) return res.status(400).json({ message: "Champs manquants" });

    const existingLike = await Like.findOne({ userId, postId });
    if (existingLike) return res.status(400).json({ message: "Like déjà existant" });

    const newLike = new Like({ userId, postId });
    await newLike.save();

    await axios.put(`${POSTS_SERVICE_URL}/posts/${postId}/increment-like`);

    res.status(201).json(newLike);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const like = await Like.findById(req.params.id);
    if (!like) return res.status(404).json({ message: "Like non trouvé" });

    await Like.findByIdAndDelete(req.params.id);

    await axios.put(`${POSTS_SERVICE_URL}/posts/${like.postId}/decrement-like`);

    res.json({ message: "Like supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const likes = await Like.find();
    res.json(likes);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
