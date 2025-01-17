# Card Component

Le composant Card permet d'afficher du contenu structuré dans un conteneur visuel avec une mise en page cohérente.

## Installation

```typescript
import { LibCardComponent } from '@lib/components/card/card.component';

@Component({
  // ...
  imports: [LibCardComponent]
})
```

## Utilisation

### Basique
```html
<lib-card
  title="Card Title"
  description="Card description text"
>
  Content goes here
</lib-card>
```

### Avec image
```html
<lib-card
  title="Card with Image"
  description="Description text"
  imageUrl="path/to/image.jpg"
  imageAlt="Image description"
>
  Content
</lib-card>
```

### Avec bouton d'action
```html
<lib-card
  title="Interactive Card"
  buttonText="Learn More"
  buttonIcon="arrow-right"
>
  Content
</lib-card>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | CardVariant | 'default' | Style de la carte ('default', 'elevated', 'outlined') |
| size | CardSize | 'medium' | Taille de la carte ('small', 'medium', 'large') |
| title | string | '' | Titre de la carte |
| description | string | '' | Description de la carte |
| imageUrl | string | undefined | URL de l'image |
| imageAlt | string | '' | Texte alternatif de l'image |
| buttonText | string | '' | Texte du bouton d'action |
| buttonIcon | string | undefined | Icône du bouton d'action |
| buttonVariant | ButtonVariant | 'primary' | Variante du bouton |

## Accessibilité

- Utilise des balises sémantiques (article, h3)
- Support des textes alternatifs pour les images
- Structure hiérarchique claire
- Navigation au clavier