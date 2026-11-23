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
  if (header) header.classList.toggle("is-scrolled", window.scrollY > 24);

  if (progressBar) {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  }

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
    const active = link.dataset.pageLink === id;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

const pages = [...document.querySelectorAll("main section[data-page]")];
function showPage(id, updateHistory = true) {
  const target = pages.find((page) => page.dataset.page === id);
  if (!target) return;

  pages.forEach((page) => {
    const active = page === target;
    if (active) page.setAttribute("aria-current", "page");
    else page.removeAttribute("aria-current");
  });

  setActiveLink(id);
  closeMenu();
  window.scrollTo({ top: 0, behavior: "instant" });

  if (updateHistory) {
    history.pushState({ page: id }, "", `#${id}`);
  }
}

document.querySelectorAll("[data-page-link]").forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.dataset.pageLink;
    if (!pages.some((page) => page.dataset.page === id)) return;
    event.preventDefault();
    showPage(id);
  });
});

window.addEventListener("popstate", () => {
  const id = location.hash.slice(1) || "inicio";
  showPage(id, false);
});

const initialPage = location.hash.slice(1);
if (initialPage && pages.some((page) => page.dataset.page === initialPage)) {
  showPage(initialPage, false);
} else {
  showPage("inicio", false);
}

const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
