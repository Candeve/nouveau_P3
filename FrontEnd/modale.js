document.addEventListener("DOMContentLoaded", () => {
    updateLoginButton();
});

function updateLoginButton() {
    const token = localStorage.getItem('token');
    const loginButton = document.querySelector('#login_bold');
    
    if (token) {
        loginButton.textContent = "Logout";
        loginButton.href = "#";
        loginButton.addEventListener("click", logout);
    } else {
        loginButton.textContent = "Login";
        loginButton.href = "login.html";
        loginButton.removeEventListener("click", logout);
    }
}

function logout(event) {
    event.preventDefault();  // Empêche le comportement par défaut du lien
    console.log("Logout initiated");  // Ajoutez ce log pour vérifier que la fonction est appelée

    localStorage.removeItem('token');
    console.log("Token removed from localStorage");  // Vérifiez que le token est bien supprimé

    updateLoginButton();

    // Utilisez setTimeout pour éviter un éventuel problème de redirection trop rapide
    setTimeout(() => {
        document.location.href = "index.html";
    }, 100);  // Un délai court pour s'assurer que tout est bien pris en compte avant la redirection
}
