import { Component } from "@angular/core";
import { AppBlankComponent } from "@shared/layout/app-blank/app-blank.component";
import { ClientListTableComponent } from "./components/client-list-table/client-list-table.component";

@Component({
  selector: "app-client",
  imports: [AppBlankComponent, ClientListTableComponent],
  templateUrl: "./client-page.component.html",
})
export default class ClientPageComponent {}
