# Lux Central

A luxury car dealership showcase with a 3D hero, an interactive collection grid, and a
click-to-enlarge full 3D detail view with specs and a reserve button.

## Files
```
lux-central/
├── index.html        page structure
├── css/style.css      navy/white/gray luxury styling, transparent nav, detail overlay
└── js/
    ├── cars-data.js    the 5 vehicles — edit this to add/change models
    ├── car-builder.js  procedural Three.js car geometry, shared by hero + detail view
    └── app.js          nav behavior, grid rendering, enlarge-to-detail interaction
```

100% static — plain HTML/CSS/JS, no build step, no backend. This means it's directly
compatible with GitHub Pages.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `lux-central`).
2. Push these files to it, keeping the folder structure exactly as-is (`index.html` at the
   repo root, `css/` and `js/` as subfolders).
3. In the repo, go to **Settings → Pages**.
4. Under **Source**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then save.
5. GitHub gives you a URL like `https://your-username.github.io/lux-central/` — usually live
   within a minute or two.

## Editing the lineup

Everything about each vehicle — name, category, price, description, and specs — lives in
`js/cars-data.js`. To add a new model, copy one of the existing objects, give it a unique
`id`, and set `bodyType` to one of: `sedan`, `suv`, `coupe`, `ev`, `convertible` (this
controls the 3D silhouette).
