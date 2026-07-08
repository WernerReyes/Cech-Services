import { Component, computed, inject, signal } from "@angular/core";
import { ClientService } from "@features/client/client.service";

import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { Cliente } from "../../client.model";
import { Router } from "@angular/router";
import { ErrorBoundaryComponent } from "@app/shared/components/error/error-boundary.component";

@Component({
  selector: "client-list-table",
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    ErrorBoundaryComponent,
  ],
  templateUrl: "./client-list-table.component.html",
})
export class ClientListTableComponent {
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);

  protected readonly clients = this.clientService.clients;
  protected readonly searchQuery = signal("");

  protected readonly filteredClients = computed(() => {
    const query = this.searchQuery().trim().toLowerCase();
    const clients = this.clients.value() ?? [];

    if (!query) {
      return clients;
    }

    return clients.filter(
      (client) =>
        client.idCliente?.toString().toLowerCase().includes(query) ||
        client.cliente?.toLowerCase().includes(query),
    );
  });

  onSelectClient(client: Cliente) {
    this.clientService.clientSelect.set(client);
    this.router.navigate(["/agencies"]);
  }

  
}
