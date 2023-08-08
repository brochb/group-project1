var myHeaders = new Headers();
myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

var searchButton = document.getElementById("search-button")

searchButton.addEventListener("click", function () {
    var queryInput = document.getElementById("query-input").value;
    var queryCategory = document.getElementById("queryCategory").value;

    if (queryInput.trim() !== "") {
        // Modify the apiUrl to include the selected queryCategory
        var apiUrl = 'https://book-finder1.p.rapidapi.com/api/search?book_type=' + queryInput + '&' + queryCategory + '&page=1&results_per_page=100';

        console.log(apiUrl)

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
