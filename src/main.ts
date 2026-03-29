import { bootstrapApplication } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import { lucideAtom, lucideBrush, lucideHome, lucideLogOut, lucideRulerDimensionLine, lucideUser, lucideUserCircle } from '@ng-icons/lucide';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideIcons({
      lucideHome,
      lucideAtom,
      lucideBrush,
      lucideRulerDimensionLine,
      lucideUserCircle,
      lucideLogOut
    })
  ]
});
