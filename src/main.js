import { fetchCurrentWeather, fetchForecast } from "./fetch";

const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];

const spinner = document.querySelector(".lds-roller");
spinner.style.display = "none";

function displayData(data_current, data_forecast) {
  const titleEl = document.querySelector(".overview__title");
  const currenttempEl = document.querySelector(".overview__temperature");
  const tempNameEl = document.querySelector(".overview__temp-name");
  const tempsEl = document.querySelector(".overview__temps");

  const forecastText = document.querySelector(".forecast-24h__titletext");
  const paneViewEl = document.querySelector(".forecast-24h__pane-view");

  const pane3dViewEl = document.querySelector(".forecast-3d__pane-view");

  const cityName = data_current.location.name;
  const temp = data_current.current.temp_c;
  const tempName = data_current.current.condition.text;
  const minTemp = data_forecast.forecast.forecastday[0].day.mintemp_c;
  const maxTemp = data_forecast.forecast.forecastday[0].day.maxtemp_c;

  const forecastExtract = extract24hForecast(data_forecast);

  // Top section
  titleEl.innerText = cityName;
  currenttempEl.innerText = temp;
  tempNameEl.innerText = tempName;
  tempsEl.innerText = `H: ${maxTemp}° T: ${minTemp}°`;

  // 24h Forecast section
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
  });

  //  3d Forecast section
  const dayArray = data_forecast.forecast.forecastday;
  console.log(dayArray);
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
    pane3dViewEl.append(pane);
  });
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

async function main() {
  spinner.style.display = "block";
  const data_current = await fetchCurrentWeather();
  const data_forecast = await fetchForecast();
  spinner.style.display = "none";

  displayData(data_current, data_forecast);
}

main();
