/* =========================================
   THEME CONTROLLER
   Light/Dark Toggle + Random Palette
========================================= */

(() => {
  "use strict";

  const root = document.documentElement;

  const themeButton = document.getElementById("theme-toggle");
  const randomButton = document.getElementById("theme-randomizer");

  const themeIcon = document.getElementById("theme-icon");
  const randomIcon = document.getElementById("theme-randomizer-icon");

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
    "slate-mint",
    "graphite"
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

  const shuffleIcon = `
    <path d="m18 14 4 4-4 4"/>
    <path d="m18 2 4 4-4 4"/>
    <path d="M2 18h2.5a6 6 0 0 0 4.2-1.7L19.3 6.3A6 6 0 0 1 23 5"/>
    <path d="M2 6h2.5a6 6 0 0 1 4.2 1.7"/>
    <path d="m14 14 1.3 1.3a6 6 0 0 0 4.2 1.7H22"/>
  `;

  /* -----------------------------------------
     RANDOM PALETTE GENERATOR
     Avoids the currently active palette
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
     SAVE PREFERENCES
  ----------------------------------------- */

  function savePreferences(theme, palette) {
    try {
      localStorage.setItem("theme", theme);
      localStorage.setItem("darkPalette", palette);
    } catch (error) {
      // Theme still works if localStorage is unavailable.
    }
  }

  /* -----------------------------------------
     APPLY THEME
  ----------------------------------------- */

  function applyTheme(theme, palette) {
    const selectedPalette = darkPalettes.includes(palette)
      ? palette
      : "aubergine";

    root.dataset.theme = theme;
    root.dataset.darkPalette = selectedPalette;

    const isDark = theme === "dark";

    // Update light/dark icon.
    if (themeIcon) {
      themeIcon.innerHTML = isDark ? sunIcon : moonIcon;
    }

    // Update theme button accessibility.
    if (themeButton) {
      const label = isDark
        ? "Switch to light mode"
        : "Switch to dark mode";

      themeButton.setAttribute("aria-label", label);
      themeButton.setAttribute("title", label);
    }

    // Update randomiser accessibility.
    if (randomButton) {
      randomButton.setAttribute(
        "aria-label",
        "Choose a random dark colour palette"
      );

      randomButton.setAttribute(
        "title",
        "Randomise dark colour palette"
      );
    }

    // Update browser theme colour from active CSS.
    const themeColor = document.querySelector(
      'meta[name="theme-color"]'
    );

    if (themeColor) {
      const background = getComputedStyle(root)
        .getPropertyValue("--paper")
        .trim();

      themeColor.setAttribute(
        "content",
        background || (isDark ? "#000000" : "#f5f3ed")
      );
    }
  }

  /* -----------------------------------------
     RESTORE SAVED PREFERENCES
  ----------------------------------------- */

  const savedTheme = root.dataset.theme || "light";
  const savedPalette = root.dataset.darkPalette || "aubergine";

  applyTheme(savedTheme, savedPalette);

  /* -----------------------------------------
     1. LIGHT / DARK TOGGLE
     Changes appearance only.
     Does not randomise the palette.
  ----------------------------------------- */

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      const currentlyDark = root.dataset.theme === "dark";

      const nextTheme = currentlyDark ? "light" : "dark";
      const currentPalette = root.dataset.darkPalette;

      savePreferences(nextTheme, currentPalette);

      applyTheme(nextTheme, currentPalette);
    });
  }

  /* -----------------------------------------
     2. RANDOM PALETTE BUTTON
     Always switches to dark mode.
  ----------------------------------------- */

  if (randomButton) {
    randomButton.addEventListener("click", () => {
      const currentPalette = root.dataset.darkPalette;

      const nextPalette = getRandomPalette(currentPalette);

      savePreferences("dark", nextPalette);

      applyTheme("dark", nextPalette);
    });
  }

})();
