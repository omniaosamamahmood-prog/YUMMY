const { API, fetchJson, showLoading, showError, renderMeals, renderPageHeader } = window.Yummy;

const container = document.getElementById("meals-container");
const header = document.getElementById("page-header");
const ingredient = new URLSearchParams(window.location.search).get("id");

renderPageHeader(header, {
  title: ingredient || "Ingredient",
  backHref: "ingredient.html",
  backLabel: "Back to ingredients",
});

if (ingredient) {
  document.title = `${ingredient} | Yummy`;
}

async function loadIngredientMeals() {
  if (!ingredient) {
    showError(container, "No ingredient was selected.");
    return;
  }
  showLoading(container);
  try {
    const data = await fetchJson(`${API}/filter.php?i=${encodeURIComponent(ingredient)}`);
    renderMeals(container, data.meals);
  } catch {
    showError(container, "Could not load meals for this ingredient.", loadIngredientMeals);
  }
}

loadIngredientMeals();
