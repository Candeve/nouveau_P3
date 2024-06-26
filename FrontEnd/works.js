let worksData = []; // Déclare une variable pour stocker les travaux

// Récupère les données des travaux depuis l'API
async function fetchData() {
    try {
        const response = await fetch("http://localhost:5678/api/works"); // Envoie une requête à l'API

        if (!response.ok) {
            throw new Error('La requête a échoué'); // Lance une erreur si la requête échoue
        }

        const data = await response.json(); // Transforme la réponse en JSON
        console.log(data);
        worksData = data; // Stocke les travaux dans la variable globale
        return data; // Retourne les données

    } catch (error) {
        console.error('Erreur pendant la requête fetch :', error);
    }
}

// Crée les éléments HTML pour la galerie
function createGallery(works) {
    const galleryElement = document.querySelector('.gallery'); // Sélectionne l'élément de la galerie
    galleryElement.innerHTML = ''; // Vide l'élément

    works.forEach(project => {
        const figureElement = document.createElement("figure");
        figureElement.dataset.id = project.id; // Définit l'ID du projet

        const imageElement = document.createElement("img");
        imageElement.src = project.imageUrl; // Définit la source de l'image

        const titleElement = document.createElement("figcaption");
        titleElement.innerHTML = project.title; // Définit le titre de la photo

        figureElement.appendChild(imageElement);
        figureElement.appendChild(titleElement);
        galleryElement.appendChild(figureElement); // Ajoute l'élément figure à la galerie
    });
}

// Crée les boutons de filtre
function createFilters(categoriesNames) {
    const divElementButtons = document.querySelector(".filters"); // Sélectionne l'élément des filtres
    divElementButtons.innerHTML = ""; // Vide l'élément

    const buttonElementAll = document.createElement("button");
    buttonElementAll.classList.add("button_all_categories");
    buttonElementAll.innerText = "Tous"; // Crée un bouton pour toutes les catégories
    divElementButtons.appendChild(buttonElementAll);

    const uniqueCategories = new Set(categoriesNames); // Supprime les doublons des noms de catégories

    uniqueCategories.forEach(categoryName => {
        const buttonElement = document.createElement("button");
        buttonElement.classList.add("button_categories");
        buttonElement.value = categoryName;
        buttonElement.innerText = categoryName; // Crée un bouton pour chaque catégorie
        divElementButtons.appendChild(buttonElement);
    });
}

// Gère les filtres
async function manageFilters() {
    const displayAll = document.querySelector(".button_all_categories");
    displayAll.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        createGallery(worksData); // Affiche tous les projets
        setActiveButton(displayAll); // Définit le bouton actif
    });

    const divElementButtons = document.querySelector(".filters");
    divElementButtons.addEventListener("click", async (event) => {
        if (event.target.classList.contains("button_categories")) {
            event.preventDefault();
            event.stopPropagation();
            const categoryName = event.target.value.trim().toLowerCase();
            let choosenCategory;
            if (categoryName === "tous") {
                choosenCategory = worksData; // Affiche tous les projets
            } else {
                choosenCategory = worksData.filter(work => work.category.name.trim().toLowerCase() === categoryName); // Filtre les projets par catégorie
            }
            createGallery(choosenCategory); // Affiche les projets filtrés
            setActiveButton(event.target); // Définit le bouton actif
        }
    });
}

// Définit le bouton actif
function setActiveButton(button) {
    const buttons = document.querySelectorAll('.button_categories, .button_all_categories');
    buttons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
}

// Initialise la galerie
async function initGallery() {
    await fetchData(); // Récupère les données des travaux
    const categoriesNames = worksData.map(work => work.category.name); // Récupère les noms des catégories
    createGallery(worksData); // Crée la galerie avec les travaux
    createFilters(categoriesNames); // Crée les filtres
    manageFilters(); // Gère les filtres
}

// Appelle la fonction pour initialiser la galerie
initGallery();
