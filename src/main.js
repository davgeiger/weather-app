import { displayDataLarge, displayDataSmall, displayMain } from "./display";
import { fetchForecast } from "./fetch";
import { showSpinner } from "./spinner";

const cities = ["Mannheim", "Weingarten"];

async function main() {
  showSpinner();
  displayMain();

  for (const city of cities) {
    const forecast_data = await fetchForecast(city);
    displayDataSmall(forecast_data);
  }

  const cityEls = document.querySelectorAll(".city");

  for (const city of cityEls) {
    city.addEventListener("click", getSelected);
  }
}

async function getSelected(event) {
  const city = event.target
    .closest(".city")
    .querySelector(".city-left__name").innerText;
  const forecast_data = await fetchForecast(city);
  displayDataLarge(forecast_data);
}

main();
