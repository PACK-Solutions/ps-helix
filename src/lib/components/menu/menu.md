# Menu Component

Le composant Menu permet de créer des menus de navigation flexibles et accessibles.

## Installation

```typescript
import { LibMenuComponent } from '@lib/components/menu/menu.component';

@Component({
  // ...
  imports: [LibMenuComponent]
})
```

## Utilisation

### Menu Vertical
```html
<lib-menu
  [items]="[
    { id: 'home', label: 'Home', icon: 'house', path: '/home' },
    { id: 'settings', label: 'Settings', icon: 'gear', children: [
      { id: 'profile', label: 'Profile', path: '/settings/profile' },
      { id: 'security', label: 'Security', path: '/settings/security' }
    ]}
  ]"
></lib-menu>
```

### Menu Horizontal
```html
<lib-menu
  [items]="items"
  mode="horizontal"
></lib-menu>
```

### Menu Collapsible
```html
<lib-menu
  [items]="items"
  [collapsible]="true"
  [(collapsed)]="isCollapsed"
></lib-menu>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| items | MenuItem[] | [] | Liste des éléments du menu |
| variant | MenuVariant | 'default' | Style du menu |
| mode | MenuMode | 'vertical' | Orientation du menu |
| collapsible | boolean | false | Menu pliable |
| collapsed | boolean | false | État plié/déplié |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| itemClick | EventEmitter<MenuItem> | Émis lors du clic sur un élément |
| collapsedChange | EventEmitter<boolean> | Émis lors du pliage/dépliage |

### Interface MenuItem

```typescript
interface MenuItem {
  id: string;         // Identifiant unique
  label: string;      // Label traduit
  icon?: string;      // Icône Phosphor
  path?: string;      // Chemin de navigation
  children?: MenuItem[]; // Sous-menu
  disabled?: boolean; // État désactivé
  divider?: boolean;  // Séparateur
  badge?: string | number; // Badge
}
```

## Accessibilité

- Structure ARIA appropriée
- Navigation au clavier
- États désactivés gérés
- Labels traduits via ngx-translate