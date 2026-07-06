import { Component, effect, inject } from "@angular/core";
import { SidebarService } from "@shared/services/sidebar.service";
import { CommonModule } from "@angular/common";
import { AppSidebarComponent } from "@shared/layout/app-sidebar/app-sidebar.component";
import { BackdropComponent } from "@shared/layout/backdrop/backdrop.component";
import { RouterModule } from "@angular/router";
import { AppHeaderComponent } from "@shared/layout/app-header/app-header.component";
import { SessionService } from "@app/core/services/session.service";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
  selector: "app-layout",
  imports: [
    CommonModule,
    RouterModule,
    AppHeaderComponent,
    AppSidebarComponent,
    // SidebarVariantsDemo,
    BackdropComponent,
    ConfirmDialogModule,
  ],
  templateUrl: "./app-layout.component.html",
  providers: [ConfirmationService],
})
export class AppLayoutComponent {
  private readonly sidebarService = inject(SidebarService);
  private readonly sessionService = inject(SessionService);
  private readonly confirmationService = inject(ConfirmationService);

  constructor() {
    this.sessionService.startTracking();
  }

  readonly isExpanded = this.sidebarService.isExpanded;
  readonly isHovered = this.sidebarService.isHovered;
  readonly isMobileOpen = this.sidebarService.isMobileOpen;

  get containerClasses() {
    return [
      "flex-1",
      "transition-all",
      "duration-300",
      "ease-in-out",
      this.isExpanded() || this.isHovered() ? "xl:ml-[290px]" : "xl:ml-[90px]",
      this.isMobileOpen() ? "ml-0" : "",
    ];
  }

  private sessionExpiringAlert() {
    this.confirmationService.confirm({
      header: "Are you sure?",
      message: "Please confirm to proceed.",
      accept: () => {
        console.log("Session is expiring. User confirmed.");
        // this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      },
      reject: () => {
        console.log("Session is expiring. User rejected.");
        // this.messageService.add({ severity: 'info', summary: 'Rejected', detail: 'You have rejected' });
      },
    });
  }

  private showSessionExpiringAlert = effect(() => {
    console.log("Session expiring signal changed:", this.sessionService.sessionExpiring());
    if (this.sessionService.sessionExpiring()) {
      console.log("Session is expiring. Showing alert.");
      this.sessionExpiringAlert();
    }
  });
}
