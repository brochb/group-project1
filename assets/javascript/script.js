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
    var minLexile = document.getElementById("min-lexile").value;
    var maxLexile = document.getElementById("max-lexile").value;
    var author = document.getElementById("author").value;

    // Verification of input
    if (queryInput.trim() !== "") {
        // Construct the base apiUrl
        apiUrl = 'https://book-finder1.p.rapidapi.com/api/search?book_type=' + queryInput;
    
        // Build an array to hold the search parameters and their values
        const searchParams = [];
    
        // Add queryCategory if provided
        if (queryCategory.trim() !== "") {
            searchParams.push(queryCategory);
        }
    
        // Add lexile_min if provided
        if (minLexile.trim() !== "") {
            searchParams.push('lexile_min=' + minLexile);
        }
    
        // Add lexile_max if provided
        if (maxLexile.trim() !== "") {
            searchParams.push('lexile_max=' + maxLexile);
        }
    
        // Add author if provided
        if (author.trim() !== "") {
            searchParams.push('author=' + author);
        }
    
        // Combine the search parameters into the apiUrl
        if (searchParams.length > 0) {
            apiUrl += '&' + searchParams.join('&');
        }
    
        // Add the remaining parameters and redirect logic
        apiUrl += '&page=1&results_per_page=100';

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

            // Creating the variables and elements that we would like to display in the "saved books" container
            var bookTitle = document.createElement("li");
            bookTitle.textContent = 'Title: ' + book.title;
            bookContainer.appendChild(bookTitle);
            var bookAuthors = document.createElement("li");
            bookAuthors.textContent = 'Authors: ' + book.authors.join(", ");
            bookContainer.appendChild(bookAuthors);
            if (book.awards.length > 0) {
                var bookAwards = document.createElement("li");
                bookAwards.textContent = 'Awards: ' + book.awards.join(", ");
                bookContainer.appendChild(bookAwards);
            }
            var bookLexile = document.createElement("li");
            bookLexile.textContent = 'Lexile: ' + book.measurements.english.lexile;
            bookContainer.appendChild(bookLexile);
            if (book.subcategories.length > 0) {
                var bookSubcategories = document.createElement("li");
                bookSubcategories.textContent = 'Subcategories: ' + book.subcategories.join(", ");
                bookContainer.appendChild(bookSubcategories);
            }
            var bookSummary = document.createElement("li");
            bookSummary.textContent = 'Summary: ' + book.summary;
            bookContainer.appendChild(bookSummary);
            // Need to add the field that we would like to display and don't forget to append them below
            
            // Append the li element to the book container

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
            const [value1, value2, value3, value4, value5] = queryArray;
            document.getElementById('query-input').value = value1;
            document.getElementById('queryCategory').value = value2;
            document.getElementById('author').value = value3
            document.getElementById('min-lexile').value = value4;
            document.getElementById('max-lexile').value = value5;
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
    const input1 = document.getElementById('author');
    const input2 = document.getElementById('min-lexile');
    const input3 = document.getElementById('max-lexile');

    // Set the value of each of the created variables to the user inputs
    const selectedValue1 = dropdown1.value;
    const selectedValue2 = dropdown2.value;
    const selectedValue3 = input1.value;
    const selectedValue4 = input2.value;
    const selectedValue5 = input3.value;

    // Create an array with the combined values selected by the user
    const combinedValues = [selectedValue1, selectedValue2, selectedValue3, selectedValue4, selectedValue5];

    let queryHistory = JSON.parse(localStorage.getItem('queryHistory')) || [];
    queryHistory.push(combinedValues);
    if (queryHistory.length > 6) queryHistory.shift();
    localStorage.setItem('queryHistory', JSON.stringify(queryHistory));
});

// Add event listener for the "Clear Selection" button
var clearSelectionButton = document.getElementById("clear-selection-button");
clearSelectionButton.addEventListener("click", function () {
    // Clear selected books from localStorage
    localStorage.removeItem('selectedBooks');
});

