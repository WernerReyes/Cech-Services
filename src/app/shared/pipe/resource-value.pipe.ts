import { Pipe, PipeTransform } from "@angular/core";
import type { ResourceState } from "@shared/interfaces/resource.interface";

@Pipe({ name: "resourceValue", standalone: true })
export class ResourceValuePipe implements PipeTransform {
  transform<T>(resource: ResourceState<T> | null | undefined, fallback?: T): T {
    if (resource?.hasValue()) {
      return resource.value() as T;
    }

    return fallback as T;
  }
}
