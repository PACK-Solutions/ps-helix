# Collapse Component

Le composant Collapse permet de créer des sections de contenu pliables/dépliables.

## Installation

```typescript
import { PshCollapseComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshCollapseComponent]
})
```

## Utilisation

### Basique

```html
<psh-collapse header="Titre de la section">
  Contenu de la section
</psh-collapse>
```

### Avec contenu personnalisé pour l'en-tête

```html
<psh-collapse>
  <div collapse-header>
    <i class="ph ph-info"></i>
    Titre personnalisé
  </div>
  Contenu de la section
</psh-collapse>
```

### Variante outline

```html
<psh-collapse
  variant="outline"
  header="Section avec bordure"
>
  Contenu de la section
</psh-collapse>
```

## API

### Inputs

| Nom      | Type                           | Défaut       | Description            |
| -------- | ------------------------------ | ------------ | ---------------------- |
| expanded | boolean                        | false        | État d'expansion       |
| disabled | boolean                        | false        | Désactive le composant |
| icon     | string                         | 'caret-down' | Icône d'expansion      |
| variant  | 'default' \| 'outline'         | 'default'    | Style visuel           |
| size     | 'small' \| 'medium' \| 'large' | 'medium'     | Taille du composant    |
| header   | string                         | ''           | Titre de la section    |

### Outputs

| Nom            | Type                  | Description                    |
| -------------- | --------------------- | ------------------------------ |
| expandedChange | EventEmitter<boolean> | Émis lors du changement d'état |

## Accessibilité

- Support des attributs ARIA appropriés
- Navigation au clavier
- États désactivés gérés
- Contenu traduit via ngx-translate
