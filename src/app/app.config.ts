import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
} from "@angular/core";
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from "@angular/router";
import { providePrimeNG } from "primeng/config";

import { routes } from "./app.routes";

import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { APP_CONFIG } from "@core/config/app.config.tokens";
import { authInterceptor } from "@core/interceptors/auth.interceptor";
import { errorInterceptor } from "@core/interceptors/error.interceptor";
import { AuthService } from "@core/services/auth.service";
import { environment } from "@environments/environment";
import Aura from "@primeuix/themes/aura";
import { MessageService } from "primeng/api";

// 1. Importa las funciones y el idioma
import { registerLocaleData } from "@angular/common";
import localeEs from "@angular/common/locales/es";
import { BrandingService } from "@core/services/branding.service";
import { definePreset, palette } from "@primeuix/themes";

// 2. Registra los datos del idioma
registerLocaleData(localeEs);

function initializeApp() {
  const authService = inject(AuthService);
  const brandingService = inject(BrandingService);
  return authService.verifyAuthentication().then((user) => {
    const primaryColor = user?.branding?.colorPrimario;
    brandingService.applyTenantColor(primaryColor);
    return !!user;
  });
}

function customDefaultTheme() {
  return definePreset(Aura, {
    semantic: {
      primary: palette(environment.primaryColor),
    },
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions(),
      withInMemoryScrolling({
        scrollPositionRestoration: "top",
        anchorScrolling: "enabled",
      }),
    ),
    { provide: LOCALE_ID, useValue: "es" },
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
        preset: customDefaultTheme(),
        options: {
          darkModeSelector: ".custom-dark",
        },
      },
    }),
    provideAppInitializer(initializeApp),
  ],
};
