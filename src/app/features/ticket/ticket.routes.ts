import { Routes } from "@angular/router";

export const ticketRoutes: Routes = [
  {
    path: "tickets",
    loadComponent: () =>
      import("./pages/ticket-list-page/ticket-list-page.component"),
    title: "Tickets",
    data: {
      preload: true,
    },
  },
  {
    path: "tickets/create",
    loadComponent: () =>
      import("./pages/ticket-create-page/ticket-create-page.component"),
    title: "Crear ticket",
    data: {
      preload: true,
    }
  },
  {
    path: "tickets/:id",
    loadComponent: () =>
      import("./pages/ticket-details-page/ticket-details-page.component"),
    title: "Detalle de ticket",
  },
];
