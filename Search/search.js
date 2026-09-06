const {
  API,
  fetchJson,
  debounce,
  showLoading,
  showEmpty,
  showError,
  renderMeals,
} = window.Yummy;

const container = document.getElementById("meals-container");
const nameInput = document.getElementById("search-name");
const letterInput = document.getElementById("search-letter");
let searchRequest = 0;

showEmpty(container, "Search for a meal", "Type a name or a first letter to get started.");

async function searchByName(query) {
  const requestId = ++searchRequest;
  if (!query) {
    showEmpty(container, "Search for a meal", "Type a name or a first letter to get started.");
    return;
  }
  showLoading(container);
  try {
    const data = await fetchJson(`${API}/search.php?s=${encodeURIComponent(query)}`);
    if (requestId !== searchRequest) return;
    renderMeals(container, data.meals);
  } catch {
    if (requestId !== searchRequest) return;
    showError(container, "Could not search meals. Check your connection and try again.", () => {
      searchByName(query);
    });
  }
}

async function searchByLetter(letter) {
  const requestId = ++searchRequest;
  if (!letter) {
    showEmpty(container, "Search for a meal", "Type a name or a first letter to get started.");
    return;
  }
  showLoading(container);
  try {
    const data = await fetchJson(`${API}/search.php?f=${encodeURIComponent(letter)}`);
    if (requestId !== searchRequest) return;
    renderMeals(container, data.meals);
  } catch {
    if (requestId !== searchRequest) return;
    showError(container, "Could not search meals. Check your connection and try again.", () => {
      searchByLetter(letter);
    });
  }
}

const debouncedNameSearch = debounce((query) => {
  searchByName(query);
}, 300);

nameInput.addEventListener("input", () => {
  letterInput.value = "";
  debouncedNameSearch(nameInput.value.trim());
});

letterInput.addEventListener("input", () => {
  const letter = letterInput.value.replace(/[^a-zA-Z]/g, "").slice(0, 1);
  letterInput.value = letter;
  nameInput.value = "";
  searchByLetter(letter.toLowerCase());
});
