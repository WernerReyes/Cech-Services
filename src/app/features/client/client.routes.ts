import { Routes } from "@angular/router";

export const clientRoutes: Routes = [
  {
    path: "clients",
    loadComponent: () => import("./client-page.component"),
    title: "Clientes",
  },
];
