let rawData = null; // Store data globally

fetch('data/boonsiew.geojson')
    .then(response => response.json())
    .then(data => {
        rawData = data;

        // 1. Setup the Dropdown (Fill the options)
        const select = document.getElementById('companyFilter');

        // collect unique, non-empty company names and sort
        const uniqueCompanies = Array.from(new Set(
            data.features
                .map(f => f.properties && f.properties.SYARIKAT)
                .filter(Boolean)
        )).sort();

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
        select.addEventListener('change', function(e) {
            // Call the function defined in control.js
            updateMap(e.target.value, rawData);
        });

        // 3. Initial Load (Show All)
        select.value = 'All';
        updateMap('All', rawData);

        // removed updateLegend(map, rawData); -- colors are shown in the select now
    })
    .catch(err => console.error("Error:", err));