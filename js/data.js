let rawData = null; // Store data globally

fetch('data/boonsiew.geojson')
    .then(response => response.json())
    .then(data => {
        rawData = data;

        // 1. Setup the Dropdown (Fill the options)
        const select = document.getElementById('companyFilter');
        const uniqueCompanies = new Set(data.features.map(f => f.properties.SYARIKAT));
        
        uniqueCompanies.forEach(company => {
            const option = document.createElement('option');
            option.value = company;
            option.textContent = company;
            select.appendChild(option);
        });

        // 2. Add Event Listener
        select.addEventListener('change', function(e) {
            // Call the function defined in control.js
            updateMap(e.target.value, rawData);
        });

        // 3. Initial Load (Show All)
        updateMap('All', rawData);

        updateLegend(map, rawData);
    })
    .catch(err => console.error("Error:", err));