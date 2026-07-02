import { Routes } from "@angular/router";

export const machineRoutes: Routes = [
  {
    path: "machines",
    loadComponent: () =>
      import("./pages/machine-list-page/machine-list-page.component"),
    title: "Equipos",
  },
  {
    path: "machines/:id",
    loadComponent: () =>
      import("./pages/machine-details-page/machine-details-page.component"),
    title: "Detalle del Equipo",
  },
];
