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

// Define an array of utilities options
var utilitiesOpt = [
	{
		label: 'Power cable',
		value: 'Power_cable'
	},
	{
		label: 'Water pipe',
		value: 'Water_pipe'
	},
	{
		label: 'Telco cable',
		value: 'Telco_cable'
	},
	{
		label: 'Suspicious line',
		value: 'Sus_cable'
	},
	{
		label: 'Proposed line',
		value: 'Proposed'
	},
	{
		label: 'Oil & Gas',
		value: 'Gas'
	},
	{
		label: 'Sewerage',
		value: 'Sewerage'
	}
];

//Define an array of details options
var detailsOpt = [
	/*{
		label:,
		value:
	},*/
	{
		label: 'JK Control Points',
		value: 'Jkcp'
	},
	{
		label: 'Benchmark',
		value: 'Bmrk'
	},
	{
		label: 'Boundary Mark',
		value: 'Bdmk'
	},
];

var detAccdOpt = [
	{id:'prjInfoMenu',label:'Project Info',val:1,img:'PrjInfo'},
	{id:'tcmhMenu',label:'Telco Manhole',val:2,ide:'tcmhBtn',img:'Tcmh'}
];

var prjInfoOpt = [
	{label:'Engineering',value:'eng'},
	{label:'Hydrography',value:'hydro'},
	{label:'UAV Mapping',value:'uav'},
	{label:'UUD Mapping',value:'uud'},
	{label:'Land Title',value:'title'}
];

//Define an array of manhole owners
var MhOpt = [
	/*{
		label:,
		value:
	},*/
	{
		label:'Allo',
	},
	{
		label:'Celcom',
	},
	{
		label:'Digi',
	},
	{
		label:'Maxis',
	},
	{
		label:'Time',
	},
	{
		label:'TM',
	},
	{
		label:'Others',
	},
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

// Function to create utilities checkboxes
function createUtilitiesCheckboxes() {
	var utilitiesDiv = document.getElementById('utilitiesOpt');
	
	utilitiesOpt.forEach(function (option) {
		var checkLabel = document.createElement('label');
		checkLabel.classList.add('dropdown-item');
		
		checkLabel.innerHTML = `<input type="checkbox" class="sub-checkbox" onclick=toggle${option.value}() checked="false">
		<span> <img src="legend/${option.value}.png" class="mx-1">${option.label}</span>`;
		utilitiesDiv.appendChild(checkLabel);
	});
}

function dropDivid(opt){
	var detDivid = document.createElement('div');
	detDivid.classList.add('dropdown-divider');

	opt.appendChild(detDivid);
}

// Function to create details checkboxes
function detailsChbx(){
	var detailsDiv = document.getElementById('detailsOpt');

	detailsOpt.forEach(function (option){
		var detailsLabel = document.createElement('label');
		detailsLabel.classList.add('dropdown-item');

		detailsLabel.innerHTML = `<input type="checkbox" class="sub-checkbox" onclick=toggle${option.value}() unchecked>
		<span><img src="legend/${option.value}.png" class="mx-1">${option.label}</span>`;
		detailsDiv.appendChild(detailsLabel);
	});

	dropDivid(detailsDiv);

	var detAccd = document.createElement('div');
	detAccd.classList.add('accordion','accordion-flush');
	detAccd.setAttribute('id','detAccd');

	detAccdOpt.forEach(function(opt){
		var detAccdItem = document.createElement('div');
		detAccdItem.classList.add('accordion-item');
		detAccdItem.innerHTML = `<h2 class="accordion-header" id="detAccdHead${opt.val}">
			<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#detAccdColl${opt.val}" aria-expanded="true" aria-controls="detAccdColl${opt.val}"><span><img src="legend/${opt.img}.png" class="me-1">${opt.label}</span></button>
		</h2>
		<div id="detAccdColl${opt.val}" class="accordion-collapse collapse" aria-labelledby="detAccdHead${opt.val}" data-bs-parent="#detAccd">
			<div class="accordion-body" id="${opt.id}">
			</div>
		</div>`;
		detAccd.appendChild(detAccdItem);
	})

	detailsDiv.appendChild(detAccd);

	/*dropDivid(detailsDiv);

	var MhMain = document.createElement('div');
	MhMain.classList.add('dropdown-submenu');
	MhMain.innerHTML = `<a class="dropdown-item dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false" data-bs-auto-close="outside" role="button"><span><img src="legend/Tcmh.png" class="me-1">Telco Manhole</span></a>\
	<div class="dropdown-menu dropdown-menu-end" id="MhOwners"></div>`;

	detailsDiv.appendChild(MhMain);*/
}

//Function to create project infos
function prjInfoCheck(){
	var prjInfoMenu = document.getElementById('prjInfoMenu');

	prjInfoOpt.forEach(function(opt){
		var checkLabel = document.createElement('label');
		checkLabel.classList.add('dropdown-item');

		checkLabel.innerHTML = `<input type="checkbox" class="checkbox" onclick=toggle_${opt.value}() unchecked>
			<span><img src="legend/prjInfo/${opt.value}.png" class="mx-1">${opt.label}</span>`;
			prjInfoMenu.appendChild(checkLabel);
	});
}

//Function to create manhole owners
function MhOwnersChbx(){
	var detailsDiv = document.getElementById('tcmhMenu');

	MhOpt.forEach(function (option) {
		var checkLabel = document.createElement('label');
		checkLabel.classList.add('dropdown-item');
		
		checkLabel.innerHTML = `<input type="checkbox" class="checkbox me-1" onclick=toggle${option.label}() unchecked>
		<span>${option.label}</span>`;
		detailsDiv.appendChild(checkLabel);
	});
}

// Call the function to create basemap radios and utilities checkboxes
createBasemapRadios();
createUtilitiesCheckboxes();
detailsChbx();
prjInfoCheck();
MhOwnersChbx();

/*var tcmhBtn = document.getElementById('tcmhBtn');
var tcmhImg = document.createElement('img');
//tcmhImg.classList.add('me-1');
tcmhImg.setAttribute('src','legend/Tcmh.png');
tcmhBtn.insertBefore(tcmhImg,tcmhBtn.firstChild);*/

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