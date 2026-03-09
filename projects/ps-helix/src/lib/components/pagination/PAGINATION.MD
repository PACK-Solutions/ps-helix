# Pagination Component Documentation

## Table des Matières

- [Utilisation](#utilisation)
- [API](#api)
- [Validation et Gestion des Erreurs](#validation-et-gestion-des-erreurs)
- [Variantes](#variantes)
- [Tailles](#tailles)
- [Configuration](#configuration)
- [Navigation au Clavier](#navigation-au-clavier)
- [Accessibilité](#accessibilité)
- [Exemples Pratiques](#exemples-pratiques)
- [Configuration Globale](#configuration-globale)
- [Bonnes Pratiques](#bonnes-pratiques)
- [Architecture Technique](#architecture-technique)
- [Design Tokens](#design-tokens)

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

| Nom | Type | Défaut | Validation | Description |
|-----|------|---------|------------|-------------|
| `currentPage` | `number` | `1` | >= 1, <= totalPages | Page actuellement affichée (two-way binding avec `[(currentPage)]`) |
| `totalPages` | `number` | `1` | >= 1 | Nombre total de pages disponibles (two-way binding avec `[(totalPages)]`) |
| `itemsPerPage` | `number` | `10` | >= 1 | Nombre d'éléments affichés par page (two-way binding avec `[(itemsPerPage)]`) |

### Regular Inputs (@input)

Propriétés en lecture seule

| Nom | Type | Défaut | Validation | Description |
|-----|------|---------|------------|-------------|
| `size` | `PaginationSize` | `'medium'` | 'small' \| 'medium' \| 'large' | Taille du composant |
| `variant` | `PaginationVariant` | `'default'` | 'default' \| 'outline' | Style visuel |
| `showFirstLast` | `boolean` | `true` | - | Affiche les boutons "Premier" et "Dernier" |
| `showPrevNext` | `boolean` | `true` | - | Affiche les boutons "Précédent" et "Suivant" |
| `maxVisiblePages` | `number` | `5` | >= 1 | Nombre maximum de numéros de page affichés simultanément |
| `showItemsPerPage` | `boolean` | `false` | - | Affiche le sélecteur d'éléments par page |
| `itemsPerPageOptions` | `number[]` | `[5, 10, 25, 50]` | - | Options disponibles dans le sélecteur d'éléments par page |
| `firstLabel` | `string` | `'First'` | - | Label du bouton "Premier" (personnalisable pour i18n) |
| `previousLabel` | `string` | `'Previous'` | - | Label du bouton "Précédent" (personnalisable pour i18n) |
| `nextLabel` | `string` | `'Next'` | - | Label du bouton "Suivant" (personnalisable pour i18n) |
| `lastLabel` | `string` | `'Last'` | - | Label du bouton "Dernier" (personnalisable pour i18n) |
| `pageLabel` | `string` | `'Page'` | - | Label pour identifier les pages (personnalisable pour i18n) |
| `itemsLabel` | `string` | `'items'` | - | Label pour les éléments (personnalisable pour i18n) |
| `itemsPerPageLabel` | `string` | `'Items per page'` | - | Label du sélecteur (personnalisable pour i18n) |
| `id` | `string` | auto-généré | - | ID unique pour l'élément de navigation (généré automatiquement si non fourni) |
| `ariaLabel` | `string` | `'Pagination navigation'` | - | Label ARIA pour l'accessibilité |

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

## Validation et Gestion des Erreurs

Le composant Pagination intègre un système robuste de validation automatique pour garantir un comportement cohérent même avec des valeurs invalides.

### Validation Automatique

#### totalPages
Le composant valide et normalise automatiquement le nombre total de pages :

```typescript
// Valeurs invalides normalisées automatiquement à 1
<psh-pagination [totalPages]="0"></psh-pagination>      // → totalPages = 1
<psh-pagination [totalPages]="-5"></psh-pagination>     // → totalPages = 1
<psh-pagination [totalPages]="NaN"></psh-pagination>    // → totalPages = 1

// Message console : "[psh-pagination] Invalid totalPages "0", setting to 1"
```

#### currentPage
La page courante est validée par rapport aux limites :

```typescript
// Valeurs invalides normalisées automatiquement
<psh-pagination
  [currentPage]="0"
  [totalPages]="10">
</psh-pagination>  // → currentPage = 1

<psh-pagination
  [currentPage]="15"
  [totalPages]="10">
</psh-pagination>  // → currentPage = 10 (max)

// Messages console :
// "[psh-pagination] Invalid currentPage "0", setting to 1"
// "[psh-pagination] currentPage "15" exceeds totalPages "10", setting to 10"
```

#### maxVisiblePages
Le nombre de pages visibles est validé :

```typescript
// Valeur invalide → avertissement console
<psh-pagination [maxVisiblePages]="0"></psh-pagination>
// Console : "[psh-pagination] Invalid maxVisiblePages "0", must be >= 1"

<psh-pagination [maxVisiblePages]="-3"></psh-pagination>
// Console : "[psh-pagination] Invalid maxVisiblePages "-3", must be >= 1"
```

#### size et variant
Les valeurs invalides sont normalisées aux valeurs par défaut :

```typescript
// Valeurs invalides normalisées automatiquement
<psh-pagination size="huge"></psh-pagination>  // → size = "medium"
// Console : "[psh-pagination] Invalid size "huge", falling back to "medium""

<psh-pagination variant="fancy"></psh-pagination>  // → variant = "default"
// Console : "[psh-pagination] Invalid variant "fancy", falling back to "default""
```

### Output navigationError

Lorsqu'une tentative de navigation vers une page invalide est effectuée programmatiquement, l'événement `navigationError` est émis :

```typescript
@Component({
  template: `
    <psh-pagination
      [(currentPage)]="currentPage"
      [totalPages]="10"
      (navigationError)="handleError($event)"
    ></psh-pagination>
  `
})
export class MyComponent {
  currentPage = 1;

  jumpToPage(page: number) {
    this.pagination.goToPage(page);
  }

  handleError(error: { action: string; reason: string }) {
    console.error(`Erreur: ${error.action} - ${error.reason}`);
    // Exemple d'erreur :
    // { action: "goToPage", reason: "Page 15 is out of bounds (1-10)" }
  }
}
```

### Messages de Validation

Tous les messages de validation sont en **anglais** (standard industrie) :

| Scénario | Message Console |
|----------|----------------|
| totalPages invalide | `[psh-pagination] Invalid totalPages "{value}", setting to 1` |
| currentPage < 1 | `[psh-pagination] Invalid currentPage "{value}", setting to 1` |
| currentPage > totalPages | `[psh-pagination] currentPage "{current}" exceeds totalPages "{total}", setting to {total}` |
| maxVisiblePages invalide | `[psh-pagination] Invalid maxVisiblePages "{value}", must be >= 1` |
| size invalide | `[psh-pagination] Invalid size "{value}", falling back to "medium"` |
| variant invalide | `[psh-pagination] Invalid variant "{value}", falling back to "default"` |

### Comportement Défensif

Le composant est conçu pour **ne jamais crasher** :

- ✅ Les valeurs invalides sont normalisées automatiquement
- ✅ Les avertissements console aident au débogage
- ✅ L'interface reste fonctionnelle en toutes circonstances
- ✅ Les états impossibles sont prévenus
- ✅ La navigation reste cohérente

### Exemple de Gestion d'Erreur Complète

```typescript
import { Component, signal, viewChild } from '@angular/core';
import { PshPaginationComponent } from 'ps-helix';

@Component({
  selector: 'app-robust-pagination',
  template: `
    <psh-pagination
      #pagination
      [(currentPage)]="currentPage"
      [totalPages]="totalPages()"
      (navigationError)="logError($event)"
    ></psh-pagination>

    <button (click)="testInvalidPage()">Tester page invalide</button>
  `
})
export class RobustPaginationComponent {
  pagination = viewChild.required<PshPaginationComponent>('pagination');
  currentPage = 1;
  totalPages = signal(10);

  testInvalidPage() {
    this.pagination().goToPage(999);
  }

  logError(error: { action: string; reason: string }) {
    console.error('Navigation error:', error);
  }
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
  }

  onItemsPerPageChange(items: number) {
    console.log('Items par page changés:', items);
    this.currentPage = 1;
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

Le composant valide automatiquement les données, mais vérifiez vos propres données en amont :

```typescript
// ✅ Bon - validation des données métier
loadData(page: number) {
  if (page < 1 || page > this.totalPages()) {
    console.error('Page invalide');
    return;
  }
}

// Note : Le composant normalisera automatiquement les valeurs invalides,
// mais il est préférable de valider vos données en amont pour un meilleur contrôle
```

## Architecture Technique

### Computed Signals

Le composant utilise plusieurs computed signals pour optimiser les performances et garantir la réactivité :

- **`navigationId`**: Génère l'ID unique pour l'élément nav (auto-généré si non fourni)
- **`pages`**: Calcule les numéros de page visibles avec algorithme de centrage intelligent
- **`state`**: Calcule l'état actuel de la pagination ('first', 'last', 'default')
- **`canGoNext`**: Détermine si la navigation vers la page suivante est possible
- **`canGoPrevious`**: Détermine si la navigation vers la page précédente est possible
- **`isFirstPage`**: Vérifie si on est sur la première page
- **`isLastPage`**: Vérifie si on est sur la dernière page
- **`currentPageAnnouncement`**: Génère l'annonce vocale pour les lecteurs d'écran

### Effects de Validation

Le composant utilise des Angular effects pour valider et normaliser automatiquement les valeurs :

```typescript
// Validation de totalPages
effect(() => {
  const total = this.totalPages();
  if (total < 1 || !Number.isFinite(total)) {
    console.warn(`[psh-pagination] Invalid totalPages "${total}", setting to 1`);
    this.totalPages.set(1);
  }
});

// Validation de currentPage
effect(() => {
  const current = this.currentPage();
  const total = this.totalPages();
  if (current < 1 || !Number.isFinite(current)) {
    console.warn(`[psh-pagination] Invalid currentPage "${current}", setting to 1`);
    this.currentPage.set(1);
  } else if (current > total && total >= 1) {
    console.warn(`[psh-pagination] currentPage "${current}" exceeds totalPages "${total}", setting to ${total}`);
    this.currentPage.set(total);
  }
});

// Validation de maxVisiblePages
effect(() => {
  const maxVisible = this.maxVisiblePages();
  if (maxVisible < 1 || !Number.isFinite(maxVisible)) {
    console.warn(`[psh-pagination] Invalid maxVisiblePages "${maxVisible}", must be >= 1`);
  }
});
```

### Système d'ID Unique

Chaque instance génère automatiquement un ID unique si non fourni :

```typescript
private static idCounter = 0;
private readonly uniqueId = `pagination-${++PshPaginationComponent.idCounter}`;

protected readonly navigationId = computed(() => {
  const customId = this.id();
  return customId || this.uniqueId;
});
```

Cela garantit que plusieurs instances peuvent coexister sans conflit d'ID.

### Avantages de cette Architecture

1. **Performance**: OnPush + Signals = recalculs minimaux et optimisés
2. **Réactivité**: Mises à jour automatiques via model signals
3. **Robustesse**: Validation automatique des valeurs invalides
4. **Maintenabilité**: Code organisé et logique décomposée
5. **Accessibilité**: Support ARIA complet et automatique
6. **Flexibilité**: Configuration globale + personnalisation par instance
7. **Type Safety**: Types TypeScript stricts pour éviter les erreurs
8. **Defensive Programming**: Le composant ne crashe jamais, même avec des données invalides

## Design Tokens

Le composant utilise les design tokens CSS du Design System pour garantir une cohérence visuelle maximale. La personnalisation se fait via les CSS custom properties au niveau global de votre application.

### Tokens Utilisés

Le composant s'appuie sur les tokens suivants :

#### Espacements
- `--spacing-xs`, `--spacing-sm`, `--spacing-md`
- `--spacing-2xs` (responsive)

#### Tailles
- `--size-7`, `--size-8`, `--size-9`, `--size-11`

#### Couleurs
- `--primary-color`, `--primary-color-text`, `--primary-gradient`
- `--surface-card`, `--surface-ground`, `--surface-border`, `--surface-hover`
- `--text-color`, `--text-color-secondary`

#### Typographie
- `--font-size-xs`, `--font-size-sm`, `--font-size-base`, `--font-size-lg`

#### Icônes
- `--icon-size-xs`, `--icon-size-sm`, `--icon-size-md`

#### Animations
- `--animation-duration-fast`
- `--animation-easing-default`

#### Focus et Accessibilité
- `--focus-outline-width`, `--focus-outline-style`, `--focus-outline-color`, `--focus-outline-offset`
- `--focus-ring-width`, `--focus-ring-color`

#### Effets
- `--opacity-disabled`
- `--border-radius`
- `--border-width-1`

### Personnalisation via CSS

Pour personnaliser l'apparence globale du composant, surchargez les design tokens dans votre CSS global :

```css
:root {
  /* Personnaliser les couleurs primaires */
  --primary-color: #007bff;
  --primary-color-text: #ffffff;

  /* Personnaliser les espacements */
  --spacing-xs: 6px;
  --spacing-sm: 12px;

  /* Personnaliser les bordures */
  --border-radius: 8px;

  /* Personnaliser les animations */
  --animation-duration-fast: 200ms;
}
```

### Personnalisation par Thème

Si votre Design System supporte plusieurs thèmes, les tokens s'adapteront automatiquement :

```css
[data-theme="dark"] {
  --surface-card: #1e1e1e;
  --text-color: #ffffff;
  --surface-border: #404040;
}

[data-theme="light"] {
  --surface-card: #ffffff;
  --text-color: #212121;
  --surface-border: #e0e0e0;
}
```

Le composant Pagination respectera automatiquement ces changements sans configuration supplémentaire.
