var apiUrl;
var myHeaders = new Headers();
myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

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
        })
        .catch(error => console.log('Error fetching weather data:', error));

    // Make API call to Book Finder API
    var queryInput = document.getElementById("query-input").value;
    var queryCategory = document.getElementById("queryCategory").value;

    if (queryInput.trim() !== "") {
        // Modify the apiUrl to include the selected queryCategory
        apiUrl = 'https://book-finder1.p.rapidapi.com/api/search?book_type=' + queryInput + '&' + queryCategory + '&page=1&results_per_page=100';

        // Store the apiUrl in session storage
        sessionStorage.setItem('apiUrl', apiUrl);

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
                window.location.href = "results.html?total_results=" + result.total_results + "&total_pages=" + result.total_pages;
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

function displaySelectedBooksFromLocalStorage() {
    var inventoryElement = document.getElementById("inventory");
    inventoryElement.innerHTML = ""; // Clear previous inventory

    var selectedBooksFromLocal = JSON.parse(localStorage.getItem('selectedBooks'));

    if (selectedBooksFromLocal && selectedBooksFromLocal.length > 0) {
        selectedBooksFromLocal.forEach(function (book) {
            // Create a container for each book
            var bookContainer = document.createElement("div");
            bookContainer.classList.add("book-container");

            var bookItem = document.createElement("li");
            bookItem.textContent = book.title;
            // Need to add the field that we would like to display and don't forget to append them below
            
             // Append the li element to the book container
            inventoryElement.appendChild(bookItem);
            // Append the book container to the inventory element
            inventoryElement.appendChild(bookContainer);
        });
    }
}

// Function on page load, pull the localStorage, and append it to the history
document.addEventListener('DOMContentLoaded', function () {
    const historyList = document.getElementById('history-list');
    const queryHistory = JSON.parse(localStorage.getItem('queryHistory')) || [];

    queryHistory.forEach(query => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = '#';
        // Convert query object properties to an array
        const queryArray = Object.values(query);
        link.textContent = queryArray.join(' ');

        link.addEventListener('click', function () {
            const [value1, value2, value3, value4] = queryArray;
            document.getElementById('query-input').value = value1;
            document.getElementById('queryCategory').value = value2;
            document.getElementById('author-first-name').value = value3;
            document.getElementById('author-last-name').value = value4;
        });

        listItem.appendChild(link);
        historyList.appendChild(listItem);

    });

    // Call the function to display selected books from sessionStorage on page load
    displaySelectedBooksFromLocalStorage();
});

searchButton.addEventListener('click', function () {
    // Get the user's location before making the search
    getUserLocationAndSearch();
    // Create variables for the user inputs
    const dropdown1 = document.getElementById('query-input');
    const dropdown2 = document.getElementById('queryCategory');
    const input1 = document.getElementById('author-first-name');
    const input2 = document.getElementById('author-last-name');

    // Set the value of each of the created variables to the user inputs
    const selectedValue1 = dropdown1.value;
    const selectedValue2 = dropdown2.value;
    const selectedValue3 = input1.value;
    const selectedValue4 = input2.value;


    // Create an array with the combined values selected by the user
    const combinedValues = [selectedValue1, selectedValue2, selectedValue3, selectedValue4];

    let queryHistory = JSON.parse(localStorage.getItem('queryHistory')) || [];
    queryHistory.push(combinedValues);
    if (queryHistory.length > 5) queryHistory.shift();
    localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
});

// Add event listener for the "Clear Selection" button
var clearSelectionButton = document.getElementById("clear-selection-button");
clearSelectionButton.addEventListener("click", function () {
    // Clear selected books from localStorage
    localStorage.removeItem('selectedBooks');
});

