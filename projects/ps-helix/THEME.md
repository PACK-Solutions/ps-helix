# Theme Customization Guide

This guide explains how to customize the colors and theme of the Helix Design System in your application.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Theme Service](#theme-service)
- [Custom Colors with Injection Token](#custom-colors-with-injection-token)
- [Available CSS Variables](#available-css-variables)
- [Dynamic Color Changes](#dynamic-color-changes)
- [Examples](#examples)

## Overview

The Helix Design System uses a sophisticated theming system that supports:

- Light and dark themes
- Custom primary and secondary colors
- Automatic color variant generation (lighter, darker)
- Automatic text color calculation for accessibility
- Dynamic theme switching at runtime

## Quick Start

### Basic Theme Switching

Import and use the `ThemeService` to toggle between light and dark themes:

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from 'ps-helix';

@Component({
  selector: 'app-root',
  standalone: true,
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
- `updateTheme(name: Theme)` - Update theme by name ('light' or 'dark')
- `applyInsurerTheme()` - Apply custom colors (usually called automatically)

### Computed Signals

- `themeName()` - Returns current theme name ('light' or 'dark')
- `isDarkTheme()` - Returns boolean indicating if dark theme is active
- `themeInfo()` - Returns complete theme information including last change date

## Default Colors

If you don't provide custom colors, the design system uses the following default theme colors:

- **Primary Color**: `#0F02C4` (Deep Blue)
- **Secondary Color**: `#7B3AEC` (Purple)

These colors are used across all components and automatically generate variants (lighter/darker shades) and accessible text colors.

## Custom Colors with Injection Token

To customize the primary and secondary colors of your design system to match your brand, you need to provide a service that implements the color interface using Angular's dependency injection system.

### Why Not Just CSS Variables?

The design system uses an **injection token system** instead of simple CSS variable overrides because:

1. Colors are dynamically calculated with variants (lighter, darker, etc.)
2. Text colors are automatically determined based on background luminance for accessibility
3. Changes can be reactive and propagate through the application
4. It provides type safety and better Angular integration

### Step 1: Create a Theme Context Service

Create a service in your application that implements the `InsurerContextService` interface:

```typescript
// src/app/services/app-theme-context.service.ts
import { Injectable, signal } from '@angular/core';
import { InsurerContextService } from 'ps-helix';

@Injectable({
  providedIn: 'root'
})
export class AppThemeContextService implements InsurerContextService {
  // Define your custom colors using signals for reactivity
  private primaryColorSignal = signal('#FF0000');    // Your primary color
  private secondaryColorSignal = signal('#00AA00');  // Your secondary color

  // Expose as readonly signals - required by InsurerContextService interface
  primaryColor = this.primaryColorSignal.asReadonly();
  secondaryColor = this.secondaryColorSignal.asReadonly();

  // Optional: Methods to change colors dynamically
  setPrimaryColor(color: string) {
    this.primaryColorSignal.set(color);
  }

  setSecondaryColor(color: string) {
    this.secondaryColorSignal.set(color);
  }
}
```

The `InsurerContextService` interface requires two methods:
- `primaryColor(): string` - Returns the primary brand color
- `secondaryColor(): string` - Returns the secondary brand color

### Step 2: Provide the Service with the Injection Token

In your application configuration (usually `app.config.ts` or `main.ts`), provide your service using the `INSURER_CONTEXT_SERVICE` token:

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { INSURER_CONTEXT_SERVICE } from 'ps-helix';
import { AppThemeContextService } from './services/app-theme-context.service';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Connect your service to the design system's injection token
    {
      provide: INSURER_CONTEXT_SERVICE,
      useExisting: AppThemeContextService
    }
  ]
};
```

### Step 3: Initialize the Theme (Optional)

In your root component, you can inject the `ThemeService` to ensure the theme is applied:

```typescript
// src/app/app.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from 'ps-helix';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet />`
})
export class AppComponent implements OnInit {
  private themeService = inject(ThemeService);

  ngOnInit() {
    // Theme is applied automatically, but you can force it if needed
    this.themeService.applyInsurerTheme();
  }
}
```

### Alternative: Simple Non-Reactive Service

If you don't need dynamic color changes, you can use a simpler implementation without signals:

```typescript
import { Injectable } from '@angular/core';
import { InsurerContextService } from 'ps-helix';

@Injectable({
  providedIn: 'root'
})
export class AppThemeContextService implements InsurerContextService {
  primaryColor() {
    return '#FF0000';
  }

  secondaryColor() {
    return '#00AA00';
  }
}
```

This approach returns static colors and is perfect when you don't need runtime color changes.

## Available CSS Variables

Once configured, the `ThemeService` automatically generates the following CSS variables:

### Primary Color Variables

- `--insurer-primary-color` - Your primary color
- `--insurer-primary-color-light` - Lightened by 20%
- `--insurer-primary-color-lighter` - Lightened by 40%
- `--insurer-primary-color-dark` - Darkened by 20%
- `--insurer-primary-color-darker` - Darkened by 40%
- `--insurer-primary-color-text` - Calculated text color (black or white) for accessibility
- `--insurer-primary-color-rgb` - RGB values for transparency usage

### Secondary Color Variables

- `--insurer-secondary-color`
- `--insurer-secondary-color-light`
- `--insurer-secondary-color-lighter`
- `--insurer-secondary-color-dark`
- `--insurer-secondary-color-darker`
- `--insurer-secondary-color-text`
- `--insurer-secondary-color-rgb`

### Component Usage

These variables are automatically used by design system components through fallback chains:

```css
/* Example from the design system */
--primary-color: var(--insurer-primary-color, #1002C5);
--primary-color-light: var(--insurer-primary-color-light, #8080FF);
```

If you provide a custom color through the injection token, it takes precedence. Otherwise, the default color is used.

### Using in Your Custom Styles

You can also use these variables in your own components:

```css
.my-custom-button {
  background-color: var(--primary-color);
  color: var(--primary-color-text);
}

.my-custom-button:hover {
  background-color: var(--primary-color-light);
}
```

## Dynamic Color Changes

Since the theme context service uses signals, you can change colors dynamically at runtime:

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from 'ps-helix';
import { AppThemeContextService } from './services/app-theme-context.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  template: `
    <div>
      <button (click)="setRedTheme()">Red Theme</button>
      <button (click)="setBlueTheme()">Blue Theme</button>
      <button (click)="setGreenTheme()">Green Theme</button>
    </div>
  `
})
export class ThemeSwitcherComponent {
  private themeContext = inject(AppThemeContextService);
  private themeService = inject(ThemeService);

  setRedTheme() {
    this.themeContext.setPrimaryColor('#DC2626');
    this.themeContext.setSecondaryColor('#EF4444');
    this.themeService.applyInsurerTheme();
  }

  setBlueTheme() {
    this.themeContext.setPrimaryColor('#2563EB');
    this.themeContext.setSecondaryColor('#3B82F6');
    this.themeService.applyInsurerTheme();
  }

  setGreenTheme() {
    this.themeContext.setPrimaryColor('#16A34A');
    this.themeContext.setSecondaryColor('#22C55E');
    this.themeService.applyInsurerTheme();
  }
}
```

## Examples

### Example 1: Brand Colors from Configuration

Load colors from a configuration file or environment:

```typescript
import { Injectable, signal } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppThemeContextService {
  private primaryColorSignal = signal(environment.brandPrimaryColor);
  private secondaryColorSignal = signal(environment.brandSecondaryColor);

  primaryColor = this.primaryColorSignal.asReadonly();
  secondaryColor = this.secondaryColorSignal.asReadonly();
}
```

### Example 2: User-Selected Theme

Allow users to customize their theme:

```typescript
import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppThemeContextService {
  private primaryColorSignal = signal(this.loadFromStorage('primaryColor', '#1002C5'));
  private secondaryColorSignal = signal(this.loadFromStorage('secondaryColor', '#7B3AEC'));

  primaryColor = this.primaryColorSignal.asReadonly();
  secondaryColor = this.secondaryColorSignal.asReadonly();

  constructor() {
    // Save to localStorage when colors change
    effect(() => {
      localStorage.setItem('primaryColor', this.primaryColorSignal());
      localStorage.setItem('secondaryColor', this.secondaryColorSignal());
    });
  }

  setPrimaryColor(color: string) {
    this.primaryColorSignal.set(color);
  }

  setSecondaryColor(color: string) {
    this.secondaryColorSignal.set(color);
  }

  private loadFromStorage(key: string, defaultValue: string): string {
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch {
      return defaultValue;
    }
  }
}
```

### Example 3: Multi-Tenant Application

Different colors per tenant/client:

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

@Injectable({
  providedIn: 'root'
})
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

### Colors Not Applying

1. **Check if the service is provided correctly**: Verify that you've provided your service with the `INSURER_CONTEXT_SERVICE` token in your app config.

2. **Check the console**: The `ThemeService` logs information about color application. Look for messages like:
   ```
   Applying theme colors: { primaryColor: '#FF0000', ... }
   Applied insurer theme with primary color: #FF0000
   ```

3. **Verify the service implementation**: Make sure your service has `primaryColor()` and `secondaryColor()` methods that return strings.

### Default Colors Showing Instead of Custom Colors

If you see the default blue colors (`#1002C5`) instead of your custom colors:

1. The service might not be injected properly
2. The methods might not be returning valid hex color codes
3. Check the browser console for error messages

### Colors Not Updating Dynamically

If colors don't update when you call `setPrimaryColor()`:

1. Make sure you're calling `this.themeService.applyInsurerTheme()` after changing the colors
2. Verify that your signals are updating correctly
3. Check that the ThemeService is injected in your component

## Best Practices

1. **Use Signals**: Always use Angular signals for reactive color management
2. **Validate Colors**: Ensure color values are valid hex codes (e.g., `#FF0000`)
3. **Accessibility**: Let the ThemeService calculate text colors automatically for proper contrast
4. **Persistence**: Consider saving user color preferences to localStorage
5. **Defaults**: Always provide sensible default colors as fallbacks
6. **Documentation**: Document your color choices and brand guidelines

## Related Documentation

- [Component Documentation](./README.md)
- [Translation Guide](./lib/services/translation/README.md)
- [Accessibility Guidelines](./ACCESSIBILITY.md)
