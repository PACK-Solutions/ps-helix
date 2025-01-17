# ProgressBar Component

Le composant ProgressBar permet d'afficher la progression d'une tâche ou d'un processus.

## Installation

```typescript
import { LibProgressbarComponent } from '@lib/components/progressbar/progressbar.component';

@Component({
  // ...
  imports: [LibProgressbarComponent]
})
```

## Utilisation

### Basique
```html
<lib-progressbar [value]="50"></lib-progressbar>
```

### Avec variante
```html
<lib-progressbar 
  [value]="75"
  variant="success"
></lib-progressbar>
```

### Indéterminé
```html
<lib-progressbar [indeterminate]="true"></lib-progressbar>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| value | number | 0 | Valeur actuelle |
| max | number | 100 | Valeur maximale |
| variant | ProgressbarVariant | 'primary' | Style visuel |
| size | ProgressbarSize | 'medium' | Taille |
| showLabel | boolean | true | Affiche le pourcentage |
| indeterminate | boolean | false | Mode indéterminé |
| striped | boolean | false | Effet strié |
| animated | boolean | false | Animation du motif strié |

## Accessibilité

- Utilise les attributs ARIA appropriés
- Support des états indéterminés
- Labels traduits via ngx-translate