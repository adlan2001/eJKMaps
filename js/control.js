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
}

// Add a new global variable for the markers
let markerLayerGroup = L.layerGroup().addTo(map);

// --- js/control.js ---

let legendControl = null; // Store globally so we can remove it if needed

function updateLegend(mapInstance, data) {
    // 1. If a legend already exists, remove it (to avoid duplicates)
    if (legendControl) {
        mapInstance.removeControl(legendControl);
    }

    legendControl = L.control({ position: 'bottomright' });

    legendControl.onAdd = function (map) {
        const div = L.DomUtil.create('div', 'info legend');
        
        // 2. Find Unique Companies
        const uniqueCompanies = new Set();
        data.features.forEach(f => {
            if (f.properties.SYARIKAT) {
                uniqueCompanies.add(f.properties.SYARIKAT);
            }
        });

        // 3. Convert Set to Array and Sort Alphabetically
        const sortedCompanies = Array.from(uniqueCompanies).sort();

        div.innerHTML += '<h4>Companies</h4>';
								// 5. Generate HTML (safer DOM approach + guard for missing stringToColor)
								sortedCompanies.forEach(company => {
										const color = stringToColor(company);
				
										const item = document.createElement('div');
				
										const swatch = document.createElement('i');
										swatch.style.background = color;
										swatch.style.display = 'inline-block';
										swatch.style.width = '12px';
										swatch.style.height = '12px';
										swatch.style.marginRight = '6px';
				
										const label = document.createElement('span');
										label.textContent = company; // prevents HTML injection
				
										item.appendChild(swatch);
										item.appendChild(label);
										div.appendChild(item);
								});
				// ...existing code...

        return div;
    };

    legendControl.addTo(mapInstance);
}

// Add a deterministic string -> hex color helper
function stringToColor(str) {
	// simple hash to color
	let hash = 0;
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = '#';
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xFF;
		color += ('00' + value.toString(16)).slice(-2);
	}
	return color;
}