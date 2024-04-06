document.getElementById('openSettings').addEventListener('click', function() {
    chrome.tabs.create({'url': chrome.runtime.getURL('html/settings.html')});
});
