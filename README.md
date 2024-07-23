
# Deceptive Streaming

Deceptive patterns defined by Harry Brignull are patterns that entice users to do something they did not intend to do (2010). Chaudhary et al. have expanded the field of research to include streaming platforms (2022). For my bachelor thesis, I developed a Chrome extension that recognizes a deceptive pattern.

This Chrome extension is designed to recognize the deceptive pattern Extreme Countdown defined by Chaudhary et al. This form occurs when it is necessary to react to a timer in a short time in order to prevent a function from being executed automatically. For example, the automatic playback of the next episode.
## Requirements
- Reading the key in the storage for triggering the autoplay function
- Display a warning sign when autoplay is activated
- Pop-up showing the status (active/inactive/no autoplay available)

## Structure of the JSON file

```
{
    "sitesToCheck": [
    {
        "url": "https://www.youtube.com",
        "autoplayDataLocation": "sessionStorage",
        "autoplayKey": "yt-player-autonavstate",
        "autoplayActive": "2",
        "autoplayDisabled": "1",
        "htmlAutoplayClass": "ytp-autonav-toggle-button"
    },
]}
```

- A new object is created in ‘siteToCheck’ for each streaming page.
- url = the base url of the page
- autoplayDataLocation = localStorage (the value for autoplay is stored in localStorage) / sessionStorage (the value for autoplay is stored in sessionStorage) / none (autoplay cannot be deactivated)
- autoplayKey = name of the key in the storage (only if available)
- autoplayActive = Value for active autoplay
- autoplayDisabled = Value for inactive autoplay
- htmlAutoplayClass = HTML class name for the autoplay button

## Bugs
The following errors occurred during development:
- Error: Anonymous function
- Load page without cache
- Not responding from DOM-Click on vimeo.com

### Anonymous function
I can reproduce the error if I change the browser tab while the plug-in is running. I could not determine what triggers the error. However, the functionality of the extension is not affected.

### Page without cache
If a streaming page that saves its autoplay in local storage is opened with an empty cache, no value is saved. This prevents the plugin from running correctly. The value must first be created in the local storage by using the autoplay button.
Cookies must also be accepted by YouTube, otherwise the extension will not work.

### DOM-Click
Vimeo does not allow event listeners on its website. The plugin therefore only works correctly when the page is reloaded, not when the button is clicked.
## Installation

- Download the Repository
- Go to Chrome Settings using three dots on the top right corner
- Then Select Extensions
- Now, Enable developer mode
- Click on Load Unpacked and select your downloaded Unzip folder
## Links

 - [Deceptive Design (Harry Brignull)](https://www.deceptive.design/)
 - [“Are You Still Watching?” (Chaudhary et al.)](https://dl.acm.org/doi/abs/10.1145/3532106.3533562)