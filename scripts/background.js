console.log('background.js loaded');

let isBadgeVisible = false; // Variable, um den aktuellen Status des Badges zu speichern

// Funktion zum Aktualisieren des Badges
function updateBadgeVisibility(shouldBeVisible) {
    if (shouldBeVisible && !isBadgeVisible) {
        // Badge anzeigen
        chrome.action.setBadgeText({ text: '!' });
        isBadgeVisible = true;
    } else if (!shouldBeVisible && isBadgeVisible) {
        // Badge ausblenden
        chrome.action.setBadgeText({ text: '' });
        isBadgeVisible = false;
    }
}

// Nachricht von Inhalts-Script empfangen und Bedingung überprüfen
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'setBadge') {
        // Hier deine Bedingung überprüfen
        const bool = true; // Hier deine Bedingung implementieren
        updateBadgeVisibility(bool);
    } else if (message.action === 'noBadge') {
        // Seite neu geladen, Badge zurücksetzen
        isBadgeVisible = false;
        chrome.action.setBadgeText({ text: '' });
    }
});