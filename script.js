// Lightweight twinkling starfield rendered behind the "Hello World" text.
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
