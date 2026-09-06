<p align="center">
  <img src="logo.png" alt="Yummy logo" width="96">
</p>

<h1 align="center">Yummy</h1>

<p align="center">
  Recipe discovery app powered by TheMealDB
</p>

<p align="center">
  <a href="https://yummy-three-orcin.vercel.app/"><strong>Live Demo</strong></a>
</p>

<p align="center">
  <img src="assets/tech/badge-html.svg" alt="HTML5">
  <img src="assets/tech/badge-css.svg" alt="CSS3">
  <img src="assets/tech/badge-js.svg" alt="JavaScript">
  <img src="assets/tech/badge-bootstrap.svg" alt="Bootstrap">
  <img src="assets/tech/badge-fontawesome.svg" alt="Font Awesome">
  <img src="assets/tech/badge-themealdb.svg" alt="TheMealDB">
  <img src="assets/tech/badge-sweetalert.svg" alt="SweetAlert2">
</p>

<p align="center">
  <img src="assets/tech/html.svg" alt="HTML5" width="40" height="40">
  <img src="assets/tech/css.svg" alt="CSS3" width="40" height="40">
  <img src="assets/tech/js.svg" alt="JavaScript" width="40" height="40">
  <img src="assets/tech/bootstrap.svg" alt="Bootstrap" width="40" height="40">
  <img src="assets/tech/fontawesome.svg" alt="Font Awesome" width="40" height="40">
  <img src="assets/tech/vscode.svg" alt="VS Code" width="40" height="40">
  <img src="assets/tech/git.svg" alt="Git" width="40" height="40">
  <img src="assets/tech/github.svg" alt="GitHub" width="40" height="40">
</p>

A recipe discovery web app built with HTML, CSS, and vanilla JavaScript. Browse meals from [TheMealDB](https://www.themealdb.com/api.php), search by name or first letter, and open a full recipe with instructions, ingredients, and video links.

## Features

- **Home** — loads a grid of meals from TheMealDB (up to 20), with an offline fallback to the last successful list
- **Search** — find meals by name (debounced) or by first letter
- **Categories, Area, Ingredients** — filter meals by type, cuisine, or main ingredient
- **Meal details** — photo, instructions, measured ingredients, tags, plus Source and YouTube links when available
- **Favorites & share** — save a meal in `localStorage`, or share / copy its link
- **Contact form** — client-side validation for name, email, Egyptian phone number, age, and password
- **Shared UI** — one sidebar, one meal-card renderer, and consistent loading / empty / error states on every page

The side menu highlights the current page, closes on Escape or backdrop click, and is keyboard-accessible.

## Tech stack

<p align="center">
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="assets/tech/html.svg" alt="HTML5" width="48" height="48"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="assets/tech/css.svg" alt="CSS3" width="48" height="48"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="assets/tech/js.svg" alt="JavaScript" width="48" height="48"></a>
  <a href="https://getbootstrap.com/"><img src="assets/tech/bootstrap.svg" alt="Bootstrap" width="48" height="48"></a>
  <a href="https://fontawesome.com/"><img src="assets/tech/fontawesome.svg" alt="Font Awesome" width="48" height="48"></a>
</p>

| | Tool | Role |
| :---: | --- | --- |
| <img src="assets/tech/html.svg" alt="HTML5" width="36" height="36"> | [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) | Page structure |
| <img src="assets/tech/css.svg" alt="CSS3" width="36" height="36"> | [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) | Theme, layout, and motion |
| <img src="assets/tech/js.svg" alt="JavaScript" width="36" height="36"> | [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Navigation, search, and API calls |
| <img src="assets/tech/bootstrap.svg" alt="Bootstrap" width="36" height="36"> | [Bootstrap 5.3](https://getbootstrap.com/) | Responsive grid and form styles |
| <img src="assets/tech/fontawesome.svg" alt="Font Awesome" width="36" height="36"> | [Font Awesome 6](https://fontawesome.com/) | Menu, status, and recipe icons |
| <img src="assets/tech/badge-themealdb.svg" alt="TheMealDB"> | [TheMealDB API](https://www.themealdb.com/api.php) | Meals, categories, areas, ingredients |
| <img src="assets/tech/badge-sweetalert.svg" alt="SweetAlert2"> | [SweetAlert2](https://sweetalert2.github.io/) | Contact form success alert |
| <img src="assets/tech/badge-storage.svg" alt="localStorage"> | `localStorage` | Favorites and home-page cache |

No build step, bundler, or backend is required.

## Getting started

<p>
  <img src="assets/tech/badge-serve.svg" alt="npx serve">
  <img src="assets/tech/badge-pages.svg" alt="GitHub Pages">
  <img src="assets/tech/badge-liveserver.svg" alt="Live Server">
</p>

The live site is at [https://yummy-three-orcin.vercel.app/](https://yummy-three-orcin.vercel.app/).

To run it locally, serve the project from the repo root so API calls and relative paths work. Opening `index.html` directly as a `file://` page may be blocked by the browser.

```bash
npx serve
```

Then open the local URL (for example `http://localhost:3000`) and start at the home page.

A static host such as GitHub Pages, Netlify, or VS Code Live Server also works.

## Project structure

```text
Yummy/
├── index.html              # Home — all meals
├── meal-details.html       # Recipe page
├── style.css               # Shared theme and components
├── js/shared.js            # Nav, API helpers, cards, UI states
├── main.js                 # Home page logic
├── meal-details.js         # Recipe page logic
├── Search/                 # Search by name or first letter
├── Catogery/               # Categories and category meals
├── Area/                   # Areas and area meals
├── Ingredients/            # Ingredients and ingredient meals
└── Contact/                # Validated contact form
```

Shared behavior lives in `js/shared.js` so navigation, meal cards, and fetch error handling stay consistent across pages.

## Pages

| Page | Path | What it does |
| --- | --- | --- |
| Home | `index.html` | Shows featured meals |
| Search | `Search/search.html` | Live search by name or letter |
| Categories | `Catogery/catogery.html` | Browse meal types |
| Area | `Area/area.html` | Browse by cuisine / country |
| Ingredients | `Ingredients/ingredient.html` | Browse by main ingredient |
| Meal details | `meal-details.html?id=` | Full recipe |
| Contact | `Contact/contact.html` | Validated form |

Category, area, and ingredient lists each open a filtered meal grid, then the same details page.

## API

All meal data comes from TheMealDB v1 endpoints:

- `search.php?s=` — search by name (empty query returns a default list)
- `search.php?f=` — search by first letter
- `lookup.php?i=` — meal by id
- `categories.php` — category list
- `list.php?a=list` / `list.php?i=list` — areas and ingredients
- `filter.php?c=` / `?a=` / `?i=` — meals for a filter

Failed requests show a retry action. The home page also stores the last loaded meals and can show them if the network is unavailable.

## Notes

- The contact form is front-end only. Submit shows a success alert and does not send data to a server.
- Favorites are stored locally in the browser under `yummy-favorites`.
- Folder names such as `Catogery` are kept so existing links continue to work.

## License

This project is for learning and portfolio use. Meal photos, names, and recipes belong to [TheMealDB](https://www.themealdb.com/).
