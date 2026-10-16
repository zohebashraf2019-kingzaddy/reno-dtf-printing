(() => {
  const C = window.RENO_DTF;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Wire config values into the page ---------- */
  document.querySelectorAll("[data-shop]").forEach((a) => {
    a.href = C.shopify.base + C.shopify[a.dataset.shop];
  });
  document.querySelectorAll("[data-email]").forEach((el) => {
    if (el.tagName === "A") el.href = "mailto:" + C.email;
    if (!("keepText" in el.dataset)) el.textContent = C.email;
  });
  document.querySelectorAll("[data-ig]").forEach((a) => {
    a.href = C.instagram;
    a.target = "_blank";
    a.rel = "noopener";
  });
  document.querySelectorAll("[data-maps]").forEach((a) => {
    a.href = C.address.maps;
    a.target = "_blank";
    a.rel = "noopener";
  });
  const yr = document.getElementById("year");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Countdown to 9AM Pacific ---------- */
  const cd = document.querySelectorAll("[data-countdown]");
  function pacificNow() {
    const p = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Los_Angeles",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).formatToParts(new Date());
    const g = (t) => +p.find((x) => x.type === t).value % 24;
    return g("hour") * 3600 + g("minute") * 60 + g("second");
  }
  function tick() {
    const now = pacificNow();
    const cut = C.cutoffHour * 3600;
    let left = cut - now;
    const before = left > 0;
    if (!before) left += 86400;
    const h = String(Math.floor(left / 3600)).padStart(2, "0");
    const m = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
    const s = String(left % 60).padStart(2, "0");
    cd.forEach((el) => {
      el.textContent = `${h}:${m}:${s}`;
      const lbl = el.parentElement.querySelector("[data-countdown-label]");
      if (lbl) lbl.textContent = before ? "Same-day cutoff in" : "Next cutoff in";
    });
  }
  if (cd.length) {
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Mobile menu ---------- */
  const tog = document.querySelector(".menu-toggle");
  const mm = document.querySelector(".mobile-menu");
  if (tog && mm) {
    tog.addEventListener("click", () => {
      const hb = document.querySelector(".header").getBoundingClientRect().bottom;
      mm.style.setProperty("--menu-top", hb + "px");
      const open = mm.classList.toggle("open");
      tog.setAttribute("aria-expanded", open);
    });
    mm.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => mm.classList.remove("open")));
  }

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Cursor glow (desktop only) ---------- */
  if (!reduce && matchMedia("(pointer:fine)").matches) {
    const g = document.createElement("div");
    g.className = "cursor-glow";
    document.body.appendChild(g);
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y;
    addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      x += (tx - x) * 0.12; y += (ty - y) * 0.12;
      g.style.left = x + "px"; g.style.top = y + "px";
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Generative "ink" loop (hero background) ----------
     Neon paint blobs drift on looping paths and merge, with drips
     and splatter specks — a seamless generative loop. */
  const cv = document.getElementById("ink-canvas");
  if (cv) {
    const ctx = cv.getContext("2d");
    const colors = ["#ff2fb3", "#8b5cf6", "#22d3ee", "#a3e635", "#ffe14d", "#ff8a1f"];
    let w, h, dpr, blobs, specks, drips;
    function size() {
      dpr = Math.min(devicePixelRatio || 1, 2);
      w = cv.clientWidth; h = cv.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = w < 700 ? 6 : 9;
      blobs = Array.from({ length: n }, (_, i) => ({
        c: colors[i % colors.length],
        r: (w < 700 ? 120 : 220) * (0.6 + Math.random() * 0.7),
        ax: Math.random() * w, ay: Math.random() * h,
        rx: 80 + Math.random() * w * 0.25, ry: 60 + Math.random() * h * 0.2,
        sp: 0.00012 + Math.random() * 0.00018, ph: Math.random() * Math.PI * 2,
      }));
      specks = Array.from({ length: w < 700 ? 40 : 90 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        r: Math.random() * 2.4 + 0.4, c: colors[(Math.random() * colors.length) | 0],
        v: 0.1 + Math.random() * 0.35, ph: Math.random() * 6,
      }));
      drips = Array.from({ length: w < 700 ? 6 : 12 }, () => newDrip(true));
    }
    function newDrip(rand) {
      return {
        x: Math.random() * w, y: rand ? Math.random() * h : -20,
        len: 30 + Math.random() * 90, v: 0.4 + Math.random() * 1.1,
        c: colors[(Math.random() * colors.length) | 0], wd: 2 + Math.random() * 4,
      };
    }
    function frame(t) {
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      for (const b of blobs) {
        const a = t * b.sp + b.ph;
        const x = b.ax + Math.cos(a) * b.rx;
        const y = b.ay + Math.sin(a * 1.3) * b.ry;
        const r = b.r * (0.85 + 0.15 * Math.sin(a * 2));
        const g = ctx.createRadialGradient(x, y, 0, x, y, r);
        g.addColorStop(0, b.c + "55");
        g.addColorStop(0.5, b.c + "22");
        g.addColorStop(1, b.c + "00");
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      for (const s of specks) {
        s.y -= s.v; if (s.y < -5) { s.y = h + 5; s.x = Math.random() * w; }
        ctx.globalAlpha = 0.5 + 0.5 * Math.sin(t * 0.002 + s.ph);
        ctx.fillStyle = s.c;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalAlpha = 0.55;
      for (let i = 0; i < drips.length; i++) {
        const d = drips[i];
        d.y += d.v;
        const gr = ctx.createLinearGradient(d.x, d.y - d.len, d.x, d.y);
        gr.addColorStop(0, d.c + "00"); gr.addColorStop(1, d.c);
        ctx.strokeStyle = gr; ctx.lineWidth = d.wd; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(d.x, d.y - d.len); ctx.lineTo(d.x, d.y); ctx.stroke();
        ctx.fillStyle = d.c;
        ctx.beginPath(); ctx.arc(d.x, d.y, d.wd * 0.9, 0, Math.PI * 2); ctx.fill();
        if (d.y - d.len > h) drips[i] = newDrip(false);
      }
      ctx.globalAlpha = 1;
      if (!reduce) requestAnimationFrame(frame);
    }
    size();
    addEventListener("resize", size);
    requestAnimationFrame(frame);
  }

  /* ---------- Background videos ----------
     Autoplay muted loops; pause when off-screen to save battery,
     and stay paused for visitors who prefer reduced motion. */
  const vids = document.querySelectorAll("video");
  vids.forEach((v) => {
    v.muted = true;
    if (reduce) { v.removeAttribute("autoplay"); v.pause(); return; }
    const vio = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; v.play().catch(() => {}); }
      else v.pause();
    }, { threshold: 0.05 });
    vio.observe(v);
  });

  /* Camera-style running timecode on the hero */
  const tc = document.querySelector("[data-timecode]");
  if (tc && !reduce) {
    const t0 = performance.now();
    (function run() {
      const ms = performance.now() - t0;
      const f = Math.floor((ms % 1000) / 33.3), sec = Math.floor(ms / 1000);
      const pad = (n) => String(n).padStart(2, "0");
      tc.textContent = `${pad(Math.floor(sec / 3600))}:${pad(Math.floor(sec / 60) % 60)}:${pad(sec % 60)}:${pad(f)}`;
      requestAnimationFrame(run);
    })();
  }

  /* Behind-the-scenes process stepper (cycles alongside the video) */
  const steps = document.querySelectorAll("[data-process] li");
  const bar = document.querySelector("[data-process-bar]");
  if (steps.length) {
    let i = 0;
    const show = (n) => {
      steps.forEach((li, k) => li.classList.toggle("active", k === n));
      if (bar) bar.style.width = ((n + 1) / steps.length) * 100 + "%";
    };
    steps.forEach((li, k) => li.addEventListener("mouseenter", () => { i = k; show(i); }));
    show(0);
    if (!reduce) setInterval(() => { i = (i + 1) % steps.length; show(i); }, 3200);
  }

  /* ---------- Contact form → opens email to the shop ---------- */
  const form = document.getElementById("order-form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const f = new FormData(form);
      const subject = `Order inquiry — ${f.get("topic")} — ${f.get("name")}`;
      const body = [
        `Name: ${f.get("name")}`,
        `Email: ${f.get("email")}`,
        `Phone: ${f.get("phone") || "-"}`,
        `Order # (if any): ${f.get("order") || "-"}`,
        `Topic: ${f.get("topic")}`,
        `Delivery: ${f.get("delivery")}`,
        "",
        f.get("message"),
      ].join("\n");
      location.href = `mailto:${C.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      const t = document.querySelector(".toast");
      if (t) { t.classList.add("show"); setTimeout(() => t.classList.remove("show"), 4000); }
    });
  }
})();
