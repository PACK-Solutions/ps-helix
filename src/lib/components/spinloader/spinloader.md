# SpinLoader Component

Le composant SpinLoader permet d'afficher des animations de chargement personnalisables.

## Installation

```typescript
import { LibSpinLoaderComponent } from '@lib/components/spinloader/spinloader.component';

@Component({
  // ...
  imports: [LibSpinLoaderComponent]
})
```

## Utilisation

### Basique
```html
<lib-spinloader></lib-spinloader>
```

### Avec variante
```html
<lib-spinloader 
  variant="dots"
  color="primary"
></lib-spinloader>
```

### Avec label
```html
<lib-spinloader 
  label="SPINLOADER.LOADING"
  size="large"
></lib-spinloader>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | SpinLoaderVariant | 'circle' | Style d'animation ('circle', 'dots', 'pulse') |
| size | SpinLoaderSize | 'medium' | Taille ('small', 'medium', 'large') |
| color | string | 'primary' | Couleur de l'animation |
| label | string | '' | Label traduit à afficher |

## Accessibilité

- Utilise role="status" pour les lecteurs d'écran
- Support des labels traduits
- Animations optimisées pour réduire la charge CPU