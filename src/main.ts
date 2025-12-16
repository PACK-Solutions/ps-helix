import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withNoXsrfProtection } from '@angular/common/http';
import { provideZonelessChangeDetection } from '@angular/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { Observable, from } from 'rxjs';
import { translations, TranslationType } from './app/i18n';
import { AppComponent } from './app/app.component';
import { provideRouter, withNavigationErrorHandler } from '@angular/router';
import { routes } from './app/app.routes';

class CustomTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationType> {
    const translation = translations[lang] ?? translations['en'];
    if (!translation) {
      throw new Error(`No translation found for language: ${lang}`);
    }
    return from(Promise.resolve(translation));
  }
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(withNoXsrfProtection()),
    provideZonelessChangeDetection(),
    provideRouter(routes, withNavigationErrorHandler(() => null)),
    ...TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader
      },
      useDefaultLang: true,
    }).providers || []
  ]
}).catch((err: Error) => console.error(err));
