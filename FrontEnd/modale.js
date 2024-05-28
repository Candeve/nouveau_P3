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

    const modal = document.getElementById("edit-modal");
    const span = document.getElementsByClassName("close")[0];

    const galleryView = document.getElementById("gallery-view");
    const addPhotoView = document.getElementById("add-photo-view");

    editButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        modal.style.display = "block";
        galleryView.style.display = "block";
        addPhotoView.style.display = "none";
        await populateModalGallery();
        addSeparatorAfterImages();
    });

    span.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        resetPhotoUploadContainer();
        modal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            event.preventDefault();
            event.stopPropagation();
            resetPhotoUploadContainer();
            modal.style.display = "none";
        }
    });

    const addPhotoButton = document.getElementById("add-photo-button");
    addPhotoButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        galleryView.style.display = "none";
        addPhotoView.style.display = "block";
        await populateCategoryOptions();
        addSeparatorAfterCategory();
    });

    const backToGalleryButton = document.getElementById("back-to-gallery");
    backToGalleryButton.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        resetPhotoUploadContainer();
        galleryView.style.display = "block";
        addPhotoView.style.display = "none";
    });

    const photoUploadContainer = document.getElementById("photo-upload-container");
    const photoFileInput = document.getElementById("photo-file");

    photoUploadContainer.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        photoFileInput.click();
    });

    photoFileInput.addEventListener("change", (event) => {
        displaySelectedImage(event);
    });

    const addPhotoForm = document.getElementById("add-photo-form");
    addPhotoForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        await handleAddPhoto();
    });
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
    event.stopPropagation();
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

async function fetchData(endpoint) {
    try {
        const response = await fetch(`http://localhost:5678/api/${endpoint}`);

        if (!response.ok) {
            throw new Error('La requête a échoué');
        }

        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error('Erreur pendant la requête fetch :', error);
    }
}

async function deleteWork(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('La suppression a échoué');
        }

        return response.ok;

    } catch (error) {
        console.error('Erreur pendant la requête DELETE :', error);
        return false;
    }
}

async function populateModalGallery() {
    const worksData = await fetchData('works');
    if (worksData) {
        const modalGalleryElement = document.querySelector('.modal-gallery');
        modalGalleryElement.innerHTML = '';

        worksData.forEach(project => {
            const figureElement = document.createElement("figure");
            figureElement.classList.add("figure-modal");
            figureElement.dataset.id = project.id;

            const imageElement = document.createElement("img");
            imageElement.src = project.imageUrl;

            const deleteIcon = document.createElement("i");
            deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");

            deleteIcon.addEventListener("click", async (event) => {
                event.preventDefault();
                event.stopPropagation();
                const success = await deleteWork(project.id);
                if (success) {
                    figureElement.remove();
                    removePhotoFromMainGallery(project.id);
                }
            });

            figureElement.appendChild(imageElement);
            figureElement.appendChild(deleteIcon);
            modalGalleryElement.appendChild(figureElement);
        });
    }
}

async function populateCategoryOptions() {
    const categoriesData = await fetchData('categories');
    const categorySelect = document.getElementById("photo-category");
    categorySelect.innerHTML = ""; // Clear existing options

    categoriesData.forEach(category => {
        const option = document.createElement("option");
        option.value = category.id; // Use the category ID for the value
        option.textContent = category.name; // Use the category name for the display text
        categorySelect.appendChild(option);
    });
}

async function handleAddPhoto() {
    const title = document.getElementById("photo-title").value;
    const category = document.getElementById("photo-category").value;
    const fileInput = document.getElementById("photo-file");
    const file = fileInput.files[0];

    if (!title || !category || !file) {
        alert("Tous les champs sont obligatoires.");
        return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", file);

    try {
        const token = localStorage.getItem('token');
        const response = await fetch("http://localhost:5678/api/works", {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error('La requête d\'ajout a échoué');
        }

        const newWork = await response.json();
        console.log(newWork);

        addPhotoToModalGallery(newWork);
        addPhotoToMainGallery(newWork);

        document.getElementById("gallery-view").style.display = "block";
        document.getElementById("add-photo-view").style.display = "none";
        resetPhotoUploadContainer();
    } catch (error) {
        console.error('Erreur pendant la requête d\'ajout :', error);
    }
}

function addPhotoToModalGallery(work) {
    const modalGalleryElement = document.querySelector('.modal-gallery');
    const figureElement = document.createElement("figure");
    figureElement.classList.add("figure-modal");
    figureElement.dataset.id = work.id;

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;

    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fa-solid", "fa-trash-can", "delete-icon");

    deleteIcon.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();
        const success = await deleteWork(work.id);
        if (success) {
            figureElement.remove();
            removePhotoFromMainGallery(work.id);
        }
    });

    figureElement.appendChild(imageElement);
    figureElement.appendChild(deleteIcon);
    modalGalleryElement.appendChild(figureElement);
}

function addPhotoToMainGallery(work) {
    const mainGalleryElement = document.querySelector('.gallery');
    const figureElement = document.createElement("figure");
    figureElement.dataset.id = work.id;

    const imageElement = document.createElement("img");
    imageElement.src = work.imageUrl;

    const titleElement = document.createElement("figcaption");
    titleElement.textContent = work.title;

    figureElement.appendChild(imageElement);
    figureElement.appendChild(titleElement);
    mainGalleryElement.appendChild(figureElement);
}

function removePhotoFromMainGallery(id) {
    const mainGallery = document.querySelector('.gallery');
    const figures = mainGallery.getElementsByTagName('figure');
    for (let i = 0; i < figures.length; i++) {
        if (figures[i].dataset.id === String(id)) {
            figures[i].remove();
            break;
        }
    }
}

function displaySelectedImage(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement("img");
            imgElement.src = e.target.result;
            imgElement.classList.add("uploaded-photo");

            const photoUploadContainer = document.getElementById("photo-upload-container");
            photoUploadContainer.innerHTML = "";
            photoUploadContainer.appendChild(imgElement);
        }
        reader.readAsDataURL(file);
    }
}

function resetPhotoUploadContainer() {
    const photoUploadContainer = document.getElementById("photo-upload-container");
    photoUploadContainer.innerHTML = `
        <i class="fa-regular fa-image"></i>
        <p id="police-color">+ Ajouter photo</p>
        <p>jpg, png : 4mo max.</p>
    `;
    const photoFileInput = document.getElementById("photo-file");
    photoFileInput.value = ""; // Reset the file input value
}

// Ajoutez cette fonction pour créer une barre de séparation avec une classe spécifique
function createSeparator(className) {
    const separator = document.createElement('div');
    separator.classList.add(className);
    return separator;
}

// Ajoutez des barres de séparation après les images de la modale
function addSeparatorAfterImages() {
    const modalGalleryElement = document.querySelector('.modal-gallery');
    const existingSeparator = modalGalleryElement.parentNode.querySelector('.separator1');
    if (!existingSeparator) {
        const separator = createSeparator('separator1');
        modalGalleryElement.parentNode.insertBefore(separator, modalGalleryElement.nextSibling);
    }
}

// Ajoutez des barres de séparation après la catégorie dans le formulaire
function addSeparatorAfterCategory() {
    const categorySelect = document.getElementById("photo-category");
    const existingSeparator = categorySelect.parentNode.querySelector('.separator2');
    if (!existingSeparator) {
        const separator = createSeparator('separator2');
        categorySelect.parentNode.insertBefore(separator, categorySelect.nextSibling);
    }
}
