(function () {
    // Selectionne l'élément principal de l'application
    const app = document.querySelector(".app");
    // Initialise la connexion avec le serveur Socket.IO
    const socket = io();

    // Variable pour stocker le nom d'utilisateur
    let uname;

    // Rejoindre le chatroom
    app.querySelector(".join-screen #join-user").addEventListener("click", function () {
        // recupere le nom d'utilisateur saisi dans le champ de texte
        let username = app.querySelector(".join-screen #username").value;
        // Si le champ est vide la fonction s'arrête ici
        if (username.length === 0) {
            return;
        }
        // Émet l'événement "newuser" vers le serveur avec le nom d'utilisateur
        socket.emit("newuser", username);
        // Assigne le nom d'utilisateur à la variable uname
        uname = username;
        // Masque l'écran de connexion
        app.querySelector(".join-screen").classList.remove("active");
        // Affiche l'écran de chat
        app.querySelector(".chat-screen").classList.add("active");
    });

    // Envoyer un message
    app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
        // Récupère le texte du message saisi par l'utilisateur
        let message = app.querySelector(".chat-screen #message-input").value;
        // Si le champ de message est vide, la fonction s'arrête ici
        if (message.length === 0) {
            return;
        }
        // Affiche le message dans l'interface de chat comme "my message"
        renderMessage("my", {
            username: uname,
            text: message
        });
        // Émet l'événement "chat" vers le serveur avec le message et le nom d'utilisateur
        socket.emit("chat", {
            username: uname,
            text: message
        });
        // Efface le champ de saisie après l'envoi du message
        app.querySelector(".chat-screen #message-input").value = "";
    });

    // Quitter le chat
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function () {
        // Émet l'événement "exituser" vers le serveur pour notifier de la déconnexion
        socket.emit("exituser", uname);
        // Masque l'écran de chat
        app.querySelector(".chat-screen").classList.remove("active");
        // Affiche l'écran de connexion
        app.querySelector(".join-screen").classList.add("active");
        // Réinitialise le nom d'utilisateur
        uname = "";
    });

    // Fonction d’affichage des messages
    function renderMessage(type, message) {
        // Sélectionne le conteneur de messages dans l'interface de chat
        let messageContainer = app.querySelector(".chat-screen .messages");
        // Si le message est envoyé par l'utilisateur lui-même
        if (type === "my") {
            // Crée un nouvel élément de message pour "my message"
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            // Définit le contenu HTML du message
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            // Ajoute le message au conteneur
            messageContainer.appendChild(el);
        } 
        // Si le message vient d'un autre utilisateur
        else if (type === "other") {
            // Crée un nouvel élément de message pour "other message"
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            // Définit le contenu HTML du message
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            // Ajoute le message au conteneur appendChild est une méthode en JavaScript qui permet d’ajouter un élément enfant à un élément parent dans le DOM
            messageContainer.appendChild(el);
        } 
        // Si le message est une notification de mise à jour (comme une entrée ou une sortie)
        else if (type === "update") {
            // Crée un élément de mise à jour
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            // Définit le texte de la mise à jour
            el.innerText = message;
            // Ajoute la mise à jour au conteneur
            messageContainer.appendChild(el);
        }
        // Fait défiler la zone de messages pour afficher le dernier message
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    // Réception des messages des autres utilisateurs
    socket.on("update", function (update) {
        // Appelle renderMessage pour afficher la mise à jour dans le chat
        renderMessage("update", update);
    });

    // Réception des messages de chat des autres utilisateurs
    socket.on("chat", function (message) {
        // Appelle renderMessage pour afficher le message d'un autre utilisateur
        renderMessage("other", message);
    });
})();
