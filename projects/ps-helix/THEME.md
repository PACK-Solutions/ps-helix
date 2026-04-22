# Theme Customization Guide

This guide explains how to customize the colors and theme of the Helix Design System in your application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Theme Service](#theme-service)
- [Custom Colors with Injection Token](#custom-colors-with-injection-token)
- [Accessibility Safeguard (WCAG)](#accessibility-safeguard-wcag)
- [Available CSS Variables](#available-css-variables)
- [Dynamic Color Changes](#dynamic-color-changes)
- [Examples](#examples)

## Overview

The Helix Design System uses a signal-based theming system that supports:

- Light and dark themes
- Custom primary and secondary brand colors (customer context)
- Automatic variant generation in OKLCH (hue and chroma preserved, lightness adjusted per mode)
- WCAG contrast safeguard: a brand color that does not meet the target contrast ratio against the current theme background is silently adjusted before being applied to UI components
- Dynamic theme switching at runtime
- Theme preference persistence in `localStorage` (key: `helix-theme-preference`)

## Quick Start

### Basic Theme Switching

Import and use the `ThemeService` to toggle between light and dark themes:

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from 'ps-helix';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="toggleTheme()">
      Current theme: {{ themeService.themeName() }}
    </button>
  `
})
export class AppComponent {
  themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
```

## Theme Service

The `ThemeService` provides the following API:

### Methods

- `setDarkTheme(isDark: boolean)` - Set the theme to dark or light
- `toggleTheme()` - Toggle between light and dark themes
- `updateTheme(name: Theme)` - Update theme by name (`'light'` or `'dark'`) and persist it in localStorage
- `applyCustomerTheme()` - Re-apply brand colors from the customer context (usually called automatically after theme changes or when the context updates)

### Computed Signals

- `themeName()` - Returns current theme name (`'light'` or `'dark'`)
- `isDarkTheme()` - Returns a boolean indicating whether dark theme is active
- `themeInfo()` - Returns complete theme information including the last change date

### Types

```typescript
export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  isDark: boolean;
  name: Theme;
  customerTheme?: {
    primaryColor: string;
    secondaryColor?: string;
  };
}
```

## Default Colors

If you don't provide custom colors, the design system falls back to the CSS defaults defined in the theme files:

- Light mode primary: `#0B0191`
- Dark mode primary: `#8178F7`
- Light mode secondary: `#5E5E5E`
- Dark mode secondary: `#5B5A5A`

These defaults are defined in `projects/ps-helix/src/lib/styles/themes/light.css` and `dark.css`.

## Custom Colors with Injection Token

To customize the primary and secondary colors of your design system to match your brand, provide a service that implements `CustomerContextService` through the `CUSTOMER_CONTEXT_SERVICE` injection token.

### Why an Injection Token and not just CSS variables?

1. Variants (light, lighter, dark, darker) are computed in OKLCH at runtime and depend on the current theme (light vs dark).
2. Text color on top of brand colors is computed from real WCAG contrast ratios.
3. Brand colors are verified against a minimum contrast ratio and silently adjusted for UI usage when needed; the original color is still exposed as `-source` for decorative contexts.
4. The token keeps everything type-safe and reactive via Angular DI.

### Step 1: Create a Customer Context Service

```typescript
// src/app/services/app-theme-context.service.ts
import { Injectable, signal } from '@angular/core';
import { CustomerContextService } from 'ps-helix';

@Injectable({ providedIn: 'root' })
export class AppThemeContextService implements CustomerContextService {
  private primaryColorSignal = signal('#FF0000');
  private secondaryColorSignal = signal('#00AA00');

  primaryColor = this.primaryColorSignal.asReadonly();
  secondaryColor = this.secondaryColorSignal.asReadonly();

  setPrimaryColor(color: string) {
    this.primaryColorSignal.set(color);
  }

  setSecondaryColor(color: string) {
    this.secondaryColorSignal.set(color);
  }
}
```

The `CustomerContextService` interface requires two methods:

- `primaryColor(): string` - Returns the primary brand color (hex)
- `secondaryColor(): string` - Returns the secondary brand color (hex)

### Step 2: Provide the Service with the Injection Token

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { CUSTOMER_CONTEXT_SERVICE } from 'ps-helix';
import { AppThemeContextService } from './services/app-theme-context.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: CUSTOMER_CONTEXT_SERVICE,
      useExisting: AppThemeContextService
    }
  ]
};
```

### Step 3: Re-apply the Theme (Optional)

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from 'ps-helix';

@Component({
  selector: 'app-root',
  template: `<router-outlet />`
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit() {
    this.themeService.applyCustomerTheme();
  }
}
```

### Alternative: Simple Non-Reactive Service

```typescript
import { Injectable } from '@angular/core';
import { CustomerContextService } from 'ps-helix';

@Injectable({ providedIn: 'root' })
export class AppThemeContextService implements CustomerContextService {
  primaryColor() { return '#FF0000'; }
  secondaryColor() { return '#00AA00'; }
}
```

## Accessibility Safeguard (WCAG)

When `applyCustomerTheme()` runs, each brand color is evaluated against the current theme background:

- Contrast is computed using the true WCAG 2.1 relative luminance formula.
- If the ratio is below the target (AA by default, AAA if configured), the color is adjusted in OKLCH: the luminance is shifted (darker on light backgrounds, lighter on dark backgrounds) while hue and chroma are preserved as much as possible.
- The adjusted color is written into `--customer-primary-color` / `--customer-secondary-color` and consumed by every UI component.
- The original, unmodified brand color is written into `--customer-primary-color-source` / `--customer-secondary-color-source`, available for decorative surfaces (logos, marketing images) where the contrast rule does not apply.
- The service never logs or warns: the adjustment is silent by design.

### Configuring the Target Ratio

Use the `PSH_THEME_OPTIONS` injection token to opt into AAA:

```typescript
import { PSH_THEME_OPTIONS, PshThemeOptions } from 'ps-helix';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: PSH_THEME_OPTIONS,
      useValue: { targetContrast: 'AAA' } satisfies PshThemeOptions
    }
  ]
};
```

Default is `'AA'` (ratio 4.5:1). `'AAA'` raises the requirement to 7:1.

### OKLCH Variant Derivation

The four tonal variants (`light`, `lighter`, `dark`, `darker`) are generated by shifting the OKLCH lightness of the accessible base color with mode-aware deltas:

| Mode  | light | lighter | dark  | darker |
|-------|-------|---------|-------|--------|
| Light | +0.08 | +0.18   | -0.08 | -0.16  |
| Dark  | +0.06 | +0.14   | -0.06 | -0.14  |

Hue and chroma are preserved so the color palette stays perceptually consistent. Fixed percentage RGB lightening/darkening is no longer used.

## Available CSS Variables

Once configured, `ThemeService` writes the following CSS variables on `:root`:

### Primary Color Variables

- `--customer-primary-color` - Accessibility-adjusted primary color (used by components)
- `--customer-primary-color-source` - Original brand color, unmodified (for decorative use only)
- `--customer-primary-color-light` - OKLCH-derived lighter variant
- `--customer-primary-color-lighter` - OKLCH-derived extra light variant
- `--customer-primary-color-dark` - OKLCH-derived darker variant
- `--customer-primary-color-darker` - OKLCH-derived extra dark variant
- `--customer-primary-color-text` - Readable text color (black or white) picked via WCAG contrast against the adjusted primary
- `--customer-primary-color-rgb` - `r, g, b` triplet of the adjusted primary for `rgba()` usage

### Secondary Color Variables

- `--customer-secondary-color`
- `--customer-secondary-color-source`
- `--customer-secondary-color-light`
- `--customer-secondary-color-lighter`
- `--customer-secondary-color-dark`
- `--customer-secondary-color-darker`
- `--customer-secondary-color-text`
- `--customer-secondary-color-rgb`

### Component Usage

Design system components consume the stable abstract variables, which fall back to the defaults when no customer context is provided:

```css
/* From projects/ps-helix/src/lib/styles/themes/light.css */
--primary-color: var(--customer-primary-color, #0B0191);
--primary-color-light: var(--customer-primary-color-light, #0F02C4);
```

### Using in Your Custom Styles

Use the abstract variables (`--primary-color`, `--secondary-color`, ...) in your own components so you automatically inherit the accessibility-adjusted palette:

```css
.my-custom-button {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}

.my-custom-button:hover {
  background-color: var(--primary-color-light);
}
```

For decorative brand elements that must match the literal brand color (e.g. a logo background), use the `-source` variable:

```css
.brand-logo-surface {
  background-color: var(--customer-primary-color-source);
}
```

## Dynamic Color Changes

Since the customer context service uses signals, you can change colors at runtime:

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from 'ps-helix';
import { AppThemeContextService } from './services/app-theme-context.service';

@Component({
  selector: 'app-theme-switcher',
  template: `
    <button (click)="setRedTheme()">Red</button>
    <button (click)="setBlueTheme()">Blue</button>
    <button (click)="setGreenTheme()">Green</button>
  `
})
export class ThemeSwitcherComponent {
  private themeContext = inject(AppThemeContextService);
  private themeService = inject(ThemeService);

  setRedTheme() {
    this.themeContext.setPrimaryColor('#DC2626');
    this.themeContext.setSecondaryColor('#EF4444');
    this.themeService.applyCustomerTheme();
  }

  setBlueTheme() {
    this.themeContext.setPrimaryColor('#2563EB');
    this.themeContext.setSecondaryColor('#3B82F6');
    this.themeService.applyCustomerTheme();
  }

  setGreenTheme() {
    this.themeContext.setPrimaryColor('#16A34A');
    this.themeContext.setSecondaryColor('#22C55E');
    this.themeService.applyCustomerTheme();
  }
}
```

## Examples

### Example 1: Brand Colors from Configuration

```typescript
import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AppThemeContextService {
  private primaryColorSignal = signal(environment.brandPrimaryColor);
  private secondaryColorSignal = signal(environment.brandSecondaryColor);

  primaryColor = this.primaryColorSignal.asReadonly();
  secondaryColor = this.secondaryColorSignal.asReadonly();
}
```

### Example 2: User-Selected Theme

```typescript
import { Injectable, signal, effect } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AppThemeContextService {
  private primaryColorSignal = signal(this.loadFromStorage('primaryColor', '#0B0191'));
  private secondaryColorSignal = signal(this.loadFromStorage('secondaryColor', '#5E5E5E'));

  primaryColor = this.primaryColorSignal.asReadonly();
  secondaryColor = this.secondaryColorSignal.asReadonly();

  constructor() {
    effect(() => {
      localStorage.setItem('primaryColor', this.primaryColorSignal());
      localStorage.setItem('secondaryColor', this.secondaryColorSignal());
    });
  }

  setPrimaryColor(color: string) { this.primaryColorSignal.set(color); }
  setSecondaryColor(color: string) { this.secondaryColorSignal.set(color); }

  private loadFromStorage(key: string, defaultValue: string): string {
    try { return localStorage.getItem(key) || defaultValue; }
    catch { return defaultValue; }
  }
}
```

### Example 3: Multi-Tenant Application

```typescript
import { Injectable, signal } from '@angular/core';

interface TenantTheme {
  primary: string;
  secondary: string;
}

const TENANT_THEMES: Record<string, TenantTheme> = {
  'tenant-a': { primary: '#DC2626', secondary: '#EF4444' },
  'tenant-b': { primary: '#2563EB', secondary: '#3B82F6' },
  'tenant-c': { primary: '#16A34A', secondary: '#22C55E' }
};

@Injectable({ providedIn: 'root' })
export class AppThemeContextService {
  private currentTenantId = signal<string>('tenant-a');
  private primaryColorSignal = signal(TENANT_THEMES['tenant-a'].primary);
  private secondaryColorSignal = signal(TENANT_THEMES['tenant-a'].secondary);

  primaryColor = this.primaryColorSignal.asReadonly();
  secondaryColor = this.secondaryColorSignal.asReadonly();

  setTenant(tenantId: string) {
    const theme = TENANT_THEMES[tenantId];
    if (theme) {
      this.currentTenantId.set(tenantId);
      this.primaryColorSignal.set(theme.primary);
      this.secondaryColorSignal.set(theme.secondary);
    }
  }
}
```

## Troubleshooting

### Colors not applying

1. Verify that your service is provided with the `CUSTOMER_CONTEXT_SERVICE` token in your app config.
2. Confirm your service implements `primaryColor()` and `secondaryColor()` returning valid hex strings.
3. `ThemeService` is silent by design; if a brand color looks different from the one you provided, it is because the WCAG safeguard adjusted it. Read the adjusted color via `getComputedStyle(document.documentElement).getPropertyValue('--customer-primary-color')` and the original via `--customer-primary-color-source`.

### Default colors showing instead of custom colors

- The context service is not provided, or
- `primaryColor()` / `secondaryColor()` return an invalid hex string.

### Colors not updating dynamically

1. Make sure you call `this.themeService.applyCustomerTheme()` after changing a color.
2. Verify that your signals are actually updating.
3. Confirm `ThemeService` is injected in the component driving the change.

## Best Practices

1. Use signals in your customer context service for reactivity.
2. Provide valid hex colors (`#RRGGBB`).
3. Trust the WCAG safeguard; do not hand-tune base colors for contrast.
4. For decorative brand surfaces, use `--customer-*-color-source`. For every other UI use case, use the abstract variables (`--primary-color`, ...).
5. Persist user preferences in `localStorage` when relevant.
6. Document brand color choices alongside your app's style guide.

## Related Documentation

- [Component Documentation](./README.md)
- [Translation Guide](./lib/services/translation/README.md)
