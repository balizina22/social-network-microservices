# social-network-microservices

## Description

Ce projet contient trois microservices pour un réseau social minimaliste, chacun gérant une partie spécifique de l'application :

- **User-service** : gestion des utilisateurs et authentification (inscription, login, reset password)
- **Post-service** : gestion des posts (CRUD + compteur de likes)
- **Like-service** : gestion des likes (création, suppression, mise à jour du compteur de likes)

Le projet inclut également un serveur Swagger pour la documentation unifiée des API.

---

## Prérequis

Avant de commencer, assure-toi d'avoir les éléments suivants installés sur ta machine :

- **Node.js v18+** et **npm** (ou **Yarn** si tu préfères).
- **Git** pour cloner le dépôt.
- **MongoDB** installé et en cours d'exécution (ou utiliser MongoDB Atlas pour une base de données cloud).

---

## Installation et Lancement

### 1. **Cloner le projet**

Commence par cloner le projet depuis GitHub en utilisant la commande suivante :

```bash
git clone https://github.com/balizina22/social-network-microservices.git
cd social-network-microservices
```

### 2. **Lancer l'application**

Une fois le projet cloné, tu peux démarrer l'ensemble des microservices et outils associés (y compris Swagger pour la documentation) en exécutant simplement le script de démarrage prévu à cet effet :

```bash
./start.sh
```

### 3. **Accéder à la documentation Swagger**

Une fois l'application lancée avec `./start.sh`, tu peux accéder à la documentation unifiée de l'API via Swagger en ouvrant ton navigateur à l'adresse suivante :

[http://localhost:4000/api-docs](http://localhost:4000/api-docs)

Cette interface te permet d'explorer, tester et comprendre tous les endpoints disponibles à travers les trois microservices (utilisateurs, posts et likes), avec leurs schémas de requêtes/réponses détaillés.

> 📌 **Astuce** : si la page ne se charge pas, vérifie que le port `4000` est bien libre et que le service `api-gateway` (ou équivalent) est en cours d'exécution.
