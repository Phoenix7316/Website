(() => {
  "use strict";

  if (window.__feynmanCycleLoaded) return;
  window.__feynmanCycleLoaded = true;

  const mount = document.querySelector("#feynman-cycle");
  if (!mount) return;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const style = document.createElement("style");

  style.textContent = `
    /* Feynman cycling animation */

    #feynman-cycle {
      --paper: #f5f3ed;
      --ink: #191919;
      --red: #d52b1e;
      --muted: #706e67;

      position: relative;
      display: block;
      width: 100%;
      height: 215px;
      margin: 1.5rem 0 2.5rem;
      overflow: hidden;

      background: var(--paper);
      border-top: 1px solid #dedbd2;
      border-bottom: 1px solid #dedbd2;
      isolation: isolate;
    }

    #feynman-cycle .feynman-track {
      position: absolute;
      inset: 0 0 65px;
      overflow: hidden;
    }

    #feynman-cycle .feynman-ground {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 12px;
      height: 1px;
      background: #bdb8ac;
    }

    #feynman-cycle .feynman-rider {
      position: absolute;
      top: 5px;
      left: 0;
      width: 205px;
      height: 135px;

      animation: feynman-ride 9s linear forwards;
      will-change: transform;
    }

    #feynman-cycle .feynman-rider svg {
      display: block;
      width: 100%;
      height: 100%;
      overflow: visible;
    }

    #feynman-cycle .feynman-wheel {
      transform-box: view-box;
      transform-origin: center;
      animation: feynman-wheel-spin 0.65s linear infinite;
    }

    #feynman-cycle .feynman-pedal {
      transform-box: view-box;
      transform-origin: center;
      animation: feynman-pedal 0.65s linear infinite;
    }

    #feynman-cycle .feynman-equation {
      position: absolute;
      top: 105px;
      left: 0;

      max-width: min(190px, 42vw);
      padding: 5px 9px;

      color: var(--ink);
      background: rgba(245, 243, 237, 0.96);
      border: 1px solid #d5d0c5;
      border-bottom: 2px solid var(--red);

      font-family: Georgia, serif;
      font-size: clamp(0.75rem, 1.4vw, 0.95rem);
      white-space: normal;
      overflow-wrap: anywhere;

      opacity: 0;
      pointer-events: none;

      animation: feynman-equation-drop 1.25s
        cubic-bezier(.2,.7,.3,1) forwards;
    }

    #feynman-cycle .feynman-caption {
      position: absolute;
      right: 12px;
      top: 12px;

      color: var(--muted);
      font-family: Georgia, serif;
      font-size: 0.7rem;
      font-style: italic;
      letter-spacing: 0.04em;
    }

    @keyframes feynman-ride {
      from {
        transform: translateX(-225px);
      }
      to {
        transform: translateX(calc(100vw + 225px));
      }
    }

    @keyframes feynman-wheel-spin {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes feynman-pedal {
      to {
        transform: rotate(360deg);
      }
    }

    @keyframes feynman-equation-drop {
      0% {
        opacity: 0;
        transform: translateY(-25px) rotate(-5deg);
      }
      35% {
        opacity: 1;
      }
      75% {
        transform: translateY(48px) rotate(3deg);
      }
      88% {
        transform: translateY(40px) rotate(-2deg);
      }
      100% {
        opacity: 1;
        transform: translateY(45px) rotate(0);
      }
    }

    @media (max-width: 600px) {
      #feynman-cycle {
        height: 195px;
      }

      #feynman-cycle .feynman-rider {
        width: 165px;
        height: 112px;
      }

      #feynman-cycle .feynman-caption {
        font-size: 0.62rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      #feynman-cycle .feynman-rider,
      #feynman-cycle .feynman-wheel,
      #feynman-cycle .feynman-pedal,
      #feynman-cycle .feynman-equation {
        animation: none !important;
      }

      #feynman-cycle .feynman-rider {
        transform: translateX(12px);
      }

      #feynman-cycle .feynman-equation {
        opacity: 1;
        transform: none;
      }
    }
  `;

  document.head.appendChild(style);

  mount.innerHTML = `
    <div class="feynman-track">

      <div class="feynman-caption">
        A physicist, a bicycle, and a few equations
      </div>

      <div class="feynman-rider">
        <svg viewBox="0 0 220 145"
             xmlns="http://www.w3.org/2000/svg"
             role="img"
             aria-label="Stylized illustration of Richard Feynman riding a bicycle">

          <!-- Bicycle frame -->
          <g fill="none"
             stroke="#191919"
             stroke-width="2.8"
             stroke-linecap="round"
             stroke-linejoin="round">

            <circle cx="49" cy="108" r="28"/>
            <circle cx="166" cy="108" r="28"/>

            <path d="M49 108 L88 66 L113 108 L49 108"/>
            <path d="M88 66 L166 108"/>
            <path d="M113 108 L128 56 L166 108"/>
            <path d="M128 56 L145 56"/>
            <path d="M78 66 L96 66"/>

            <path d="M113 108 L101 120"/>
            <path d="M113 108 L125 120"/>

            <!-- Wheel spokes -->
            <g stroke="#aaa69c" stroke-width="1">
              <path d="M49 80 V136 M21 108 H77
                       M29 88 L69 128 M29 128 L69 88"/>
              <path d="M166 80 V136 M138 108 H194
                       M146 88 L186 128 M146 128 L186 88"/>
            </g>
          </g>

          <!-- Pedals -->
          <g class="feynman-pedal"
             fill="none"
             stroke="#191919"
             stroke-width="2.5">
            <circle cx="113" cy="108" r="5"/>
            <path d="M113 108 L126 119 M113 108 L100 97"/>
          </g>

          <!-- Feynman's body -->
          <g stroke="#191919"
             stroke-width="2.4"
             stroke-linecap="round"
             stroke-linejoin="round">

            <!-- Back and torso -->
            <path d="M85 49
                     Q102 39 119 51
                     L132 76
                     L112 91
                     L91 75 Z"
                  fill="#b83b2e"/>

            <!-- Neck -->
            <path d="M105 43 L104 54 L117 58 L119 46"
                  fill="#e5b996"/>

            <!-- Head -->
            <path d="M89 23
                     Q91 9 109 9
                     Q131 10 133 28
                     L130 43
                     Q124 57 110 55
                     Q94 53 89 38 Z"
                  fill="#e5b996"/>

            <!-- Hair -->
            <path d="M89 30
                     Q79 20 88 12
                     Q89 3 99 7
                     Q105 -1 114 7
                     Q126 0 132 12
                     Q142 19 133 30
                     L129 22
                     L122 17
                     L113 20
                     L102 15
                     L94 23 Z"
                  fill="#4a4036"/>

            <!-- Curly hair details -->
            <g fill="none" stroke="#4a4036" stroke-width="3">
              <path d="M88 17 Q80 10 86 7"/>
              <path d="M98 9 Q95 1 103 3"/>
              <path d="M115 8 Q120 0 126 8"/>
              <path d="M132 17 Q140 12 137 7"/>
            </g>

            <!-- Face -->
            <g fill="none" stroke="#191919" stroke-width="1.6">
              <path d="M99 31 L105 30"/>
              <path d="M116 30 L122 31"/>
              <circle cx="103" cy="34" r="1.5" fill="#191919"/>
              <circle cx="119" cy="34" r="1.5" fill="#191919"/>
              <path d="M111 34 L109 42 L114 43"/>
              <path d="M104 47 Q112 52 120 46"/>
            </g>

            <!-- Front arm -->
            <path d="M119 54
                     Q139 60 143 76
                     L133 83
                     Q125 68 111 65"
                  fill="none"
                  stroke="#e5b996"
                  stroke-width="8"/>

            <!-- Rear arm -->
            <path d="M96 55
                     Q83 60 78 73
                     L89 80
                     L103 66"
                  fill="none"
                  stroke="#e5b996"
                  stroke-width="8"/>

            <!-- Hands -->
            <circle cx="143" cy="76" r="4" fill="#e5b996"/>
            <circle cx="89" cy="80" r="4" fill="#e5b996"/>

            <!-- Trousers and legs -->
            <path d="M112 87
                     L126 92
                     L113 108
                     L96 100 Z"
                  fill="#343434"/>

            <path d="M96 99 L78 106 L82 114"
                  fill="none"
                  stroke="#343434"
                  stroke-width="9"/>

            <path d="M124 92 L133 105 L125 117"
                  fill="none"
                  stroke="#343434"
                  stroke-width="9"/>

            <!-- Shoes -->
            <path d="M77 109 Q68 108 66 116 L84 117"
                  fill="#191919"/>
            <path d="M120 116 Q119 124 132 123 L136 118"
                  fill="#191919"/>
          </g>
        </svg>
      </div>

      <div class="feynman-ground"></div>
    </div>
  `;

  if (reducedMotion) {
    const equations = [
      "E = mc²",
      "F = ma",
      "∇ · E = ρ / ε₀"
    ];

    equations.forEach((equation, index) => {
      const item = document.createElement("div");
      item.className = "feynman-equation";
      item.textContent = equation;
      item.style.left = `${8 + index * 29}%`;
      item.style.top = "125px";
      item.style.opacity = "1";
      item.style.transform = "none";
      mount.appendChild(item);
    });

    return;
  }

  // Equations dropped along the route.
  const equations = [
    "E = mc²",
    "F = ma",
    "∇ · E = ρ / ε₀",
    "∮ B · dl = μ₀ I",
    "iℏ ∂ψ / ∂t = Ĥψ",
    "Δx Δp ≥ ℏ / 2",
    "∇²φ = 0"
  ];

  const rider = mount.querySelector(".feynman-rider");
  const track = mount.querySelector(".feynman-track");

  let index = 0;

  function dropEquation() {
    if (index >= equations.length) return;

    const riderRect = rider.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();

    const equation = document.createElement("div");
    equation.className = "feynman-equation";
    equation.textContent = equations[index];

    // Place the equation near the cyclist.
    const desiredX =
      riderRect.left - trackRect.left + 105;

    const maxX = Math.max(
      8,
      track.clientWidth - 190
    );

    equation.style.left =
      `${Math.max(8, Math.min(desiredX, maxX))}px`;

    mount.appendChild(equation);

    index++;

    setTimeout(dropEquation, 1350);
  }

  // Begin after the cyclist has entered the page.
  setTimeout(dropEquation, 1100);

})();