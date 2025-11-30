var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 24, // Max-zoom is 19
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright"> OpenStreetMap</a>'
});

var gmaps = L.tileLayer('https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}',{
	maxZoom: 24, // Max-zoom is 22
	subdomains:["mt0","mt1","mt2","mt3"],
	attribution: '&copy; <a href="https://www.google.com/maps/"> Google Maps</a>'
});

var map = L.map('map', {
		zoomControl:true,
		maxZoom:24,
		minZoom:1,
		center: [1.5630,103.7566],
		zoom: 12,
		layers: [osm]
});

setInterval(function () {
    map.invalidateSize();
 }, 100);

var hash = new L.Hash(map);
map.attributionControl.setPrefix('<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');

//Function for length beyond 1000
function lengthFormat(value){
	// Convert the value to a string with one decimal place
	let formattedValue = value.toFixed(1);

	// If the formatted value is "1000.0" or higher, add commas to improve readability
	if (value >= 1000) {
		formattedValue = parseFloat(formattedValue).toLocaleString(undefined, { minimumFractionDigits: 1 });
	  }
	
	  return formattedValue;
}

L.control.ruler({
	position: 'topleft',
  lengthUnit: {
    display: 'm',
    decimal: 2,
    factor: 1000,
    label: 'Distance'
  },
}).addTo(map);

L.control.betterscale().addTo(map);

L.control.coordinates({
	position: 'bottomright',
	labelTemplateLng: 'Long: {x}',
	useLatLngOrder: true,
	labelFormatterLng : function(lng){return "<br><code>Long: "  + lng.toFixed(4) + " dd</code>"},
	labelFormatterLat : function(lat){return "<code>Lat : " + lat.toFixed(4) + " dd</code>"},
	centerUserCoordinates: true
	/*markerProps: {
		autoPanOnFocus: true
	},*/
}).addTo(map);

//Functions for project info
function prjInfo_pop(feature,layer){
	var popupContent = `<h6><b>Project Info</b></h6>
	<table>
		<tr>
			<th scope="row">Title</th>
			<td>`+(feature.properties['title'] !== null ? autolinker.link(feature.properties['title'].toLocaleString()) : '')+`</td>
		</tr>
		<tr>
			<th scope="row">Reference</th>
			<td>`+(feature.properties['reference'] !== null ? autolinker.link(feature.properties['reference'].toLocaleString()) : '')+`</td>
		</tr>
		<tr>
			<th scope="row">Job Description</th>
			<td>`+(feature.properties['job_desc'] !== null ? autolinker.link(feature.properties['job_desc'].toLocaleString()) : '')+`</td>
		</tr>
		<tr>
			<th scope="row">Surveyor</th>
			<td>`+(feature.properties['surveyor'] !== null ? autolinker.link(feature.properties['surveyor'].toLocaleString()) : '')+`</td>
		</tr>
		<tr>
			<th scope="row">Date</th>
			<td>`+(feature.properties['date'] !== null ? autolinker.link(feature.properties['date'].toLocaleString()) : '')+`</td>
		</tr>
		<tr>
			<th scope="row">Project Proponent</th>
			<td>`+(feature.properties['prj_prop'] !== null ? autolinker.link(feature.properties['prj_prop'].toLocaleString()) : '')+`</td>
		</tr>
		<tr>
			<th scope="row">Others</th>
			<td>`+(feature.properties['other'] !== null ? autolinker.link(feature.properties['other'].toLocaleString()) : '')+`</td>
		</tr>
	</table>`;
	layer.bindPopup(popupContent)
}

/*map.createPane('pane_uud');
map.getPane('pane_uud').style.zIndex=399;
map.getPane('pane_uud').style['mix-blend-mode']='normal';

var layer_uud=new L.shapefile('data/prjInfo/uud',{
	interactive: true,
	pane: 'pane_uud',
	style:{
		opacity: 1,
		color: 'rgb(0,162,232)', //Turquoise
		weight: 2,
		fillOpacity: 0.4,
		fillColor: 'rgb(169,0,0)',//Dark red
	},
	onEachFeature: prjInfo_pop
});
function toggle_uud(){
	if (map.hasLayer(layer_uud)){
		map.removeLayer(layer_uud);
	} else {
		layer_uud.addTo(map);
	}
}

map.createPane('pane_eng');
map.getPane('pane_eng').style.zIndex=399;
map.getPane('pane_eng').style['mix-blend-mode']='normal';

var layer_eng=new L.shapefile('data/prjInfo/eng',{
	interactive: true,
	pane: 'pane_eng',
	style:{
		opacity: 1,
		color: 'rgb(0,162,232)', //Turquoise
		weight: 2,
		fillOpacity: 0.4,
		fillColor: 'rgb(255,165,0)',//Orange
	},
	onEachFeature: prjInfo_pop
});
function toggle_eng(){
	if (map.hasLayer(layer_eng)){
		map.removeLayer(layer_eng);
	} else {
		layer_eng.addTo(map);
	}
}

map.createPane('pane_uav');
map.getPane('pane_uav').style.zIndex=399;
map.getPane('pane_uav').style['mix-blend-mode']='normal';

var layer_uav=new L.shapefile('data/prjInfo/uav',{
	interactive: true,
	pane: 'pane_uav',
	style:{
		opacity: 1,
		color: 'rgb(0,162,232)', //Turquoise
		weight: 2,
		fillOpacity: 0.4,
		fillColor: 'rgb(34,177,76)',//Dark green
	},
	onEachFeature: prjInfo_pop
});
function toggle_uav(){
	if (map.hasLayer(layer_uav)){
		map.removeLayer(layer_uav);
	} else {
		layer_uav.addTo(map);
	}
}

map.createPane('pane_hydro');
map.getPane('pane_hydro').style.zIndex=399;
map.getPane('pane_hydro').style['mix-blend-mode']='normal';

var layer_hydro=new L.shapefile('data/prjInfo/hydro',{
	interactive: true,
	pane: 'pane_hydro',
	style:{
		opacity: 1,
		color: 'rgb(0,162,232)', //Turquoise
		weight: 2,
		fillOpacity: 0.4,
		fillColor: 'rgb(0,255,255)',//Aqua
	},
	onEachFeature: prjInfo_pop
});
function toggle_hydro(){
	if (map.hasLayer(layer_hydro)){
		map.removeLayer(layer_hydro);
	} else {
		layer_hydro.addTo(map);
	}
}

map.createPane('pane_title');
map.getPane('pane_title').style.zIndex=399;
map.getPane('pane_title').style['mix-blend-mode']='normal';

var layer_title=new L.shapefile('data/prjInfo/title',{
	interactive: true,
	pane: 'pane_title',
	style:{
		opacity: 1,
		color: 'rgb(0,162,232)', //Turquoise
		weight: 2,
		fillOpacity: 0.4,
		fillColor: 'rgb(185,122,87)',//Aqua
	},
	onEachFeature: prjInfo_pop
});*/
function toggle_title(){
	if (map.hasLayer(layer_title)){
		map.removeLayer(layer_title);
	} else {
		layer_title.addTo(map);
	}
}

L.control.search({
	layer: layer_Proposed,
	initial: false,
	propertyName: 'reference',
	zoom: 15,
	autoResize: false,
	textPlaceholder: 'Project Reference',
	hideMarkerOnCollapse: true,
	autoCollapse: false,
	autoCollapseTime:1500,
}).addTo(map);

var jcp_bmk = L.layerGroup([layer_jkcp,layer_bmrk]);

L.control.search({
	layer: jcp_bmk,
	initial: false,
	propertyName: 'PT_NO',
	zoom: 19,
	autoResize: false,
	textPlaceholder: 'JKCP/Benchmark',
	hideMarkerOnCollapse: true,
	autoCollapse: false,
	autoCollapseTime: 1500
}).addTo(map);
map.removeLayer(jcp_bmk);