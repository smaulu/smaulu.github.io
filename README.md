# smaulu.github.io

My personal portfolio — a single-page site built with semantic HTML, modern CSS and vanilla
JavaScript. No frameworks, no dependencies, no build step.

## Structure

```
.
├── index.html              # all content
└── assets/
    ├── css/style.css       # design tokens, layout, light/dark themes
    └── js/main.js          # theme toggle, mobile nav, scroll effects, copy button
```

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Editing

- **Content** lives in `index.html`.
- **Colours, spacing and fonts** are CSS variables at the top of `assets/css/style.css`.
- **Email**: replace `hello@example.com` in `index.html` (it appears in the contact button,
  the contact row and the copy button's `data-copy` attribute).
- **Projects**: copy a project card and update the title, description, tags and links.

The site is deployed automatically by GitHub Pages from the `main` branch.
