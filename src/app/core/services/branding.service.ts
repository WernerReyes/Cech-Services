import { inject, Service } from "@angular/core";
import { definePreset, palette } from "@primeuix/themes";
import Aura from "@primeuix/themes/aura";
import { APP_CONFIG } from "../config/app.config.tokens";

@Service()
export class BrandingService {
  private readonly cechPrimaryColor = inject(APP_CONFIG).primaryColor;

  applyTenantColor(baseColorHex?: string | null): void {
    let primaryColor = baseColorHex || this.cechPrimaryColor;

    // 1. Genera los tonos 50 al 950 automáticamente
    const generatedPalette = palette(primaryColor);

    const root = document.documentElement;

    Object.entries(generatedPalette).forEach(([shade, hexValue]) => {
      root.style.setProperty(`--p-primary-${shade}`, hexValue);
    });
  }

  getDefaultCustomTheme() {
    return definePreset(Aura, {
      semantic: {
        primary: palette(this.cechPrimaryColor),
      },
    });
  }
}
