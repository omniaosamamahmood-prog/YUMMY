const { API, fetchJson, showLoading, showError, showToast, renderMeals } = window.Yummy;
const container = document.getElementById("meals-container");
const CACHE_KEY = "yummy-home-meals";

async function loadHome() {
  showLoading(container);
  try {
    const data = await fetchJson(`${API}/search.php?s=`);
    const meals = (data.meals || []).slice(0, 20);
    localStorage.setItem(CACHE_KEY, JSON.stringify(meals));
    renderMeals(container, meals);
  } catch {
    let cached = null;
    try {
      cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    } catch {
      cached = null;
    }
    if (cached && cached.length) {
      renderMeals(container, cached);
      showToast("Showing saved meals (offline)");
    } else {
      showError(container, "Could not load meals. Check your connection and try again.", loadHome);
    }
  }
}

loadHome();
