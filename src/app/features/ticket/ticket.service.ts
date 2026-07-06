import { HttpClient, httpResource } from "@angular/common/http";
import { Service, inject, signal } from "@angular/core";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import type { ApiResponse } from "@core/models/api.model";
import type { Agency } from '../agency/agency.model';

import type {
  CreateTicketRequest,
  CreateTicketResult,
  Ticket,
} from "./ticket.model";

@Service()
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  public selectedAgency = signal<Agency | null>(null);

  public getAllTickets = httpResource<Ticket[]>(
    () => `${this.config.apiUrl}/tickets`,
    {
      parse: (response) => (response as ApiResponse<Ticket[]>).data ?? [],
    },
  );

  createTicket(payload: CreateTicketRequest) {
    return this.http.post<ApiResponse<CreateTicketResult>>(
      `${this.config.apiUrl}/tickets`,
      payload,
    );
  }
}
