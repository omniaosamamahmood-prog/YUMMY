<p align="center">
  <img src="logo.png" alt="Yummy logo" width="96">
</p>

<h1 align="center">Yummy</h1>

<p align="center">
  Recipe discovery app powered by TheMealDB
</p>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5">
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white" alt="Bootstrap">
  <img src="https://img.shields.io/badge/Font_Awesome-528DD7?style=for-the-badge&logo=fontawesome&logoColor=white" alt="Font Awesome">
  <img src="https://img.shields.io/badge/TheMealDB-API-E74C3C?style=for-the-badge" alt="TheMealDB">
  <img src="https://img.shields.io/badge/SweetAlert2-8D6E63?style=for-the-badge" alt="SweetAlert2">
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=html,css,js,bootstrap,vscode,git,github" alt="HTML, CSS, JavaScript, Bootstrap, VS Code, Git, GitHub">
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
  <a href="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="https://skillicons.dev/icons?i=html" alt="HTML5"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://skillicons.dev/icons?i=css" alt="CSS3"></a>
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://skillicons.dev/icons?i=js" alt="JavaScript"></a>
  <a href="https://getbootstrap.com/"><img src="https://skillicons.dev/icons?i=bootstrap" alt="Bootstrap"></a>
  <a href="https://fontawesome.com/"><img src="https://cdn.simpleicons.org/fontawesome/528DD7" alt="Font Awesome" width="48" height="48"></a>
</p>

| | Tool | Role |
| :---: | --- | --- |
| <img src="https://skillicons.dev/icons?i=html" alt="HTML5" width="36"> | [HTML5](https://developer.mozilla.org/en-US/docs/Web/HTML) | Page structure |
| <img src="https://skillicons.dev/icons?i=css" alt="CSS3" width="36"> | [CSS3](https://developer.mozilla.org/en-US/docs/Web/CSS) | Theme, layout, and motion |
| <img src="https://skillicons.dev/icons?i=js" alt="JavaScript" width="36"> | [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript) | Navigation, search, and API calls |
| <img src="https://skillicons.dev/icons?i=bootstrap" alt="Bootstrap" width="36"> | [Bootstrap 5.3](https://getbootstrap.com/) | Responsive grid and form styles |
| <img src="https://cdn.simpleicons.org/fontawesome/528DD7" alt="Font Awesome" width="36" height="36"> | [Font Awesome 6](https://fontawesome.com/) | Menu, status, and recipe icons |
| <img src="https://img.shields.io/badge/API-TheMealDB-E74C3C?style=flat-square" alt="TheMealDB"> | [TheMealDB API](https://www.themealdb.com/api.php) | Meals, categories, areas, ingredients |
| <img src="https://img.shields.io/badge/SweetAlert2-8D6E63?style=flat-square" alt="SweetAlert2"> | [SweetAlert2](https://sweetalert2.github.io/) | Contact form success alert |
| <img src="https://img.shields.io/badge/Web_Storage-4285F4?style=flat-square&logo=googlechrome&logoColor=white" alt="localStorage"> | `localStorage` | Favorites and home-page cache |

No build step, bundler, or backend is required.

## Getting started

<p>
  <img src="https://img.shields.io/badge/npx-serve-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npx serve">
  <img src="https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/Live_Server-007ACC?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Live Server">
</p>

Serve the project from the repo root so API calls and relative paths work. Opening `index.html` directly as a `file://` page may be blocked by the browser.

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
