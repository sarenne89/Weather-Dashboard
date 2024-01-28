$(document).ready(function() {
    dayjs.extend(window.dayjs_plugin_customParseFormat)
    const APIKey = "aefc3d833526ac11a10cd57951b4969d"
    const searchButton = $("#search-button")
    let todaysDate = dayjs().format("(DD/MM/YYYY)")
    const today = $("#today")
    const forecast = $("#forecast")

//Function definition for retrieving previous search history from local storage and creating buttons for up to 5 most recent searches
    function showHistory() {
        let retrievedHistory = localStorage.getItem("searchHistory")?
        JSON.parse(localStorage.getItem("searchHistory")) : []
        for (let i = 0; i < 5; i++) {
            if (retrievedHistory[i] != null){
                previousSearch = $("<button>").val(retrievedHistory[i]).text(retrievedHistory[i]).attr({
                    class: "btn btn-primary my-2 previous-search",
                    type: "submit",
                    })
                $(".list-group").append(previousSearch)
            }
        }
    }

    showHistory();

    //Function for searching with previous search
    previousSearchButtons = $(".previous-search")
    previousSearchButtons.on("click", function() {
        event.preventDefault()
        today.empty();
        forecast.empty();
        let previousCity = $(this).val()
        let geoQueryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + previousCity + "&limit=5&appid=" + APIKey;
        fetch(geoQueryURL)
        .then(function(response) {
        return response.json()
        })
        .then(function(data) {
            if (data[0] === undefined) {
                alert("Please enter a city name")
            }
            lonVar = data[0].lon
            latVar = data[0].lat
        })
        .then(function(){
            let weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latVar + "&lon=" + lonVar + "&appid=" + APIKey;
            fetch(weatherQueryURL)
            .then(function(response) {
                return response.json()
            }).then(function(data) {

                //Adds data to the div showing current weather conditions in the chosen City
                cityName = $("<h3>").text(data.name)
                today.append(cityName);
                appendedDate = $("<h3>").text(todaysDate)
                today.append(appendedDate)
                currentTemp = $("<h5>").text("Temp: " + (data.main.temp -= 273.15).toFixed(1) + "°C");
                today.append(currentTemp);
                windSpeed = $("<h5>").text("Wind: " + data.wind.speed + " m/s");
                today.append(windSpeed);
                humidity = $("<h5>").text("Humidity: " + data.main.humidity + "%");
                today.append(humidity)

                //Adds a class with a background image depending on current weather conditions
                if (data.weather[0].description === "clear sky") {
                    today.attr("class", "mt-3 p-2 clearSky")
                }
                if (data.weather[0].description === "few clouds") {
                    today.attr("class", "mt-3 p-2 fewClouds")
                }
                if (data.weather[0].description === "scattered clouds") {
                    today.attr("class", "mt-3 p-2 scatteredClouds")
                }
                if (data.weather[0].description === "shower rain" || "light rain") {
                    today.attr("class", "mt-3 p-2 showerRain")
                }
                if (data.weather[0].description === "broken clouds") {
                    today.attr("class", "mt-3 p-2 rain")
                }
                if (data.weather[0].description === "overcast clouds") {
                    today.attr("class", "mt-3 p-2 overcast")
                }
                if (data.weather[0].description === "thunderstorm") {
                    today.attr("class", "mt-3 p-2 thunderstorm")
                }
                if (data.weather[0].description === "snow") {
                    today.attr("class", "mt-3 p-2 snow")
                }
                if (data.weather[0].description === "mist") {
                    today.attr("class", "mt-3 p-2 mist")
                }            
            })
        })
        .then(function(){
            let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latVar + "&lon=" + lonVar + "&appid=" + APIKey;
            fetch(forecastQueryURL)
            .then(function(response) {
                return response.json();
            }).then(function(data2){
                for (let index = 0; index < data2.list.length; index++) {
                    if (data2.list[index].dt_txt.includes("12:00:00")){
                        forecastCard = $("<div>").addClass("card col-12 col-md-2 mx-auto my-2 bg-dark text-light")
                        forecastDate = $("<h5>").text(dayjs.unix(data2.list[index].dt).format("DD-MM-YYYY"))
                        forecastDate.addClass("text-center")
                        forecastTime = $("<p>").text("@12pm").attr("class", "mb-2 text-center")
                        forecastTemp = $("<p>").text("Temp: " + (data2.list[index].main.temp -= 273.15).toFixed(1) + "°C")
                        forecastWind = $("<p>").text("Wind: " + (data2.list[index].wind.speed).toFixed(1) + " m/s")
                        forecastHumidity = $("<p>").text("Humidity: " + (data2.list[index].main.humidity) + "%")
                        weatherIconCode = data2.list[index].weather[0].icon
                        weatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png")
                        weatherIcon.addClass("weatherIcon")
                        forecastCard.append(forecastDate)
                        forecastCard.append(forecastTime)
                        forecastCard.append(weatherIcon)
                        forecastCard.append(forecastTemp)
                        forecastCard.append(forecastWind)
                        forecastCard.append(forecastHumidity)
                        forecast.append(forecastCard);
                    }
                }
            })
        })       
    })

    // Function to find weather data from search-input on click
    searchButton.on("click", function() {
        event.preventDefault();
        //Removes any previous weather data before searchng for new data
        today.empty();
        forecast.empty();
        today.attr("class", "")
        let citySearch = $("#search-input").val()
        let geoQueryURL = "https://api.openweathermap.org/geo/1.0/direct?q=" + citySearch + "&limit=5&appid=" + APIKey;
        //Creates a button to add to the search history, giving it the class "previous-search"
        if (citySearch === "") {
            alert("Please search for a city!")
        }
        else {
        previousSearch = $("<button>").val(citySearch).text(citySearch).attr({
            class: "btn btn-primary my-2 previous-search",
            type: "submit",
            })
            let retrievedHistory = localStorage.getItem("searchHistory")?
            JSON.parse(localStorage.getItem("searchHistory")) : []
            retrievedHistory.unshift(citySearch)
            localStorage.setItem("searchHistory", JSON.stringify(retrievedHistory))
            $(".list-group").append(previousSearch)
            //Fetches lat/long data for the searched city, and shows the user an error if the search is invalid
            fetch(geoQueryURL)
            .then(function(response) {
            return response.json()
            })
            .then(function(data) {
                if (data[0] === undefined) {
                    alert("Please enter a city name")
                }
                lonVar = data[0].lon
                latVar = data[0].lat
            })

            //Uses the lat/long data from the initial fetch request to search for the appropriate weather data
            .then(function(){
                let weatherQueryURL = "https://api.openweathermap.org/data/2.5/weather?lat=" + latVar + "&lon=" + lonVar + "&appid=" + APIKey;
                fetch(weatherQueryURL)
                .then(function(response) {
                    return response.json()
                }).then(function(data) {

                    //Adds data to the div showing current weather conditions in the chosen City
                    cityName = $("<h3>").text(data.name)
                    today.append(cityName);
                    appendedDate = $("<h3>").text(todaysDate)
                    today.append(appendedDate)
                    currentTemp = $("<h5>").text("Temp: " + (data.main.temp -= 273.15).toFixed(1) + "°C");
                    today.append(currentTemp);
                    windSpeed = $("<h5>").text("Wind: " + data.wind.speed + " m/s");
                    today.append(windSpeed);
                    humidity = $("<h5>").text("Humidity: " + data.main.humidity + "%");
                    today.append(humidity)

                    //Adds a class with a background image depending on current weather conditions
                    if (data.weather[0].description === "clear sky") {
                        today.attr("class", "mt-3 p-2 clearSky")
                    }
                    if (data.weather[0].description === "few clouds") {
                        today.attr("class", "mt-3 p-2 fewClouds")
                    }
                    if (data.weather[0].description === "scattered clouds") {
                        today.attr("class", "mt-3 p-2 scatteredClouds")
                    }
                    if (data.weather[0].description === "shower rain" || "light rain") {
                        today.attr("class", "mt-3 p-2 showerRain")
                    }
                    if (data.weather[0].description === "broken clouds") {
                        today.attr("class", "mt-3 p-2 rain")
                    }
                    if (data.weather[0].description === "thunderstorm") {
                        today.attr("class", "mt-3 p-2 thunderstorm")
                    }
                    if (data.weather[0].description === "snow") {
                        today.attr("class", "mt-3 p-2 snow")
                    }
                    if (data.weather[0].description === "mist") {
                        today.attr("class", "mt-3 p-2 mist")
                    }
                    if (data.weather[0].description === "overcast clouds") {
                        today.attr("class", "mt-3 p-2 overcast")
                    }            
                })
            })

            //Creates a card containing forecast data for 5 days - selected data is for 12pm on each day
            .then(function(){
                let forecastQueryURL = "https://api.openweathermap.org/data/2.5/forecast?lat=" + latVar + "&lon=" + lonVar + "&appid=" + APIKey;
                fetch(forecastQueryURL)
                .then(function(response) {
                    return response.json();
                }).then(function(data2){
                    for (let index = 0; index < data2.list.length; index++) {
                        if (data2.list[index].dt_txt.includes("12:00:00")){
                            forecastCard = $("<div>").addClass("card col-12 col-md-2 mx-md-auto mx-2 my-2 bg-dark text-light")
                            forecastDate = $("<h5>").text(dayjs.unix(data2.list[index].dt).format("DD-MM-YYYY"))
                            forecastDate.addClass("text-center")
                            forecastTime = $("<p>").text("@12pm").attr("class", "mb-2 text-center")
                            forecastTemp = $("<p>").text("Temp: " + (data2.list[index].main.temp -= 273.15).toFixed(1) + "°C")
                            forecastWind = $("<p>").text("Wind: " + (data2.list[index].wind.speed).toFixed(1) + " m/s")
                            forecastHumidity = $("<p>").text("Humidity: " + (data2.list[index].main.humidity) + "%")
                            weatherIconCode = data2.list[index].weather[0].icon
                            weatherIcon = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + weatherIconCode + "@2x.png")
                            weatherIcon.addClass("weatherIcon")
                            forecastCard.append(forecastDate)
                            forecastCard.append(forecastTime)
                            forecastCard.append(weatherIcon)
                            forecastCard.append(forecastTemp)
                            forecastCard.append(forecastWind)
                            forecastCard.append(forecastHumidity)
                            forecast.append(forecastCard);
                        }
                    }
                })
            })
        }
    })
})
