var myHeaders = new Headers();
myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

// var searchContainer = document.getElementById("search-container")
// var regionSearch = document.getElementById("text-box-1")
// var ingredientsSearch = document.getElementById("text-box-2")
var searchButton = document.getElementById("search-button")

// // Get references to the dropdowns
// var genreDropdown = document.getElementById("query-input");
// var subGenreDropdown = document.createElement("select");
// subGenreDropdown.id = "sub-genre-input";

// // Function to populate the sub-genre dropdown based on the selected genre
// function populateSubGenreDropdown() {
//     var selectedGenre = genreDropdown.value;
//     subGenreDropdown.innerHTML = ""; // Clear previous options

//     if (selectedGenre === "Fiction") {
//         // Add options for fiction sub-genres
//         var fictionSubGenres = ["Horror", "Suspense", "Sci-Fi", "Fantasy"];
//         fictionSubGenres.forEach(function (subGenre) {
//             var option = document.createElement("option");
//             option.value = subGenre;
//             option.text = subGenre;
//             subGenreDropdown.appendChild(option);
//         });
//     } else if (selectedGenre === "Nonfiction") {
//         // Add options for nonfiction sub-genres
//         var nonfictionSubGenres = ["Science", "Math", "History", "Literature", "Philosophy"];
//         nonfictionSubGenres.forEach(function (subGenre) {
//             var option = document.createElement("option");
//             option.value = subGenre;
//             option.text = subGenre;
//             subGenreDropdown.appendChild(option);
//         });
//     }

//     // Append the sub-genre dropdown to the section
//     var searchContainer = document.getElementById("search-container");
//     searchContainer.appendChild(subGenreDropdown);
// }

// // Event listener for the genre dropdown
// genreDropdown.addEventListener("change", populateSubGenreDropdown);

searchButton.addEventListener("click", function () {
    var queryInput = document.getElementById("query-input").value;
    if (queryInput.trim() !== "") {

        var apiUrl = 'https://book-finder1.p.rapidapi.com/api/search?book_type=' + queryInput + '&page=1&results_per_page=25';

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(result => {
                // Save the results in the session storage before redirecting
                sessionStorage.setItem('searchResults', JSON.stringify(result));
                // Redirect to the results page
                window.location.href = "results.html";
            })
            .catch(error => console.log('error', error));
    } else {
        // In case the input is empty
        console.log("Please enter a valid search query.");
    }
});
