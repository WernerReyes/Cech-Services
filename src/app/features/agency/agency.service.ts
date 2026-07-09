import { Service, computed, inject, signal } from "@angular/core";
import { AuthService } from "@app/core/services/auth.service";
import type { Agency } from "./agency.model";

@Service({
  autoProvided: false,
})
export class AgencyService {
  private readonly authService = inject(AuthService);


  public readonly agencies = computed<Agency[]>(() => {
    const authState = this.authService.authState();
    return authState?.agencias || [];
  });

  public readonly selectedAgency = signal<Agency | null>(null);
}
