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
map.attributionControl.setPrefix('<a href="https://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>\
 &middot; \
<a href="https://github.com/tomchadwin/qgis2web" target="_blank title="Use QGIS to create a web map">qgis2web</a>\
 &middot; \
<a href="https://github.com/adlan2001" title="Made by Adlan">adlan2001</a>\
 &middot; \
<a href="https://www.flaticon.com/" title="Some of the icons are attributed to Flaticon">Flaticon</a>');

var autolinker = new Autolinker({truncate: {length: 30, location: 'smart'}});
function setBounds() {
}

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

L.control.locate().addTo(map);

// Functions for power cable
map.createPane('pane_Power_cable');
map.getPane('pane_Power_cable').style.zIndex = 400;
map.getPane('pane_Power_cable').style['mix-blend-mode'] = 'normal';
var layer_Power_cable = new L.shapefile('data/power_cable',{
	attribution: '',
	interactive: true,
	pane: 'pane_Power_cable',
	onEachFeature: function pop_Power_cable(feature, layer) {
		var popupContent = '<h6><strong>Power cable</strong></h6>\
			<table>\
				<tr>\
					<th scope="row">Owner</th>\
					<td>' + (feature.properties['owner'] !== null ? autolinker.link(feature.properties['owner'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Feature name</th>\
					<td>' + (feature.properties['feat_name'] !== null ? autolinker.link(feature.properties['feat_name'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">State</th>\
					<td>' + (feature.properties['state'] !== null ? autolinker.link(feature.properties['state'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">District</th>\
					<td>' + (feature.properties['district'] !== null ? autolinker.link(feature.properties['district'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Mukim</th>\
					<td>' + (feature.properties['mukim'] !== null ? autolinker.link(feature.properties['mukim'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Length</th>\
					<td>' + (feature.properties['length'] !== null ? autolinker.link(lengthFormat(feature.properties['length']).toLocaleString()) : '') + ' m</td>\
				</tr>\
				<tr>\
					<th scope="row">Voltage</th>\
					<td>' + (feature.properties['voltage'] !== null ? autolinker.link(feature.properties['voltage'].toLocaleString()) : '') + ' kV</td>\
				</tr>\
				<tr>\
					<th scope="row">Reference</th>\
					<td>' + (feature.properties['reference'] !== null ? autolinker.link(feature.properties['reference'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Survey date</th>\
					<td>' + (feature.properties['surv_date'] !== null ? autolinker.link(feature.properties['surv_date'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Other</th>\
					<td>' + (feature.properties['other'] !== null ? autolinker.link(feature.properties['other'].toLocaleString()) : '') + '</td>\
				</tr>\
			</table>';
		layer.bindPopup(popupContent, {maxHeight: 400});
	},
	style: {
		pane: 'pane_Power_cable',
		opacity: 1,
		color: 'rgba(255,0,0,1.0)', //Blue #0000FF
		dashArray: '',
		lineCap: 'square',
		lineJoin: 'bevel',
		weight: 2,
		fillOpacity: 1,
		interactive: true,
	},
});
map.addLayer(layer_Power_cable);
function togglePower_cable() {
	if (map.hasLayer(layer_Power_cable)) {
		map.removeLayer(layer_Power_cable);
	} else {
		layer_Power_cable.addTo(map);
	}
}

// Functions for water pipe
map.createPane('pane_Water_pipe');
map.getPane('pane_Water_pipe').style.zIndex = 401;
map.getPane('pane_Water_pipe').style['mix-blend-mode'] = 'normal';
var layer_Water_pipe = new L.shapefile('data/water_pipe', {
	attribution: '',
	interactive: true,
	pane: 'pane_Water_pipe',
	onEachFeature: function (feature, layer) {
		var popupContent = '<h6><strong>Water pipe</strong></h6>\
			<table>\
				<tr>\
					<th scope="row">Owner</th>\
					<td>' + (feature.properties['owner'] !== null ? autolinker.link(feature.properties['owner'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Feature name</th>\
					<td>' + (feature.properties['feat_name'] !== null ? autolinker.link(feature.properties['feat_name'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">State</th>\
					<td>' + (feature.properties['state'] !== null ? autolinker.link(feature.properties['state'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">District</th>\
					<td>' + (feature.properties['district'] !== null ? autolinker.link(feature.properties['district'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Mukim</th>\
					<td>' + (feature.properties['mukim'] !== null ? autolinker.link(feature.properties['mukim'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Length</th>\
					<td>' + parseFloat(feature.properties['length'] !== null ? autolinker.link(feature.properties['length'].toLocaleString()) : '').toFixed(1) + ' m</td>\
				</tr>\
				<tr>\
					<th scope="row">Pipe size</th>\
					<td>' + (feature.properties['pipe_size'] !== null ? autolinker.link(feature.properties['pipe_size'].toLocaleString()) : '') + ' mm</td>\
				</tr>\
				<tr>\
					<th scope="row">Pipe type</th>\
					<td>' + (feature.properties['pipe_type'] !== null ? autolinker.link(feature.properties['pipe_type'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Depth</th>\
					<td>' + (feature.properties['depth'] !== null ? autolinker.link(lengthFormat(feature.properties['depth']).toLocaleString()) : '') + ' m</td>\
				</tr>\
				<tr>\
					<th scope="row">Reference</th>\
					<td>' + (feature.properties['reference'] !== null ? autolinker.link(feature.properties['reference'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Survey date</th>\
					<td>' + (feature.properties['surv_date'] !== null ? autolinker.link(feature.properties['surv_date'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Other</th>\
					<td>' + (feature.properties['other'] !== null ? autolinker.link(feature.properties['other'].toLocaleString()) : '') + '</td>\
				</tr>\
			</table>';
		layer.bindPopup(popupContent, {maxHeight: 400});
	},
	style: {
		pane: 'pane_Water_pipe',
		opacity: 1,
		color: 'rgba(0,0,255,1.0)', //Blue #0000FF
		dashArray: '',
		lineCap: 'square',
		lineJoin: 'bevel',
		weight: 2,
		fillOpacity: 1,
		interactive: true,
	},
});
map.addLayer(layer_Water_pipe);
function toggleWater_pipe() {
	if (map.hasLayer(layer_Water_pipe)) {
			map.removeLayer(layer_Water_pipe);
	} else {
			layer_Water_pipe.addTo(map);
	}
}

//Functions for telco cable
map.createPane('pane_Telco_cable');
map.getPane('pane_Telco_cable').style.zIndex = 402;
map.getPane('pane_Telco_cable').style['mix-blend-mode'] = 'normal';
var layer_Telco_cable = new L.Shapefile('data/telco_cable', {
	attribution: '',
	interactive: true,
	pane: 'pane_Telco_cable',
	onEachFeature: function (feature, layer) {
		var popupContent = '<h6><strong>Telco cable</strong></h6>\
			<table>\
				<tr>\
					<th scope="row">Owner</th>\
					<td>' + (feature.properties['owner'] !== null ? autolinker.link(feature.properties['owner'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Feature name</th>\
					<td>' + (feature.properties['feat_name'] !== null ? autolinker.link(feature.properties['feat_name'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">State</th>\
					<td>' + (feature.properties['state'] !== null ? autolinker.link(feature.properties['state'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">District</th>\
					<td>' + (feature.properties['district'] !== null ? autolinker.link(feature.properties['district'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Mukim</th>\
					<td>' + (feature.properties['mukim'] !== null ? autolinker.link(feature.properties['mukim'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Length</th>\
					<td>' + (feature.properties['length'] !== null ? autolinker.link(lengthFormat(feature.properties['length']).toLocaleString()) : '') + ' m</td>\
				</tr>\
				<tr>\
					<th scope="row">Reference</th>\
					<td>' + (feature.properties['reference'] !== null ? autolinker.link(feature.properties['reference'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Survey date</th>\
					<td>' + (feature.properties['surv_date'] !== null ? autolinker.link(feature.properties['surv_date'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Other</th>\
					<td>' + (feature.properties['other'] !== null ? autolinker.link(feature.properties['other'].toLocaleString()) : '') + '</td>\
				</tr>\
			</table>';
		layer.bindPopup(popupContent, {maxHeight: 400});
	},
	style: {
		pane: 'pane_Telco_cable',
		opacity: 1,
		color: 'rgba(255,165,0,1.0)', //Blue #0000FF
		dashArray: '',
		lineCap: 'square',
		lineJoin: 'bevel',
		weight: 2,
		fillOpacity: 1,
		interactive: true,
	},
});
map.addLayer(layer_Telco_cable);
function toggleTelco_cable() {
	if (map.hasLayer(layer_Telco_cable)) {
			map.removeLayer(layer_Telco_cable);
	} else {
			layer_Telco_cable.addTo(map);
	}
}

//Functions for suspicious cable
map.createPane('pane_Sus_cable');
map.getPane('pane_Sus_cable').style.zIndex = 403;
map.getPane('pane_Sus_cable').style['mix-blend-mode'] = 'normal';
var layer_Sus_cable = new L.Shapefile('data/unknown', {
	attribution: '',
	interactive: true,
	pane: 'pane_Sus_cable',
	onEachFeature: function (feature, layer) {
		var popupContent = '<h6><strong>Suspicious cable</strong></h6><table>\
				<tr>\
					<th scope="row">Feature name</th>\
					<td>' + (feature.properties['feat_name'] !== null ? autolinker.link(feature.properties['feat_name'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">State</th>\
					<td>' + (feature.properties['state'] !== null ? autolinker.link(feature.properties['state'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">District</th>\
					<td>' + (feature.properties['district'] !== null ? autolinker.link(feature.properties['district'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Mukim</th>\
					<td>' + (feature.properties['mukim'] !== null ? autolinker.link(feature.properties['mukim'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Length</th>\
					<td>' + (feature.properties['length'] !== null ? autolinker.link(lengthFormat(feature.properties['length']).toLocaleString()) : '') + ' m</td>\
				</tr>\
				<tr>\
					<th scope="row">Reference</th>\
					<td>' + (feature.properties['reference'] !== null ? autolinker.link(feature.properties['reference'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Survey date</th>\
					<td>' + (feature.properties['surv_date'] !== null ? autolinker.link(feature.properties['surv_date'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Other</th>\
					<td>' + (feature.properties['other'] !== null ? autolinker.link(feature.properties['other'].toLocaleString()) : '') + '</td>\
				</tr>\
			</table>';
		layer.bindPopup(popupContent, {maxHeight: 400});
	},
	style: {
		pane: 'pane_Sus_cable',
		opacity: 1,
		color: 'rgba(0,255,0,1.0)', //Blue #0000FF
		dashArray: '',
		lineCap: 'square',
		lineJoin: 'bevel',
		weight: 2,
		fillOpacity: 1,
		interactive: true,
	},
});
map.addLayer(layer_Sus_cable);
function toggleSus_cable() {
	if (map.hasLayer(layer_Sus_cable)) {
			map.removeLayer(layer_Sus_cable);
	} else {
			layer_Sus_cable.addTo(map);
	}
}

//Functions for proposed lines
map.createPane('pane_Proposed');
map.getPane('pane_Proposed').style.zIndex = 404;
map.getPane('pane_Proposed').style['mix-blend-mode'] = 'normal';
var layer_Proposed = new L.Shapefile('data/proposed', {
	attribution: '',
	interactive: true,
	pane: 'pane_Proposed',
	onEachFeature: function pop_Proposed(feature, layer) {
		var popupContent = '<h6><strong>Proposed line</strong></h6>\
			<table>\
				<tr>\
					<th scope="row">Owner</th>\
					<td>' + (feature.properties['owner'] !== null ? autolinker.link(feature.properties['owner'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Feature name</th>\
					<td>' + (feature.properties['feat_name'] !== null ? autolinker.link(feature.properties['feat_name'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Method</th>\
					<td>' + (feature.properties['method'] !== null ? autolinker.link(feature.properties['method'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">State</th>\
					<td>' + (feature.properties['state'] !== null ? autolinker.link(feature.properties['state'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">District</th>\
					<td>' + (feature.properties['district'] !== null ? autolinker.link(feature.properties['district'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Mukim</th>\
					<td>' + (feature.properties['mukim'] !== null ? autolinker.link(feature.properties['mukim'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Length</th>\
					<td>' + (feature.properties['length'] !== null ? autolinker.link(lengthFormat(feature.properties['length']).toLocaleString()) : '') + ' m</td>\
				</tr>\
				<tr>\
					<th scope="row">Depth</th>\
					<td>' + parseFloat(feature.properties['depth'] !== null ? autolinker.link(feature.properties['depth'].toLocaleString()) : '').toFixed(1) + ' m</td>\
				</tr>\
				<tr>\
					<th scope="row">Reference</th>\
					<td>' + (feature.properties['reference'] !== null ? autolinker.link(feature.properties['reference'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Title</th>\
					<td>' + (feature.properties['title'] !== null ? autolinker.link(feature.properties['title'].toLocaleString()) : '').replace("ï»¿","") + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Survey date</th>\
					<td>' + (feature.properties['surv_date'] !== null ? autolinker.link(feature.properties['surv_date'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Other</th>\
					<td>' + (feature.properties['other'] !== null ? autolinker.link(feature.properties['other'].toLocaleString()) : '') + '</td>\
				</tr>\
			</table>';//Using replace() function to remove "ï»¿". Sign of UTF-8 with BOM
		layer.bindPopup(popupContent, {maxHeight: 500});
},
	style: {
		pane: 'pane_Proposed',
		opacity: 1,
		color: 'rgba(255,0,255,1.0)', //Blue #0000FF
		dashArray: '15',
		lineCap: 'square',
		lineJoin: 'bevel',
		weight: 2,
		fillOpacity: 1,
		interactive: true,
	},
});
map.addLayer(layer_Proposed);
function toggleProposed() {
	if (map.hasLayer(layer_Proposed)) {
			map.removeLayer(layer_Proposed);
	} else {
			layer_Proposed.addTo(map);
	}
}

//Functions for sewerage
map.createPane('pane_Sewerage');
map.getPane('pane_Sewerage').style.zIndex=405;
map.getPane('pane_Sewerage').style['mix-blend-mode']='normal';
var layer_Sewerage=new L.Shapefile('data/sewerage',{
	interactive: true,
	pane: 'pane_Sewerage',
	style: {
		pane: 'pane_Sewerage',
		opacity: 1,
		color: 'rgba(0,64,0,1.0)', //Dark Green
		lineCap: 'square',
		lineJoin: 'bevel',
		weight: 2,
		fillOpacity: 1,
		interactive: true,
	},
	onEachFeature: function (feature, layer) {
		var popupContent = '<h6><strong>Sewerage</strong></h6>\
			<table>\
				<tr>\
					<th scope="row">Owner</th>\
					<td>' + (feature.properties['owner'] !== null ? autolinker.link(feature.properties['owner'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Feature name</th>\
					<td>' + (feature.properties['feat_name'] !== null ? autolinker.link(feature.properties['feat_name'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">State</th>\
					<td>' + (feature.properties['state'] !== null ? autolinker.link(feature.properties['state'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">District</th>\
					<td>' + (feature.properties['district'] !== null ? autolinker.link(feature.properties['district'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Mukim</th>\
					<td>' + (feature.properties['mukim'] !== null ? autolinker.link(feature.properties['mukim'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Length</th>\
					<td>' + (feature.properties['length'] !== null ? autolinker.link(lengthFormat(feature.properties['length']).toLocaleString()) : '') + ' m</td>\
				</tr>\
				<tr>\
					<th scope="row">Reference</th>\
					<td>' + (feature.properties['reference'] !== null ? autolinker.link(feature.properties['reference'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Survey date</th>\
					<td>' + (feature.properties['surv_date'] !== null ? autolinker.link(feature.properties['surv_date'].toLocaleString()) : '') + '</td>\
				</tr>\
				<tr>\
					<th scope="row">Other</th>\
					<td>' + (feature.properties['other'] !== null ? autolinker.link(feature.properties['other'].toLocaleString()) : '') + '</td>\
				</tr>\
		</table>';
		layer.bindPopup(popupContent,{maxHeight:400})
	}
})
map.addLayer(layer_Sewerage);
function toggleSewerage() {
	if (map.hasLayer(layer_Sewerage)) {
			map.removeLayer(layer_Sewerage);
	} else {
			layer_Sewerage.addTo(map);
	}
}

//Functions for gas
map.createPane('pane_Gas');
map.getPane('pane_Gas').style.zIndex=405;
map.getPane('pane_Gas').style['mix-blend-mode']='normal';
var layer_Gas=new L.Shapefile('data/gas',{
	interactive: true,
	pane: 'pane_Gas',
	style: function () {
		return {
			pane: 'pane_Gas',
			opacity: 1,
			color: 'rgba(255,255,0,1.0)', //Yellow
			lineCap: 'square',
			lineJoin: 'bevel',
			weight: 2,
			fillOpacity: 1,
			interactive: true,
		}
	},
	onEachFeature: function (feature, layer) {
		var popupContent = '<h6><strong>Gas</strong></h6>\
		<table>\
			<tr>\
				<th scope="row">Owner</th>\
				<td>' + (feature.properties['owner'] !== null ? autolinker.link(feature.properties['owner'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Feature name</th>\
				<td>' + (feature.properties['feat_name'] !== null ? autolinker.link(feature.properties['feat_name'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">State</th>\
				<td>' + (feature.properties['state'] !== null ? autolinker.link(feature.properties['state'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">District</th>\
				<td>' + (feature.properties['district'] !== null ? autolinker.link(feature.properties['district'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Mukim</th>\
				<td>' + (feature.properties['mukim'] !== null ? autolinker.link(feature.properties['mukim'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Length</th>\
				<td>' + (feature.properties['length'] !== null ? autolinker.link(lengthFormat(feature.properties['length']).toLocaleString()) : '') + ' m</td>\
			</tr>\
			<tr>\
				<th scope="row">Pipe size</th>\
				<td>' + (feature.properties['pipe_size'] !== null ? autolinker.link(feature.properties['pipe_size'].toLocaleString()) : '') + ' mm</td>\
			</tr>\
			<tr>\
				<th scope="row">Pipe type</th>\
				<td>' + (feature.properties['pipe_type'] !== null ? autolinker.link(feature.properties['pipe_type'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Reference</th>\
				<td>' + (feature.properties['reference'] !== null ? autolinker.link(feature.properties['reference'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Survey date</th>\
				<td>' + (feature.properties['surv_date'] !== null ? autolinker.link(feature.properties['surv_date'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Other</th>\
				<td>' + (feature.properties['other'] !== null ? autolinker.link(feature.properties['other'].toLocaleString()) : '') + '</td>\
			</tr>\
		</table>';
		layer.bindPopup(popupContent,{maxHeight:400})
	}
});
map.addLayer(layer_Gas);
function toggleGas() {
	if (map.hasLayer(layer_Gas)) {
			map.removeLayer(layer_Gas);
	} else {
			layer_Gas.addTo(map);
	}
}

//Set icon size here
let ic_H = 12;

map.createPane('pane_jkcp');
map.getPane('pane_jkcp').style.zIndex=406;
map.getPane('pane_jkcp').style['mix-blend-mode']='normal';
var layer_jkcp=new L.shapefile('data/jkcp',{
	interactive: true,
	pane: 'pane_jkcp',
	pointToLayer: function(feature,latlng){
		var jkcpIcon = L.icon({
			iconUrl: 'legend/Jkcp.png',
			iconSize: [ic_H,ic_H]
		});
		return L.marker(latlng,{icon: jkcpIcon});
	},
	onEachFeature: function (feature,layer){
		var popupContent = '<h6><strong>JK Control Point</strong></h6>\
		<table>\
			<tr>\
				<th scope="row">JKCP No</th>\
				<td>' + (feature.properties['CONTROL_PO'] !== null ? autolinker.link(feature.properties['CONTROL_PO'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">LSD</th>\
				<td>' + (feature.properties['RL'] !== null ? autolinker.link(feature.properties['RL'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Northing</th>\
				<td>' + (feature.properties['NORTHING'] !== null ? autolinker.link(feature.properties['NORTHING'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Easting</th>\
				<td>' + (feature.properties['EASTING'] !== null ? autolinker.link(feature.properties['EASTING'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Road</th>\
				<td>' + (feature.properties['JALAN'] !== null ? autolinker.link(feature.properties['JALAN'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">District</th>\
				<td>' + (feature.properties['DAERAH'] !== null ? autolinker.link(feature.properties['DAERAH'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">State</th>\
				<td>' + (feature.properties['NEGERI'] !== null ? autolinker.link(feature.properties['NEGERI'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Std Sheet</th>\
				<td>' + (feature.properties['STD_SHEET'] !== null ? autolinker.link(feature.properties['STD_SHEET'].toLocaleString()) : '') + '</td>\
			</tr>\
		</table>';
		layer.bindPopup(popupContent,{maxHeight:400})
	}
});
function toggleJkcp(){
	if (map.hasLayer(layer_jkcp)){
		map.removeLayer(layer_jkcp);
	} else {
		layer_jkcp.addTo(map);
	}
}

map.createPane('pane_bmrk');
map.getPane('pane_bmrk').style.zIndex=407;
map.getPane('pane_bmrk').style['mix-blend-mode']='normal';
var layer_bmrk=new L.shapefile('data/bmrk',{
	interactive: true,
	pane: 'pane_bmrk',
	pointToLayer: function(feature,latlng){
		var bmrkIcon = L.icon({
			iconUrl: 'legend/Bmrk.png',
			iconSize: [ic_H,ic_H]
		});
		return L.marker(latlng,{icon: bmrkIcon});
	},
	onEachFeature: function (feature,layer){
		var popupContent = '<h6><strong>Benchmark</strong></h6>\
		<table>\
			<tr>\
				<th scope="row">BM No</th>\
				<td>' + (feature.properties['NO_BM'] !== null ? autolinker.link(feature.properties['NO_BM'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">LSD</th>\
				<td>' + (feature.properties['RL'] !== null ? autolinker.link(feature.properties['RL'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Northing</th>\
				<td>' + (feature.properties['N'] !== null ? autolinker.link(feature.properties['N'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Easting</th>\
				<td>' + (feature.properties['E'] !== null ? autolinker.link(feature.properties['E'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Road</th>\
				<td>' + (feature.properties['ROAD'] !== null ? autolinker.link(feature.properties['ROAD'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">District</th>\
				<td>' + (feature.properties['DISTRICT'] !== null ? autolinker.link(feature.properties['DISTRICT'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">State</th>\
				<td>' + (feature.properties['STATE'] !== null ? autolinker.link(feature.properties['STATE'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Std Sheet</th>\
				<td>' + (feature.properties['STD_SHEET'] !== null ? autolinker.link(feature.properties['STD_SHEET'].toLocaleString()) : '') + '</td>\
			</tr>\
		</table>';
		layer.bindPopup(popupContent,{maxHeight:400})
	}
});
function toggleBmrk(){
	if (map.hasLayer(layer_bmrk)){
		map.removeLayer(layer_bmrk);
	} else {
		layer_bmrk.addTo(map);
	}
}

map.createPane('pane_bdmk');
map.getPane('pane_bdmk').style.zIndex=408;
map.getPane('pane_bdmk').style['mix-blend-mode']='normal';
var layer_bdmk=new L.shapefile('data/bdmk',{
	interactive: true,
	pane: 'pane_bdmk',
	pointToLayer: function(feature,latlng){
		var jkcpIcon = L.BeautifyIcon.icon({
			/*iconUrl: 'legend/Bdmk.png',
			iconSize: [ic_H,ic_H]*/
			iconShape: 'circle-dot',
			borderWidth: 2,
			borderColor: '#000000'
		});
		return L.marker(latlng,{icon: jkcpIcon});
	},
	onEachFeature: function (feature,layer){
		var popupContent = '<h6><strong>Boundary mark</strong></h6>\
		<table>\
			<tr>\
				<th scope="row">District</th>\
				<td>' + (feature.properties['DISTRICT'] !== null ? autolinker.link(feature.properties['DISTRICT'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">State</th>\
				<td>' + (feature.properties['STATE'] !== null ? autolinker.link(feature.properties['STATE'].toLocaleString()) : '') + '</td>\
			</tr>\
			<tr>\
				<th scope="row">Std Sheet</th>\
				<td>' + (feature.properties['STD_SHEET'] !== null ? autolinker.link(feature.properties['STD_SHEET'].toLocaleString()) : '') + '</td>\
			</tr>\
		</table>';
		layer.bindPopup(popupContent,{maxHeight:400})
	}
});
function toggleBdmk(){
	if (map.hasLayer(layer_bdmk)){
		map.removeLayer(layer_bdmk);
	} else {
		layer_bdmk.addTo(map);
	}
}

function tcmh_pop(feature,layer){
	var popupContent = '<h6><strong>Telco manhole</strong></h6>\
	<table>\
		<tr>\
			<th scope="row">Owner</th>\
			<td>' + (feature.properties['OWNER'] !== null ? autolinker.link(feature.properties['OWNER'].toLocaleString()) : '') + '</td>\
		</tr>\
		<tr>\
			<th scope="row">Feature name</th>\
			<td>Telco Manhole</td>\
		</tr>\
		<tr>\
			<th scope="row">State</th>\
			<td>' + (feature.properties['STATE'] !== null ? autolinker.link(feature.properties['STATE'].toLocaleString()) : '') + '</td>\
		</tr>\
		<tr>\
			<th scope="row">District</th>\
			<td>' + (feature.properties['DISTRICT'] !== null ? autolinker.link(feature.properties['DISTRICT'].toLocaleString()) : '') + '</td>\
		</tr>\
		<tr>\
			<th scope="row">Road</th>\
			<td>' + (feature.properties['ROAD_NAME'] !== null ? autolinker.link(feature.properties['ROAD_NAME'].toLocaleString()) : '') + '</td>\
		</tr>\
		<tr>\
			<th scope="row">Reference</th>\
			<td>' + (feature.properties['FILE_NO'] !== null ? autolinker.link(feature.properties['FILE_NO'].toLocaleString()) : '') + '</td>\
		</tr>\
	</table>';
	layer.bindPopup(popupContent,{maxHeight:400})
}

function tcmh_icon(feature,latlng){
	var tcmhIcon = L.BeautifyIcon.icon({
		/*iconUrl: 'legend/Tcmh.png',
		iconSize: [ic_H,ic_H]*/
		iconShape: 'rectangle-dot',
		borderWidth: 2,
		borderColor: '#FFA500'
	});
	return L.marker(latlng,{icon: tcmhIcon});
}

var tcmh_opt = {
	interactive: true,
	pane: 'pane_tcmh',
	pointToLayer: tcmh_icon,
	onEachFeature: tcmh_pop
}

map.createPane('pane_tcmh');
map.getPane('pane_tcmh').style.zIndex=409;
map.getPane('pane_tcmh').style['mix-blend-mode']='normal';

var layer_allo=new L.shapefile('data/MhOwners/ALLO',tcmh_opt);
var layer_celcom=new L.shapefile('data/MhOwners/CELCOM',tcmh_opt);
var layer_digi=new L.shapefile('data/MhOwners/DIGI',tcmh_opt);
var layer_maxis=new L.shapefile('data/MhOwners/MAXIS',tcmh_opt);
var layer_time=new L.shapefile('data/MhOwners/TIME',tcmh_opt);
var layer_tm=new L.shapefile('data/MhOwners/TM',tcmh_opt);
var layer_others=new L.shapefile('data/MhOwners/OTHERS',tcmh_opt);

function toggleAllo(){
	if (map.hasLayer(layer_allo)){
		map.removeLayer(layer_allo);
	} else {
		layer_allo.addTo(map);
	}
}
function toggleCelcom(){
	if (map.hasLayer(layer_celcom)){
		map.removeLayer(layer_celcom);
	} else {
		layer_celcom.addTo(map);
	}
}
function toggleDigi(){
	if (map.hasLayer(layer_digi)){
		map.removeLayer(layer_digi);
	} else {
		layer_digi.addTo(map);
	}
}
function toggleMaxis(){
	if (map.hasLayer(layer_maxis)){
		map.removeLayer(layer_maxis);
	} else {
		layer_maxis.addTo(map);
	}
}
function toggleTime(){
	if (map.hasLayer(layer_time)){
		map.removeLayer(layer_time);
	} else {
		layer_time.addTo(map);
	}
}
function toggleTM(){
	if (map.hasLayer(layer_tm)){
		map.removeLayer(layer_tm);
	} else {
		layer_tm.addTo(map);
	}
}
function toggleOthers(){
	if (map.hasLayer(layer_others)){
		map.removeLayer(layer_others);
	} else {
		layer_others.addTo(map);
	}
}

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

map.createPane('pane_uud');
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
});
function toggle_title(){
	if (map.hasLayer(layer_title)){
		map.removeLayer(layer_title);
	} else {
		layer_title.addTo(map);
	}
}

/*
{name:eng,color:(255,165,0)}
{name:hydro,color:(0,255,255)}
{name:uav,color:(34,177,76)}
{name:uud,color:(139,0,0)}
{name:title,color:(185,122,87)}
{name:border,color:(0,162,232)}
*/

//var layer_Test= L.geoJson.vt('data/johorLot').addTo(map);

//var layer_Test=new L.geoJSON(data_test).addTo(map);
	/*if (map.haslayer(layer_Test)){
		console.log('Test layer is successfully added to the map')
	} else {
		console.log('Test layer is not successfully added to the map')
	}*/
/*Defining the new layer of ortophotos
map.createPane('pane_ortophoto');
map.getPane('pane_ortophoto').style.zIndex = 300;
map.getPane('pane_ortophoto').style['mix-blend-mode']='normal';
var ortophoto = L.tileLayer.wms("http://localhost:8080/geoserver/utilities/wms",{
	layers: "	utilities:orto-tg-pelepas1",
	format: "image/png",
	transparent: true,
	attribution: "&copy; Jurukur Khoo",
	dataVar: "ortophoto",
	layerName: "Ortophoto",
	pane: 'pane_ortophoto'
});
map.addLayer(ortophoto);
function toggleOrtophoto(){
	if (map.hasLayer(ortophoto)){
		map.removeLayer(ortophoto);
	} else {
		ortophoto.addTo(map);
	}
}*/

setBounds();

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