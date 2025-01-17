# Helix Design System

A modern Angular component library providing a comprehensive set of UI components and utilities.

## Installation

```bash
npm install @ps/helix @phosphor-icons/web @ngx-translate/core
```

## Setup

1. Add Phosphor Icons CSS to your index.html:

```html
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css">
```

2. Import the styles in your global styles file (styles.css):

```css
/* Import base styles */
@import '@ps/helix/styles';

/* Or import individual style modules */
@import '@ps/helix/styles/themes/light';
@import '@ps/helix/styles/themes/dark';
@import '@ps/helix/styles/utils/animations';
@import '@ps/helix/styles/utils/spacing';
@import '@ps/helix/styles/utils/typography';
@import '@ps/helix/styles/reset';
```

3. Configure translations in your app.module.ts or main.ts:

```typescript
import { provideExperimentalZonelessChangeDetection } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// Configure translation loader
export function createTranslateLoader() {
  // Implement your translation loading strategy
}

// For standalone applications with zoneless change detection (main.ts)
bootstrapApplication(AppComponent, {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'fr',
        loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader
        }
      })
    )
  ]
});

// Or for module-based applications with zoneless change detection (app.module.ts)
import { platformBrowser } from '@angular/platform-browser';

// Option 1: Using platformBrowser
platformBrowser().bootstrapModule(AppModule, {
  ngZone: 'noop'
});

// Option 2: Using NgModule decorator
@NgModule({
  imports: [
    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader
      }
    })
  ]
  providers: [
    provideExperimentalZonelessChangeDetection()
  ]
})
export class AppModule { }
```

4. Import and use components:

```typescript
// Import standalone components directly
import { 
  LibButtonComponent, 
  LibAlertComponent,
  LibToastComponent,
  ToastService 
} from '@ps/helix';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    LibButtonComponent,
    LibAlertComponent,
    LibToastComponent
  ],
  template: `
    <lib-button variant="primary">Click me</lib-button>
    <lib-toast></lib-toast>
  `
})
export class AppComponent {
  constructor(private toastService: ToastService) {}

  showToast() {
    this.toastService.show({
      message: 'Hello World',
      type: 'success'
    });
  }
}
```

## Features

- 🎨 Modern design system with light/dark themes
- ⚡ Zoneless change detection support
- 📱 Responsive components
- ♿ Accessible by default (WCAG 2.1 compliant)
- 🌍 Built-in internationalization support
- 🎯 Full TypeScript support
- 🔍 Comprehensive documentation
- ⚡ Optimized for performance
- 🧩 Standalone components

## Available Components

- Alert
- Avatar
- Badge
- Breadcrumb
- Button
- Card
- Charts
- Checkbox
- Collapse
- Dropdown
- Input
- Menu
- Modal
- Pagination
- Progress Bar
- Radio
- Select
- Spin Loader
- Stepper
- Switch
- Tab Bar
- Table
- Tabs
- Tag
- Toast
- Tooltip

## Documentation

Each component includes detailed documentation with:
- Installation instructions
- Basic and advanced usage examples
- API reference
- Accessibility guidelines
- Best practices

See the individual component documentation files in the source code for more details.

## Contributing

Please read our [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

MIT © [Pack Solutions]