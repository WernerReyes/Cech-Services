import { httpResource } from "@angular/common/http";
import { Service, computed, inject, signal } from "@angular/core";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import type { ApiResponse } from "@core/models/api.model";

import { Agency } from "../agency/agency.model";
import type { Machine, MachineTicketHistory } from "./machine.model";

@Service({
  autoProvided: false,
})
export class MachineService {
  private readonly config = inject(APP_CONFIG);
 
  public readonly selectedAgency = signal<Agency | null>(null);

  public machineId = signal<number | null>(null);

  readonly machines = httpResource<Machine[]>(
    () => {
      const selectedAgency = this.selectedAgency();
      if (!selectedAgency) {
        // return `${this.config.apiUrl}/equipos`;
        return undefined;
      }

      return `${this.config.apiUrl}/equipos/agencia/${selectedAgency.id}`;
    },

    {
      defaultValue: [],
      parse: (response) => (response as ApiResponse<Machine[]>).data,
    },
  );

  public readonly machineSelect = httpResource<Machine | null>(
    () => {
      const machineId = this.machineId();
      if (!machineId) {
        return undefined;
      }
      return `${this.config.apiUrl}/equipos/${machineId}`;
    },
    {
      defaultValue: null,
      parse: (response) => {
        const payload = response as ApiResponse<Machine> | Machine | null;
        return payload && "data" in payload ? payload.data : payload;
      },
    },
  );

  public readonly machineTickets = httpResource<MachineTicketHistory[]>(
    () => {
      const machineId = this.machineId();
      if (!machineId) {
        return undefined;
      }

      return `${this.config.apiUrl}/equipos/${machineId}/tickets`;
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

  public readonly tickets = computed(() =>
    this.machineTickets.hasValue() ? this.machineTickets.value() : [],
  );

 
}

