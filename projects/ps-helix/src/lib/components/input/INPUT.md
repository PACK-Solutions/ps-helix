# Input Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshInputComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshInputComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Input basique
<psh-input
  [(value)]="inputValue"
  (valueChange)="handleChange($event)"
  label="Nom d'utilisateur"
  placeholder="Entrez votre nom d'utilisateur"
>
</psh-input>

// Input avec slot pour le label
<psh-input
  [(value)]="inputValue"
  placeholder="Entrez votre email"
>
  <span input-label>Adresse email</span>
  <span input-hint>Nous ne partagerons jamais votre email</span>
</psh-input>

// Input avec icônes
<psh-input
  type="email"
  iconStart="envelope"
  label="Email"
  placeholder="exemple@email.com"
>
</psh-input>

// Input mot de passe avec toggle
<psh-input
  type="password"
  iconStart="lock"
  label="Mot de passe"
  placeholder="Votre mot de passe"
>
</psh-input>

// Input avec autocomplétion
<psh-input
  [suggestions]="cities"
  [autocompleteConfig]="{ minLength: 2, debounceTime: 300 }"
  label="Ville"
  placeholder="Rechercher une ville"
>
</psh-input>
```

## API

### Model Inputs (@model)

Propriétés à liaison bidirectionnelle pour les états dynamiques.

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| value | string | '' | Valeur de l'input |
| disabled | boolean | false | État désactivé |
| readonly | boolean | false | État lecture seule |
| loading | boolean | false | État chargement |

### Regular Inputs (@input)

Propriétés de configuration (unidirectionnelles).

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | InputVariant | 'outlined' | Style visuel de l'input |
| size | InputSize | 'medium' | Taille de l'input |
| fullWidth | boolean | false | Largeur complète |
| type | InputType | 'text' | Type de l'input |
| label | string | '' | Texte du label |
| showLabel | boolean | true | Afficher le label |
| placeholder | string | '' | Placeholder |
| ariaLabel | string | null | Label ARIA personnalisé |
| iconStart | string | undefined | Icône de début |
| iconEnd | string | undefined | Icône de fin |
| hint | string | undefined | Texte d'aide |
| error | string | undefined | Message d'erreur |
| success | string | undefined | Message de succès |
| required | boolean | false | Champ requis |
| suggestions | string[] \| ((query: string) => Promise<string[]>) | [] | Liste ou fonction de suggestions |
| autocompleteConfig | AutocompleteConfig | { minLength: 1, debounceTime: 300 } | Config autocomplétion |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| valueChange | EventEmitter<string> | Émis lors du changement |
| inputFocus | EventEmitter<void> | Émis lors du focus |
| inputBlur | EventEmitter<void> | Émis lors du blur |
| suggestionSelect | EventEmitter<string> | Émis lors de la sélection |

### Types

```typescript
type InputType = 'text' | 'password' | 'email' | 'tel' | 'url' | 'search' | 'date' | 'number';
type InputVariant = 'outlined' | 'filled';
type InputSize = 'small' | 'medium' | 'large';

interface AutocompleteConfig {
  minLength: number;     // Minimum de caractères avant recherche
  debounceTime: number;  // Délai en ms avant lancement de la recherche
}
```

## Slots de Contenu

Le composant supporte plusieurs slots pour personnaliser son contenu avec du HTML riche :

```html
<psh-input>
  <span input-label>Label personnalisé</span>
  <span input-hint>Texte d'aide</span>
  <span input-error>Message d'erreur</span>
  <span input-success>Message de succès</span>
</psh-input>
```

### Priorité Slots vs Inputs

Pour les messages (hint, error, success), vous pouvez utiliser soit la propriété input, soit le slot :

| Méthode | Cas d'utilisation |
|---------|-------------------|
| Input property (`error="Message"`) | Messages simples en texte brut |
| Slot (`<span input-error>...</span>`) | Contenu riche avec HTML, icônes, liens |

**Important** : Si les deux sont fournis, le slot est affiché visuellement. Il est recommandé d'utiliser une seule méthode pour éviter toute confusion.

```html
<!-- Utilisation avec input (texte simple) -->
<psh-input error="Ce champ est requis"></psh-input>

<!-- Utilisation avec slot (contenu riche) -->
<psh-input>
  <span input-error>
    <i class="ph ph-warning"></i> Ce champ est requis
  </span>
</psh-input>
```

## Variants Overview

### Text Input
**Description**: Input texte standard.

**Cas d'utilisation**:
- Saisie de texte simple
- Noms, descriptions
- Recherche

### Password Input
**Description**: Input sécurisé avec toggle de visibilité.

**Cas d'utilisation**:
- Mots de passe
- Codes secrets
- Données sensibles

### Email Input
**Description**: Input avec validation email.

**Cas d'utilisation**:
- Adresses email
- Validation format
- Contact forms

### Autocomplete Input
**Description**: Input avec suggestions.

**Cas d'utilisation**:
- Recherche avec suggestions
- Sélection dans une liste
- Aide à la saisie

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses (32px)
- `medium`: Taille par défaut (40px)
- `large`: Pour plus de visibilité (48px)

### États
- `disabled`: Input désactivé
- `readonly`: Lecture seule
- `loading`: Chargement
- `error`: Validation échouée
- `success`: Validation réussie

### Icônes
- `iconStart`: Icône au début
- `iconEnd`: Icône à la fin
- Support des icônes Phosphor

## Accessibilité

### Attributs ARIA
- `aria-label`: Description de l'input (utilise label, ariaLabel, ou placeholder)
- `aria-invalid`: État d'erreur
- `aria-required`: Champ requis
- `aria-describedby`: Lien avec les messages

### Bonnes Pratiques
- Labels descriptifs
- Messages d'erreur clairs
- Support du clavier
- États visuels distincts