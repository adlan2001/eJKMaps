// Function to convert string to color
function stringToColor(str) {
  if (!str) return '#999999'; // Fallback for null
  let hash = 0;
  // 1. Generate a hash number from the string
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // 2. Convert hash to Hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    let value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
}

// Main Style Function
function styleFeature(feature) {
  return {
    fillColor: stringToColor(feature.properties.SYARIKAT),
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  };
}

// Popup Content Function
function bindPopupContent(feature, layer) {
  var popupContent = `<h6><b>`+feature.properties['SYARIKAT']+`</b></h6>
    <table>
      <tr>
        <th scope="row">Lot</th>
        <td>`+feature.properties['LOT']+`</td>
      </tr>
      <tr>
        <th scope="row">Negeri</th>
        <td>`+feature.properties['NEGERI']+`</td>
      </tr>
      <tr>
        <th scope="row">Daerah</th>
        <td>`+feature.properties['DAERAH']+`</td>
      </tr>
      <tr>
        <th scope="row">Mukim</th>
        <td>`+feature.properties['MUKIM']+`</td>
      </tr>
      <tr>
        <th scope="row">Area</th>
        <td>`+feature.properties['AREA']+`</td>
      </tr>
      <tr>
        <th scope="row">Registration</th>
        <td>`+feature.properties['REGISTRATION']+`</td>
      </tr>
      <tr>
        <th scope="row">No Hakmilik</th>
        <td>`+feature.properties['NO_HAKMILIK']+`</td>
      </tr>
      <tr>
        <th scope="row">Cukai</th>
        <td>`+feature.properties['CUKAI']+`</td>
      </tr>
      <tr>
        <th scope="row">Alamat</th>
        <td>`+feature.properties['ALAMAT']+`</td>
      </tr>
      <tr>
        <th scope="row">Std Sheet</th>
        <td>`+feature.properties['STD_SHEET']+`</td>
      </tr>
    </table>`;
    layer.bindPopup(popupContent);
}

// New helper function in layer.js
function createCenterMarker(feature, layer, mapInstance) {
  let centerLatLng;

  // Check if we have a valid Polygon geometry
  if (feature.geometry.type === 'Polygon') {
    
    // 1. Get the coordinates (Array of rings)
    // Structure: [ [[lon,lat], [lon,lat]...], [[hole_lon,hole_lat]...] ]
    const coords = feature.geometry.coordinates;

    const polylabelFunc = window.polylabel && window.polylabel.default ? window.polylabel.default : window.polylabel;

    // 2. Run Polylabel to find the visual center
    // Precision 1.0 is a good balance of speed and accuracy
    const result = polylabelFunc(coords, 0.00001); 

    // 3. Flip [Lon, Lat] (GeoJSON) to [Lat, Lon] (Leaflet)
    centerLatLng = [result[1], result[0]];

  } else {
    // Fallback: If for some reason a feature is still a Point or Line, 
    // or the polylabel calculation fails, use the bounding box center.
    centerLatLng = layer.getBounds().getCenter();
  }

  // --- Standard Marker Creation ---
  const marker = L.marker(centerLatLng);

  // Safety check: ensure LOT exists, otherwise show empty string
  const lotLabel = feature.properties.LOT ? String(feature.properties.LOT) : '';

  marker.bindTooltip(lotLabel, {
    permanent: true,     // Always on (controlled by CSS)
    direction: 'center', // Sit exactly on the calculated point
    className: 'custom-label',
    offset: [0, 0]
  });

  return marker;
}