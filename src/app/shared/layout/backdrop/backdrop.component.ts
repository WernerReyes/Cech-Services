import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-backdrop',
  imports: [
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  templateUrl: './backdrop.component.html',
})

export class BackdropComponent {
  private readonly sidebarService = inject(SidebarService);

  readonly isMobileOpen = this.sidebarService.isMobileOpen;

  closeSidebar() {
    this.sidebarService.setMobileOpen(false);
  }
}
