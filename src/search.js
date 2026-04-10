import { showSpinner } from "./spinner";
import { fetchForecast } from "./fetch";
import { displayDataLarge } from "./display";

const baseURL = "https://api.weatherapi.com/v1";
const endpoint_search = "/search.json";

const API_KEY = "13c229db6b6d457fb73142207261004";

async function search(input) {
  const results = await fetchResults(input);

  if (results === undefined) return;

  displayResults(results);
}

function displayResults(results) {
  const resultsContainer = document.querySelector(".city-search__results");

  removeResults();

  results.forEach((result) => {
    const singleResult = document.createElement("div");
    const city = document.createElement("p");
    const country = document.createElement("p");

    singleResult.classList.add("result");
    singleResult.setAttribute("id", result.id);
    city.classList.add("result__city");
    country.classList.add("result__country");

    city.innerText = result.name;
    country.innerText = result.country;

    singleResult.addEventListener("click", getSelected);

    singleResult.append(city, country);
    resultsContainer.appendChild(singleResult);
  });
}

function removeResults() {
  const results = document.querySelectorAll(".result");

  results.forEach((result) => result.remove());
}

async function fetchResults(input) {
  if (input === "") {
    removeResults();
    return;
  }

  const url = `${baseURL}${endpoint_search}?key=${API_KEY}&q=${input}`;
  const response = await fetch(url);
  const json = response.json();
  return json;
}

function debounce(func, delay) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

async function getSelected(event) {
  const city = event.target
    .closest(".result")
    .querySelector(".result__city").innerText;
  const cityID = event.target.closest(".result").id;

  showSpinner();

  const forecast_data = await fetchForecast(city);
  displayDataLarge(forecast_data, cityID);
}

export const dsearch = debounce(search, 500);
