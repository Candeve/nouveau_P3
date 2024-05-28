document.addEventListener("DOMContentLoaded", () => {
    updateLoginButton(); // Met à jour le bouton de connexion
    setLoginButtonStyle(); // Définit le style du bouton de connexion

    const token = localStorage.getItem('token'); // Récupère le token depuis le local storage
    const editModeBar = document.getElementById("edit-mode-bar"); // Barre de mode édition
    const editButton = document.getElementById("edit-button"); // Bouton d'édition

    if (token) {
        editModeBar.style.display = "block"; // Affiche la barre de mode édition si l'utilisateur est connecté
        editButton.style.display = "inline-block"; // Affiche le bouton d'édition si l'utilisateur est connecté
    } else {
        editModeBar.style.display = "none"; // Cache la barre de mode édition si l'utilisateur n'est pas connecté
        editButton.style.display = "none"; // Cache le bouton d'édition si l'utilisateur n'est pas connecté
    }

    const modal = document.getElementById("edit-modal"); // Modale d'édition
    const span = document.getElementsByClassName("close")[0]; // Bouton de fermeture de la modale

    const galleryView = document.getElementById("gallery-view"); // Vue de la galerie
    const addPhotoView = document.getElementById("add-photo-view"); // Vue d'ajout de photo

    editButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        modal.style.display = "block"; // Affiche la modale
        galleryView.style.display = "block"; // Affiche la vue de la galerie
        addPhotoView.style.display = "none"; // Cache la vue d'ajout de photo
        await populateModalGallery(); // Remplit la galerie de la modale
        addSeparatorAfterImages(); // Ajoute des séparateurs après les images
    });

    span.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        resetPhotoUploadContainer(); // Réinitialise le conteneur d'ajout de photo
        modal.style.display = "none"; // Cache la modale
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            event.preventDefault();
            event.stopPropagation();
            resetPhotoUploadContainer(); // Réinitialise le conteneur d'ajout de photo
            modal.style.display = "none"; // Cache la modale
        }
    });

    const addPhotoButton = document.getElementById("add-photo-button");
    addPhotoButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        galleryView.style.display = "none"; // Cache la vue de la galerie
        addPhotoView.style.display = "block"; // Affiche la vue d'ajout de photo
        await populateCategoryOptions(); // Remplit les options de catégorie
        addSeparatorAfterCategory(); // Ajoute des séparateurs après les catégories
    });

    const backToGalleryButton = document.getElementById("back-to-gallery");
    backToGalleryButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        resetPhotoUploadContainer(); // Réinitialise le conteneur d'ajout de photo
        galleryView.style.display = "block"; // Affiche la vue de la galerie
        addPhotoView.style.display = "none"; // Cache la vue d'ajout de photo
    });

    const photoUploadContainer = document.getElementById("photo-upload-container");
    const photoFileInput = document.getElementById("photo-file");

    photoUploadContainer.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        photoFileInput.click(); // Simule un clic sur le champ de fichier
    });

    photoFileInput.addEventListener("change", (event) => {
        displaySelectedImage(event); // Affiche l'image sélectionnée
    });

    const addPhotoForm = document.getElementById("add-photo-form");
    addPhotoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await handleAddPhoto(); // Gère l'ajout de photo
    });
});

function updateLoginButton() {
    const token = localStorage.getItem('token'); // Récupère le token depuis le local storage
    const loginButton = document.querySelector('#login_bold'); // Sélectionne le bouton de connexion

    if (token) {
        loginButton.textContent = "Logout"; // Change le texte du bouton en "Logout" si l'utilisateur est connecté
        loginButton.href = "#"; // Change le lien du bouton
        loginButton.addEventListener("click", logout); // Ajoute un écouteur d'événement pour la déconnexion
    } else {
        loginButton.textContent = "Login"; // Change le texte du bouton en "Login" si l'utilisateur n'est pas connecté
        loginButton.href = "login.html"; // Change le lien du bouton
        loginButton.removeEventListener("click", logout); // Retire l'écouteur d'événement pour la déconnexion
    }
}

function logout(event) {
    event.preventDefault();
    event.stopPropagation();
    console.log("Logout initiated");

    localStorage.removeItem('token'); // Supprime le token du local storage
    console.log("Token removed from localStorage");

    updateLoginButton(); // Met à jour le bouton de connexion

    setTimeout(() => {
        document.location.href = "index.html"; // Redirige vers la page d'accueil après un court délai
    }, 100);
}

function setLoginButtonStyle() {
    const loginButton = document.querySelector('#login_bold'); // Sélectionne le bouton de connexion
    const currentPath = window.location.pathname; // Récupère le chemin actuel

    if (currentPath.includes('login.html')) {
        loginButton.classList.add('bold'); // Ajoute une classe pour mettre en gras si on est sur la page de connexion
    } else {
        loginButton.classList.remove('bold'); // Retire la classe sinon
    }
}

async function fetchData(endpoint) {
    try {
        const response = await fetch(`http://localhost:5678/api/${endpoint}`); // Envoie une requête à l'API

        if (!response.ok) {
            throw new Error('La requête a échoué'); // Lance une erreur si la requête échoue
        }

        const data = await response.json(); // Transforme la réponse en JSON
        console.log(data);
        return data; // Retourne les données

    } catch (error) {
        console.error('Erreur pendant la requête fetch :', error);
    }
}

async function deleteWork(id) {
    try {
        const token = localStorage.getItem('token'); // Récupère le token depuis le local storage
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE', // Méthode DELETE pour supprimer une ressource
            headers: {
                'Authorization': `Bearer ${token}` // Ajoute le token d'autorisation dans l'en-tête
            }
        });

        if (!response.ok) {
            throw new Error('La suppression a échoué'); // Lance une erreur si la suppression échoue
        }

        return response.ok; // Retourne true si la suppression a réussi

    } catch (error) {
        console.error('Erreur pendant la requête DELETE :', error);
        return false;
    }
}

async function populateModalGallery() {
    const worksData = await fetchData('works'); // Récupère les données des travaux
    if (worksData) {
        const modalGalleryElement = document.querySelector('.modal-gallery'); // Sélectionne l'élément de la galerie modale
        modalGalleryElement.innerHTML = ''; // Vide l'élément

        worksData.forEach(project => {
            const figureElement = document.createElement("figure");
            figureElement.classList.add("figure-modal");
            figureElement.dataset.id = project.id; // Définit l'ID du projet

            const imageElement = document.createElement("img");
            imageElement.src = project.imageUrl; // Définit la source de l'image

            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon"); // Icône de suppression

            deleteIcon.addEventListener("click", async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const success = await deleteWork(project.id); // Supprime le travail
                if (success) {
                    figureElement.remove(); // Retire l'élément de la galerie modale
                    removePhotoFromMainGallery(project.id); // Retire l'élément de la galerie principale
                }
            });

            figureElement.appendChild(imageElement);
            figureElement.appendChild(deleteIcon);
            modalGalleryElement.appendChild(figureElement);
        });
    }
}

async function populateCategoryOptions() {
    const categoriesData = await fetchData('categories'); // Récupère les données des catégories
    const categorySelect = document.getElementById("photo-category"); // Sélectionne l'élément de sélection de catégorie
    categorySelect.innerHTML = ""; // Vide l'élément

    categoriesData.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id; // Utilise l'ID de la catégorie comme valeur
        option.textContent = category.name; // Utilise le nom de la catégorie comme texte
        categorySelect.appendChild(option);
    });
}

async function handleAddPhoto() {
    const title = document.getElementById("photo-title").value; // Récupère le titre de la photo
    const category = document.getElementById("photo-category").value; // Récupère la catégorie de la photo
    const fileInput = document.getElementById("photo-file");
    const file = fileInput.files[0]; // Récupère le fichier de la photo

    if (!title || !category || !file) {
        alert("Tous les champs sont obligatoires."); // Alerte si des champs sont manquants
        return;
    }

    const formData = new FormData(); // Crée un nouvel objet FormData
    formData.append("title", title); // Ajoute le titre
    formData.append("category", category); // Ajoute la catégorie
    formData.append("image", file); // Ajoute l'image

    try {
        const token = localStorage.getItem('token'); // Récupère le token depuis le local storage
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST', // Méthode POST pour ajouter une ressource
            headers: {
                'Authorization': `Bearer ${token}` // Ajoute le token d'autorisation dans l'en-tête
            },
            body: formData // Ajoute le formulaire de données
        });

        if (!response.ok) {
            throw new Error('La requête d\'ajout a échoué'); // Lance une erreur si la requête échoue
        }

        const newWork = await response.json(); // Transforme la réponse en JSON
        console.log(newWork);

        addPhotoToModalGallery(newWork); // Ajoute la photo à la galerie modale
        addPhotoToMainGallery(newWork); // Ajoute la photo à la galerie principale

        document.getElementById("gallery-view").style.display = "block"; // Affiche la vue de la galerie
        document.getElementById("add-photo-view").style.display = "none"; // Cache la vue d'ajout de photo
        resetPhotoUploadContainer(); // Réinitialise le conteneur d'ajout de photo
    } catch (error) {
        console.error('Erreur pendant la requête d\'ajout :', error);
    }
}

function addPhotoToModalGallery(work) {
    const modalGalleryElement = document.querySelector('.modal-gallery'); // Sélectionne l'élément de la galerie modale
    const figureElement = document.createElement("figure");
    figureElement.classList.add("figure-modal");
    figureElement.dataset.id = work.id; // Définit l'ID du projet

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl; // Définit la source de l'image

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon"); // Icône de suppression

    deleteIcon.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const success = await deleteWork(work.id); // Supprime le travail
        if (success) {
            figureElement.remove(); // Retire l'élément de la galerie modale
            removePhotoFromMainGallery(work.id); // Retire l'élément de la galerie principale
        }
    });

    figureElement.appendChild(imageElement);
    figureElement.appendChild(deleteIcon);
    modalGalleryElement.appendChild(figureElement);
}

function addPhotoToMainGallery(work) {
    const mainGalleryElement = document.querySelector('.gallery'); // Sélectionne l'élément de la galerie principale
    const figureElement = document.createElement("figure");
    figureElement.dataset.id = work.id; // Définit l'ID du projet

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl; // Définit la source de l'image

    const titleElement = document.createElement("figcaption");
    titleElement.textContent = work.title; // Définit le titre de la photo

    figureElement.appendChild(imageElement);
    figureElement.appendChild(titleElement);
    mainGalleryElement.appendChild(figureElement);
}

function removePhotoFromMainGallery(id) {
    const mainGallery = document.querySelector('.gallery'); // Sélectionne l'élément de la galerie principale
    const figures = mainGallery.getElementsByTagName('figure'); // Récupère tous les éléments figure
    for (let i = 0; i < figures.length; i++) {
        if (figures[i].dataset.id === String(id)) { // Si l'ID correspond
            figures[i].remove(); // Supprime l'élément
            break;
        }
    }
}

function displaySelectedImage(event) {
    const file = event.target.files[0]; // Récupère le fichier sélectionné
    if (file) {
        const reader = new FileReader(); // Crée un nouvel objet FileReader
        reader.onload = function(e) {
            const imgElement = document.createElement("img");
            imgElement.src = e.target.result; // Définit la source de l'image
            imgElement.classList.add("uploaded-photo");

            const photoUploadContainer = document.getElementById("photo-upload-container");
            photoUploadContainer.innerHTML = ""; // Vide le conteneur
            photoUploadContainer.appendChild(imgElement); // Ajoute l'image au conteneur
        }
        reader.readAsDataURL(file); // Lit le fichier comme une URL de données
    }
}

function resetPhotoUploadContainer() {
    const photoUploadContainer = document.getElementById("photo-upload-container"); // Sélectionne le conteneur d'ajout de photo
    photoUploadContainer.innerHTML = `
        <i class="fa-regular fa-image"></i>
        <p id="police-color">+ Ajouter photo</p>
        <p>jpg, png : 4mo max.</p>
    `;
    const photoFileInput = document.getElementById("photo-file");
    photoFileInput.value = ""; // Réinitialise la valeur du champ de fichier
}

// Ajoute cette fonction pour créer une barre de séparation avec une classe spécifique
function createSeparator(className) {
    const separator = document.createElement('div'); // Crée un nouvel élément div
    separator.classList.add(className); // Ajoute une classe à l'élément
    return separator;
}

// Ajoute des barres de séparation après les images de la modale
function addSeparatorAfterImages() {
    const modalGalleryElement = document.querySelector('.modal-gallery'); // Sélectionne l'élément de la galerie modale
    const existingSeparator = modalGalleryElement.parentNode.querySelector('.separator1');
    if (!existingSeparator) {
        const separator = createSeparator('separator1'); // Crée une nouvelle barre de séparation
        modalGalleryElement.parentNode.insertBefore(separator, modalGalleryElement.nextSibling); // Insère la barre de séparation après la galerie modale
    }
}

// Ajoute des barres de séparation après la catégorie dans le formulaire
function addSeparatorAfterCategory() {
    const categorySelect = document.getElementById("photo-category"); // Sélectionne l'élément de sélection de catégorie
    const existingSeparator = categorySelect.parentNode.querySelector('.separator2');
    if (!existingSeparator) {
        const separator = createSeparator('separator2'); // Crée une nouvelle barre de séparation
        categorySelect.parentNode.insertBefore(separator, categorySelect.nextSibling); // Insère la barre de séparation après la sélection de catégorie
    }
}
