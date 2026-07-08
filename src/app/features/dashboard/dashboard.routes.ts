import { Route } from "@angular/router";

export const dashboardRoutes: Route[] = [
  {
    path: "",
    pathMatch: "full",
    title: "Dashboard",
    loadComponent: () => import("./dashboard-page.component"),
  },
];
