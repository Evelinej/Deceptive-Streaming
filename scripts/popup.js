console.log('popup.js loaded');

let extremeCountdown = document.getElementById('extremeCountdown');

// Überprüfen des Speichers auf Änderungen
chrome.storage.local.get('popupExtremeCountdown', function(data) {
    if (data.popupExtremeCountdown === true) {
        console.log('Popup script received message: true'); // CONSOLE.LOG AM ENDE LÖSCHEN!!!
        extremeCountdown.innerHTML = 'Autoplay active!';

    } else if (data.popupExtremeCountdown === false) {
        console.log('Popup script received message: false'); // CONSOLE.LOG AM ENDE LÖSCHEN!!!
        extremeCountdown.innerHTML = 'Autoplay is off.';

    } else {
        console.log('Popup script received message: other'); // CONSOLE.LOG AM ENDE LÖSCHEN!!!
        chrome.storage.local.remove('popupExtremeCountdown');

    }
});