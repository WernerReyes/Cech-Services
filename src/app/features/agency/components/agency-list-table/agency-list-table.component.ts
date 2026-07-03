import { Component, inject } from "@angular/core";

import { Router } from "@angular/router";
import { AgencyService } from "@features/agency/agency.service";
import { ButtonModule } from "primeng/button";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputTextModule } from "primeng/inputtext";
import { TableModule } from "primeng/table";
import { Agency } from "../../agency.model";

@Component({
  selector: "agency-list-table",
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
  
    IconFieldModule,
    InputIconModule,
  ],
  templateUrl: "./agency-list-table.component.html",
  styleUrl: "./agency-list-table.component.css",
})
export class AgencyListTableComponent {
  private readonly agencyService = inject(AgencyService);
  private readonly router = inject(Router);
  protected readonly agencies = this.agencyService.agencies;

  viewMachines(agency: Agency) {
    this.agencyService.selectedAgency.set(agency);
    this.router.navigate(["/machines"]);
  }
}
