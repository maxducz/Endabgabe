// main.ts

import { FireworkManager } from "./firework.js";
import { getRocketConfig, saveRocketConfig, updateSavedDropdown, deleteRocketConfig, RocketConfig } from "./designer.js";

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('previewCanvas') as HTMLCanvasElement;
  const fireworkManager = new FireworkManager(canvas);

  // Beim Klick auf das Canvas eine Explosion erzeugen
  canvas.addEventListener('click', (event: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
  
    const config = getRocketConfig();
    fireworkManager.createExplosion(x, y, config);
  });
  
  // Speichern-Button: Speichert die aktuelle Konfiguration
  const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
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
  const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
  resetBtn.addEventListener('click', () => {
    (document.getElementById('rocketName') as HTMLInputElement).value = '';
    (document.getElementById('explosionRadius') as HTMLInputElement).value = '50';
    (document.getElementById('particleCount') as HTMLInputElement).value = '50';
    (document.getElementById('rocketColor') as HTMLInputElement).value = '#ff0000';
    (document.getElementById('particleSpeed') as HTMLInputElement).value = '5';
    (document.getElementById('fadeDuration') as HTMLInputElement).value = '3';
  });
  
  // Delete-Button: Löscht die aktuell im Dropdown ausgewählte Rakete
  const deleteBtn = document.getElementById('deleteBtn') as HTMLButtonElement;
  deleteBtn.addEventListener('click', () => {
    const savedDropdown = document.getElementById('savedRockets') as HTMLSelectElement;
    if (!savedDropdown.value) {
      alert("Bitte wähle eine Rakete aus dem Dropdown aus, die gelöscht werden soll!");
      return;
    }
    const selectedIndex = parseInt(savedDropdown.value, 10);
    deleteRocketConfig(selectedIndex);
  });
  
  // Dropdown: Bei Auswahl einer gespeicherten Rakete, lade die Parameter in die Eingabefelder.
  const savedDropdown = document.getElementById('savedRockets') as HTMLSelectElement;
  savedDropdown.addEventListener('change', () => {
    // Falls keine Auswahl getroffen wurde, tue nichts
    if (!savedDropdown.value) return;
  
    // Hole die gespeicherten Raketen
    const savedRockets: RocketConfig[] = JSON.parse(localStorage.getItem('savedRockets') || '[]');
    const selectedIndex = parseInt(savedDropdown.value, 10);
    const rocket = savedRockets[selectedIndex];
  
    if (rocket) {
      (document.getElementById('rocketName') as HTMLInputElement).value = rocket.name;
      (document.getElementById('explosionRadius') as HTMLInputElement).value = rocket.explosionRadius.toString();
      (document.getElementById('particleCount') as HTMLInputElement).value = rocket.particleCount.toString();
      (document.getElementById('rocketColor') as HTMLInputElement).value = rocket.color;
      (document.getElementById('particleSpeed') as HTMLInputElement).value = rocket.particleSpeed.toString();
      (document.getElementById('fadeDuration') as HTMLInputElement).value = rocket.fadeDuration.toString();
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
