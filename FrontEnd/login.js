const formLogin = document.querySelector("form"); // Sélectionne le formulaire de connexion

// Ajoute un écouteur d'événement pour le formulaire lors de sa soumission
formLogin.addEventListener("submit", (e) => {
    e.preventDefault(); // Empêche le comportement par défaut du formulaire (rechargement de la page)
    login(); // Appelle la fonction login
});

async function login() {
    // Récupération de l'email et du mot de passe saisis par l'utilisateur
    const emailLogin = document.getElementById("email").value;
    const passwordLogin = document.getElementById("password").value;
  
    // Crée un objet utilisateur avec les données saisies
    const user = {
        email: emailLogin,
        password: passwordLogin,
    };
  
    try {
        // Tentative de connexion en envoyant les données utilisateur au serveur
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(user), // Convertit l'objet utilisateur en JSON
        });

        // Vérification de la réponse du serveur
        if (response.ok) {
            const data = await response.json();
            const userdata = data.token;

            // Stockage du token dans le local storage du navigateur
            localStorage.setItem('token', userdata);
            
            // Ajout du console.log pour vérifier le stockage du token
            console.log('Token stocké dans localStorage:', localStorage.getItem('token'));

            // Redirection vers la page d'accueil
            document.location.href = "index.html";

        } else {
            // Si la réponse du serveur n'est pas réussie, affichage d'un message d'erreur
            document.querySelector(".error").innerHTML = "Erreur dans l’identifiant ou le mot de passe";
        }
    } catch (error) {
        console.error("Erreur lors de la connexion :", error);
        // Gère les erreurs de connexion ici
        document.querySelector(".error").innerHTML = "Erreur dans la connexion, veuillez réessayer ultérieurement";
    }
}
