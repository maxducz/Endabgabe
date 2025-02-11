import { FireworkManager } from "./firework.js";
import { getRocketConfig, saveRocketConfig, loadRocketsFromMingidb, updateSavedDropdown } from "./designer.js";

window.addEventListener('DOMContentLoaded', async () => {
    const canvas = document.getElementById('previewCanvas') as HTMLCanvasElement;
    const fireworkManager = new FireworkManager(canvas);

    await loadRocketsFromMingidb();
    
    canvas.addEventListener('click', (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const config = getRocketConfig();
        fireworkManager.createExplosion(x, y, config);
    });

    const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
    saveBtn.addEventListener('click', async () => {
        const config = getRocketConfig();

        if (!config.name) {
            alert("Bitte gib der Rakete einen Namen!");
            return;
        }

        await saveRocketConfig(config);
    });

    const resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
    resetBtn.addEventListener('click', () => {
        (document.getElementById('rocketName') as HTMLInputElement).value = '';
        (document.getElementById('explosionRadius') as HTMLInputElement).value = '50';
        (document.getElementById('particleCount') as HTMLInputElement).value = '50';
        (document.getElementById('rocketColor') as HTMLInputElement).value = '#ff0000';
        (document.getElementById('particleSpeed') as HTMLInputElement).value = '5';
        (document.getElementById('fadeDuration') as HTMLInputElement).value = '3';
    });

    const savedDropdown = document.getElementById('savedRockets') as HTMLSelectElement;
    savedDropdown.addEventListener('change', () => {
        if (!savedDropdown.value) return;

        const savedRockets = JSON.parse(localStorage.getItem('savedRockets') || '[]');
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

    function animate() {
        fireworkManager.update();
        requestAnimationFrame(animate);
    }
    animate();
});
