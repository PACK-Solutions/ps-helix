# Pagination Component Documentation

## Table des Matieres

- [Utilisation](#utilisation)
- [API](#api)
- [Variantes](#variantes)
- [Tailles](#tailles)
- [Configuration](#configuration)
- [Navigation au Clavier](#navigation-au-clavier)
- [Accessibilite](#accessibilité)
- [Exemples Pratiques](#exemples-pratiques)
- [Configuration Globale](#configuration-globale)
- [Bonnes Pratiques](#bonnes-pratiques)

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshPaginationComponent } from 'ps-helix';

@Component({
  imports: [PshPaginationComponent],
})
export class MyComponent {}
```

### Utilisation de Base

```typescript
// Pagination basique
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  (pageChange)="onPageChange($event)"
></psh-pagination>

// Avec sélecteur d'items par page
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [(itemsPerPage)]="itemsPerPage"
  [showItemsPerPage]="true"
  [itemsPerPageOptions]="[5, 10, 25, 50]"
  (pageChange)="onPageChange($event)"
  (itemsPerPageChange)="onItemsChange($event)"
></psh-pagination>

// Variante outline
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  variant="outline"
></psh-pagination>
```

## API

### Model Inputs (@model)

Propriétés avec two-way binding

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| `currentPage` | `number` | `1` | Page actuellement affichée (two-way binding avec `[(currentPage)]`) |
| `totalPages` | `number` | `1` | Nombre total de pages disponibles (two-way binding avec `[(totalPages)]`) |
| `itemsPerPage` | `number` | `10` | Nombre d'éléments affichés par page (two-way binding avec `[(itemsPerPage)]`) |

### Regular Inputs (@input)

Propriétés en lecture seule

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| `size` | `PaginationSize` | `'medium'` | Taille du composant : `'small'` \| `'medium'` \| `'large'` |
| `variant` | `PaginationVariant` | `'default'` | Style visuel : `'default'` \| `'outline'` |
| `showFirstLast` | `boolean` | `true` | Affiche les boutons "Premier" et "Dernier" |
| `showPrevNext` | `boolean` | `true` | Affiche les boutons "Précédent" et "Suivant" |
| `maxVisiblePages` | `number` | `5` | Nombre maximum de numéros de page affichés simultanément |
| `showItemsPerPage` | `boolean` | `false` | Affiche le sélecteur d'éléments par page |
| `itemsPerPageOptions` | `number[]` | `[5, 10, 25, 50]` | Options disponibles dans le sélecteur d'éléments par page |
| `firstLabel` | `string` | `'First'` | Label du bouton "Premier" (personnalisable pour i18n) |
| `previousLabel` | `string` | `'Previous'` | Label du bouton "Précédent" (personnalisable pour i18n) |
| `nextLabel` | `string` | `'Next'` | Label du bouton "Suivant" (personnalisable pour i18n) |
| `lastLabel` | `string` | `'Last'` | Label du bouton "Dernier" (personnalisable pour i18n) |
| `pageLabel` | `string` | `'Page'` | Label pour identifier les pages (personnalisable pour i18n) |
| `itemsLabel` | `string` | `'items'` | Label pour les éléments (personnalisable pour i18n) |
| `itemsPerPageLabel` | `string` | `'Items per page'` | Label du sélecteur (personnalisable pour i18n) |
| `id` | `string` | auto-généré | ID unique pour l'élément de navigation (généré automatiquement si non fourni) |
| `ariaLabel` | `string` | `'Pagination navigation'` | Label ARIA pour l'accessibilité |

### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| `pageChange` | `EventEmitter<number>` | Émis lorsque la page change, retourne le numéro de la nouvelle page |
| `itemsPerPageChange` | `EventEmitter<number>` | Émis lorsque le nombre d'éléments par page change |
| `navigationError` | `EventEmitter<{action: string, reason: string}>` | Émis lorsqu'une tentative de navigation invalide est détectée |

### Méthodes Publiques

| Nom | Description |
|-----|-------------|
| `goToPage(page: number)` | Navigue vers une page spécifique (avec validation automatique) |
| `goToFirstPage()` | Navigue vers la première page |
| `goToLastPage()` | Navigue vers la dernière page |
| `goToNextPage()` | Navigue vers la page suivante (si disponible) |
| `goToPreviousPage()` | Navigue vers la page précédente (si disponible) |

### Types TypeScript

```typescript
type PaginationSize = 'small' | 'medium' | 'large';
type PaginationVariant = 'default' | 'outline';

interface PaginationConfig {
  size?: PaginationSize;
  variant?: PaginationVariant;
  showFirstLast?: boolean;
  showPrevNext?: boolean;
  maxVisiblePages?: number;
  showItemsPerPage?: boolean;
  itemsPerPageOptions?: number[];
}
```

## Variantes

### Default (Par défaut)

**Description**: Style avec fond plein et couleur d'accent.

**Cas d'utilisation**:
- Navigation principale dans les tableaux de données
- Listes de résultats standard
- Interface avec fond clair

**Exemple**:
```html
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  variant="default"
></psh-pagination>
```

### Outline

**Description**: Style avec bordure sans fond, plus discret visuellement.

**Cas d'utilisation**:
- Interfaces avec beaucoup d'éléments visuels
- Navigation secondaire
- Designs épurés ou minimalistes

**Exemple**:
```html
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  variant="outline"
></psh-pagination>
```

## Tailles

### Small

**Description**: Version compacte pour interfaces denses.

**Cas d'utilisation**:
- Tableaux avec peu d'espace
- Mobile ou petits écrans
- Interfaces denses

**Exemple**:
```html
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  size="small"
></psh-pagination>
```

### Medium (Par défaut)

**Description**: Taille équilibrée pour la plupart des cas.

**Cas d'utilisation**:
- Navigation standard
- Tableaux et listes classiques
- Cas général

**Exemple**:
```html
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  size="medium"
></psh-pagination>
```

### Large

**Description**: Grande taille pour une meilleure visibilité.

**Cas d'utilisation**:
- Écrans larges ou haute résolution
- Navigation principale mise en avant
- Accessibilité renforcée

**Exemple**:
```html
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  size="large"
></psh-pagination>
```

## Configuration

### Boutons de Navigation

Vous pouvez configurer quels boutons de navigation afficher :

```html
<!-- Uniquement les numéros de page -->
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [showFirstLast]="false"
  [showPrevNext]="false"
></psh-pagination>

<!-- Sans boutons Premier/Dernier -->
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [showFirstLast]="false"
></psh-pagination>
```

### Pages Visibles

Contrôlez le nombre de numéros de page affichés :

```html
<!-- Affiche jusqu'à 7 pages -->
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [maxVisiblePages]="7"
></psh-pagination>

<!-- Affiche seulement 3 pages (pour mobile) -->
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [maxVisiblePages]="3"
></psh-pagination>
```

### Sélecteur d'Éléments par Page

Permettez aux utilisateurs de changer le nombre d'éléments affichés :

```html
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [(itemsPerPage)]="itemsPerPage"
  [showItemsPerPage]="true"
  [itemsPerPageOptions]="[10, 25, 50, 100]"
  (itemsPerPageChange)="onItemsChange($event)"
></psh-pagination>
```

### Labels Personnalisés (i18n)

Personnalisez tous les labels pour l'internationalisation :

```html
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  firstLabel="Premier"
  previousLabel="Précédent"
  nextLabel="Suivant"
  lastLabel="Dernier"
  pageLabel="Page"
  itemsLabel="éléments"
  itemsPerPageLabel="Éléments par page"
  ariaLabel="Navigation par pagination"
></psh-pagination>
```

## Navigation au Clavier

Le composant supporte une navigation complète au clavier pour une meilleure accessibilité :

| Touche | Action |
|--------|--------|
| **Flèche Gauche** | Va à la page précédente |
| **Flèche Droite** | Va à la page suivante |
| **Home** | Va à la première page |
| **End** | Va à la dernière page |
| **Tab** | Navigue entre les boutons |
| **Entrée / Espace** | Active le bouton en focus |

**Exemple d'utilisation** :
```typescript
// La navigation au clavier est automatique
// Aucune configuration nécessaire
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
></psh-pagination>
```

## Accessibilité

### Support ARIA Complet

Le composant implémente toutes les bonnes pratiques d'accessibilité :

- **`role="navigation"`**: Identifie la zone de pagination comme navigation
- **`aria-label`**: Description de la navigation (personnalisable)
- **`aria-current="page"`**: Indique la page active
- **`aria-live="polite"`**: Annonce les changements de page aux lecteurs d'écran
- **`aria-disabled`**: États désactivés clairement indiqués
- **ID uniques**: Chaque instance a un ID unique auto-généré

### États Désactivés

Les boutons de navigation sont automatiquement désactivés quand non applicables :

- Bouton "Premier" désactivé sur la première page
- Bouton "Précédent" désactivé sur la première page
- Bouton "Suivant" désactivé sur la dernière page
- Bouton "Dernier" désactivé sur la dernière page

### Focus Visible

- Focus clairement visible sur tous les éléments interactifs
- Gestion automatique du focus pour la navigation au clavier
- Respect des standards WCAG 2.1 AA

### Annonces Vocales

Le composant génère automatiquement des annonces pour les lecteurs d'écran :

```typescript
// Exemple d'annonce générée :
// "Page 3 sur 10"
```

## Exemples Pratiques

### Tableau avec Pagination

```typescript
import { Component, computed, signal } from '@angular/core';
import { PshPaginationComponent } from 'ps-helix';

@Component({
  selector: 'app-users-table',
  standalone: true,
  imports: [PshPaginationComponent],
  template: `
    <table>
      <thead>
        <tr>
          <th>Nom</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        @for (user of paginatedUsers(); track user.id) {
          <tr>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
          </tr>
        }
      </tbody>
    </table>

    <psh-pagination
      [(currentPage)]="currentPage"
      [totalPages]="totalPages()"
      [(itemsPerPage)]="itemsPerPage"
      [showItemsPerPage]="true"
      (pageChange)="onPageChange($event)"
      (itemsPerPageChange)="onItemsPerPageChange($event)"
    ></psh-pagination>
  `
})
export class UsersTableComponent {
  currentPage = 1;
  itemsPerPage = 10;
  allUsers = signal([/* vos données */]);

  totalPages = computed(() =>
    Math.ceil(this.allUsers().length / this.itemsPerPage)
  );

  paginatedUsers = computed(() => {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.allUsers().slice(start, end);
  });

  onPageChange(page: number) {
    console.log('Page changée:', page);
    // Charger les données de la nouvelle page si nécessaire
  }

  onItemsPerPageChange(items: number) {
    console.log('Items par page changés:', items);
    // Réinitialiser à la première page
    this.currentPage = 1;
    // Recalculer les données
  }
}
```

### Navigation Programmatique

```typescript
import { Component, viewChild } from '@angular/core';
import { PshPaginationComponent } from 'ps-helix';

@Component({
  selector: 'app-programmatic-nav',
  template: `
    <psh-pagination #pagination
      [(currentPage)]="currentPage"
      [(totalPages)]="totalPages"
    ></psh-pagination>

    <div class="actions">
      <button (click)="jumpToFirstPage()">Début</button>
      <button (click)="jumpToLastPage()">Fin</button>
      <button (click)="jumpToPage(5)">Page 5</button>
    </div>
  `
})
export class ProgrammaticNavComponent {
  pagination = viewChild.required<PshPaginationComponent>('pagination');
  currentPage = 1;
  totalPages = 10;

  jumpToFirstPage() {
    this.pagination().goToFirstPage();
  }

  jumpToLastPage() {
    this.pagination().goToLastPage();
  }

  jumpToPage(page: number) {
    this.pagination().goToPage(page);
  }
}
```

### Gestion d'Erreurs

```typescript
import { Component } from '@angular/core';
import { PshPaginationComponent } from 'ps-helix';

@Component({
  selector: 'app-error-handling',
  template: `
    <psh-pagination
      [(currentPage)]="currentPage"
      [(totalPages)]="totalPages"
      (navigationError)="handleNavigationError($event)"
    ></psh-pagination>
  `
})
export class ErrorHandlingComponent {
  currentPage = 1;
  totalPages = 10;

  handleNavigationError(error: { action: string; reason: string }) {
    console.error('Erreur de navigation:', error);
    // Afficher un message à l'utilisateur
    alert(`Navigation impossible: ${error.reason}`);
  }
}
```

### Pagination avec Chargement API

```typescript
import { Component, signal } from '@angular/core';
import { PshPaginationComponent } from 'ps-helix';

@Component({
  selector: 'app-api-pagination',
  template: `
    @if (loading()) {
      <div>Chargement...</div>
    } @else {
      <div class="results">
        @for (item of items(); track item.id) {
          <div>{{ item.name }}</div>
        }
      </div>
    }

    <psh-pagination
      [(currentPage)]="currentPage"
      [totalPages]="totalPages()"
      (pageChange)="loadPage($event)"
    ></psh-pagination>
  `
})
export class ApiPaginationComponent {
  currentPage = 1;
  items = signal<any[]>([]);
  totalPages = signal(1);
  loading = signal(false);

  async loadPage(page: number) {
    this.loading.set(true);
    try {
      const response = await fetch(`/api/items?page=${page}`);
      const data = await response.json();
      this.items.set(data.items);
      this.totalPages.set(data.totalPages);
    } catch (error) {
      console.error('Erreur de chargement:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
```

## Configuration Globale

Vous pouvez configurer les valeurs par défaut pour toutes les instances de pagination dans votre application :

### Configuration de Base

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { PAGINATION_CONFIG } from 'ps-helix';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: PAGINATION_CONFIG,
      useValue: {
        size: 'large',
        variant: 'outline',
        showFirstLast: false,
        maxVisiblePages: 7,
        showItemsPerPage: true,
        itemsPerPageOptions: [10, 25, 50, 100]
      }
    }
  ]
});
```

### Configuration par Module

```typescript
import { Component } from '@angular/core';
import { PAGINATION_CONFIG } from 'ps-helix';

@Component({
  selector: 'app-admin',
  providers: [
    {
      provide: PAGINATION_CONFIG,
      useValue: {
        size: 'small',
        variant: 'default',
        maxVisiblePages: 3
      }
    }
  ]
})
export class AdminComponent {}
```

### Personnalisation des Styles

```typescript
import { PAGINATION_STYLES } from 'ps-helix';

bootstrapApplication(AppComponent, {
  providers: [
    {
      provide: PAGINATION_STYLES,
      useValue: [
        {
          '--pagination-primary-color': '#007bff',
          '--pagination-border-radius': '8px'
        }
      ]
    }
  ]
});
```

## Bonnes Pratiques

### 1. Two-way Binding

Utilisez le two-way binding pour synchroniser automatiquement l'état :

```typescript
// ✅ Bon - synchronisation automatique
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
></psh-pagination>

// ❌ À éviter - synchronisation manuelle fastidieuse
<psh-pagination
  [currentPage]="currentPage"
  [totalPages]="totalPages"
  (pageChange)="currentPage = $event"
></psh-pagination>
```

### 2. Calcul des Pages

Utilisez des computed signals pour calculer le nombre total de pages :

```typescript
// ✅ Bon - calcul réactif optimisé
totalPages = computed(() =>
  Math.ceil(this.totalItems() / this.itemsPerPage())
);

// ❌ À éviter - calcul manuel à chaque changement
onItemsPerPageChange(items: number) {
  this.totalPages = Math.ceil(this.totalItems / items);
}
```

### 3. Accessibilité

Toujours fournir des labels descriptifs en français :

```typescript
// ✅ Bon - labels en français pour UX locale
<psh-pagination
  firstLabel="Premier"
  previousLabel="Précédent"
  nextLabel="Suivant"
  lastLabel="Dernier"
  ariaLabel="Navigation des résultats"
></psh-pagination>

// ❌ À éviter - labels par défaut en anglais
<psh-pagination></psh-pagination>
```

### 4. Gestion des États

Gérez correctement les états de chargement :

```typescript
// ✅ Bon - désactivation pendant le chargement
@if (!loading()) {
  <psh-pagination
    [(currentPage)]="currentPage"
    [(totalPages)]="totalPages"
    (pageChange)="loadPage($event)"
  ></psh-pagination>
}
```

### 5. Réinitialisation de Page

Réinitialisez la page lors du changement d'items par page :

```typescript
// ✅ Bon - retour à la page 1
onItemsPerPageChange(items: number) {
  this.currentPage = 1;
  this.itemsPerPage = items;
  this.loadData();
}

// ❌ À éviter - rester sur une page qui n'existe plus
onItemsPerPageChange(items: number) {
  this.itemsPerPage = items;
  // currentPage peut être invalide maintenant
}
```

### 6. Performance

Utilisez OnPush et signals pour optimiser les performances :

```typescript
// ✅ Bon - détection OnPush + signals
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent {
  currentPage = signal(1);
  items = computed(() => this.paginateItems());
}
```

### 7. Responsive Design

Adaptez la configuration selon la taille d'écran :

```typescript
// ✅ Bon - adaptation responsive
<psh-pagination
  [(currentPage)]="currentPage"
  [(totalPages)]="totalPages"
  [size]="isMobile ? 'small' : 'medium'"
  [maxVisiblePages]="isMobile ? 3 : 7"
></psh-pagination>
```

### 8. Validation des Données

Validez toujours les données avant de les utiliser :

```typescript
// ✅ Bon - validation des données
loadData(page: number) {
  if (page < 1 || page > this.totalPages()) {
    console.error('Page invalide');
    return;
  }
  // Charger les données
}
```

## Architecture Technique

### Computed Signals

Le composant utilise plusieurs computed signals pour optimiser les performances :

- **`pages`**: Calcule les numéros de page visibles avec algorithme de centrage intelligent
- **`canGoNext`**: Détermine si la navigation vers la page suivante est possible
- **`canGoPrevious`**: Détermine si la navigation vers la page précédente est possible
- **`isFirstPage`**: Vérifie si on est sur la première page
- **`isLastPage`**: Vérifie si on est sur la dernière page
- **`state`**: Calcule l'état actuel de la pagination ('first', 'last', 'default')
- **`currentPageAnnouncement`**: Génère l'annonce vocale pour les lecteurs d'écran
- **`customStyles`**: Fusionne les styles personnalisés injectés

### Avantages

1. **Performance**: OnPush + Signals = recalculs minimaux et optimisés
2. **Réactivité**: Mises à jour automatiques via model signals
3. **Maintenabilité**: Code organisé et logique décomposée
4. **Accessibilité**: Support ARIA complet et automatique
5. **Flexibilité**: Configuration globale + personnalisation par instance
6. **Type Safety**: Types TypeScript stricts pour éviter les erreurs

## Design Tokens

Le composant utilise les design tokens suivants pour une cohérence maximale avec le design system :

- **Espacements**: `--spacing-xs`, `--spacing-sm`, `--spacing-md`
- **Tailles**: `--size-8`, `--size-9`, `--size-11`
- **Couleurs**: `--primary-color`, `--surface-card`, `--text-color`, `--text-color-secondary`
- **Typographie**: `--font-size-sm`, `--font-size-base`, `--font-size-lg`
- **Animations**: `--animation-duration-fast`, `--animation-easing-default`
- **Focus**: `--focus-outline-width`, `--focus-ring-color`
- **Effets**: `--opacity-disabled`, `--border-radius`
- **États**: `--hover-color`, `--active-color`
