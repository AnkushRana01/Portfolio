/* ═══════════════════════════════════════════════════════════
   ANKUSH RANA PORTFOLIO — script.js
   Premium Full Stack Developer Portfolio
   ═══════════════════════════════════════════════════════════ */

/* ── EmailJS config ──────────────────────────────────────────
   Replace these values with your real EmailJS credentials.    */
const emailJsConfig = {
  serviceId:  "service_hoc0rna",
  templateId: "template_8i5fe91",
  publicKey:  "MPgjt3hl6PkSEAFF8"
};

/* ── Typing animation roles ─────────────────────────────────── */
const roles = [
  "Full Stack Developer",
  "React Developer",
  "Tailwind CSS Developer",
  "Node.js Engineer",
  "MCA Graduate",
  "Problem Solver"
];

/* ── Phone number (obfuscated — not in HTML source) ───────────
   Stored encoded to avoid plain-text scraping.               */
const _p = [43, 57, 49, 32, 56, 50, 55, 56, 56, 32, 51, 56, 55, 50, 49]
  .map(c => String.fromCharCode(c)).join("");   // "+91 82788 38721"

/* ══════════════════════════════════════════════════════════════
   DOM REFS
══════════════════════════════════════════════════════════════ */
const hamburger    = document.querySelector(".hamburger");
const navLinks     = document.querySelector(".nav-links");
const navItems     = document.querySelectorAll(".nav-links a");
const themeToggle  = document.querySelector("#themeToggle");
const typedRole    = document.querySelector("#typedRole");
const cursorDot    = document.querySelector(".cursor-dot");
const cursorRing   = document.querySelector(".cursor-ring");
const contactForm  = document.querySelector("#contactForm");
const formStatus   = document.querySelector("#formStatus");
const formFallback = document.querySelector("#formFallback");
const submitBtn    = document.querySelector("#formSubmitBtn");
const siteHeader   = document.querySelector(".site-header");

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

/* Close mobile menu when a nav link is clicked */
navItems.forEach(link => link.addEventListener("click", closeMenu));

/* Close menu on outside click */
document.addEventListener("click", (e) => {
  if (!e.target.closest(".nav-links") && !e.target.closest(".hamburger")) {
    closeMenu();
  }
});

/* Close menu on Escape */
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

/* ══════════════════════════════════════════════════════════════
   3. ACTIVE NAV LINK (Intersection Observer)
══════════════════════════════════════════════════════════════ */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navItems.forEach(item => {
      const isActive = item.getAttribute("href") === `#${entry.target.id}`;
      item.classList.toggle("active", isActive);
      /* Manage aria-current dynamically — never hardcoded in HTML */
      if (isActive) {
        item.setAttribute("aria-current", "page");
      } else {
        item.removeAttribute("aria-current");
      }
    });
  });
}, { threshold: 0.3, rootMargin: "0px 0px -20% 0px" });

document.querySelectorAll("main section[id]").forEach(s => sectionObserver.observe(s));

/* ══════════════════════════════════════════════════════════════
   4. SMOOTH SCROLL for anchor links
══════════════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const offset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue("--nav-height") || "72", 10);
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

/* ══════════════════════════════════════════════════════════════
   5. REVEAL ANIMATIONS (Intersection Observer)
══════════════════════════════════════════════════════════════ */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -50px 0px" });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

/* ══════════════════════════════════════════════════════════════
   6. COUNTER ANIMATION
══════════════════════════════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  /* Default suffix is empty string — use data-suffix="+" in HTML where needed */
  const suffix = el.dataset.suffix || "";
  const duration = 1400;
  const start    = performance.now();

  function step(now) {
    const progress = Math.min((now - start) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const value  = Math.floor(eased * target);
    el.textContent = value + (progress === 1 ? suffix : "");
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* Trigger counters when stat cards are visible */
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target.querySelector(".counter");
      if (el && !el.dataset.done) {
        el.dataset.done = "1";
        animateCounter(el);
      }
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll(".stat-card").forEach(card => counterObserver.observe(card));

/* ══════════════════════════════════════════════════════════════
   7. TYPING ANIMATION
══════════════════════════════════════════════════════════════ */
let roleIndex = 0, charIndex = 0, deleting = false;

function typeRole() {
  if (!typedRole) return;
  const current = roles[roleIndex];
  typedRole.textContent = current.slice(0, charIndex);

  if (!deleting && charIndex < current.length) {
    charIndex++;
    return setTimeout(typeRole, 85);
  }
  if (!deleting && charIndex === current.length) {
    deleting = true;
    return setTimeout(typeRole, 1600);
  }
  if (deleting && charIndex > 0) {
    charIndex--;
    return setTimeout(typeRole, 40);
  }
  deleting  = false;
  roleIndex = (roleIndex + 1) % roles.length;
  setTimeout(typeRole, 300);
}

/* ══════════════════════════════════════════════════════════════
   8. PHONE NUMBER DISPLAYED DIRECTLY (reveal functionality removed)
══════════════════════════════════════════════════════════════ */

/* ══════════════════════════════════════════════════════════════
   9. OPEN EXTERNAL LINKS (mailto / tel → Gmail or dialer)
══════════════════════════════════════════════════════════════ */
function buildGmailUrl(email, subject, body) {
  const u = new URL("https://mail.google.com/mail/");
  u.searchParams.set("view", "cm");
  u.searchParams.set("to",   email);
  if (subject) u.searchParams.set("su",   subject);
  if (body)    u.searchParams.set("body", body);
  return u.toString();
}

function openLink(url) {
  const popup = window.open(url, "_blank", "noopener,noreferrer");
  if (!popup) window.location.href = url;
}

/* Intercept mailto links → Gmail composer */
document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const raw    = link.getAttribute("href").replace(/^mailto:/i, "");
    const [addr, qs] = raw.split("?");
    const params = new URLSearchParams(qs || "");
    openLink(buildGmailUrl(addr, params.get("subject"), params.get("body")));
  });
});

/* ══════════════════════════════════════════════════════════════
   10. CONTACT FORM (EmailJS + fallback + validation)
══════════════════════════════════════════════════════════════ */
function validateField(input, errorEl, rule) {
  const msg = rule(input.value.trim());
  errorEl.textContent = msg;
  input.classList.toggle("error-field", !!msg);
  input.classList.toggle("success-field", !msg && input.value.trim().length > 0);
  
  /* Accessibility: toggle aria-invalid dynamically */
  if (msg) {
    input.setAttribute("aria-invalid", "true");
  } else {
    input.removeAttribute("aria-invalid");
  }
  
  return !msg;
}

const validations = {
  from_name:  v => v.length < 2  ? "Please enter your name (min 2 characters)." : "",
  from_email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Please enter a valid email address.",
  subject:    v => v.length > 100 ? "Subject must be under 100 characters." : "",
  message:    v => v.length < 10 ? "Message must be at least 10 characters." : ""
};

contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  /* Anti-spam honeypot check */
  const honey = contactForm.querySelector('[name="_honey"]');
  if (honey && honey.value) return; /* bot detected */

  /* Validate all fields */
  let valid = true;
  ["from_name", "from_email", "subject", "message"].forEach(name => {
    const input = contactForm.querySelector(`[name="${name}"]`);
    const error = document.querySelector(`#${name}Error`) ||
                  contactForm.querySelector(`#${name.replace("from_", "")}Error`);
    if (input && error) {
      const ok = validateField(input, error, validations[name]);
      if (!ok) valid = false;
    }
  });

  if (!valid) return;

  const fd        = new FormData(contactForm);
  const fromName  = String(fd.get("from_name") || "").trim();
  const fromEmail = String(fd.get("from_email") || "").trim();
  const subject   = String(fd.get("subject")    || "").trim();
  const message   = String(fd.get("message")    || "").trim();

  /* Build mailto fallback (include subject if provided) */
  const mailtoHref = `mailto:ranankush239@gmail.com?subject=${
    encodeURIComponent(subject || `Portfolio Contact Message from ${fromName}`)
  }&body=${encodeURIComponent(`Name: ${fromName}\nEmail: ${fromEmail}\n\n${message}`)}`;

  /* Show fallback link always (helpful if EmailJS fails) */
  if (formFallback) {
    formFallback.href  = mailtoHref;
    formFallback.style.display = "block";
    formFallback.textContent   = "You can also contact me directly via email →";
  }

  /* Check if EmailJS is configured */
  const isConfigured = !Object.values(emailJsConfig).some(v => v.startsWith("YOUR_"));

  if (!window.emailjs || !isConfigured) {
    formStatus.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>Could not connect to email service. Please use the link below.</span>
    `;
    formStatus.className = "form-status error visible";
    return;
  }

  /* Send via EmailJS */
  formStatus.classList.remove("visible", "success", "error");
  submitBtn.disabled = true;
  submitBtn.classList.add("loading");
  const btnTextEl = submitBtn.querySelector(".btn-text");
  if (btnTextEl) btnTextEl.textContent = "Sending…";

  const templateParams = {
    title:      subject || "Portfolio Contact Message",
    to_name:    "Ankush Rana",
    to_email:   "ranankush239@gmail.com",
    from_name:  fromName,
    from_email: fromEmail,
    reply_to:   fromEmail,
    name:       fromName,
    email:      fromEmail,
    subject:    subject || "Portfolio Contact Message",
    message
  };

  emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, templateParams, {
    publicKey: emailJsConfig.publicKey
  })
  .then(() => {
    formStatus.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      <span>✓ Message sent successfully. Thank you, I'll get back to you soon!</span>
    `;
    formStatus.className = "form-status success visible";
    contactForm.reset();
    
    /* Remove all success/error border classes */
    contactForm.querySelectorAll("input, textarea").forEach(el => {
      el.classList.remove("success-field", "error-field");
      el.removeAttribute("aria-invalid");
    });

    /* Hide fallback on success */
    if (formFallback) formFallback.style.display = "none";

    /* Auto dismiss success toast after 6 seconds */
    setTimeout(() => {
      formStatus.classList.remove("visible");
    }, 6000);
  })
  .catch((err) => {
    const errText = err?.text || err?.message || "Unknown error";
    const userFriendlyMsg = errText.toLowerCase().includes("gmail") && errText.toLowerCase().includes("scope")
      ? "Gmail authorization issue. Please use the link below to contact me directly."
      : `Message could not be sent: ${errText}. Please use the link below.`;

    formStatus.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18" aria-hidden="true">
        <circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>${userFriendlyMsg}</span>
    `;
    formStatus.className = "form-status error visible";
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
    if (btnTextEl) btnTextEl.textContent = "Send Message";
  });
});

/* Real-time field validation on blur & input */
contactForm?.querySelectorAll("input, textarea").forEach(input => {
  const handler = () => {
    const name  = input.name;
    const rule  = validations[name];
    const error = document.querySelector(`#${name}Error`) ||
                  contactForm.querySelector(`#${name.replace("from_", "")}Error`);
    if (rule && error) validateField(input, error, rule);
  };
  input.addEventListener("blur", handler);
  input.addEventListener("input", handler);
});

/* ══════════════════════════════════════════════════════════════
   11. CUSTOM CURSOR
══════════════════════════════════════════════════════════════ */
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

function moveCursor() {
  ringX += (cursorX - ringX) * 0.16;
  ringY += (cursorY - ringY) * 0.16;
  if (cursorDot) cursorDot.style.transform = `translate(${cursorX}px,${cursorY}px) translate(-50%,-50%)`;
  if (cursorRing) cursorRing.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
  requestAnimationFrame(moveCursor);
}

function initCursor() {
  if (!cursorDot || !cursorRing) return;
  if (!window.matchMedia("(pointer: fine)").matches) return;

  document.body.classList.add("cursor-ready");

  window.addEventListener("mousemove", e => { cursorX = e.clientX; cursorY = e.clientY; });
  window.addEventListener("mouseleave", () => document.body.classList.remove("cursor-ready"));
  window.addEventListener("mouseenter",  () => document.body.classList.add("cursor-ready"));

  const hoverTargets = "a, button, input, textarea, .skill-list span, .moving-stack span, .project-card, .stat-card, .achievement-card";
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
    el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
  });

  moveCursor();
}

/* ══════════════════════════════════════════════════════════════
   12. BUTTON RIPPLE EFFECT
══════════════════════════════════════════════════════════════ */
document.querySelectorAll(".btn, .btn-proj").forEach(btn => {
  btn.addEventListener("click", function (e) {
    const rect   = this.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size   = Math.max(rect.width, rect.height);

    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      background:rgba(255,255,255,.25);
      width:${size}px; height:${size}px;
      left:${e.clientX - rect.left - size / 2}px;
      top:${e.clientY - rect.top  - size / 2}px;
      transform:scale(0); animation:ripple 500ms ease-out forwards;
      pointer-events:none;
    `;

    /* Add ripple keyframe once */
    if (!document.querySelector("#ripple-style")) {
      const style = document.createElement("style");
      style.id    = "ripple-style";
      style.textContent = "@keyframes ripple{to{transform:scale(2.5);opacity:0;}}";
      document.head.appendChild(style);
    }

    this.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  });
});

/* ══════════════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════════════ */

/* Block navigation on aria-disabled buttons/links (e.g. "Repo Coming Soon") */
document.addEventListener("click", (e) => {
  const el = e.target.closest("[aria-disabled='true']");
  if (el) e.preventDefault();
});

/* ── Navbar Scroll Behavior ── */
function initNavbarScroll() {
  const handleScroll = () => {
    if (window.scrollY > 20) {
      siteHeader?.classList.add("scrolled");
    } else {
      siteHeader?.classList.remove("scrolled");
    }
  };
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll(); // set correct initial state
}

initTheme();
initCursor();
typeRole();
initNavbarScroll();
