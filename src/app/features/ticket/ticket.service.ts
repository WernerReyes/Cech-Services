import { HttpClient } from "@angular/common/http";
import { Service, inject } from "@angular/core";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import type { ApiResponse } from "@core/models/api.model";

import type { CreateTicketRequest, CreateTicketResult } from "./ticket.model";

@Service()
export class TicketService {
  private readonly http = inject(HttpClient);
  private readonly config = inject(APP_CONFIG);

  createTicket(payload: CreateTicketRequest) {
    return this.http.post<ApiResponse<CreateTicketResult>>(
      `${this.config.apiUrl}/tickets`,
      payload,
    );
  }
}
