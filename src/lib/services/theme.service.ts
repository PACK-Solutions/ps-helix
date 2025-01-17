import { Injectable, signal, computed } from '@angular/core';
import { Theme } from '../types/theme.types';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkThemeSignal = signal<boolean>(false);
  private themeNameSignal = signal<Theme>('light');
  private lastChangeSignal = signal<Date>(new Date());

  isDarkTheme = computed(() => this.isDarkThemeSignal());
  themeName = computed(() => this.themeNameSignal());
  
  // Computed signal qui combine plusieurs valeurs
  themeInfo = computed(() => ({
    isDark: this.isDarkTheme(),
    name: this.themeName(),
    lastChange: this.lastChangeSignal()
  }));

  constructor() {
    // Always start with light theme
    this.setDarkTheme(false);

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      // Uncomment the following line if you want to follow system preference
      // this.setDarkTheme(e.matches);
    });
  }

  setDarkTheme(isDark: boolean) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    this.isDarkThemeSignal.set(isDark);
    this.themeNameSignal.set(isDark ? 'dark' : 'light');
    this.lastChangeSignal.set(new Date());
  }

  toggleTheme() {
    this.setDarkTheme(!this.isDarkThemeSignal());
  }

  // Exemple de mise à jour mutuelle de signals
  updateTheme(name: Theme) {
    this.themeNameSignal.set(name);
    this.isDarkThemeSignal.set(name === 'dark');
    this.lastChangeSignal.set(new Date());
  }
}