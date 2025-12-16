import { Injectable, signal, computed } from '@angular/core';
import { Theme, ThemeConfig } from './types/theme.types';
import { inject } from '@angular/core';

// Clé pour le stockage localStorage
const THEME_STORAGE_KEY = 'helix-theme-preference';

// Interface pour le service de contexte personnalisé
// Les applications peuvent implémenter cette interface pour fournir leurs propres couleurs
export interface InsurerContextService {
  primaryColor(): string;
  secondaryColor(): string;
}

// Token pour l'injection optionnelle
import { InjectionToken } from '@angular/core';
export const INSURER_CONTEXT_SERVICE = new InjectionToken<InsurerContextService>('INSURER_CONTEXT_SERVICE');

const LIGHTEN_PERCENTAGES = {
  light: 20,
  lighter: 40
};

const DARKEN_PERCENTAGES = {
  dark: 20,
  darker: 40
};

/**
 * Convertit une couleur hexadécimale en RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  // Nettoyer le hex code (enlever le # si présent)
  hex = hex.replace(/^#/, '');
  
  // S'assurer que la longueur est correcte
  if (![3, 6].includes(hex.length)) {
    console.error(`Invalid hex color: ${hex}`);
    return null;
  }
  
  // Si c'est un format court (3 chiffres), le convertir en format long (6 chiffres)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  // Extraire les composantes RGB
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Convertit des valeurs RGB en couleur hexadécimale
 */
function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => {
      const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    })
    .join('');
}

/**
 * Éclaircit une couleur hexadécimale d'un certain pourcentage
 */
function lightenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const amount = percent / 100;
  
  const newR = r + (255 - r) * amount;
  const newG = g + (255 - g) * amount;
  const newB = b + (255 - b) * amount;
  
  return rgbToHex(newR, newG, newB);
}

/**
 * Assombrit une couleur hexadécimale d'un certain pourcentage
 */
function darkenColor(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const amount = percent / 100;
  
  const newR = r * (1 - amount);
  const newG = g * (1 - amount);
  const newB = b * (1 - amount);
  
  return rgbToHex(newR, newG, newB);
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private insurerContext = inject(INSURER_CONTEXT_SERVICE, { optional: true });
  private isDarkThemeSignal = signal<boolean>(false);
  private themeNameSignal = signal<Theme>('light');
  private lastChangeSignal = signal<Date>(new Date());

  isDarkTheme = computed(() => this.isDarkThemeSignal());
  themeName = computed(() => this.themeNameSignal());
  
  themeInfo = computed(() => ({
    isDark: this.isDarkTheme(),
    name: this.themeName(),
    lastChange: this.lastChangeSignal()
  }));

  constructor() {
    // Initialiser le thème en fonction de la préférence stockée ou par défaut 'light'
    this.initializeTheme();
    
    // Listen for system theme changes (commented out to keep user control)
    // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    //   this.setDarkTheme(e.matches);
    // });
    
    // Attendre que l'injection soit prête avant d'appliquer le thème
    setTimeout(() => {
      this.applyInsurerTheme();
    }, 0);
  }

  setDarkTheme(isDark: boolean) {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    this.isDarkThemeSignal.set(isDark);
    this.themeNameSignal.set(isDark ? 'dark' : 'light');
    this.lastChangeSignal.set(new Date());
    
    // Réappliquer les couleurs de l'assureur après le changement de thème
    this.applyInsurerTheme();
  }

  toggleTheme() {
    this.setDarkTheme(!this.isDarkThemeSignal());
  }

  updateTheme(name: Theme) {
    this.themeNameSignal.set(name);
    this.isDarkThemeSignal.set(name === 'dark');
    this.lastChangeSignal.set(new Date());
    
    // Sauvegarder la préférence dans localStorage
    this.saveThemePreference(name);
    
    // Réappliquer les couleurs de l'assureur après le changement de thème
    this.applyInsurerTheme();
  }
  
  /**
   * Applique les couleurs de l'assureur aux variables CSS
   * Génère automatiquement toutes les variantes et les gradients
   * Si aucun contexte assureur n'est fourni, les fallbacks CSS des thèmes sont utilisés
   */
  applyInsurerTheme() {
    // Récupérer les couleurs de l'assureur si disponibles
    const primaryColor = this.insurerContext?.primaryColor();
    const secondaryColor = this.insurerContext?.secondaryColor();

    // Debug: afficher les couleurs utilisées
    console.log('Applying theme colors:', {
      primaryColor,
      secondaryColor,
      hasInsurerContext: !!this.insurerContext,
      currentTheme: this.themeName(),
      usingCssFallbacks: !primaryColor && !secondaryColor
    });

    // Si aucun contexte assureur, ne rien faire - les fallbacks CSS seront utilisés
    if (!this.insurerContext) {
      console.log('No InsurerContext service provided - using CSS theme fallback colors');
      return;
    }

    if (primaryColor) {
      try {
        // Générer les variantes de couleurs
        const primaryColorLight = lightenColor(primaryColor, 20);
        const primaryColorLighter = lightenColor(primaryColor, 40);
        const primaryColorDark = darkenColor(primaryColor, 20);
        const primaryColorDarker = darkenColor(primaryColor, 40);
        
        // Convertir en RGB pour les besoins de transparence
        const rgb = hexToRgb(primaryColor);
        const primaryColorRgb = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : null;
        
        // Déterminer si le texte sur cette couleur doit être clair ou foncé
        // Une formule simple: luminosité = 0.299*R + 0.587*G + 0.114*B
        let primaryColorText = '#FFFFFF'; // Par défaut blanc
        if (rgb) {
          const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
          if (luminance > 0.5) {
            primaryColorText = '#000000'; // Texte noir pour les couleurs claires
          }
        }
        
        // Appliquer toutes les variantes primary
        document.documentElement.style.setProperty('--insurer-primary-color', primaryColor);
        document.documentElement.style.setProperty('--insurer-primary-color-light', primaryColorLight);
        document.documentElement.style.setProperty('--insurer-primary-color-lighter', primaryColorLighter);
        document.documentElement.style.setProperty('--insurer-primary-color-dark', primaryColorDark);
        document.documentElement.style.setProperty('--insurer-primary-color-darker', primaryColorDarker);
        document.documentElement.style.setProperty('--insurer-primary-color-text', primaryColorText);

        if (primaryColorRgb) {
          document.documentElement.style.setProperty('--insurer-primary-color-rgb', primaryColorRgb);
        }

        console.log(`Applied primary color variants:`, {
          base: primaryColor,
          light: primaryColorLight,
          lighter: primaryColorLighter,
          dark: primaryColorDark,
          darker: primaryColorDarker,
          text: primaryColorText
        });

       // Appliquer la couleur secondaire et ses variantes
       if (secondaryColor) {
         try {
           // Générer les variantes de couleurs secondaires
           const secondaryColorLight = lightenColor(secondaryColor, 20);
           const secondaryColorLighter = lightenColor(secondaryColor, 40);
           const secondaryColorDark = darkenColor(secondaryColor, 20);
           const secondaryColorDarker = darkenColor(secondaryColor, 40);
           
           // Convertir en RGB pour les besoins de transparence
           const rgb = hexToRgb(secondaryColor);
           const secondaryColorRgb = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : null;
           
           // Déterminer si le texte sur cette couleur doit être clair ou foncé
           let secondaryColorText = '#FFFFFF'; // Par défaut blanc
           if (rgb) {
             const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
             if (luminance > 0.5) {
               secondaryColorText = '#000000'; // Texte noir pour les couleurs claires
             }
           }
           
           // Appliquer toutes les variantes secondary
           document.documentElement.style.setProperty('--insurer-secondary-color', secondaryColor);
           document.documentElement.style.setProperty('--insurer-secondary-color-light', secondaryColorLight);
           document.documentElement.style.setProperty('--insurer-secondary-color-lighter', secondaryColorLighter);
           document.documentElement.style.setProperty('--insurer-secondary-color-dark', secondaryColorDark);
           document.documentElement.style.setProperty('--insurer-secondary-color-darker', secondaryColorDarker);
           document.documentElement.style.setProperty('--insurer-secondary-color-text', secondaryColorText);

           if (secondaryColorRgb) {
             document.documentElement.style.setProperty('--insurer-secondary-color-rgb', secondaryColorRgb);
           }

           console.log(`Applied secondary color variants:`, {
             base: secondaryColor,
             light: secondaryColorLight,
             lighter: secondaryColorLighter,
             dark: secondaryColorDark,
             darker: secondaryColorDarker,
             text: secondaryColorText
           });
         } catch (error) {
           console.error('Error applying insurer secondary color theme:', error);
         }
       }

       console.log('Theme application complete. Primary gradients will automatically update via CSS fallback system.');
       console.log('To see custom colors, provide INSURER_CONTEXT_SERVICE in your app config.');
      } catch (error) {
        console.error('Error applying insurer theme:', error);
      }
    }
  }

  /**
   * Initialise le thème au démarrage de l'application
   * Utilise la préférence stockée ou le thème par défaut 'light'
   */
  private initializeTheme(): void {
    let savedTheme: Theme | null = null;
    
    // Tentative de récupération du thème sauvegardé
    try {
      savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    } catch (error) {
      console.warn('Unable to read theme from localStorage:', error);
    }
    
    // Valider et appliquer le thème
    const isValidTheme = savedTheme === 'light' || savedTheme === 'dark';
    const themeToApply = isValidTheme ? savedTheme : 'light';
    
    this.setDarkTheme(themeToApply === 'dark');
  }

  /**
   * Sauvegarde la préférence de thème dans le localStorage
   */
  private saveThemePreference(theme: Theme): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Unable to save theme to localStorage:', error);
    }
  }
}