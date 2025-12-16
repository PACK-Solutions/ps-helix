# Checkbox Component Documentation

## Installation et Utilisation

### Installation

```typescript
import { PshCheckboxComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshCheckboxComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Checkbox basique
<psh-checkbox>Checkbox</psh-checkbox>

// Checkbox avec binding
<psh-checkbox
  [(checked)]="isChecked"
  (checkedChange)="handleChange($event)"
>
  Accepter les conditions
</psh-checkbox>

// Checkbox avec validation
<psh-checkbox
  [(checked)]="isAccepted"
  [required]="true"
  error="Ce champ est requis"
>
  Accepter les conditions
</psh-checkbox>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| checked | boolean | false | État coché |
| disabled | boolean | false | État désactivé |
| required | boolean | false | État requis |
| indeterminate | boolean | false | État indéterminé |
| size | CheckboxSize | 'medium' | Taille de la checkbox |
| labelPosition | 'left' \| 'right' | 'right' | Position du label |

### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| label | string | '' | Label de la checkbox |
| error | string | '' | Message d'erreur |
| success | string | '' | Message de succès |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| checkedChange | EventEmitter<boolean> | Émis lors du changement d'état |

### Types

```typescript
type CheckboxSize = 'small' | 'medium' | 'large';
```

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses
- `medium`: Taille par défaut
- `large`: Pour plus de visibilité

### États
- `checked`: État coché
- `indeterminate`: État indéterminé
- `disabled`: État désactivé
- `required`: État requis

## Accessibilité

### Attributs ARIA
- `role="checkbox"`: Rôle sémantique
- `aria-checked`: État de la checkbox
- `aria-disabled`: État désactivé
- `aria-required`: État requis
- `aria-invalid`: État d'erreur

### Bonnes Pratiques
- Labels descriptifs
- Support du clavier
- États visuels distincts
- Messages d'erreur vocaux

## Exemple Complet

```typescript
@Component({
  template: `
    <psh-checkbox
      [(checked)]="isAccepted"
      [required]="true"
      [disabled]="isDisabled"
      size="medium"
      labelPosition="right"
      error="Ce champ est requis"
      (checkedChange)="handleChange($event)"
    >
      J'accepte les conditions
    </psh-checkbox>
  `
})
export class CheckboxExampleComponent {
  isAccepted = false;
  isDisabled = false;

  handleChange(checked: boolean) {
    console.log('Checkbox changed:', checked);
  }
}
```

## Bonnes Pratiques

1. **Hiérarchie Visuelle**
   - Taille appropriée selon le contexte
   - États visuels clairs
   - Feedback immédiat

2. **Accessibilité**
   - Labels descriptifs
   - Support du clavier
   - États ARIA appropriés

3. **Performance**
   - Utilisation des signals
   - Détection de changements OnPush
   - Gestion efficace des états

4. **UX**
   - Feedback immédiat
   - Animations fluides
   - États visuels clairs
   - Gestion des erreurs