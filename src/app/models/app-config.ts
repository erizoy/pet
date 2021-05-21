import { InjectionToken } from '@angular/core';

/** Application configuration model */
export interface AppConfig {
  /** Constant variable for maximum window width of mobile devices  */
  mobileEndpoint: number;
}

/** Injection token for application params */
export const APP_CONFIG = new InjectionToken<AppConfig>('app.config');

/** Application constants */
export const TWO_TODO_CONFIG: AppConfig = {
  mobileEndpoint: 768
};
