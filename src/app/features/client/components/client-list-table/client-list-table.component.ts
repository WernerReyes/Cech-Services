import { Component, inject } from "@angular/core";
import { ClientService } from "@features/client/client.service";

import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { Cliente } from "../../client.model";
import { Router } from "@angular/router";

@Component({
  selector: "client-list-table",
  imports: [TableModule, ButtonModule, InputTextModule,  IconFieldModule, InputIconModule],
  templateUrl: "./client-list-table.component.html",
})
export class ClientListTableComponent {
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);

  protected readonly clients = this.clientService.clients;

  onSelectClient(client: Cliente) {
    this.clientService.clientSelect.set(client);
    this.router.navigate(["/agencies"]);
  }

  
}
