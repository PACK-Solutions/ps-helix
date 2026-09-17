import { TestBed } from '@angular/core/testing';

import { CUSTOMER_CONTEXT_SERVICE, PSH_THEME_OPTIONS, ThemeService } from './theme.service';
import { contrastRatio, hexToRgb } from './utils/color.utils';
import { WCAG_AAA_NORMAL, WCAG_AA_NORMAL } from './utils/wcag.utils';

/**
 * The largest file in the library, and until now the least tested: `ssr-safety.spec` touched
 * it twice, from the side. It decides what `data-theme` says, what a brand colour becomes
 * after the contrast guard has had it, and what survives a reload.
 */
const STORAGE_KEY = 'helix-theme-preference';

class BrandService {
  primary = '#8ab4f8';
  secondary = '#ffd166';
  primaryColor() {
    return this.primary;
  }
  secondaryColor() {
    return this.secondary;
  }
}

function cssVar(name: string): string {
  return document.documentElement.style.getPropertyValue(name).trim();
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
    document.documentElement.removeAttribute('style');
    TestBed.resetTestingModule();
  });

  describe('the theme it lands on', () => {
    it('follows a stored preference over anything else', () => {
      localStorage.setItem(STORAGE_KEY, 'dark');
      TestBed.configureTestingModule({});

      expect(TestBed.inject(ThemeService).themeName()).toBe('dark');
    });

    it('falls back to the OS preference when nothing is stored', () => {
      const original = window.matchMedia;
      window.matchMedia = ((query: string) => ({
        matches: query.includes('dark'),
        media: query,
        addEventListener: () => {},
        removeEventListener: () => {},
      })) as unknown as typeof window.matchMedia;

      TestBed.configureTestingModule({});
      expect(TestBed.inject(ThemeService).isDarkTheme()).toBe(true);

      window.matchMedia = original;
    });

    it('survives a localStorage that throws, which private browsing does', () => {
      const getItem = Storage.prototype.getItem;
      Storage.prototype.getItem = () => {
        throw new DOMException('denied');
      };

      TestBed.configureTestingModule({});
      expect(() => TestBed.inject(ThemeService).themeName()).not.toThrow();

      Storage.prototype.getItem = getItem;
    });
  });

  describe('changing it', () => {
    it('writes data-theme, which is what the stylesheets read', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(ThemeService);

      service.setDarkTheme(true);
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

      service.setDarkTheme(false);
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });

    it('toggleTheme goes back and forth', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(ThemeService);
      const before = service.isDarkTheme();

      service.toggleTheme();
      expect(service.isDarkTheme()).toBe(!before);
      service.toggleTheme();
      expect(service.isDarkTheme()).toBe(before);
    });

    it('updateTheme is the one that remembers', () => {
      TestBed.configureTestingModule({});
      const service = TestBed.inject(ThemeService);

      service.updateTheme('dark');
      expect(localStorage.getItem(STORAGE_KEY)).toBe('dark');
      expect(service.themeInfo().isDark).toBe(true);
    });
  });

  describe('the brand colours it is given', () => {
    function withBrand(brand: BrandService, contrast?: 'AA' | 'AAA') {
      TestBed.configureTestingModule({
        providers: [
          { provide: CUSTOMER_CONTEXT_SERVICE, useValue: brand },
          ...(contrast ? [{ provide: PSH_THEME_OPTIONS, useValue: { targetContrast: contrast } }] : []),
        ],
      });
      const service = TestBed.inject(ThemeService);
      service.applyCustomerTheme();
      return service;
    }

    it('publishes them as custom properties', () => {
      withBrand(new BrandService());
      expect(cssVar('--customer-primary-color')).toBeTruthy();
      expect(cssVar('--customer-secondary-color')).toBeTruthy();
    });

    it('keeps the colour it was given, untouched, for decoration', () => {
      const brand = new BrandService();
      withBrand(brand);

      // The UI colour may be darkened to stay readable; a logo must not be.
      expect(cssVar('--customer-primary-color-source')).toBe(brand.primary);
    });

    it('raises a colour that could not be read on the light background', () => {
      // #8ab4f8 is a pale blue: pleasant as a brand, unreadable as a UI colour on white.
      const brand = new BrandService();
      withBrand(brand);

      const applied = hexToRgb(cssVar('--customer-primary-color'))!;
      expect(contrastRatio(applied, { r: 255, g: 255, b: 255 })).toBeGreaterThanOrEqual(
        WCAG_AA_NORMAL,
      );
      expect(cssVar('--customer-primary-color')).not.toBe(brand.primary);
    });

    it('honours an AAA target when one is configured', () => {
      withBrand(new BrandService(), 'AAA');

      const applied = hexToRgb(cssVar('--customer-primary-color'))!;
      expect(contrastRatio(applied, { r: 255, g: 255, b: 255 })).toBeGreaterThanOrEqual(
        WCAG_AAA_NORMAL,
      );
    });

    it('does nothing at all without a customer context', () => {
      TestBed.configureTestingModule({});
      TestBed.inject(ThemeService).applyCustomerTheme();

      expect(cssVar('--customer-primary-color')).toBe('');
    });
  });
});
