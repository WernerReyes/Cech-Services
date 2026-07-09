import { httpResource } from "@angular/common/http";
import { computed, inject, Service, signal } from '@angular/core';
import { APP_CONFIG } from "@core/config/app.config.tokens";
import type { ApiResponse } from "@core/models/api.model";
import type { Agency } from "@features/agency/agency.model";
import { AgencyService } from "@features/agency/agency.service";
import type {
  Machine,
  MachineTicketHistory,
} from "@features/machine/machine.model";

@Service({
  autoProvided: false,
})
export class DashboardService {
  private readonly agencyService = inject(AgencyService);
  private readonly config = inject(APP_CONFIG);

  readonly agencies = computed<Agency[]>(() => this.agencyService.agencies());
  readonly selectedAgency = signal<Agency | null>(null);
  readonly selectedMachine = signal<Machine | null>(null);

  readonly machines = httpResource<Machine[]>(
    () => {
      const agency = this.selectedAgency();
      
      if (!agency) {
        return undefined;
      }

      return `${this.config.apiUrl}/equipos/agencia/${agency.id}`;
    },
    {
      defaultValue: [],
      parse: (response) => (response as ApiResponse<Machine[]>).data ?? [],
    },
  );

  readonly tickets = httpResource<MachineTicketHistory[]>(
    () => {
      const machine = this.selectedMachine();

      if (!machine) {
        return undefined;
      }

      return `${this.config.apiUrl}/equipos/${machine.idEquipo}/tickets`;
    },
    {
      defaultValue: [],
      parse: (response) => {
        const payload = response as
          | ApiResponse<MachineTicketHistory[]>
          | MachineTicketHistory[];

        return Array.isArray(payload) ? payload : (payload.data ?? []);
      },
    },
  );
}
