// Fetches works data from API
async function fetchData() {
    try {
        const response = await fetch("http://localhost:5678/api/works");

        if (!response.ok) {
            throw new Error('La requête a échoué');
        }

        const data = await response.json();

        console.log(data); // Display the data in the console

        return data; // Return the fetched data

    } catch (error) { // Catch any error

        console.error('Erreur pendant la requête fetch :', error);
    }
}

// Create the HTML elements
function createGallery(works) {
    

    for (let i = 0; i < works.length; i++) {
        const project = works[i];


        const galleryElement = document.querySelector('.gallery'); // Get the gallery element

        const figureElement = document.createElement("figure"); // Create a figure element for every project

        const imageElement = document.createElement("img"); // Create an image element for every project
        imageElement.src = project.imageUrl;

        const titleElement = document.createElement("figcaption"); // Create a figcaption element for every project
        titleElement.innerHTML = project.title;

        // Attach child elements to the figure element
        figureElement.appendChild(imageElement);
        figureElement.appendChild(titleElement);

        // Attach the figure element to the gallery element
        galleryElement.appendChild(figureElement);
    }
}

// Fetch data and create the gallery
async function initGallery() {
    const worksData = await fetchData(); // Wait for the data to be fetched
    if (worksData) {
        createGallery(worksData); // Create the gallery with the fetched data
    }
};

// Getting categories via the API
fetch("http://localhost:5678/api/categories")
  .then(response => {
// Checks if the server response is successful
    if (!response.ok) {
// If the response is not successful, throws an error
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

// Filters

initGallery(); // Initialize the gallery

