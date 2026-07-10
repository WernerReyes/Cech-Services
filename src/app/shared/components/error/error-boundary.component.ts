import { NgTemplateOutlet } from "@angular/common";
import { HttpErrorResponse, HttpResourceRef } from "@angular/common/http";
import {
  Component,
  computed,
  contentChild,
  effect,
  input,
  output,
  TemplateRef
} from "@angular/core";
import { SkeletonModule } from "primeng/skeleton";
import { FallBackComponent } from "./fallback/fallback.component";



@Component({
  selector: "app-error-boundary",
  imports: [SkeletonModule, NgTemplateOutlet, FallBackComponent],
  templateUrl: "./error-boundary.component.html",
})


export class ErrorBoundaryComponent<T> {
  resource = input.required<HttpResourceRef<T>>();
  errorMessage = input<string>();
  emptyMessage = input<string>("No hay datos disponibles");
  showEmptyMessage = input<boolean>(true);
  isTable = input<boolean>(false);

  // fallback inputs
  fallbackType = input<"simple" | "card">("simple");

  // Skeleton inputs
  skeletonWidth = input<string>("100%");
  skeletonHeight = input<string>("200px");
  skeletonShape = input<"rectangle" | "circle">("rectangle");

  successData = output<T | undefined>();
  error = output<any>();
  statusCode = output<number | null>();

  loadingTemplate = contentChild<TemplateRef<any>>("loading");
  errorTemplate = contentChild<TemplateRef<any>>("error");
  emptyTemplate = contentChild<TemplateRef<any>>("empty");
  contentTemplate = contentChild<TemplateRef<any>>("content");
 

  isEmpty(): boolean {
    const value = this.resource().value();
    return !value || (Array.isArray(value) && value.length === 0);
  }

  errorMessageDisplay = computed(() => {
    const resourceError = this.resource().error();

    if (typeof resourceError === "string") {
      return resourceError;
    }

    if (resourceError && typeof resourceError === "object") {
      const httpErrorRespose = resourceError as HttpErrorResponse;
      return httpErrorRespose.error || JSON.stringify(httpErrorRespose);
    }

    return this.errorMessage() || "Ha ocurrido un error inesperado.";

  })

  private emitData = effect(() => {
    const resourceState = this.resource();

    if (resourceState.hasValue()) {
      this.successData.emit(resourceState.value());
    } else {
      // Si el valor actual es un arreglo, o si deseas inferir que lo será
      const value = resourceState.hasValue()
        ? resourceState.value()
        : undefined;

      if (Array.isArray(value)) {
        this.successData.emit([] as unknown as T);
      } else {
        this.successData.emit(undefined);
      }
    }

    
    
    this.statusCode.emit(resourceState.statusCode() || null);
    
    if (resourceState.error()) {
      this.error.emit(resourceState.error());
    }
  });
  

  


}
