(function () {
  const API = "https://www.themealdb.com/api/json/v1/1";
  const FAVORITES_KEY = "yummy-favorites";

  function getBasePath() {
    const parts = window.location.pathname.replace(/\\/g, "/").split("/").filter(Boolean);
    const file = parts[parts.length - 1] || "";
    const isFile = /\.html?$/i.test(file);
    const folder = isFile ? parts[parts.length - 2] : parts[parts.length - 1];
    const nested = ["search", "catogery", "area", "ingredients", "contact"];
    return folder && nested.includes(folder.toLowerCase()) ? "../" : "./";
  }

  function escapeHtml(value) {
    if (value == null) return "";
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function debounce(fn, wait) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), wait);
    };
  }

  async function fetchJson(url) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Request failed (${response.status})`);
    }
    return response.json();
  }

  function getFavorites() {
    try {
      return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
    } catch {
      return [];
    }
  }

  function isFavorite(id) {
    return getFavorites().some((item) => item.id === String(id));
  }

  function toggleFavorite(meal) {
    const id = String(meal.idMeal);
    const current = getFavorites();
    const exists = current.some((item) => item.id === id);
    const next = exists
      ? current.filter((item) => item.id !== id)
      : [...current, { id, name: meal.strMeal, thumb: meal.strMealThumb }];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    return !exists;
  }

  function showLoading(container, count) {
    const cards = Number.isInteger(count) ? count : 8;
    container.innerHTML = Array.from({ length: cards }, () => {
      return `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <div class="skeleton-card" aria-hidden="true"></div>
        </div>`;
    }).join("");
    container.setAttribute("aria-busy", "true");
  }

  function showEmpty(container, message, hint) {
    container.removeAttribute("aria-busy");
    container.innerHTML = `
      <div class="col-12">
        <div class="status-panel" role="status">
          <i class="fa-solid fa-utensils" aria-hidden="true"></i>
          <h2>${escapeHtml(message || "Nothing to show yet")}</h2>
          ${hint ? `<p>${escapeHtml(hint)}</p>` : ""}
        </div>
      </div>`;
  }

  function showError(container, message, onRetry) {
    container.removeAttribute("aria-busy");
    container.innerHTML = `
      <div class="col-12">
        <div class="status-panel" role="alert">
          <i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i>
          <h2>Something went wrong</h2>
          <p>${escapeHtml(message || "Could not load data. Check your connection and try again.")}</p>
          ${typeof onRetry === "function" ? `<button type="button" class="btn btn-outline-light" data-retry>Try again</button>` : ""}
        </div>
      </div>`;
    const retryBtn = container.querySelector("[data-retry]");
    if (retryBtn && typeof onRetry === "function") {
      retryBtn.addEventListener("click", onRetry);
    }
  }

  function showToast(message) {
    let toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.className = "app-toast";
      toast.setAttribute("role", "status");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("show"), 2200);
  }

  function mealDetailsUrl(id) {
    return `${getBasePath()}meal-details.html?id=${encodeURIComponent(id)}`;
  }

  function renderMeals(container, meals) {
    container.removeAttribute("aria-busy");
    if (!meals || meals.length === 0) {
      showEmpty(container, "No meals found.", "Try a different search or filter.");
      return;
    }

    container.innerHTML = meals
      .map((meal) => {
        const name = escapeHtml(meal.strMeal);
        const thumb = escapeHtml(meal.strMealThumb);
        const id = escapeHtml(meal.idMeal);
        return `
          <div class="col-sm-6 col-md-4 col-lg-3">
            <article class="card meal-card" data-id="${id}" tabindex="0" role="link" aria-label="${name}">
              <img src="${thumb}" alt="${name}" class="card-img-top" loading="lazy">
              <div class="meal-overlay">
                <span>${name}</span>
              </div>
            </article>
          </div>`;
      })
      .join("");

    container.querySelectorAll(".meal-card").forEach((card) => {
      const go = () => {
        window.location.href = mealDetailsUrl(card.dataset.id);
      };
      card.addEventListener("click", go);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          go();
        }
      });
    });
  }

  function bindClickableCards(selector, getHref) {
    document.querySelectorAll(selector).forEach((card) => {
      const go = () => {
        window.location.href = getHref(card);
      };
      card.addEventListener("click", go);
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          go();
        }
      });
    });
  }

  function renderPageHeader(element, options) {
    if (!element) return;
    const title = options.title || "";
    const backHref = options.backHref || `${getBasePath()}index.html`;
    const backLabel = options.backLabel || "Back";
    element.innerHTML = `
      <a class="back-link" href="${escapeHtml(backHref)}">
        <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
        ${escapeHtml(backLabel)}
      </a>
      <h1 class="page-title">${escapeHtml(title)}</h1>`;
  }

  function detectActiveNav() {
    const path = window.location.pathname.replace(/\\/g, "/").toLowerCase();
    if (path.includes("/search/")) return "search";
    if (path.includes("/catogery/")) return "categories";
    if (path.includes("/area/")) return "area";
    if (path.includes("/ingredients/")) return "ingredients";
    if (path.includes("/contact/")) return "contact";
    if (path.includes("meal-details")) return "";
    return "home";
  }

  function getFocusable(container) {
    return Array.from(
      container.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
    );
  }

  function initNav() {
    if (document.getElementById("side-nav")) return;

    const base = getBasePath();
    const active = detectActiveNav();
    const links = [
      { key: "home", href: `${base}index.html`, label: "All Meals" },
      { key: "search", href: `${base}Search/search.html`, label: "Search" },
      { key: "categories", href: `${base}Catogery/catogery.html`, label: "Categories" },
      { key: "area", href: `${base}Area/area.html`, label: "Area" },
      { key: "ingredients", href: `${base}Ingredients/ingredient.html`, label: "Ingredients" },
      { key: "contact", href: `${base}Contact/contact.html`, label: "Contact Us" },
    ];

    const navHtml = `
      <div id="nav-backdrop" class="nav-backdrop" hidden></div>
      <div id="side-nav">
        <a id="logo" href="${base}index.html">
          <img src="${base}logo.png" alt="Yummy home">
        </a>
        <button type="button" id="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="nav-list">
          <i class="fas fa-bars" aria-hidden="true"></i>
        </button>
        <div id="copyright" class="text-center px-1 d-flex flex-column">
          <i class="fa-solid fa-globe fs-4 mb-1" aria-hidden="true"></i>
          <i class="fa-solid fa-share-nodes fs-4" aria-hidden="true"></i>
        </div>
      </div>
      <nav id="nav-list" class="d-flex flex-column justify-content-between" aria-label="Main">
        <ul>
          ${links
            .map((link) => {
              const isActive = link.key === active;
              return `<li>
                <a href="${link.href}" class="${isActive ? "active" : ""}"${isActive ? ' aria-current="page"' : ""}>${link.label}</a>
              </li>`;
            })
            .join("")}
        </ul>
        <div class="nav-footer">
          <div class="icons" aria-hidden="true">
            <i class="fa-solid fa-globe"></i>
            <i class="fa-brands fa-facebook"></i>
            <i class="fa-brands fa-twitter"></i>
          </div>
          <p>Copyright © 2019 All Rights Reserved.</p>
        </div>
      </nav>`;

    document.body.insertAdjacentHTML("afterbegin", navHtml);

    const menuToggle = document.getElementById("menu-toggle");
    const navList = document.getElementById("nav-list");
    const navItems = navList.querySelectorAll("li");
    const sideNav = document.getElementById("side-nav");
    const backdrop = document.getElementById("nav-backdrop");
    let isOpen = false;

    function setOpen(open) {
      isOpen = open;
      navList.classList.toggle("show", open);
      sideNav.classList.toggle("move", open);
      backdrop.hidden = !open;
      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menuToggle.innerHTML = open
        ? '<i class="fas fa-times" aria-hidden="true"></i>'
        : '<i class="fas fa-bars" aria-hidden="true"></i>';

      if (open) {
        navItems.forEach((item, index) => {
          setTimeout(() => item.classList.add("show"), index * 100);
        });
        const firstLink = navList.querySelector("a");
        if (firstLink) firstLink.focus();
      } else {
        navItems.forEach((item) => item.classList.remove("show"));
        menuToggle.focus();
      }
    }

    menuToggle.addEventListener("click", () => setOpen(!isOpen));
    backdrop.addEventListener("click", () => setOpen(false));

    document.addEventListener("keydown", (event) => {
      if (!isOpen) return;
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = [menuToggle, ...getFocusable(navList)];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }

  initNav();

  window.Yummy = {
    API,
    getBasePath,
    escapeHtml,
    debounce,
    fetchJson,
    getFavorites,
    isFavorite,
    toggleFavorite,
    showLoading,
    showEmpty,
    showError,
    showToast,
    renderMeals,
    bindClickableCards,
    renderPageHeader,
    mealDetailsUrl,
  };
})();
