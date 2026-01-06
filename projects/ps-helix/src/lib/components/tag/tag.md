# Tag Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshTagComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshTagComponent],
  template: `...`
})
export class ExampleComponent {}
```

> **Note**: Le composant Tag necessite la bibliotheque Phosphor Icons pour les icones. Assurez-vous que `@phosphor-icons/web` est installe et configure.

### Utilisation de Base

```html
<!-- Tag basique avec contenu par défaut -->
<psh-tag></psh-tag>

<!-- Tag avec contenu personnalisé -->
<psh-tag>Nouveau</psh-tag>

<!-- Tag avec icône -->
<psh-tag icon="check">Vérifié</psh-tag>

<!-- Tag fermable -->
<psh-tag
  [closable]="true"
  (closed)="handleClose()"
>
  Tag fermable
</psh-tag>

<!-- Tag interactif (cliquable) -->
<psh-tag
  [interactive]="true"
  (clicked)="handleClick($event)"
>
  Cliquable
</psh-tag>

<!-- Tag avec icône et fermable -->
<psh-tag
  icon="star"
  [closable]="true"
  variant="success"
  (closed)="onRemove()"
>
  Favoris
</psh-tag>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | `TagVariant` | `'primary'` | Style visuel du tag (`primary`, `secondary`, `success`, `warning`, `danger`) |
| size | `TagSize` | `'medium'` | Taille du tag (`small`, `medium`, `large`) |
| closable | `boolean` | `false` | Affiche un bouton de fermeture |
| disabled | `boolean` | `false` | Désactive le tag |
| interactive | `boolean` | `false` | Rend le tag cliquable avec `role="button"` |
| icon | `string` | `undefined` | Nom de l'icône Phosphor (ex: `'check'`, `'star'`) |
| closeLabel | `string` | `'Supprimer le tag'` | Label ARIA du bouton de fermeture |
| content | `string` | `'Tag'` | Contenu par défaut si ng-content est vide |
| ariaLabel | `string` | `undefined` | Label ARIA personnalisé pour le tag |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| clicked | `OutputEmitterRef<MouseEvent>` | Émis lors du clic sur le tag (si non désactivé) |
| closed | `OutputEmitterRef<void>` | Émis lors du clic sur le bouton de fermeture |

### Types

```typescript
type TagVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type TagSize = 'small' | 'medium' | 'large';

interface TagConfig {
  variant: TagVariant;
  size: TagSize;
  icon?: string;
  closable: boolean;
  disabled: boolean;
  interactive?: boolean;
  closeLabel?: string;
  ariaLabels?: {
    close?: string;
    disabled?: string;
    status?: string;
  };
}
```

## Exemples Avancés

### Variantes de Style

```html
<psh-tag variant="primary">Primary</psh-tag>
<psh-tag variant="secondary">Secondary</psh-tag>
<psh-tag variant="success">Success</psh-tag>
<psh-tag variant="warning">Warning</psh-tag>
<psh-tag variant="danger">Danger</psh-tag>
```

### Tailles

```html
<psh-tag size="small">Small</psh-tag>
<psh-tag size="medium">Medium</psh-tag>
<psh-tag size="large">Large</psh-tag>
```

### Tags Interactifs

```typescript
@Component({
  template: `
    <psh-tag
      [interactive]="true"
      variant="secondary"
      icon="filter"
      (clicked)="applyFilter()"
    >
      Filtrer
    </psh-tag>
  `
})
export class FilterComponent {
  applyFilter() {
    console.log('Filter applied');
  }
}
```

### Liste de Tags Fermables

```typescript
@Component({
  template: `
    @for (tag of tags(); track tag.id) {
      <psh-tag
        [closable]="true"
        variant="primary"
        icon="tag"
        (closed)="removeTag(tag.id)"
      >
        {{ tag.label }}
      </psh-tag>
    }
  `
})
export class TagListComponent {
  tags = signal([
    { id: 1, label: 'Angular' },
    { id: 2, label: 'TypeScript' },
    { id: 3, label: 'RxJS' }
  ]);

  removeTag(id: number) {
    this.tags.update(tags => tags.filter(t => t.id !== id));
  }
}
```

## Configuration Globale

Vous pouvez configurer les valeurs par défaut pour tous les tags de votre application:

```typescript
import { TAG_CONFIG } from 'ps-helix';

@Component({
  providers: [
    {
      provide: TAG_CONFIG,
      useValue: {
        variant: 'secondary',
        size: 'small',
        closable: false,
        disabled: false,
        interactive: false,
        closeLabel: 'Retirer',
        ariaLabels: {
          close: 'Retirer le tag',
          disabled: 'Tag désactivé',
          status: 'État'
        }
      }
    }
  ]
})
export class AppComponent {}
```

### Styles Personnalisés

Pour des styles CSS personnalisés au niveau global:

```typescript
import { TAG_STYLES } from 'ps-helix';

@Component({
  providers: [
    {
      provide: TAG_STYLES,
      useValue: [
        { '--tag-padding-x': '12px' },
        { '--tag-font-size': '14px' }
      ]
    }
  ]
})
export class AppComponent {}
```

## Accessibilité

### Comportements Accessibles

- **Tags statiques** (`interactive: false`):
  - `role="status"` pour les lecteurs d'écran
  - `tabindex="-1"` (non focusable)
  - Label ARIA généré automatiquement depuis le contenu

- **Tags interactifs** (`interactive: true`):
  - `role="button"` pour indiquer l'interactivité
  - `tabindex="0"` (focusable au clavier)
  - Support des interactions clavier (`Enter`, `Space`)
  - Indicateur de focus visible

- **Bouton de fermeture**:
  - Label ARIA descriptif via `closeLabel`
  - Focusable et utilisable au clavier
  - Icône masquée des lecteurs d'écran (`aria-hidden="true"`)

### Navigation Clavier

| Touche | Action |
|--------|--------|
| `Tab` | Déplace le focus vers le tag interactif ou le bouton de fermeture |
| `Enter` / `Space` | Active le tag interactif ou ferme le tag |
| `Escape` | (Géré par le composant parent si nécessaire) |

### Labels ARIA

```html
<!-- Label automatique depuis le contenu -->
<psh-tag>Label Auto</psh-tag>

<!-- Label personnalisé -->
<psh-tag [ariaLabel]="'Statut: Nouveau message'">
  <i class="icon"></i>
</psh-tag>

<!-- Bouton de fermeture avec label descriptif -->
<psh-tag
  [closable]="true"
  [closeLabel]="'Retirer le filtre actif'"
>
  Actif
</psh-tag>
```

## Variables CSS Personnalisables

Le composant Tag utilise des variables CSS que vous pouvez surcharger:

```css
.tag {
  --tag-padding-y: var(--spacing-xs);
  --tag-padding-x: var(--spacing-sm);
  --tag-font-size: var(--font-size-sm);
  --tag-icon-size: var(--icon-size-sm);
  --tag-close-padding: var(--spacing-xxs);
  --tag-close-opacity: 0.7;
  --tag-close-opacity-hover: 1;
  --tag-close-hover-bg: rgba(0, 0, 0, 0.1);
  --tag-transition: all var(--animation-duration-normal) var(--animation-easing-default);
}
```

### Exemple de Personnalisation

```css
/* Dans votre CSS global ou component styles */
psh-tag {
  --tag-padding-x: 16px;
  --tag-font-size: 15px;
  --tag-close-hover-bg: rgba(255, 0, 0, 0.2);
}
```

## Bonnes Pratiques

### 1. Utilisation

- **Choisir la bonne variante**: Utiliser `success` pour les états positifs, `danger` pour les erreurs, `warning` pour les avertissements
- **Longueur du contenu**: Limiter à 20-30 caractères maximum pour maintenir la lisibilité
- **Icônes descriptives**: Choisir des icônes qui renforcent la compréhension du contenu
- **États désactivés**: Utiliser `disabled` pour les tags non actifs tout en les gardant visibles

### 2. Accessibilité

- **Tags statiques vs interactifs**: Utiliser `interactive` uniquement si le tag déclenche une action
- **Labels descriptifs**: Toujours fournir un `closeLabel` explicite pour les tags fermables
- **Contenu textuel**: Privilégier le texte aux icônes seules pour la clarté
- **États visuels**: Ne pas se reposer uniquement sur la couleur pour transmettre l'information

### 3. Performance

- **Signals**: Le composant utilise des signals Angular pour une réactivité optimale
- **OnPush**: Détection de changements optimisée automatiquement
- **Gestion des listes**: Utiliser `track` dans les boucles `@for` pour les listes de tags

### 4. UX

- **Feedback immédiat**: Les animations de hover et focus fournissent un retour visuel
- **Cohérence**: Maintenir une utilisation cohérente des variantes dans toute l'application
- **Groupement**: Espacer correctement les tags multiples (utiliser CSS gap ou margin)

### 5. Quand Utiliser les Tags

✅ **Bonnes utilisations**:
- Catégories ou labels
- Statuts ou états
- Filtres actifs (avec `closable`)
- Métadonnées visibles
- Badges de notification

❌ **À éviter**:
- Remplacer des boutons d'action principaux
- Texte long ou paragraphes
- Navigation principale
- Formulaires complexes

## Dépannage

### Le tag n'est pas cliquable

Assurez-vous que `interactive` est défini sur `true`:

```html
<psh-tag [interactive]="true" (clicked)="handleClick($event)">
  Cliquable
</psh-tag>
```

### L'icône ne s'affiche pas

Vérifiez que Phosphor Icons est correctement installé et importé:

```typescript
// Dans main.ts ou index.html
import '@phosphor-icons/web/regular';

// Ou dans index.html
<script src="node_modules/@phosphor-icons/web/src/regular/index.js"></script>
```

### Le bouton de fermeture ne fonctionne pas

Vérifiez que l'événement `closed` est bien géré et que le tag n'est pas `disabled`:

```html
<psh-tag
  [closable]="true"
  [disabled]="false"
  (closed)="onClose()"
>
  Tag
</psh-tag>
```

### Styles personnalisés non appliqués

Les variables CSS doivent être définies au niveau du composant parent:

```css
/* ✅ Correct */
.container psh-tag {
  --tag-padding-x: 20px;
}

/* ❌ Incorrect - trop spécifique */
psh-tag .tag {
  --tag-padding-x: 20px;
}
```

## Migration

### Depuis une version précédente

Si vous migrez depuis une version utilisant `@Input()` et `@Output()` decorators:

**Avant:**
```typescript
@Input() variant: TagVariant = 'primary';
@Output() clicked = new EventEmitter<MouseEvent>();
```

**Après:**
```typescript
readonly variant = input<TagVariant>('primary');
readonly clicked = output<MouseEvent>();
```

Le composant utilise maintenant les signals Angular pour une meilleure performance. Aucune modification n'est nécessaire dans vos templates.
