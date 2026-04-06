import { displayData } from "./details";

import { fetchCurrentWeather, fetchForecast } from "./fetch";

const cityEl = document.querySelector(".city");
const cityName = document.querySelector(".city-left__name").innerText;

cityEl.onclick = () => {
  main();
};

async function main() {
  const data_current = await fetchCurrentWeather(cityName);
  const data_forecast = await fetchForecast(cityName);
  location.assign("details.html");
  displayData(data_current, data_forecast);
}
