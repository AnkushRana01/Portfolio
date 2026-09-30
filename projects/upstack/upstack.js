/* ═══════════════════════════════════════════════════════════
   UPSTACK CASE STUDY — upstack.js
   Reuses the same patterns from the main portfolio script.js:
   theme, navbar, scroll-reveal, cursor, header scroll state.
   ═══════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   DOM REFS
══════════════════════════════════════════════════════════════ */
const hamburger   = document.querySelector(".hamburger");
const navLinks    = document.querySelector(".nav-links");
const navItems    = document.querySelectorAll(".nav-links a");
const themeToggle = document.querySelector("#themeToggle");
const cursorDot   = document.querySelector(".cursor-dot");
const cursorRing  = document.querySelector(".cursor-ring");
const siteHeader  = document.querySelector(".site-header");

/* ══════════════════════════════════════════════════════════════
   1. THEME
══════════════════════════════════════════════════════════════ */
function applyTheme(theme) {
  const isLight = theme === "light";
  document.body.classList.toggle("theme-light", isLight);
  localStorage.setItem("portfolio-theme", isLight ? "light" : "dark");
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isLight));
    themeToggle.setAttribute("aria-label",
      isLight ? "Switch to dark theme" : "Switch to light theme");
  }
}

function initTheme() {
  const saved     = localStorage.getItem("portfolio-theme");
  const preferred = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  applyTheme(saved || preferred);
}

themeToggle?.addEventListener("click", () => {
  const next = document.body.classList.contains("theme-light") ? "dark" : "light";
  applyTheme(next);
});

/* ══════════════════════════════════════════════════════════════
   2. NAVBAR
══════════════════════════════════════════════════════════════ */
function closeMenu() {
  navLinks?.classList.remove("active");
  hamburger?.classList.remove("active");
  hamburger?.setAttribute("aria-expanded", "false");
  hamburger?.setAttribute("aria-label", "Open navigation menu");
}

hamburger?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("active");
  hamburger.classList.toggle("active", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  hamburger.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

navItems.forEach(link => link.addEventListener("click", closeMenu));

document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-links") && !e.target.closest(".hamburger")) {
    closeMenu();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ══════════════════════════════════════════════════════════════
   3. HEADER SCROLL STATE
══════════════════════════════════════════════════════════════ */
function onHeaderScroll() {
  if (!siteHeader) return;
  siteHeader.classList.toggle("scrolled", window.scrollY > 30);
}
window.addEventListener("scroll", onHeaderScroll, { passive: true });

/* ══════════════════════════════════════════════════════════════
   4. SCROLL REVEAL
══════════════════════════════════════════════════════════════ */
function initReveal() {
  const reveals = document.querySelectorAll(".reveal");
  if (!reveals.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  reveals.forEach((el) => observer.observe(el));
}

/* ══════════════════════════════════════════════════════════════
   5. CUSTOM CURSOR
══════════════════════════════════════════════════════════════ */
function initCursor() {
  /* Only on non-touch, pointer-fine devices */
  if (window.matchMedia("(pointer: coarse)").matches) return;
  if (!cursorDot || !cursorRing) return;

  let mx = -200, my = -200;
  let rx = -200, ry = -200;
  let rafId;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function tick() {
    rx = lerp(rx, mx, 0.14);
    ry = lerp(ry, my, 0.14);
    cursorDot.style.transform  = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
    cursorRing.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    rafId = requestAnimationFrame(tick);
  }

  document.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (!document.body.classList.contains("cursor-ready")) {
      document.body.classList.add("cursor-ready");
      rafId = requestAnimationFrame(tick);
    }
  });

  document.querySelectorAll("a, button, [tabindex]").forEach((el) => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });
}

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */
(function init() {
  initTheme();
  onHeaderScroll();
  initReveal();
  initCursor();
})();
