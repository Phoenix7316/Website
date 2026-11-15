(() => {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const TAU = Math.PI * 2;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // ==================================================
  // 01. SURFACE DEFINITIONS
  // ==================================================

  const SURFACES = {

    // 01. Möbius strip
    "mobius": {
      u: [0, TAU],
      v: [-1.45, 1.45],
      point: (u, v) => {
        const h = u / 2;
        const r = 1.3 + 0.5 * v * Math.cos(h);

        return [
          r * Math.cos(u),
          r * Math.sin(u),
          0.5 * v * Math.sin(h)
        ];
      }
    },

    // 02. Torus
    "torus": {
      u: [0, TAU],
      v: [0, TAU],
      point: (u, v) => {
        const r = 0.62 + 0.28 * Math.cos(v);

        return [
          r * Math.cos(u),
          r * Math.sin(u),
          0.28 * Math.sin(v)
        ];
      }
    },

    // 03. Klein bottle immersion
    "klein-bottle": {
      u: [0, TAU],
      v: [0, TAU],
      point: (u, v) => {
        const a = 2.2 * (1 - Math.cos(u) / 2);

        let x, y;

        if (u < Math.PI) {
          x = 3 * Math.cos(u) * (1 + Math.sin(u))
            + a * Math.cos(u) * Math.cos(v);

          y = 8 * Math.sin(u)
            + a * Math.sin(u) * Math.cos(v);
        } else {
          x = 3 * Math.cos(u) * (1 + Math.sin(u))
            - a * Math.cos(v);

          y = 8 * Math.sin(u);
        }

        const z = a * Math.sin(v);

        return [x / 8, y / 8, z / 8];
      }
    },

    // 04. Enneper surface
    "enneper": {
      u: [-1.25, 1.25],
      v: [-1.25, 1.25],
      point: (u, v) => [
        u - u ** 3 / 3 + u * v ** 2,
        v - v ** 3 / 3 + v * u ** 2,
        u ** 2 - v ** 2
      ].map(x => x * 0.65)
    },

    // 05. Catenoid
    "catenoid": {
      u: [0, TAU],
      v: [-1.15, 1.15],
      point: (u, v) => [
        0.55 * Math.cosh(v) * Math.cos(u),
        0.55 * Math.cosh(v) * Math.sin(u),
        0.55 * v
      ]
    },

    // 06. Helicoid
    "helicoid": {
      u: [-1.25, 1.25],
      v: [-Math.PI, Math.PI],
      point: (u, v) => [
        u * Math.cos(v),
        u * Math.sin(v),
        0.38 * v
      ]
    },

    // 07. Scherk's first minimal surface
    "scherk-first": {
        u: [-1.4, 1.4],
        v: [-1.4, 1.4],

        point: (u, v) => {
          const d = Math.sqrt(
            1 + Math.cosh(u) ** 2 * Math.cosh(v) ** 2
          );

          return [
            u,
            v,
            Math.log(
              Math.cosh(v) / Math.cosh(u)
            )
          ];
        }
      },

    // 08. Scherk's second (doubly periodic) minimal surface
    "scherk-second": {
      u: [-1.4, 1.4],
      v: [0, TAU],

      point: (u, v) => {
        const d = Math.cosh(u) - Math.cos(v);

        return [
          Math.sinh(u) * Math.cos(v) / d,
          Math.sinh(u) * Math.sin(v) / d,
          Math.log(d)
        ];
      }
    },

    // 09. Hyperbolic paraboloid
    "saddle": {
      u: [-1.4, 1.4],
      v: [-1.4, 1.4],
      point: (u, v) => [
        u,
        v,
        0.38 * (u * u - v * v)
      ]
    },

    // 10. Monkey saddle
    "monkey-saddle": {
      u: [-1.35, 1.35],
      v: [-1.35, 1.35],
      point: (u, v) => [
        u,
        v,
        0.19 * (u ** 3 - 3 * u * v ** 2)
      ]
    },

    // 11. Paraboloid
    "paraboloid": {
      u: [0, TAU],
      v: [0, 1.5],
      point: (u, v) => [
        v * Math.cos(u),
        v * Math.sin(u),
        0.48 * v * v
      ]
    },

    // 12. Riemann-style periodic minimal-surface study
    "riemann-minimal": {
      u: [-1.35, 1.35],
      v: [-1.35, 1.35],
      point: (u, v) => {
        const a = 1 + 0.28 * Math.cos(2 * u);
        const b = 1 + 0.28 * Math.cos(2 * v);

        return [
          u,
          v,
          0.48 * Math.log(a / b)
        ];
      }
    },

    // 13. Costa-inspired minimal-surface study
    "costa": {
      u: [0, TAU],
      v: [-1.15, 1.15],
      point: (u, v) => {
        const r = 0.85 + 0.32 * Math.cos(2 * u)
          * Math.cos(v);

        return [
          r * Math.cos(u),
          r * Math.sin(u),
          0.55 * Math.sin(2 * u) * Math.sin(v)
            + 0.25 * Math.sin(3 * v)
        ];
      }
    },

    // 14. Cross-cap / Whitney umbrella
    "cross-cap": {
      u: [-1.15, 1.15],
      v: [-1.15, 1.15],
      point: (u, v) => [
        0.9 * u,
        0.9 * u * v,
        0.65 * v * v
      ]
    },

        // 15. Dini surface
    "dini": {
      u: [0.15, 4.5 * Math.PI],
      v: [0.15, 1.35],
      point: (u, v) => [
        0.55 * Math.cos(u) * Math.sin(v),
        0.55 * Math.sin(u) * Math.sin(v),
        0.55 * (
          Math.cos(v) + Math.log(Math.tan(v / 2))
        ) + 0.12 * u
      ]
    },

    // 16. Henneberg surface
    "henneberg": {
      u: [-1.4, 1.4],
      v: [-Math.PI, Math.PI],
      point: (u, v) => [
        2 * Math.sinh(u) * Math.cos(v)
          - (2 / 3) * Math.sinh(3 * u) * Math.cos(3 * v),

        2 * Math.sinh(u) * Math.sin(v)
          + (2 / 3) * Math.sinh(3 * u) * Math.sin(3 * v),

        2 * Math.cosh(2 * u) * Math.cos(2 * v)
      ]
    },
    
    // 17. Kuen surface
    "kuen": {
      u: [-4.5, 4.5],
      v: [-2.0, 2.0],

      point: (u, v) => {
        const ch = Math.cosh(v);
        const sh = Math.sinh(v);
        const denominator = ch * ch + u * u;

        return [
          2 * ch * (Math.cos(u) + u * Math.sin(u))
            / denominator,

          2 * ch * (-u * Math.cos(u) + Math.sin(u))
            / denominator,

          v - (2 * sh * ch) / denominator
        ];
      }
    }
  };

  // ==================================================
  // 02. RENDERING SETTINGS
  // ==================================================

  const SETTINGS = {
    uSegments: 56,
    vSegments: 10,
    curveSamples: 90,

    meshColour: "#D0D0D0",
    meshWidth: "1.0",
    meshOpacity: "0.95",

    accentColour: "var(--red)",
    accentWidth: "1.5",

    surfaceOpacity: 0.30,

    rotationSpeed: 0.17
  };


  // ==================================================
  // 03. THREE-DIMENSIONAL ROTATION
  // ==================================================

  function rotate(point, ax, ay, az) {
    let [x, y, z] = point;

    let c = Math.cos(ax);
    let s = Math.sin(ax);

    let y1 = y * c - z * s;
    let z1 = y * s + z * c;

    y = y1;
    z = z1;

    c = Math.cos(ay);
    s = Math.sin(ay);

    let x1 = x * c + z * s;
    z1 = -x * s + z * c;

    x = x1;
    z = z1;

    c = Math.cos(az);
    s = Math.sin(az);

    x1 = x * c - y * s;
    y1 = x * s + y * c;

    return [x1, y1, z];
  }


  // ==================================================
  // 04. SVG HELPERS
  // ==================================================

  function svgElement(name) {
    return document.createElementNS(NS, name);
  }

  function createPath(group, colour, width, opacity) {
    const path = svgElement("path");

    path.setAttribute("fill", "none");
    path.setAttribute("stroke", colour);
    path.setAttribute("stroke-width", width);
    path.setAttribute("stroke-opacity", opacity);
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.setAttribute("vector-effect", "non-scaling-stroke");

    group.appendChild(path);

    return path;
  }


  // ==================================================
  // 05. AUTOMATIC SVG VIEWBOX
  // ==================================================

  function calculateSurfaceViewBox(definition) {
    const samplesU = 128;
    const samplesV = 64;

    let maxRadius = 0;

    for (let i = 0; i <= samplesU; i++) {
      const u = definition.u[0]
        + (i / samplesU) * (definition.u[1] - definition.u[0]);

      for (let j = 0; j <= samplesV; j++) {
        const v = definition.v[0]
          + (j / samplesV) * (definition.v[1] - definition.v[0]);

        const point = definition.point(u, v);

        const radius = Math.hypot(
          point[0],
          point[1],
          point[2]
        );

        maxRadius = Math.max(maxRadius, radius);
      }
    }

    const safeRadius = maxRadius * 1.10;
    const minimumPerspective = 1.65 - safeRadius * 0.10;

    if (minimumPerspective <= 0) {
      console.warn(
        "Surface exceeds the supported projection range."
      );

      return "-4 -4 8 8";
    }

    const projectedRadius = safeRadius / minimumPerspective;

    const halfWidth = projectedRadius * 1.12;
    const halfHeight = projectedRadius * 0.88 * 1.12;

    return [
      -halfWidth,
      -halfHeight,
      halfWidth * 2,
      halfHeight * 2
    ].join(" ");
  }


  // ==================================================
  // 06. CREATE ONE SURFACE
  // ==================================================

  function createSurface(element) {
    const name = element.dataset.surface;
    const definition = SURFACES[name];

    if (!definition) {
      console.warn(`Unknown Riemann surface: "${name}".`);
      return () => {};
    }

    if (element.dataset.surfaceReady === "true") {
      return () => {};
    }

    element.dataset.surfaceReady = "true";


    // --------------------------------------------------
    // SVG VIEWPORT
    // --------------------------------------------------

    const svg = svgElement("svg");

    const viewBox = calculateSurfaceViewBox(definition);

    svg.setAttribute("viewBox", viewBox);
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
    svg.setAttribute("aria-hidden", "true");

    svg.style.width = "100%";
    svg.style.height = "100%";
    svg.style.position = "absolute";
    svg.style.left = "0";
    svg.style.top = "0";


    // --------------------------------------------------
    // VIEWBOX CENTRE
    // --------------------------------------------------

    const [viewX, viewY, viewWidth, viewHeight] =
      viewBox.split(/\s+/).map(Number);

    const centreX = viewX + viewWidth / 2;
    const centreY = viewY + viewHeight / 2;


    // --------------------------------------------------
    // SVG DRAWING GROUPS
    // --------------------------------------------------

    const drawingGroup = svgElement("g");

    drawingGroup.setAttribute(
      "class",
      "riemannsurface-drawing"
    );

    const fillGroup = svgElement("g");
    const meshGroup = svgElement("g");
    const accentGroup = svgElement("g");

    drawingGroup.append(
      fillGroup,
      meshGroup,
      accentGroup
    );

    svg.appendChild(drawingGroup);
    element.appendChild(svg);


    // ==================================================
    // 07. DYNAMIC DRAWING SCALE
    // ==================================================

    function updateDrawingScale() {
      const styles = getComputedStyle(element);

      let scale = parseFloat(
        styles.getPropertyValue("--riemann-drawing-scale")
      );

      if (!Number.isFinite(scale)) {
        scale = 1;
      }

      // Prevent accidental zero or extreme scaling.
      scale = Math.max(0.10, Math.max(scale, 2.5));

      /*
       * Scale around the centre of the calculated viewBox.
       *
       * x' = centreX + scale * (x - centreX)
       * y' = centreY + scale * (y - centreY)
       *
       * This keeps every surface centred regardless of
       * its geometry or mathematical parameterisation.
       */

      const translateX = centreX * (1 - scale);
      const translateY = centreY * (1 - scale);

      drawingGroup.setAttribute(
        "transform",
        `translate(${translateX} ${translateY}) scale(${scale})`
      );
    }

    // Apply the initial responsive scale.
    updateDrawingScale();

    // Observe container changes.
    let resizeObserver = null;

    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(() => {
        updateDrawingScale();
      });

      resizeObserver.observe(element);
    }

    // Also handle viewport and media-query changes.
    window.addEventListener("resize", updateDrawingScale, {
      passive: true
    });


    // ==================================================
    // 08. PARAMETRIC DOMAIN
    // ==================================================

    const [uMin, uMax] = definition.u;
    const [vMin, vMax] = definition.v;

    const U = SETTINGS.uSegments;
    const V = SETTINGS.vSegments;


    // ==================================================
    // 09. THREE-DIMENSIONAL PROJECTION
    // ==================================================

    function project(u, v, time) {
      const point = definition.point(u, v);

      const p = rotate(
        point,
        0.88 + 0.17 * Math.sin(time * 0.25),
        time * 0.18,
        time * 0.12
      );

      const perspective = 1 / (1.65 - p[2] * 0.10);

      return {
        x: p[0] * perspective,
        y: -p[1] * perspective * 0.88,
        z: p[2]
      };
    }


    // ==================================================
    // 10. SURFACE CELLS
    // ==================================================

    const cells = [];

    for (let i = 0; i < U; i++) {
      for (let j = 0; j < V; j++) {
        const polygon = svgElement("polygon");

        polygon.setAttribute("stroke", "none");
        polygon.setAttribute(
          "vector-effect",
          "non-scaling-stroke"
        );

        fillGroup.appendChild(polygon);

        cells.push({ i, j, polygon });
      }
    }


    // ==================================================
    // 11. WIREFRAME CURVES
    // ==================================================

    const meshCurves = [];

    // Curves along the u direction.
    for (let j = 0; j <= 8; j++) {
      meshCurves.push({
        path: createPath(
          meshGroup,
          SETTINGS.meshColour,
          SETTINGS.meshWidth,
          SETTINGS.meshOpacity
        ),
        type: "u",
        value: vMin + (j / 8) * (vMax - vMin)
      });
    }

    // Curves along the v direction.
    for (let j = 0; j < 20; j++) {
      meshCurves.push({
        path: createPath(
          meshGroup,
          SETTINGS.meshColour,
          SETTINGS.meshWidth,
          SETTINGS.meshOpacity
        ),
        type: "v",
        value: uMin + (j / 20) * (uMax - uMin)
      });
    }

    // Accent-coloured central curve.
    const accentPath = createPath(
      accentGroup,
      SETTINGS.accentColour,
      SETTINGS.accentWidth,
      "0.99"
    );


    // ==================================================
    // 12. SURFACE COLOUR
    // ==================================================

    function cellColour(u, v) {
      const pattern = Math.sin(u * 1.4 + v * 1.1);

      return pattern > 0.15
        ? "var(--red)"
        : "var(--riemann-neutral)";
    }


    // ==================================================
    // 13. DRAW SURFACE CELLS
    // ==================================================

    function drawSurface(time) {
      const ordered = [];

      cells.forEach(cell => {
        const u0 = uMin + (cell.i / U) * (uMax - uMin);
        const u1 = uMin + ((cell.i + 1) / U) * (uMax - uMin);

        const v0 = vMin + (cell.j / V) * (vMax - vMin);
        const v1 = vMin + ((cell.j + 1) / V) * (vMax - vMin);

        const points = [
          project(u0, v0, time),
          project(u1, v0, time),
          project(u1, v1, time),
          project(u0, v1, time)
        ];

        const depth = points.reduce(
          (sum, p) => sum + p.z,
          0
        ) / points.length;

        ordered.push({
          polygon: cell.polygon,
          points,
          depth,
          colour: cellColour(
            (u0 + u1) / 2,
            (v0 + v1) / 2
          )
        });
      });

      ordered.sort((a, b) => a.depth - b.depth);

      ordered.forEach(cell => {
        cell.polygon.setAttribute(
          "points",
          cell.points.map(p =>
            `${p.x.toFixed(4)},${p.y.toFixed(4)}`
          ).join(" ")
        );

        cell.polygon.setAttribute("fill", cell.colour);

        cell.polygon.setAttribute(
          "fill-opacity",
          SETTINGS.surfaceOpacity
        );

        fillGroup.appendChild(cell.polygon);
      });
    }


    // ==================================================
    // 14. DRAW GRID CURVES
    // ==================================================

    function makeCurve(type, value, time) {
      const points = [];

      for (let i = 0; i <= SETTINGS.curveSamples; i++) {
        const t = i / SETTINGS.curveSamples;

        const u = type === "u"
          ? uMin + t * (uMax - uMin)
          : value;

        const v = type === "u"
          ? value
          : vMin + t * (vMax - vMin);

        points.push(project(u, v, time));
      }

      return points.map((p, i) =>
        `${i === 0 ? "M" : "L"}${p.x.toFixed(4)},${p.y.toFixed(4)}`
      ).join(" ");
    }


    // ==================================================
    // 15. DRAW WIREFRAME
    // ==================================================

    function drawMesh(time) {
      meshCurves.forEach(curve => {
        curve.path.setAttribute(
          "d",
          makeCurve(curve.type, curve.value, time)
        );
      });

      const middleV = (vMin + vMax) / 2;

      accentPath.setAttribute(
        "d",
        makeCurve("u", middleV, time)
      );
    }


    // ==================================================
    // 16. COMPLETE FRAME
    // ==================================================

    function draw(time) {
      drawSurface(time);
      drawMesh(time);
    }

    draw(0);


    // ==================================================
    // 17. ANIMATION LIFECYCLE
    // ==================================================

    let frame = null;
    let startTime = null;
    let running = false;

    function animate(timestamp) {
      if (!running) return;

      if (startTime === null) {
        startTime = timestamp;
      }

      const elapsed =
        (timestamp - startTime) / 1000 * SETTINGS.rotationSpeed;

      draw(elapsed);

      frame = requestAnimationFrame(animate);
    }

    function start() {
      if (running || reducedMotion || document.hidden) return;

      running = true;
      startTime = null;

      frame = requestAnimationFrame(animate);
    }

    function stop() {
      running = false;

      if (frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
    }

    start();


    // ==================================================
    // 18. CLEANUP
    // ==================================================

    return () => {
      stop();

      window.removeEventListener(
        "resize",
        updateDrawingScale
      );

      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }


  // ==================================================
  // 19. INITIALISE SURFACES
  // ==================================================

  const cleanups = [];

  document
    .querySelectorAll(".riemannsurface[data-surface]")
    .forEach(element => {
      cleanups.push(createSurface(element));
    });

  window.addEventListener("pagehide", () => {
    cleanups.forEach(cleanup => cleanup());
  });

})();
