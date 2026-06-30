
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageBreadcrumbComponent } from '../../shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-blank',
  imports: [
    PageBreadcrumbComponent
],
  templateUrl: './blank.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class BlankComponent {

}
