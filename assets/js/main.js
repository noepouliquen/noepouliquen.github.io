/**
 * main.js — Comportement du site.
 * Toutes les données affichées viennent de content.js (objet SITE).
 * Ce fichier ne contient pas de texte du portfolio "en dur" : si tu
 * cherches un texte à modifier, c'est très probablement dans content.js.
 */
(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const svgIcon = {
    arrow:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  };

  /* ----------------------------------------------------------
     1. Liens & identité (email, LinkedIn, CV) — source unique
  ---------------------------------------------------------- */
  function renderIdentity() {
    const { email, linkedin, cvUrl, roles } = SITE.person;

    document.title = SITE.meta.title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", SITE.meta.description);

    const mailLinks = ["hero-email", "contact-email"];
    mailLinks.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.href = `mailto:${email}`;
      if (id === "hero-email") el.textContent = email;
    });

    const linkedinLinks = ["hero-linkedin", "contact-linkedin"];
    linkedinLinks.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.href = linkedin;
    });

    const cvBtn = document.getElementById("cv-button");
    if (cvBtn) {
      if (cvUrl && cvUrl.trim() !== "") {
        cvBtn.href = cvUrl;
        cvBtn.removeAttribute("aria-disabled");
        cvBtn.setAttribute("download", "");
      } else {
        cvBtn.href = "#contact";
        cvBtn.setAttribute("aria-disabled", "true");
        cvBtn.addEventListener("click", (e) => {
          e.preventDefault();
          const el = document.getElementById("contact");
          if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
        });
      }
    }

    const rolesEl = document.getElementById("hero-roles");
    if (rolesEl) {
      rolesEl.innerHTML = roles.map((r) => `<span>${r}</span>`).join("");
    }

    const footerYear = document.getElementById("footer-year");
    if (footerYear) footerYear.textContent = new Date().getFullYear();
  }

  /* ----------------------------------------------------------
     2. À propos — qualités / intérêts
  ---------------------------------------------------------- */
  function renderAbout() {
    const qualitiesEl = document.getElementById("about-qualities");
    const interestsEl = document.getElementById("about-interests");
    if (qualitiesEl) {
      qualitiesEl.innerHTML = SITE.about.qualities
        .map((q) => `<li class="chip">${q}</li>`)
        .join("");
    }
    if (interestsEl) {
      interestsEl.innerHTML = SITE.about.interests
        .map((i) => `<li class="chip">${i}</li>`)
        .join("");
    }
  }

  /* ----------------------------------------------------------
     3. Compétences
  ---------------------------------------------------------- */
  function renderSkills() {
    const grid = document.getElementById("skills-grid");
    if (!grid) return;
    grid.innerHTML = SITE.skills
      .map(
        (cat) => `
      <div class="skills-cat">
        <h3 class="label">${cat.category}</h3>
        <ul class="skills-list">
          ${cat.items.map((item) => `<li class="skill-item">${item}</li>`).join("")}
        </ul>
      </div>`
      )
      .join("");
  }

  /* ----------------------------------------------------------
     4. Projets + études de cas
  ---------------------------------------------------------- */
  function renderProjects() {
    const list = document.getElementById("projects-list");
    if (!list) return;

    list.innerHTML = SITE.projects
      .map(
        (p, i) => `
        <article class="project reveal">
          <div class="project-body">
            <p class="label project-type">${String(i + 1).padStart(2, "0")} — ${p.type}</p>
            <h3 class="project-title">${p.title}</h3>
            <p class="project-slogan">${p.subtitle}</p>
            <p class="project-summary">${p.summary}</p>
            <dl class="project-meta">
              <div>
                <dt class="label">Rôle</dt>
                <dd>${p.role}</dd>
              </div>
              <div>
                <dt class="label">Outils</dt>
                <dd>${p.tools.join(", ")}</dd>
              </div>
            </dl>
            <div class="project-actions">
              ${
                p.caseStudy
                  ? `<button type="button" class="btn open-case-study" data-project-index="${i}">Voir l’étude de cas ${svgIcon.arrow}</button>`
                  : ""
              }
              ${
                p.externalLink
                  ? `<a class="link" href="${p.externalLink}" target="_blank" rel="noopener">Voir le projet</a>`
                  : ""
              }
            </div>
          </div>
          <figure class="project-poster"${p.caseStudy ? ` data-project-index="${i}"` : ""}>
            <img src="${p.cover}" alt="${p.coverAlt}" loading="lazy" width="1100" height="1613" />
          </figure>
        </article>`
      )
      .join("");

    // Le bouton (clavier) et l'affiche (souris) ouvrent l'étude de cas.
    list.querySelectorAll("[data-project-index]").forEach((el) => {
      el.addEventListener("click", () => {
        const idx = parseInt(el.getAttribute("data-project-index"), 10);
        openCaseStudy(SITE.projects[idx]);
      });
    });
  }

  let lastFocusedEl = null;

  function openCaseStudy(project) {
    const overlay = document.getElementById("case-study");
    if (!overlay || !project.caseStudy) return;

    lastFocusedEl = document.activeElement;

    document.getElementById("cs-hero-img").src = project.cover;
    document.getElementById("cs-hero-img").alt = project.coverAlt;
    document.getElementById("cs-type").textContent = project.type;
    document.getElementById("cs-title").textContent = project.title;
    document.getElementById("cs-slogan").textContent = project.subtitle;

    const fieldLabels = {
      context: "Contexte",
      brief: "Brief",
      problem: "Problématique",
      target: "Cible",
      insight: "Insight",
      objective: "Objectif",
      concept: "Concept",
      artDirection: "Direction artistique",
      device: "Dispositif",
      strategy: "Stratégie",
    };

    const sections = document.getElementById("cs-sections");
    sections.innerHTML = Object.keys(fieldLabels)
      .filter((key) => project.caseStudy[key])
      .map(
        (key) => `
        <div class="case-study-section">
          <h3 class="label">${fieldLabels[key]}</h3>
          <p>${project.caseStudy[key]}</p>
        </div>`
      )
      .join("");

    const gallery = document.getElementById("cs-gallery");
    gallery.innerHTML = project.images
      .map(
        (img) => `
        <figure>
          <img src="${img.src}" alt="${img.alt}" loading="lazy" />
        </figure>`
      )
      .join("");

    overlay.hidden = false;
    // Le focus doit attendre que la modal soit affichée (display: none avant is-open).
    requestAnimationFrame(() => {
      overlay.classList.add("is-open");
      document.getElementById("case-study-close").focus();
    });
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onCaseStudyKeydown);
  }

  function closeCaseStudy() {
    const overlay = document.getElementById("case-study");
    if (!overlay) return;
    overlay.classList.remove("is-open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onCaseStudyKeydown);
    setTimeout(() => {
      overlay.hidden = true;
    }, prefersReducedMotion ? 0 : 200);
    if (lastFocusedEl) lastFocusedEl.focus();
  }

  function onCaseStudyKeydown(e) {
    if (e.key === "Escape") closeCaseStudy();
    // basic focus trap
    if (e.key === "Tab") {
      const overlay = document.getElementById("case-study");
      const focusables = overlay.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function wireCaseStudyClose() {
    const closeBtn = document.getElementById("case-study-close");
    if (closeBtn) closeBtn.addEventListener("click", closeCaseStudy);
    const overlay = document.getElementById("case-study");
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeCaseStudy();
      });
    }
  }

  /* ----------------------------------------------------------
     5. Expériences (timeline)
  ---------------------------------------------------------- */
  function renderTimeline() {
    const el = document.getElementById("timeline");
    if (!el) return;
    el.innerHTML = SITE.experience
      .map(
        (exp) => `
      <div class="timeline-item reveal">
        <div class="timeline-head">
          <span class="timeline-role">${exp.role} — ${exp.company}</span>
          <span class="timeline-meta">${exp.place} · ${exp.duration}</span>
        </div>
        <p class="timeline-desc">${exp.description}</p>
        <ul class="timeline-missions">
          ${exp.missions.map((m) => `<li>${m}</li>`).join("")}
        </ul>
        ${exp.note ? `<p class="timeline-note">${exp.note}</p>` : ""}
      </div>`
      )
      .join("");
  }

  /* ----------------------------------------------------------
     6. Parcours / formation
  ---------------------------------------------------------- */
  function renderEducation() {
    const el = document.getElementById("edu-list");
    if (!el) return;
    el.innerHTML = SITE.education
      .map(
        (ed) => `
      <div class="edu-item">
        <div>
          <div class="edu-degree">${ed.degree}</div>
          ${ed.school ? `<div class="edu-school">${ed.school}</div>` : ""}
        </div>
        ${ed.period ? `<div class="edu-period">${ed.period}</div>` : ""}
      </div>`
      )
      .join("");
  }

  /* ----------------------------------------------------------
     7. Galerie
  ---------------------------------------------------------- */
  function renderGallery() {
    const scroller = document.getElementById("gallery-scroller");
    if (!scroller) return;
    scroller.innerHTML = SITE.gallery
      .map(
        (g) => `
      <figure class="gallery-item">
        <img src="${g.src}" alt="${g.alt}" loading="lazy" width="900" height="1200" />
        <figcaption class="gallery-caption">${g.caption}</figcaption>
      </figure>`
      )
      .join("");

    const prevBtn = document.getElementById("gallery-prev");
    const nextBtn = document.getElementById("gallery-next");
    const scrollByAmount = () =>
      scroller.querySelector(".gallery-item")?.getBoundingClientRect().width + 21 || 300;

    prevBtn?.addEventListener("click", () =>
      scroller.scrollBy({ left: -scrollByAmount(), behavior: prefersReducedMotion ? "auto" : "smooth" })
    );
    nextBtn?.addEventListener("click", () =>
      scroller.scrollBy({ left: scrollByAmount(), behavior: prefersReducedMotion ? "auto" : "smooth" })
    );
  }

  /* ----------------------------------------------------------
     8. Navigation : menu mobile, rail actif, header au scroll
  ---------------------------------------------------------- */
  function wireMobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("nav-mobile");
    if (!toggle || !nav) return;

    // menu-open : le header passe en version papier, comme le menu.
    function closeMenu() {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Ouvrir le menu");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }
    function openMenu() {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Fermer le menu");
      nav.classList.add("is-open");
      document.body.classList.add("menu-open");
      nav.querySelector("a")?.focus();
    }

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", closeMenu)
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeMenu();
        toggle.focus();
      }
    });
  }

  function wireHeaderAutoHide() {
    const header = document.getElementById("site-header");
    if (!header || prefersReducedMotion) return;
    let lastY = window.scrollY;
    let ticking = false;

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY && y > 160) {
          header.classList.add("is-hidden");
        } else {
          header.classList.remove("is-hidden");
        }
        lastY = y;
        ticking = false;
      });
    });
  }

  function wireActiveSection() {
    const sections = document.querySelectorAll("main > section[id]");
    const railLinks = document.querySelectorAll(".index-rail a");
    const navLinks = document.querySelectorAll(".nav-desktop a");

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          railLinks.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`)
          );
          navLinks.forEach((a) =>
            a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`)
          );
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* Zones sombres (accueil, contact, pied de page) : le header et le rail
     passent en version nuit quand ils sont au-dessus de l'une d'elles. */
  function wireThemeZones() {
    const zones = document.querySelectorAll(".theme-night");
    if (!zones.length) return;

    function follow(el, rootMargin) {
      if (!el) return;
      const inside = new Set();
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) =>
            entry.isIntersecting ? inside.add(entry.target) : inside.delete(entry.target)
          );
          el.classList.toggle("on-night", inside.size > 0);
        },
        { rootMargin }
      );
      zones.forEach((zone) => observer.observe(zone));
    }

    follow(document.getElementById("site-header"), "0px 0px -92% 0px"); // bande du haut
    follow(document.querySelector(".index-rail"), "-49% 0px -49% 0px"); // milieu d'écran
  }

  /* ----------------------------------------------------------
     9. Reveal on scroll
  ---------------------------------------------------------- */
  function wireReveal() {
    const targets = document.querySelectorAll(".reveal, .reveal-scale, .reveal-stagger");
    if (!targets.length) return;

    if (prefersReducedMotion) {
      targets.forEach((t) => t.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );

    targets.forEach((t) => observer.observe(t));
  }

  /* Re-observe reveal targets created dynamically after initial render */
  function refreshReveal() {
    wireReveal();
  }

  /* ----------------------------------------------------------
     10. Hero character — subtle parallax on pointer move
  ---------------------------------------------------------- */
  function wireHeroParallax() {
    if (prefersReducedMotion) return;
    const figure = document.querySelector(".hero-figure");
    const character = document.querySelector(".hero-character");
    if (!figure || !character) return;
    if (window.matchMedia("(hover: none)").matches) return; // skip on touch

    figure.addEventListener("mousemove", (e) => {
      const rect = figure.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      character.style.transform = `translate(${x * 14}px, ${y * 10}px)`;
    });
    figure.addEventListener("mouseleave", () => {
      character.style.transform = "";
    });
  }

  /* ----------------------------------------------------------
     11. Fond spatial — champ d'étoiles (accueil + Contact)
  ---------------------------------------------------------- */
  function wireSpace(space) {
    const canvas = document.createElement("canvas");
    canvas.className = "space-stars";
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    space.appendChild(canvas);

    let stars = [];
    let w = 0, h = 0, dpr = 1;
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    function seed() {
      const rect = space.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      stars = Array.from({ length: Math.round((w * h) / 5200) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() < 0.92 ? 0.35 + Math.random() * 0.6 : 0.9 + Math.random() * 0.7,
        depth: 0.2 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
        speed: 0.4 + Math.random() * 1.2,
      }));
    }

    function draw(time) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#dfe8ff";
      stars.forEach((s) => {
        const twinkle = prefersReducedMotion ? 0.8 : 0.55 + 0.45 * Math.sin(time * 0.001 * s.speed + s.phase);
        ctx.globalAlpha = twinkle * (0.35 + s.depth * 0.65);
        ctx.beginPath();
        ctx.arc(s.x - eased.x * 14 * s.depth, s.y - eased.y * 10 * s.depth, s.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    seed();
    draw(0);
    new ResizeObserver(() => {
      seed();
      draw(performance.now());
    }).observe(space);
    if (prefersReducedMotion) return;

    window.addEventListener(
      "pointermove",
      (e) => {
        pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
        pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
      },
      { passive: true }
    );

    let visible = true;
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }).observe(space);

    (function loop(time) {
      requestAnimationFrame(loop);
      if (!visible) return;
      eased.x += (pointer.x - eased.x) * 0.04;
      eased.y += (pointer.y - eased.y) * 0.04;
      draw(time);
    })(0);
  }

  /* ----------------------------------------------------------
     12. Contact — le perso dépasse du bas, les pupilles suivent la souris
     Rendu Blender (blender/contact-peek.blend) sans pupilles ; elles sont
     ajoutées ici en HTML, aux positions données par SITE.contactPeek.
  ---------------------------------------------------------- */
  function wireContactPeek() {
    const peek = SITE.contactPeek;
    const section = document.getElementById("contact");
    if (!peek || !section) return;

    const wrap = document.createElement("div");
    wrap.className = "contact-peek";
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      `<img src="${peek.src}" alt="" width="${peek.width}" height="${peek.height}" />` +
      peek.eyes
        .map(
          (eye) =>
            `<span class="peek-pupil" style="left:${eye.x}%;top:${eye.y}%;width:${eye.pupil * 2}%"></span>`
        )
        .join("");

    // Sur body : le pied de page a aussi besoin de ces mesures (place des doigts).
    const body = document.body;
    body.style.setProperty("--peek-ratio", peek.height / peek.width);
    body.style.setProperty("--peek-edge", peek.edge / 100);
    wrap.querySelector("img").addEventListener("error", () => {
      wrap.remove();
      body.classList.remove("has-peek");
    });
    section.appendChild(wrap);
    body.classList.add("has-peek");
    if (prefersReducedMotion) return;

    const pupils = Array.from(wrap.querySelectorAll(".peek-pupil")).map((node, i) => ({
      node,
      eye: peek.eyes[i],
      eased: { x: 0, y: 0 },
    }));

    const pointer = { x: null, y: null };
    if (window.matchMedia("(hover: hover)").matches) {
      window.addEventListener(
        "pointermove",
        (e) => {
          pointer.x = e.clientX;
          pointer.y = e.clientY;
        },
        { passive: true }
      );
    }

    let visible = false;
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    }).observe(wrap);

    (function loop(time) {
      requestAnimationFrame(loop);
      if (!visible) return;
      const rect = wrap.getBoundingClientRect();
      pupils.forEach((p) => {
        // Course max de la pupille dans le blanc de l'œil, en px
        const reach = ((p.eye.r - p.eye.pupil) / 100) * rect.width * 0.8;
        let tx, ty;
        if (pointer.x === null) {
          // Tactile : le regard dérive lentement
          tx = Math.sin(time * 0.0005) * reach * 0.8;
          ty = Math.cos(time * 0.00037) * reach * 0.4;
        } else {
          const dx = pointer.x - (rect.left + (p.eye.x / 100) * rect.width);
          const dy = pointer.y - (rect.top + (p.eye.y / 100) * rect.height);
          const dist = Math.hypot(dx, dy) || 1;
          const pull = Math.min(1, dist / 220);
          tx = (dx / dist) * reach * pull;
          ty = (dy / dist) * reach * pull;
        }
        p.eased.x += (tx - p.eased.x) * 0.14;
        p.eased.y += (ty - p.eased.y) * 0.14;
        p.node.style.transform = `translate(-50%, -50%) translate(${p.eased.x.toFixed(2)}px, ${p.eased.y.toFixed(2)}px)`;
      });
    })(0);
  }

  /* ---------------------------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderIdentity();
    renderAbout();
    renderSkills();
    renderProjects();
    renderTimeline();
    renderEducation();
    renderGallery();

    wireMobileNav();
    wireHeaderAutoHide();
    wireActiveSection();
    wireThemeZones();
    wireCaseStudyClose();
    wireHeroParallax();
    document.querySelectorAll(".hero-space, .space").forEach(wireSpace);
    wireContactPeek();

    refreshReveal();
  });
})();
