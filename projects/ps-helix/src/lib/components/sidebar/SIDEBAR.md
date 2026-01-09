# Sidebar Component Documentation

## Usage

1. Import the component in your module or standalone component:
```typescript
import { PshSidebarComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshSidebarComponent],
  // ...
})
```

### Basic Usage

```html
<!-- Fixed sidebar -->
<psh-sidebar [(open)]="isOpen" mode="fixed" width="250px">
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>

<!-- Overlay sidebar -->
<psh-sidebar
  [(open)]="isOpen"
  mode="overlay"
  (toggle)="handleToggle($event)"
  (opened)="onOpened()"
  (closed)="onClosed()"
>
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>
```

## API

### Model Input (two-way binding)
| Name | Type | Default | Description |
|------|------|---------|-------------|
| open | boolean | false | Open state (two-way binding) |

### Inputs
| Name | Type | Default | Description |
|------|------|---------|-------------|
| mode | SidebarMode | 'fixed' | Display mode ('fixed' or 'overlay') |
| position | SidebarPosition | 'left' | Position ('left' or 'right') |
| width | string | '250px' | Sidebar width |
| breakpoint | string | '768px' | Mobile breakpoint |
| autoFocus | boolean | true | Auto-focus first focusable element on open |
| ariaLabel | string | 'Sidebar navigation' | ARIA label for the sidebar |
| closeOnBackdrop | boolean | true | Close sidebar when clicking the backdrop (overlay mode only) |
| closeOnEscape | boolean | true | Close sidebar when pressing Escape key (overlay mode only) |

### Outputs
| Name | Type | Description |
|------|------|-------------|
| toggle | EventEmitter<boolean> | Emitted on toggle (open/close state) |
| opened | EventEmitter<void> | Emitted after sidebar is fully opened |
| closed | EventEmitter<void> | Emitted after sidebar is fully closed |
| transitionStart | EventEmitter<boolean> | Emitted at start of transition (true = opening, false = closing) |

## Available Modes

### Fixed
- Always visible
- Suited for fixed layouts
- No content overlay
- Default mode

### Overlay
- Overlays the content
- Closes on outside click (configurable via `closeOnBackdrop`)
- Closes on Escape key (configurable via `closeOnEscape`)
- Ideal for mobile and temporary actions

## Accessibility

### ARIA Attributes
- `role="complementary"`: Semantic role automatically added
- `aria-label`: Customizable via `ariaLabel` input
- `aria-hidden`: Visibility state managed automatically
- `aria-expanded`: Expansion state managed automatically
- `aria-modal`: Enabled automatically in overlay mode
- Full keyboard support

### Navigation
- `Escape`: Closes the sidebar (overlay mode only, configurable via `closeOnEscape`)
- `Tab`: Focus trapped automatically within the open sidebar
- Auto-focus on first focusable element (disableable via `autoFocus`)
- Focus restored to previous element on close

## Responsive Design

- Automatic switch to overlay mode on mobile
- Adaptive width
- Touch gesture support
- Configurable breakpoint

## Global Configuration

You can provide default configuration for all sidebars in your application:

```typescript
import { SIDEBAR_CONFIG } from 'ps-helix';

@Component({
  providers: [
    {
      provide: SIDEBAR_CONFIG,
      useValue: {
        mode: 'fixed',
        position: 'left',
        width: '250px',
        breakpoint: '768px',
        autoFocus: true,
        ariaLabel: 'Main navigation',
        closeOnBackdrop: true,
        closeOnEscape: true
      }
    }
  ]
})
```

## Advanced Examples

### Transition Events

```html
<psh-sidebar
  [(open)]="isOpen"
  (transitionStart)="onTransitionStart($event)"
  (opened)="onSidebarOpened()"
  (closed)="onSidebarClosed()"
>
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>
```

```typescript
onTransitionStart(opening: boolean) {
  if (opening) {
    console.log('Sidebar is starting to open');
  } else {
    console.log('Sidebar is starting to close');
  }
}

onSidebarOpened() {
  console.log('Sidebar is fully opened');
}

onSidebarClosed() {
  console.log('Sidebar is fully closed');
}
```

### Disable Auto-Focus

```html
<psh-sidebar
  [(open)]="isOpen"
  mode="overlay"
  [autoFocus]="false"
>
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>
```

### Custom Width

```html
<psh-sidebar
  [(open)]="isOpen"
  mode="fixed"
  width="280px"
>
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>
```

### Prevent Backdrop Close

```html
<psh-sidebar
  [(open)]="isOpen"
  mode="overlay"
  [closeOnBackdrop]="false"
  [closeOnEscape]="false"
>
  <p>This sidebar requires explicit close action</p>
  <button (click)="isOpen = false">Close</button>
</psh-sidebar>
```

## Best Practices

1. **Structure**
   - Organized and accessible content
   - Clear navigation
   - Visual hierarchy

2. **Performance**
   - Optimized animations
   - Efficient state management
   - Resource cleanup

3. **UX**
   - Smooth transitions
   - Visual feedback
   - Intuitive behavior
   - Mobile support

4. **SSR Compatibility**
   - Component is SSR-safe with platform checks
   - No direct `window` or `document` access during server rendering
