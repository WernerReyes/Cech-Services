import { Component, inject } from "@angular/core";
import { ClientService } from "@features/client/client.service";
import { BuildingColumns } from "@primeicons/angular/building-columns";
import { MapMarker } from "@primeicons/angular/map-marker";
import { Search } from "@primeicons/angular/search";
import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { AgencyService } from "@features/agency/agency.service";
import { JsonPipe } from "@angular/common";

@Component({
  selector: "agency-list-table",
  imports: [TableModule, ButtonModule, Search, BuildingColumns, JsonPipe, InputTextModule, MapMarker, IconFieldModule, InputIconModule],
  templateUrl: "./agency-list-table.component.html",
  styleUrl: "./agency-list-table.component.css",
})
export class AgencyListTableComponent {
  private readonly agencyService = inject(AgencyService);
  protected readonly agencies = this.agencyService.agencies;

  
}
