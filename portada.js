(() => {
  const filterInput = document.querySelector("#subject-filter");
  const subjectCards = [...document.querySelectorAll("[data-subject-card]")];

  if (!filterInput || subjectCards.length === 0) {
    return;
  }

  const normalize = (value) =>
    value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  filterInput.addEventListener("input", () => {
    const query = normalize(filterInput.value.trim());
    let visibleIndex = 0;

    subjectCards.forEach((card) => {
      const matches = normalize(card.textContent).includes(query);
      card.hidden = !matches;

      if (query && matches) {
        card.style.gridColumn = String((visibleIndex % 2) + 1);
        card.style.gridRow = String(Math.floor(visibleIndex / 2) + 1);
        visibleIndex += 1;
      } else if (!query) {
        card.style.removeProperty("grid-column");
        card.style.removeProperty("grid-row");
      }
    });
  });
})();
