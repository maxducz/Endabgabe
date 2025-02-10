// firework.ts
import { RocketConfig } from './designer';

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;    // 1 = frisch, 0 = komplett verblasst
  fadeRate: number;
  radius: number;
  color: string;
}

export class FireworkManager {
  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error("2D-Context konnte nicht initialisiert werden");
    }
    this.ctx = ctx;
  }

  /**
   * Erzeugt eine Explosion an der Position (x, y) basierend auf der Raketenkonfiguration.
   */
  createExplosion(x: number, y: number, config: RocketConfig): void {
    const { particleCount, explosionRadius, color, particleSpeed, fadeDuration } = config;
    // Berechne die Fade-Rate so, dass p.life in (fadeDuration * 60) Frames von 1 auf 0 sinkt.
    const fadeRate = 1 / (fadeDuration * 60);
    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const baseSpeed = Math.random() * (explosionRadius / 20) + 1;
      const speed = baseSpeed * particleSpeed;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      this.particles.push({
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        life: 1,
        fadeRate: fadeRate,
        radius: Math.random() * 2 + 1,
        color: color
      });
    }
  }

  /**
   * Aktualisiert und zeichnet alle Partikel.
   */
  update(): void {
    // Zeichne einen halbtransparenten schwarzen Hintergrund, um den Fade-Effekt zu erzielen
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Entferne abgelaufene Partikel
    this.particles = this.particles.filter(p => p.life > 0);

    for (const p of this.particles) {
      // Aktualisiere Position
      p.x += p.vx;
      p.y += p.vy;
      // Verringere Lebensdauer
      p.life -= p.fadeRate;

      // Zeichne den Partikel als Kreis
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

      // Wenn der Benutzer eine Farbe im Hex-Format auswählt, wandeln wir diese in RGBA um,
      // wobei der Alpha-Wert der aktuellen Lebensdauer entspricht.
      const rgbaColor = hexToRGBA(p.color, Math.max(p.life, 0));
      this.ctx.fillStyle = rgbaColor;
      this.ctx.fill();
    }
  }
}

/**
 * Hilfsfunktion zur Umwandlung eines Hex-Codes (z. B. "#ff0000") in einen rgba()-String
 * mit dem übergebenen Alpha-Wert.
 */
function hexToRGBA(hex: string, alpha: number): string {
  hex = hex.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
