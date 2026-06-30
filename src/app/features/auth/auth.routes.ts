import { Routes } from "@angular/router";
import { LoginPage } from "./login/login.page";

export const authRoutes: Routes = [
  // auth pages
  

  {
    path: "login",
    component: LoginPage,
    title:
      "Angular Sign In Dashboard | TailAdmin - Angular Admin Dashboard Template",
  },
  //   {
  //     path: "signup",
  //     component: SignUpComponent,
  //     title:
  //       "Angular Sign Up Dashboard | TailAdmin - Angular Admin Dashboard Template",
  //   },
  // error pages
  //   {
  //     path: "**",
  //     component: NotFoundComponent,
  //     title:
  //       "Angular NotFound Dashboard | TailAdmin - Angular Admin Dashboard Template",
  //   },
];
