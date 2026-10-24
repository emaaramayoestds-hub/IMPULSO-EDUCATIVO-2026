(() => {
  const heading = document.querySelector("[data-section-list-heading]");
  const resourceList = document.querySelector("[data-section-resource-list]");
  const sectionLinks = [...document.querySelectorAll("[data-section-link]")];

  if (!heading || !resourceList || sectionLinks.length === 0) {
    console.error("Faltan los controles de secciones o su lista de recursos.");
    return;
  }

  resourceList.parentElement.classList.add("section-resource-panel");

  const getSectionTitle = (link) => {
    const title = link.cloneNode(true);
    title.querySelectorAll(".text2, .text3").forEach((count) => count.remove());
    return title.textContent.trim();
  };
  const sections = new Map(
    sectionLinks.map((link) => [
      link.dataset.sectionLink,
      getSectionTitle(link),
    ])
  );
  const params = new URLSearchParams(window.location.search);
  const requestedSection =
    params.get("seccion") ?? sectionLinks[0].dataset.sectionLink;
  const sectionTitle = sections.get(requestedSection);
  const cards = [
    ...resourceList.querySelectorAll(".resource-card, .resource-card2"),
  ].filter((card) => {
    if (sections.has(card.dataset.section)) {
      return true;
    }
    card.remove();
    return false;
  });
  let visibleCount = 0;

  cards.forEach((card) => {
    const isVisible = card.dataset.section === requestedSection;
    card.hidden = !isVisible;
    if (isVisible) {
      visibleCount += 1;
    }
  });

  sectionLinks.forEach((link) => {
    link.removeAttribute("aria-current");
    const count = cards.filter(
      (card) => card.dataset.section === link.dataset.sectionLink
    ).length;
    const countLabel = link.querySelector(".text2 > div, .text3 > div");
    if (countLabel) {
      countLabel.textContent = String(count);
    }
    if (link.dataset.sectionLink === requestedSection) {
      link.setAttribute("aria-current", "page");
    }
  });

  heading.textContent = sectionTitle
    ? `${sectionTitle} — ${visibleCount} archivos`
    : "Sección no encontrada";
  resourceList.hidden = visibleCount === 0;

  const emptyState = document.createElement("p");
  emptyState.className = "section-empty-state";
  emptyState.setAttribute("role", "status");
  emptyState.textContent = sectionTitle
    ? "Todavía no hay contenidos en esta sección."
    : "La sección solicitada no existe.";
  resourceList.insertAdjacentElement("afterend", emptyState);
  emptyState.hidden = visibleCount > 0;

  if (params.has("seccion")) {
    const backLink = document.createElement("a");
    backLink.className = "section-back-link";
    backLink.href = "./";
    backLink.textContent = "Volver a las secciones";
    emptyState.insertAdjacentElement("afterend", backLink);
  }

  document.title = sectionTitle
    ? `${sectionTitle} | Repositorio Educativo`
    : "Sección no encontrada";
})();
