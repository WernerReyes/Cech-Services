import { Component, inject } from "@angular/core";
import { ClientService } from "@features/client/client.service";
import { BuildingColumns } from "@primeicons/angular/building-columns";
import { Search } from "@primeicons/angular/search";
import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";

@Component({
  selector: "client-list-table",
  imports: [TableModule, ButtonModule, Search, BuildingColumns, InputTextModule, IconFieldModule, InputIconModule],
  templateUrl: "./client-list-table.component.html",
})
export class ClientListTableComponent {
  private readonly clientService = inject(ClientService);
  protected readonly clients = this.clientService.clients;

  
}
