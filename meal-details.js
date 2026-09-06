const {
  API,
  getBasePath,
  escapeHtml,
  fetchJson,
  showLoading,
  showError,
  showToast,
  isFavorite,
  toggleFavorite,
} = window.Yummy;

const container = document.getElementById("meal-details");
const mealId = new URLSearchParams(window.location.search).get("id");
const base = getBasePath();

function goBack() {
  if (window.history.length > 1) {
    window.history.back();
    return;
  }
  window.location.href = `${base}index.html`;
}

function formatInstructions(text) {
  return escapeHtml(text || "")
    .split(/\r?\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => `<p>${part}</p>`)
    .join("");
}

function getIngredients(meal) {
  const items = [];
  for (let i = 1; i <= 20; i += 1) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      items.push({
        ingredient: ingredient.trim(),
        measure: (measure || "").trim(),
      });
    }
  }
  return items;
}

function renderMeal(meal) {
  const name = escapeHtml(meal.strMeal);
  const category = meal.strCategory || "";
  const area = meal.strArea || "";
  const thumb = escapeHtml(meal.strMealThumb);
  const favorite = isFavorite(meal.idMeal);
  const ingredients = getIngredients(meal)
    .map((item) => {
      const label = [item.measure, item.ingredient].filter(Boolean).join(" ");
      return `<li>${escapeHtml(label)}</li>`;
    })
    .join("");

  const tags = meal.strTags
    ? meal.strTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => `<span class="tag-badge">${escapeHtml(tag)}</span>`)
        .join("")
    : "";

  const sourceBtn = meal.strSource
    ? `<a href="${escapeHtml(meal.strSource)}" target="_blank" rel="noopener noreferrer" class="btn btn-success me-2">Source</a>`
    : "";
  const youtubeBtn = meal.strYoutube
    ? `<a href="${escapeHtml(meal.strYoutube)}" target="_blank" rel="noopener noreferrer" class="btn btn-danger">YouTube</a>`
    : "";

  const categoryHref = category
    ? `${base}Catogery/catog-details.html?id=${encodeURIComponent(category)}`
    : "";
  const areaHref = area ? `${base}Area/area-meals.html?id=${encodeURIComponent(area)}` : "";

  document.title = `${meal.strMeal} | Yummy`;
  container.removeAttribute("aria-busy");

  container.innerHTML = `
    <div class="col-12">
      <div class="details-toolbar">
        <div>
          <button type="button" class="back-link btn btn-link p-0" id="back-btn">
            <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
            Back
          </button>
          <nav class="breadcrumbs" aria-label="Breadcrumb">
            <a href="${base}index.html">Home</a>
            <span aria-hidden="true">/</span>
            ${
              category
                ? `<a href="${categoryHref}">${escapeHtml(category)}</a><span aria-hidden="true">/</span>`
                : ""
            }
            <span aria-current="page">${name}</span>
          </nav>
        </div>
        <div class="details-actions">
          <button type="button" class="icon-btn${favorite ? " is-active" : ""}" id="favorite-btn" aria-pressed="${favorite}" aria-label="${favorite ? "Remove from favorites" : "Add to favorites"}">
            <i class="${favorite ? "fa-solid" : "fa-regular"} fa-heart" aria-hidden="true"></i>
          </button>
          <button type="button" class="icon-btn" id="share-btn" aria-label="Share this meal">
            <i class="fa-solid fa-share-nodes" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
    <div class="col-md-4 mb-4">
      <img src="${thumb}" class="meal-photo" alt="${name}" loading="lazy">
      <h1 class="h2 text-center mt-3">${name}</h1>
    </div>
    <div class="col-md-8">
      <h2>Instructions</h2>
      ${formatInstructions(meal.strInstructions)}
      <p class="details-meta">
        <strong>Area:</strong>
        ${area ? `<a href="${areaHref}">${escapeHtml(area)}</a>` : "Unknown"}
      </p>
      <p class="details-meta">
        <strong>Category:</strong>
        ${category ? `<a href="${categoryHref}">${escapeHtml(category)}</a>` : "Unknown"}
      </p>
      <h3 class="h4">Recipes</h3>
      <ul class="recipe-list">${ingredients || "<li>No ingredients listed</li>"}</ul>
      <h3 class="h4 mt-3">Tags</h3>
      <div>${tags || '<span class="text-warning">No tags</span>'}</div>
      <div class="mt-4">${sourceBtn}${youtubeBtn}</div>
    </div>`;

  document.getElementById("back-btn").addEventListener("click", goBack);

  const favoriteBtn = document.getElementById("favorite-btn");
  favoriteBtn.addEventListener("click", () => {
    const nowFavorite = toggleFavorite(meal);
    favoriteBtn.classList.toggle("is-active", nowFavorite);
    favoriteBtn.setAttribute("aria-pressed", String(nowFavorite));
    favoriteBtn.setAttribute("aria-label", nowFavorite ? "Remove from favorites" : "Add to favorites");
    favoriteBtn.innerHTML = `<i class="${nowFavorite ? "fa-solid" : "fa-regular"} fa-heart" aria-hidden="true"></i>`;
    showToast(nowFavorite ? "Added to favorites" : "Removed from favorites");
  });

  document.getElementById("share-btn").addEventListener("click", async () => {
    const shareData = { title: meal.strMeal, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      showToast("Link copied");
    } catch (error) {
      if (error && error.name === "AbortError") return;
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied");
      } catch {
        showToast("Could not share this meal");
      }
    }
  });
}

async function loadMealDetails() {
  if (!mealId) {
    showError(container, "No meal was selected.");
    return;
  }

  showLoading(container, 2);
  try {
    const data = await fetchJson(`${API}/lookup.php?i=${encodeURIComponent(mealId)}`);
    const meal = data.meals && data.meals[0];
    if (!meal) {
      showError(container, "This meal could not be found.");
      return;
    }
    renderMeal(meal);
  } catch {
    showError(container, "Could not load this recipe. Check your connection and try again.", loadMealDetails);
  }
}

loadMealDetails();
