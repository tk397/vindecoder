document.addEventListener('DOMContentLoaded', () => {
    const vinForm = document.getElementById('vinForm');
    const vinInput = document.getElementById('vinInput');
    const decodeButton = document.getElementById('decodeButton');
    const resultsDiv = document.getElementById('results');
    const resultsList = document.getElementById('results-list');
    const errorDiv = document.getElementById('error');
    const loadingDiv = document.getElementById('loading');

    vinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const vin = vinInput.value.trim().toUpperCase();
        
        if (validateVIN(vin)) {
            decodeVIN(vin);
        } else {
            showError('Please enter a valid 17-character VIN. Letters I, O, and Q are not allowed.');
        }
    });

    function validateVIN(vin) {
        if (vin.length !== 17) {
            return false;
        }
        // Check for invalid characters (I, O, Q)
        if (/[IOQ]/.test(vin)) {
            return false;
        }
        return true;
    }

    async function decodeVIN(vin) {
        // Reset UI
        showLoading(true);
        showError(null);
        resultsDiv.classList.add('hidden');
        resultsList.innerHTML = '';
        decodeButton.disabled = true;

        try {
            // Use the NHTSA vPIC API. 'DecodeVinExtended' provides more details.
            const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinExtended/${vin}?format=json`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            
            // Check for errors in the response
            const errorText = data.Results.find(item => item.Variable === 'Error Text');
            if (errorText && errorText.Value !== '0 - VIN decoded clean.') {
                throw new Error(errorText.Value);
            }

            displayResults(data.Results);

        } catch (error) {
            showError(`Error: ${error.message}`);
        } finally {
            showLoading(false);
            decodeButton.disabled = false;
        }
    }

    function displayResults(results) {
        // Filter out empty values and unwanted fields
        const desiredFields = ['Make', 'Model', 'Model Year', 'Manufacturer Name', 'Vehicle Type', 'Plant Country', 'Plant City', 'Engine Cylinders', 'Engine HP', 'Fuel Type - Primary', 'Trim', 'Series'];
        
        const filteredResults = results
            .filter(item => desiredFields.includes(item.Variable) && item.Value)
            .sort((a, b) => desiredFields.indexOf(a.Variable) - desiredFields.indexOf(b.Variable));

        if (filteredResults.length === 0) {
            showError("No valid data returned for this VIN. It may be incorrect or not in the NHTSA database.");
            return;
        }

        filteredResults.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('result-item');
            itemEl.innerHTML = `<strong>${item.Variable}:</strong> <span>${item.Value}</span>`;
            resultsList.appendChild(itemEl);
        });

        resultsDiv.classList.remove('hidden');
    }

    function showError(message) {
        if (message) {
            errorDiv.textContent = message;
            errorDiv.classList.remove('hidden');
        } else {
            errorDiv.classList.add('hidden');
        }
    }

    function showLoading(isLoading) {
        if (isLoading) {
            loadingDiv.classList.remove('hidden');
        } else {
            loadingDiv.classList.add('hidden');
        }
    }
});