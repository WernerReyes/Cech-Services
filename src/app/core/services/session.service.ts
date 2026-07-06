import { DestroyRef, inject, Service, signal } from '@angular/core';
import { AuthService } from './auth.service';

@Service()
export class SessionService {
  private authService = inject(AuthService);
  private destroyRef = inject(DestroyRef);
  
  // Signals públicos para tus componentes
  public timeLeft = signal<string>('Cargando...');
  public sessionExpiring = signal<boolean>(false); // <- NUEVA VARIABLE: Avisa si el tiempo límite se alcanzó

  // CONFIGURACIÓN: Define a los cuántos minutos de anticipación quieres avisar (ej: 5 minutos)
  private readonly WARNING_THRESHOLD_MINUTES = 5;
  
  

  private timeoutId: any;

  constructor() {
    this.startTracking();
    this.destroyRef.onDestroy(() => this.stopTracking());
  }

  public startTracking(): void {
    this.stopTracking();
    this.runLoop();
  }

  public stopTracking(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  private runLoop(): void {
    const nextInterval = this.updateTime();
    if (nextInterval > 0) {
      this.timeoutId = setTimeout(() => this.runLoop(), nextInterval);
    }
  }

  private updateTime(): number {
    const decoded = this.authService.decodeToken();
    
    if (!decoded || !decoded.exp) {
      this.timeLeft.set('Sin sesión activa');
      this.sessionExpiring.set(false);
      return 0;
    }

    const expirationMs = decoded.exp * 1000;
    const remainingMs = expirationMs - Date.now();

    if (remainingMs <= 0) {
      this.timeLeft.set('Sesión expirada');
      this.sessionExpiring.set(false);
      this.handleLogout();
      return 0;
    }

    this.timeLeft.set(this.formatRemainingTime(remainingMs));

    // --- NUEVA LÓGICA: Alerta de expiración inminente ---
    const thresholdMs = this.WARNING_THRESHOLD_MINUTES * 60 * 1000;
    
    if (remainingMs <= thresholdMs) {
      this.sessionExpiring.set(true); // Cambia a true si queda menos tiempo del configurado
    } else {
      this.sessionExpiring.set(false); // Por seguridad (si el token se llega a renovar)
    }

    // --- Optimización del Temporizador ---
    const HOUR = 1000 * 60 * 60;
    
    // ATENCIÓN: Si estamos dentro del tiempo de alerta (ej: 5 min), 
    // forzamos el conteo a 1 segundo para que el diálogo sea preciso.
    const desiredInterval = (remainingMs > HOUR && !this.sessionExpiring()) ? 60000 : 1000;

    return desiredInterval;
  }

  private formatRemainingTime(ms: number): string {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    if (ms >= DAY) {
      const days = Math.floor(ms / DAY);
      const remainingHours = Math.floor((ms % DAY) / HOUR);
      return remainingHours > 0 ? `${days} d y ${remainingHours} h` : `${days} d`;
    }
    if (ms >= HOUR) {
      const hours = Math.floor(ms / HOUR);
      const remainingMinutes = Math.floor((ms % HOUR) / MINUTE);
      return remainingMinutes > 0 ? `${hours} h y ${remainingMinutes} min` : `${hours} h`;
    }
    if (ms >= MINUTE) {
      const minutes = Math.floor(ms / MINUTE);
      const seconds = Math.floor((ms % MINUTE) / SECOND);
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} min`;
    }
    return `${Math.floor(ms / SECOND)} s`;
  }

  private handleLogout(): void {
    localStorage.removeItem(this.authService.TOKEN_KEY);
  }
}
