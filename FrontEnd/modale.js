// modale.js

document.addEventListener("DOMContentLoaded", () => {
    updateLoginButton();
});

function updateLoginButton() {
    const token = sessionStorage.getItem('token');
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

function logout() {
    sessionStorage.removeItem('token');
    updateLoginButton();
    document.location.href = "index.html";
}
