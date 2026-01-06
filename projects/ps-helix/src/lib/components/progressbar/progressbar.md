# Progressbar Component

Le composant Progressbar permet d'afficher la progression d'une tache ou d'un processus.

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshProgressbarComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshProgressbarComponent]
})
```

### Basique
```html
<psh-progressbar [value]="50"></psh-progressbar>
```

### Avec variante
```html
<psh-progressbar 
  [value]="75"
  variant="success"
></psh-progressbar>
```

### Indéterminé
```html
<psh-progressbar [indeterminate]="true"></psh-progressbar>
```

## API

### Model Inputs (@model)
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

### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| label | string | 'Loading...' | Label pour l'état indéterminé |

## Accessibilité

- Support complet des attributs ARIA
- Rôle progressbar
- Valeurs min/max/actuelle
- Description textuelle de la progression

## Exemple Complet

```typescript
import { Component } from '@angular/core';
import { PshProgressbarComponent } from 'ps-helix';

@Component({
  selector: 'app-progressbar-demo',
  standalone: true,
  imports: [PshProgressbarComponent],
  template: `
    <psh-progressbar
      [value]="progress"
      [max]="100"
      variant="primary"
      size="medium"
      [showLabel]="true"
      [striped]="true"
      [animated]="true"
      label="Chargement en cours..."
    ></psh-progressbar>
  `
})
export class ProgressbarDemoComponent {
  progress = 75;
}
```

## Bonnes Pratiques

1. **Gestion des Valeurs**
   - Validation des bornes (0-100%)
   - Calcul optimisé du pourcentage
   - Gestion des cas limites

2. **Accessibilité**
   - Labels descriptifs
   - Support des lecteurs d'écran
   - États visuels distincts

3. **Performance**
   - Utilisation des signals
   - Détection de changements OnPush
   - Animations optimisées