(() => {
  const sections = new Map([
    ["operaciones-combinadas", "Operaciones combinadas"],
    ["ecuacion-funcion-lineal", "Ecuación y función lineal"],
    ["ecuacion-funcion-cuadratica", "Ecuación y función cuadratica"],
  ]);
  const requestedSection = new URLSearchParams(window.location.search).get(
    "seccion"
  );

  if (requestedSection === null) {
    return;
  }

  const heading = document.querySelector("[data-section-list-heading]");
  const resourceList = document.querySelector("[data-section-resource-list]");

  if (!heading || !resourceList) {
    console.error("Falta el contenedor de la lista de recursos de Matemática.");
    return;
  }

  const cards = [
    ...resourceList.querySelectorAll(".resource-card, .resource-card2"),
  ];
  const sectionLinks = [...document.querySelectorAll("[data-section-link]")];
  const sectionTitle = sections.get(requestedSection);
  let visibleCount = 0;

  cards.forEach((card) => {
    const isVisible = card.dataset.section === requestedSection;
    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  sectionLinks.forEach((link) => {
    const sectionCount = cards.filter(
      (card) => card.dataset.section === link.dataset.sectionLink
    ).length;
    const countLabel = link.querySelector(".text3 > div");
    if (countLabel) {
      countLabel.textContent = String(sectionCount);
    }
    if (link.dataset.sectionLink === requestedSection) {
      link.setAttribute("aria-current", "page");
    }
  });

  heading.textContent = sectionTitle
    ? `${sectionTitle} — ${visibleCount} archivos`
    : "Sección no encontrada";
  resourceList.hidden = visibleCount === 0;

  const backLink = document.createElement("a");
  backLink.className = "section-back-link";
  backLink.href = "./";
  backLink.textContent = "Volver a Matemáticas";
  heading.insertAdjacentElement("afterend", backLink);

  const emptyState = document.createElement("p");
  emptyState.className = "section-empty-state";
  emptyState.setAttribute("role", "status");
  emptyState.textContent = sectionTitle
    ? "Todavía no hay contenidos en esta sección."
    : "La sección solicitada no existe.";
  resourceList.insertAdjacentElement("afterend", emptyState);
  emptyState.hidden = visibleCount > 0;
  document.title = sectionTitle
    ? `${sectionTitle} | Matemáticas`
    : "Sección no encontrada | Matemáticas";
})();
