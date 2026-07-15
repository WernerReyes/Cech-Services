import { InjectionToken } from '@angular/core';


export interface AppConfig {
  apiUrl: string;
  production: boolean;
  primaryColor: string;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');
