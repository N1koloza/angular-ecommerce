import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(),

    provideAuth0({
      domain: 'dev-fhn0khoy2p72j2hb.us.auth0.com',
      clientId: '8IvRgavYiNX9AA9MAXrfywdLazItk4av',
      authorizationParams: {
        redirect_uri: window.location.origin
      }
    })
  ]
};
