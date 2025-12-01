"use strict";

/**
 * Convert an arbitrary string into a deterministic hex color.
 * Uses a simple string-hash -> RGB conversion. Useful for coloring
 * features by company name so the same name always gets the same color.
 * @param {string} str - Input string (e.g. company name)
 * @returns {string} Hex color string (e.g. '#a1b2c3')
 */
function stringToColor(str) {
  if (!str) return '#999999'; // Fallback for null/empty
  let hash = 0;
  // Create a simple hash from the string characters
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
    // keep in 32-bit range
    hash |= 0;
  }

  // Convert the hash into a 3-byte hex color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

// Main Style Function
/**
 * Return the styling object for a GeoJSON feature.
 * @param {Object} feature - GeoJSON feature
 * @returns {Object} Leaflet style object
 */
function styleFeature(feature) {
  return {
    fillColor: stringToColor(feature && feature.properties && feature.properties.SYARIKAT),
    weight: 2,
    opacity: 1,
    color: 'white',
    fillOpacity: 0.7
  };
}

// Popup Content Function
/**
 * Bind an HTML popup to a feature's layer showing key properties.
 * Keeps the HTML generation in one place so it's easy to update.
 * @param {Object} feature - GeoJSON feature
 * @param {L.Layer} layer - Leaflet layer for the feature
 */
function bindPopupContent(feature, layer) {
  const p = feature.properties || {};
  const safe = v => (v === null || v === undefined) ? '' : String(v);

  const popupContent = `
    <h6><b>${safe(p.SYARIKAT)}</b></h6>
    <table>
      <tr><th scope="row">Lot</th><td>${safe(p.LOT)}</td></tr>
      <tr><th scope="row">Negeri</th><td>${safe(p.NEGERI)}</td></tr>
      <tr><th scope="row">Daerah</th><td>${safe(p.DAERAH)}</td></tr>
      <tr><th scope="row">Mukim</th><td>${safe(p.MUKIM)}</td></tr>
      <tr><th scope="row">Area</th><td>${safe(p.AREA)}</td></tr>
      <tr><th scope="row">Registration</th><td>${safe(p.REGISTRATION)}</td></tr>
      <tr><th scope="row">No Hakmilik</th><td>${safe(p.NO_HAKMILIK)}</td></tr>
      <tr><th scope="row">Cukai</th><td>${safe(p.CUKAI)}</td></tr>
      <tr><th scope="row">Alamat</th><td>${safe(p.ALAMAT)}</td></tr>
      <tr><th scope="row">Std Sheet</th><td>${safe(p.STD_SHEET)}</td></tr>
    </table>`;

  layer.bindPopup(popupContent);
}

// New helper function in layer.js
/**
 * Create a marker positioned at a visually-meaningful center for the polygon
 * and attach a permanent tooltip (label). Uses `polylabel` when available
 * for better visual centroids on concave polygons.
 * @param {Object} feature - GeoJSON feature
 * @param {L.Layer} layer - Leaflet layer used (only used for fallback)
 * @param {L.Map} mapInstance - map reference (not required here but kept for compatibility)
 * @returns {L.Marker} Leaflet marker with a bound tooltip
 */
function createCenterMarker(feature, layer, mapInstance) {
  let centerLatLng = null;

  try {
    if (feature && feature.geometry && feature.geometry.type === 'Polygon') {
      const coords = feature.geometry.coordinates;

      // polylabel may be exported as window.polylabel or window.polylabel.default
      const polylabelFunc = (window.polylabel && (window.polylabel.default || window.polylabel)) || null;

      if (polylabelFunc && typeof polylabelFunc === 'function') {
        // small precision value -> more exact center, but slower
        const result = polylabelFunc(coords, 0.00001);
        // GeoJSON uses [lng, lat]
        centerLatLng = [result[1], result[0]];
      }
    }
  } catch (err) {
    // fall through to fallback below on any error
    console.warn('polylabel failed, falling back to bounds center', err);
  }

  // Fallback: bounding box center
  if (!centerLatLng) {
    centerLatLng = layer && layer.getBounds ? layer.getBounds().getCenter() : [0, 0];
  }

  const marker = L.marker(centerLatLng);

  const lotLabel = (feature && feature.properties && feature.properties.LOT) ? String(feature.properties.LOT) : '';

  marker.bindTooltip(lotLabel, {
    permanent: true,
    direction: 'bottom',
    className: 'custom-label',
    offset: [0, 0],
    
  });

  return marker;
}