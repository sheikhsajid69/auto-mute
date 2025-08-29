YouTube Ad Auto Mute - Chrome ExtensionA lightweight Chrome extension that automatically mutes YouTube ads within milliseconds of detection, then restores audio when the actual video content begins.🚀 Features
Lightning Fast: Detects and mutes ads within 250ms
Smart Detection: Uses multiple detection methods for reliability
Audio Preservation: Remembers and restores your original volume settings
Toggle Control: Easy on/off switch via popup interface
SPA Support: Works seamlessly with YouTube's navigation
Lightweight: Minimal resource usage
No Permissions Abuse: Only requests necessary permissions
📋 Requirements
Google Chrome (Version 88+)
Chrome Extensions Developer Mode enabled
🔧 InstallationMethod 1: Load Unpacked (Developer Mode)
Download or clone this repository
Open Chrome and navigate to chrome://extensions/
Enable Developer mode in the top right corner
Click Load unpacked and select the auto-mute folder
The extension will appear in your browser toolbar
Method 2: Manual Installation
Download the latest release zip file
Extract the contents to a folder named auto-mute
Follow steps 2-5 from Method 1

File Structure
auto-mute/
├── manifest.json          # Extension configuration
├── content.js            # Main ad detection logic
├── popup.html           # Extension popup interface
├── popup.css            # Popup styling
├── popup.js             # Popup functionality
└── icons/               # Extension icons (optional)
    ├── icon16.png

   🎯 How It Works
The extension uses multiple detection methods to identify YouTube ads:

Skip Button Detection: Monitors for ad skip buttons
DOM Class Monitoring: Watches for ad-related CSS classes
Ad Badge Recognition: Detects ad text and countdown elements
Player State Tracking: Monitors video player state changes
Overlay Detection: Identifies ad overlay containers

When an ad is detected, the extension:

Immediately mutes the video
Stores the original volume settings
Monitors for ad completion
Restores original audio settings when the main video resumes

🎮 Usage

Install the extension following the installation steps above
Navigate to YouTube - the extension works automatically
Toggle on/off by clicking the extension icon in your toolbar
Watch videos - ads will be automatically muted

⚙️ Configuration

Click the extension icon to access the popup
Use the toggle switch to enable/disable auto-muting
Settings are automatically saved and synced across Chrome sessions

🐛 Troubleshooting
Extension Not Working?

Check Console Logs:

Open Developer Tools (F12)
Go to Console tab
Look for [YouTube Ad Mute] messages


Verify Extension Status:

Go to chrome://extensions/
Ensure the extension is enabled
Check for any error messages


Test Detection:

Play a video with ads
Check if console shows "Ad detected" messages
Verify the extension popup shows "Extension Active"

🔍 Technical Details

Manifest Version: 3 (Chrome Extensions MV3)
Detection Frequency: Every 250ms
Permissions: activeTab, storage
Target Sites: *.youtube.com/*
Runtime: Lightweight background monitoring

🤝 Contributing
We welcome contributions! Here's how you can help:

Report Issues: Found a bug? Create an issue with details
Improve Detection: YouTube changes frequently - help update selectors
Add Features: Suggest new features via issues
Code Contributions: Fork, improve, and submit pull requests

📝 Version History
v1.1 (Latest)

Improved ad detection reliability
Added multiple detection methods
Enhanced audio state management
Removed automatic page refresh on toggle
Added comprehensive console logging

v1.0

Initial release
Basic ad detection and muting functionality
Simple toggle interface

⚖️ Legal & Privacy

No Data Collection: This extension doesn't collect any personal data
Local Storage Only: Settings are stored locally in Chrome
Open Source: Full source code is available for review
Ad Blocking: This extension mutes ads but doesn't block them entirely

🙏 Acknowledgments

Thanks to the Chrome Extensions community for development resources
Inspired by various ad-blocking solutions
Built for educational purposes and user convenience

📞 Support

Issues: GitHub Issues
Discussions: GitHub Discussions
Updates: Watch this repository for updates

⭐ Like this extension?
If this extension helps improve your YouTube experience:

⭐ Star this repository
🐛 Report any bugs you find
💡 Suggest new features
🔄 Share with friends
