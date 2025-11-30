// Define an array of basemap options
var basemapOpt = [
	{
		label: 'OpenStreetMap',
		value: 'osm'
	},
	{
		label: 'Satellite',
		value: 'gmaps'
	},
	// Add more basemap options as needed
];

var prjInfoOpt = [
	{label:'Engineering',value:'eng'},
	{label:'Hydrography',value:'hydro'},
	{label:'UAV Mapping',value:'uav'},
	{label:'UUD Mapping',value:'uud'},
	{label:'Land Title',value:'title'}
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

// Function to create details checkboxes
function detailsChbx(){
	var detailsDiv = document.getElementById('detailsOpt');

	prjInfoOpt.forEach(function (option){
		var detailsLabel = document.createElement('label');
		detailsLabel.classList.add('dropdown-item');

		detailsLabel.innerHTML = `<input type="checkbox" class="sub-checkbox" onclick=toggle${option.value}() unchecked>
		<span><img src="legend/prjInfo/${option.value}.png" class="mx-1">${option.label}</span>`;
		detailsDiv.appendChild(detailsLabel);
	});
}

// Call the function to create basemap radios and utilities checkboxes
createBasemapRadios();
detailsChbx();

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