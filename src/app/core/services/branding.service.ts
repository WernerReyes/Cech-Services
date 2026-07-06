import { Service } from "@angular/core";
import { palette } from "@primeuix/themes";

@Service()
export class BrandingService {
  private readonly cechPrimaryColor = "#1f439b";


  applyTenantColor(baseColorHex?: string | null): void {
    let primaryColor = baseColorHex || this.cechPrimaryColor;

    // 1. Genera los tonos 50 al 950 automáticamente
    const generatedPalette = palette(primaryColor);

     const root = document.documentElement;
    
    Object.entries(generatedPalette).forEach(([shade, hexValue]) => {
      root.style.setProperty(`--p-primary-${shade}`, hexValue);
    });
   
  }
}
