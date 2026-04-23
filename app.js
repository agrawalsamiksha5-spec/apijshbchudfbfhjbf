const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const currentWeather = document.getElementById("currentWeather");
const forecast = document.getElementById("forecast");
const loader = document.getElementById("loader");
const errorMsg = document.getElementById("errorMsg");

function showLoader() {
  loader.classList.remove("hidden");
}

function hideLoader() {
  loader.classList.add("hidden");
}

function showError(msg) {
  errorMsg.innerText = msg;
}

function displayCurrent(data) {
  currentWeather.innerHTML = `
    <h2>${data.name}</h2>
    <p>${data.weather[0].description}</p>
    <h3>${data.main.temp}°C</h3>
  `;
}

function displayForecast(data) {
  const daily = data.list.filter(d => d.dt_txt.includes("12:00:00"));

  forecast.innerHTML = daily.map(day => `
    <div class="forecast__card">
      <p>${day.dt_txt.split(" ")[0]}</p>
      <p>${day.main.temp}°C</p>
    </div>
  `).join("");
}

async function loadWeather(city) {
  showLoader();

  try {
    const weather = await fetchWeather(city);
    displayCurrent(weather);

    const forecastData = await fetchForecast(city);
    displayForecast(forecastData);

    savePreferences({ city });

  } catch (err) {
    showError(err.message);
  } finally {
    hideLoader();
  }
}

searchBtn.addEventListener("click", () => {
  loadWeather(cityInput.value);
});

const prefs = loadPreferences();
loadWeather(prefs.city);