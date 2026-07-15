import { Routes } from "@angular/router";

export const agencyRoutes: Routes = [
  {
    path: "agencies",
    loadComponent: () => import("./agency-page.component"),
    title: "Agencias",
    data: {
      preload: true,
    },
  },
];
