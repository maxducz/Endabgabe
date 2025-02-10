// main.ts
import { FireworkManager } from "./firework.js";
import { getRocketConfig, saveRocketConfig, updateSavedDropdown, deleteRocketConfig } from "./designer.js";
window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('previewCanvas');
    const fireworkManager = new FireworkManager(canvas);
    // Beim Klick auf das Canvas eine Explosion erzeugen
    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const config = getRocketConfig();
        fireworkManager.createExplosion(x, y, config);
    });
    // Speichern-Button: Speichert die aktuelle Konfiguration
    const saveBtn = document.getElementById('saveBtn');
    saveBtn.addEventListener('click', () => {
        const config = getRocketConfig();
        // Überprüfen, ob ein Name eingegeben wurde
        if (!config.name) {
            alert("Bitte gib der Rakete einen Namen!");
            return;
        }
        saveRocketConfig(config);
    });
    // Reset-Button: Setzt die Eingabefelder auf Standardwerte zurück
    const resetBtn = document.getElementById('resetBtn');
    resetBtn.addEventListener('click', () => {
        document.getElementById('rocketName').value = '';
        document.getElementById('explosionRadius').value = '50';
        document.getElementById('particleCount').value = '50';
        document.getElementById('rocketColor').value = '#ff0000';
        document.getElementById('particleSpeed').value = '5';
        document.getElementById('fadeDuration').value = '3';
    });
    // Delete-Button: Löscht die aktuell im Dropdown ausgewählte Rakete
    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.addEventListener('click', () => {
        const savedDropdown = document.getElementById('savedRockets');
        if (!savedDropdown.value) {
            alert("Bitte wähle eine Rakete aus dem Dropdown aus, die gelöscht werden soll!");
            return;
        }
        const selectedIndex = parseInt(savedDropdown.value, 10);
        deleteRocketConfig(selectedIndex);
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
    // Dropdown beim Start aktualisieren
    updateSavedDropdown();
    // Animationsloop starten
    function animate() {
        fireworkManager.update();
        requestAnimationFrame(animate);
    }
    animate();
});
