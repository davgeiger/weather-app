export function showSpinner() {
  const app = document.querySelector(".container");

  app.innerHTML = `<div class="lds-roller position">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>;
`;
}
