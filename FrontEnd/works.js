// Fetches works data from API
async function fetchData() {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error('La requête a échoué'); // Throws an error if request fails
    }

    const data = await response.json();

    console.log(data); // Display data in console

    return data; // Return fetched data

  } catch (error) { // Catch any error
    console.error('Erreur pendant la requête fetch :', error);
  }
}

// Create HTML elements
function createGallery(works) {
  const galleryElement = document.querySelector('.gallery'); // Get gallery element

  for (let i = 0; i < works.length; i++) {
    const project = works[i];

    const figureElement = document.createElement("figure"); // Create a figure element for each project

    const imageElement = document.createElement("img"); // Create an image element for each project
    imageElement.src = project.imageUrl;

    const titleElement = document.createElement("figcaption"); // Create a figcaption element for each project
    titleElement.innerHTML = project.title;

    // Attach child elements to the figure element
    figureElement.appendChild(imageElement);
    figureElement.appendChild(titleElement);

    // Attach the figure element to the gallery element
    galleryElement.appendChild(figureElement);
  }
}

// Create filter buttons
function createFilters(categoriesNames) {
  const divElementButtons = document.querySelector(".filters");

  // Clear existing content of the filters buttons container
  divElementButtons.innerHTML = "";

  // Create the "All" button
  const buttonElementAll = document.createElement("button");
  buttonElementAll.classList.add("button_all_categories");
  buttonElementAll.innerText = "Tous";
  divElementButtons.appendChild(buttonElementAll);

  // Create a Set to store unique category names
  const uniqueCategories = new Set(categoriesNames);

  // Define the category names
  uniqueCategories.forEach(categoryName => {
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("button_categories");
    buttonElement.value = categoryName; // Set the button value as the category name
    buttonElement.innerText = categoryName; // Set the button text as the category name
    divElementButtons.appendChild(buttonElement);
  });
}

// Manage filters
async function manageFilters(works, categoriesNames) {
  const displayAll = document.querySelector(".button_all_categories");
  displayAll.addEventListener("click", () => {
    document.querySelector(".gallery").innerHTML = "";
    createGallery(works);
  });

  const divElementButtons = document.querySelector(".filters");
  divElementButtons.addEventListener("click", async (event) => {
    if (event.target.classList.contains("button_categories")) {
      const categoryName = event.target.value.trim().toLowerCase();
      console.log("Catégorie sélectionnée :", categoryName);

      let choosenCategory;
      if (categoryName === "tous") {
        choosenCategory = works; // Show all works if "Tous" button is clicked
      } else {
        // Filter works based on category name
        choosenCategory = works.filter(work => work.category.name.trim().toLowerCase() === categoryName);
      }
      
      console.log("Projets de la catégorie sélectionnée :", choosenCategory);

      document.querySelector(".gallery").innerHTML = ""; // Clear the gallery
      createGallery(choosenCategory); // Create the gallery with filtered data
    }
  });
}



// Initialize the gallery
async function initGallery() {
  const worksData = await fetchData(); // Wait for the data to be fetched
  if (worksData) {
    // Extract category names from works data
    const categoriesNames = worksData.map(work => work.category.name);

    createGallery(worksData); // Create the gallery with the fetched data
    createFilters(categoriesNames); // Create the filter buttons
    manageFilters(worksData, categoriesNames); // Manage the filters
  }
}

// Initialize the gallery
initGallery(); // Initialize the gallery
