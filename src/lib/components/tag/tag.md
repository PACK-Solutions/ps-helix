# Tag Component

Le composant Tag permet d'afficher des étiquettes, des badges ou des statuts de manière concise et visuelle.

## Installation

```typescript
import { LibTagComponent } from '@lib/components/tag/tag.component';

@Component({
  // ...
  imports: [LibTagComponent]
})
```

## Utilisation

### Basique
```html
<lib-tag>Basic Tag</lib-tag>
```

### Avec variante
```html
<lib-tag variant="success">Success</lib-tag>
```

### Avec icône
```html
<lib-tag icon="check">Verified</lib-tag>
```

### Fermable
```html
<lib-tag 
  closable="true" 
  (closed)="handleClose()"
>
  Closable Tag
</lib-tag>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | TagVariant | 'primary' | Style du tag ('primary', 'secondary', 'success', 'warning', 'danger') |
| size | TagSize | 'medium' | Taille du tag ('small', 'medium', 'large') |
| icon | string | undefined | Nom de l'icône Phosphor à afficher |
| closable | boolean | false | Affiche un bouton de fermeture |
| disabled | boolean | false | Désactive le tag |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| clicked | EventEmitter<MouseEvent> | Émis lors du clic sur le tag |
| closed | EventEmitter<void> | Émis lors du clic sur le bouton de fermeture |

## Accessibilité

- Utilise le rôle "status" pour les lecteurs d'écran
- Support de la navigation au clavier
- Labels ARIA pour le bouton de fermeture
- États désactivés correctement gérés