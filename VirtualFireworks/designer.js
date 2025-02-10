// designer.ts
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
 * Speichert eine Raketenkonfiguration in localStorage (als JSON) und aktualisiert das Dropdown.
 */
export function saveRocketConfig(config) {
    const savedRockets = JSON.parse(localStorage.getItem('savedRockets') || '[]');
    savedRockets.push(config);
    localStorage.setItem('savedRockets', JSON.stringify(savedRockets));
    updateSavedDropdown();
}
/**
 * Liest die gespeicherten Raketen aus localStorage aus und füllt das Dropdown.
 */
export function updateSavedDropdown() {
    const dropdown = document.getElementById('savedRockets');
    const savedRockets = JSON.parse(localStorage.getItem('savedRockets') || '[]');
    dropdown.innerHTML = `<option value="">-- Gespeicherte Raketen --</option>`;
    savedRockets.forEach((rocket, index) => {
        const option = document.createElement('option');
        option.value = index.toString();
        option.textContent = rocket.name;
        dropdown.appendChild(option);
    });
}
export function deleteRocketConfig(index) {
    const savedRockets = JSON.parse(localStorage.getItem('savedRockets') || '[]');
    if (index >= 0 && index < savedRockets.length) {
        savedRockets.splice(index, 1);
        localStorage.setItem('savedRockets', JSON.stringify(savedRockets));
        updateSavedDropdown();
    }
}
