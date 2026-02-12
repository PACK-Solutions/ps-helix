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
// Switch basique avec contenu par defaut
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

### Utilisation avec les Formulaires Angular

Le composant implemente `ControlValueAccessor` et s'integre avec les formulaires Angular :

```typescript
// Avec Reactive Forms
<psh-switch formControlName="notifications">
  Activer les notifications
</psh-switch>

// Avec ngModel
<psh-switch [(ngModel)]="isEnabled">
  Mode actif
</psh-switch>

// Exemple complet avec FormGroup
@Component({
  template: `
    <form [formGroup]="form">
      <psh-switch formControlName="newsletter">
        S'abonner a la newsletter
      </psh-switch>
    </form>
  `
})
export class MyComponent {
  form = new FormGroup({
    newsletter: new FormControl(false)
  });
}
```

## API

### Inputs bidirectionnels (avec `[()]`)

Ces inputs supportent le two-way binding avec la syntaxe `[(prop)]`.

| Nom | Type | Defaut | Description |
|-----|------|---------|-------------|
| checked | boolean | false | Etat coche |
| disabled | boolean | false | Etat desactive |

### Regular Inputs

| Nom | Type | Defaut | Description |
|-----|------|---------|-------------|
| required | boolean | false | Etat requis |
| size | SwitchSize | 'medium' | Taille du switch |
| labelPosition | 'left' \| 'right' | 'right' | Position du label |
| label | string | '' | Label du switch |
| error | string | '' | Message d'erreur |
| success | string | '' | Message de succes |
| ariaLabel | string | undefined | Label ARIA personnalise pour l'accessibilite |
| name | string | undefined | Attribut name de l'input natif |
| id | string | auto-genere | ID unique du switch (auto-genere si non fourni) |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| checkedChange | EventEmitter\<boolean\> | Emis lors du changement d'etat coche par l'utilisateur |
| disabledChange | EventEmitter\<boolean\> | Emis lors du changement d'etat desactive par l'utilisateur |

> Les outputs ne sont pas emis lors des appels `writeValue()` ou `setDisabledState()` (ControlValueAccessor), ce qui evite les boucles infinies avec les Reactive Forms.

### Methodes Publiques

| Methode | Description |
|---------|-------------|
| `toggle()` | Bascule l'etat du switch (si non desactive) |
| `focus()` | Donne le focus au switch |
| `blur()` | Retire le focus du switch |

```typescript
// Exemple d'utilisation programmatique
@ViewChild(PshSwitchComponent) switch!: PshSwitchComponent;

activerSwitch() {
  this.switch.toggle();
}

mettreEnFocus() {
  this.switch.focus();
}
```

### Classes CSS Host

Le composant applique ces classes sur l'element host pour faciliter le styling :

| Classe | Condition |
|--------|-----------|
| `switch-wrapper` | Toujours presente |
| `switch-disabled` | Quand `disabled()` est true |
| `switch-error` | Quand `error()` est non vide |
| `switch-success` | Quand `success()` est non vide |

## Configuration Globale

Vous pouvez configurer les valeurs par defaut en injectant `SWITCH_CONFIG` :

```typescript
import { SWITCH_CONFIG } from 'ps-helix';

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

## Etats et Modificateurs

### Tailles
- `small`: Pour les interfaces denses
- `medium`: Taille par defaut
- `large`: Pour plus de visibilite

### Etats
- `checked`: Etat coche
- `disabled`: Etat desactive
- `required`: Etat requis
- `error`: Etat d'erreur (affiche un message)
- `success`: Etat de succes (affiche un message)

### Position du Label
- `left`: Label a gauche
- `right`: Label a droite (defaut)

## Accessibilite

### Attributs ARIA utilises
- `aria-label`: Label accessible (utilise `ariaLabel`, `label`, ou "Switch" par defaut)
- `aria-checked`: Etat coche du switch
- `aria-required`: Indique si le champ est requis
- `aria-invalid`: Indique un etat d'erreur
- `aria-describedby`: Lie aux messages d'erreur/succes

### Elements semantiques
- Utilise un `<input type="checkbox">` natif avec l'attribut `disabled`
- Messages d'erreur avec `role="alert"` et `aria-live="polite"`
- Messages de succes avec `role="status"` et `aria-live="polite"`

### Bonnes Pratiques
- Fournir un label descriptif via `label`, `ariaLabel`, ou contenu projete
- Les messages d'erreur/succes sont automatiquement annonces aux lecteurs d'ecran
- Support complet du clavier (Tab, Space, Enter)
- Focus visible sur l'element interactif

## Bonnes Pratiques

1. **Hierarchie Visuelle**
   - Taille appropriee selon le contexte
   - Etats visuels clairs
   - Feedback immediat

2. **Accessibilite**
   - Labels descriptifs
   - Support du clavier
   - Etats ARIA appropries

3. **Performance**
   - Utilisation des signals
   - Detection de changements OnPush
   - Gestion efficace des etats

4. **UX**
   - Feedback immediat
   - Animations fluides
   - Etats visuels clairs
   - Gestion des erreurs
