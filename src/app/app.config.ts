import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
} from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";
import { providePrimeNG } from "primeng/config";

import { definePreset } from "@primeuix/themes";
import { routes } from "./app.routes";

import Aura from "@primeuix/themes/aura";
import { MessageService } from "primeng/api";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import { environment } from "@environments/environment";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { authInterceptor } from "@core/interceptors/auth.interceptor";
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import { AuthService } from "./core/services/auth.service";

// 1. Importa las funciones y el idioma
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

// 2. Registra los datos del idioma
registerLocaleData(localeEs);

const customPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "#fff1f0",
      100: "#ffe1df",
      200: "#ffc8c4",
      300: "#ffa19a",
      400: "#ff6d63",
      500: "#EC111A", // <- Tu color base principal
      600: "#cc140d",
      700: "#ab0d07",
      800: "#8e0e0a",
      900: "#75120f",
      950: "#410503",
    },
  },
});

function initializeApp() {
  const authService = inject(AuthService);
  return authService.verifyAuthentication();
  // return Promise.resolve(true);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    { provide: LOCALE_ID, useValue: 'es' },
    MessageService,
    {
      provide: APP_CONFIG,
      useValue: environment,
    },
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    providePrimeNG({
      license:
        "eyJpZCI6ImEwOTVlYzIwLWVlZTgtNGQ4Zi05MGQwLWNkMjMxN2EzNjIwMSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODI3ODkxMDQsImV4cCI6MTgxNDMyNTEwNH0.SV5OMdhUyqanU0h82Wu_niJ3eIjaOu5Y4YvgWab1tkLvBh5DcDBQmEBwAGv_caRkbytvS68yqs1lKv9zQ0w2CQ",
      theme: {
        preset: customPreset,
        options: {
          darkModeSelector: ".custom-dark",
        },
      },
    }),

    // 💥 REGISTRO DEL INICIALIZADOR GLOBAL
    provideAppInitializer(initializeApp),
  ],
};
