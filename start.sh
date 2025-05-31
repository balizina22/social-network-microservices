#!/bin/bash

echo "Lancement des microservices..."

# Lance les 3 services en arrière-plan
(cd user-service && node server.js) &
(cd post-service && node server.js) &
(cd like-service && node server.js) &

echo "Lancement du serveur Swagger unifié..."
(cd swagger-unified && node server.js) &

echo "Tous les services sont lancés."

echo "Ouvre ton navigateur sur : http://localhost:4000/api-docs"
wait
