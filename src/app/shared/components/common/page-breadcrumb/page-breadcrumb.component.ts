import { NgTemplateOutlet } from '@angular/common';
import { Component, contentChild, input, TemplateRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-page-breadcrumb',
  imports: [
    RouterModule,
    NgTemplateOutlet
],
  templateUrl: './page-breadcrumb.component.html',
})
export class PageBreadcrumbComponent {

  icon = input<string>();

  iconTemplate = contentChild<TemplateRef<any>>('icon');

  pageTitle = input('');
 
}


