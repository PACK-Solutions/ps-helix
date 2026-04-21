import {
  Injectable,
  InjectionToken,
  effect,
  inject,
  isDevMode,
  signal,
  computed,
  untracked,
} from '@angular/core';
import { Theme } from './types/theme.types';
import { contrastRatio, parseColor, wcagLevel, type WcagLevel } from '../../utils/contrast.util';
import {
  adjustLightnessForContrast,
  deriveVariant,
  pickReadableText,
} from '../../utils/color-math.util';

const THEME_STORAGE_KEY = 'helix-theme-preference';

/**
 * Minimum contrast ratios enforced on every generated token.
 * Aligned with WCAG 2.1 AA (EN 301 549 / RGAA reference): 4.5:1 for normal
 * text, 3:1 for large text and non-text UI components.
 */
const WCAG_AA_TEXT = 4.5;
const WCAG_AA_UI = 3;

/** Surface reference used to validate contrast per theme. */
const THEME_SURFACE: Record<Theme, string> = {
  light: '#FFFFFF',
  dark: '#0A0D16',
};

/**
 * Lightness deltas (percentage points) applied to the adjusted base color to
 * produce the four light/lighter/dark/darker variants. Tuned per theme so the
 * hover states remain visible and the filled backgrounds keep their text
 * legibility.
 */
const VARIANT_DELTAS: Record<Theme, { light: number; lighter: number; dark: number; darker: number }> = {
  light: { light: 10, lighter: 20, dark: -15, darker: -30 },
  dark: { light: 15, lighter: 30, dark: -10, darker: -20 },
};

export interface CustomerContextService {
  primaryColor(): string;
  secondaryColor(): string;
}

/** @deprecated Use {@link CustomerContextService}. */
export type InsurerContextService = CustomerContextService;

export const CUSTOMER_CONTEXT_SERVICE = new InjectionToken<CustomerContextService>(
  'CUSTOMER_CONTEXT_SERVICE',
);

/** @deprecated Use {@link CUSTOMER_CONTEXT_SERVICE}. */
export const INSURER_CONTEXT_SERVICE = CUSTOMER_CONTEXT_SERVICE;

export interface TokenAudit {
  name: string;
  value: string;
  ratio: number;
  level: WcagLevel;
  target: number;
  passes: boolean;
}

export interface PaletteAudit {
  base: TokenAudit;
  text: TokenAudit;
  variants: TokenAudit[];
}

export interface ContrastReport {
  theme: Theme;
  primary: PaletteAudit | null;
  secondary: PaletteAudit | null;
  allPassAA: boolean;
  generatedAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private customerContext =
    inject(CUSTOMER_CONTEXT_SERVICE, { optional: true }) ??
    inject(INSURER_CONTEXT_SERVICE, { optional: true });

  private isDarkThemeSignal = signal<boolean>(false);
  private themeNameSignal = signal<Theme>('light');
  private lastChangeSignal = signal<Date>(new Date());
  private contrastReportSignal = signal<ContrastReport | null>(null);

  isDarkTheme = computed(() => this.isDarkThemeSignal());
  themeName = computed(() => this.themeNameSignal());
  contrastReport = computed(() => this.contrastReportSignal());

  themeInfo = computed(() => ({
    isDark: this.isDarkTheme(),
    name: this.themeName(),
    lastChange: this.lastChangeSignal(),
  }));

  constructor() {
    this.initializeTheme();
    effect(() => {
      this.themeNameSignal();
      untracked(() => this.applyCustomerTheme());
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

  updateTheme(name: Theme) {
    this.themeNameSignal.set(name);
    this.isDarkThemeSignal.set(name === 'dark');
    this.lastChangeSignal.set(new Date());
    this.saveThemePreference(name);
  }

  /**
   * Regenerates every customer-branded CSS variable for the current theme,
   * forcing each token to meet WCAG AA against the theme surface. Emits a
   * ContrastReport signal describing the final values.
   */
  applyCustomerTheme(): void {
    const theme = this.themeName();
    if (!this.customerContext) {
      this.contrastReportSignal.set(null);
      return;
    }
    const primary = this.customerContext.primaryColor();
    const secondary = this.customerContext.secondaryColor();
    const primaryAudit = primary ? this.applyPalette('primary', primary, theme) : null;
    const secondaryAudit = secondary ? this.applyPalette('secondary', secondary, theme) : null;
    const report: ContrastReport = {
      theme,
      primary: primaryAudit,
      secondary: secondaryAudit,
      allPassAA: this.allPass(primaryAudit) && this.allPass(secondaryAudit),
      generatedAt: new Date(),
    };
    this.contrastReportSignal.set(report);
    if (isDevMode() && !report.allPassAA) {
      const failures = [primaryAudit, secondaryAudit]
        .filter((p): p is PaletteAudit => !!p)
        .flatMap((p) => [p.base, p.text, ...p.variants])
        .filter((t) => !t.passes);
      console.warn('[ThemeService] Customer theme under WCAG AA:', failures);
    }
  }

  /**
   * Computes the palette for `hex` without persisting it. Useful for
   * previewing a brand color before onboarding it.
   */
  previewCustomerTheme(primary: string, secondary?: string): ContrastReport {
    const theme = this.themeName();
    const primaryAudit = this.applyPalette('primary', primary, theme);
    const secondaryAudit = secondary ? this.applyPalette('secondary', secondary, theme) : null;
    const report: ContrastReport = {
      theme,
      primary: primaryAudit,
      secondary: secondaryAudit,
      allPassAA: this.allPass(primaryAudit) && this.allPass(secondaryAudit),
      generatedAt: new Date(),
    };
    this.contrastReportSignal.set(report);
    return report;
  }

  /** @deprecated Use {@link applyCustomerTheme}. */
  applyInsurerTheme(): void {
    this.applyCustomerTheme();
  }

  private applyPalette(kind: 'primary' | 'secondary', hex: string, theme: Theme): PaletteAudit {
    const surface = THEME_SURFACE[theme];
    const direction = theme === 'dark' ? 'lighten' : 'darken';

    const baseAdjust = adjustLightnessForContrast(hex, surface, WCAG_AA_TEXT, direction);
    const base = baseAdjust.hex;
    const text = pickReadableText(base).hex;

    const deltas = VARIANT_DELTAS[theme];
    const variants = {
      light: this.clampVariantForText(deriveVariant(base, deltas.light), surface, direction),
      lighter: this.clampVariantForText(deriveVariant(base, deltas.lighter), surface, direction),
      dark: this.clampVariantForFill(deriveVariant(base, deltas.dark), text),
      darker: this.clampVariantForFill(deriveVariant(base, deltas.darker), text),
    };

    const rgb = parseColor(base);
    const rgbString = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : null;
    const root = document.documentElement.style;
    root.setProperty(`--customer-${kind}-color`, base);
    root.setProperty(`--customer-${kind}-color-light`, variants.light);
    root.setProperty(`--customer-${kind}-color-lighter`, variants.lighter);
    root.setProperty(`--customer-${kind}-color-dark`, variants.dark);
    root.setProperty(`--customer-${kind}-color-darker`, variants.darker);
    root.setProperty(`--customer-${kind}-color-text`, text);
    if (rgbString) {
      root.setProperty(`--customer-${kind}-color-rgb`, rgbString);
    }

    return {
      base: this.auditToken(`--customer-${kind}-color`, base, surface, WCAG_AA_TEXT),
      text: this.auditToken(`--customer-${kind}-color-text`, text, base, WCAG_AA_TEXT),
      variants: [
        this.auditToken(`--customer-${kind}-color-light`, variants.light, surface, WCAG_AA_TEXT),
        this.auditToken(`--customer-${kind}-color-lighter`, variants.lighter, surface, WCAG_AA_TEXT),
        this.auditToken(`--customer-${kind}-color-dark`, variants.dark, text, WCAG_AA_UI),
        this.auditToken(`--customer-${kind}-color-darker`, variants.darker, text, WCAG_AA_UI),
      ],
    };
  }

  private clampVariantForText(
    candidate: string,
    surface: string,
    direction: 'lighten' | 'darken',
  ): string {
    return adjustLightnessForContrast(candidate, surface, WCAG_AA_TEXT, direction).hex;
  }

  private clampVariantForFill(candidate: string, textHex: string): string {
    const rgb = parseColor(candidate);
    const text = parseColor(textHex);
    if (!rgb || !text) return candidate;
    const ratio = contrastRatio(text, rgb);
    if (ratio >= WCAG_AA_TEXT) return candidate;
    const direction = textHex === '#0A0D16' ? 'lighten' : 'darken';
    return adjustLightnessForContrast(candidate, textHex, WCAG_AA_TEXT, direction).hex;
  }

  private auditToken(name: string, value: string, against: string, target: number): TokenAudit {
    const fg = parseColor(value);
    const bg = parseColor(against);
    if (!fg || !bg) {
      return { name, value, ratio: 0, level: 'Fail', target, passes: false };
    }
    const ratio = contrastRatio(fg, bg);
    return {
      name,
      value,
      ratio,
      level: wcagLevel(ratio),
      target,
      passes: ratio >= target,
    };
  }

  private allPass(audit: PaletteAudit | null): boolean {
    if (!audit) return true;
    return audit.base.passes && audit.text.passes && audit.variants.every((v) => v.passes);
  }

  private initializeTheme(): void {
    let savedTheme: Theme | null = null;
    try {
      savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme;
    } catch (error) {
      console.warn('Unable to read theme from localStorage:', error);
    }
    const isValidTheme = savedTheme === 'light' || savedTheme === 'dark';
    const themeToApply = isValidTheme ? savedTheme : 'light';
    this.setDarkTheme(themeToApply === 'dark');
  }

  private saveThemePreference(theme: Theme): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Unable to save theme to localStorage:', error);
    }
  }
}
