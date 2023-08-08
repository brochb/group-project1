var myHeaders = new Headers();
myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

// var searchContainer = document.getElementById("search-container")
// var regionSearch = document.getElementById("text-box-1")
var searchButton = document.getElementById("search-button")

// Function to get the user's location using the Geolocation API
function getUserLocationAndSearch() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

// Success callback when the user's location is retrieved
function successCallback(position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    // Now you have the latitude and longitude, you can make API requests using these coordinates

    // Make API call to OpenWeatherMap
    var weatherApiKey = 'b678393f509aecf946ac94ef01ec609e'; // Replace with your OpenWeatherMap API key
    var weatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=' + weatherApiKey;

    fetch(weatherApiUrl)
        .then(response => response.json())
        .then(weatherData => {
            // Save the weather data in session storage
            sessionStorage.setItem('weatherData', JSON.stringify(weatherData));

            // Redirect to the results page
            window.location.href = "results.html";
        })
        .catch(error => console.log('Error fetching weather data:', error));

    // Make API call to Book Finder API
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
}

// Error callback if geolocation fails
function errorCallback(error) {
    console.log('Error getting user location:', error.message);
}

searchButton.addEventListener("click", function () {
    // Get the user's location before making the search
    getUserLocationAndSearch();
});

var history = document.getElementById("history")
var historyList = document.getElementById("history-list")


