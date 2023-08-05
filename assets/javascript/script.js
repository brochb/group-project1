var myHeaders = new Headers();
myHeaders.append("X-RapidAPI-Key", "203d6f8221msh723786e2656b6a5p1512adjsn9cc9321e6473");
myHeaders.append("Cookie", "caf_ipaddr=35.162.152.183; city=\"Boardman\"; country=US; system=PW; traffic_target=reseller");

var searchContainer = document.getElementById("search-container")
var regionSearch = document.getElementById("text-box-1")
var ingredientsSearch = document.getElementById("text-box-2")
var searchButton = document.getElementById("search-button")

var requestOptions = {
  method: 'GET',
  headers: myHeaders,
  redirect: 'follow'
};

fetch("https://community-food2fork.p.rapidapi.com/search", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));