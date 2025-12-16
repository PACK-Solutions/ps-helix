# Radio Component Documentation

## Installation et Utilisation

### Installation

1. Installer le package via npm :
```bash
npm install ps-helix
```

2. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshRadioComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshRadioComponent],
  // ...
})
```

### Utilisation de Base

```typescript
@Component({
  template: `
    <!-- Radio basique -->
    <psh-radio
      name="options"
      value="1"
      [checked]="selectedValue === '1'"
      (valueChange)="handleChange($event)"
    >
      Option 1
    </psh-radio>

    <!-- Radio avec validation -->
    <psh-radio
      name="options"
      value="2"
      [required]="true"
      [error]="'This field is required'"
    >
      Option 2
    </psh-radio>

    <!-- Radio avec label à gauche -->
    <psh-radio
      name="options"
      value="3"
      labelPosition="left"
    >
      Option 3
    </psh-radio>
  `
})
export class ExampleComponent {
  selectedValue = '1';

  handleChange(value: string) {
    console.log('Radio changed:', value);
  }
}
```

### API

#### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| checked | boolean | false | État coché |
| disabled | boolean | false | État désactivé |
| required | boolean | false | État requis |
| size | RadioSize | 'medium' | Taille du radio |
| labelPosition | 'left' \| 'right' | 'right' | Position du label |

#### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| label | string | '' | Label du radio |
| error | string | '' | Message d'erreur |
| success | string | '' | Message de succès |
| name | string | '' | Nom du groupe |
| value | any | undefined | Valeur associée |

#### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| valueChange | EventEmitter<any> | Émis lors de la sélection |

### Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: RADIO_CONFIG,
      useValue: {
        checked: false,
        disabled: false,
        required: false,
        size: 'medium',
        labelPosition: 'right'
      }
    }
  ]
})
```

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses
- `medium`: Taille par défaut
- `large`: Pour plus de visibilité

### États
- `checked`: État coché
- `disabled`: État désactivé
- `required`: État requis
- `error`: État d'erreur
- `success`: État de succès

### Position du Label
- `left`: Label à gauche
- `right`: Label à droite (défaut)

## Accessibilité

### Attributs ARIA
- `role="radio"`: Rôle sémantique
- `aria-checked`: État du radio
- `aria-disabled`: État désactivé
- `aria-required`: État requis
- `aria-invalid`: État d'erreur

### Bonnes Pratiques
- Labels descriptifs
- Support du clavier
- États visuels distincts
- Messages d'erreur/succès clairs

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

4. **Groupes de Radios**
   - Utiliser le même `name` pour les radios liés
   - Gérer la sélection exclusive
   - Maintenir la cohérence des valeurs