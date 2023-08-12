// Retrieve the search results from the session storage
var searchResults = JSON.parse(sessionStorage.getItem('searchResults'));
var weatherData = JSON.parse(sessionStorage.getItem('weatherData'));
var tempFarenheit = ((weatherData.main.feels_like - 273.15) * 9 / 5 + 32).toFixed(0);
var sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString();
var sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString();
var description = weatherData.weather[0].description
var city = weatherData.name
var today = dayjs().unix()
var date = dayjs().format('dddd, MMM DD YYYY hh:mm:ss A');
var selectedBooks;
var oldApiUrl = sessionStorage.getItem('apiUrl');
var filteredResults;
var resultsPerPage;
var currentPage = parseInt(localStorage.getItem('Current Page')) || 1;
localStorage.setItem('Current Page', currentPage);
var currentPageElement = document.getElementById('currentPage');
var newApiUrl;
var page;
var resultsContainer = document.getElementById("results-display");
resultsContainer.innerHTML = ""; // Clear previous results
var book;

// Get the query parameters from the URL
var urlParams = new URLSearchParams(window.location.search);
var totalResults = urlParams.get('total_results');
var totalPages = urlParams.get('total_pages');

// Format the numbers with commas as thousands separators
var formattedTotalResults = parseInt(totalResults).toLocaleString();
var formattedTotalPages = parseInt(totalPages).toLocaleString();

// Update the HTML elements with the totalResults and totalPages values
var totalResultsElement = document.getElementById("total-results");
var totalPagesElement = document.getElementById("total-pages");
var currentPageElement = document.getElementById("current-page");

totalResultsElement.textContent = formattedTotalResults;
totalPagesElement.textContent = formattedTotalPages;
currentPageElement.textContent = currentPage + ' of ' + formattedTotalPages

console.log(formattedTotalPages); // Debug

function displayResults(results, page, resultsPerPage) {
    page = page || 1;

    var startIndex = (page - 1) * resultsPerPage;
    var endIndex = Math.min(startIndex + resultsPerPage, results.total_results);

    console.log(resultsPerPage);

    var resultsContainer = document.getElementById("results-display");
    resultsContainer.innerHTML = ""; // Clear previous results

    for (var i = startIndex; i < endIndex && i < results.results.length; i++) {
        book = results.results[i];
        var title = book.title;
        var authors = book.authors.join(", ");
        var summary = book.summary;
        var coverImg = book.published_works[0].cover_art_url;
        var lexile = book.measurements.english.lexile;
        // You can add more properties like author_first_names, author_last_names, etc., if needed.

        // Create a container for each book
        var bookContainer = document.createElement("div");
        bookContainer.classList.add("book-item");

        // Create and append elements for title, summary and authors
        var titleElement = document.createElement("h3");
        titleElement.textContent = title;
        var authorsElement = document.createElement("p");
        authorsElement.textContent = "Authors: " + authors;
        authorsElement.setAttribute("style", "color: blue; text-decoration: ")
        var summaryElement = document.createElement("p");
        if (summary == "") {
            summaryElement.textContent = "Unfortunately, there is no summary that can be found. (╯°□°）╯︵ ┻━┻ "
        } else {
            summaryElement.textContent = summary;
        }
        var bookImgElement = document.createElement("img");
        bookImgElement.setAttribute("src", coverImg);
        bookImgElement.setAttribute("class", "append-img");

        // Create a checkbox for each book with a label
        var checkboxLabel = document.createElement("label");
        var checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("class", "book-checkbox");
        checkbox.setAttribute("data-index", i); // Store the index of the book

        // Create a text node for the label
        var labelText = document.createTextNode("Select this Book");

        // Append the checkbox and label text to the label element
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(labelText);

        // Append title, summary, authors, and checkboxes to the book container
        bookContainer.appendChild(titleElement);
        bookContainer.appendChild(bookImgElement)
        bookContainer.appendChild(authorsElement);
        bookContainer.appendChild(summaryElement);
        bookContainer.appendChild(checkboxLabel);

        // Append the book container to the results container
        resultsContainer.appendChild(bookContainer);
    }
}

// To update the time every second
function updateTime() {
    date = dayjs().format('dddd, MMM DD YYYY hh:mm:ss A');

    // Update the HTML elements with weather information
    var descriptionElement = document.getElementById("description");
    var timeElement = document.getElementById("currentTime");
    var weatherMessageElement = document.getElementById("weather-message")

    // Display weather information in the HTML elements
    descriptionElement.textContent = 'You are in ' + city + ' and it currently feels like: ' + tempFarenheit + '°F' + ' with ' + description; // We need to figure out what the options are. So far I only know "Scattered Clouds"
    timeElement.textContent = date;

    // Logic for displaying weather message
    if (today >= weatherData.sys.sunrise && today < weatherData.sys.sunset) {
        if (description === 'clear sky' || description === 'broken clouds' || description === 'few clouds' || description === 'scattered clouds') {
            if (tempFarenheit >= 60 && tempFarenheit <= 75) {
                weatherMessageElement.textContent = "In this splendid weather, no need for a nook, just find a sunny spot, and crack open a book. With skies so clear and the sun's warm embrace, reading outside is a pure joy to chase!";
            } else if (tempFarenheit > 75 && tempFarenheit <= 90) {
                weatherMessageElement.textContent = "Though the heat might swarm, do not dismay, grab a book and some shade, let time sway. With words that enthrall and a cool cover's aid, the weather's just a backdrop to the adventure portrayed!";
            } else if (tempFarenheit > 90) {
                weatherMessageElement.textContent = "As the warmth wraps around, no need to screech, on a sandy beach or couch, a good book is in reach. With waves or cushions as your backdrop, just choose, adventure awaits in whichever setting you use!";
            } else if (tempFarenheit < 60 && tempFarenheit >= 45) {
                weatherMessageElement.textContent = "By the firepit's glow or under a blanket so neat, a book's soothing embrace is truly a treat. As the flames dance or the fabric hugs tight, the world of words whisks you away into the night!";
            } else {
                weatherMessageElement.textContent = "Though it is chilly out there, no reason to freeze, beside the fire's warmth, you will be at ease. With words on a page, a journey takes flight, to distant realms and adventures so bright. So embrace the cozy, forget the cold air, a good book will carry you anywhere!";
            }
        } else {
            weatherMessageElement.textContent = "Though outside might be grim, do not feel forlorn, a great book by your side, all worries are torn. As clouds gather or storms start to sway, the words on those pages will whisk them away. So let raindrops patter and thunderstorms swarm, in the world of your book, it is always warm!";
        }
    } else {
        if (description === 'clear sky' || description === 'broken clouds' || description === 'few clouds' || description === 'scattered clouds') {
            if (tempFarenheit >= 65 && tempFarenheit <= 90) {
                weatherMessageElement.textContent = "Beneath the starry night's delight, no need for nooks, just find that spot, and let a book unhook. With skies so clear, and stars' soft grace, reading outside is a joy in this cosmic embrace!";
            } else if (tempFarenheit > 90) {
                weatherMessageElement.textContent = "With the summer's heat so prime, when mosquitos buzz in line, let's opt for indoors and retreat, where books and knowledge sweetly meet!";
            } else if (tempFarenheit < 65 && tempFarenheit >= 50) {
                weatherMessageElement.textContent = "By the firepit's glow or under a blanket so neat, a book's soothing embrace is truly a treat. As the flames dance or the fabric hugs tight, the world of words whisks you away into the night!";
            } else {
                weatherMessageElement.textContent = "Though it is chilly out there, no reason to freeze, beside the fire's warmth, you will be at ease. With words on a page, a journey takes flight, to distant realms and adventures so bright. So embrace the cozy, forget the cold air, a good book will carry you anywhere!";
            }
        } else {
            weatherMessageElement.textContent = "Though outside might be grim, do not feel forlorn, a great book by your side, all worries are torn. As clouds gather or storms start to sway, the words on those pages will whisk them away. So let raindrops patter and thunderstorms swarm, in the world of your book, it is always warm!";
        }
    }
    
}

// Add an event listener to the "Search" button
var searchButton = document.getElementById('search-button');
searchButton.addEventListener('click', function () {
    var category = document.getElementById('queryCategory').value;
    var author = document.getElementById('author').value;
    var minLexile = parseFloat(document.getElementById('min-lexile').value);
    var maxLexile = parseFloat(document.getElementById('max-lexile').value);
    
    // Loop through each book in search results
    for (var i = 0; i < searchResults.length; i++) {
        var book = searchResults.results[i];
    
        
    }
    
    
});

resultsPerPage = 100;
// Display the first set of results
displayResults(searchResults, currentPage, resultsPerPage);

console.log(searchResults); // Debug
console.log(currentPage); // Debug
console.log(resultsPerPage); // Debug

selectedBooks = JSON.parse(localStorage.getItem('selectedBooks'));
// After updating the selectedBooks array in results.js
localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks));

// Add event listeners for checkboxes
var checkboxes = document.querySelectorAll(".book-checkbox");
checkboxes.forEach(function (checkbox) {
    checkbox.addEventListener("change", function () {
        var index = parseInt(this.getAttribute("data-index"));
        var selectedBook = searchResults.results[index];

        if (this.checked) {
            // Add the selected book to localStorage
            selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
            selectedBooks.push(selectedBook);
            localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks));
        } else {
            // Remove the selected book from localStorage
            selectedBooks = JSON.parse(localStorage.getItem('selectedBooks')) || [];
            selectedBooks = selectedBooks.filter(function (book) {
                return book.title !== selectedBook.title; // You can adjust the comparison criteria as needed
            });
            localStorage.setItem('selectedBooks', JSON.stringify(selectedBooks));
        }
    });
});

var history = document.getElementById("history")
var historyList = document.getElementById("history-list")


console.log(oldApiUrl)
var nextPageButton = document.getElementById('next-page-button');
var prevPageButton = document.getElementById('prev-page-button');
var nextPageButtonTop = document.getElementById('next-page-button-top');
var prevPageButtonTop = document.getElementById('prev-page-button-top');

nextPageButtonTop.addEventListener('click', () => {
    currentPage++;
    currentPageElement.textContent = currentPage; // This is causing an error because it's outside the updateTime function
    localStorage.setItem('Current Page', currentPage);

    // Extract the page number from the oldApiUrl and replace it with currentPage
    function extractPageNumber(oldApiUrl) {
        oldApiUrl = sessionStorage.getItem('apiUrl');
        var pageParamIndex = oldApiUrl.indexOf('page='); // Find the index of "page="
        if (pageParamIndex !== -1) {
            var pageStartIndex = pageParamIndex + 5; // Move to the character after "page="
            var pageEndIndex = oldApiUrl.indexOf('&', pageStartIndex); // Find the next '&' after the page number
            if (pageEndIndex === -1) {
                pageEndIndex = oldApiUrl.length; // If '&' not found, use the end of the string
            }
            var newApiUrl = oldApiUrl.substring(0, pageStartIndex) + currentPage + oldApiUrl.substring(pageEndIndex);

            return newApiUrl;
        }
        return oldApiUrl; // Return the original apiUrl if "page=" parameter is not found

    }

    extractPageNumber();

    var newApiUrl = extractPageNumber(oldApiUrl); // Capture the newApiUrl value returned by the function
    console.log("New API URL:", newApiUrl); // Now this will log the correct newApiUrl

    currentPageElement.textContent = currentPage + ' of ' + formattedTotalPages

    var myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
    myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(newApiUrl, requestOptions)
        .then(response => response.json())
        .then(result => {
            // Update the searchResults with the new page results
            searchResults = result;
            sessionStorage.setItem('searchResults', JSON.stringify(searchResults));

            resultsContainer = document.getElementById("results-display");
            resultsContainer.innerHTML = ""; // Clear previous results

            page = page || 1;
            var startIndex = (page - 1) * resultsPerPage;
            var endIndex = Math.min(startIndex + resultsPerPage, searchResults.total_results);

            for (var i = startIndex; i < endIndex && i < searchResults.results.length; i++) {
                var book = searchResults.results[i];
                var title = book.title;
                var authors = book.authors.join(", ");
                var summary = book.summary;
                var coverImg = book.published_works[0].cover_art_url;

                // You can add more properties like author_first_names, author_last_names, etc., if needed.

                // Create a container for each book
                var bookContainer = document.createElement("div");
                bookContainer.classList.add("book-item");

                // Create and append elements for title, summary and authors
                var titleElement = document.createElement("h3");
                titleElement.textContent = title;
                var authorsElement = document.createElement("p");
                authorsElement.textContent = "Authors: " + authors;
                authorsElement.setAttribute("style", "color: blue; text-decoration: ")
                var summaryElement = document.createElement("p");
                if (summary == "") {
                    summaryElement.textContent = "Unfortunately, there is no summary that can be found. (╯°□°）╯︵ ┻━┻ "
                } else {
                    summaryElement.textContent = summary;
                }
                var bookImgElement = document.createElement("img");
                bookImgElement.setAttribute("src", coverImg);
                bookImgElement.setAttribute("class", "append-img");

                // Create a checkbox for each book with a label
                var checkboxLabel = document.createElement("label");
                var checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("class", "book-checkbox");
                checkbox.setAttribute("data-index", i); // Store the index of the book


                // Create a text node for the label
                var labelText = document.createTextNode("Select this Book");

                // Append the checkbox and label text to the label element
                checkboxLabel.appendChild(checkbox);
                checkboxLabel.appendChild(labelText);

                // Append title, summary, authors, and checkboxes to the book container
                bookContainer.appendChild(titleElement);
                bookContainer.appendChild(bookImgElement)
                bookContainer.appendChild(authorsElement);
                bookContainer.appendChild(summaryElement);
                bookContainer.appendChild(checkboxLabel);

                // Append the book container to the results container
                resultsContainer.appendChild(bookContainer);

            }

            // Optionally, you might also want to update the pagination links or buttons here
        })
        .catch(error => console.log('error', error));

    // Update the next page button state based on the new currentPage
    updateNextButtonState();

})

prevPageButtonTop.addEventListener('click', () => {
    currentPage--;
    currentPageElement.textContent = currentPage; // This is causing an error because it's outside the updateTime function
    localStorage.setItem('Current Page', currentPage);

    // Extract the page number from the oldApiUrl and replace it with currentPage
    function extractPageNumber(oldApiUrl) {
        oldApiUrl = sessionStorage.getItem('apiUrl');
        var pageParamIndex = oldApiUrl.indexOf('page='); // Find the index of "page="
        if (pageParamIndex !== -1) {
            var pageStartIndex = pageParamIndex + 5; // Move to the character after "page="
            var pageEndIndex = oldApiUrl.indexOf('&', pageStartIndex); // Find the next '&' after the page number
            if (pageEndIndex === -1) {
                pageEndIndex = oldApiUrl.length; // If '&' not found, use the end of the string
            }
            var newApiUrl = oldApiUrl.substring(0, pageStartIndex) + currentPage + oldApiUrl.substring(pageEndIndex);

            return newApiUrl;
        }
        return oldApiUrl; // Return the original apiUrl if "page=" parameter is not found

    }

    extractPageNumber();

    var newApiUrl = extractPageNumber(oldApiUrl); // Capture the newApiUrl value returned by the function
    console.log("New API URL:", newApiUrl); // Now this will log the correct newApiUrl

    currentPageElement.textContent = currentPage + ' of ' + formattedTotalPages

    var myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
    myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(newApiUrl, requestOptions)
        .then(response => response.json())
        .then(result => {
            // Update the searchResults with the new page results
            searchResults = result;
            sessionStorage.setItem('searchResults', JSON.stringify(searchResults));

            resultsContainer = document.getElementById("results-display");
            resultsContainer.innerHTML = ""; // Clear previous results

            page = page || 1;
            var startIndex = (page - 1) * resultsPerPage;
            var endIndex = Math.min(startIndex + resultsPerPage, searchResults.total_results);

            for (var i = startIndex; i < endIndex && i < searchResults.results.length; i++) {
                var book = searchResults.results[i];
                var title = book.title;
                var authors = book.authors.join(", ");
                var summary = book.summary;
                var coverImg = book.published_works[0].cover_art_url;

                // You can add more properties like author_first_names, author_last_names, etc., if needed.

                // Create a container for each book
                var bookContainer = document.createElement("div");
                bookContainer.classList.add("book-item");

                // Create and append elements for title, summary and authors
                var titleElement = document.createElement("h3");
                titleElement.textContent = title;
                var authorsElement = document.createElement("p");
                authorsElement.textContent = "Authors: " + authors;
                authorsElement.setAttribute("style", "color: blue; text-decoration: ")
                var summaryElement = document.createElement("p");
                if (summary == "") {
                    summaryElement.textContent = "Unfortunately, there is no summary that can be found. (╯°□°）╯︵ ┻━┻ "
                } else {
                    summaryElement.textContent = summary;
                }
                var bookImgElement = document.createElement("img");
                bookImgElement.setAttribute("src", coverImg);
                bookImgElement.setAttribute("class", "append-img");

                // Create a checkbox for each book with a label
                var checkboxLabel = document.createElement("label");
                var checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("class", "book-checkbox");
                checkbox.setAttribute("data-index", i); // Store the index of the book


                // Create a text node for the label
                var labelText = document.createTextNode("Select this Book");

                // Append the checkbox and label text to the label element
                checkboxLabel.appendChild(checkbox);
                checkboxLabel.appendChild(labelText);

                // Append title, summary, authors, and checkboxes to the book container
                bookContainer.appendChild(titleElement);
                bookContainer.appendChild(bookImgElement)
                bookContainer.appendChild(authorsElement);
                bookContainer.appendChild(summaryElement);
                bookContainer.appendChild(checkboxLabel);

                // Append the book container to the results container
                resultsContainer.appendChild(bookContainer);

            }

            // Optionally, you might also want to update the pagination links or buttons here
        })
        .catch(error => console.log('error', error));
    // Update the previous page button state based on the new currentPage
    updatePreviousButtonState();

})

nextPageButton.addEventListener('click', () => {
    scrollTo(top);
    currentPage++;
    currentPageElement.textContent = currentPage; // This is causing an error because it's outside the updateTime function
    localStorage.setItem('Current Page', currentPage);

    // Extract the page number from the oldApiUrl and replace it with currentPage
    function extractPageNumber(oldApiUrl) {
        oldApiUrl = sessionStorage.getItem('apiUrl');
        var pageParamIndex = oldApiUrl.indexOf('page='); // Find the index of "page="
        if (pageParamIndex !== -1) {
            var pageStartIndex = pageParamIndex + 5; // Move to the character after "page="
            var pageEndIndex = oldApiUrl.indexOf('&', pageStartIndex); // Find the next '&' after the page number
            if (pageEndIndex === -1) {
                pageEndIndex = oldApiUrl.length; // If '&' not found, use the end of the string
            }
            var newApiUrl = oldApiUrl.substring(0, pageStartIndex) + currentPage + oldApiUrl.substring(pageEndIndex);

            return newApiUrl;
        }
        return oldApiUrl; // Return the original apiUrl if "page=" parameter is not found

    }

    extractPageNumber();

    var newApiUrl = extractPageNumber(oldApiUrl); // Capture the newApiUrl value returned by the function
    console.log("New API URL:", newApiUrl); // Now this will log the correct newApiUrl

    currentPageElement.textContent = currentPage + ' of ' + formattedTotalPages

    var myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
    myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(newApiUrl, requestOptions)
        .then(response => response.json())
        .then(result => {
            // Update the searchResults with the new page results
            searchResults = result;
            sessionStorage.setItem('searchResults', JSON.stringify(searchResults));

            resultsContainer = document.getElementById("results-display");
            resultsContainer.innerHTML = ""; // Clear previous results

            page = page || 1;
            var startIndex = (page - 1) * resultsPerPage;
            var endIndex = Math.min(startIndex + resultsPerPage, searchResults.total_results);

            for (var i = startIndex; i < endIndex && i < searchResults.results.length; i++) {
                var book = searchResults.results[i];
                var title = book.title;
                var authors = book.authors.join(", ");
                var summary = book.summary;
                var coverImg = book.published_works[0].cover_art_url;

                // You can add more properties like author_first_names, author_last_names, etc., if needed.

                // Create a container for each book
                var bookContainer = document.createElement("div");
                bookContainer.classList.add("book-item");

                // Create and append elements for title, summary and authors
                var titleElement = document.createElement("h3");
                titleElement.textContent = title;
                var authorsElement = document.createElement("p");
                authorsElement.textContent = "Authors: " + authors;
                authorsElement.setAttribute("style", "color: blue; text-decoration: ")
                var summaryElement = document.createElement("p");
                if (summary == "") {
                    summaryElement.textContent = "Unfortunately, there is no summary that can be found. (╯°□°）╯︵ ┻━┻ "
                } else {
                    summaryElement.textContent = summary;
                }
                var bookImgElement = document.createElement("img");
                bookImgElement.setAttribute("src", coverImg);
                bookImgElement.setAttribute("class", "append-img");

                // Create a checkbox for each book with a label
                var checkboxLabel = document.createElement("label");
                var checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("class", "book-checkbox");
                checkbox.setAttribute("data-index", i); // Store the index of the book


                // Create a text node for the label
                var labelText = document.createTextNode("Select this Book");

                // Append the checkbox and label text to the label element
                checkboxLabel.appendChild(checkbox);
                checkboxLabel.appendChild(labelText);

                // Append title, summary, authors, and checkboxes to the book container
                bookContainer.appendChild(titleElement);
                bookContainer.appendChild(bookImgElement)
                bookContainer.appendChild(authorsElement);
                bookContainer.appendChild(summaryElement);
                bookContainer.appendChild(checkboxLabel);

                // Append the book container to the results container
                resultsContainer.appendChild(bookContainer);

            }

            // Optionally, you might also want to update the pagination links or buttons here
        })
        .catch(error => console.log('error', error));

    // Update the next page button state based on the new currentPage
    updateNextButtonState();

})

prevPageButton.addEventListener('click', () => {
    scrollTo(top);
    currentPage--;
    currentPageElement.textContent = currentPage; // This is causing an error because it's outside the updateTime function
    localStorage.setItem('Current Page', currentPage);

    // Extract the page number from the oldApiUrl and replace it with currentPage
    function extractPageNumber(oldApiUrl) {
        oldApiUrl = sessionStorage.getItem('apiUrl');
        var pageParamIndex = oldApiUrl.indexOf('page='); // Find the index of "page="
        if (pageParamIndex !== -1) {
            var pageStartIndex = pageParamIndex + 5; // Move to the character after "page="
            var pageEndIndex = oldApiUrl.indexOf('&', pageStartIndex); // Find the next '&' after the page number
            if (pageEndIndex === -1) {
                pageEndIndex = oldApiUrl.length; // If '&' not found, use the end of the string
            }
            var newApiUrl = oldApiUrl.substring(0, pageStartIndex) + currentPage + oldApiUrl.substring(pageEndIndex);

            return newApiUrl;
        }
        return oldApiUrl; // Return the original apiUrl if "page=" parameter is not found

    }

    extractPageNumber();

    var newApiUrl = extractPageNumber(oldApiUrl); // Capture the newApiUrl value returned by the function
    console.log("New API URL:", newApiUrl); // Now this will log the correct newApiUrl

    currentPageElement.textContent = currentPage + ' of ' + formattedTotalPages

    var myHeaders = new Headers();
    myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
    myHeaders.append("X-RapidAPI-Host", "book-finder1.p.rapidapi.com");

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(newApiUrl, requestOptions)
        .then(response => response.json())
        .then(result => {
            // Update the searchResults with the new page results
            searchResults = result;
            sessionStorage.setItem('searchResults', JSON.stringify(searchResults));

            resultsContainer = document.getElementById("results-display");
            resultsContainer.innerHTML = ""; // Clear previous results

            page = page || 1;
            var startIndex = (page - 1) * resultsPerPage;
            var endIndex = Math.min(startIndex + resultsPerPage, searchResults.total_results);

            for (var i = startIndex; i < endIndex && i < searchResults.results.length; i++) {
                var book = searchResults.results[i];
                var title = book.title;
                var authors = book.authors.join(", ");
                var summary = book.summary;
                var coverImg = book.published_works[0].cover_art_url;

                // You can add more properties like author_first_names, author_last_names, etc., if needed.

                // Create a container for each book
                var bookContainer = document.createElement("div");
                bookContainer.classList.add("book-item");

                // Create and append elements for title, summary and authors
                var titleElement = document.createElement("h3");
                titleElement.textContent = title;
                var authorsElement = document.createElement("p");
                authorsElement.textContent = "Authors: " + authors;
                authorsElement.setAttribute("style", "color: blue; text-decoration: ")
                var summaryElement = document.createElement("p");
                if (summary == "") {
                    summaryElement.textContent = "Unfortunately, there is no summary that can be found. (╯°□°）╯︵ ┻━┻ "
                } else {
                    summaryElement.textContent = summary;
                }
                var bookImgElement = document.createElement("img");
                bookImgElement.setAttribute("src", coverImg);
                bookImgElement.setAttribute("class", "append-img");

                // Create a checkbox for each book with a label
                var checkboxLabel = document.createElement("label");
                var checkbox = document.createElement("input");
                checkbox.setAttribute("type", "checkbox");
                checkbox.setAttribute("class", "book-checkbox");
                checkbox.setAttribute("data-index", i); // Store the index of the book


                // Create a text node for the label
                var labelText = document.createTextNode("Select this Book");

                // Append the checkbox and label text to the label element
                checkboxLabel.appendChild(checkbox);
                checkboxLabel.appendChild(labelText);

                // Append title, summary, authors, and checkboxes to the book container
                bookContainer.appendChild(titleElement);
                bookContainer.appendChild(bookImgElement)
                bookContainer.appendChild(authorsElement);
                bookContainer.appendChild(summaryElement);
                bookContainer.appendChild(checkboxLabel);

                // Append the book container to the results container
                resultsContainer.appendChild(bookContainer);

            }
        })
        .catch(error => console.log('error', error));

    // Update the previous page button state based on the new currentPage
    updatePreviousButtonState();

})

// Function to update the state of the previous page button
function updatePreviousButtonState() {
    if (currentPage === 1) {
        prevPageButton.disabled = true;
        prevPageButtonTop.disabled = true;
    } else {
        prevPageButton.disabled = false;
        prevPageButtonTop.disabled = false;
    }
}

// Function to update the state of the next page button
function updateNextButtonState() {
    if (currentPage === parseFloat(formattedTotalPages)) {
        nextPageButton.disabled = true;
        nextPageButtonTop.disabled = true;
    } else {
        nextPageButton.disabled = false;
        nextPageButtonTop.disabled = false;
    }
}

// Call the function initially to set the button state
updatePreviousButtonState();
updateNextButtonState();


setInterval(updateTime, 1000);
