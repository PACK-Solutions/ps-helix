# Tooltip Component

Le composant Tooltip permet d'afficher des informations supplémentaires au survol ou au focus d'un élément.

## Installation

```typescript
import { LibTooltipComponent } from '@lib/components/tooltip/tooltip.component';

@Component({
  // ...
  imports: [LibTooltipComponent]
})
```

## Utilisation

### Basique
```html
<lib-tooltip content="Info supplémentaire">
  <button>Survolez-moi</button>
</lib-tooltip>
```

### Position personnalisée
```html
<lib-tooltip 
  content="Tooltip à droite"
  position="right"
>
  <button>Tooltip à droite</button>
</lib-tooltip>
```

### Variante claire
```html
<lib-tooltip 
  content="Tooltip clair"
  variant="light"
>
  <button>Style clair</button>
</lib-tooltip>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| content | string | '' | Contenu du tooltip |
| position | TooltipPosition | 'top' | Position ('top', 'right', 'bottom', 'left') |
| variant | 'light' \| 'dark' | 'dark' | Style visuel du tooltip |
| showDelay | number | 200 | Délai avant affichage (ms) |
| hideDelay | number | 100 | Délai avant masquage (ms) |
| maxWidth | number | 200 | Largeur maximale en pixels |

## Accessibilité

- Support des attributs ARIA appropriés
- Navigation au clavier (focus/blur)
- Délais d'affichage configurables
- Contenu traduit via ngx-translate