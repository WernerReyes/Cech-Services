import { JsonPipe } from "@angular/common";
import { Component, effect, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AgencyService } from "@app/features/agency/agency.service";
import { FloatLabelModule } from "primeng/floatlabel";
import { SelectModule } from "primeng/select";

@Component({
  selector: "select-agency",
  imports: [SelectModule, JsonPipe, FloatLabelModule, FormsModule],
  templateUrl: "./select-agency.component.html",
  styleUrl: "./select-agency.component.css",
})
export class SelectAgencyComponent {
  protected readonly agencyService = inject(AgencyService);

  protected readonly agencies = this.agencyService.agencies;

  
}
