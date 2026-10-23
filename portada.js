(() => {
  const themeToggle = document.querySelector("[data-theme-toggle]");
  const page = document.querySelector("[data-theme-page]");
  const themeLabel = themeToggle?.querySelector(".tema-claro");
  const themeStorageKey = "edurepositorio-theme";

  if (themeToggle && page && themeLabel) {
    const darkClass = page.dataset.darkClass;
    const darkStylesheet = page.dataset.darkStylesheet;
    const sectionDarkStylesheet = page.dataset.sectionDarkStylesheet;
    const themeFixes = document.querySelector("[data-theme-fixes]");
    let isDark = false;
    let darkStylesheetLink;
    let sectionDarkStylesheetLink;

    try {
      isDark = localStorage.getItem(themeStorageKey) === "dark";
    } catch (error) {
      console.warn("No se pudo recuperar el tema guardado.", error);
    }

    const updateTheme = () => {
      page.classList.toggle("tema-oscuro", isDark);
      if (darkClass) {
        page.classList.toggle(darkClass, isDark);
      }

      if (darkStylesheet) {
        if (isDark && !darkStylesheetLink) {
          darkStylesheetLink = document.createElement("link");
          darkStylesheetLink.rel = "stylesheet";
          darkStylesheetLink.href = darkStylesheet;
          darkStylesheetLink.dataset.themeStylesheet = "";
          if (themeFixes) {
            themeFixes.before(darkStylesheetLink);
          } else {
            document.head.append(darkStylesheetLink);
          }
        } else if (!isDark && darkStylesheetLink) {
          darkStylesheetLink.remove();
          darkStylesheetLink = undefined;
        }
      }

      if (sectionDarkStylesheet) {
        if (isDark && !sectionDarkStylesheetLink) {
          sectionDarkStylesheetLink = document.createElement("link");
          sectionDarkStylesheetLink.rel = "stylesheet";
          sectionDarkStylesheetLink.href = sectionDarkStylesheet;
          sectionDarkStylesheetLink.dataset.themeSectionStylesheet = "";
          document.head.append(sectionDarkStylesheetLink);
        } else if (!isDark && sectionDarkStylesheetLink) {
          sectionDarkStylesheetLink.remove();
          sectionDarkStylesheetLink = undefined;
        }
      }

      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute(
        "aria-label",
        isDark ? "Activar tema claro" : "Activar tema oscuro"
      );
      themeLabel.textContent = isDark ? "TEMA CLARO" : "TEMA OSCURO";
    };

    updateTheme();

    themeToggle.addEventListener("click", () => {
      isDark = !isDark;
      updateTheme();

      try {
        localStorage.setItem(themeStorageKey, isDark ? "dark" : "light");
      } catch (error) {
        console.warn("No se pudo guardar el tema seleccionado.", error);
      }
    });
  }

  const revealPage = document.querySelector(
    ".portada-m-vil-claro, .repositorio-digital-educativo-mobile, .portada-tablet-claro, .repositorio-digital-educativo-tablet, .portada-escritorio-claro"
  );
  const revealCards = revealPage
    ? [
        ...revealPage.querySelectorAll(
          ".subject-card, .subject-card2, .subject-card3, .subject-card4"
        ),
      ]
    : [];

  if (revealCards.length > 0) {
    if ("IntersectionObserver" in window) {
      const cardObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle("is-in-view", entry.isIntersecting);
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
      );

      revealCards.forEach((card) => {
        card.classList.add("card-reveal");
        cardObserver.observe(card);
      });
    } else {
      revealCards.forEach((card) => {
        card.classList.add("card-reveal", "is-in-view");
      });
    }
  }

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
