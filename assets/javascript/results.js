// Retrieve the search results from the session storage
var searchResults = JSON.parse(sessionStorage.getItem('searchResults'));
var weatherData = JSON.parse(sessionStorage.getItem('weatherData'));
var tempFarenheit = ((weatherData.main.feels_like - 273.15) * 9 / 5 + 32).toFixed(0);
var sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
var sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
var description = weatherData.weather[0].description
var city = weatherData.name

// Update the HTML elements with weather information
var descriptionElement = document.getElementById("description");
var sunElement = document.getElementById("sunrise-sunset");
var weatherMessageElement = document.getElementById("weather-message")

// Display weather information in the HTML elements
descriptionElement.textContent = 'You are in ' + city + ' and it currently feels like: ' + tempFarenheit + '°F' + ' with ' + description; // We need to figure out what the options are. So far I only know "Scattered Clouds"
sunElement.textContent = 'Sunrise: ' + sunrise + ' / Sunset: ' + sunset;

// Logic for displaying weather message
if (description === 'clear sky' || description === 'broken clouds' || description === 'few clouds' || description === 'scattered clouds') {
    if (tempFarenheit >= 60 && tempFarenheit <= 75) {
        weatherMessageElement.textContent = 'In this splendid weather, no need for a nook, just find a sunny spot, and crack open a book. With skies so clear and the sun`s warm embrace, reading outside is a pure joy to chase!';
    } else if (tempFarenheit > 75 && tempFarenheit <= 90) {
        weatherMessageElement.textContent = 'Though the heat might swarm, do not dismay, grab a book and some shade, let time sway. With words that enthrall and a cool cover`s aid, the weather`s just a backdrop to the adventure portrayed!';
    } else if (tempFarenheit > 90) {
        weatherMessageElement.textContent = 'As the warmth wraps around, no need to screech, on a sandy beach or couch, a good book is in reach. With waves or cushions as your backdrop, just choose, adventure awaits in whichever setting you use!';
    } else if (tempFarenheit < 65 && tempFarenheit >= 45) {
        weatherMessageElement.textContent = 'By the firepit`s glow or under a blanket so neat, a book`s soothing embrace is truly a treat. As the flames dance or the fabric hugs tight, the world of words whisks you away into the night!';
    } else {
        weatherMessageElement.textContent = 'Though it is chilly out there, no reason to freeze, beside the fire`s warmth, you will be at ease. With words on a page, a journey takes flight, to distant realms and adventures so bright. So embrace the cozy, forget the cold air, a good book will carry you anywhere!';
    }
} else {
    weatherMessageElement.textContent = 'Though outside might be grim, do not feel forlorn, a great book by your side, all worries are torn. As clouds gather or storms start to sway, the words on those pages will whisk them away. So let raindrops patter and thunderstorms swarm, in the world of your book, it is always warm!';
}


// Check if there are any results in the session storage
if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
    console.log("No search results found. Redirecting to the index page.");
    window.location.href = "index.html"; // If no results found, redirect back to the search page
}

// Set the initial page number and results per page
var currentPage = 1;
var resultsPerPage = 100;
var filteredResults = searchResults.results; // Initialize filteredResults with all results

// Display the first set of results
displayResults(searchResults, currentPage, resultsPerPage);

// Add event listener for the "Search" button
var searchButton = document.getElementById("search-button");
searchButton.addEventListener("click", function () {
    // Get the search input values
    var firstNameInput = document.getElementById("first-name").value.trim().toLowerCase();
    var lastNameInput = document.getElementById("last-name").value.trim().toLowerCase();
    var subcategoryInput = document.getElementById("subcategory").value.trim().toLowerCase();

    // Filter the results based on the search inputs
    filteredResults = searchResults.results.filter(function (book) {
        var matchFirstName = !firstNameInput || (book.author_first_names && book.author_first_names.some(function (name) {
            return name.toLowerCase().includes(firstNameInput);
        }));

        var matchLastName = !lastNameInput || (book.author_last_names && book.author_last_names.some(function (name) {
            return name.toLowerCase().includes(lastNameInput);
        }));

        var matchSubcategory = !subcategoryInput || (book.subcategories && book.subcategories.some(function (subcat) {
            return subcat.toLowerCase().includes(subcategoryInput);
        }));

        return matchFirstName && matchLastName && matchSubcategory;
    });

    // Call the displayResults function with the filtered results and reset the page to 1
    displayResults({ results: filteredResults, total_results: filteredResults.length }, 1, resultsPerPage);
});

// Display the next page of results when the "Next Page" button is clicked
var nextPageButton = document.getElementById("next-page-button");
nextPageButton.addEventListener("click", function () {
    if (currentPage < Math.ceil(searchResults.total_results / resultsPerPage)) {
        currentPage++;
        fetchNextPage();
    }
});

// add previous page button here

function displayResults(results, page, resultsPerPage) {
    page = page || 1;

    var startIndex = (page - 1) * resultsPerPage;
    var endIndex = Math.min(startIndex + resultsPerPage, results.total_results);

    var resultsContainer = document.getElementById("results-display");
    resultsContainer.innerHTML = ""; // Clear previous results

    for (var i = startIndex; i < endIndex && i < results.results.length; i++) {
        var book = results.results[i];
        var title = book.title;
        var authors = book.authors.join(", ");
        var summary = book.summary;
        // You can add more properties like author_first_names, author_last_names, etc., if needed.

        // Create a container for each book
        var bookContainer = document.createElement("div");
        bookContainer.classList.add("book-item");

        // Create and append elements for title, summary and authors
        var titleElement = document.createElement("h3");
        titleElement.textContent = title;
        var authorsElement = document.createElement("p");
        authorsElement.textContent = "Authors: " + authors;
        var summaryElement = document.createElement("p");
        summaryElement.textContent = summary;


        // Append title, summary and authors to the book container
        bookContainer.appendChild(titleElement);
        bookContainer.appendChild(authorsElement);
        bookContainer.appendChild(summaryElement);

        // Append the book container to the results container
        resultsContainer.appendChild(bookContainer);
    }
}

function fetchNextPage() {
    var myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
    myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

    var apiUrl = 'https://book-finder1.p.rapidapi.com/api/search?book_type=${searchResults.book_type}&page=${currentPage}&results_per_page=${resultsPerPage}';

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(apiUrl, requestOptions)
        .then(response => response.json())
        .then(result => {
            // Save the new results in the session storage
            searchResults = result;
            sessionStorage.setItem('searchResults', JSON.stringify(searchResults));

            // Call the displayResults function with the new results and updated page number
            displayResults(searchResults, currentPage, resultsPerPage);
        })
        .catch(error => console.log('error', error));
}

