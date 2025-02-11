var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FireworkManager } from "./firework.js";
import { getRocketConfig, saveRocketConfig, loadRocketsFromMingidb, updateSavedDropdown } from "./designer.js";
window.addEventListener('DOMContentLoaded', () => __awaiter(void 0, void 0, void 0, function* () {
    const canvas = document.getElementById('previewCanvas');
    const fireworkManager = new FireworkManager(canvas);
    // Lade gespeicherte Raketen von mingidb beim Start
    yield loadRocketsFromMingidb();
    //  Event-Listener für Klick auf Canvas -> Explosion erzeugen
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const config = getRocketConfig();
        fireworkManager.createExplosion(x, y, config);
    });
    // Speichern-Button: Speichert die aktuelle Konfiguration
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        const config = getRocketConfig();
        // Überprüfen, ob ein Name eingegeben wurde
        if (!config.name) {
            alert("Bitte gib der Rakete einen Namen!");
            return;
        }
        yield saveRocketConfig(config); // Speichern auf mingidb
    }));
    //  Reset-Button: Setzt die Eingabefelder auf Standardwerte zurück
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        document.getElementById('rocketName').value = '';
        document.getElementById('explosionRadius').value = '50';
        document.getElementById('particleCount').value = '50';
        document.getElementById('rocketColor').value = '#ff0000';
        document.getElementById('particleSpeed').value = '5';
        document.getElementById('fadeDuration').value = '3';
    });
    // Dropdown: Bei Auswahl einer gespeicherten Rakete, lade die Parameter in die Eingabefelder.
    const savedDropdown = document.getElementById('savedRockets');
    savedDropdown.addEventListener('change', () => {
        // Falls keine Auswahl getroffen wurde, tue nichts
        if (!savedDropdown.value)
            return;
        // Hole die gespeicherten Raketen
        const savedRockets = JSON.parse(localStorage.getItem('savedRockets') || '[]');
        const selectedIndex = parseInt(savedDropdown.value, 10);
        const rocket = savedRockets[selectedIndex];
        if (rocket) {
            document.getElementById('rocketName').value = rocket.name;
            document.getElementById('explosionRadius').value = rocket.explosionRadius.toString();
            document.getElementById('particleCount').value = rocket.particleCount.toString();
            document.getElementById('rocketColor').value = rocket.color;
            document.getElementById('particleSpeed').value = rocket.particleSpeed.toString();
            document.getElementById('fadeDuration').value = rocket.fadeDuration.toString();
        }
    });
    //  Dropdown beim Start aktualisieren (falls localStorage bereits Daten hat)
    updateSavedDropdown();
    //  Animationsloop starten
    function animate() {
        fireworkManager.update();
        requestAnimationFrame(animate);
    }
    animate();
}));
