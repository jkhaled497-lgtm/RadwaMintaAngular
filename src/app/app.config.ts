import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
 import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideAnimations } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { routes } from './app.routes';
import { paramsLangInterceptor } from './core/interceptors/paramsLang/params-lang.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, '/i18n/', '.json');
 }
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideHttpClient(withFetch(),withInterceptors([paramsLangInterceptor])),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(
       TranslateModule.forRoot({
         loader: {
           provide: TranslateLoader,
           useFactory: HttpLoaderFactory,
           deps: [HttpClient]
         }
       })
     ),
    
  ]
};


/**
 * 
 * 
 *  import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
 import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';
 import { TranslateHttpLoader } from '@ngx-translate/http-loader';
 import { TranslateLoader, TranslateModule } from '@ngx-translate/core';

// Create Function To Load Files from assets/i18n/

 export function HttpLoaderFactory(http: HttpClient) {
   return new TranslateHttpLoader(http, '/i18n/', '.json');
 }

// provide files to project
 export const appConfig: ApplicationConfig = {
   providers: [
     ...
     importProvidersFrom(
       TranslateModule.forRoot({
         loader: {
           provide: TranslateLoader,
           useFactory: HttpLoaderFactory,
           deps: [HttpClient]
         }
       })
     )
   ]
 };
 */

// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideAnimations } from '@angular/platform-browser/animations';
// import { routes } from './app.routes';
// import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { provideHttpClient, withFetch } from '@angular/common/http';

// export const appConfig: ApplicationConfig = {
//   providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
//     provideRouter(routes), 
//     provideAnimations(),
//     provideAnimationsAsync(),
//     provideClientHydration(withEventReplay()),
//     provideHttpClient(withFetch()),
//   ]
// };
