// import { bootstrapApplication } from '@angular/platform-browser';
// import { AppComponent } from './app/app.component';
// import { config } from './app/app.config.server';

// const bootstrap = () => bootstrapApplication(AppComponent, config);

// export default bootstrap;
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  ...appConfig, 
  providers: [
    ...(appConfig.providers || []), 
    provideAnimationsAsync(),     
  ],
}).catch((err) => console.error(err));
