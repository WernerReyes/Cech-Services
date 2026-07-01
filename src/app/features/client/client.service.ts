import { httpResource } from "@angular/common/http";
import { Service, inject } from "@angular/core";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import { ApiResponse } from "@core/models/api.model";

import type { Cliente } from "./client.model";

@Service()
export class ClientService {
  private readonly config = inject(APP_CONFIG);

  readonly clients = httpResource<Cliente[]>(
    () => `${this.config.apiUrl}/clientes`,

    {
      defaultValue: [],
      parse: (response) => (response as ApiResponse<Cliente[]>).data,
    },
  );
}
