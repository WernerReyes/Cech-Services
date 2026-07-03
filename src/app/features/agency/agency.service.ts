import { Service, computed, inject, signal } from "@angular/core";
import { AuthService } from "@app/core/services/auth.service";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import type { Agency } from "./agency.model";

@Service()
export class AgencyService {
  private readonly config = inject(APP_CONFIG);
  private readonly authService = inject(AuthService);

  public readonly agencies = computed<Agency[]>(() => {
    const authState = this.authService.authState();
    return authState?.agencias || [];
  });

  public readonly selectedAgency = signal<Agency | null>(null);


  
}
