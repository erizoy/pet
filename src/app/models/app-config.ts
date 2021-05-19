import { InjectionToken } from '@angular/core';

export interface AppConfig {
  mobileEndpoint: number;
}

export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

export const TWO_TODO_CONFIG: AppConfig = {
  mobileEndpoint: 768
};
