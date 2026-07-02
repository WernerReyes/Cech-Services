import { Routes } from "@angular/router";

export const ticketRoutes: Routes = [
  {
    path: "tickets/create",
    loadComponent: () =>
      import("./pages/ticket-create-page/ticket-create-page.component"),
    title: "Crear ticket",
  },
];
