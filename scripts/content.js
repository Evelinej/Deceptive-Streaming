// VARIABLEN

let sitesToCheck = []; // Array von Objekten aus keysData.json (fetch)
let currentURL = window.location.href; // aktuelle URL der Seite
let autoplayStorageData = null; // ein Objekt aus sitesToCheck, das die Infos für die aktuelle Seite enthält (getAutoplayData)


// FUNKTIONEN

// Funktion zum Senden einer Nachricht an das Hintergrundskript zum Setzen des Badges
function controlBadge(bool) {
    if (bool) {
        chrome.runtime.sendMessage({ action: 'setBadge' });
    } else {
        chrome.runtime.sendMessage({ action: 'noBadge' });
    }
}

// Funktion zum Setzen des Werts für den Schlüssel popupExtremeCountdown im localStorage
function controlPopupExtremeCountdown(bool) {
    if (bool === true) {
        chrome.storage.local.set({ popupExtremeCountdown: true });
    } else if (bool === false) {
        chrome.storage.local.set({ popupExtremeCountdown: false });
    } else if (bool === "other") {
        chrome.storage.local.set({ popupExtremeCountdown: 'other' });
    }
}

function htmlAutoplayStatusChange(className) {
    let selector = `.${className}`; // Template String mit Backticks (`) 
    let autoplay = document.querySelector(selector); // querySelector statt getElementsByClassName

    if (autoplay) {
        autoplay.addEventListener('click', function () {
            // console.log("Autoplay wurde geklickt!");

            // Asynchronen Zugriff auf den Speicher korrekt handhaben
            chrome.storage.local.get('popupExtremeCountdown', function (result) {
                let popupExtremeCountdown = result.popupExtremeCountdown;

                if (popupExtremeCountdown === true) {
                    controlPopupExtremeCountdown(false);
                    controlBadge(false);
                } else if (popupExtremeCountdown === false) {
                    controlPopupExtremeCountdown(true);
                    controlBadge(true);
                }
            });
        });
    } else {
        // console.log("HTML Element existiert nicht.");
    }
}

// Funktion zum Auslesen und Ausgeben der Daten aus dem sessionStorage und localStorage basierend auf den Schlüsseln aus der JSON-Datei
function logAutoplayStorageData(autoplayStorageData) {

    let autoplayDataLocation = autoplayStorageData.autoplayDataLocation; // sessionStorage, localStorage oder none

    let autoplayKey = autoplayStorageData.autoplayKey;
    let autoplayActive = autoplayStorageData.autoplayActive;
    let autoplayDisabled = autoplayStorageData.autoplayDisabled;
    let htmlAutoplayClass = autoplayStorageData.htmlAutoplayClass;
    htmlAutoplayStatusChange(htmlAutoplayClass);

    // switch-case-Statement, um die Daten aus dem sessionStorage, localStorage oder keiner der beiden Quellen auszulesen
    switch (autoplayDataLocation) {
        case "sessionStorage":
            // console.log("Daten aus dem sessionStorage auslesen");

            // JSON-Objekt aus dem sessionStorage parsen
            let sessionStorageData = JSON.parse(window.sessionStorage.getItem(autoplayKey));

            // Überprüfen, ob der Autoplay-Key aktiviert oder deaktiviert ist
            if (sessionStorageData.data === autoplayActive) {
                // console.log('Autoplay ist aktiviert!');
                controlBadge(true);
                controlPopupExtremeCountdown(true);
            } else if (sessionStorageData.data === autoplayDisabled) {
                // console.log('Autoplay ist deaktiviert.');
                controlBadge(false);
                controlPopupExtremeCountdown(false);
            } else {
                // console.log('Autoplay ist weder aktiviert noch deaktiviert.');
            }

            break;
        case "localStorage":

            let localStorageData = window.localStorage.getItem(autoplayKey);

            // Überprüfen, ob der Autoplay-Key aktiviert oder deaktiviert ist
            if (localStorageData === autoplayActive) {
                // console.log('Autoplay ist aktiviert!');
                controlBadge(true);
                controlPopupExtremeCountdown(true);
            } else if (localStorageData === autoplayDisabled) {
                // console.log('Autoplay ist deaktiviert.');
                controlBadge(false);
                controlPopupExtremeCountdown(false);
            } else {
                // console.log('Autoplay ist weder aktiviert noch deaktiviert.');
            }

            break;
        case "none":
            // console.log("Keine Datenquelle für Autoplay-Key vorhanden");
            controlBadge(true);
            controlPopupExtremeCountdown("other");

            break;
        default:
            // console.log("switch-case-statement: default");
    }

}

// Funktion zum Überprüfen, ob die aktuelle Seite in der Liste der ausgeschlossenen Seiten enthalten ist und speichern des einzelnen Objekts in der Variable autoplayStorageData
function checkUrl() {
    // Prüfung, ob die URL der aktuellen Seite mit einer der URLs in sitesToCheck übereinstimmt
    if (sitesToCheck.some(site => currentURL.startsWith(site.url))) {
        // console.log("Diese Seite ist in der Liste enthalten.");
        autoplayStorageData = sitesToCheck.find(site => currentURL.startsWith(site.url));

        // setTimeout, um sicherzustellen, dass der Storage vollständig geladen ist, 3 Sekunden Verzug
        setTimeout(function () {
            logAutoplayStorageData(autoplayStorageData);
        }), 3000;

    } else {
        // console.log("Diese Seite ist nicht in der Liste enthalten.");
        controlBadge(false);
        controlPopupExtremeCountdown("other");
    }
}


// FETCH

// Fetch zum Laden der keysData.json-Datei, um die Daten in die sitesToCheck-Variable zu speichern
fetch(chrome.runtime.getURL('scripts/keysData.json'))
    .then((resp) => resp.json())
    .then(function (data) {
        sitesToCheck = data.sitesToCheck; // speichere die Daten aus keysData.json in die sitesToCheck-Variable

        checkUrl();
    })
    .catch(function (error) {
        console.error('Fehler beim Laden der keysData.json:', error);
    });