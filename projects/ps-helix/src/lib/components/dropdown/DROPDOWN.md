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

### Alternative (avec l'API items)
```typescript
<psh-dropdown
  [items]="[
    { content: 'Option 1', value: '1' },
    { content: 'Option 2', value: '2', icon: 'check' },
    { content: 'Option 3', value: '3', disabled: true }
  ]"
  appearance="outline"
  variant="primary"
  label="Actions"
  (selected)="handleSelect($event)"
></psh-dropdown>
```

### Mode icon-only

Rend un trigger carré sans label ni caret. `icon` est requis et `ariaLabel` est **obligatoire** pour respecter WCAG 4.1.2 (Name, Role, Value).

```typescript
<psh-dropdown
  appearance="outline"
  variant="primary"
  icon="dots-three-vertical"
  iconPosition="only"
  ariaLabel="Ouvrir le menu d'actions"
>
  <div dropdown-menu>
    <button class="dropdown-item" (click)="edit()">Modifier</button>
    <button class="dropdown-item" (click)="remove()">Supprimer</button>
  </div>
</psh-dropdown>
```

## Contrat du design system

Le dropdown partage le meme contrat a deux axes orthogonaux que `psh-button` (voir `BUTTON.md`) :

- **`appearance`** — forme / style de remplissage (`filled` | `outline` | `text`).
- **`variant`** — intention semantique / couleur (`primary` | `secondary` | `success` | `warning` | `danger`).

Les types `DropdownAppearance` et `DropdownVariant` sont des alias des types equivalents du bouton, garantissant une coherence totale entre les deux composants.

> Migration : les anciennes valeurs `variant="outline"` et `variant="text"` sont depreciees. Utilisez `appearance="outline"` ou `appearance="text"` combinees a une `variant` semantique (par defaut `primary`). Un avertissement est emis en mode dev lorsque l'ancienne API est utilisee.

## API

### Inputs (signaux)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| appearance | DropdownAppearance | 'filled' | Apparence du trigger (`filled`, `outline`, `text`) |
| variant | DropdownVariant | 'primary' | Variante sémantique (`primary`, `secondary`, `success`, `warning`, `danger`) |
| size | DropdownSize | 'medium' | Taille du dropdown (`small`, `medium`, `large`) |
| placement | DropdownPlacement | 'bottom-start' | Position du menu (`bottom-start`, `bottom-end`, `top-start`, `top-end`) |
| items | DropdownItem<T>[] | [] | Liste des éléments (optionnel, remplace la content projection) |
| label | string | 'Dropdown Menu' | Label par défaut du trigger |
| icon | string | undefined | Nom de l'icône Phosphor à afficher dans le trigger |
| iconPosition | DropdownIconPosition | 'left' | Placement de l'icône (`left`, `only`) |
| ariaLabel | string | undefined | Label ARIA personnalisé (obligatoire en mode `iconPosition="only"`) |

### Model Inputs (two-way binding)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| disabled | boolean | false | État désactivé. Supporte `[(disabled)]` |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| selected | EventEmitter<DropdownItem<T>> | Émis lors de la sélection d'un item |
| opened | EventEmitter<void> | Émis à l'ouverture du menu |
| closed | EventEmitter<void> | Émis à la fermeture du menu |

### Types

```typescript
type DropdownAppearance = 'filled' | 'outline' | 'text';
type DropdownVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type DropdownSize = 'small' | 'medium' | 'large';
type DropdownPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
type DropdownIconPosition = 'left' | 'only';
```

Les types `DropdownAppearance` et `DropdownVariant` sont des alias de `ButtonAppearance` et `ButtonVariant` pour garantir un contrat homogène entre les composants cliquables.

### Interface DropdownItem
```typescript
interface DropdownItem<T = string> {
  content: string;    // Contenu à afficher
  value: T;           // Valeur associée
  icon?: string;      // Icône Phosphor optionnelle
  disabled?: boolean; // État désactivé
  active?: boolean;   // État actif
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

## Avertissements en mode développement

Le composant emet des `console.warn` en mode dev pour prevenir les erreurs courantes. Ces messages sont silencieux en production.

- `iconPosition="only"` sans `icon` fourni : le rendu icon-only necessite une icone Phosphor.
- `iconPosition="only"` sans `ariaLabel` (ni `label`) : obligatoire pour respecter WCAG 4.1.2 (Name, Role, Value).
- `variant="outline"` ou `variant="text"` : API heritee. Utiliser `appearance="outline"` ou `appearance="text"` combine a une `variant` semantique (`primary`, `secondary`, `success`, `warning`, `danger`).

## Exemple Complet

Combine toutes les options : apparence, variante, taille, placement, icône, mode icon-only, état désactivé two-way bindé, content projection et trois événements.

```typescript
import { Component, signal } from '@angular/core';
import { PshDropdownComponent, DropdownItem } from 'ps-helix';

@Component({
  standalone: true,
  imports: [PshDropdownComponent],
  template: `
    <psh-dropdown
      appearance="filled"
      variant="primary"
      size="medium"
      placement="bottom-end"
      icon="dots-three"
      iconPosition="left"
      [(disabled)]="isLoading"
      ariaLabel="Menu d'actions sur l'élément"
      (selected)="handleSelect($event)"
      (opened)="handleOpened()"
      (closed)="handleClosed()"
    >
      <span dropdown-trigger>Actions</span>
      <div dropdown-menu>
        <button class="dropdown-item" (click)="edit()">
          <i class="ph ph-pencil-simple" aria-hidden="true"></i>
          Modifier
        </button>
        <button
          class="dropdown-item"
          [class.disabled]="!canDelete()"
          (click)="remove()"
        >
          <i class="ph ph-trash" aria-hidden="true"></i>
          Supprimer
        </button>
      </div>
    </psh-dropdown>
  `
})
export class ActionsMenuComponent {
  readonly isLoading = signal(false);
  readonly canDelete = signal(true);

  handleSelect(item: DropdownItem): void {
    console.log('Item selectionne', item);
  }

  handleOpened(): void {
    console.log('Menu ouvert');
  }

  handleClosed(): void {
    console.log('Menu ferme');
  }

  edit(): void {
    // ...
  }

  remove(): void {
    if (this.canDelete()) {
      // ...
    }
  }
}
```