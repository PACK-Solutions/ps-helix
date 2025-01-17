# Breadcrumb Component Documentation

## Installation et Utilisation

### Installation

1. Installer le package via npm :
```bash
npm install @ps/helix
```

2. Importer le composant et le RouterModule dans votre module ou composant standalone :
```typescript
import { LibBreadcrumbComponent } from '@ps/helix';
import { RouterModule } from '@angular/router';

@Component({
  // ...
  imports: [LibBreadcrumbComponent, RouterModule],
  // ...
})
```

### Configuration du Routeur

1. Définir les routes dans votre application :
```typescript
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

2. Configurer les données de breadcrumb dans vos routes (optionnel) :
```typescript
const routes: Routes = [
  { 
    path: '', 
    component: HomeComponent,
    data: { breadcrumb: 'Home' }
  },
  { 
    path: 'products', 
    component: ProductsComponent,
    data: { breadcrumb: 'Products' }
  },
  { 
    path: 'products/:id', 
    component: ProductDetailsComponent,
    data: { breadcrumb: 'Details' }
  }
];
```

### Utilisation de Base

```typescript
import { Component } from '@angular/core';
import { LibBreadcrumbComponent } from '@ps/helix';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [LibBreadcrumbComponent, RouterModule],
  template: `
    <!-- Fil d'ariane basique -->
    <lib-breadcrumb
      [items]="[
        { label: 'Home', path: '/', ariaLabel: 'Retour à l\'accueil' },
        { label: 'Products', path: '/products', ariaLabel: 'Liste des produits' },
        { label: 'Details', path: '/products/1', ariaLabel: 'Détails du produit' }
      ]"
      ariaLabel="Navigation principale"
    ></lib-breadcrumb>
  `
})
export class ExampleComponent {
  // Le RouterModule gère automatiquement la navigation
}
```

### Génération Dynamique du Breadcrumb

Pour une génération dynamique basée sur la route actuelle :

```typescript
import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BreadcrumbItem } from '@ps/helix';

@Component({
  // ...
})
export class ExampleComponent implements OnInit {
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.breadcrumbItems = this.createBreadcrumbs(this.activatedRoute.root);
    });
  }

  private createBreadcrumbs(route: ActivatedRoute, url: string = '', items: BreadcrumbItem[] = []): BreadcrumbItem[] {
    const children = route.children;

    if (children.length === 0) {
      return items;
    }

    for (const child of children) {
      const routeURL = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label = child.snapshot.data['breadcrumb'];
      if (label) {
        items.push({
          label,
          path: url,
          ariaLabel: `Navigation vers ${label}`
        });
      }

      return this.createBreadcrumbs(child, url, items);
    }

    return items;
  }
}
```

### Configuration par Défaut

Vous pouvez utiliser la directive DefaultBreadcrumbDirective pour appliquer une configuration par défaut :

```typescript
import { DefaultBreadcrumbDirective } from '@ps/helix';

@Component({
  template: `
    <lib-breadcrumb 
      libDefaultBreadcrumb
      [items]="items"
    ></lib-breadcrumb>
  `,
  imports: [LibBreadcrumbComponent, DefaultBreadcrumbDirective, RouterModule]
})
```

La directive appliquera automatiquement :
- Séparateur: caret-right
- Taille: medium
- Variante: default

### Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: BREADCRUMB_CONFIG,
      useValue: {
        separator: 'caret-right',
        size: 'medium',
        variant: 'default'
      }
    },
    {
      provide: BREADCRUMB_STYLES,
      useValue: {
        'custom-breadcrumb': {
          borderWidth: '2px'
        }
      },
      multi: true
    }
  ]
})
```

### API

#### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| separator | string | 'caret-right' | Icône de séparation |
| size | BreadcrumbSize | 'medium' | Taille du fil d'ariane |
| variant | BreadcrumbVariant | 'default' | Style visuel |

#### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| items | BreadcrumbItem[] | [] | Liste des éléments |
| ariaLabel | string | undefined | Label ARIA personnalisé |

#### Types et Interfaces

```typescript
interface BreadcrumbItem {
  label: string;    // Label à afficher
  path: string;     // Chemin de navigation
  icon?: string;    // Icône optionnelle
  ariaLabel?: string; // Label ARIA personnalisé
}

type BreadcrumbSize = 'small' | 'medium' | 'large';
type BreadcrumbVariant = 'default' | 'outline';
```

## Variants Overview

### Default Breadcrumb
**Description**: Style par défaut avec fond.

**Cas d'utilisation**:
- Navigation principale
- Hiérarchie de pages
- Structure de contenu

### Outline Breadcrumb
**Description**: Style avec bordure et fond transparent.

**Cas d'utilisation**:
- Interfaces minimalistes
- Designs épurés
- Contraste subtil

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses (32px)
- `medium`: Taille par défaut (40px)
- `large`: Pour plus de visibilité (48px)

### Styles
- `default`: Style standard avec fond
- `outline`: Style avec bordure

### Icônes
- Support des icônes pour chaque élément
- Position cohérente
- Amélioration visuelle

## Accessibilité

### Structure
- Utilisation de `<nav>` et `<ol>` pour la sémantique
- Attribut `role="navigation"` pour le conteneur
- `aria-current="page"` pour la page active

### Labels
- Labels ARIA personnalisables par élément
- Description claire de la navigation
- Support des lecteurs d'écran

### Navigation
- Support complet du clavier
- Focus visible et géré
- États interactifs clairs

## Bonnes Pratiques

1. **Intégration avec le Routeur**
   - Toujours utiliser RouterModule pour la navigation
   - Gérer les routes dynamiques proprement
   - Maintenir la cohérence avec l'état de l'application

2. **Hiérarchie et Structure**
   - Limiter le nombre de niveaux (3-4 maximum)
   - Utiliser des labels clairs et concis
   - Maintenir une hiérarchie logique

3. **Accessibilité**
   - Fournir des labels ARIA descriptifs
   - Assurer la navigation au clavier
   - Maintenir un contraste suffisant

4. **Responsive Design**
   - Adapter l'affichage sur mobile
   - Gérer les longs chemins
   - Maintenir la lisibilité

5. **Performance**
   - Utilisation des signals pour la réactivité
   - Détection de changements OnPush
   - Optimisation des mises à jour

## Exemples d'Utilisation

### Navigation Simple avec Routeur
```html
<lib-breadcrumb
  [items]="[
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' }
  ]"
></lib-breadcrumb>
```

### Avec Icônes et Labels ARIA
```html
<lib-breadcrumb
  [items]="[
    { 
      label: 'Home',
      path: '/',
      icon: 'house',
      ariaLabel: 'Retour à l\'accueil'
    },
    { 
      label: 'Products',
      path: '/products',
      icon: 'shopping-cart',
      ariaLabel: 'Liste des produits'
    }
  ]"
  ariaLabel="Navigation principale"
></lib-breadcrumb>
```

### Style Outline et Grande Taille
```html
<lib-breadcrumb
  [items]="items"
  variant="outline"
  size="large"
></lib-breadcrumb>
```

### Avec Gestion des Routes Dynamiques
```typescript
@Component({
  template: `
    <lib-breadcrumb
      [items]="breadcrumbItems"
      ariaLabel="Navigation dynamique"
    ></lib-breadcrumb>
  `
})
export class DynamicBreadcrumbComponent implements OnInit {
  breadcrumbItems: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Écouter les changements de route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateBreadcrumb();
    });
  }

  private updateBreadcrumb() {
    // Logique de mise à jour du breadcrumb
    // basée sur la route actuelle
  }
}
```