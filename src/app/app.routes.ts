import { Routes } from "@angular/router";
import { AppLayoutComponent } from "@shared/layout/app-layout/app-layout.component";

import { authGuard } from "./core/guards/auth.guard";
import { agencyRoutes } from "./features/agency/agency.routes";
import { authRoutes } from "./features/auth/auth.routes";
import { dashboardRoutes } from "./features/dashboard/dashboard.routes";
import { machineRoutes } from "./features/machine/machine.routes";
import { ticketRoutes } from "./features/ticket/ticket.routes";

export const routes: Routes = [
  {
    path: "",
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      ...dashboardRoutes,
      ...agencyRoutes,
      ...machineRoutes,
      ...ticketRoutes,
    ],
  },
  ...authRoutes,
];
