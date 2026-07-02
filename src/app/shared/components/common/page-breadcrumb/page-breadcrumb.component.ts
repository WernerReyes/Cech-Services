import { Component, contentChild, input, type TemplateRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-breadcrumb',
  imports: [
    RouterModule,
  ],
  templateUrl: './page-breadcrumb.component.html',
})
export class PageBreadcrumbComponent {

  iconTemplate = contentChild<TemplateRef<any>>('icon');

  pageTitle = input('');
 
}
