import { Component, input, output } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: "app-fallback",
  imports: [ButtonModule, TooltipModule],
  templateUrl: "./fallback.component.html",
})
export class FallBackComponent {
  retry = output<void>();
  loading = input<boolean>(false);
  message = input<string | undefined>("Ha ocurrido un error inesperado.");
}
