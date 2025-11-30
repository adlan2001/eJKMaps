let rawData = null; // Store data globally

fetch('data/boonsiew.geojson')
    .then(response => response.json())
    .then(data => {
        rawData = data;
        /*
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
        });*/

        // 3. Initial Load (Show All)
        updateMap('All', rawData);

        populateBootstrapDropdown(data);
    })
    .catch(err => console.error("Error:", err));

function populateBootstrapDropdown(data) {
    const listContainer = document.getElementById('companyList');
    const displayButton = document.getElementById('dropdownMenuButton').querySelector('span');
    
    // Clear existing list
    listContainer.innerHTML = '';

    // A. Add "All Companies" Option (Hardcoded)
    const allOption = document.createElement('a');
    allOption.className = 'dropdown-item';
    allOption.innerHTML = `<span class="color-dot" style="background: #333;"></span> All Companies`;
    
    allOption.onclick = function() {
        updateMap('All', rawData);
        displayButton.textContent = 'All Companies';
    };
    listContainer.appendChild(allOption);
    
    // B. Get Unique Companies and Sort them
    const uniqueCompanies = new Set();
    data.features.forEach(f => {
        if (f.properties.SYARIKAT) uniqueCompanies.add(f.properties.SYARIKAT);
    });
    const sortedCompanies = Array.from(uniqueCompanies).sort();

    // C. Loop and Create Items
    sortedCompanies.forEach(company => {
        const item = document.createElement('a');
        item.className = 'dropdown-item';
        
        // Get the color using your function from layer.js
        const color = stringToColor(company);
        
        // Insert HTML: Color Dot + Company Name
        item.innerHTML = `<span class="color-dot" style="background: ${color};"></span> ${company}`;
        
        // Add Click Listener
        item.onclick = function() {
            // Update the Map
            updateMap(company, rawData);
            
            // Update the Button Text to show what is selected
            displayButton.textContent = company;
        };

        listContainer.appendChild(item);
    });
}