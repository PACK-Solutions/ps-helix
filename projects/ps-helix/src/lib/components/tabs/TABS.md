# Tabs Component Documentation

## Import

```typescript
import { PshTabsComponent, PshTabComponent } from 'ps-helix';

@Component({
  imports: [PshTabsComponent, PshTabComponent]
})
```

## Usage

### Content Projection (Recommended)

```html
<psh-tabs [(activeIndex)]="activeIndex">
  <psh-tab header="Accueil" icon="house">
    <p>Contenu de l'onglet Accueil</p>
  </psh-tab>
  <psh-tab header="Profil" icon="user">
    <p>Contenu de l'onglet Profil</p>
  </psh-tab>
  <psh-tab header="Parametres" icon="gear" [disabled]="true">
    <p>Contenu desactive</p>
  </psh-tab>
</psh-tabs>
```

### Data-Driven

```typescript
tabs: Tab[] = [
  { header: 'Accueil', icon: 'house', content: 'Contenu de l\'onglet Accueil' },
  { header: 'Profil', icon: 'user', content: 'Contenu de l\'onglet Profil' },
  { header: 'Parametres', icon: 'gear', content: 'Contenu des parametres', disabled: true }
];
```

```html
<psh-tabs [tabs]="tabs" [(activeIndex)]="activeIndex"></psh-tabs>
```

## API

### PshTabsComponent

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| variant | TabsVariant | 'default' | Visual style: 'default', 'underline', 'pills' |
| size | TabsSize | 'medium' | Size: 'small', 'medium', 'large' |
| tabs | Tab[] | [] | Data-driven tabs (alternative to content projection) |
| animated | boolean | true | Enable fade-in animation |
| ariaLabel | string | - | Custom ARIA label for the tab region |
| ariaOrientation | 'horizontal' \| 'vertical' | 'horizontal' | Orientation for ARIA |

#### Model

| Name | Type | Default | Description |
|------|------|---------|-------------|
| activeIndex | number | 0 | Currently active tab index (two-way binding) |

#### Outputs

| Name | Type | Description |
|------|------|-------------|
| activeIndexChange | number | Emitted when active tab changes |
| tabChange | TabChangeEvent | Emitted with previous/current index and tab data |

### PshTabComponent

#### Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| header | string | Yes | Tab header text |
| icon | string | No | Phosphor icon name |
| disabled | boolean | No | Disable the tab |
| ariaLabel | string | No | Custom ARIA label |

#### Readonly Signals

| Name | Type | Description |
|------|------|-------------|
| index | Signal<number> | Tab index (set by parent) |
| isActive | Signal<boolean> | Active state (set by parent) |

### Public Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| selectTab | (index: number) => void | Select tab by index (skips disabled) |
| selectNext | () => void | Select next enabled tab (loops) |
| selectPrevious | () => void | Select previous enabled tab (loops) |
| selectFirst | () => void | Select first enabled tab |
| selectLast | () => void | Select last enabled tab |
| getActiveTab | () => Tab \| undefined | Get currently active tab data |
| getTabComponent | (index: number) => PshTabComponent \| undefined | Get tab component instance by index |

## Variants

### Default
Standard tabs with background fill on active state.

```html
<psh-tabs variant="default">...</psh-tabs>
```

### Underline
Minimal style with underline indicator.

```html
<psh-tabs variant="underline">...</psh-tabs>
```

### Pills
Rounded pill-shaped tabs with background.

```html
<psh-tabs variant="pills">...</psh-tabs>
```

## Sizes

```html
<psh-tabs size="small">...</psh-tabs>
<psh-tabs size="medium">...</psh-tabs>
<psh-tabs size="large">...</psh-tabs>
```

## Global Configuration

```typescript
import { TABS_CONFIG } from 'ps-helix';

@Component({
  providers: [
    {
      provide: TABS_CONFIG,
      useValue: {
        variant: 'pills',
        size: 'medium',
        activeIndex: 0,
        animated: true
      }
    }
  ]
})
```

## Keyboard Navigation

| Key | Action |
|-----|--------|
| Arrow Left | Select previous enabled tab (loops) |
| Arrow Right | Select next enabled tab (loops) |
| Home | Select first enabled tab |
| End | Select last enabled tab |

> **Note**: All navigation keys automatically skip disabled tabs.

## Accessibility

- `role="tablist"` on the header container
- `role="tab"` on each tab button
- `role="tabpanel"` on each content panel
- `aria-selected` indicates active state
- `aria-controls` links tab to panel
- `aria-disabled` for disabled tabs
- Full keyboard navigation support

## Types

```typescript
type TabsVariant = 'default' | 'underline' | 'pills';
type TabsSize = 'small' | 'medium' | 'large';

interface Tab {
  header: string;
  icon?: string;
  content: string;
  disabled?: boolean;
  ariaLabel?: string;
}

interface TabChangeEvent {
  previousIndex: number;
  currentIndex: number;
  tab: Tab;
}
```

## Complete Example

```typescript
@Component({
  template: `
    <psh-tabs
      [(activeIndex)]="activeIndex"
      variant="pills"
      size="medium"
      [animated]="true"
      (tabChange)="onTabChange($event)"
    >
      <psh-tab header="Dashboard" icon="chart-line">
        <app-dashboard />
      </psh-tab>
      <psh-tab header="Users" icon="users">
        <app-user-list />
      </psh-tab>
      <psh-tab header="Settings" icon="gear">
        <app-settings />
      </psh-tab>
    </psh-tabs>
  `,
  imports: [PshTabsComponent, PshTabComponent]
})
export class TabsExampleComponent {
  activeIndex = 0;

  onTabChange(event: TabChangeEvent) {
    console.log('Tab changed from', event.previousIndex, 'to', event.currentIndex);
  }
}
```
