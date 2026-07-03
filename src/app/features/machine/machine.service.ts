import { httpResource } from "@angular/common/http";
import { Service, inject, signal } from "@angular/core";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import type { ApiResponse } from "@core/models/api.model";

import type { Machine, MachineTicketHistory } from "./machine.model";
import { AgencyService } from "../agency/agency.service";

@Service()
export class MachineService {
  private readonly config = inject(APP_CONFIG);
  private readonly agencyService = inject(AgencyService);

  readonly machines = httpResource<Machine[]>(
    () => {
      const selectedAgency = this.agencyService.selectedAgency();
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

  public readonly machineSelect = signal<Machine | null>(null);

  // https://mesadeayuda.cechriza.com/api/equipos/307/tickets

  public readonly machineTickets = httpResource<MachineTicketHistory[]>(
    () => {
      const selectedMachine = this.machineSelect();
      if (!selectedMachine) {
        return undefined;
      }

      return `${this.config.apiUrl}/equipos/${selectedMachine.idEquipo}/tickets`;
    },
    {
      defaultValue: [],
      parse: (response) => {
        const payload =
          response as ApiResponse<MachineTicketHistory[]> | MachineTicketHistory[];

        return Array.isArray(payload) ? payload : payload.data ?? [];
      },
    },
  );


}


// https://mesadeayuda.cechriza.com/api/equipos/agencia/1428
