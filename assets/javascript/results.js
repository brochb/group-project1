// Retrieve the search results from the session storage
var searchResults = JSON.parse(sessionStorage.getItem('searchResults'));

// Check if there are any results in the session storage
if (!searchResults || !searchResults.results || searchResults.results.length === 0) {
    console.log("No search results found. Redirecting to the index page.");
    window.location.href = "index.html"; // If no results found, redirect back to the search page
}

// Display the first set of results
displayResults(searchResults);

function displayResults(results, page) {
    // Display the next page of results when the "Next Page" button is clicked
    var currentPage = 1;
    var resultsPerPage = 25;
    var totalPages = searchResults.total_pages;

    var nextPageButton = document.getElementById("next-page-button");

    nextPageButton.addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            displayResults(searchResults, currentPage);
        }
    });
    page = page || 1;
    var startIndex = (page - 1) * resultsPerPage;
    var endIndex = Math.min(startIndex + resultsPerPage, results.total_results);

    var resultsContainer = document.getElementById("results-display");
    resultsContainer.innerHTML = ""; // Clear previous results

    for (var i = startIndex; i < endIndex; i++) {
        var book = searchResults.results[i];
        var title = book.title;
        var authors = book.authors[0];
        // You can add more properties like author_first_names, author_last_names, etc., if needed.

        // Create a container for each book
        var bookContainer = document.createElement("div");
        bookContainer.classList.add("book-item");

        // Create and append elements for title and authors
        var titleElement = document.createElement("h3");
        titleElement.textContent = title;
        var authorsElement = document.createElement("p");
        authorsElement.textContent = "Authors: " + authors;

        // Append title and authors to the book container
        bookContainer.appendChild(titleElement);
        bookContainer.appendChild(authorsElement);

        // Append the book container to the results container
        resultsContainer.appendChild(bookContainer);
    }
}
