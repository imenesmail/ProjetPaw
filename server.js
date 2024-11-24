const express = require("express");  // Importe le module Express pour créer le serveur web
const path = require("path");        // Importe le module Path pour manipuler les chemins de fichiers

// initialise une application Express
const app = express();

// Crée un serveur HTTP en utilisant l'application Express
const server = require("http").createServer(app);

// Initialise Socket.IO avec le serveur HTTP pour la communication en temps réel
const io = require("socket.io")(server);

// Configure le serveur pour servir les fichiers statiques depuis le dossier "public"
app.use(express.static(path.join(__dirname, "public")));

// ecoute l'event de connexion de chaque utilisateur
io.on("connection", function(socket) {
    // Écoute l'event "newuser" envoyé par le client lorsqu'un nouvel utilisateur se connecte
    socket.on("newuser", function(username) {
        // Stocke le nom d'utilisateur dans l'objet `socket`
        socket.username = username;
        // Envoie un message de mise à jour à tous les autres clients pour informer de la connexion
        socket.broadcast.emit("update", `${username} joined the chat`);
    });

    // Écoute l'événement "chat" pour les messages envoyés par les utilisateurs
    socket.on("chat", function(message) {
        // Diffuse le message aux autres utilisateurs peut y avoir plusieurs
        socket.broadcast.emit("chat", message);
    });

    // Écoute l'evenet "disconnect" qui est automatiquement émis par Socket.IO lorsqu'un utilisateur se déconnecte
    socket.on("disconnect", function() {
        // Utilise le nom d'utilisateur stocké pour afficher le message de déconnexion
        socket.broadcast.emit("update", `${socket.username} left the chat`);
    });
});

// Démarre le serveur sur le port 5005
server.listen(5005, () => {
    console.log("Server running on http://localhost:5005");
});
