//OpenStreetMap Standard Basemap
var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 22, // Max-zoom is 19
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"> OpenStreetMap</a>'
});

//Google Maps Satellite Basemap
var gmaps = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
	maxZoom: 22, // Max-zoom is 22
	subdomains:["mt0","mt1","mt2","mt3"],
	attribution: '&copy; <a href="https://www.google.com/maps/"> Google Maps</a>'
});

//Define Penang Island bounds
var penangBounds = L.latLngBounds(
		L.latLng(5.2661, 100.2043), // Southwest coordinates
		L.latLng(5.4601, 100.3278)  // Northeast coordinates
);

//Initialize the map
var map = L.map('map', {
		zoomControl:true,
		maxZoom:22,
		minZoom:1,
		layers: [osm]
}).fitBounds(penangBounds);

//Hash URL
var hash = new L.Hash(map);

//Map attribution
map.attributionControl.setPrefix('<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

//Add ruler control
L.control.ruler({
	position: 'topleft',
  lengthUnit: {
    display: 'm',
    decimal: 2,
    factor: 1000,
    label: 'Distance'
  },
}).addTo(map);

//Add better scale control
L.control.betterscale().addTo(map);

//Add coordinates control
L.control.coordinates({
	position: 'bottomright',
	labelTemplateLng: 'Long: {x}',
	useLatLngOrder: true,
	labelFormatterLng : function(lng){return "<br><code>Long: "  + lng.toFixed(4) + " dd</code>"},
	labelFormatterLat : function(lat){return "<code>Lat : " + lat.toFixed(4) + " dd</code>"},
	centerUserCoordinates: true
}).addTo(map);

// Function to update map class based on zoom
function updateZoomClass() {
    const zoom = map.getZoom();
    const mapContainer = map.getContainer();

    // Reset classes
    mapContainer.classList.remove('map-zoom-out', 'map-zoom-in');

    if (zoom <= 15) {
        mapContainer.classList.add('map-zoom-out');
    } else {
        mapContainer.classList.add('map-zoom-in');
    }
}

// Listen to the zoom event
map.on('zoomend', updateZoomClass);

// Run it once on startup
updateZoomClass();