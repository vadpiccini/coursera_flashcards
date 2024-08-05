document.addEventListener('DOMContentLoaded', function() {
    const modelSelect = document.getElementById('modelSelect');

    // Retrieve the stored model value and set the select element value
    chrome.storage.local.get('model', function(result) {
        if (result.model) {
            modelSelect.value = result.model;
        } else {
            modelSelect.value = 'gpt-4o'; // Default value
        }
    });
});

// Register API key
document.getElementById('saveAPIKey').addEventListener('click', async function() {
    const apiKey = document.getElementById('apiKey').value;

    // Validate API key format using a regular expression
//    if (!isValidApiKeyFormat(apiKey)) {
//        displayMessage('Invalid API key format.', 'error');
//        return;
//    }

    // Check API key authorization by making a test API call
    if (!await checkApiKeyAuthorization(apiKey)) {
        displayMessage('validationMessageAPI','Unauthorized API key.', 'error');
        return;
    }

    // If the API key is valid and authorized, save the settings
    console.log(`API Key found: ${apiKey}`);
    chrome.storage.local.set({apiKey}, () => {
        displayMessage('validationMessageAPI', 'API key saved successfully.', 'success');
    });
});

// Change model
document.getElementById('saveModel').addEventListener('click', async function() {
    const model = document.getElementById('modelSelect').value;

    // Save model settings
    console.log(`Model found: ${model}`);
    chrome.storage.local.set({model}, () => {
        displayMessage('validationMessageModel', 'Model preference saved successfully.', 'success');
    });
});

// TODO: FIX THIS
// function isValidApiKeyFormat(apiKey) {
    // Example regex, adjust according to your actual API key format requirements
//    return /^sk-[a-zA-Z0-9]{32,}$/.test(apiKey);
//}


async function checkApiKeyAuthorization(apiKey) {
    try {
        const response = await fetch('https://api.openai.com/v1/engines', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        return response.ok; // returns true if the status code is between 200-299
    } catch (error) {
        console.error('Error checking API key authorization:', error);
        return false;
    }
}

function displayMessage(element_id, message, type) {
    const messageElement = document.getElementById(element_id);
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    messageElement.style.color = type === 'error' ? 'red' : 'green';
}
