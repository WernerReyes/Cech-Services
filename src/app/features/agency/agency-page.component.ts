import { Component } from "@angular/core";
import { AppBlankComponent } from "@app/shared/layout/app-blank/app-blank.component";
import { AgencyListTableComponent } from "./components/agency-list-table/agency-list-table.component";

@Component({
    selector: "app-agency",
    imports: [AppBlankComponent, AgencyListTableComponent],
    templateUrl: "./agency-page.component.html",
})
export default class AgencyPageComponent {}