const baseURL = "http://api.weatherapi.com/v1";
const endpoint = "/current.json";

const API_KEY = "3f222dfacdc7496d8f2111550263003";
const city = "Weingarten";
const lang = "de";

const spinner = document.querySelector(".lds-roller");
spinner.style.display = "none";

async function fetchCurrentWeather() {
  const url = `${baseURL}${endpoint}?key=${API_KEY}&lang=${lang}&q=${city}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
}

function displayData(data) {
  const titleEl = document.querySelector(".overview__title");
  const tempEl = document.querySelector(".overview__temperature");
  const tempNameEl = document.querySelector(".overview__temp-name");

  const cityName = data.location.name;
  const temp = data.current.temp_c;
  const tempName = data.current.condition.text;

  titleEl.innerText = cityName;
  tempEl.innerText = temp;
  tempNameEl.innerText = tempName;
}

async function main() {
  const data = await fetchCurrentWeather();
  displayData(data);
}

main();
