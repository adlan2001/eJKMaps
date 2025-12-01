**Overview**

This project is a small Leaflet-based map app. This short guide shows
where to edit common things so new contributors can get started quickly:

**Basemaps**:
- **File:** `js/map.js` and `js/control.js`.
- **Edit tile definition:** Add a new tile layer in `js/map.js`, for example:
  - `var myBasemap = L.tileLayer('https://{s}.example.com/{z}/{x}/{y}.png', { attribution: '…', maxZoom: 22 });`
- **Expose option in UI:** Add an entry to the `basemapOpt` array in `js/control.js`:
  - `{ label: 'My Basemap', value: 'myBasemap' }`
- **Switching:** The `changeBmap()` function in `js/control.js` maps the `value` to the global layer variables (for example `osm`, `gmaps`, `myBasemap`). Use those names when adding new layers.

**GeoJSON Data**:
- **File:** `data/boonsiew.geojson` and `js/data.js`.
- **Add or update data:** Replace or edit `data/boonsiew.geojson` (GeoJSON FeatureCollection). Keep property names consistent (the code expects properties like `SYARIKAT`, `LOT`, etc.).
- **Behavior:** `js/data.js` loads the GeoJSON and populates the company dropdown. If you change property names, update `js/data.js` and `js/layer.js` accordingly.

**Labels & Popups**:
- **File:** `js/layer.js`.
- **Popup content:** Edit `bindPopupContent(feature, layer)` to change which properties are shown and how the popup HTML looks.
- **Style:** Edit `styleFeature(feature)` to change polygon colors, weight, opacity, etc. The current code uses `stringToColor()` to deterministically color by `SYARIKAT`.
- **Center marker / tooltip:** `createCenterMarker(feature, layer)` creates the permanent label placed on each polygon. Adjust tooltip options or marker creation here.

**Startup / DOM initialization**:
- `js/control.js` and `js/data.js` initialize DOM elements on `DOMContentLoaded`. If you add new UI elements, ensure code runs after the DOM is ready or add initialization to the same event handler.

**Quick workflow**
- Start the local server (XAMPP/Apache) and open `http://localhost/eJKMaps/index.html`.
- Edit files, save, and refresh the browser.

**Style & code notes**
- Prefer small, focused changes. Keep global names (`map`, `osm`, `gmaps`) intact unless you update all references.
- Use `console.warn()`/`console.error()` for helpful debug output when testing.

If you'd like, I can add a short example PR that: (1) adds a new basemap; (2) shows how to add a second test GeoJSON file and toggle between datasets.