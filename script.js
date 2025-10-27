document.addEventListener('DOMContentLoaded', () => {
    const vinForm = document.getElementById('vinForm');
    const vinInput = document.getElementById('vinInput');
    const apiKeyInput = document.getElementById('apiKey');
    const decodeButton = document.getElementById('decodeButton');
    const resultsDiv = document.getElementById('results');
    const resultsList = document.getElementById('results-list');
    const errorDiv = document.getElementById('error');
    const loadingDiv = document.getElementById('loading');

    // Attempt to load API key from local storage
    apiKeyInput.value = localStorage.getItem('vinApiKey') || '';

    vinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const vin = vinInput.value.trim().toUpperCase();
        const apiKey = apiKeyInput.value.trim();

        // Save the API key to local storage for convenience
        if (apiKey) {
            localStorage.setItem('vinApiKey', apiKey);
        } else {
            showError('Please enter your API-Ninjas API key.');
            return;
        }

        if (validateVIN(vin)) {
            decodeVIN(vin, apiKey);
        } else {
            showError('Please enter a valid 17-character VIN. Letters I, O, and Q are not allowed.');
        }
    });

    function validateVIN(vin) {
        if (vin.length !== 17) {
            return false;
        }
        if (/[IOQ]/.test(vin)) {
            return false;
        }
        return true;
    }

    async function decodeVIN(vin, apiKey) {
        // Reset UI
        showLoading(true);
        showError(null);
        resultsDiv.classList.add('hidden');
        resultsList.innerHTML = '';
        decodeButton.disabled = true;

        const apiUrl = `https://api.api-ninjas.com/v1/vinlookup?vin=${vin}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'X-Api-Key': apiKey,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle API errors (like invalid key or quota exceeded)
                throw new Error(data.error || `API request failed with status: ${response.status}`);
            }

            if (data.error) {
                // Handle specific errors from the API (like VIN not found)
                throw new Error(data.error);
            }
            
            // API-Ninjas returns a single object on success, not an array
            displayResults(data);

        } catch (error) {
            showError(`Error: ${error.message}`);
        } finally {
            showLoading(false);
            decodeButton.disabled = false;
        }
    }

    function displayResults(data) {
        // The API returns a flat object. We can iterate over its keys.
        const keysToShow = ['manufacturer', 'model', 'year', 'country', 'region', 'wmi'];
        
        let hasData = false;
        
        // Loop through the desired keys and create result items
        keysToShow.forEach(key => {
            if (data[key]) {
                hasData = true;
                const itemEl = document.createElement('div');
                itemEl.classList.add('result-item');
                // Format the key for display (e.g., 'wmi' -> 'WMI')
                const keyDisplay = key === 'wmi' ? 'WMI' : key;
                itemEl.innerHTML = `<strong>${keyDisplay}:</strong> <span>${data[key]}</span>`;
                resultsList.appendChild(itemEl);
            }
        });

        if (!hasData) {
            showError("VIN found, but no data was returned for this vehicle.");
            return;
        }

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
