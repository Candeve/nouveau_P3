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
function createFilters() {
  const divElementButtons = document.querySelector(".filters");

  // Clear existing content of the filters buttons container
  divElementButtons.innerHTML = "";

  // Create the "All" button
  const buttonElementAll = document.createElement("button");
  buttonElementAll.classList.add("button_all_categories");
  buttonElementAll.innerText = "Tous";
  divElementButtons.appendChild(buttonElementAll);

  // Define the category names
  const categoriesNames = ["Objets", "Appartements", "Hotels & Restaurants"];
  for (let i = 0; i < categoriesNames.length; i++) {
    const categoryName = categoriesNames[i];
    const buttonElement = document.createElement("button");
    buttonElement.classList.add("button_categories");
    buttonElement.value = categoryName; // Set the button value as the category name
    buttonElement.dataset.id = i
    buttonElement.innerText = categoryName; // Set the button text as the category name
    divElementButtons.appendChild(buttonElement);
  }
}

// Manage filters
function manageFilters(works) {
  const displayAll = document.querySelector(".button_all_categories");
  displayAll.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent page refresh
    document.querySelector(".gallery").innerHTML = "";
    createGallery(works);
  });

  const button_categories = document.querySelectorAll(".button_categories");
  button_categories.forEach(button => {
    button.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent page refresh
      const buttonCategoryOnClick = event.target.value.trim(); // Remove unnecessary spaces
      console.log("Catégorie sélectionnée :", buttonCategoryOnClick);

      // Use case-insensitive comparison for category names
      const choosenCategory = works.filter(work => work.category.name.trim().toLowerCase() === buttonCategoryOnClick.toLowerCase());
      console.log("Projets de la catégorie sélectionnée :", choosenCategory);

      document.querySelector(".gallery").innerHTML = ""; // Clear the gallery
      createGallery(choosenCategory); // Create the gallery with filtered data
    });
  });
}

// Initialize the gallery
async function initGallery() {
  const worksData = await fetchData(); // Wait for the data to be fetched
  if (worksData) {
    createGallery(worksData); // Create the gallery with the fetched data
    createFilters(); // Create the filter buttons
    manageFilters(worksData); // Manage the filters
  }
}

initGallery(); // Initialize the gallery
