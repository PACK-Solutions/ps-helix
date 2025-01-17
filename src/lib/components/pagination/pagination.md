# Pagination Component

Le composant Pagination permet de naviguer à travers une liste de pages.

## Installation

```typescript
import { LibPaginationComponent } from '@lib/components/pagination/pagination.component';

@Component({
  // ...
  imports: [LibPaginationComponent]
})
```

## Utilisation

### Basique
```html
<lib-pagination
  [currentPage]="1"
  [totalPages]="10"
  (pageChange)="onPageChange($event)"
></lib-pagination>
```

### Variante outline
```html
<lib-pagination
  [currentPage]="1"
  [totalPages]="10"
  variant="outline"
></lib-pagination>
```

### Sans boutons premier/dernier
```html
<lib-pagination
  [currentPage]="1"
  [totalPages]="10"
  [showFirstLast]="false"
></lib-pagination>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| currentPage | number | 1 | Page actuelle |
| totalPages | number | 1 | Nombre total de pages |
| size | string | 'medium' | Taille ('small', 'medium', 'large') |
| variant | string | 'default' | Style ('default', 'outline') |
| showFirstLast | boolean | true | Affiche les boutons premier/dernier |
| showPrevNext | boolean | true | Affiche les boutons précédent/suivant |
| maxVisiblePages | number | 5 | Nombre maximum de pages visibles |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| pageChange | EventEmitter<number> | Émis lors du changement de page |

## Accessibilité

- Support des attributs ARIA appropriés
- Navigation au clavier
- États désactivés gérés
- Labels traduits via ngx-translate