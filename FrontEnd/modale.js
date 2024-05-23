document.addEventListener("DOMContentLoaded", () => {
    updateLoginButton();
    setLoginButtonStyle();

    const token = localStorage.getItem('token');
    const editModeBar = document.getElementById("edit-mode-bar");
    const editButton = document.getElementById("edit-button");

    if (token) {
        editModeBar.style.display = "block";
        editButton.style.display = "inline-block";
    } else {
        editModeBar.style.display = "none";
        editButton.style.display = "none";
    }

    // Modale logic
    const modal = document.getElementById("edit-modal");
    const span = document.getElementsByClassName("close")[0];

    editButton.onclick = function() {
        modal.style.display = "block";
    }

    span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
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
    event.preventDefault();
    console.log("Logout initiated");

    localStorage.removeItem('token');
    console.log("Token removed from localStorage");

    updateLoginButton();

    setTimeout(() => {
        document.location.href = "index.html";
    }, 100);
}

function setLoginButtonStyle() {
    const loginButton = document.querySelector('#login_bold');
    const currentPath = window.location.pathname;

    if (currentPath.includes('login.html')) {
        loginButton.classList.add('bold');
    } else {
        loginButton.classList.remove('bold');
    }
}
