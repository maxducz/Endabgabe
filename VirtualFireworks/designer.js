var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
* Liest die aktuelle Raketenkonfiguration aus den UI-Elementen.
*/
export function getRocketConfig() {
    const nameInput = document.getElementById('rocketName');
    const explosionRadiusInput = document.getElementById('explosionRadius');
    const particleCountInput = document.getElementById('particleCount');
    const rocketColorInput = document.getElementById('rocketColor');
    const particleSpeedInput = document.getElementById('particleSpeed');
    const fadeDurationInput = document.getElementById('fadeDuration');
    return {
        name: nameInput.value,
        explosionRadius: parseInt(explosionRadiusInput.value, 10),
        particleCount: parseInt(particleCountInput.value, 10),
        color: rocketColorInput.value,
        particleSpeed: parseFloat(particleSpeedInput.value),
        fadeDuration: parseFloat(fadeDurationInput.value)
    };
}
/**
* Lädt die Raketen-Konfigurationen von mingidb und speichert sie im localStorage.
* Anschließend wird das Dropdown aktualisiert.
*/
export function loadRocketsFromMingidb() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Lade Raketen aus mingidb...");
        const query = new URLSearchParams();
        query.set("command", "find");
        query.set("collection", "RocketCollection");
        query.set("data", "{}");
        try {
            const response = yield fetch(`https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/mdu48352/mingidb.php?${query.toString()}`);
            const responseData = yield response.json();
            console.log("🔹 Rohdaten von mingidb:", responseData);
            let rockets = [];
            // Daten aus der Datenbank ins rockets-Array einfügen
            if (responseData.status === "success" && responseData.data) {
                if (Array.isArray(responseData.data)) {
                    rockets = responseData.data;
                }
                else if (typeof responseData.data === "object") {
                    rockets = Object.keys(responseData.data).map(key => responseData.data[key]); // Kompatible Alternative
                }
                else {
                    console.warn("Unerwartetes Format der Daten:", responseData.data);
                }
            }
            else {
                console.warn("Daten konnten nicht aus mingidb geladen werden:", responseData);
            }
            if (rockets.length === 0) {
                console.warn("Keine Raketen in mingidb gefunden.");
            }
            localStorage.setItem("savedRockets", JSON.stringify(rockets));
            updateSavedDropdown(rockets);
        }
        catch (error) {
            console.error("Fehler beim Laden der Daten von mingidb:", error);
        }
    });
}
/**
* Speichert eine Raketenkonfiguration in mingidb und aktualisiert das Dropdown.
*/
export function saveRocketConfig(config) {
    return __awaiter(this, void 0, void 0, function* () {
        const query = new URLSearchParams();
        query.set("command", "insert");
        query.set("collection", "RocketCollection");
        query.set("data", JSON.stringify(config)); // Raketen-Daten senden
        console.log("Speichere Rakete in mingidb", config);
        console.log("URL:", `https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/mdu48352/mingidb.php?${query.toString()}`);
        try {
            const response = yield fetch(`https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/mdu48352/mingidb.php?${query.toString()}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log("Rakete erfolgreich auf mingidb gespeichert!");
            // Nach dem Speichern erneut alle Raketen laden, damit die neue Rakete im Dropdown erscheint
            yield loadRocketsFromMingidb();
        }
        catch (error) {
            console.error("Fehler beim Speichern auf mingidb:", error);
        }
    });
}
/**
* Aktualisiert das Dropdown-Menü mit gespeicherten Raketen.
*/
export function updateSavedDropdown(rockets) {
    const dropdown = document.getElementById('savedRockets');
    if (!rockets || !Array.isArray(rockets)) {
        rockets = JSON.parse(localStorage.getItem('savedRockets') || '[]');
        if (!Array.isArray(rockets)) {
            rockets = [];
        }
    }
    console.log("🔹 Aktualisiere Dropdown mit gespeicherten Raketen:", rockets);
    dropdown.innerHTML = `<option value="">-- Gespeicherte Raketen --</option>`;
    rockets.forEach((rocket, index) => {
        if (!rocket.name) {
            console.warn(`⚠ Rakete an Index ${index} hat keinen Namen und wird übersprungen.`);
            return;
        }
        const option = document.createElement('option');
        option.value = index.toString();
        option.textContent = rocket.name;
        dropdown.appendChild(option);
        console.log(`✅ Rakete hinzugefügt: ${rocket.name}`);
    });
    console.log("✅ Dropdown erfolgreich aktualisiert.");
}
