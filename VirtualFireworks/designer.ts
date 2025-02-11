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
* Lädt die Raketen-Konfigurationen von mingidb und speichert sie im localStorage.
* Anschließend wird das Dropdown aktualisiert.
*/
export async function loadRocketsFromMingidb(): Promise<void> {
  console.log("Lade Raketen aus mingidb...");

  const query = new URLSearchParams();
  query.set("command", "find");
  query.set("collection", "RocketCollection");
  query.set("data", "{}");

  try {
      const response = await fetch(`https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/mdu48352/mingidb.php?${query.toString()}`);
      const responseData = await response.json();

      let rockets: RocketConfig[] = [];

      if (responseData.status === "success" && responseData.data && Array.isArray(responseData.data.data)) {
          rockets = responseData.data.data;
      } else {
          console.warn("Unerwartetes Datenformat von mingidb:", responseData);
      }

      if (rockets.length === 0) {
          console.warn("Keine Raketen in mingidb gefunden.");
      }

      localStorage.setItem("savedRockets", JSON.stringify(rockets));

      updateSavedDropdown(rockets);
  } catch (error) {
      console.error("Fehler beim Laden der Daten von mingidb:", error);
  }
}


/**
* Speichert eine Raketenkonfiguration in mingidb und aktualisiert das Dropdown.
*/
export async function saveRocketConfig(config: RocketConfig): Promise<void> {
  const query = new URLSearchParams();
  query.set("command", "insert");
  query.set("collection", "RocketCollection");
  query.set("data", JSON.stringify(config));// Raketen-Daten senden

  console.log("Speichere Rakete in mingidb", config);
  console.log("URL:", `https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/mdu48352/mingidb.php?${query.toString()}`)

  try {
    const response = await fetch(`https://7c8644f9-f81d-49cd-980b-1883574694b6.fr.bw-cloud-instance.org/mdu48352/mingidb.php?${query.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    console.log("Rakete erfolgreich auf mingidb gespeichert!");

    // Nach dem Speichern erneut alle Raketen laden, damit die neue Rakete im Dropdown erscheint
    await loadRocketsFromMingidb();
  } catch (error) {
    console.error("Fehler beim Speichern auf mingidb:", error);
  }
}

/**
* Aktualisiert das Dropdown-Menü mit gespeicherten Raketen.
*/
export function updateSavedDropdown(rockets?: RocketConfig[]): void {
  const dropdown = document.getElementById('savedRockets') as HTMLSelectElement;

  if (!rockets || !Array.isArray(rockets)) {
      rockets = JSON.parse(localStorage.getItem('savedRockets') || '[]');

      if(!Array.isArray(rockets)) {
        rockets = [];
      }
  }

  console.log("Aktualisiere Dropdown mit gespeicherten Raketen:", rockets);

  dropdown.innerHTML = `<option value="">-- Gespeicherte Raketen --</option>`;
  rockets.forEach((rocket, index) => {
      const option = document.createElement('option');
      option.value = index.toString();
      option.textContent = rocket.name;
      dropdown.appendChild(option);
  });

  console.log("Dropdown erfolgreich aktualisiert.");
}



