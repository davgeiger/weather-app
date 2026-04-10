import { display } from "./display";
import { getSavedCities } from "./storage";

const cities = getSavedCities();

async function main() {
  display(cities);
}

main();
