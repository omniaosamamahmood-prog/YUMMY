const { API, fetchJson, showLoading, showError, renderMeals, renderPageHeader } = window.Yummy;

const container = document.getElementById("meals-container");
const header = document.getElementById("page-header");
const area = new URLSearchParams(window.location.search).get("id");

renderPageHeader(header, {
  title: area || "Area",
  backHref: "area.html",
  backLabel: "Back to areas",
});

if (area) {
  document.title = `${area} | Yummy`;
}

async function loadAreaMeals() {
  if (!area) {
    showError(container, "No area was selected.");
    return;
  }
  showLoading(container);
  try {
    const data = await fetchJson(`${API}/filter.php?a=${encodeURIComponent(area)}`);
    renderMeals(container, data.meals);
  } catch {
    showError(container, "Could not load meals for this area.", loadAreaMeals);
  }
}

loadAreaMeals();
