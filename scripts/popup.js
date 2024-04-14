document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['apiKey'], function(result) {
        if (result.apiKey && result.apiKey.trim() !== '') {
            document.getElementById('extract-notes').disabled = false;
            document.getElementById('api-key-warning').style.display = 'none';
        } else {
            document.getElementById('api-key-warning').style.display = 'block';
            document.getElementById('settings-link').addEventListener('click', function() {
                chrome.tabs.create({'url': chrome.runtime.getURL('html/settings.html')});
            });
        }
    });

    document.getElementById('extract-notes').addEventListener('click', function() {
        console.log(" 'Extract notes' clicked!");
        chrome.runtime.sendMessage({action: "extractNotes"}, function(response) {
            if(response && response.status) {
                document.getElementById('status-message').textContent = response.status;
            } else {
                document.getElementById('status-message').textContent = "Failed to get a response.";
            }
        });
    });

    document.getElementById('openSettings').addEventListener('click', function() {
        chrome.tabs.create({'url': chrome.runtime.getURL('html/settings.html')});
    });
});
