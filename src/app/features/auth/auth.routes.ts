import { Router, Routes, CanActivateFn } from "@angular/router";
import { LoginPage } from "./login/login.page";
import { AuthService } from "@app/core/services/auth.service";
import { inject } from "@angular/core";

const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    router.navigate(["/"]);
    return false; // Redirige al dashboard si ya está autenticado
  }
  return true; // Permite el acceso a la página de login
};

export const authRoutes: Routes = [
  // auth pages

  

  {
    canActivate: [authGuard],
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
