import { getConditionImagePath } from "./conditions";

export function displayData(data_current, data_forecast) {
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

  const app = document.querySelector("#app");
  const spinner = document.querySelector(".lds-roller");

  const detailsContainer = document.querySelector(".details");
  const overviewContainerEl = document.createElement("div");
  const titleEl = document.createElement("p");
  const currenttempEl = document.createElement("p");
  const detailsEl = document.createElement("div");
  const tempNameEl = document.createElement("p");
  const tempsEl = document.createElement("p");

  const forecastContainer = document.createElement("div");
  const forecastText = document.createElement("p");
  const paneViewEl = document.createElement("div");

  const cityName = data_current.location.name;
  const temp = data_current.current.temp_c;
  const tempName = data_current.current.condition.text;
  const minTemp = data_forecast.forecast.forecastday[0].day.mintemp_c;
  const maxTemp = data_forecast.forecast.forecastday[0].day.maxtemp_c;

  const forecastExtract = extract24hForecast(data_forecast);

  console.log(data_current, data_forecast);

  spinner.style.display = "none";

  // Top section
  overviewContainerEl.classList.add("overview");
  titleEl.classList.add("overview__title");
  currenttempEl.classList.add("overview__temperature");

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

  forecastText.innerText = `Heute ${data_current.current.condition.text}. Wind bis zu ${data_current.current.wind_kph} km/h`;

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
    detailsContainer.append(paneViewEl);
  });

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
    forecast3dContainer.append(forecast3dPaneView);
    detailsContainer.append(forecast3dContainer);
  });

  // Single details section
  const details = {
    Feuchtigkeit: `${data_current.current.humidity}%`,
    Gefühlt: `${data_current.current.feelslike_c}°`,
    Sonnenaufgang: data_forecast.forecast.forecastday[0].astro.sunrise,
    Sonnenuntergang: data_forecast.forecast.forecastday[0].astro.sunset,
    Niederschlag: `${data_current.current.precip_mm}mm`,
    "UV-Index": data_current.current.uv,
  };
  const singleDetailsEl = document.querySelector(".single-details");

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

  const imageCode = data_current.current.condition.code;
  const backgroundImage = getConditionImagePath(imageCode);
  app.classList.add("img");
  app.style.backgroundImage = `url(${backgroundImage})`;
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
