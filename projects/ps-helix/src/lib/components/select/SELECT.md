# Select Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshSelectComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshSelectComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Select basique
<psh-select
  [(value)]="selectedValue"
  [options]="options"
  (valueChange)="handleChange($event)"
>
  <span select-label>Sélectionner une option</span>
  <span select-hint>Choisissez parmi la liste</span>
</psh-select>

// Select avec recherche
<psh-select
  [(value)]="selectedValue"
  [options]="options"
  [searchable]="true"
  [placeholder]="'Rechercher...'"
>
  <span select-label>Recherche</span>
</psh-select>

// Select multiple
<psh-select
  [(value)]="selectedValues"
  [options]="options"
  [multiple]="true"
  [clearable]="true"
  [fullWidth]="true"
>
  <span select-label>Sélection multiple</span>
</psh-select>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| value | any | null | Valeur sélectionnée |
| disabled | boolean | false | État désactivé |
| required | boolean | false | État requis |
| size | SelectSize | 'medium' | Taille du select |
| searchable | boolean | false | Active la recherche |
| multiple | boolean | false | Sélection multiple |
| clearable | boolean | false | Permet d'effacer la sélection |
| loading | boolean | false | État de chargement |
| fullWidth | boolean | false | Largeur complète |

### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| options | SelectOption[] | [] | Liste des options |
| label | string | '' | Label du select |
| placeholder | string | 'Sélectionner une option' | Placeholder |
| multiplePlaceholder | string | 'Sélectionner des options' | Placeholder en mode multiple |
| searchPlaceholder | string | 'Rechercher' | Placeholder de recherche |
| error | string | '' | Message d'erreur |
| success | string | '' | Message de succès |
| hint | string | '' | Texte d'aide |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| valueChange | EventEmitter<any> | Émis lors de la sélection |
| opened | EventEmitter<void> | Émis à l'ouverture |
| closed | EventEmitter<void> | Émis à la fermeture |
| searched | EventEmitter<string> | Émis lors de la recherche |

### Interface SelectOption
```typescript
interface SelectOption {
  label: string;    // Label à afficher
  value: any;       // Valeur associée
  icon?: string;    // Icône Phosphor
  disabled?: boolean; // État désactivé
}
```

## Variants Overview

### Basic Select
**Description**: Select simple pour une sélection unique.

**Cas d'utilisation**:
- Sélection d'une option parmi plusieurs
- Formulaires simples
- Choix uniques

### Searchable Select
**Description**: Select avec fonction de recherche.

**Cas d'utilisation**:
- Longues listes d'options
- Recherche rapide
- Amélioration de l'UX

### Multiple Select
**Description**: Select permettant la sélection multiple.

**Cas d'utilisation**:
- Sélection de plusieurs options
- Tags multiples
- Filtres complexes

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses (32px)
- `medium`: Taille par défaut (40px)
- `large`: Pour plus de visibilité (48px)

### États
- `disabled`: Select désactivé
- `loading`: Chargement des options
- `error`: Validation échouée
- `success`: Validation réussie

## Accessibilité

### Attributs ARIA
- `role="combobox"`: Pour le select
- `role="listbox"`: Pour la liste d'options
- `role="option"`: Pour chaque option
- `aria-expanded`: État d'ouverture
- `aria-selected`: État de sélection
- `aria-disabled`: État désactivé
- `aria-invalid`: État d'erreur

### Bonnes Pratiques
- Navigation complète au clavier
- Support des lecteurs d'écran
- États visuels distincts
- Messages d'erreur vocaux

## Exemple Complet

```typescript
@Component({
  template: `
    <psh-select
      [(value)]="selectedCountry"
      [options]="countries"
      [searchable]="true"
      [clearable]="true"
      [required]="true"
      [fullWidth]="true"
      size="medium"
      placeholder="Sélectionner un pays"
      searchPlaceholder="Rechercher un pays..."
      (valueChange)="handleCountryChange($event)"
      (searched)="handleSearch($event)"
    >
      <span select-label>Pays</span>
      <span select-hint>Sélectionnez votre pays de résidence</span>
      <span select-error>Ce champ est requis</span>
    </psh-select>
  `
})
export class SelectDemoComponent {
  selectedCountry = '';
  
  countries = [
    { label: 'France', value: 'FR' },
    { label: 'Allemagne', value: 'DE' },
    { label: 'Italie', value: 'IT' },
    { label: 'Espagne', value: 'ES' },
    { label: 'Royaume-Uni', value: 'UK' }
  ];

  handleCountryChange(value: string) {
    console.log('Pays sélectionné:', value);
  }

  handleSearch(term: string) {
    console.log('Recherche:', term);
  }
}
```