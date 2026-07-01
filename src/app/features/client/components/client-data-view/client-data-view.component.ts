import { Component, inject, input, output } from "@angular/core";
import { BuildingColumns } from "@primeicons/angular/building-columns";
import { Refresh } from "@primeicons/angular/refresh";
import { Search } from "@primeicons/angular/search";
import { Spinner } from "@primeicons/angular/spinner";
import { ButtonModule } from "primeng/button";
import { DataView, DataViewModule } from "primeng/dataview";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";

import { Cliente } from "../../client.model";
import { ClientService } from "../../client.service";

@Component({
  selector: "app-client-data-view",
  imports: [
    BuildingColumns,
    ButtonModule,
    DataViewModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    Refresh,
    Search,
    Spinner,
  ],
  templateUrl: "./client-data-view.component.html",
})
export class ClientDataViewComponent {
  private readonly clientService = inject(ClientService);

  readonly selectedClient = input<Cliente | null>(null);
  readonly clientSelected = output<Cliente>();

  readonly clients = this.clientService.clients;
  readonly rowsPerPageOptions = [10, 25, 50];

  reloadClients(): void {
    this.clients.reload();
  }

  selectClient(client: Cliente): void {
    this.clientSelected.emit(client);
  }

  filterClients(dataView: DataView, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    dataView.filter(inputElement.value, "contains");
  }

  clearFilter(dataView: DataView, inputElement: HTMLInputElement): void {
    inputElement.value = "";
    dataView.filter("", "contains");
  }

  getErrorMessage(error: unknown): string {
    if (error instanceof Error && error.message.trim()) {
      return error.message;
    }

    return "No se pudieron recuperar los clientes.";
  }
}
