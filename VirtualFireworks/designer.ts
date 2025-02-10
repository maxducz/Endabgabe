// designer.ts

export interface RocketConfig {
    name: string;
    explosionRadius: number;
    particleCount: number;
    color: string;
    particleSpeed: number;
    fadeDuration: number;
  }
  
  /**
   * Liest die aktuelle Raketenkonfiguration aus den UI-Elementen.
   */
  export function getRocketConfig(): RocketConfig {
    const nameInput = document.getElementById('rocketName') as HTMLInputElement;
    const explosionRadiusInput = document.getElementById('explosionRadius') as HTMLInputElement;
    const particleCountInput = document.getElementById('particleCount') as HTMLInputElement;
    const rocketColorInput = document.getElementById('rocketColor') as HTMLInputElement;
    const particleSpeedInput = document.getElementById('particleSpeed') as HTMLInputElement;
    const fadeDurationInput = document.getElementById('fadeDuration') as HTMLInputElement;
  
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
  export function saveRocketConfig(config: RocketConfig): void {
    const savedRockets: RocketConfig[] = JSON.parse(localStorage.getItem('savedRockets') || '[]');
    savedRockets.push(config);
    localStorage.setItem('savedRockets', JSON.stringify(savedRockets));
    updateSavedDropdown();
  }
  
  /**
   * Liest die gespeicherten Raketen aus localStorage aus und füllt das Dropdown.
   */
  export function updateSavedDropdown(): void {
    const dropdown = document.getElementById('savedRockets') as HTMLSelectElement;
    const savedRockets: RocketConfig[] = JSON.parse(localStorage.getItem('savedRockets') || '[]');
  
    dropdown.innerHTML = `<option value="">-- Gespeicherte Raketen --</option>`;
    savedRockets.forEach((rocket, index) => {
      const option = document.createElement('option');
      option.value = index.toString();
      option.textContent = rocket.name;
      dropdown.appendChild(option);
    });
  }
  
  export function deleteRocketConfig(index: number): void {
    const savedRockets: RocketConfig[] = JSON.parse(localStorage.getItem('savedRockets') || '[]');
    if (index >= 0 && index < savedRockets.length) {
        savedRockets.splice(index, 1);
        localStorage.setItem('savedRockets', JSON.stringify(savedRockets));
        updateSavedDropdown();
    }
  }
