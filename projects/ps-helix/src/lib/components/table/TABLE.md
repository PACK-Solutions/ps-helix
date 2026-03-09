# Table Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import {
  PshTableComponent,
  TableColumn,
  TableRow,
  TableSort,
  TableRowClickEvent,
  TableCellContext,
  TableConfig,
  TABLE_CONFIG
} from 'ps-helix';

@Component({
  // ...
  imports: [PshTableComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Définition des types
const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' }
];

const data: TableRow[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Table basique avec contenu simple
<psh-table
  [columns]="columns"
  [data]="data"
></psh-table>

// Table avec templates personnalisés
<psh-table
  [columns]="[
    { key: 'name', label: 'Name' },
    { key: 'country', label: 'Country', template: countryTemplate },
    { key: 'agent', label: 'Agent', template: agentTemplate },
    { key: 'status', label: 'Status', template: statusTemplate }
  ]"
  [data]="data"
>
  <!-- Template pour la colonne country -->
  <ng-template #countryTemplate let-row>
    <div class="country-info">
      <img [src]="row.countryFlag" [alt]="row.country">
      {{ row.country }}
    </div>
  </ng-template>

  <!-- Template pour la colonne agent -->
  <ng-template #agentTemplate let-row>
    <div class="agent-info">
      <img [src]="row.agentAvatar" [alt]="row.agent" class="agent-avatar">
      {{ row.agent }}
    </div>
  </ng-template>

  <!-- Template pour la colonne status -->
  <ng-template #statusTemplate let-row>
    <psh-tag [variant]="row.statusVariant">
      {{ row.status }}
    </psh-tag>
  </ng-template>
</psh-table>

// Table avec recherche et messages personnalisés
<psh-table
  [columns]="columns"
  [data]="data"
  [globalSearch]="true"
  emptyMessage="Aucune donnée disponible"
  noResultsMessage="Aucun résultat trouvé pour"
  globalSearchPlaceholder="Rechercher..."
></psh-table>

```

## API

### Inputs
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | 'default' \| 'outline' | 'default' | Style de la table |
| size | 'small' \| 'medium' \| 'large' | 'medium' | Taille de la table |
| striped | boolean | false | Lignes alternées |
| hoverable | boolean | false | Effet au survol |
| bordered | boolean | false | Bordures |
| loading | boolean | false | État de chargement |
| globalSearch | boolean | false | Recherche globale |
| columns | TableColumn[] | [] | Configuration des colonnes |
| data | TableRow[] | [] | Données à afficher |
| emptyMessage | string | 'No data available' | Message quand aucune donnée |
| noResultsMessage | string | 'No results found' | Message quand recherche sans résultat |
| globalSearchPlaceholder | string | 'Search in all columns...' | Placeholder de recherche |
| tableLayout | 'auto' \| 'fixed' | 'auto' | Algorithme de layout de la table |
| truncateText | boolean | false | Tronque le texte avec ellipsis |
| fullWidth | boolean | false | Mode pleine largeur |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| sortChange | EventEmitter<TableSort> | Émis lors du tri |
| globalSearchChange | EventEmitter<string> | Émis lors de la recherche |
| rowClick | EventEmitter<TableRowClickEvent> | Émis lors du clic sur une ligne |

### Interface TableColumn
```typescript
interface TableColumn {
  key: string;      // Clé unique
  label: string;    // Label de la colonne
  path?: string;    // Chemin d'accès pour objets imbriqués (ex: 'user.address.city')
  width?: string;   // Largeur optionnelle
  sortable?: boolean; // Colonne triable
  /** Template personnalisé pour le contenu de la colonne */
  template?: TemplateRef<TableCellContext>;
  /** Fonction de tri personnalisée */
  sortFn?: (a: any, b: any) => number;
}
```

### Interface TableRow
```typescript
interface TableRow {
  id: string | number;  // Identifiant unique
  [key: string]: any;   // Données de la ligne
}
```

### Interface TableSort
```typescript
interface TableSort {
  key: string;      // Clé de la colonne
  direction: 'asc' | 'desc';  // Direction du tri
}
```

### Interface TableRowClickEvent
```typescript
interface TableRowClickEvent {
  id: string | number;  // Identifiant de la ligne
  row: TableRow;        // Données complètes de la ligne
}
```

### Interface TableCellContext
```typescript
interface TableCellContext<T = TableRow> {
  $implicit: T;      // Données de la ligne (accessible via let-row)
  column: TableColumn; // Configuration de la colonne (accessible via let-column="column")
}
```

## Gestion des Messages

La table gère deux types de messages vides distincts :

1. **Table sans données** (`emptyMessage`)
   - Affiché quand la table ne contient aucune donnée
   - Configurable via l'input `emptyMessage`
   - Exemple : "Aucune donnée disponible"

2. **Recherche sans résultat** (`noResultsMessage`)
   - Affiché quand la recherche ne trouve aucun résultat
   - Configurable via l'input `noResultsMessage`
   - Le terme recherché est automatiquement ajouté
   - Exemple : "Aucun résultat trouvé pour 'xyz'"

## Bonnes Pratiques

1. **Structure des Données**
   - Colonnes bien définies
   - Données cohérentes
   - IDs uniques
   - Templates flexibles

2. **Performance**
   - Utilisation des signals
   - Détection de changements OnPush
   - Tri et filtrage optimisés
   - Gestion efficace des états

3. **Accessibilité**
   - Labels descriptifs
   - Support du clavier
   - États ARIA appropriés
   - Tri accessible

4. **UX**
   - Feedback immédiat
   - Animations fluides
   - États visuels clairs
   - Recherche intuitive
   - Messages contextuels appropriés

## Templates Personnalisés

Le composant table permet de personnaliser le rendu de chaque colonne via des templates :

1. **Définition du Template**
   ```typescript
   columns: TableColumn[] = [
     { 
       key: 'status',
       label: 'Status',
       template: this.statusTemplate 
     }
   ];
   ```

2. **Création du Template**
   ```html
   <ng-template #statusTemplate let-row>
     <psh-tag [variant]="row.statusVariant">
       {{ row.status }}
     </psh-tag>
   </ng-template>
   ```

3. **Types de Contenu Supportés**
   - Composants (tags, badges, boutons)
   - Images (avatars, icônes, drapeaux)
   - Texte formaté
   - Icônes
   - HTML personnalisé
   - Autres composants Angular

4. **Contexte du Template**
   - Accès à la ligne complète via `let-row` (équivalent à `$implicit`)
   - Accès à la configuration de la colonne via `let-column="column"`
   - Possibilité d'utiliser toutes les propriétés de la ligne
   - Support des méthodes du composant

   ```html
   <!-- Accès à la ligne uniquement -->
   <ng-template #template1 let-row>
     {{ row.name }}
   </ng-template>

   <!-- Accès à la ligne et à la colonne -->
   <ng-template #template2 let-row let-column="column">
     <span [title]="column.label">{{ row.name }}</span>
   </ng-template>
   ```

5. **Exemples d'Utilisation**
   ```typescript
   // Avatar avec nom
   <ng-template #userTemplate let-row>
     <div class="user-info">
       <img [src]="row.avatar" [alt]="row.name">
       <span>{{ row.name }}</span>
     </div>
   </ng-template>

   // Actions avec boutons
   <ng-template #actionsTemplate let-row>
     <div class="actions">
       <psh-button icon="edit" (click)="editUser(row)">
         Modifier
       </psh-button>
       <psh-button icon="trash" variant="danger">
         Supprimer
       </psh-button>
     </div>
   </ng-template>

   // Status avec tag
   <ng-template #statusTemplate let-row>
     <psh-tag [variant]="getStatusVariant(row.status)">
       {{ row.status }}
     </psh-tag>
   </ng-template>
   ```

## Propriétés Imbriquées avec `path`

Le composant supporte l'accès aux propriétés imbriquées via la propriété `path` :

```typescript
// Données avec objets imbriqués
const data: TableRow[] = [
  {
    id: 1,
    user: {
      name: 'John Doe',
      address: {
        city: 'Paris',
        country: 'France'
      }
    },
    stats: {
      views: 1500,
      likes: 320
    }
  }
];

// Configuration des colonnes avec path
const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '80px' },
  { key: 'userName', label: 'Nom', path: 'user.name', sortable: true },
  { key: 'city', label: 'Ville', path: 'user.address.city' },
  { key: 'country', label: 'Pays', path: 'user.address.country' },
  { key: 'views', label: 'Vues', path: 'stats.views', sortable: true }
];
```

Le composant utilise automatiquement `path` pour :
- Afficher la valeur dans la cellule
- Effectuer la recherche globale
- Trier les données (sauf si `sortFn` est défini)

## Tri Personnalisé avec `sortFn`

Pour un contrôle total sur le tri, utilisez la propriété `sortFn` :

```typescript
const columns: TableColumn[] = [
  {
    key: 'date',
    label: 'Date',
    sortable: true,
    sortFn: (a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateA - dateB;
    }
  },
  {
    key: 'priority',
    label: 'Priorité',
    sortable: true,
    sortFn: (a, b) => {
      const priorities = { low: 1, medium: 2, high: 3, critical: 4 };
      return priorities[a.priority] - priorities[b.priority];
    }
  },
  {
    key: 'name',
    label: 'Nom',
    sortable: true,
    sortFn: (a, b) => {
      // Tri insensible à la casse
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    }
  }
];
```

**Note** : Quand `sortFn` est défini, elle a la priorité sur le tri par défaut (même si `path` est aussi défini).

## Layout et Troncature de Texte

### Algorithme de Layout (`tableLayout`)

La propriété `tableLayout` contrôle l'algorithme utilisé pour calculer les largeurs de colonnes :

#### `tableLayout="auto"` (par défaut)
Le navigateur calcule automatiquement les largeurs en fonction du contenu. Les largeurs définies en pourcentage peuvent ne pas être respectées exactement.

```html
<psh-table
  [columns]="columns"
  [data]="data"
></psh-table>
```

#### `tableLayout="fixed"`
Les largeurs de colonnes sont strictement respectées. Recommandé lorsque vous utilisez des largeurs en pourcentage.

```typescript
const columns: TableColumn[] = [
  { key: 'id', label: 'ID', width: '10%' },
  { key: 'name', label: 'Nom', width: '20%' },
  { key: 'description', label: 'Description', width: '40%' },
  { key: 'status', label: 'Statut', width: '15%' },
  { key: 'date', label: 'Date', width: '15%' }
];
```

```html
<psh-table
  tableLayout="fixed"
  [columns]="columns"
  [data]="data"
></psh-table>
```

### Troncature de Texte (`truncateText`)

La propriété `truncateText` permet de tronquer automatiquement le texte qui dépasse la largeur de la cellule, en affichant des points de suspension (ellipsis).

```html
<psh-table
  [truncateText]="true"
  [columns]="columns"
  [data]="data"
></psh-table>
```

Le texte tronqué affiche automatiquement une info-bulle native (`title`) au survol, permettant de visualiser le contenu complet.

### Combinaison Recommandée

Pour un contrôle optimal des largeurs de colonnes avec des textes potentiellement longs, combinez les deux propriétés :

```html
<psh-table
  tableLayout="fixed"
  [truncateText]="true"
  [columns]="columns"
  [data]="data"
></psh-table>
```

Cette combinaison garantit :
- Les largeurs de colonnes sont respectées (grâce à `tableLayout="fixed"`)
- Les textes longs sont tronqués proprement avec ellipsis (grâce à `truncateText`)
- L'utilisateur peut toujours accéder au contenu complet via l'info-bulle au survol

## Mode Pleine Largeur (`fullWidth`)

La propriété `fullWidth` permet à la table de prendre toute la largeur disponible de son conteneur parent.

### Comportement par défaut

Sans `fullWidth`, la table utilise `display: block` et sa largeur s'adapte au contenu.

```html
<psh-table
  [columns]="columns"
  [data]="data"
></psh-table>
```

### Avec `fullWidth` activé

Lorsque `fullWidth="true"`, la table s'étend pour occuper 100% de la largeur disponible.

```html
<psh-table
  [fullWidth]="true"
  [columns]="columns"
  [data]="data"
></psh-table>
```

### Combinaison avec les autres propriétés

`fullWidth` se combine parfaitement avec les autres propriétés de layout :

```html
<psh-table
  [fullWidth]="true"
  tableLayout="fixed"
  [truncateText]="true"
  [columns]="columns"
  [data]="data"
></psh-table>
```

Cette combinaison est idéale pour :
- Tables dans des conteneurs flexibles ou grilles
- Interfaces responsives
- Dashboards avec plusieurs panneaux

## Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: TABLE_CONFIG,
      useValue: {
        variant: 'default',
        size: 'medium',
        striped: false,
        hoverable: false,
        bordered: false,
        loading: false,
        globalSearch: false,
        emptyMessage: 'No data available',
        noResultsMessage: 'No results found',
        globalSearchPlaceholder: 'Search in all columns...',
        tableLayout: 'auto',
        truncateText: false,
        fullWidth: false
      }
    }
  ]
})
```