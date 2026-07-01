import { Component, signal } from "@angular/core";
import { BuildingColumns } from "@primeicons/angular/building-columns";
import { AppBlankComponent } from "@shared/layout/app-blank/app-blank.component";
import { ButtonModule } from "primeng/button";
import { DrawerModule } from "primeng/drawer";

import { ClientAgencyListComponent } from "./components/client-agency-list/client-agency-list.component";
import { ClientDataViewComponent } from "./components/client-data-view/client-data-view.component";
import { Cliente } from "./client.model";
import { ClientListTableComponent } from "./components/client-list-table/client-list-table.component";

@Component({
  selector: "app-client",
  imports: [
    AppBlankComponent,
    ClientListTableComponent,
    ButtonModule,
    
    DrawerModule,
  ],
  templateUrl: "./client-page.component.html",
})
export default class ClientPageComponent {
  readonly selectedClient = signal<Cliente | null>(null);
  readonly clientsDrawerVisible = signal(false);

  selectClient(client: Cliente): void {
    this.selectedClient.set(client);
    this.clientsDrawerVisible.set(false);
  }

  openClientsDrawer(): void {
    this.clientsDrawerVisible.set(true);
  }
}
