# Helix Design System

A comprehensive Angular component library built with Angular 21+ featuring modern design patterns, accessibility-first development, and optimal developer experience.

[![npm version](https://img.shields.io/badge/npm-3.0.0-blue.svg)](https://www.npmjs.com/package/ps-helix)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-21.0.3-red.svg)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.0-blue.svg)](https://www.typescriptlang.org/)

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
  - [Global Styles](#global-styles)
  - [Phosphor Icons Setup](#phosphor-icons-setup)
  - [Theme Service](#theme-service)
  - [Translation Service](#translation-service)
  - [Scroll Service](#scroll-service)
- [Core Concepts](#core-concepts)
  - [Standalone Components](#standalone-components)
  - [Signal-Based Reactivity](#signal-based-reactivity)
  - [Type Safety](#type-safety)
  - [Dependency Injection](#dependency-injection)
- [Available Components](#available-components)
- [Service APIs](#service-apis)
  - [ThemeService](#themeservice)
  - [ToastService](#toastservice)
  - [ScrollService](#scrollservice)
  - [TranslationService](#translationservice)
- [Exported Types](#exported-types)
- [Theming](#theming)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)
- [Browser Support](#browser-support)
- [Development Scripts](#development-scripts)
- [Contributing](#contributing)
- [License](#license)
- [Resources](#resources)

## Overview

Helix is a production-ready design system that provides:

- **28 Standalone Components** - All components are standalone, no NgModules required
- **Signal-Based Reactivity** - Built with Angular 21 signals for optimal performance
- **Accessibility First** - WCAG 2.1 AA compliant out of the box
- **TypeScript Strict Mode** - Full type safety and IntelliSense support
- **Complete Type Exports** - All component types and enums exported for type-safe development
- **Customizable Theming** - Light/dark modes with brand color customization
- **Phosphor Icons** - 6000+ icons with multiple weight variants
- **i18n Support** - Built-in internationalization with ngx-translate
- **Responsive Design** - Mobile-first approach with comprehensive breakpoint system
- **Modern Architecture** - Built with Angular 21 standalone components and signals

## Prerequisites

Before installing Helix, ensure your development environment meets these requirements:

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Angular**: 21.0.3 or higher
- **Angular CLI**: 21.0.3 or higher
- **TypeScript**: 5.9.0 or higher

### Required Peer Dependencies

```json
{
  "@angular/common": "^21.0.3",
  "@angular/core": "^21.0.3",
  "@angular/forms": "^21.0.3",
  "@ngx-translate/core": "^15.0.0",
  "rxjs": "^7.8.0"
}
```

### Included Dependencies

The following dependencies are bundled with ps-helix:

- **@phosphor-icons/web**: 2.0.3 - Icon library
- **date-fns**: ^3.3.1 - Date utility functions
- **tslib**: ^2.6.0 - TypeScript runtime library

## Installation

Install the package via your preferred package manager:

**Avec pnpm (recommandé) :**
```bash
pnpm add ps-helix
```

**Avec npm :**
```bash
npm install ps-helix
```

All peer dependencies should be automatically installed. If not, install them manually:

**Avec pnpm :**
```bash
pnpm add @angular/common@^21.0.3 @angular/core@^21.0.3 @angular/forms@^21.0.3 @ngx-translate/core@^15.0.0 rxjs@^7.8.0
```

**Avec npm :**
```bash
npm install @angular/common@^21.0.3 @angular/core@^21.0.3 @angular/forms@^21.0.3 @ngx-translate/core@^15.0.0 rxjs@^7.8.0
```

### Verify Installation

After installation, verify that ps-helix is in your `package.json`:

```json
{
  "dependencies": {
    "ps-helix": "^3.0.0"
  }
}
```

## Quick Start

### Step 1: Import Global Styles

In your main `styles.css` file, import the Helix stylesheet:

```css
@import 'ps-helix/styles.css';
```

This single import includes:
- CSS Reset (normalize styles across browsers)
- Design Tokens (spacing, typography, colors, etc.)
- Light and Dark theme variables
- Utility classes (spacing, typography, layout, etc.)
- Responsive breakpoints and grid system
- Animation utilities
- Focus management styles

### Step 2: Configure Phosphor Icons

Add Phosphor Icons CDN links to your `src/index.html` in the `<head>` section:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your App</title>

  <!-- Phosphor Icons CDN -->
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css">
  <link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/light/style.css">
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### Step 3: Import and Use Components

All components are standalone. Import them directly where needed:

```typescript
import { Component } from '@angular/core';
import { PshButtonComponent } from 'ps-helix';

@Component({
  selector: 'app-root',
  imports: [PshButtonComponent],
  template: `
    <psh-button
      variant="primary"
      size="medium"
      (clicked)="handleClick()">
      Click Me
    </psh-button>
  `
})
export class AppComponent {
  handleClick() {
    console.log('Button clicked!');
  }
}
```

### Step 4: Initialize Theme Service (Optional)

If you want to use theme switching, inject the ThemeService:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from 'ps-helix';

@Component({
  selector: 'app-root',
  template: `
    <button (click)="themeService.toggleTheme()">
      Toggle Theme ({{ themeService.themeName() }})
    </button>
  `
})
export class AppComponent implements OnInit {
  themeService = inject(ThemeService);

  ngOnInit() {
    // Theme is initialized automatically
    console.log('Current theme:', this.themeService.themeName());
  }
}
```

### Step 5: Verify Everything Works

Create a simple test component to ensure the library is working:

```typescript
import { Component } from '@angular/core';
import { PshButtonComponent, PshCardComponent, PshAlertComponent } from 'ps-helix';

@Component({
  selector: 'app-test',
  imports: [PshButtonComponent, PshCardComponent, PshAlertComponent],
  template: `
    <psh-card>
      <h2>Helix Design System</h2>
      <psh-alert type="success" message="Installation successful!" />
      <psh-button variant="primary">Test Button</psh-button>
    </psh-card>
  `
})
export class TestComponent {}
```

## Configuration

### Global Styles

The design system provides a comprehensive set of CSS custom properties (CSS variables) that you can use in your own styles:

```css
/* Using design tokens in your custom styles */
.my-custom-component {
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  background: var(--surface-card);
  color: var(--text-color);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}
```

### Phosphor Icons Setup

After adding the CDN links, use icons in your templates:

```html
<!-- Regular weight (default) -->
<i class="ph ph-heart"></i>

<!-- Fill weight -->
<i class="ph-fill ph-heart"></i>

<!-- Bold weight -->
<i class="ph-bold ph-heart"></i>

<!-- Light weight -->
<i class="ph-light ph-heart"></i>

<!-- With accessibility label for icon-only buttons -->
<button aria-label="Like this item">
  <i class="ph ph-heart" aria-hidden="true"></i>
</button>
```

Browse all 6000+ icons at: [https://phosphoricons.com/](https://phosphoricons.com/)

### Theme Service

The `ThemeService` manages light/dark theme switching and custom brand colors.

#### Basic Theme Switching

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

For complete theming documentation including custom brand colors, see [THEME.md](./THEME.md).

### Translation Service

Configure internationalization with ngx-translate:

```typescript
// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { AppComponent } from './app/app.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    ...TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }).providers || []
  ]
}).then(ref => {
  const translateService = ref.injector.get(TranslateService);
  translateService.use('en');
});
```

#### Using TranslationService in Components

```typescript
import { Component, inject } from '@angular/core';
import { TranslationService } from 'ps-helix';

@Component({
  selector: 'app-example',
  template: `
    <select (change)="changeLanguage($event)">
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
    </select>
  `
})
export class ExampleComponent {
  private translationService = inject(TranslationService);

  changeLanguage(event: Event) {
    const lang = (event.target as HTMLSelectElement).value;
    this.translationService.setLanguage(lang);
  }
}
```

### Scroll Service

The `ScrollService` provides utilities for scroll management:

```typescript
import { Component, inject } from '@angular/core';
import { ScrollService } from 'ps-helix';

@Component({
  selector: 'app-example',
  template: `
    <button (click)="scrollToTop()">Back to Top</button>
    <button (click)="scrollToElement('#section-2')">Go to Section 2</button>
  `
})
export class ExampleComponent {
  private scrollService = inject(ScrollService);

  scrollToTop() {
    this.scrollService.scrollToTop();
  }

  scrollToElement(selector: string) {
    this.scrollService.scrollToElement(selector);
  }
}
```

## Core Concepts

### Standalone Components

All Helix components are standalone (no NgModules required):

```typescript
import { Component } from '@angular/core';
import {
  PshButtonComponent,
  PshInputComponent,
  PshCardComponent
} from 'ps-helix';

@Component({
  selector: 'app-form',
  imports: [
    PshButtonComponent,
    PshInputComponent,
    PshCardComponent
  ],
  template: `
    <psh-card>
      <psh-input label="Email" />
      <psh-button variant="primary">Submit</psh-button>
    </psh-card>
  `
})
export class FormComponent {}
```

### Signal-Based Reactivity

Components use Angular signals for optimal change detection:

```typescript
import { Component, signal } from '@angular/core';
import { PshModalComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshModalComponent],
  template: `
    <button (click)="isOpen.set(true)">Open Modal</button>

    <psh-modal [(open)]="isOpen" title="Confirmation">
      <p>Are you sure?</p>
    </psh-modal>
  `
})
export class ExampleComponent {
  isOpen = signal(false);
}
```

### Type Safety

All components export TypeScript types for type-safe development:

```typescript
import { Component } from '@angular/core';
import { PshButtonComponent, ButtonVariant, ButtonSize } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshButtonComponent],
  template: `
    <psh-button [variant]="variant" [size]="size">
      {{ buttonText }}
    </psh-button>
  `
})
export class ExampleComponent {
  variant: ButtonVariant = 'primary';  // Type-safe
  size: ButtonSize = 'medium';         // Type-safe
  buttonText = 'Click Me';
}
```

### Dependency Injection

Use modern `inject()` function instead of constructor injection:

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService, ToastService } from 'ps-helix';

@Component({
  selector: 'app-example',
  template: `<button (click)="showToast()">Show Toast</button>`
})
export class ExampleComponent {
  // Modern injection syntax
  private themeService = inject(ThemeService);
  private toastService = inject(ToastService);

  showToast() {
    this.toastService.success('Hello from Helix!');
  }
}
```

## Available Components

Helix provides **28 production-ready components** organized by category:

### Form Components (6)

- **PshButtonComponent** - Versatile button with multiple variants, sizes, and states
- **PshInputComponent** - Text input with validation, error messages, and form control integration
- **PshCheckboxComponent** - Checkbox with customizable states and labels
- **PshRadioComponent** - Radio button for single selection from a group
- **PshSelectComponent** - Dropdown select with search, filtering, and custom rendering
- **PshSwitchComponent** - Toggle switch with on/off states

### Layout Components (6)

- **PshCardComponent** - Flexible content container with header, body, and footer sections
- **PshModalComponent** - Modal dialog overlay with backdrop and keyboard navigation
- **PshSidebarComponent** - Collapsible sidebar navigation with responsive behavior
- **PshCollapseComponent** - Expandable/collapsible content section with animation
- **PshTabsComponent** + **PshTabComponent** - Tabbed content organization with keyboard navigation
- **PshTabBarComponent** - Bottom tab bar navigation for mobile-first applications

### Feedback Components (5)

- **PshAlertComponent** - Alert messages with severity levels (success, info, warning, error)
- **PshToastComponent** + **ToastService** - Toast notification system with queue management
- **PshSpinloaderComponent** - Loading spinner with various sizes
- **PshProgressbarComponent** - Progress indicator with percentage display
- **PshTooltipComponent** - Contextual tooltips with multiple positions

### Data Display Components (7)

- **PshTableComponent** - Data table with sorting, pagination, and custom rendering
- **PshBadgeComponent** - Status badges and indicators with various colors
- **PshTagComponent** - Removable tags for labels and filters
- **PshAvatarComponent** - User avatar with image, initials, or icon fallback
- **PshStatCardComponent** - Statistical card for dashboards
- **PshInfoCardComponent** - Information card with icon and content
- **PshHorizontalCardComponent** - Horizontal layout card component

### Navigation Components (4)

- **PshMenuComponent** - Dropdown menu with nested items
- **PshPaginationComponent** - Pagination controls with page numbers
- **PshStepperComponent** + **PshStepComponent** - Step-by-step wizard navigation with validation
- **PshDropdownComponent** - Dropdown trigger and content container

## Service APIs

### ThemeService

Manage application themes and custom brand colors.

**Methods:**
- `setDarkTheme(isDark: boolean)` - Set theme mode
- `toggleTheme()` - Toggle between light and dark
- `updateTheme(name: 'light' | 'dark')` - Update theme by name
- `applyInsurerTheme()` - Apply custom brand colors

**Computed Signals:**
- `themeName()` - Returns current theme name
- `isDarkTheme()` - Returns boolean for dark mode
- `themeInfo()` - Returns complete theme information

**Example:**

```typescript
import { inject } from '@angular/core';
import { ThemeService } from 'ps-helix';

export class MyComponent {
  themeService = inject(ThemeService);

  get currentTheme() {
    return this.themeService.themeName(); // 'light' or 'dark'
  }

  get isDark() {
    return this.themeService.isDarkTheme(); // boolean
  }

  switchTheme() {
    this.themeService.toggleTheme();
  }
}
```

### ToastService

Display temporary notification messages.

**Methods:**
- `success(message: string, options?)` - Show success toast
- `error(message: string, options?)` - Show error toast
- `warning(message: string, options?)` - Show warning toast
- `info(message: string, options?)` - Show info toast

**Options:**
- `duration?: number` - Display duration in milliseconds (default: 3000)
- `position?: ToastPosition` - 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

**Example:**

```typescript
import { inject } from '@angular/core';
import { ToastService } from 'ps-helix';

export class MyComponent {
  private toastService = inject(ToastService);

  saveData() {
    try {
      // Save logic
      this.toastService.success('Data saved successfully!');
    } catch (error) {
      this.toastService.error('Failed to save data');
    }
  }

  showCustom() {
    this.toastService.info('Processing...', {
      duration: 5000,
      position: 'bottom-right'
    });
  }
}
```

### ScrollService

Utility service for scroll management and smooth scrolling.

**Methods:**
- `scrollToTop()` - Scroll to page top smoothly
- `scrollToElement(selector: string)` - Scroll to specific element
- `disableScroll()` - Disable page scrolling (useful for modals)
- `enableScroll()` - Re-enable page scrolling

**Example:**

```typescript
import { inject } from '@angular/core';
import { ScrollService } from 'ps-helix';

export class MyComponent {
  private scrollService = inject(ScrollService);

  backToTop() {
    this.scrollService.scrollToTop();
  }

  goToSection(sectionId: string) {
    this.scrollService.scrollToElement(`#${sectionId}`);
  }

  openModal() {
    this.scrollService.disableScroll();
    // Show modal
  }

  closeModal() {
    this.scrollService.enableScroll();
    // Hide modal
  }
}
```

### TranslationService

Wrapper service for ngx-translate functionality.

**Methods:**
- `setLanguage(lang: string)` - Change application language
- `getTranslation(key: string)` - Get translation for a key
- `instant(key: string)` - Get instant translation (synchronous)

**Example:**

```typescript
import { Component, inject } from '@angular/core';
import { TranslationService } from 'ps-helix';

@Component({
  selector: 'app-language-selector',
  template: `
    <select (change)="changeLanguage($event)">
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="es">Español</option>
      <option value="de">Deutsch</option>
    </select>
  `
})
export class LanguageSelectorComponent {
  private translationService = inject(TranslationService);

  changeLanguage(event: Event) {
    const selectedLang = (event.target as HTMLSelectElement).value;
    this.translationService.setLanguage(selectedLang);
  }
}
```

## Exported Types

All component types and enums are exported for type-safe development:

### Alert Types

```typescript
import { AlertType, AlertVariant } from 'ps-helix';

const type: AlertType = 'success' | 'error' | 'warning' | 'info';
const variant: AlertVariant = 'solid' | 'outlined' | 'soft';
```

### Avatar Types

```typescript
import { AvatarSize, AvatarShape } from 'ps-helix';

const size: AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
const shape: AvatarShape = 'circle' | 'square';
```

### Badge Types

```typescript
import { BadgeSize, BadgeVariant } from 'ps-helix';

const size: BadgeSize = 'sm' | 'md' | 'lg';
const variant: BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
```

### Button Types

```typescript
import { ButtonAppearance, ButtonSize, ButtonVariant } from 'ps-helix';

const appearance: ButtonAppearance = 'filled' | 'outlined' | 'text' | 'ghost';
const size: ButtonSize = 'small' | 'medium' | 'large';
const variant: ButtonVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
```

### Input Types

```typescript
import { InputSize, InputType } from 'ps-helix';

const size: InputSize = 'small' | 'medium' | 'large';
const type: InputType = 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
```

### Modal Types

```typescript
import { ModalSize } from 'ps-helix';

const size: ModalSize = 'small' | 'medium' | 'large' | 'fullscreen';
```

### Select Types

```typescript
import { SelectOption, SelectOptionGroup, SelectSize, SearchConfig } from 'ps-helix';

interface SelectOption<T> {
  label: string;
  value: T;
  icon?: string;
  disabled?: boolean;
  description?: string;
}

interface SelectOptionGroup<T> {
  label: string;
  options: SelectOption<T>[];
  disabled?: boolean;
}

interface SearchConfig {
  debounceTime: number;
  placeholder: string;
  minLength: number;
}

type SelectSize = 'small' | 'medium' | 'large';
```

### Stepper Types

```typescript
import { StepperVariant } from 'ps-helix';

const variant: StepperVariant = 'default' | 'numbered' | 'progress';
```

### Table Types

```typescript
import { TableColumn, TableSortDirection } from 'ps-helix';

const sortDirection: TableSortDirection = 'asc' | 'desc' | null;

interface TableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (item: T) => string;
}
```

### Toast Types

```typescript
import { ToastPosition, ToastVariant } from 'ps-helix';

const position: ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
const variant: ToastVariant = 'success' | 'error' | 'warning' | 'info';
```

### Tooltip Types

```typescript
import { TooltipPlacement, TooltipTrigger } from 'ps-helix';

const placement: TooltipPlacement = 'top' | 'bottom' | 'left' | 'right';
const trigger: TooltipTrigger = 'hover' | 'click' | 'focus';
```

For a complete list of all exported types, see the [type definitions](./src/public-api.ts).

## Theming

### Default Colors

Helix provides default theme colors:
- **Primary**: `#0F02C4` (Deep Blue)
- **Secondary**: `#7B3AEC` (Purple)

### Custom Brand Colors

Customize to match your brand identity using the injection token pattern. See the complete guide in [THEME.md](./THEME.md).

### Available CSS Variables

Once configured, numerous CSS variables are available:

**Primary Color:**
- `--primary-color`
- `--primary-color-light`
- `--primary-color-lighter`
- `--primary-color-dark`
- `--primary-color-darker`
- `--primary-color-text`
- `--primary-color-rgb`

**Secondary Color:**
- `--secondary-color`
- `--secondary-color-light`
- `--secondary-color-lighter`
- `--secondary-color-dark`
- `--secondary-color-darker`
- `--secondary-color-text`
- `--secondary-color-rgb`

### Using Custom Variables

```css
.my-button {
  background: var(--primary-color);
  color: var(--primary-color-text);
}

.my-button:hover {
  background: var(--primary-color-light);
}
```

For complete theming guide including custom colors, dynamic changes, and advanced configurations, see [THEME.md](./THEME.md).

## Best Practices

### Component Organization

```typescript
// ✅ Good: Import only what you need
import { PshButtonComponent, PshInputComponent } from 'ps-helix';

// ❌ Avoid: Don't import entire module
import * as Helix from 'ps-helix';
```

### Type Safety

```typescript
// ✅ Good: Use exported types
import { ButtonVariant, ButtonSize } from 'ps-helix';

const variant: ButtonVariant = 'primary';
const size: ButtonSize = 'medium';

// ❌ Avoid: Magic strings without types
const variant = 'primary'; // No type checking
```

### Signal Usage

```typescript
// ✅ Good: Use signals for reactive state
import { signal } from '@angular/core';

export class MyComponent {
  isVisible = signal(false);

  toggle() {
    this.isVisible.update(v => !v);
  }
}

// ❌ Avoid: Traditional properties for reactive UI
export class MyComponent {
  isVisible = false; // Won't trigger change detection optimally
}
```

### Accessibility

```html
<!-- ✅ Good: Proper ARIA labels for icon-only buttons -->
<button aria-label="Delete item" (click)="delete()">
  <i class="ph ph-trash" aria-hidden="true"></i>
</button>

<!-- ❌ Avoid: Icon buttons without labels -->
<button (click)="delete()">
  <i class="ph ph-trash"></i>
</button>
```

### Form Integration

```typescript
// ✅ Good: Reactive forms with FormControl
import { FormControl, Validators } from '@angular/forms';

export class MyComponent {
  emailControl = new FormControl('', [
    Validators.required,
    Validators.email
  ]);
}
```

```html
<psh-input
  label="Email"
  [formControl]="emailControl"
  [required]="true">
</psh-input>
```

### Performance Optimization

```typescript
// ✅ Good: Use OnPush change detection
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`
})
export class ExampleComponent {}

// ✅ Good: Use trackBy for lists
@Component({
  template: `
    @for (item of items(); track item.id) {
      <psh-card>{{ item.name }}</psh-card>
    }
  `
})
export class ListComponent {
  items = signal<Item[]>([]);
}
```

### Testing

```typescript
// ✅ Good: Test components with TestBed
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshButtonComponent } from 'ps-helix';

describe('MyComponent', () => {
  let component: MyComponent;
  let fixture: ComponentFixture<MyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent, PshButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(MyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

## Troubleshooting

### Styles Not Applied

**Problem**: Components appear unstyled or broken.

**Solution**: Ensure you've imported the global stylesheet:

```css
/* In src/styles.css */
@import 'ps-helix/styles.css';
```

### Icons Not Displaying

**Problem**: Icons show as empty squares or missing glyphs.

**Solution**: Verify Phosphor Icons CDN links are in `index.html`:

```html
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/light/style.css">
```

### Custom Colors Not Applying

**Problem**: Brand colors aren't being used.

**Solution**:
1. Verify your theme context service implements `InsurerContextService`
2. Check the provider configuration in `main.ts` or `app.config.ts`
3. Ensure you're using valid hex color codes (e.g., `#FF0000`)
4. Call `themeService.applyInsurerTheme()` after color changes

See [THEME.md](./THEME.md) for complete theming documentation.

### TypeScript Errors

**Problem**: TypeScript compilation errors with component imports.

**Solution**:
1. Verify Angular version is 21.0.3 or higher
2. Check `tsconfig.json` has `"strict": true`
3. Ensure all peer dependencies are installed
4. Clear node_modules and reinstall:
   - Avec pnpm: `rm -rf node_modules && pnpm install`
   - Avec npm: `rm -rf node_modules && npm install`

### Performance Issues

**Problem**: Application feels slow or unresponsive.

**Solution**:
1. Use `OnPush` change detection strategy
2. Implement proper signal usage
3. Avoid unnecessary component re-renders
4. Use `trackBy` functions in `@for` loops
5. Lazy load routes and components where possible

### Build Errors

**Problem**: Build fails with module resolution errors.

**Solution**:
1. Verify package.json includes ps-helix in dependencies
2. Clear Angular cache: `ng cache clean`
3. Delete .angular folder and rebuild
4. Check that all peer dependencies match required versions

### Runtime Errors

**Problem**: Errors in browser console at runtime.

**Solution**:
1. Check browser console for specific error messages
2. Verify all required services are provided
3. Ensure ThemeService is initialized if using custom themes
4. Check that ngx-translate is properly configured if using i18n

## Browser Support

Helix Design System supports:

- **Chrome**: Latest 2 versions
- **Firefox**: Latest 2 versions
- **Safari**: Latest 2 versions
- **Edge**: Latest 2 versions
- **Mobile browsers**: iOS Safari 14+, Chrome Android latest

**Note**: Internet Explorer is not supported.

## Development Scripts

The following scripts are available for library development:

**Avec pnpm (recommandé) :**
```bash
pnpm run build:lib    # Build the library
pnpm run watch:lib    # Watch for changes and rebuild
pnpm run publish:lib  # Publish to npm registry
pnpm run build        # Build demo application
pnpm run dev          # Run demo application in dev mode
```

**Avec npm :**
```bash
npm run build:lib     # Build the library
npm run watch:lib     # Watch for changes and rebuild
npm run publish:lib   # Publish to npm registry
npm run build         # Build demo application
npm run dev           # Run demo application in dev mode
```

## Contributing

We welcome contributions! To contribute to Helix Design System:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes and commit: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Submit a pull request

### Development Guidelines

- Follow Angular style guide
- Use TypeScript strict mode
- Write tests for new components
- Document all public APIs
- Ensure accessibility compliance (WCAG 2.1 AA)
- Keep components small and focused
- Use signals for reactive state

## License

MIT License - see LICENSE file for details.

Copyright (c) 2025 PACK Solutions

## Resources

- **Theme Customization Guide**: [THEME.md](./THEME.md)
- **Component Documentation**: Individual component README files in `/lib/components/`
- **Phosphor Icons**: [https://phosphoricons.com/](https://phosphoricons.com/)
- **Angular Documentation**: [https://angular.dev/](https://angular.dev/)
- **TypeScript Documentation**: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
- **ngx-translate**: [https://github.com/ngx-translate/core](https://github.com/ngx-translate/core)

---

**Version**: 3.0.0
**Built with**: Angular 21.0.3, TypeScript 5.9.0, Phosphor Icons 2.0.3
**Author**: Fabrice PEREZ | Product Designer at PACK Solutions
**Last Updated**: January 2026
