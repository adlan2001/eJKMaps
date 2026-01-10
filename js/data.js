/*
 * Load GeoJSON data, populate the company dropdown, and initialize the map.
 * Converted to async/await for clearer control flow which is easier
 * for beginners to reason about.
 */
let rawData = null; // Store data globally for other modules

async function loadGeoJsonAndInit() {
    try {
        const resp = await fetch('data/boonsiew1.geojson');
        if (!resp.ok) throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
        const data = await resp.json();
        rawData = data;

        // 1. Setup the Dropdown (fill the options)
        const select = document.getElementById('companyFilter');
        if (!select) return;

        // collect unique, non-empty company names and sort
        const uniqueCompanies = Array.from(new Set(
            (data.features || [])
                .map(f => f.properties && f.properties.SYARIKAT)
                .filter(Boolean)
        )).sort();

        // Add a default option for 'All' at the top
        // (index.html already includes 'All' but this keeps behaviour robust)
        // Ensure we don't duplicate an existing 'All' option
        if (!Array.from(select.options).some(o => o.value === 'All')) {
            const defaultOpt = document.createElement('option');
            defaultOpt.value = 'All';
            defaultOpt.textContent = 'All Companies';
            select.appendChild(defaultOpt);
        }

        uniqueCompanies.forEach(company => {
            const option = document.createElement('option');
            option.value = company;

            // compute color (falls back if helper is missing)
            const color = (typeof stringToColor === 'function') ? stringToColor(company) : '#000000';

            // prepend a colored square character and set option text color
            option.textContent = `■ ${company}`;
            option.dataset.color = color;
            option.style.color = color;

            select.appendChild(option);
        });

        // 2. Add Event Listener
        select.addEventListener('change', function (e) {
            // Call the function defined in control.js
            updateMap(e.target.value, rawData);
        });

        // 3. Initial Load (Show All)
        select.value = 'All';
        updateMap('All', rawData);

    } catch (err) {
        console.error('Failed to load GeoJSON:', err);
    }
}

// Start the data load when DOMContentLoaded so select exists
document.addEventListener('DOMContentLoaded', () => {
    loadGeoJsonAndInit();
});