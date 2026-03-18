import { bootstrapApplication } from '@angular/platform-browser';
import { provideIcons } from '@ng-icons/core';
import { lucideAtom, lucideBrush, lucideHome, lucideRulerDimensionLine, lucideUser } from '@ng-icons/lucide';
import { App } from './app/app';

bootstrapApplication(App, {
  providers: [
    provideIcons({
      lucideHome,
      lucideAtom,
      lucideBrush,
      lucideRulerDimensionLine,
      lucideUser
    })
  ]
});
