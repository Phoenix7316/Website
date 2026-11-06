
/* ============================================
   MATHBG — MATHEMATICAL BACKGROUND
   Jekyll | Vanilla JS | SVG
   Palette: Ivory / Charcoal / Editorial Red
   Layouts: Side margins / Adaptive whitespace
   ============================================ */

(() => {
  "use strict";



  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const params = new URLSearchParams(window.location.search);

  // Change layout using ?mathbg=side or ?mathbg=adaptive
  const layoutMode =
    params.get("mathbg") === "adaptive" ? "adaptive" : "side";

   // --------------------------------------------------
  // BACKGROUND STYLING
  // --------------------------------------------------

  const style = document.createElement("style");


  document.documentElement.dataset.mathbg = layoutMode;



  // --------------------------------------------
  // CREATE BACKGROUND SVG
  // --------------------------------------------

  const wrapper = document.createElement("div");
  wrapper.id = "math-background";
  wrapper.setAttribute("aria-hidden", "true");

  wrapper.innerHTML = `
    <svg viewBox="0 0 1200 800"
         preserveAspectRatio="xMidYMid slice"
         xmlns="http://www.w3.org/2000/svg">

      <defs>
        <linearGradient id="math-ribbon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#d52b1e" stop-opacity=".22"/>
          <stop offset="50%" stop-color="#b8a99a" stop-opacity=".20"/>
          <stop offset="100%" stop-color="#706e67" stop-opacity=".13"/>
        </linearGradient>
      </defs>


      <!-- TOP LEFT: CIRCLE CONSTRUCTION -->
      <g id="math-circle">
        <circle cx="145" cy="170" r="78"
                class="math-line"/>
        <circle cx="145" cy="170" r="53"
                class="math-muted-line"/>
        <circle cx="145" cy="170" r="4"
                class="math-dot"/>

        <path d="M55 170 H235 M145 80 V260"
              class="math-line"/>

        <path d="M90 115 L200 225 M200 115 L90 225"
              class="math-muted-line"/>

        <path d="M145 92 A78 78 0 0 1 223 170"
              class="math-red-line"/>
      </g>

      <!-- MOBIUS STRIP -->
      <g id="math-mobius-position">
        <g id="math-mobius-surface"
           class="math-mobius-surface"></g>

        <g id="math-mobius-mesh"
           class="math-mobius-mesh"></g>
      </g>

    </svg>
  `;

  document.body.prepend(wrapper);

  const surface = wrapper.querySelector(
    "#math-mobius-surface"
  );

  const mesh = wrapper.querySelector(
    "#math-mobius-mesh"
  );

  const mobiusPosition = wrapper.querySelector(
    "#math-mobius-position"
  );

  const svg = wrapper.querySelector("svg");

  // --------------------------------------------
  // LAYOUT POSITIONING
  // --------------------------------------------

  function positionElements() {
    const mobile = window.innerWidth <= 680;

    const positions = {
      side: {
        circle: [90, 0],
        polygon: [-80, 0],
        lower: [60, 0],
        wave: [-50, 0],
        spiral: [90, 0],
        mobiusX: mobile ? 1080 : 1090,
        mobiusY: 410,
        mobiusScale: mobile ? 0.55 : 0.72
      },

      adaptive: {
        circle: [100, 65],
        polygon: [-70, 70],
        lower: [-100, -25],
        wave: [100, 30],
        spiral: [-90, 65],
        mobiusX: mobile ? 1030 : 1020,
        mobiusY: mobile ? 460 : 420,
        mobiusScale: mobile ? 0.52 : 0.78
      }
    };

    const p = positions[layoutMode];

    const setPosition = (id, pos) => {
      wrapper.querySelector(id).setAttribute(
        "transform",
        `translate(${pos[0]} ${pos[1]})`
      );
    };

    

    mobiusPosition.setAttribute(
      "transform",
      `translate(${p.mobiusX} ${p.mobiusY})
       scale(${p.mobiusScale})`
    );
  }

  positionElements();

  window.addEventListener("resize", positionElements, {
    passive: true
  });

  // --------------------------------------------
  // MOBIUS STRIP MATHEMATICS
  // --------------------------------------------

  const TAU = Math.PI * 2;

  const R = 1.3;
  const W = 0.48;

  let angle = -0.45;
  let lastFrame = 0;
  let frameId = null;

  /*
    Parametric Möbius surface:

    x(u,v) = (R + v cos(u/2)) cos(u)
    y(u,v) = (R + v cos(u/2)) sin(u)
    z(u,v) = v sin(u/2)

    0 <= u <= 2π
    -W <= v <= W
  */

  function mobius(u, v) {
    const radius = R + v * Math.cos(u / 2);

    return {
      x: radius * Math.cos(u),
      y: radius * Math.sin(u),
      z: v * Math.sin(u / 2)
    };
  }

  // --------------------------------------------
  // 3D TO 2D PROJECTION
  // --------------------------------------------

  function project(p) {
    const pitch = 0.92;

    const x =
      p.x * Math.cos(angle) -
      p.y * Math.sin(angle);

    const y =
      p.x * Math.sin(angle) +
      p.y * Math.cos(angle);

    const projectedY =
      y * Math.cos(pitch) -
      p.z * Math.sin(pitch);

    const depth =
      y * Math.sin(pitch) +
      p.z * Math.cos(pitch);

    const perspective = 1 / (1 + depth * 0.045);

    return {
      x: 600 + x * 105 * perspective,
      y: 400 - projectedY * 105 * perspective,
      depth
    };
  }

  function makePath(points) {
    return "M" + points.map(p =>
      `${p.x.toFixed(2)},${p.y.toFixed(2)}`
    ).join(" L") + " Z";
  }

  // --------------------------------------------
  // RENDER MOBIUS SURFACE
  // --------------------------------------------

  function render() {
    const patches = [];
    const lines = [];

    const NU = 44;
    const NV = 10;

    // Build individual surface patches.
    for (let i = 0; i < NU; i++) {
      for (let j = 0; j < NV; j++) {
        const u0 = TAU * i / NU;
        const u1 = TAU * (i + 1) / NU;

        const v0 = -W + 2 * W * j / NV;
        const v1 = -W + 2 * W * (j + 1) / NV;

        const quad = [
          project(mobius(u0, v0)),
          project(mobius(u1, v0)),
          project(mobius(u1, v1)),
          project(mobius(u0, v1))
        ];

        const depth = quad.reduce(
          (sum, p) => sum + p.depth, 0
        ) / 4;

        patches.push({
          depth,
          path: makePath(quad),
          red: j < NV / 2
        });
      }
    }

    // Painter's algorithm.
    patches.sort((a, b) => a.depth - b.depth);

    surface.innerHTML = patches.map(p => `
      <path
        d="${p.path}"
        fill="${p.red ? '#d52b1e' : '#b8a99a'}"
        fill-opacity="${p.red ? '.16' : '.22'}"
      />
    `).join("");

    // Longitudinal mesh.
    for (let j = 0; j <= 10; j++) {
      const v = -W + 2 * W * j / 10;
      const points = [];

      for (let i = 0; i <= NU; i++) {
        points.push(
          project(mobius(TAU * i / NU, v))
        );
      }

      lines.push(
        "M" + points.map(p =>
          `${p.x.toFixed(2)},${p.y.toFixed(2)}`
        ).join(" L")
      );
    }

    // Cross-sectional mesh.
    for (let i = 0; i < 22; i++) {
      const u = TAU * i / 22;
      const points = [];

      for (let j = 0; j <= 12; j++) {
        const v = -W + 2 * W * j / 12;

        points.push(
          project(mobius(u, v))
        );
      }

      lines.push(
        "M" + points.map(p =>
          `${p.x.toFixed(2)},${p.y.toFixed(2)}`
        ).join(" L")
      );
    }

    mesh.innerHTML = lines.map(d =>
      `<path d="${d}"/>`
    ).join("");
  }

  // --------------------------------------------
  // ANIMATION CONTROL
  // --------------------------------------------

  function animate(time) {
    if (!document.body.contains(wrapper)) {
      stop();
      return;
    }

    // Approximately 24 FPS.
    if (!lastFrame || time - lastFrame >= 42) {
      const delta = lastFrame
        ? Math.min(time - lastFrame, 60)
        : 0;

      if (!reducedMotion.matches) {
        angle += delta * 0.00016;
      }

      render();
      lastFrame = time;
    }

    frameId = requestAnimationFrame(animate);
  }

  function start() {
    if (frameId !== null) return;

    lastFrame = 0;
    frameId = requestAnimationFrame(animate);
  }

  function stop() {
    if (frameId !== null) {
      cancelAnimationFrame(frameId);
      frameId = null;
    }
  }

  // --------------------------------------------
  // PAUSE WHEN TAB IS HIDDEN
  // --------------------------------------------

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stop();
    } else {
      start();
    }
  });

  // Pause when background is not visible.
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !document.hidden) {
      start();
    } else {
      stop();
    }
  });

  observer.observe(wrapper);

  reducedMotion.addEventListener("change", render);

  // Initial render.
  render();
  start();

})();


