// ---------------------------------------------------------------------------
// Randomized animation: each page load picks a different combination of
// entrance style + color palette + stagger order, so no two reloads look the
// same. Click the title to re-roll without reloading.
// ---------------------------------------------------------------------------
(function () {
  "use strict";

  // Entrance keyframe names — these must match @keyframes in styles.css.
  const ENTRANCES = [
    "dropIn",
    "popIn",
    "swoopIn",
    "flipIn",
    "blurIn",
    "spinIn",
    "dropOutIn",
  ];

  // Each palette is a 3-color gradient applied to the letters.
  const PALETTES = [
    ["#00f5d4", "#9b5de5", "#f15bb5"], // neon
    ["#ff9a00", "#ff5e62", "#ff2079"], // sunset
    ["#00c6ff", "#0072ff", "#00ffa3"], // ocean
    ["#f72585", "#b5179e", "#7209b7"], // grape
    ["#aaff00", "#00ffa3", "#00d4ff"], // lime
    ["#f9d423", "#ff8008", "#ff2079"], // gold
    ["#e0c3fc", "#8ec5fc", "#a1ffce"], // pastel
  ];

  // How the per-letter stagger flows in.
  const ORDERS = ["forward", "reverse", "center-out", "random"];

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Compute the animation-delay index (--i) for each letter given an order.
  function staggerIndices(count, order) {
    const idx = Array.from({ length: count }, (_, i) => i);
    switch (order) {
      case "reverse":
        return idx.map((i) => count - 1 - i);
      case "center-out": {
        const mid = (count - 1) / 2;
        return idx.map((i) => Math.round(Math.abs(i - mid)));
      }
      case "random":
        return shuffle(idx);
      case "forward":
      default:
        return idx;
    }
  }

  function randomize() {
    const hello = document.querySelector(".hello");
    if (!hello) return;
    const letters = hello.querySelectorAll(".letter");

    const entrance = pick(ENTRANCES);
    const palette = pick(PALETTES);
    const order = pick(ORDERS);
    const indices = staggerIndices(letters.length, order);

    hello.style.setProperty("--enter", entrance);
    hello.style.setProperty("--c1", palette[0]);
    hello.style.setProperty("--c2", palette[1]);
    hello.style.setProperty("--c3", palette[2]);

    letters.forEach((letter, i) => {
      letter.style.setProperty("--i", indices[i]);
      // Restart the CSS animations so a re-roll (click) replays the entrance.
      letter.style.animation = "none";
      // Force reflow so the browser registers the reset before re-enabling.
      void letter.offsetWidth;
      letter.style.animation = "";
    });
  }

  randomize();

  // Re-roll on click (or Enter/Space) without a full reload — nice for demos.
  const hello = document.querySelector(".hello");
  if (hello) {
    hello.addEventListener("click", randomize);
  }
})();

// ---------------------------------------------------------------------------
// Twinkling starfield rendered on the <canvas> behind the text.
// ---------------------------------------------------------------------------
(function () {
  "use strict";

  const canvas = document.querySelector(".starfield");
  if (!canvas) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let stars = [];
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function makeStars() {
    const count = Math.round((width * height) / 9000);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.4 + 0.2,
      baseAlpha: Math.random() * 0.5 + 0.2,
      twinkleSpeed: Math.random() * 0.8 + 0.2,
      phase: Math.random() * Math.PI * 2,
      drift: Math.random() * 0.15 + 0.02,
    }));
  }

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeStars();
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);
    const time = t / 1000;
    for (const s of stars) {
      const twinkle =
        s.baseAlpha + Math.sin(time * s.twinkleSpeed + s.phase) * 0.25;
      ctx.globalAlpha = Math.max(0, Math.min(1, twinkle));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();

      // gentle upward drift, wrapping around the screen
      s.y -= s.drift;
      if (s.y < -2) {
        s.y = height + 2;
        s.x = Math.random() * width;
      }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  function drawStatic() {
    ctx.clearRect(0, 0, width, height);
    for (const s of stars) {
      ctx.globalAlpha = s.baseAlpha;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  window.addEventListener("resize", resize);
  resize();

  if (reduceMotion) {
    drawStatic();
  } else {
    requestAnimationFrame(draw);
  }
})();
