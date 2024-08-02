document.getElementById('saveSettings').addEventListener('click', async function() {
    const apiKey = document.getElementById('apiKey').value;
    const model = document.getElementById('modelSelect').value;

    // Validate API key format using a regular expression
//    if (!isValidApiKeyFormat(apiKey)) {
//        displayMessage('Invalid API key format.', 'error');
//        return;
//    }

    // Check API key authorization by making a test API call
    if (!await checkApiKeyAuthorization(apiKey)) {
        displayMessage('Unauthorized API key.', 'error');
        return;
    }

    // If the API key is valid and authorized, save the settings
    console.log(`API Key and model found: ${apiKey}, ${model}`);
    chrome.storage.local.set({ apiKey, model }, () => {
        displayMessage('Settings saved successfully.', 'success');
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

function displayMessage(message, type) {
    const messageElement = document.getElementById('validationMessage');
    messageElement.textContent = message;
    messageElement.style.display = 'block';
    messageElement.style.color = type === 'error' ? 'red' : 'green';
}

