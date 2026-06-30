import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-breadcrumb',
  imports: [
    RouterModule,
  ],
  templateUrl: './page-breadcrumb.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styles: ``
})
export class PageBreadcrumbComponent {
  pageTitle = input('');
}
