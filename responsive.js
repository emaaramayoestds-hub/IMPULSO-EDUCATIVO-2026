(() => {
  const getDevice = () => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      return "movil";
    }
    if (window.matchMedia("(max-width: 1024px)").matches) {
      return "tablet";
    }
    return "desktop";
  };

  const routeToDevice = () => {
    const device = getDevice();
    const pathname = window.location.pathname;
    const subjectMatch = pathname.match(
      /^(.*)\/materias\/(?:(?:movil|tablet)\/)?(Fisica|Matematica|Quimica|SisDeRepr)(?:\/index\.html)?\/?$/
    );

    let destination;
    if (subjectMatch) {
      const [, basePath, subject] = subjectMatch;
      const devicePath = device === "desktop" ? "" : `${device}/`;
      destination = `${basePath}/materias/${devicePath}${subject}/`;
    } else {
      const basePath = pathname
        .replace(/\/index\.html$/, "")
        .replace(/\/(?:movil|tablet)\/?$/, "")
        .replace(/\/+$/, "");
      destination =
        device === "desktop"
          ? `${basePath}/`
          : `${basePath}/${device}/`;
    }

    if (destination !== pathname) {
      window.location.replace(destination);
    }
  };

  routeToDevice();
  window.addEventListener("resize", routeToDevice);
})();
