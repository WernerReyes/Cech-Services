import { HttpStatusCode } from "@angular/common/http";
import { Component, input } from "@angular/core";
import { GridShapeComponent } from "@shared/components/common/grid-shape/grid-shape.component";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { NotFoundComponent } from "./not-found/not-found.component";

@Component({
  selector: "app-error-page",
  imports: [GridShapeComponent, ForbiddenComponent, NotFoundComponent],
  templateUrl: "./error-page.component.html",
  styleUrl: "./error-page.component.css",
})
export class ErrorPageComponent {
  statusCode = input.required<HttpStatusCode | null>();
  errorMessage = input.required<string>();

  HttpStatusCode = HttpStatusCode;
}
