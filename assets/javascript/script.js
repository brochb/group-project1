var myHeaders = new Headers();
myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

// var searchContainer = document.getElementById("search-container")
// var regionSearch = document.getElementById("text-box-1")
// var ingredientsSearch = document.getElementById("text-box-2")
var searchButton = document.getElementById("search-button")

searchButton.addEventListener("click", function () {
    var queryInput = document.getElementById("query-input").value;
    if (queryInput.trim() !== "") {

        var apiUrl = 'https://book-finder1.p.rapidapi.com/api/search?book_type=' + queryInput;

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(apiUrl, requestOptions)
            .then(response => response.json())
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
    } else {
        // In case the input is empty
        console.log("Please enter a valid search query.");
    }
});
