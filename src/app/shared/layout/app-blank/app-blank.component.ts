
import { Component, inject, input } from '@angular/core';
import { SidebarService } from '@shared/services/sidebar.service';
import { PageBreadcrumbComponent } from '@shared/components/common/page-breadcrumb/page-breadcrumb.component';

@Component({
  selector: 'app-blank',
  imports: [
    PageBreadcrumbComponent
],
  templateUrl: './app-blank.component.html',
})
export class AppBlankComponent {
  protected readonly sidebarService = inject(SidebarService);

  title = input.required<string>();
  

}
