# Progressbar Component

Le composant Progressbar permet d'afficher la progression d'une tâche ou d'un processus.

## Utilisation

1. Importer le composant dans votre composant standalone :
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

### Mode indéterminé
```html
<psh-progressbar mode="indeterminate"></psh-progressbar>
```

### Mode animé (strié avec animation)
```html
<psh-progressbar
  [value]="60"
  mode="animated"
></psh-progressbar>
```

### Position du label
```html
<psh-progressbar
  [value]="50"
  labelPosition="inline"
></psh-progressbar>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| value | number | 0 | Valeur actuelle de la progression |
| max | number | 100 | Valeur maximale |

### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| variant | ProgressbarVariant | 'primary' | Style visuel ('primary', 'secondary', 'success', 'warning', 'danger') |
| size | ProgressbarSize | 'medium' | Taille ('small', 'medium', 'large') |
| showLabel | boolean | true | Affiche le label de progression |
| mode | ProgressbarMode | 'default' | Mode d'affichage ('default', 'striped', 'animated', 'indeterminate') |
| label | string | undefined | Label personnalisé (par défaut affiche le pourcentage ou "Loading..." en mode indéterminé) |
| labelPosition | ProgressbarLabelPosition | 'top' | Position du label ('top', 'bottom', 'inline') |
| ariaLabel | string | undefined | Texte personnalisé pour aria-valuetext |

### Outputs (@output)
| Nom | Type | Description |
|-----|------|-------------|
| completed | void | Émis lorsque la valeur atteint le maximum |
| thresholdReached | number | Émis lorsque les seuils 25%, 50%, 75% sont atteints |

### Types
```typescript
type ProgressbarVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
type ProgressbarSize = 'small' | 'medium' | 'large';
type ProgressbarMode = 'default' | 'striped' | 'animated' | 'indeterminate';
type ProgressbarLabelPosition = 'top' | 'bottom' | 'inline';
```

### Configuration globale
```typescript
import { PROGRESSBAR_CONFIG } from 'ps-helix';

providers: [
  {
    provide: PROGRESSBAR_CONFIG,
    useValue: {
      variant: 'primary',
      size: 'medium',
      showLabel: true,
      mode: 'default',
      labelPosition: 'top'
    }
  }
]
```

## Accessibilité

- Rôle `progressbar` sur l'élément principal
- `aria-valuenow` : valeur actuelle (omis en mode indéterminé)
- `aria-valuemin` : toujours 0
- `aria-valuemax` : valeur maximale configurée
- `aria-valuetext` : description textuelle de la progression
- `aria-live="polite"` sur le conteneur pour annoncer les changements

## Exemple Complet

```typescript
import { Component, signal } from '@angular/core';
import { PshProgressbarComponent } from 'ps-helix';

@Component({
  selector: 'app-progressbar-demo',
  imports: [PshProgressbarComponent],
  template: `
    <psh-progressbar
      [value]="progress()"
      [max]="100"
      variant="primary"
      size="medium"
      [showLabel]="true"
      mode="animated"
      labelPosition="top"
      label="Téléchargement en cours..."
      (completed)="onCompleted()"
      (thresholdReached)="onThreshold($event)"
    ></psh-progressbar>
  `
})
export class ProgressbarDemoComponent {
  progress = signal(0);

  onCompleted() {
    console.log('Progression terminée !');
  }

  onThreshold(threshold: number) {
    console.log(`Seuil ${threshold}% atteint`);
  }
}
```

## Bonnes Pratiques

1. **Gestion des Valeurs**
   - Validation des bornes (0-100%)
   - Calcul optimisé du pourcentage
   - Gestion des cas limites

2. **Accessibilité**
   - Labels descriptifs avec `label` ou `ariaLabel`
   - Support des lecteurs d'écran
   - États visuels distincts

3. **Performance**
   - Utilisation des signals
   - Détection de changements OnPush
   - Animations optimisées via CSS
