# Textarea Component Documentation

**Implements**: `FormValueControl<string>` (Signal Forms) + `ControlValueAccessor` (Reactive Forms)

## Utilisation

```typescript
import { PshTextareaComponent } from 'ps-helix';

@Component({
  imports: [PshTextareaComponent],
})
export class MyComponent {}
```

### Signal Forms (Angular 21+)

```typescript
import { signal } from '@angular/core';
import { form, required, maxLength } from '@angular/forms/signals';

model = signal({ description: '' });
profileForm = form(this.model, (p) => {
  required(p.description, { message: 'Description requise' });
  maxLength(p.description, 500, { message: 'Max 500 caracteres' });
});
```

```html
<psh-textarea
  [control]="profileForm.description"
  label="Description"
  [maxLength]="500"
  [showCharacterCount]="true"
  [autoSize]="true"
></psh-textarea>
```

### Reactive Forms

```typescript
import { FormControl, Validators } from '@angular/forms';

control = new FormControl('', {
  nonNullable: true,
  validators: [Validators.required, Validators.maxLength(500)],
});
```

```html
<psh-textarea
  [formControl]="control"
  label="Description"
  [maxLength]="500"
  [showCharacterCount]="true"
  hint="Decrivez votre demande en quelques lignes"
></psh-textarea>
```

## API

| Input                | Type                                              | Default      | Description                                                |
| -------------------- | ------------------------------------------------- | ------------ | ---------------------------------------------------------- |
| `label`              | `string`                                          | `''`         | Libelle associe au champ                                   |
| `placeholder`        | `string`                                          | `''`         | Texte d'aide affiche dans le champ vide                    |
| `hint`               | `string \| null`                                  | `null`       | Message d'aide sous le champ                               |
| `error`              | `string \| null`                                  | `null`       | Message d'erreur (active l'etat rouge)                     |
| `success`            | `string \| null`                                  | `null`       | Message de succes (active l'etat vert)                     |
| `rows`               | `number`                                          | `4`          | Nombre de lignes par defaut                                |
| `maxLength`          | `number \| undefined`                             | `undefined`  | Longueur maximale (applique l'attribut natif `maxlength`)  |
| `showCharacterCount` | `boolean`                                         | `false`      | Affiche un compteur de caracteres                          |
| `resize`             | `'none' \| 'vertical' \| 'horizontal' \| 'both'`  | `'vertical'` | Comportement de redimensionnement manuel                   |
| `autoSize`           | `boolean`                                         | `false`      | Redimensionne automatiquement la hauteur (force resize=none) |
| `variant`            | `'outlined' \| 'filled'`                          | `'outlined'` | Variante visuelle                                          |
| `size`               | `'small' \| 'medium' \| 'large'`                  | `'medium'`   | Taille du champ                                            |
| `fullWidth`          | `boolean`                                         | `false`      | Occupe 100% du conteneur parent                            |
| `required`           | `boolean`                                         | `false`      | Marque le champ comme requis (visuel + ARIA)               |
| `readonly`           | `boolean`                                         | `false`      | Lecture seule                                              |
| `disabled`           | `boolean`                                         | `false`      | Desactive le champ                                         |
| `showLabel`          | `boolean`                                         | `true`       | Affiche le label                                           |
| `ariaLabel`          | `string \| null`                                  | `null`       | Surcharge l'aria-label                                     |

| Output       | Type           | Description                      |
| ------------ | -------------- | -------------------------------- |
| `inputFocus` | `EventEmitter` | Declenche lorsque le champ recoit le focus |
| `inputBlur`  | `EventEmitter` | Declenche lorsque le champ perd le focus   |

## Architecture hybride

Le composant expose sa valeur via `model<string>('')` et implemente a la fois :

- `ControlValueAccessor` : compatibilite Reactive Forms (methodes `writeValue`, `registerOnChange`, `registerOnTouched`, `setDisabledState`).
- `FormValueControl<string>` : compatibilite Signal Forms (propriete `value` reactive).

Un `NgControl` injecte en mode `self` + `optional` permet de detecter automatiquement l'etat `invalid && touched` et d'activer l'etat d'erreur visuel sans necessiter la propriete `error`.

## Auto-resize

Lorsque `autoSize` est actif, un `effect()` lie au signal `value()` recalcule la hauteur du textarea (`scrollHeight`). La propriete `resize` est automatiquement forcee a `'none'` pour eviter les conflits.

## Accessibilite (WCAG 2.1 AA)

- Label associe au textarea via `for` / `id`
- `aria-required`, `aria-invalid`, `aria-describedby` alimentes automatiquement
- Messages d'erreur en `role="alert"`, messages de succes en `role="status"`
- Compteur de caracteres annonce via `aria-live="polite"`
- Focus ring visible, contrastes conformes au design system
