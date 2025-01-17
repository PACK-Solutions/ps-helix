# TabBar Component

Le composant TabBar fournit une barre de navigation mobile avec des onglets iconiques.

## Installation

```typescript
import { LibTabBarComponent } from '@lib/components/tab-bar/tab-bar.component';

@Component({
  // ...
  imports: [LibTabBarComponent]
})
```

## Utilisation

```html
<lib-tab-bar
  [items]="[
    { id: 'home', label: 'TAB_BAR.HOME', icon: 'house' },
    { id: 'search', label: 'TAB_BAR.SEARCH', icon: 'magnifying-glass' },
    { id: 'add', label: 'TAB_BAR.ADD', icon: 'plus' },
    { id: 'notifications', label: 'TAB_BAR.NOTIFICATIONS', icon: 'bell' },
    { id: 'profile', label: 'TAB_BAR.PROFILE', icon: 'user' }
  ]"
  [(activeIndex)]="activeTabIndex"
></lib-tab-bar>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| items | TabBarItem[] | [] | Liste des onglets |
| activeIndex | number | 0 | Index de l'onglet actif |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| activeIndexChange | EventEmitter<number> | Émis lors du changement d'onglet |

### Interface TabBarItem

```typescript
interface TabBarItem {
  id: string;      // Identifiant unique
  label: string;   // Label traduit
  icon: string;    // Icône Phosphor
}
```

## Accessibilité

- Utilise les rôles ARIA appropriés
- Support de la navigation au clavier
- Labels traduits via ngx-translate