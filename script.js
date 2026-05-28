const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const navItems = document.querySelectorAll(".nav-links a");
const themeToggle = document.querySelector("#themeToggle");
const roles = [
    "Aspiring Full-Stack Developer",
    "MCA Student",
    "Web Developer",
    "Problem Solver"
];

let roleIndex = 0;
let charIndex = 0;
let deleting = false;
const typedRole = document.querySelector("#typedRole");
const cursorDot = document.querySelector(".cursor-dot");
const cursorRing = document.querySelector(".cursor-ring");
const emailJsConfig = {
    serviceId: "service_hoc0rna",
    templateId: "template_8i5fe91",
    publicKey: "MPgjt3hl6PkSEAFF8"
};

let cursorX = 0;
let cursorY = 0;
let ringX = 0;
let ringY = 0;

function openExternalLink(url) {
    if (url.startsWith("mailto:")) {
        const email = url.replace(/^mailto:/i, "").split("?")[0];
        const params = new URLSearchParams(url.split("?")[1] || "");
        const composeUrl = new URL("https://mail.google.com/mail/");

        composeUrl.searchParams.set("view", "cm");
        composeUrl.searchParams.set("to", email);

        if (params.get("subject")) {
            composeUrl.searchParams.set("su", params.get("subject"));
        }

        if (params.get("body")) {
            composeUrl.searchParams.set("body", params.get("body"));
        }

        const popup = window.open(composeUrl.toString(), "_blank", "noopener,noreferrer");

        if (!popup) {
            window.location.href = composeUrl.toString();
        }

        return;
    }

    if (url.startsWith("tel:")) {
        const popup = window.open(url, "_blank", "noopener,noreferrer");

        if (!popup) {
            window.location.href = url;
        }

        return;
    }

    const popup = window.open(url, "_blank", "noopener,noreferrer");

    if (!popup) {
        window.location.href = url;
    }
}

function buildMailtoHref(fromName, fromEmail, message) {
    const subject = encodeURIComponent(`Portfolio Contact Message${fromName ? ` from ${fromName}` : ""}`);
    const body = encodeURIComponent(
        `Name: ${fromName || "Not provided"}\nEmail: ${fromEmail || "Not provided"}\n\n${message || ""}`
    );

    return `mailto:ranankush239@gmail.com?subject=${subject}&body=${body}`;
}

function isGmailScopeError(errorText) {
    const normalized = String(errorText || "").toLowerCase();

    return normalized.includes("gmail_api") && normalized.includes("insufficient authentication scopes");
}

function typeRole() {
    if (!typedRole) return;

    const currentRole = roles[roleIndex];
    typedRole.textContent = currentRole.slice(0, charIndex);

    if (!deleting && charIndex < currentRole.length) {
        charIndex += 1;
        setTimeout(typeRole, 90);
        return;
    }

    if (!deleting && charIndex === currentRole.length) {
        deleting = true;
        setTimeout(typeRole, 1500);
        return;
    }

    if (deleting && charIndex > 0) {
        charIndex -= 1;
        setTimeout(typeRole, 42);
        return;
    }

    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    setTimeout(typeRole, 280);
}

function applyTheme(theme) {
    const resolvedTheme = theme === "light" ? "light" : "dark";

    document.body.classList.toggle("theme-light", resolvedTheme === "light");
    localStorage.setItem("portfolio-theme", resolvedTheme);

    if (themeToggle) {
        themeToggle.setAttribute("aria-pressed", String(resolvedTheme === "light"));
        themeToggle.setAttribute("aria-label", resolvedTheme === "light" ? "Switch to dark theme" : "Switch to light theme");
    }
}

function initTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";

    applyTheme(savedTheme || preferredTheme);
}

hamburger?.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    hamburger.classList.toggle("active", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
});

navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        hamburger?.classList.remove("active");
        hamburger?.setAttribute("aria-expanded", "false");
    });
});

themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("theme-light") ? "dark" : "light";
    applyTheme(nextTheme);
});

document.querySelectorAll('a[href^="mailto:"], a[href^="tel:"]').forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        openExternalLink(link.getAttribute("href"));
    });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
        const target = document.querySelector(anchor.getAttribute("href"));

        if (!target) return;

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.16, rootMargin: "0px 0px -60px 0px" });

document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navItems.forEach((item) => {
            item.classList.toggle("active", item.getAttribute("href") === `#${entry.target.id}`);
        });
    });
}, { threshold: 0.35 });

document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    const submitButton = form.querySelector('button[type="submit"]');
    const status = form.querySelector(".form-status");
    const fallbackLink = form.querySelector(".form-fallback");
    const isConfigured = !Object.values(emailJsConfig).some((value) => value.startsWith("YOUR_"));
    const formData = new FormData(form);
    const fromName = String(formData.get("from_name") || "").trim();
    const fromEmail = String(formData.get("from_email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const mailtoHref = buildMailtoHref(fromName, fromEmail, message);
    const templateParams = {
        title: "Portfolio Contact Message",
        to_name: "Ankush Rana",
        to_email: "ranankush239@gmail.com",
        from_name: fromName,
        from_email: fromEmail,
        reply_to: fromEmail,
        name: fromName,
        email: fromEmail,
        message
    };

    if (fallbackLink) {
        fallbackLink.href = mailtoHref;
        fallbackLink.textContent = "Open your email app instead";
    }

    if (!window.emailjs || !isConfigured) {
        status.textContent = "EmailJS is ready. Add your Service ID, Template ID, and Public Key in script.js.";
        status.className = "form-status error";
        return;
    }

    status.textContent = "Sending your message...";
    status.className = "form-status";
    submitButton.disabled = true;
    submitButton.textContent = "Sending...";

    emailjs.send(emailJsConfig.serviceId, emailJsConfig.templateId, templateParams, {
        publicKey: emailJsConfig.publicKey
    }).then(() => {
        status.textContent = "Message sent successfully. Thank you!";
        status.className = "form-status success";
        form.reset();
    }).catch((error) => {
        const errorText = error?.text || error?.message || "Please check your EmailJS service/template settings.";

        if (isGmailScopeError(errorText)) {
            status.textContent = "Email delivery is currently blocked by Gmail authorization. Use the fallback link below to open your email app, or reconnect the Gmail service in EmailJS.";
            status.className = "form-status error";
        } else {
            status.textContent = `Message could not be sent: ${errorText}`;
            status.className = "form-status error";
        }
    }).finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = "Send Message";
    });
});

function moveCursor() {
    ringX += (cursorX - ringX) * 0.16;
    ringY += (cursorY - ringY) * 0.16;

    if (cursorDot) {
        cursorDot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    }

    if (cursorRing) {
        cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(moveCursor);
}

function initCursor() {
    const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;

    if (!cursorDot || !cursorRing || !supportsFinePointer) return;

    document.body.classList.add("cursor-ready");

    window.addEventListener("mousemove", (event) => {
        cursorX = event.clientX;
        cursorY = event.clientY;
    });

    window.addEventListener("mouseleave", () => {
        document.body.classList.remove("cursor-ready");
    });

    window.addEventListener("mouseenter", () => {
        document.body.classList.add("cursor-ready");
    });

    document.querySelectorAll("a, button, input, textarea, .skill-list span, .moving-stack span").forEach((element) => {
        element.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
        element.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
    });

    moveCursor();
}

typeRole();
initTheme();
initCursor();
