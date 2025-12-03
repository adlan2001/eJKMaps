// Simple map initialization and helper docs for new contributors
// Keep layer variables in global scope because other modules (control.js)
// reference them by name (e.g. `osm`, `gmaps`). This keeps changes minimal
// while making the code clearer for beginners.

// OpenStreetMap Standard Basemap
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 22,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"> OpenStreetMap</a>'
});

// Google Maps Satellite Basemap
var gmaps = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
	maxZoom: 22,
	subdomains:["mt0","mt1","mt2","mt3"],
	attribution: '&copy; <a href="https://www.google.com/maps/"> Google Maps</a>'
});

// Define Penang Island bounds used as the initial view
var penangBounds = L.latLngBounds(
	L.latLng(5.2661, 100.2043), // Southwest coordinates
	L.latLng(5.4601, 100.3278)  // Northeast coordinates
);

// Initialize the map. Using `var` keeps the global name `map` available
// to other modules that rely on it (existing code uses `map` globally).
var map = L.map('map', {
	zoomControl: true,
	maxZoom: 22,
	minZoom: 1,
	layers: [osm]
}).fitBounds(penangBounds);

// Hash URL - keep map state shareable in the URL
var hash = new L.Hash(map);

// Map attribution helper
map.attributionControl.setPrefix('<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

// Add some helpful controls. These come from included plugins.
L.control.ruler({
	position: 'topleft',
	lengthUnit: {
		display: 'm',
		decimal: 2,
		factor: 1000,
		label: 'Distance'
	}
}).addTo(map);

L.control.betterscale().addTo(map);

L.control.coordinates({
	position: 'bottomright',
	labelTemplateLng: 'Long: {x}',
	useLatLngOrder: true,
	labelFormatterLng: function(lng){ return "<br><code>Long: "  + lng.toFixed(4) + " dd</code>"; },
	labelFormatterLat: function(lat){ return "<code>Lat : " + lat.toFixed(4) + " dd</code>"; },
	centerUserCoordinates: true
}).addTo(map);

// Function to update a CSS class on the map container so styles can
// change depending on zoom (e.g. different label sizes or behaviors).
function updateZoomClass() {
	var zoom = map.getZoom();
	var mapContainer = map.getContainer();

	// Reset classes
	mapContainer.classList.remove('map-zoom-out', 'map-zoom-in');

	if (zoom <= 15) {
		mapContainer.classList.add('map-zoom-out');
	} else {
		mapContainer.classList.add('map-zoom-in');
	}
}

// Listen to the zoom event and run once on startup so the correct
// class is set for initial render.
map.on('zoomend', updateZoomClass);
updateZoomClass();

L.easyPrint({
		title: 'Print map',
		position: 'topleft',
		sizeModes: ['Current','A4Portrait', 'A4Landscape'],
}).addTo(map);