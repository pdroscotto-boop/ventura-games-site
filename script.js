// VENTURA GAMES — cabeçalho, navegação e acessibilidade
const header = document.querySelector("#site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#main-navigation");
const progressBar = document.querySelector("#header-progress-bar");
const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = [...document.querySelectorAll("main section[id]")];

function closeMenu() {
  if (!menuButton || !navigation) return;
  navigation.classList.remove("open");
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menu");
}

function openMenu() {
  if (!menuButton || !navigation) return;
  navigation.classList.add("open");
  menuButton.setAttribute("aria-expanded", "true");
  menuButton.setAttribute("aria-label", "Fechar menu");
}

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    menuButton.getAttribute("aria-expanded") === "true" ? closeMenu() : openMenu();
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (
      menuButton.getAttribute("aria-expanded") === "true" &&
      !navigation.contains(event.target) &&
      !menuButton.contains(event.target)
    ) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMenu();
  });
}

let scrollTicking = false;
function updateHeaderOnScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

  if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);
  if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  scrollTicking = false;
}

window.addEventListener("scroll", () => {
  if (!scrollTicking) {
    window.requestAnimationFrame(updateHeaderOnScroll);
    scrollTicking = true;
  }
}, { passive: true });
updateHeaderOnScroll();

function setActiveLink(id) {
  navLinks.forEach((link) => {
    const active = link.getAttribute("href") === `#${id}`;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActiveLink(entry.target.id);
    });
  }, { rootMargin: "-38% 0px -52% 0px", threshold: 0 });

  sections.forEach((section) => observer.observe(section));
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
