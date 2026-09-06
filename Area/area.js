const { API, fetchJson, escapeHtml, showLoading, showError, bindClickableCards } = window.Yummy;
const container = document.getElementById("meals-container");

function displayAreas(areas) {
  container.removeAttribute("aria-busy");
  container.innerHTML = areas
    .map((area) => {
      const name = escapeHtml(area.strArea);
      return `
        <div class="col-sm-6 col-md-4 col-lg-3">
          <div class="text-center area-detail browse-card" data-id="${name}" tabindex="0" role="link" aria-label="${name}">
            <i class="fa-solid fa-house-laptop fa-4x" aria-hidden="true"></i>
            <h2 class="h4 mt-3 mb-0">${name}</h2>
          </div>
        </div>`;
    })
    .join("");

  bindClickableCards(".area-detail", (card) => `area-meals.html?id=${encodeURIComponent(card.dataset.id)}`);
}

async function loadAreas() {
  showLoading(container);
  try {
    const data = await fetchJson(`${API}/list.php?a=list`);
    displayAreas(data.meals || []);
  } catch {
    showError(container, "Could not load areas. Check your connection and try again.", loadAreas);
  }
}

loadAreas();
