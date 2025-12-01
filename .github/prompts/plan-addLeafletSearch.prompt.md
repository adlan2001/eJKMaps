Assuming Leaflet Search has been added to the project, this plan describes how to add a Leaflet search control to `js/map.js` that queries the `LOT` property from the GeoJSON layer and how to wire it to the existing geojson layer created elsewhere in the codebase.

Goal
- Add a user-facing search control (Leaflet Search) to the map UI that finds parcels by their `LOT` property and zooms/fits to the matching feature.

Plan Steps
1) Verify assets
- Confirm `js/search.js` and `css/search.css` (or `search.css`) are included in `index.html` and load before `js/map.js`.

2) Initialize the Search control in `js/map.js`
- Add an initialization after the map and existing controls are created (e.g., after `updateZoomClass()` near the end of `js/map.js`).
- Create the control globally so other scripts can set its target layer later: `window.searchControl = L.control.search({...}).addTo(map);`.
- Recommended options:
  - `propertyName: 'LOT'`
  - `layer: null` (set later)
  - `marker: false` (or provide a custom marker)
  - `collapsed: true`
  - `initial: false`
  - `textPlaceholder: 'Search LOT...'` (optional)
  - `moveToLocation` callback that fits bounds for polygons and uses `setView` for points.

3) Wire the search control to the GeoJSON layer when it's created
- The GeoJSON layer (named e.g. `geojsonLayer`) is created in the layer/control code (e.g., `js/control.js` or `js/layer.js`).
- Ensure that the layer variable is accessible outside its file (assign to `window.geojsonLayer` after creation, or export it if using modules).
- Immediately after creating/adding the geojson layer, call:
  - `if (window.searchControl) window.searchControl.setLayer(window.geojsonLayer);`
  - Optionally, call `window.searchControl._refresh();` or similar to reindex features if the plugin requires it.

4) Optional UX: open popup or highlight match
- On selection, open the matched feature's popup and optionally add a temporary highlight style.
- Use the `search:locationfound` or the plugin's `on('search:locationfound', callback)` event to handle opening popup and highlight.

5) Test
- Load the app in the browser and test queries for `LOT` values (try exact and partial values).
- Verify map pans/zooms to the parcel and popup behavior.

Pseudocode Snippet
// create control (in `js/map.js`)
window.searchControl = L.control.search({
  propertyName: 'LOT',
  layer: null,
  marker: false,
  initial: false,
  collapsed: true,
  textPlaceholder: 'Search LOT...',
  moveToLocation: function(latlng, title, map) {
    if (latlng.layer && latlng.layer.getBounds) {
      map.fitBounds(latlng.layer.getBounds());
    } else {
      map.setView(latlng, 16);
    }
  }
}).addTo(map);

// after geojson layer creation (in `js/control.js` or `js/layer.js`)
window.geojsonLayer = L.geoJSON(geojsonData, { style: styleFeature, onEachFeature: bindPopupContent }).addTo(map);
if (window.searchControl) {
  window.searchControl.setLayer(window.geojsonLayer);
}

Files to Edit
- `js/map.js`: Initialize the Leaflet Search control after map init and other controls. (Insertion point: after `updateZoomClass()` call near end of file.)
- `js/control.js` or `js/layer.js`: After creating the L.geoJSON layer, expose the layer (e.g., `window.geojsonLayer = ...`) and call `window.searchControl.setLayer(window.geojsonLayer)`.

Follow-up Checks
- Confirm that features in `data/boonsiew.geojson` include the `LOT` property and that the values are appropriate for search.
- If `search.js` requires reindexing after layer set, call the plugin's refresh function if available.
- If the search control appears in an odd place, adjust control position via options (e.g., `position: 'topleft'`).

Optional Improvements
- Show colored small swatch in the search results if plugin supports result formatting (e.g., include company color alongside LOT).
- Add partial-match or case-insensitive settings depending on plugin options.

Questions for you
- Do you prefer the search control initialized in `js/map.js` (then wired from `js/control.js`) or created inside `js/control.js` immediately after the geojson layer is created?  The former keeps control initialization in the UI/controls file; the latter keeps the wiring together.

Next actions I can take for you
- Implement the code changes in `js/map.js` and `js/control.js` (or `js/layer.js`) and run a quick static sanity check.
- Update `index.html` to include `search.js` and `search.css` if missing.
- Add a small demo of the search control behavior in the codebase.


