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

### Model Inputs (bidirectionnels avec `[()]`)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| checked | boolean | false | État coché |
| disabled | boolean | false | État désactivé |
| required | boolean | false | État requis |
| indeterminate | boolean | false | État indéterminé |

### Regular Inputs
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| label | string | '' | Label de la checkbox |
| error | string | '' | Message d'erreur |
| success | string | '' | Message de succès |
| ariaLabel | string \| undefined | undefined | Label ARIA pour l'accessibilité |
| size | CheckboxSize | 'medium' | Taille de la checkbox |
| labelPosition | 'left' \| 'right' | 'right' | Position du label |

### Outputs
Les model inputs génèrent automatiquement des events de changement :
- `checkedChange` : Émis lors du changement d'état coché
- `disabledChange` : Émis lors du changement d'état désactivé
- `requiredChange` : Émis lors du changement d'état requis
- `indeterminateChange` : Émis lors du changement d'état indéterminé

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
- `aria-checked`: État de la checkbox (true, false, mixed)
- `aria-required`: État requis (si applicable)
- `aria-invalid`: État d'erreur (si applicable)
- `aria-describedby`: Liaison aux messages d'erreur/succès

### Bonnes Pratiques
- Labels descriptifs via contenu projeté, input `label` ou `ariaLabel`
- Support du clavier (Tab, Espace, Entrée)
- États visuels distincts avec focus visible
- Messages d'erreur liés pour les lecteurs d'écran

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