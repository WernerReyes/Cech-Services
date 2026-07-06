import { Routes } from "@angular/router";

export const ticketRoutes: Routes = [
  {
    path: "tickets",
    loadComponent: () =>
      import("./pages/ticket-list-page/ticket-list-page.component"),
    title: "Tickets",
  },
  {
    path: "tickets/create",
    loadComponent: () =>
      import("./pages/ticket-create-page/ticket-create-page.component"),
    title: "Crear ticket",
  },
];
