
import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { PageBreadcrumbComponent } from '@shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-blank',
  imports: [
    PageBreadcrumbComponent
],
  templateUrl: './app-blank.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class AppBlankComponent {

  title = input.required<string>();

}
