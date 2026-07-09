import { CommonModule } from "@angular/common";
import { Component, HostListener, OnInit, effect, inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SessionService } from "@app/core/services/session.service";
import { AgencyService } from "@app/features/agency/agency.service";
import { DashboardService } from "@app/features/dashboard/dashboard.service";
import { MachineService } from "@app/features/machine/machine.service";
import { TicketService } from "@app/features/ticket/ticket.service";
import { AppHeaderComponent } from "@shared/layout/app-header/app-header.component";
import { AppSidebarComponent } from "@shared/layout/app-sidebar/app-sidebar.component";
import { BackdropComponent } from "@shared/layout/backdrop/backdrop.component";
import { SidebarService } from "@shared/services/sidebar.service";
import { ConfirmationService } from "primeng/api";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
  selector: "app-layout",
  imports: [
    CommonModule,
    RouterModule,
    AppHeaderComponent,
    AppSidebarComponent,
    BackdropComponent,
    ConfirmDialogModule,
  ],
  templateUrl: "./app-layout.component.html",
  providers: [ConfirmationService, DashboardService, TicketService, AgencyService, MachineService],
})
export class AppLayoutComponent implements OnInit {
  private readonly sidebarService = inject(SidebarService);
  private readonly sessionService = inject(SessionService);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly desktopBreakpoint = 1280;

  constructor() {
    this.sessionService.startTracking();
  }

  readonly isExpanded = this.sidebarService.isExpanded;
  readonly isHovered = this.sidebarService.isHovered;
  readonly isMobileOpen = this.sidebarService.isMobileOpen;

  ngOnInit() {
    this.closeMobileSidebarOnDesktop();
  }

  @HostListener("window:resize")
  onWindowResize() {
    this.closeMobileSidebarOnDesktop();
  }

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
    if (this.sessionService.sessionExpiring()) {
      this.sessionExpiringAlert();
    }
  });

  private closeMobileSidebarOnDesktop() {
    if (window.innerWidth >= this.desktopBreakpoint && this.isMobileOpen()) {
      this.sidebarService.setMobileOpen(false);
    }
  }
}
