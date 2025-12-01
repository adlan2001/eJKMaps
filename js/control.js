// Define an array of basemap options
var basemapOpt = [
	{
		label: 'OpenStreetMap',
		value: 'osm'
	},
	{
		label: 'Google Satellite',
		value: 'gmaps'
	},
	// Add more basemap options as needed
];

// Function to create basemap radio buttons
function createBasemapRadios() {
	var basemapDiv = document.getElementById('basemapOpt');

	basemapOpt.forEach(function (option) {
		var radioLabel = document.createElement('label');
		radioLabel.classList.add('dropdown-item');
		
		radioLabel.innerHTML = `<input type="radio" name="basemap" value="${option.value}" onclick="changeBmap('${option.value}')" />
		<span class="ms-1"> ${option.label}</span>`;
		basemapDiv.appendChild(radioLabel);
	});

	// Set the first basemap as checked by default
	var defaultBasemap = basemapOpt[0].value;
	var defaultRadio = basemapDiv.querySelector(`input[value="${defaultBasemap}"]`);
	if (defaultRadio) {
		defaultRadio.checked = true;
	}
}

// Call the function to create basemap radios and utilities checkboxes
createBasemapRadios();

function changeBmap(basemap) {
	if (basemap === 'osm') {
			map.removeLayer(gmaps);
			osm.addTo(map);
	} else if (basemap === 'gmaps') {
			map.removeLayer(osm);
			gmaps.addTo(map);
	}
}

// Get the navbar element using its ID
var navbar = document.getElementById('my-navbar');

// Calculate the height of the navbar
var navbarHeight = navbar.offsetHeight;

// Set the map container's height by subtracting the navbar height from the available view height
const mapContainer = document.getElementById("map");
mapContainer.style.height = `calc(100vh - ${navbarHeight}px)`;

//Set the space for navbar to avoid map element from positioning behind the navbar
const navbarContainer = document.getElementById("navbarDiv");
navbarContainer.style.height = `${navbarHeight}px`;

let geojsonLayer = null; // We need this variable accessible globally

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
        map.fitBounds(geojsonLayer.getBounds());
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
						map.fitBounds(latlng.layer.getBounds());
					} else if (latlng && latlng.getBounds) {
						map.fitBounds(latlng.getBounds());
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