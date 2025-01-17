# Table Component

Le composant Table permet d'afficher des données tabulaires de manière organisée et accessible.

## Installation

```typescript
import { LibTableComponent } from '@lib/components/table/table.component';

@Component({
  // ...
  imports: [LibTableComponent]
})
```

## Utilisation

### Basique
```html
<lib-table
  [columns]="columns"
  [data]="data"
></lib-table>
```

### Avec template personnalisé
```html
<lib-table [columns]="[
  { 
    key: 'actions',
    label: 'Actions',
    template: actionTemplate
  }
]">
  <ng-template #actionTemplate let-row>
    <button>Edit {{ row.name }}</button>
  </ng-template>
</lib-table>
```

### Variantes
```html
<lib-table
  [columns]="columns"
  [data]="data"
  striped
  hoverable
  bordered
></lib-table>
```

## API

### Inputs

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| columns | TableColumn[] | [] | Configuration des colonnes |
| data | TableRow[] | [] | Données à afficher |
| striped | boolean | false | Active les lignes alternées |
| hoverable | boolean | false | Active l'effet de survol |
| bordered | boolean | false | Ajoute des bordures |
| size | string | 'medium' | Taille ('small', 'medium', 'large') |
| variant | string | 'default' | Style ('default', 'outline') |
| loading | boolean | false | Affiche un indicateur de chargement |
| emptyMessage | string | 'TABLE.NO_DATA' | Message quand aucune donnée |

### Interfaces

```typescript
interface TableColumn {
  key: string;      // Clé unique de la colonne
  label: string;    // Label de la colonne
  width?: string;   // Largeur optionnelle
  sortable?: boolean; // Colonne triable
  template?: TemplateRef<any>; // Template personnalisé
}

interface TableRow {
  id: string | number; // Identifiant unique
  [key: string]: any; // Données de la ligne
}
```

## Accessibilité

- Structure sémantique avec `<table>`, `<thead>`, `<tbody>`
- Support des attributs ARIA appropriés
- Messages traduits via ngx-translate
- États de chargement gérés