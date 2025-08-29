document.addEventListener('DOMContentLoaded', function() {
    const toggle = document.getElementById('toggleExtension');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const statusContainer = document.getElementById('status');

    // Load current setting
    chrome.storage.sync.get(['autoMuteEnabled'], function(result) {
        const isEnabled = result.autoMuteEnabled !== false;
        toggle.checked = isEnabled;
        updateStatus(isEnabled);
    });

    // Handle toggle change - NO PAGE REFRESH
    toggle.addEventListener('change', function() {
        const isEnabled = toggle.checked;
        
        chrome.storage.sync.set({
            autoMuteEnabled: isEnabled
        }, function() {
            updateStatus(isEnabled);
            console.log(`Extension ${isEnabled ? 'enabled' : 'disabled'}`);
        });
    });

    function updateStatus(isEnabled) {
        if (isEnabled) {
            statusIndicator.classList.remove('inactive');
            statusContainer.classList.remove('inactive');
            statusText.textContent = 'Extension Active';
        } else {
            statusIndicator.classList.add('inactive');
            statusContainer.classList.add('inactive');
            statusText.textContent = 'Extension Inactive';
        }
    }
});