import { Component, signal } from "@angular/core";

import { AppBlankComponent } from "@app/shared/layout/app-blank/app-blank.component";
import { PageBreadcrumbComponent } from "@app/shared/components/common/page-breadcrumb/page-breadcrumb.component";

import { TicketListTableComponent } from "./components/ticket-list-table/ticket-list-table.component";

@Component({
  selector: "app-ticket-list-page",
  imports: [AppBlankComponent, PageBreadcrumbComponent, TicketListTableComponent],
  templateUrl: "./ticket-list-page.component.html",
  styleUrl: "./ticket-list-page.component.css",
})
export default class TicketListPageComponent {
  protected readonly title = signal("Tickets");

}
