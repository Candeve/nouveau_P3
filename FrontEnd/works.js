// Fetches works data from API
async function fetchData() {
    try {
        const response = await fetch("http://localhost:5678/api/works");

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

// Create HTML elements
function createGallery(works) {
    const galleryElement = document.querySelector('.gallery');
    galleryElement.innerHTML = ''; // Clear existing content

    works.forEach(project => {
        const figureElement = document.createElement("figure");
        figureElement.dataset.id = project.id; // Set dataset id to match the project id

        const imageElement = document.createElement("img");
        imageElement.src = project.imageUrl;

        const titleElement = document.createElement("figcaption");
        titleElement.innerHTML = project.title;

        figureElement.appendChild(imageElement);
        figureElement.appendChild(titleElement);
        galleryElement.appendChild(figureElement);
    });
}

// Create filter buttons
function createFilters(categoriesNames) {
    const divElementButtons = document.querySelector(".filters");
    divElementButtons.innerHTML = ""; // Clear existing content

    const buttonElementAll = document.createElement("button");
    buttonElementAll.classList.add("button_all_categories");
    buttonElementAll.innerText = "Tous";
    divElementButtons.appendChild(buttonElementAll);

    const uniqueCategories = new Set(categoriesNames);

    uniqueCategories.forEach(categoryName => {
        const buttonElement = document.createElement("button");
        buttonElement.classList.add("button_categories");
        buttonElement.value = categoryName;
        buttonElement.innerText = categoryName;
        divElementButtons.appendChild(buttonElement);
    });
}

// Manage filters
async function manageFilters(works, categoriesNames) {
    const displayAll = document.querySelector(".button_all_categories");
    displayAll.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        createGallery(works);
    });

    const divElementButtons = document.querySelector(".filters");
    divElementButtons.addEventListener("click", async (event) => {
        if (event.target.classList.contains("button_categories")) {
            event.preventDefault();
            event.stopPropagation();
            const categoryName = event.target.value.trim().toLowerCase();
            let choosenCategory;
            if (categoryName === "tous") {
                choosenCategory = works;
            } else {
                choosenCategory = works.filter(work => work.category.name.trim().toLowerCase() === categoryName);
            }
            createGallery(choosenCategory);
        }
    });
}

// Initialize the gallery
async function initGallery() {
    const worksData = await fetchData();
    if (worksData) {
        const categoriesNames = worksData.map(work => work.category.name);
        createGallery(worksData);
        createFilters(categoriesNames);
        manageFilters(worksData, categoriesNames);
    }
}

// Initialize the gallery
initGallery();
