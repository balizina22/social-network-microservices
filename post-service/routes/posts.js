const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Gestion des posts
 */

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Crée un nouveau post
 *     tags: [Posts]
 *     requestBody:
 *       description: Données du post à créer
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - content
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 608c1f2f9a1d3b0015a4b123
 *               content:
 *                 type: string
 *                 example: Mon premier post !
 *     responses:
 *       201:
 *         description: Post créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Champs manquants
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Récupère tous les posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Liste des posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Récupère un post par ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post
 *     responses:
 *       200:
 *         description: Post trouvé
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Met à jour un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post à modifier
 *     requestBody:
 *       description: Nouveau contenu du post
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 example: Contenu mis à jour
 *     responses:
 *       200:
 *         description: Post mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Contenu manquant
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Supprime un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post à supprimer
 *     responses:
 *       200:
 *         description: Post supprimé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Post supprimé
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /posts/{id}/increment-like:
 *   put:
 *     summary: Incrémente le compteur de likes d’un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post
 *     responses:
 *       200:
 *         description: Post mis à jour avec compteur de likes incrémenté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /posts/{id}/decrement-like:
 *   put:
 *     summary: Décrémente le compteur de likes d’un post
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du post
 *     responses:
 *       200:
 *         description: Post mis à jour avec compteur de likes décrémenté
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       404:
 *         description: Post non trouvé
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 608c1f2f9a1d3b0015a4b123
 *         userId:
 *           type: string
 *           example: 608c1f2f9a1d3b0015a4b456
 *         content:
 *           type: string
 *           example: Mon premier post !
 *         likesCount:
 *           type: integer
 *           example: 0
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2025-05-29T22:24:26.057Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2025-05-29T22:24:26.058Z
 */

router.post('/', async (req, res) => {
  try {
    const { userId, content } = req.body;
    if (!userId || !content) return res.status(400).json({ message: "Champs manquants" });

    const newPost = new Post({ userId, content });
    await newPost.save();

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Contenu manquant" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });

    post.content = content;
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });
    res.json({ message: "Post supprimé" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.put('/:id/increment-like', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likesCount: 1 }, updatedAt: Date.now() },
      { new: true }
    );
    if (!post) return res.status(404).json({ message: "Post non trouvé" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.put('/:id/decrement-like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });

    post.likesCount = Math.max(post.likesCount - 1, 0);
    post.updatedAt = Date.now();
    await post.save();

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
