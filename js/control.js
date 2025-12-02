
// Basemap options: simple array so it's easy to add more
const basemapOpt = [
	{ label: 'OpenStreetMap', value: 'osm' },
	{ label: 'Google Satellite', value: 'gmaps' }
];

/**
 * Create basemap radio buttons inside the dropdown.
 * Kept as a standalone function so it's easy to test/replace.
 */
function createBasemapRadios() {
	const basemapDiv = document.getElementById('basemapOpt');
	if (!basemapDiv) return;

	basemapOpt.forEach(option => {
		const radioLabel = document.createElement('label');
		radioLabel.classList.add('dropdown-item');

		radioLabel.innerHTML = `
			<input type="radio" name="basemap" value="${option.value}" onclick="changeBmap('${option.value}')" />
			<span class="ms-1"> ${option.label}</span>`;

		basemapDiv.appendChild(radioLabel);
	});

	// Set the first basemap as checked by default
	const defaultBasemap = basemapOpt[0] && basemapOpt[0].value;
	const defaultRadio = basemapDiv.querySelector(`input[value="${defaultBasemap}"]`);
	if (defaultRadio) defaultRadio.checked = true;
}

/**
 * Switch the visible basemap. This uses the two global layer variables
 * that are defined in `map.js` (`osm`, `gmaps`).
 * @param {string} basemap - 'osm' or 'gmaps'
 */
function changeBmap(basemap) {
	if (basemap === 'osm') {
		if (typeof gmaps !== 'undefined' && map.hasLayer(gmaps)) map.removeLayer(gmaps);
		if (typeof osm !== 'undefined') osm.addTo(map);
	} else if (basemap === 'gmaps') {
		if (typeof osm !== 'undefined' && map.hasLayer(osm)) map.removeLayer(osm);
		if (typeof gmaps !== 'undefined') gmaps.addTo(map);
	}
}

// Global layer reference for polygons (kept global so other modules can update)
let geojsonLayer = null;

// Function to update the map based on selected company
function updateMap(selectedCompany, rawData) {
    // 1. Clear existing Polygons AND Markers
    if (geojsonLayer) map.removeLayer(geojsonLayer);
    markerLayerGroup.clearLayers(); // <--- Important: Clear old pins

    // 2. Draw Polygons
    geojsonLayer = L.geoJSON(rawData, {
        style: styleFeature,
        filter: function(feature) {
            if (selectedCompany === 'All') return true;
            return feature.properties.SYARIKAT === selectedCompany;
        },
        onEachFeature: function(feature, layer) {
            // A. Bind the standard click popup to the polygon
            bindPopupContent(feature, layer);

            // B. Create the Center Marker + Label
            const centerMarker = createCenterMarker(feature, layer, map);
            
            // C. Add the marker to our specific group
            markerLayerGroup.addLayer(centerMarker);
        }
    }).addTo(map);

    // 3. Zoom logic
    if (geojsonLayer.getLayers().length > 0) {
        map.flyToBounds(geojsonLayer.getBounds(), { duration: 1.75 });
    }

	// --- Create / Wire Leaflet Search control here (search by LOT) ---
	if (typeof L !== 'undefined' && L.Control && L.Control.Search) {
		// If the control doesn't exist yet, create it and attach to the map
		if (!window.searchControl) {
			window.searchControl = new L.Control.Search({
				position: 'topleft',
				layer: geojsonLayer,
				propertyName: 'LOT',
				marker: false,
				initial: false,
				collapsed: true,
				textPlaceholder: 'Search LOT...',
				moveToLocation: function(latlng, title, map) {
					// Handle polygon and point results
					if (latlng && latlng.layer && latlng.layer.getBounds) {
						map.flyToBounds(latlng.layer.getBounds(), { duration: 1.75 });
					} else if (latlng && latlng.getBounds) {
						map.flyToBounds(latlng.getBounds(), { duration: 1.75 });
					} else if (latlng && latlng.lat) {
						map.setView(latlng, 17);
					} else {
						map.setView(latlng, 17);
					}
				}
			});
			map.addControl(window.searchControl);

			// Open the feature popup when a location is found
			window.searchControl.on('search:locationfound', function(e) {
				if (e && e.layer && e.layer.openPopup) {
					e.layer.openPopup();
				}
			});
		} else {
			// If control already exists (subsequent updates), set the new layer
			try {
				window.searchControl.setLayer(geojsonLayer);
			} catch (err) {
				// Some versions of the plugin may use a different API; ignore if not available
				console.warn('Search control setLayer failed', err);
			}
		}
	}
}

// Add a new global variable for the markers
let markerLayerGroup = L.layerGroup().addTo(map);

// Initialize DOM-dependent controls when the page is ready. This keeps
// initialization in one place and helps new developers find startup logic.
document.addEventListener('DOMContentLoaded', () => {
	createBasemapRadios();

	// Calculate navbar height and size the map accordingly
	const navbar = document.getElementById('my-navbar');
	const navbarHeight = navbar ? navbar.offsetHeight : 0;

	const mapContainer = document.getElementById('map');
	if (mapContainer) mapContainer.style.height = `calc(100vh - ${navbarHeight}px)`;

	const navbarContainer = document.getElementById('navbarDiv');
	if (navbarContainer) navbarContainer.style.height = `${navbarHeight}px`;
});