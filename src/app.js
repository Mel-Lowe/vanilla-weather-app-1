function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function formatForecastDay(timestamp) {
  let forecastDate = new Date(timestamp);
  let day = forecastDate.getDay();
  let days = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let dailyForecast = response.data.daily;

  let forecastElement = document.querySelector("#weather-forecast");

  let forecastHTML = `<div class="row">`;

  dailyForecast.forEach(function(forecast, index) {
    if (index <= 4) {
      let weatherForecastDate = formatForecastDay(forecast.dt * 1000);
      let weatherForecastIcon = forecast.weather[0].icon;
      let forecastTempMax = Math.round(forecast.temp.max);
      let forecastTempMin = Math.round(forecast.temp.min);

      forecastHTML += `
              <div class="col-2 weather-forecast-tile">
                <div class="weather-forecast-date">${weatherForecastDate}</div>
                <img
                  src="https://openweathermap.org/img/wn/${weatherForecastIcon}@2x.png"
                  width="50"
                  alt=""
                />
                <div class="weather-forecast-temp">
                  <span id="forecast-temp-max">${forecastTempMax}°</span> <span>|</span>
                  <span id="forecast-temp-min">${forecastTempMin}°</span>
                </div>
              </div>
           
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "485b9870f76954f7a4f26ef36fc9aa1d";
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#current-temp-integer");
  let cityElement = document.querySelector("#currentCity");
  let descriptionElement = document.querySelector("#current-description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#current-date");
  let iconElement = document.querySelector("#current-temp-icon");
  let icon = response.data.weather[0].icon;

  celsiusTemperature = Math.round(response.data.main.temp);

  temperatureElement.innerHTML = celsiusTemperature;
  cityElement.innerHTML = `${response.data.name}, ${response.data.sys.country}`;
  descriptionElement.innerHTML = response.data.weather[0].description;
  humidityElement.innerHTML = response.data.main.humidity;
  windElement.innerHTML = response.data.wind.speed;
  dateElement.innerHTML = formatDate(response.data.dt * 1000);
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${icon}@2x.png`
  );
  iconElement.setAttribute(
    "alt",
    `image of ${response.data.weather[0].description}`
  );
  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "485b9870f76954f7a4f26ef36fc9aa1d";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}
function submitCity(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#city-input");
  searchCity(cityInput.value);
}

function displayFarenheitTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  farenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#current-temp-integer");
  let farenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemperature);
}

function displayCelsiusTemperature(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  farenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temp-integer");
  temperatureElement.innerHTML = celsiusTemperature;
}

let celsiusTemperature = null;

let cityForm = document.querySelector("#city-search-form");
cityForm.addEventListener("submit", submitCity);

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", displayFarenheitTemperature);

let celsiusLink = document.querySelector("#celsius-link");
celsiusLink.addEventListener("click", displayCelsiusTemperature);

searchCity("London");
