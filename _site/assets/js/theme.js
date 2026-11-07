/* =========================================
   THEME CONTROLLER
   Random dark palette selection
========================================= */

(() => {
  const root = document.documentElement;
  const button = document.getElementById("theme-toggle");
  const icon = document.getElementById("theme-icon");

  /* -----------------------------------------
     AVAILABLE DARK PALETTES
  ----------------------------------------- */

  const darkPalettes = [
    "aubergine",
    "midnight-blue",
    "deep-teal",
    "forest-night",
    "burgundy-noir",
    "charcoal-gold",
    "obsidian-violet",
    "graphite-ember",
    "arctic-night",
    "plum-dusk",
    "copper-night",
    "slate-mint"
  ];

  /* -----------------------------------------
     THEME ICONS
  ----------------------------------------- */

  const moonIcon = `
    <path d="M20.9 13A9 9 0 0 1 11 3.1
      9 9 0 1 0 20.9 13Z"/>
  `;

  const sunIcon = `
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="m4.93 4.93 1.42 1.42"/>
    <path d="m17.65 17.65 1.42 1.42"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="m4.93 19.07 1.42-1.42"/>
    <path d="m17.65 6.35 1.42-1.42"/>
  `;

  /* -----------------------------------------
     RANDOM PALETTE GENERATOR
     Avoids selecting the previous palette
  ----------------------------------------- */

  function getRandomPalette(currentPalette) {
    const available = darkPalettes.filter(
      palette => palette !== currentPalette
    );

    return available[
      Math.floor(Math.random() * available.length)
    ];
  }

  /* -----------------------------------------
     APPLY THEME
  ----------------------------------------- */

  function applyTheme(theme, palette) {
    root.dataset.theme = theme;

    if (theme === "dark") {
      const selectedPalette =
        darkPalettes.includes(palette)
          ? palette
          : "aubergine";

      root.dataset.darkPalette = selectedPalette;
    }

    const isDark = theme === "dark";

    // Update theme icon.
    if (icon) {
      icon.innerHTML = isDark ? sunIcon : moonIcon;
    }

    // Update button accessibility labels.
    if (button) {
      const label = isDark
        ? "Switch to light mode"
        : "Switch to dark mode";

      button.setAttribute("aria-label", label);
      button.setAttribute("title", label);
    }

    // Update browser theme colour.
    const themeColor = document.querySelector(
      'meta[name="theme-color"]'
    );

    if (themeColor) {
      themeColor.setAttribute(
        "content",
        isDark ? "#191824" : "#f5f3ed"
      );
    }
  }

  /* -----------------------------------------
     RESTORE SAVED THEME AND PALETTE
     Values are initialized in the HTML head
  ----------------------------------------- */

  const savedTheme = root.dataset.theme || "light";
  const savedPalette = root.dataset.darkPalette || "aubergine";

  applyTheme(savedTheme, savedPalette);

  /* -----------------------------------------
     THEME TOGGLE
  ----------------------------------------- */

  if (button) {
    button.addEventListener("click", () => {
      const currentlyDark = root.dataset.theme === "dark";

      if (currentlyDark) {

        // Switch to light mode.
        try {
          localStorage.setItem("theme", "light");
        } catch (error) {}

        applyTheme("light", root.dataset.darkPalette);

      } else {

        // Select a new random dark palette.
        const nextPalette = getRandomPalette(
          root.dataset.darkPalette
        );

        // Save theme and palette.
        try {
          localStorage.setItem("theme", "dark");
          localStorage.setItem("darkPalette", nextPalette);
        } catch (error) {}

        applyTheme("dark", nextPalette);
      }
    });
  }

})();