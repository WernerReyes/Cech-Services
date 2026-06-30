import { ApplicationConfig, provideZoneChangeDetection } from "@angular/core";
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
      500: "#e62017", // <- Tu color base principal
      600: "#cc140d",
      700: "#ab0d07",
      800: "#8e0e0a",
      900: "#75120f",
      950: "#410503",
    },
    formField: {
      focusBorderColor: "{primary.500}",
      invalidBorderColor: "light-dark({amber.600}, {amber.300})",
      invalidPlaceholderColor: "light-dark({amber.700}, {amber.300})",
      floatLabelInvalidColor: "light-dark({amber.700}, {amber.300})",
    },
  },
  components: {
    message: {
      error: {
        background:
          "light-dark(color-mix(in srgb, {amber.50}, transparent 8%), color-mix(in srgb, {amber.500}, transparent 84%))",
        borderColor:
          "light-dark({amber.300}, color-mix(in srgb, {amber.400}, transparent 42%))",
        color: "light-dark({amber.800}, {amber.200})",
        simple: {
          color: "light-dark({amber.800}, {amber.200})",
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    MessageService,

    providePrimeNG({
      license:
        "eyJpZCI6ImEwOTVlYzIwLWVlZTgtNGQ4Zi05MGQwLWNkMjMxN2EzNjIwMSIsInByb2R1Y3QiOiJwcmltZXVpIiwidGllciI6ImNvbW11bml0eSIsInR5cGUiOiJkZXYiLCJpYXQiOjE3ODI3ODkxMDQsImV4cCI6MTgxNDMyNTEwNH0.SV5OMdhUyqanU0h82Wu_niJ3eIjaOu5Y4YvgWab1tkLvBh5DcDBQmEBwAGv_caRkbytvS68yqs1lKv9zQ0w2CQ",
      theme: {
        preset: customPreset,
        options: {
          darkModeSelector: ".dark",
        },
      },
    }),
  ],
};
