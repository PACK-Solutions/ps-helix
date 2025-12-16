# TabBar Component Documentation

## Installation et Utilisation

### Installation

```typescript
import { PshTabBarComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshTabBarComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// TabBar basique avec contenu par défaut
<psh-tab-bar></psh-tab-bar>

// TabBar avec items personnalisés
<psh-tab-bar
  [items]="[
    { id: 'home', label: 'Accueil', icon: 'house' },
    { id: 'search', label: 'Rechercher', icon: 'magnifying-glass' },
    { id: 'notifications', label: 'Notifications', icon: 'bell', badge: '3' },
    { id: 'profile', label: 'Profil', icon: 'user' }
  ]"
  [(activeIndex)]="activeTabIndex"
  (activeIndexChange)="handleTabChange($event)"
></psh-tab-bar>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| disabled | boolean | false | État désactivé |
| position | 'bottom' \| 'top' | 'bottom' | Position de la barre |
| animated | boolean | true | Animation activée |
| iconSize | 'small' \| 'medium' \| 'large' | 'medium' | Taille des icônes |
| activeIndex | number | 0 | Index de l'onglet actif |

### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| items | TabBarItem[] | [...] | Liste des onglets |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| activeIndexChange | EventEmitter<number> | Émis lors du changement d'onglet |

### Interface TabBarItem
```typescript
interface TabBarItem {
  id: string;      // Identifiant unique
  label: string;   // Label de l'onglet
  icon: string;    // Icône Phosphor
  disabled?: boolean; // État désactivé
  badge?: string | number; // Badge optionnel
}
```

## Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: TAB_BAR_CONFIG,
      useValue: {
        disabled: false,
        position: 'bottom',
        animated: true,
        iconSize: 'medium'
      }
    }
  ]
})
```

## Bonnes Pratiques

1. **Structure**
   - Utiliser des IDs uniques pour les items
   - Limiter le nombre d'onglets (4-5 max)
   - Icônes descriptives et cohérentes

2. **Accessibilité**
   - Labels descriptifs
   - Support du clavier
   - États ARIA appropriés
   - Badges vocalisés

3. **Performance**
   - Utilisation des signals
   - Détection de changements OnPush
   - Animations optimisées

4. **UX Mobile**
   - Labels courts
   - Icônes claires
   - Taille tactile suffisante
   - Feedback visuel immédiat