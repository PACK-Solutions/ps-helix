# Dropdown Component

Le composant Dropdown permet de creer des menus deroulants personnalisables et accessibles.

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshDropdownComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshDropdownComponent]
})
```

### Approche Recommandee (avec contenu personnalise)
```typescript
<psh-dropdown [variant]="'primary'">
  <span dropdown-trigger>{{ 'DROPDOWN.TITLE' | translate }}</span>
  <div dropdown-menu>
    <button class="dropdown-item" (click)="handleSelect('1')">
      {{ 'DROPDOWN.OPTIONS.OPTION1' | translate }}
    </button>
    <button class="dropdown-item" (click)="handleSelect('2')">
      {{ 'DROPDOWN.OPTIONS.OPTION2' | translate }}
    </button>
  </div>
</psh-dropdown>
```

### Alternative (avec l'API items)
```typescript
<psh-dropdown
  [items]="[
    { content: 'Option 1', value: '1' },
    { content: 'Option 2', value: '2', icon: 'check' },
    { content: 'Option 3', value: '3', disabled: true }
  ]"
  [variant]="'primary'"
  [label]="'Actions'"
  (selected)="handleSelect($event)"
></psh-dropdown>
```

## API

### Inputs
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | string | 'primary' | Style du dropdown (primary, secondary, outline, text) |
| placement | DropdownPlacement | 'bottom-start' | Position du menu |
| items | DropdownItem[] | [] | Liste des éléments |
| label | string | 'Dropdown Menu' | Label du bouton |
| icon | string | undefined | Icône du bouton |
| ariaLabel | string | undefined | Label ARIA personnalisé |

### Model (Two-way binding)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| disabled | boolean | false | État désactivé (utiliser [(disabled)]) |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| selected | EventEmitter<DropdownItem> | Émis lors de la sélection |
| opened | EventEmitter<void> | Émis à l'ouverture |
| closed | EventEmitter<void> | Émis à la fermeture |

### Interface DropdownItem
```typescript
interface DropdownItem<T = string> {
  content: string;    // Contenu à afficher
  value: T;          // Valeur associée
  icon?: string;     // Icône optionnelle
  disabled?: boolean; // État désactivé
  active?: boolean;  // État actif
}
```

## Bonnes Pratiques

1. **Utilisation des Slots**
   - Préférer l'utilisation des slots `dropdown-trigger` et `dropdown-menu` pour un contrôle total sur le contenu
   - Permet une meilleure gestion des traductions
   - Offre plus de flexibilité pour le style

2. **Gestion des Traductions**
   - Gérer les traductions au niveau du template avec le pipe translate
   - Éviter d'utiliser des clés de traduction dans les items

3. **Accessibilité**
   - Fournir des labels ARIA appropriés
   - Navigation clavier complète automatique
   - Gérer correctement les états désactivés

4. **Performance**
   - Utiliser la détection de changements OnPush
   - Éviter les calculs inutiles dans les templates
   - Nettoyer les souscriptions

## Accessibilité

### Navigation Clavier (WCAG 2.1 AA)

Le composant implémente une navigation clavier complète:

**Bouton Trigger:**
- **Enter/Space**: Ouvrir/fermer le dropdown
- **Arrow Down**: Ouvrir le dropdown et focus le premier item
- **Arrow Up**: Ouvrir le dropdown et focus le premier item
- **Escape**: Fermer le dropdown

**Menu Ouvert:**
- **Enter/Space**: Sélectionner l'item focusé
- **Arrow Down**: Naviguer vers l'item suivant
- **Arrow Up**: Naviguer vers l'item précédent
- **Home**: Aller au premier item
- **End**: Aller au dernier item
- **Escape**: Fermer le menu
- **Tab**: Fermer le menu et continuer la navigation

Le composant gère automatiquement:
- Le focus sur les items actifs
- Le skip des items désactivés
- Le cycle de navigation (du dernier au premier item)
- La fermeture au clic en dehors

### Attributs ARIA

- `role="menu"`: Pour le conteneur du menu
- `role="menuitem"`: Pour chaque item
- `aria-expanded`: État d'ouverture du dropdown
- `aria-haspopup="menu"`: Indique la présence d'un menu
- `aria-disabled`: État désactivé des items
- `aria-label`: Label accessible pour le bouton