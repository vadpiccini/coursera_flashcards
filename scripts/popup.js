document.getElementById('extract-notes').addEventListener('click', function() {
    console.log(" \'Extract notes \' clicked!");
    chrome.runtime.sendMessage({action: "extractNotes"}, function(response) {
        if(response && response.status) {
            document.getElementById('status-message').textContent = response.status;
        } else {
            document.getElementById('status-message').textContent = "Failed to get a response.";
        }
    });
});

