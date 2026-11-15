/* =========================================
   FEYNMAN — REPEATED WELCOME ANIMATION
========================================= */

(() => {
  "use strict";

  const rider = document.getElementById("feynman-rider");
  if (!rider) return;

  const image = rider.querySelector(".feynman-rider-image");
  if (!image) return;

  // Respect reduced-motion preferences.
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  function startRide() {
    if (!image.naturalWidth) return;

    // Reset the rider to the starting position.
    rider.getAnimations().forEach(animation => animation.cancel());

    rider.style.setProperty("visibility", "visible", "important");
    rider.style.setProperty("opacity", "1", "important");
    rider.style.transform = "translateX(-110%)";

    const riderWidth = rider.getBoundingClientRect().width;
    const distance = window.innerWidth + riderWidth * 1.1;

    // Cycle across the viewport.
    const animation = rider.animate(
      [
        { transform: "translateX(-110%)" },
        { transform: `translateX(${distance}px)` }
      ],
      {
        duration:9000,
        easing: "linear",
        fill: "forwards"
      }
    );

    animation.onfinish = () => {
      rider.style.setProperty("visibility", "hidden", "important");
      rider.style.setProperty("opacity", "0", "important");
      animation.cancel();
    };
  }

  // Start when the GIF is ready.
  if (image.complete && image.naturalWidth > 0) {
    startRide();
  } else {
    image.addEventListener("load", startRide, { once: true });
  }

})();
