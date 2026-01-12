# Switch Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshSwitchComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshSwitchComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Switch basique avec contenu par défaut
<psh-switch></psh-switch>

// Switch avec label et binding
<psh-switch
  [(checked)]="isEnabled"
  (checkedChange)="handleChange($event)"
>
  Activer les notifications
</psh-switch>

// Switch avec validation
<psh-switch
  [(checked)]="isAccepted"
  [required]="true"
  error="Ce champ est requis"
>
  Accepter les conditions
</psh-switch>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| checked | boolean | false | État coché |
| disabled | boolean | false | État désactivé |
| required | boolean | false | État requis |
| size | SwitchSize | 'medium' | Taille du switch |
| labelPosition | 'left' \| 'right' | 'right' | Position du label |

### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| label | string | '' | Label du switch |
| error | string | '' | Message d'erreur |
| success | string | '' | Message de succès |
| ariaLabel | string | undefined | Label ARIA personnalisé pour l'accessibilité |
| name | string | undefined | Attribut name de l'input natif |
| id | string | auto-généré | ID unique du switch (auto-généré si non fourni) |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| checkedChange | EventEmitter<boolean> | Émis lors du changement d'état |

## Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: SWITCH_CONFIG,
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
- `role="switch"`: Rôle sémantique
- `aria-checked`: État du switch
- `aria-disabled`: État désactivé
- `aria-required`: État requis
- `aria-invalid`: État d'erreur

### Bonnes Pratiques
- Labels descriptifs
- Support du clavier
- États visuels distincts
- Messages d'erreur vocaux

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