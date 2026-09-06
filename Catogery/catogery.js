const { API, fetchJson, escapeHtml, showLoading, showError, bindClickableCards } = window.Yummy;
const container = document.getElementById("meals-container");

function displayCategories(categories) {
  container.removeAttribute("aria-busy");
  container.innerHTML = categories
    .map((category) => {
      const name = escapeHtml(category.strCategory);
      const thumb = escapeHtml(category.strCategoryThumb);
      const description = escapeHtml((category.strCategoryDescription || "").slice(0, 100));
      return `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <article class="card-catog meal-card" data-id="${name}" tabindex="0" role="link" aria-label="${name}">
            <img src="${thumb}" alt="${name}" loading="lazy">
            <div class="meal-overlay p-2 text-center flex-column">
              <h4>${name}</h4>
              <p class="fw-light mb-0">${description}...</p>
            </div>
          </article>
        </div>`;
    })
    .join("");

  bindClickableCards(".card-catog", (card) => `catog-details.html?id=${encodeURIComponent(card.dataset.id)}`);
}

async function loadCategories() {
  showLoading(container);
  try {
    const data = await fetchJson(`${API}/categories.php`);
    displayCategories(data.categories || []);
  } catch {
    showError(container, "Could not load categories. Check your connection and try again.", loadCategories);
  }
}

loadCategories();
