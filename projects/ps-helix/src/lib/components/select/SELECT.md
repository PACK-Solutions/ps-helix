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
  label="Sélectionner une option"
  hint="Choisissez parmi la liste"
  (valueChange)="handleChange($event)"
/>

// Select avec recherche
<psh-select
  [(value)]="selectedValue"
  [options]="options"
  [searchable]="true"
  [searchConfig]="{ debounceTime: 300, placeholder: 'Rechercher...', minLength: 1 }"
  label="Recherche"
/>

// Select multiple
<psh-select
  [(value)]="selectedValues"
  [options]="options"
  [multiple]="true"
  [clearable]="true"
  [fullWidth]="true"
  label="Sélection multiple"
/>

// Select avec groupes d'options
<psh-select
  [(value)]="selectedValue"
  [options]="groupedOptions"
  label="Options groupées"
/>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| value | `T \| T[] \| null` | `null` | Valeur sélectionnée (ou tableau en mode multiple) |
| disabled | `boolean` | `false` | État désactivé |

### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| options | `(SelectOption<T> \| SelectOptionGroup<T>)[]` | `[]` | Liste des options (simples ou groupées) |
| label | `string` | `''` | Label du select |
| ariaLabel | `string \| null` | `null` | Label ARIA personnalisé |
| placeholder | `string` | `'Sélectionner une option'` | Placeholder en mode simple |
| multiplePlaceholder | `string` | `'Sélectionner des options'` | Placeholder en mode multiple |
| error | `string` | `''` | Message d'erreur |
| success | `string` | `''` | Message de succès |
| hint | `string` | `''` | Texte d'aide |
| size | `SelectSize` | `'medium'` | Taille du select (`'small'` \| `'medium'` \| `'large'`) |
| searchable | `boolean` | `false` | Active la recherche dans les options |
| multiple | `boolean` | `false` | Active la sélection multiple |
| clearable | `boolean` | `false` | Permet d'effacer la sélection |
| loading | `boolean` | `false` | État de chargement |
| fullWidth | `boolean` | `false` | Largeur complète du conteneur |
| required | `boolean` | `false` | Champ requis |
| maxSelections | `number \| undefined` | `undefined` | Nombre maximum de sélections (mode multiple) |
| minSelections | `number \| undefined` | `undefined` | Nombre minimum de sélections (mode multiple) |
| compareWith | `(a: T, b: T) => boolean` | `(a, b) => a === b` | Fonction de comparaison personnalisée |
| searchConfig | `SearchConfig` | `{ debounceTime: 300, placeholder: 'Rechercher...', minLength: 1 }` | Configuration de la recherche |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| valueChange | `EventEmitter<T \| T[] \| null>` | Émis lors de la sélection |
| opened | `EventEmitter<void>` | Émis à l'ouverture du dropdown |
| closed | `EventEmitter<void>` | Émis à la fermeture du dropdown |
| searched | `EventEmitter<string>` | Émis lors de la recherche (si `minLength` atteint) |
| scrollEnd | `EventEmitter<void>` | Émis lorsque l'utilisateur atteint la fin de la liste |

## Interfaces

### SelectOption
```typescript
interface SelectOption<T> {
  label: string;       // Label affiché
  value: T;            // Valeur associée
  icon?: string;       // Icône Phosphor (optionnel)
  disabled?: boolean;  // Option désactivée (optionnel)
  description?: string; // Description additionnelle (optionnel)
}
```

### SelectOptionGroup
```typescript
interface SelectOptionGroup<T> {
  label: string;              // Label du groupe
  options: SelectOption<T>[]; // Options du groupe
  disabled?: boolean;         // Groupe désactivé (optionnel)
}
```

### SearchConfig
```typescript
interface SearchConfig {
  debounceTime: number;  // Délai avant émission (ms)
  placeholder: string;   // Placeholder du champ de recherche
  minLength: number;     // Longueur minimale pour déclencher la recherche
}
```

### SelectSize
```typescript
type SelectSize = 'small' | 'medium' | 'large';
```

## Variants Overview

### Basic Select
**Description**: Select simple pour une sélection unique.

**Cas d'utilisation**:
- Sélection d'une option parmi plusieurs
- Formulaires simples
- Choix uniques

### Searchable Select
**Description**: Select avec fonction de recherche intégrée.

**Cas d'utilisation**:
- Longues listes d'options
- Recherche rapide
- Amélioration de l'UX

### Multiple Select
**Description**: Select permettant la sélection multiple avec contraintes optionnelles.

**Cas d'utilisation**:
- Sélection de plusieurs options
- Tags multiples
- Filtres complexes

### Grouped Select
**Description**: Select avec options organisées en groupes.

**Cas d'utilisation**:
- Catégorisation des options
- Organisation hiérarchique
- Meilleure lisibilité des grandes listes

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses (32px)
- `medium`: Taille par défaut (40px)
- `large`: Pour plus de visibilité (48px)

### États
- `disabled`: Select désactivé, aucune interaction possible
- `loading`: Chargement des options en cours
- `error`: Validation échouée, affiche le message d'erreur
- `success`: Validation réussie, affiche le message de succès

## Navigation Clavier

| Touche | Action |
|--------|--------|
| `Enter` / `Space` | Ouvre le dropdown ou sélectionne l'option focalisée |
| `ArrowDown` | Ouvre le dropdown ou déplace le focus vers l'option suivante |
| `ArrowUp` | Déplace le focus vers l'option précédente |
| `Home` | Déplace le focus vers la première option |
| `End` | Déplace le focus vers la dernière option |
| `Escape` | Ferme le dropdown |
| `Tab` | Ferme le dropdown et passe au champ suivant |

## Accessibilité

### Attributs ARIA
| Attribut | Élément | Description |
|----------|---------|-------------|
| `role="combobox"` | Trigger | Identifie le composant comme combobox |
| `role="listbox"` | Liste d'options | Identifie la liste des options |
| `role="option"` | Option | Identifie chaque option |
| `role="group"` | Groupe d'options | Identifie un groupe d'options |
| `aria-expanded` | Trigger | État d'ouverture du dropdown |
| `aria-haspopup="listbox"` | Trigger | Indique le type de popup |
| `aria-controls` | Trigger | Référence l'ID de la listbox |
| `aria-activedescendant` | Trigger | ID de l'option actuellement focalisée |
| `aria-selected` | Option | État de sélection de l'option |
| `aria-disabled` | Option/Trigger | État désactivé |
| `aria-invalid` | Trigger | État d'erreur de validation |
| `aria-required` | Trigger | Champ requis |
| `aria-busy` | Trigger | État de chargement |
| `aria-describedby` | Trigger | Référence les messages d'aide/erreur/succès |

### Bonnes Pratiques
- Navigation complète au clavier avec wrap-around
- Support des lecteurs d'écran avec annonces appropriées
- États visuels distincts pour chaque interaction
- Focus visible et clairement identifiable
- Messages d'erreur associés via `aria-describedby`

## Exemples

### Exemple Basique

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
      label="Pays"
      placeholder="Sélectionner un pays"
      hint="Sélectionnez votre pays de résidence"
      error="Ce champ est requis"
      [searchConfig]="{ debounceTime: 300, placeholder: 'Rechercher un pays...', minLength: 1 }"
      (valueChange)="handleCountryChange($event)"
      (searched)="handleSearch($event)"
    />
  `
})
export class SelectDemoComponent {
  selectedCountry = '';

  countries: SelectOption<string>[] = [
    { label: 'France', value: 'FR', icon: 'ph-flag' },
    { label: 'Allemagne', value: 'DE', icon: 'ph-flag' },
    { label: 'Italie', value: 'IT', icon: 'ph-flag' },
    { label: 'Espagne', value: 'ES', icon: 'ph-flag' },
    { label: 'Royaume-Uni', value: 'UK', icon: 'ph-flag' }
  ];

  handleCountryChange(value: string) {
    console.log('Pays sélectionné:', value);
  }

  handleSearch(term: string) {
    console.log('Recherche:', term);
  }
}
```

### Exemple avec Groupes d'Options

```typescript
@Component({
  template: `
    <psh-select
      [(value)]="selectedCity"
      [options]="groupedCities"
      [searchable]="true"
      label="Ville"
      placeholder="Sélectionner une ville"
    />
  `
})
export class GroupedSelectDemoComponent {
  selectedCity = '';

  groupedCities: SelectOptionGroup<string>[] = [
    {
      label: 'France',
      options: [
        { label: 'Paris', value: 'paris' },
        { label: 'Lyon', value: 'lyon' },
        { label: 'Marseille', value: 'marseille' }
      ]
    },
    {
      label: 'Allemagne',
      options: [
        { label: 'Berlin', value: 'berlin' },
        { label: 'Munich', value: 'munich' },
        { label: 'Hambourg', value: 'hamburg' }
      ]
    }
  ];
}
```

### Exemple avec Sélection Multiple et Contraintes

```typescript
@Component({
  template: `
    <psh-select
      [(value)]="selectedTags"
      [options]="tags"
      [multiple]="true"
      [clearable]="true"
      [minSelections]="1"
      [maxSelections]="3"
      label="Tags"
      multiplePlaceholder="Sélectionner des tags"
      hint="Sélectionnez entre 1 et 3 tags"
    />
  `
})
export class MultipleSelectDemoComponent {
  selectedTags: string[] = [];

  tags: SelectOption<string>[] = [
    { label: 'Angular', value: 'angular' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'CSS', value: 'css' },
    { label: 'HTML', value: 'html' }
  ];
}
```

### Exemple avec Objets et compareWith

```typescript
interface User {
  id: number;
  name: string;
}

@Component({
  template: `
    <psh-select
      [(value)]="selectedUser"
      [options]="userOptions"
      [compareWith]="compareUsers"
      label="Utilisateur"
    />
  `
})
export class ObjectSelectDemoComponent {
  selectedUser: User | null = null;

  userOptions: SelectOption<User>[] = [
    { label: 'Alice', value: { id: 1, name: 'Alice' } },
    { label: 'Bob', value: { id: 2, name: 'Bob' } },
    { label: 'Charlie', value: { id: 3, name: 'Charlie' } }
  ];

  compareUsers(a: User, b: User): boolean {
    return a?.id === b?.id;
  }
}
```

### Exemple avec Chargement Infini

```typescript
@Component({
  template: `
    <psh-select
      [(value)]="selectedItem"
      [options]="items"
      [loading]="isLoading"
      [searchable]="true"
      label="Items"
      (scrollEnd)="loadMore()"
      (searched)="search($event)"
    />
  `
})
export class InfiniteScrollSelectDemoComponent {
  selectedItem = '';
  items: SelectOption<string>[] = [];
  isLoading = false;

  loadMore() {
    this.isLoading = true;
    // Charger plus d'items...
  }

  search(term: string) {
    this.isLoading = true;
    // Rechercher des items...
  }
}
```
