const APIKey = "aefc3d833526ac11a10cd57951b4969d";
const searchButton = $("#search-button")

// Function to find weather data for searched city on click
searchButton.on("click", function() {
    event.preventDefault();
    let citySearch = $("#search-input").val()
    let geoQueryURL = "http://api.openweathermap.org/geo/1.0/direct?q=" + citySearch + "&limit=5&appid=" + APIKey;
    fetch(geoQueryURL)
    .then(function(response) {
      return response.json();
    }).then(function(data) {
        if (data[0] === undefined) {
            alert("Please enter a city name")
        }
        lonVar = data[0].lon
        latVar = data[0].lat
      ;
    })
    .then(function(){
        let weatherQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latVar + "&lon=" + lonVar + "&appid=" + APIKey;
        fetch(weatherQueryURL)
        .then(function(response) {
            return response.json();
        }).then(function(data) {
            console.log(data);
        })
    });
})



