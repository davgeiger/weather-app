import { getConditionImagePath } from "./conditions";
import { getSavedCities, deleteSavedCity, saveCity } from "./storage";
import { fetchForecast } from "./fetch";
import { showSpinner } from "./spinner";
import { dsearch } from "./search";

const app = document.querySelector(".container");

export function displayMain() {
  app.innerHTML = "";

  const titleContainer = document.createElement("div");
  const adjustButton = document.createElement("a");
  const mainTitle = document.createElement("h1");
  const inputContainer = document.createElement("div");
  const input = document.createElement("input");
  const searchContainer = document.createElement("div");
  const savedCities = document.createElement("div");

  app.style.backgroundImage = "";

  mainTitle.classList.add("title");
  titleContainer.classList.add("title-container");
  adjustButton.classList.add("adjust-button");
  inputContainer.classList.add("city-search");
  input.classList.add("city-search__input");
  searchContainer.classList.add("city-search__results");
  savedCities.classList.add("saved-cities");

  mainTitle.innerText = "Wetter";

  adjustButton.innerText = "Bearbeiten";
  adjustButton.addEventListener("click", addDeleteButtons);

  titleContainer.append(mainTitle, adjustButton);

  input.type = "text";
  input.id = "city-input";
  input.placeholder = "Nach Stadt suchen...";
  input.oninput = () => {
    dsearch(input.value);
  };

  inputContainer.append(input, searchContainer);

  app.append(titleContainer, inputContainer, savedCities);
}

export function displayDataSmall(data_forecast) {
  const savedCities = document.querySelector(".saved-cities");

  const cityContainer = document.createElement("div");
  const singleCity = document.createElement("div");
  const cityLeft = document.createElement("div");
  const cityNames = document.createElement("div");
  const cityName = document.createElement("p");
  const cityCountry = document.createElement("p");
  const cityWeatherInfo = document.createElement("p");
  const cityRight = document.createElement("div");
  const cityCurrTemp = document.createElement("p");
  const cityTempHiLo = document.createElement("p");

  const minTemp = data_forecast.forecast.forecastday[0].day.mintemp_c;
  const maxTemp = data_forecast.forecast.forecastday[0].day.maxtemp_c;

  cityContainer.classList.add("city-container");
  singleCity.classList.add("city");
  cityLeft.classList.add("city-left");
  cityNames.classList.add("city-left__names");
  cityName.classList.add("city-left__name");
  cityCountry.classList.add("city-left__country");
  cityWeatherInfo.classList.add("city-left__weather-info");
  cityRight.classList.add("city-right");
  cityCurrTemp.classList.add("city-right__curr-temp");
  cityTempHiLo.classList.add("city-right__temp-hilo");

  savedCities.append(cityContainer);
  cityContainer.append(singleCity);
  singleCity.append(cityLeft, cityRight);
  cityLeft.append(cityNames, cityWeatherInfo);
  cityNames.append(cityName, cityCountry);
  cityRight.append(cityCurrTemp, cityTempHiLo);

  cityName.innerText = data_forecast.location.name;
  cityCountry.innerText = data_forecast.location.country;
  cityWeatherInfo.innerText = data_forecast.current.condition.text;
  cityCurrTemp.innerText = `${data_forecast.current.temp_c}°`;
  cityTempHiLo.innerText = `H:${maxTemp}° T:${minTemp}°`;

  const imageCode = data_forecast.current.condition.code;
  const backgroundImage = getConditionImagePath(imageCode);

  singleCity.style.backgroundImage = `url(${backgroundImage})`;
}

export function displayDataLarge(data_forecast, id) {
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const detailsContainer = document.createElement("div");
  const overviewContainerEl = document.createElement("div");
  const titleEl = document.createElement("p");
  const currenttempEl = document.createElement("p");
  const detailsEl = document.createElement("div");
  const tempNameEl = document.createElement("p");
  const tempsEl = document.createElement("p");

  const forecastContainer = document.createElement("div");
  const forecastText = document.createElement("p");
  const paneViewEl = document.createElement("div");

  const cityName = data_forecast.location.name;
  const temp = data_forecast.current.temp_c;
  const tempName = data_forecast.current.condition.text;
  const minTemp = data_forecast.forecast.forecastday[0].day.mintemp_c;
  const maxTemp = data_forecast.forecast.forecastday[0].day.maxtemp_c;

  const forecastExtract = extract24hForecast(data_forecast);

  app.innerHTML = "";

  // Top section
  overviewContainerEl.classList.add("overview");
  titleEl.classList.add("overview__title");
  currenttempEl.classList.add("overview__temperature");

  detailsContainer.classList.add("details");
  detailsEl.classList.add("overview__details");
  tempNameEl.classList.add("overview__temp-name");
  tempsEl.classList.add("overview__temps");

  titleEl.innerText = cityName;
  currenttempEl.innerText = `${temp}°`;
  tempNameEl.innerText = tempName;
  tempsEl.innerText = `H: ${maxTemp}° T: ${minTemp}°`;

  detailsEl.append(tempNameEl, tempsEl);
  overviewContainerEl.append(titleEl, currenttempEl, detailsEl);
  detailsContainer.append(overviewContainerEl);

  // 24h Forecast section
  forecastContainer.classList.add("forecast-24h");
  forecastText.classList.add("forecast-24h__titletext");
  paneViewEl.classList.add("forecast-24h__pane-view");

  forecastText.innerText = `Heute ${data_forecast.current.condition.text}. Wind bis zu ${data_forecast.current.wind_kph} km/h`;

  forecastExtract.forEach((hour, index) => {
    let pane = document.createElement("div");
    let paneHour = document.createElement("p");
    let paneIcon = document.createElement("img");
    let paneTemp = document.createElement("p");

    pane.classList.add("pane-24h");
    paneHour.classList.add("pane-24h__hour");
    paneIcon.classList.add("pane-24h__icon");
    paneTemp.classList.add("pane-24h__temp");

    if (index === 0) {
      paneHour.innerText = "Jetzt";
    } else {
      paneHour.innerText = hour.time.slice(hour.time.indexOf(" "));
    }

    paneIcon.src = hour.condition.icon;
    paneTemp.innerText = `${hour.temp_c}°`;

    pane.append(paneHour, paneIcon, paneTemp);
    paneViewEl.append(pane);
  });

  forecastContainer.append(paneViewEl);

  //  3d Forecast section
  const forecast3dContainer = document.createElement("div");
  const forecast3dTitle = document.createElement("p");
  const forecast3dPaneView = document.createElement("div");

  forecast3dContainer.classList.add("forecast-3d");
  forecast3dTitle.classList.add("forecast-3d__titletext");
  forecast3dPaneView.classList.add("forecast-3d__pane-view");

  forecast3dTitle.innerText = "Vorhersage für die nächsten 3 Tage:";

  const dayArray = data_forecast.forecast.forecastday;
  dayArray.forEach((day, index) => {
    let pane = document.createElement("div");
    let paneDay = document.createElement("p");
    let paneIcon = document.createElement("img");
    let paneTemp = document.createElement("p");
    let paneWind = document.createElement("p");

    pane.classList.add("pane-3d");
    paneDay.classList.add("pane-3d__day");
    paneIcon.classList.add("pane-3d__icon");
    paneTemp.classList.add("pane-3d__temp");
    paneWind.classList.add("pane-3d__wind");

    if (index === 0) {
      paneDay.innerText = "Heute";
    } else {
      const weekDay = weekDays[new Date(day.date).getDay()];
      paneDay.innerText = weekDay;
    }

    paneIcon.src = day.day.condition.icon;
    paneTemp.innerText = `H:${day.day.maxtemp_c}°  T:${day.day.mintemp_c}°`;
    paneWind.innerText = `Wind: ${day.day.maxwind_kph} km/h`;

    pane.append(paneDay, paneIcon, paneTemp, paneWind);
    forecast3dPaneView.append(pane);
  });

  forecast3dContainer.append(forecast3dPaneView);

  // Single details section
  const details = {
    Feuchtigkeit: `${data_forecast.current.humidity}%`,
    Gefühlt: `${data_forecast.current.feelslike_c}°`,
    Sonnenaufgang: data_forecast.forecast.forecastday[0].astro.sunrise,
    Sonnenuntergang: data_forecast.forecast.forecastday[0].astro.sunset,
    Niederschlag: `${data_forecast.current.precip_mm}mm`,
    "UV-Index": data_forecast.current.uv,
  };

  const singleDetailsEl = document.createElement("div");
  singleDetailsEl.classList.add("single-details");

  for (let key in details) {
    const singlePane = document.createElement("div");
    const singlePaneTitle = document.createElement("p");
    const singlePaneText = document.createElement("p");

    singlePane.classList.add("single-details__pane-single");
    singlePaneTitle.classList.add("single-details__pane-title");
    singlePaneText.classList.add("single-details__pane-text");

    singlePaneTitle.innerText = key;
    singlePaneText.innerText = details[key];
    singlePane.append(singlePaneTitle, singlePaneText);
    singleDetailsEl.appendChild(singlePane);
  }

  const imageCode = data_forecast.current.condition.code;
  const backgroundImage = getConditionImagePath(imageCode);
  app.classList.add("detail-img");
  app.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${backgroundImage})`;

  insertButtons(cityName, id);
  app.append(overviewContainerEl);
  app.append(forecastContainer);
  app.append(forecast3dContainer);
  app.append(singleDetailsEl);
}

function extract24hForecast(data_forecast) {
  const currentHour = new Date().getHours();
  const dayArray = data_forecast.forecast.forecastday;
  let hours = [];

  dayArray.forEach((day) => {
    day.hour.forEach((hour) => {
      hours.push(hour);
    });
  });

  hours = hours.slice(currentHour, currentHour + 24);

  return hours;
}

function insertButtons(cityName, id) {
  const STORAGE_KEY = "saved-cities";

  app.innerHTML += `
  <div class="buttons">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="back-button">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </svg>  
  </div>
`;

  let cities = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const found = cities.find((city) => {
    return city.cityName === cityName;
  });

  if (found === undefined) {
    app.querySelector(".buttons").innerHTML += `
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="fav-button">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
  `;

    document.querySelector(".fav-button").addEventListener("click", () => {
      saveCity(cityName, id);
      document.querySelector(".fav-button").remove();
    });
  }

  document.querySelector(".back-button").addEventListener("click", () => {
    display();
  });
}

export async function display() {
  const cities = getSavedCities();
  const data = [];

  showSpinner();

  for (const city of cities) {
    const cityName = city.cityName;
    data.push(await fetchForecast(cityName));
  }

  displayMain();

  data.forEach((forecast_data) => {
    displayDataSmall(forecast_data);
  });

  const cityEls = document.querySelectorAll(".city");

  for (const city of cityEls) {
    city.addEventListener("click", getSelected);
  }
}

async function getSelected(event) {
  const city = event.target
    .closest(".city")
    .querySelector(".city-left__name").innerText;

  showSpinner();

  const forecast_data = await fetchForecast(city);
  displayDataLarge(forecast_data);
}

function addDeleteButtons(event) {
  const allCityEl = document.querySelectorAll(".city-container");
  const buttonName = event.target.innerText;

  if (buttonName === "Bearbeiten") event.target.innerText = "Fertig";
  else event.target.innerText = "Bearbeiten";

  allCityEl.forEach((city) => {
    const buttonEl = city.querySelector(".delete-button");
    if (buttonEl) {
      buttonEl.remove();
    } else {
      city.innerHTML =
        `<svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="delete-button"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>` + city.innerHTML;

      city.addEventListener("click", getSelected);
    }
  });

  const deleteButtons = document.querySelectorAll(".delete-button");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", deleteCity);
  });
}

function deleteCity(event) {
  const city = event.target
    .closest(".city-container")
    .querySelector(".city-left__name").innerText;

  deleteSavedCity(city);
  event.target.closest(".city-container").remove();
}
