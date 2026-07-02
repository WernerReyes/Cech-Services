
import { Component, contentChild, inject, input, TemplateRef } from '@angular/core';
import { SidebarService } from '@shared/services/sidebar.service';
import { PageBreadcrumbComponent } from '@shared/components/common/page-breadcrumb/page-breadcrumb.component';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-blank',
  imports: [
    NgTemplateOutlet,
    PageBreadcrumbComponent
],
  templateUrl: './app-blank.component.html',
})
export class AppBlankComponent {
  protected readonly sidebarService = inject(SidebarService);

  headerTemplate = contentChild<TemplateRef<any>>('header');

  title = input.required<string>();
  

}
