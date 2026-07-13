import { HttpStatusCode } from "@angular/common/http";
import { Component, input } from "@angular/core";
import { BadRequestComponent } from "./bad-request/bad-request.component";
import { ForbiddenComponent } from "./forbidden/forbidden.component";
import { InternalServerErrorComponent } from "./internal-server-error/internal-server-error.component";
import { NotFoundComponent } from "./not-found/not-found.component";

@Component({
  selector: "app-error-page",
  imports: [ForbiddenComponent, NotFoundComponent, BadRequestComponent, InternalServerErrorComponent],
  templateUrl: "./error-page.component.html",
  styleUrl: "./error-page.component.css",
})
export class ErrorPageComponent {
  statusCode = input.required<HttpStatusCode | null>();
  errorMessage = input.required<string>();

  HttpStatusCode = HttpStatusCode;
}
