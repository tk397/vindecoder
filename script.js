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
        
        // Basic 17-char check. The API will do the rest of the validation.
        if (vin.length !== 17) {
            showError('VIN must be exactly 17 characters long.');
            return;
        }
        
        if (/[IOQ]/.test(vin)) {
            showError('VIN contains invalid characters (I, O, or Q).');
            return;
        }
        
        decodeVIN(vin);
    });

    async function decodeVIN(vin) {
        // Reset UI
        showLoading(true);
        showError(null);
        resultsDiv.classList.add('hidden');
        resultsList.innerHTML = '';
        decodeButton.disabled = true;

        try {
            // Using 'DecodeVinExtended' for the most detail possible
            const apiUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinExtended/${vin}?format=json`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`API request failed with status: ${response.status}`);
            }

            const data = await response.json();
            
            // The API returns 'Results' as an array of key/value objects
            const results = data.Results;

            // Find the 'Error Text' variable (VariableId 191)
            // The API sends this on every request. '0' is success.
            const errorTextItem = results.find(item => item.VariableId === 191);
            const errorCode = errorTextItem ? errorTextItem.Value : 'Unknown';
            
            if (errorCode !== '0') {
                // If the error code is not '0', find a better error message
                const clarification = results.find(item => item.Variable === 'Additional Error Text');
                let errorMessage = clarification && clarification.Value ? clarification.Value : `VIN decoding failed. Error: ${errorCode}.`;
                
                // Handle common error codes
                if (errorCode.includes('invalid characters')) {
                    errorMessage = 'VIN contains invalid characters (I, O, or Q).';
                }
                if (errorCode.includes('VIN is not 17 characters')) {
                    errorMessage = 'VIN must be 17 characters.';
                }
                
                throw new Error(errorMessage);
            }

            displayResults(results);

        } catch (error) {
            showError(`Error: ${error.message}`);
        } finally {
            showLoading(false);
            decodeButton.disabled = false;
        }
    }

    function displayResults(results) {
        // Filter out items that are empty, null, "Not Applicable", or the "0" error code
        const filteredResults = results.filter(item => 
            item.Value && 
            item.Value.trim() !== '' && 
            item.VariableId !== 191 && // Hide the "Error Text: 0" success message
            item.Value.toLowerCase() !== 'not applicable'
        );

        if (filteredResults.length === 0) {
            showError("The VIN was decoded, but the NHTSA (US) database returned no specific data for this vehicle. This is common for non-US market cars.");
            return;
        }

        // Display all available data
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
