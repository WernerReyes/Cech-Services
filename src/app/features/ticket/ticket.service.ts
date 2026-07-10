import { HttpClient, httpResource } from "@angular/common/http";
import { Service, inject, signal } from "@angular/core";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import type { ApiResponse } from "@core/models/api.model";
import type { Agency } from "../agency/agency.model";

import type {
  CreateTicketRequest,
  CreateTicketResult,
  Ticket,
  TicketDetail,
} from "./ticket.model";

@Service({
  autoProvided: false,
})
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);
  public selectedAgency = signal<Agency | null>(null);
  public selectedTicketId = signal<number | null>(null);

  public getAllTickets = httpResource<Ticket[]>(
    () => `${this.config.apiUrl}/tickets`,
    {
      defaultValue: [],
      parse: (response) => (response as ApiResponse<Ticket[]>).data ?? [],
    },
  );

  public ticketDetail = httpResource<TicketDetail | null>(
    () => {
      const ticketId = this.selectedTicketId();
      if (!ticketId) {
        return undefined;
      }

      return `${this.config.apiUrl}/tickets/${ticketId}`;
    },
    {
      defaultValue: null,
      parse: (response) => {
        const payload = response as ApiResponse<TicketDetail> | TicketDetail | null;

        if (payload && typeof payload === "object" && "data" in payload) {
          return payload.data;
        }

        return payload;
      },
    },
  );

  createTicket(payload: CreateTicketRequest) {
    return this.http.post<ApiResponse<CreateTicketResult>>(
      `${this.config.apiUrl}/tickets`,
      payload,
    );
  }
}
