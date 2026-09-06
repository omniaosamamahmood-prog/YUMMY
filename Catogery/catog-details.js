const { API, fetchJson, showLoading, showError, renderMeals, renderPageHeader } = window.Yummy;

const container = document.getElementById("meals-container");
const header = document.getElementById("page-header");
const category = new URLSearchParams(window.location.search).get("id");

renderPageHeader(header, {
  title: category || "Category",
  backHref: "catogery.html",
  backLabel: "Back to categories",
});

if (category) {
  document.title = `${category} | Yummy`;
}

async function loadCategoryMeals() {
  if (!category) {
    showError(container, "No category was selected.");
    return;
  }
  showLoading(container);
  try {
    const data = await fetchJson(`${API}/filter.php?c=${encodeURIComponent(category)}`);
    renderMeals(container, data.meals);
  } catch {
    showError(container, "Could not load meals for this category.", loadCategoryMeals);
  }
}

loadCategoryMeals();
