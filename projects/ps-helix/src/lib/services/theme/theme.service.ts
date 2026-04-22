import { Injectable, InjectionToken, computed, inject, signal } from '@angular/core';
import { Theme } from './types/theme.types';
import {
  Rgb,
  bestTextColor,
  hexToRgb,
  rgbToHex,
  rgbToOklch,
  oklchToRgb,
  contrastRatio,
} from './utils/color.utils';
import {
  ContrastTarget,
  ensureContrast,
  targetRatio,
  WCAG_AA_NORMAL,
} from './utils/wcag.utils';

const THEME_STORAGE_KEY = 'helix-theme-preference';

/**
 * Contract for applications that want to override brand colors.
 * Kept generic (customer) so it can fit any vertical.
 */
export interface CustomerContextService {
  primaryColor(): string;
  secondaryColor(): string;
}

export const CUSTOMER_CONTEXT_SERVICE = new InjectionToken<CustomerContextService>(
  'CUSTOMER_CONTEXT_SERVICE',
);

export interface PshThemeOptions {
  targetContrast?: ContrastTarget;
}

export const PSH_THEME_OPTIONS = new InjectionToken<PshThemeOptions>('PSH_THEME_OPTIONS');

interface DerivedPalette {
  base: string;
  light: string;
  lighter: string;
  dark: string;
  darker: string;
  text: string;
  rgb: string;
  source: string;
}

const LIGHT_BACKGROUND: Rgb = { r: 255, g: 255, b: 255 };
const DARK_BACKGROUND: Rgb = { r: 20, g: 20, b: 25 };

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private customerContext = inject(CUSTOMER_CONTEXT_SERVICE, { optional: true });
  private options = inject(PSH_THEME_OPTIONS, { optional: true });

  private isDarkThemeSignal = signal<boolean>(false);
  private themeNameSignal = signal<Theme>('light');
  private lastChangeSignal = signal<Date>(new Date());

  isDarkTheme = computed(() => this.isDarkThemeSignal());
  themeName = computed(() => this.themeNameSignal());

  themeInfo = computed(() => ({
    isDark: this.isDarkTheme(),
    name: this.themeName(),
    lastChange: this.lastChangeSignal(),
  }));

  constructor() {
    this.initializeTheme();
    setTimeout(() => this.applyCustomerTheme(), 0);
  }

  setDarkTheme(isDark: boolean): void {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    this.isDarkThemeSignal.set(isDark);
    this.themeNameSignal.set(isDark ? 'dark' : 'light');
    this.lastChangeSignal.set(new Date());
    this.applyCustomerTheme();
  }

  toggleTheme(): void {
    this.setDarkTheme(!this.isDarkThemeSignal());
  }

  updateTheme(name: Theme): void {
    this.themeNameSignal.set(name);
    this.isDarkThemeSignal.set(name === 'dark');
    this.lastChangeSignal.set(new Date());
    this.saveThemePreference(name);
    this.applyCustomerTheme();
  }

  /**
   * Applies the customer brand colors to CSS variables, automatically
   * deriving variants in OKLCH and enforcing WCAG contrast against the
   * current theme background. If the provided color is not accessible
   * as a UI color, it is silently adjusted so UI components stay readable.
   * The original brand color is preserved in --customer-*-color-source
   * for purely decorative use (logos, marketing surfaces).
   */
  applyCustomerTheme(): void {
    if (!this.customerContext) {
      return;
    }

    const primary = this.customerContext.primaryColor();
    const secondary = this.customerContext.secondaryColor();

    this.applyPalette('primary', primary);
    this.applyPalette('secondary', secondary);
  }

  private applyPalette(kind: 'primary' | 'secondary', color: string | undefined): void {
    if (!color) return;
    const source = hexToRgb(color);
    if (!source) return;

    const palette = this.derivePalette(source);
    const root = document.documentElement.style;
    const prefix = `--customer-${kind}-color`;

    root.setProperty(prefix, palette.base);
    root.setProperty(`${prefix}-source`, palette.source);
    root.setProperty(`${prefix}-light`, palette.light);
    root.setProperty(`${prefix}-lighter`, palette.lighter);
    root.setProperty(`${prefix}-dark`, palette.dark);
    root.setProperty(`${prefix}-darker`, palette.darker);
    root.setProperty(`${prefix}-text`, palette.text);
    root.setProperty(`${prefix}-rgb`, palette.rgb);
  }

  private derivePalette(source: Rgb): DerivedPalette {
    const isDark = this.isDarkThemeSignal();
    const background = isDark ? DARK_BACKGROUND : LIGHT_BACKGROUND;
    const ratio = targetRatio(this.options?.targetContrast ?? 'AA');

    const accessible = ensureContrast(source, background, ratio);

    const { l, c, h } = rgbToOklch(accessible);
    const variants = isDark
      ? {
          light: clampL(l + 0.06),
          lighter: clampL(l + 0.14),
          dark: clampL(l - 0.06),
          darker: clampL(l - 0.14),
        }
      : {
          light: clampL(l + 0.08),
          lighter: clampL(l + 0.18),
          dark: clampL(l - 0.08),
          darker: clampL(l - 0.16),
        };

    const lightColor = oklchToRgb({ l: variants.light, c, h });
    const lighterColor = oklchToRgb({ l: variants.lighter, c, h });
    const darkColor = this.ensureIfInteractive(
      oklchToRgb({ l: variants.dark, c, h }),
      background,
      Math.min(ratio, WCAG_AA_NORMAL),
    );
    const darkerColor = this.ensureIfInteractive(
      oklchToRgb({ l: variants.darker, c, h }),
      background,
      Math.min(ratio, WCAG_AA_NORMAL),
    );

    const text = bestTextColor(accessible);
    const rgb = `${Math.round(accessible.r)}, ${Math.round(accessible.g)}, ${Math.round(accessible.b)}`;

    return {
      base: rgbToHex(accessible),
      source: rgbToHex(source),
      light: rgbToHex(lightColor),
      lighter: rgbToHex(lighterColor),
      dark: rgbToHex(darkColor),
      darker: rgbToHex(darkerColor),
      text,
      rgb,
    };
  }

  private ensureIfInteractive(color: Rgb, background: Rgb, ratio: number): Rgb {
    return contrastRatio(color, background) >= ratio
      ? color
      : ensureContrast(color, background, ratio);
  }

  private initializeTheme(): void {
    let savedTheme: Theme | null = null;
    try {
      savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    } catch {
      savedTheme = null;
    }
    const isValid = savedTheme === 'light' || savedTheme === 'dark';
    this.setDarkTheme((isValid ? savedTheme : 'light') === 'dark');
  }

  private saveThemePreference(theme: Theme): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage unavailable, preference not persisted */
    }
  }
}

function clampL(value: number): number {
  return Math.max(0, Math.min(1, value));
}
