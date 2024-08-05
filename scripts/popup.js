document.addEventListener('DOMContentLoaded', function() {
    const extractNotesButton = document.getElementById('extract-notes');
    const statusMessage = document.getElementById('status-message');
    const openSettingsButton = document.getElementById('openSettings');

    // Query the current active tab in the current window
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        const currentTab = tabs[0];
        const url = currentTab.url;

        // Check if the URL is a Coursera video page
        const isCourseraVideoPage = url.includes('coursera.org') && url.includes('/lecture/');

        if (isCourseraVideoPage) {
            // If it's a Coursera video page, check the API key
            chrome.storage.local.get(['apiKey'], function(result) {
                if (result.apiKey && result.apiKey.trim() !== '') {
                    // Enable the "Extract Notes" button if both conditions are met
                    extractNotesButton.disabled = false;
                    statusMessage.classList.add('hidden');
                } else {
                    // Display API key warning if API key is not set
                    extractNotesButton.disabled = true;
                    statusMessage.classList.remove('hidden');
                    statusMessage.innerHTML = 'Please set the API key in settings. Learn how to get your API key <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key" target="_blank">here</a>.';
                }
            });
        } else {
            // If it's not a Coursera video page, show the relevant message
            extractNotesButton.disabled = true;
            statusMessage.classList.remove('hidden');
            statusMessage.textContent = "It seems like you're not on a Coursera video page.";
        }
    });

    // Add event listener for the "Extract Notes" button click
    extractNotesButton.addEventListener('click', function() {
        console.log(" 'Extract notes' clicked!");
        // Send a message to the background script to extract notes
        chrome.runtime.sendMessage({ action: "extractNotes" }, function(response) {
            // Display the status message based on the response
            if (response && response.status) {
                statusMessage.textContent = response.status;
            } else {
                statusMessage.textContent = "Failed to get a response.";
            }
        });
    });

    // Add event listener for the "Open Settings" button click
    openSettingsButton.addEventListener('click', function() {
        // Open the settings page in a new tab
        chrome.tabs.create({'url': chrome.runtime.getURL('html/settings.html')});
    });
});

