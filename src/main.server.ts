
import { bootstrapApplication } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

const bootstrap = () =>
  bootstrapApplication(AppComponent, {
    ...config,
    providers: [
      ...(config.providers || []),
      provideNoopAnimations(), 
    ],
  });

export default bootstrap;
