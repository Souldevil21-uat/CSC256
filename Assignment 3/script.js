// Global variables
let movies = [];           // Array to store movie titles
let popupWindow = null;    // Track pop-up window reference

/*
 * Add a movie to the list
 */
function addMovie() {
    const input = document.getElementById('movieInput');
    const movie = input.value.trim(); // Remove extra spaces

    if (movie) {
        movies.push(movie); // Add movie to array
        input.value = ""; // Clear input
        input.focus(); // Auto-focus input again
        alert(`"${movie}" added to the list!`);
    } else {
        alert("Please enter a movie title.");
    }
}

/*
 * Display the list on the same page
 */
function displayMovies() {
    let displayArea = document.getElementById('movieDisplay');
    displayArea.innerHTML = ""; // Clear previous content

    if (movies.length === 0) {
        displayArea.innerHTML = "<p>No movies in the list yet.</p>";
    } else {
        let listHTML = "<h3>Movie List:</h3>";
        movies.forEach(movie => {
            listHTML += `<p>${movie}</p>`;
        });
        displayArea.innerHTML = listHTML;
    }
}

/*
 * Display the list in a reusable pop-up window
 */
function displayMoviesPopup() {
    // If popup doesn't exist or is closed, open a new one
    if (!popupWindow || popupWindow.closed) {
        popupWindow = window.open("", "MovieListWindow", "width=400,height=400");
    }

    // Clear old content and write new HTML structure
    popupWindow.document.open();
    popupWindow.document.write("<!DOCTYPE html><html><head><title>Movie List</title>");
    popupWindow.document.write("<style>body { font-family: Arial; padding: 10px; }</style></head><body>");
    popupWindow.document.write("<h2>Movie List:</h2>");

    if (movies.length === 0) {
        popupWindow.document.write("<p>No movies in the list yet.</p>");
    } else {
        movies.forEach(movie => {
            popupWindow.document.write(`<p>${movie}</p>`);
        });
    }

    popupWindow.document.write("</body></html>");
    popupWindow.document.close();
}

/*
 * Reset the movie list
 */
function resetMovies() {
    movies = []; // Empty the array
    document.getElementById('movieDisplay').innerHTML = ""; // Clear page display
    alert("Movie list cleared!");

    // If popup is open, refresh it to show it's empty
    if (popupWindow && !popupWindow.closed) {
        displayMoviesPopup();
    }
}

/*
 * Extra feature: Press ENTER to add movie
 */
document.getElementById('movieInput').addEventListener('keypress', function(event) {
    if (event.key === "Enter") {
        addMovie();
    }
});


