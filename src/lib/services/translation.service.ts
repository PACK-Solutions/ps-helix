import { Injectable, inject, InjectionToken, Type } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Interface pour le service de traduction
export interface TranslationProvider {
  translate(key: string, params?: Record<string, any>): string;
  translateAsync(key: string, params?: Record<string, any>): Observable<string>;
  setLanguage(lang: string): void;
  getCurrentLanguage(): string;
  onLangChange(): Observable<string>;
}

// Implémentation par défaut utilisant ngx-translate
@Injectable()
export class NgxTranslateProvider implements TranslationProvider {
  private translateService = inject(TranslateService);

  translate(key: string, params?: Record<string, any>): string {
    if (!key) return '';
    return this.translateService.instant(key, params);
  }

  translateAsync(key: string, params?: Record<string, any>): Observable<string> {
    if (!key) return new Observable(subscriber => subscriber.next(''));
    return this.translateService.stream(key, params);
  }

  setLanguage(lang: string): void {
    this.translateService.use(lang);
  }

  getCurrentLanguage(): string {
    return this.translateService.currentLang;
  }

  onLangChange(): Observable<string> {
    return this.translateService.onLangChange.pipe(
      map(event => event.lang)
    );
  }
}

// Token d'injection pour le service de traduction
export const TRANSLATION_PROVIDER = new InjectionToken<TranslationProvider>('TRANSLATION_PROVIDER', {
  factory: () => new NgxTranslateProvider()
});

// Helper function pour fournir un service de traduction personnalisé
export function provideTranslation(provider: Type<TranslationProvider> = NgxTranslateProvider) {
  return { provide: TRANSLATION_PROVIDER, useClass: provider };
}