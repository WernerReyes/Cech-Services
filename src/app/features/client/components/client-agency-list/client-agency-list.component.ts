import { httpResource } from "@angular/common/http";
import { Component, inject, input } from "@angular/core";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import { ApiResponse } from "@core/models/api.model";
import { BuildingColumns } from "@primeicons/angular/building-columns";
import { MapMarker } from "@primeicons/angular/map-marker";
import { Refresh } from "@primeicons/angular/refresh";
import { Search } from "@primeicons/angular/search";
import { Spinner } from "@primeicons/angular/spinner";
import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { Table, TableModule } from "primeng/table";
import { TagModule } from "primeng/tag";

import { Agencia, Cliente } from "../../client.model";

@Component({
  selector: "app-client-agency-list",
  imports: [
    BuildingColumns,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    MapMarker,
    Refresh,
    Search,
    Spinner,
    TableModule,
    TagModule,
  ],
  templateUrl: "./client-agency-list.component.html",
})
export class ClientAgencyListComponent {
  private readonly config = inject(APP_CONFIG);

  readonly client = input<Cliente | null>(null);
  readonly globalFilterFields = [
    "idAgencia",
    "agencia",
    "direccion",
    "departamento.valor",
    "provincia.valor",
    "distrito.valor",
    "zona.valor",
    "ubicacion.valor",
    "empresa.valor",
  ];
  readonly rowsPerPageOptions = [5, 10, 25, 50];

  readonly agencies = httpResource<Agencia[]>(
    () => {
      const selectedClient = this.client();
      return selectedClient
        ? `${this.config.apiUrl}/agencias/cliente/${selectedClient.idCliente}`
        : undefined;
    },
    {
      parse: (response) => this.parseAgenciesResponse(response),
    },
  );

  reloadAgencies(): void {
    this.agencies.reload();
  }

  filterGlobal(table: Table, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    table.filterGlobal(inputElement.value, "contains");
  }

  clearFilters(table: Table, inputElement: HTMLInputElement): void {
    inputElement.value = "";
    table.clear();
  }

  getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return "No se pudieron recuperar las agencias del cliente.";
  }

  private parseAgenciesResponse(response: unknown): Agencia[] {
    const payload = response as ApiResponse<Agencia[] | Agencia> | Agencia[] | Agencia;

    if (Array.isArray(payload)) {
      return payload;
    }

    if ("data" in payload) {
      const data = payload.data;
      return Array.isArray(data) ? data : [data];
    }

    return [payload];
  }
}
