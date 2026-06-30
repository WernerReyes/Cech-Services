

import {
  AfterViewInit,
  Component,
  DOCUMENT,
  inject
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { ToastModule } from "primeng/toast";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterModule, ToastModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements AfterViewInit {

  private readonly document = inject(DOCUMENT);

  ngAfterViewInit(): void {
    setTimeout(() => {
      const license = this.document.getElementById("p-license-host");
      if (license) {
        license.remove();
      }
    }, 0);
  }
}
