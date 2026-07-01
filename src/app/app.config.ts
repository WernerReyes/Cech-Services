import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { providePrimeNG } from "primeng/config";

import { definePreset } from "@primeuix/themes";
import { routes } from "./app.routes";

import Aura from "@primeuix/themes/aura";
import { MessageService } from "primeng/api";

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

export const appConfig: ApplicationConfig = {
  providers: [

    provideRouter(routes),
    MessageService,
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
  ],
};
