import { Component, inject } from '@angular/core';
import { SidebarService } from '@shared/services/sidebar.service';
import { CommonModule } from '@angular/common';
import { AppSidebarComponent } from '@shared/layout/app-sidebar/app-sidebar.component';
import { BackdropComponent } from '@shared/layout/backdrop/backdrop.component';
import { RouterModule } from '@angular/router';
import { AppHeaderComponent } from '@shared/layout/app-header/app-header.component';

@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule,
    AppHeaderComponent,
    AppSidebarComponent,
    // SidebarVariantsDemo,
    BackdropComponent,
  ],
  templateUrl: './app-layout.component.html',
})

export class AppLayoutComponent {
  private readonly sidebarService = inject(SidebarService);

  readonly isExpanded = this.sidebarService.isExpanded;
  readonly isHovered = this.sidebarService.isHovered;
  readonly isMobileOpen = this.sidebarService.isMobileOpen;

  get containerClasses() {
    return [
      'flex-1',
      'transition-all',
      'duration-300',
      'ease-in-out',
      (this.isExpanded() || this.isHovered()) ? 'xl:ml-[290px]' : 'xl:ml-[90px]',
      this.isMobileOpen() ? 'ml-0' : ''
    ];
  }

}
