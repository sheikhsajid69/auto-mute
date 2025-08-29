(function() {
    'use strict';
    
    let isExtensionEnabled = true;
    let observer = null;
    let adCheckInterval = null;
    let videoElement = null;
    let originalVolume = 1;
    let wasOriginallyMuted = false;
    let isAdPlaying = false;
    let debugMode = true;

    function log(message) {
        if (debugMode) {
            console.log(`[YouTube Ad Mute] ${message}`);
        }
    }

    // Initialize extension
    function init() {
        log('Extension initializing...');
        
        chrome.storage.sync.get(['autoMuteEnabled'], function(result) {
            isExtensionEnabled = result.autoMuteEnabled !== false;
            log(`Extension enabled: ${isExtensionEnabled}`);
            
            if (isExtensionEnabled) {
                startAdDetection();
            }
        });

        // Listen for settings changes
        chrome.storage.onChanged.addListener(function(changes) {
            if (changes.autoMuteEnabled) {
                isExtensionEnabled = changes.autoMuteEnabled.newValue;
                log(`Extension toggled: ${isExtensionEnabled}`);
                
                if (isExtensionEnabled) {
                    startAdDetection();
                } else {
                    stopAdDetection();
                    restoreAudio();
                }
            }
        });
    }

    function startAdDetection() {
        log('Starting ad detection...');
        
        // Clear any existing intervals
        if (adCheckInterval) {
            clearInterval(adCheckInterval);
        }

        // Start checking for ads frequently
        adCheckInterval = setInterval(checkForAds, 250);
        
        // Set up mutation observer
        setupMutationObserver();
        
        // Initial check
        setTimeout(checkForAds, 1000);
    }

    function stopAdDetection() {
        log('Stopping ad detection...');
        
        if (adCheckInterval) {
            clearInterval(adCheckInterval);
            adCheckInterval = null;
        }
        
        if (observer) {
            observer.disconnect();
            observer = null;
        }
    }

    function checkForAds() {
        if (!isExtensionEnabled) return;

        // Find video element
        videoElement = document.querySelector('video');
        if (!videoElement) {
            return;
        }

        // Store original settings on first encounter
        if (originalVolume === 1 && videoElement.volume !== 1) {
            originalVolume = videoElement.volume;
            wasOriginallyMuted = videoElement.muted;
        }

        // Check if ad is currently playing using multiple methods
        const adDetected = isAdCurrentlyPlaying();
        
        if (adDetected && !isAdPlaying) {
            log('Ad detected - muting video');
            muteVideo();
            isAdPlaying = true;
        } else if (!adDetected && isAdPlaying) {
            log('Ad ended - restoring audio');
            restoreAudio();
            isAdPlaying = false;
        }
    }

    function isAdCurrentlyPlaying() {
        // Method 1: Check for ad overlay elements
        const adOverlaySelectors = [
            '.ytp-ad-player-overlay-instream-info',
            '.ytp-ad-overlay-container',
            '.ytp-ad-player-overlay',
            '.ad-showing .html5-video-player',
            '.ytp-ad-preview-container'
        ];

        for (let selector of adOverlaySelectors) {
            if (document.querySelector(selector)) {
                return true;
            }
        }

        // Method 2: Check video player classes
        const videoPlayer = document.querySelector('.html5-video-player');
        if (videoPlayer && videoPlayer.classList.contains('ad-showing')) {
            return true;
        }

        // Method 3: Check for skip button
        const skipButtons = [
            '.ytp-skip-ad-button',
            '.ytp-ad-skip-button-container',
            '[class*="skip"][class*="button"]'
        ];

        for (let selector of skipButtons) {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) { // Check if visible
                return true;
            }
        }

        // Method 4: Check ad text/countdown
        const adTextElements = document.querySelectorAll('.ytp-ad-text, .ytp-ad-simple-ad-badge');
        for (let element of adTextElements) {
            if (element.offsetParent !== null && 
                (element.textContent.includes('Ad') || element.textContent.includes('·'))) {
                return true;
            }
        }

        // Method 5: Check video container for ad classes
        const videoContainer = document.querySelector('.html5-video-container');
        if (videoContainer) {
            const classList = videoContainer.className;
            if (classList.includes('ad-showing') || classList.includes('ad-interrupting')) {
                return true;
            }
        }

        // Method 6: Check for ad progress bar
        const adProgressBar = document.querySelector('.ytp-ad-progress-list');
        if (adProgressBar && adProgressBar.offsetParent !== null) {
            return true;
        }

        return false;
    }

    function muteVideo() {
        if (!videoElement) return;

        // Store current state before muting
        if (!videoElement.muted) {
            originalVolume = videoElement.volume;
            wasOriginallyMuted = videoElement.muted;
        }

        // Mute the video
        videoElement.muted = true;
        videoElement.volume = 0;
        
        log(`Video muted (original volume: ${originalVolume}, was muted: ${wasOriginallyMuted})`);
    }

    function restoreAudio() {
        if (!videoElement) return;

        // Only restore if we muted it and user didn't originally have it muted
        if (!wasOriginallyMuted) {
            videoElement.muted = false;
            videoElement.volume = originalVolume;
            log(`Audio restored (volume: ${originalVolume})`);
        }
    }

    function setupMutationObserver() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(function(mutations) {
            let shouldCheck = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (let node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // Element node
                            const element = node;
                            if (element.classList && 
                                (element.classList.toString().includes('ad') || 
                                 element.classList.toString().includes('ytp'))) {
                                shouldCheck = true;
                                break;
                            }
                        }
                    }
                }
                
                if (mutation.type === 'attributes' && 
                    mutation.attributeName === 'class' &&
                    mutation.target.classList.toString().includes('ad')) {
                    shouldCheck = true;
                }
            });

            if (shouldCheck) {
                setTimeout(checkForAds, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });
    }

    // Handle YouTube's SPA navigation
    let currentUrl = location.href;
    function handleUrlChange() {
        if (location.href !== currentUrl) {
            currentUrl = location.href;
            log('URL changed, reinitializing...');
            
            // Reset state
            isAdPlaying = false;
            videoElement = null;
            
            // Restart detection after a delay
            setTimeout(() => {
                if (isExtensionEnabled) {
                    startAdDetection();
                }
            }, 1000);
        }
    }

    // Check for URL changes periodically
    setInterval(handleUrlChange, 1000);

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', function() {
        stopAdDetection();
        restoreAudio();
    });

})();