document.getElementById('saveSettings').addEventListener('click', function() {
    const apiKey = document.getElementById('apiKey').value;
    const model = document.getElementById('modelSelect').value;
    console.log(`apiKey found: ${apiKey}`);
    console.log(`model found: ${model}`);
    chrome.storage.local.set({ apiKey, model }, () => {
        console.log('Settings saved.');
        // Show the confirmation message
        document.getElementById('saveConfirmation').style.display = 'block';
        // Optionally, hide the message after a few seconds
        setTimeout(() => {
            document.getElementById('saveConfirmation').style.display = 'none';
        }, 3000); // Hides the message after 3 seconds
    });
});
