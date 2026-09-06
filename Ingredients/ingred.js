const { API, fetchJson, escapeHtml, showLoading, showError, bindClickableCards } = window.Yummy;
const container = document.getElementById("meals-container");

function displayIngredients(ingredients) {
  container.removeAttribute("aria-busy");
  container.innerHTML = ingredients
    .map((ingredient) => {
      const name = escapeHtml(ingredient.strIngredient);
      const description = escapeHtml(
        (ingredient.strDescription || "No description available").slice(0, 90)
      );
      return `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <div class="text-center p-2 card-ing browse-card" data-id="${name}" tabindex="0" role="link" aria-label="${name}">
            <i class="fa-solid fa-drumstick-bite fa-4x" aria-hidden="true"></i>
            <h3 class="h5 mt-3">${name}</h3>
            <p class="mb-0">${description}</p>
          </div>
        </div>`;
    })
    .join("");

  bindClickableCards(".card-ing", (card) => `ingred-meals.html?id=${encodeURIComponent(card.dataset.id)}`);
}

async function loadIngredients() {
  showLoading(container);
  try {
    const data = await fetchJson(`${API}/list.php?i=list`);
    displayIngredients((data.meals || []).slice(0, 20));
  } catch {
    showError(container, "Could not load ingredients. Check your connection and try again.", loadIngredients);
  }
}

loadIngredients();
