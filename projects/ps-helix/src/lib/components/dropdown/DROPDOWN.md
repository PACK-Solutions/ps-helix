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
<psh-dropdown appearance="filled" variant="primary">
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

### Mode Icône Seule (icon-only)

Transforme le déclencheur en bouton carré compact affichant uniquement une icône. Le caret est masqué : l'icône métier (kebab, filtre, paramètres) devient l'affordance visuelle du menu. La sémantique ARIA (`aria-haspopup`, `aria-expanded`) est conservée.

```typescript
<psh-dropdown
  icon="dots-three-vertical"
  [iconOnly]="true"
  iconOnlyText="Menu d'actions"
  appearance="outline"
  variant="primary"
>
  <div dropdown-menu>
    <button class="dropdown-item">
      <i class="ph ph-pencil-simple"></i>
      Modifier
    </button>
  </div>
</psh-dropdown>
```

> **Accessibilité** : toujours fournir `iconOnlyText` pour garantir un `aria-label` descriptif aux lecteurs d'écran lorsque `iconOnly` est actif.

### Alternative (avec l'API items)
```typescript
<psh-dropdown
  [items]="[
    { content: 'Option 1', value: '1' },
    { content: 'Option 2', value: '2', icon: 'check' },
    { content: 'Option 3', value: '3', disabled: true }
  ]"
  appearance="filled"
  variant="primary"
  [label]="'Actions'"
  (selected)="handleSelect($event)"
></psh-dropdown>
```

## API

### Inputs
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| appearance | DropdownAppearance | 'filled' | Apparence du dropdown |
| variant | DropdownVariant | 'primary' | Couleur sémantique du dropdown |
| size | DropdownSize | 'medium' | Taille du dropdown (small, medium, large) |
| placement | DropdownPlacement | 'bottom-start' | Position du menu |
| items | DropdownItem[] | [] | Liste des éléments |
| label | string | 'Dropdown Menu' | Label du bouton |
| icon | string | undefined | Icône du bouton |
| ariaLabel | string | undefined | Label ARIA personnalisé |
| iconOnly | boolean | false | Mode icône seule (masque label et caret, requiert `icon`) |
| iconOnlyText | string | undefined | Label accessible (aria-label) utilisé en mode icon-only |

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

### Types

```typescript
type DropdownAppearance = 'filled' | 'outline' | 'text';
type DropdownVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type DropdownSize = 'small' | 'medium' | 'large';
type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
```

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

## Apparences

Le dropdown suit la même logique que le bouton : l'`appearance` contrôle la forme (remplissage) et `variant` contrôle la couleur sémantique.

### Filled (Par défaut)
Fond plein, idéal pour les actions principales.
```html
<psh-dropdown appearance="filled" variant="primary">
  <span dropdown-trigger>Actions</span>
  <div dropdown-menu>...</div>
</psh-dropdown>
```

### Outline
Bordure sans fond, pour les actions secondaires.
```html
<psh-dropdown appearance="outline" variant="primary">
  <span dropdown-trigger>Actions</span>
  <div dropdown-menu>...</div>
</psh-dropdown>
```

### Text
Sans fond ni bordure, pour les actions tertiaires et les menus discrets.
```html
<psh-dropdown appearance="text" variant="primary">
  <span dropdown-trigger>Actions</span>
  <div dropdown-menu>...</div>
</psh-dropdown>
```

## Variantes de Couleur

Toutes les apparences acceptent les cinq variantes sémantiques : `primary`, `secondary`, `success`, `warning`, `danger`.

```html
<psh-dropdown appearance="filled" variant="success"><span dropdown-trigger>Valider</span>...</psh-dropdown>
<psh-dropdown appearance="outline" variant="danger"><span dropdown-trigger>Supprimer</span>...</psh-dropdown>
<psh-dropdown appearance="text" variant="warning"><span dropdown-trigger>Attention</span>...</psh-dropdown>
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