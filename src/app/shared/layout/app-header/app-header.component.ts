import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  viewChild,
} from "@angular/core";
import { RouterModule } from "@angular/router";
import { SessionService } from "@core/services/session.service";
import { UserDropdownComponent } from "../../components/header/user-dropdown/user-dropdown.component";
import { SidebarService } from "../../services/sidebar.service";
import { AuthService } from "@app/core/services/auth.service";
import { computed } from '@angular/core';

@Component({
  selector: "app-header",
  imports: [CommonModule, RouterModule, UserDropdownComponent],
  templateUrl: "./app-header.component.html",
})
export class AppHeaderComponent {
  private readonly sidebarService = inject(SidebarService);
  private readonly authService = inject(AuthService);
  readonly sessionService = inject(SessionService);

  protected readonly branding = computed(() => this.authService.branding());

  isApplicationMenuOpen = false;
  readonly isMobileOpen = this.sidebarService.isMobileOpen;

  readonly searchInput = viewChild<ElementRef<HTMLInputElement>>("searchInput");

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  ngAfterViewInit() {
    document.addEventListener("keydown", this.handleKeyDown);
  }

  ngOnDestroy() {
    document.removeEventListener("keydown", this.handleKeyDown);
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "k") {
      event.preventDefault();
      this.searchInput()?.nativeElement.focus();
    }
  };
}
