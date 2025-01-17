import { Injectable, inject, signal, computed } from '@angular/core';
import { BADGE_CONFIG, BADGE_STYLES, BADGE_VALUE_FORMATTER } from './badge.config';
import { TRANSLATION_PROVIDER } from '../../services/translation.service';

@Injectable()
export class BadgeService {
  private config = inject(BADGE_CONFIG);
  private valueFormatter = inject(BADGE_VALUE_FORMATTER);
  private customStyles = inject(BADGE_STYLES, { optional: true }) ?? [];
  private translationProvider = inject(TRANSLATION_PROVIDER);
  
  // Signal pour la langue courante
  private currentLangSignal = signal(this.translationProvider.getCurrentLanguage());

  constructor() {
    // Écouter les changements de langue
    this.translationProvider.onLangChange().subscribe(lang => {
      this.currentLangSignal.set(lang);
    });
  }

  getConfig() {
    return this.config;
  }

  formatValue(value: number, max: number): string {
    return this.valueFormatter.format(value, max);
  }

  getCustomStyles(): Record<string, string>[] {
    return Array.isArray(this.customStyles) ? this.customStyles : [];
  }

  shouldDisplayValue(value: number, showZero: boolean): boolean {
    return value > 0 || showZero;
  }

  getAriaRole(displayType: string): 'status' | 'img' {
    return displayType === 'counter' ? 'status' : 'img';
  }

  translate(key: string, params?: Record<string, any>): string {
    return this.translationProvider.translate(key, params);
  }

  // Computed signal pour les traductions qui doivent être réactives
  currentLang = computed(() => this.currentLangSignal());
}