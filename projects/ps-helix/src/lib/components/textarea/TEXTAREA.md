# Textarea Component Documentation

## Utilisation

1. Importer le composant standalone :

```typescript
import { PshTextareaComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshTextareaComponent, ReactiveFormsModule],
  // ...
})
```

### Utilisation de Base

```html
<!-- Two-way binding simple (compatible Signal Forms) -->
<psh-textarea
  label="Biographie"
  placeholder="Parlez de vous..."
  helperText="Décrivez-vous en quelques phrases."
  [(value)]="bioValue"
/>

<!-- Reactive Forms avec validation -->
<psh-textarea
  label="Commentaire"
  [maxLength]="200"
  [showCharacterCount]="true"
  [required]="true"
  [formControl]="commentControl"
/>

<!-- Auto-dimensionnement -->
<psh-textarea
  label="Message"
  [autoSize]="true"
  resize="none"
  [(value)]="messageValue"
/>
```

## API

### Model Inputs (@model)

Propriétés à liaison bidirectionnelle. `value` est la source de vérité unique partagée entre `ControlValueAccessor` et `FormValueControl`.

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| value | string | '' | Valeur courante du textarea |
| disabled | boolean | false | État désactivé |
| readonly | boolean | false | État lecture seule |

### Regular Inputs (@input)

Propriétés de configuration (unidirectionnelles).

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| label | string | **requis** | Texte du label associé (via `input.required()`) |
| placeholder | string | '' | Texte indicatif |
| helperText | string | '' | Texte d'aide sous le champ |
| rows | number | 4 | Nombre de lignes visibles |
| maxLength | number \| undefined | undefined | Longueur maximale autorisée |
| showCharacterCount | boolean | false | Afficher le compteur de caractères |
| resize | TextareaResize | 'vertical' | Sens de redimensionnement |
| autoSize | boolean | false | Ajuste la hauteur au contenu via `effect()` |
| variant | TextareaVariant | 'outlined' | Style visuel |
| size | TextareaSize | 'medium' | Taille du champ |
| fullWidth | boolean | false | Largeur complète |
| required | boolean | false | Champ requis (attribut HTML + ARIA) |
| showLabel | boolean | true | Afficher le label |
| ariaLabel | string \| null | null | Label ARIA personnalisé |
| error | string \| null | null | Message d'erreur personnalisé |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| valueChange | EventEmitter<string> | Émis à chaque modification de la valeur |
| textareaFocus | EventEmitter<void> | Émis au focus |
| textareaBlur | EventEmitter<void> | Émis au blur |

### Types

```typescript
type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';
type TextareaSize = 'small' | 'medium' | 'large';
type TextareaVariant = 'outlined' | 'filled';
```

## Intégration Forms

Le composant implémente simultanément deux contrats d'intégration aux formulaires Angular.

### Reactive Forms (ControlValueAccessor)

Compatible `[formControl]`, `[formControlName]` et `[(ngModel)]`. L'injection optionnelle de `NgControl` permet de détecter automatiquement l'état `invalid && (touched || dirty)` pour afficher l'erreur.

```typescript
commentControl = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.maxLength(200)]
});
```

```html
<psh-textarea
  label="Commentaire"
  [formControl]="commentControl"
  [maxLength]="200"
  [showCharacterCount]="true"
/>
```

### Signal Forms (Angular 21+)

Le composant expose un `model<string>` qui constitue un `FormValueControl<string>` natif. Utilisable directement via `[(value)]` ou `[field]` une fois Signal Forms disponible.

```typescript
// Angular 21+ (Signal Forms)
myForm = form(signal({ bio: '' }), p => {
  required(p.bio);
});
```

```html
<!-- Signal Forms -->
<psh-textarea label="Biographie" [field]="myForm.bio" />

<!-- Pattern two-way signal (Angular 20+) -->
<psh-textarea label="Biographie" [(value)]="bioValue" />
```

## États et Modificateurs

### Tailles
- `small` : Interfaces denses
- `medium` : Taille par défaut
- `large` : Mise en avant

### Variantes
- `outlined` : Bordure prononcée (défaut)
- `filled` : Fond coloré, bordure discrète

### États visuels
- `disabled` : Champ désactivé
- `readonly` : Lecture seule
- `error` : Validation échouée (via `error` input, dépassement de `maxLength`, ou `NgControl.invalid && touched`)
- `focused` : Champ actif

### Resize
- `none` : Redimensionnement désactivé (recommandé avec `autoSize`)
- `vertical` : Hauteur uniquement (défaut)
- `horizontal` : Largeur uniquement
- `both` : Les deux axes

## Accessibilité

### Attributs ARIA gérés
- `aria-label` : Dérivé de `ariaLabel`, `label` ou `placeholder`
- `aria-invalid` : Reflète l'état d'erreur
- `aria-required` : Reflète `required`
- `aria-describedby` : Liste dynamique des IDs (helper, compteur, erreur)
- `aria-live="polite"` sur le compteur de caractères

### Bonnes Pratiques
- Associer systématiquement un `label` descriptif (via `input.required`)
- Utiliser `helperText` pour guider l'utilisateur, `error` pour signaler un problème
- Conserver le focus visible (jamais de `outline: none` sans remplacement)
- Activer `showCharacterCount` lorsque `maxLength` est défini
- Respecter un contraste minimum WCAG 2.1 AA pour tous les états
