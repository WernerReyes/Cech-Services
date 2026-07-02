import { Component, effect, inject } from "@angular/core";
import { AppBlankComponent } from "@app/shared/layout/app-blank/app-blank.component";
import { AgencyListTableComponent } from "./components/agency-list-table/agency-list-table.component";
import { AuthService } from "@app/core/services/auth.service";
import { PageBreadcrumbComponent } from "@app/shared/components/common/page-breadcrumb/page-breadcrumb.component";
import { GenericTableCellDirective } from "@app/shared/components/tables/generic-table/generic-table-cell.directive";

@Component({
    selector: "app-agency",
    imports: [AppBlankComponent, AgencyListTableComponent, PageBreadcrumbComponent, GenericTableCellDirective],
    templateUrl: "./agency-page.component.html",
})
export default class AgencyPageComponent {
    private readonly authService = inject(AuthService);

    constructor() {
        effect(() => {
            console.log(this.authService.authState()?.agencias);
        })  
    }
}