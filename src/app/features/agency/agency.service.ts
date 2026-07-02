import { httpResource } from "@angular/common/http";
import { Service, inject } from "@angular/core";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import type { ApiResponse } from "@core/models/api.model";
import type { Agency } from "./agency.model";

@Service()
export class AgencyService {
  private readonly config = inject(APP_CONFIG);

  readonly agencies = httpResource<Agency[]>(
    () => `${this.config.apiUrl}/agencias`,

    {
      defaultValue: [],
      parse: (response) => (response as ApiResponse<Agency[]>).data,
    },
  );
}
