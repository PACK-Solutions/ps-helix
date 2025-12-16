# Sidebar Component Documentation

## Installation et Utilisation

### Installation

```typescript
import { PshSidebarComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshSidebarComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Sidebar fixe
<psh-sidebar [(open)]="true" [(mode)]="fixed" [(width)]="250px">
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>

// Sidebar overlay
<psh-sidebar
  [(open)]="isOpen"
  [(mode)]="overlay"
  (toggle)="handleToggle($event)"
  (opened)="onOpened()"
  (closed)="onClosed()"
>
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>
```

## API

### Model Inputs (two-way binding)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| open | boolean | false | État d'ouverture (two-way binding) |
| mode | SidebarMode | 'fixed' | Mode d'affichage (two-way binding) |
| position | SidebarPosition | 'left' | Position (two-way binding) |
| width | string | '250px' | Largeur de la sidebar (two-way binding) |
| breakpoint | string | '768px' | Breakpoint mobile (two-way binding) |

### Regular Inputs
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| autoFocus | boolean | true | Focus automatique sur le premier élément focusable à l'ouverture |
| ariaLabel | string | 'Sidebar navigation' | Label ARIA pour la sidebar |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| toggle | EventEmitter<boolean> | Émis lors du toggle (état ouvert/fermé) |
| opened | EventEmitter<void> | Émis après l'ouverture complète de la sidebar |
| closed | EventEmitter<void> | Émis après la fermeture complète de la sidebar |
| transitionStart | EventEmitter<boolean> | Émis au début de la transition (true = ouverture, false = fermeture) |

## Modes Disponibles

### Fixed
- Toujours visible
- Adapté aux layouts fixes
- Pas de superposition du contenu
- Mode par défaut

### Overlay
- Se superpose au contenu
- Fermeture au clic extérieur
- Idéal pour mobile et actions temporaires

## Accessibilité

### Attributs ARIA
- `role="complementary"`: Rôle sémantique automatiquement ajouté
- `aria-label`: Label personnalisable via l'input `ariaLabel`
- `aria-hidden`: État de visibilité géré automatiquement
- `aria-expanded`: État d'expansion géré automatiquement
- `aria-modal`: Activé automatiquement en mode overlay
- Support complet du clavier

### Navigation
- `Escape`: Ferme la sidebar (mode overlay uniquement)
- `Tab`: Navigation piégée automatiquement dans la sidebar ouverte
- Focus automatique sur le premier élément focusable (désactivable via `autoFocus`)
- Restauration du focus sur l'élément précédent à la fermeture

## Responsive Design

- Passage automatique en mode overlay sur mobile
- Largeur adaptative
- Support des gestures tactiles
- Breakpoint configurable

## Configuration Globale

Vous pouvez fournir une configuration par défaut pour toutes les sidebars de votre application :

```typescript
import { SIDEBAR_CONFIG } from 'ps-helix';

@Component({
  providers: [
    {
      provide: SIDEBAR_CONFIG,
      useValue: {
        mode: 'fixed',
        position: 'left',
        width: '250px',
        breakpoint: '768px',
        autoFocus: true,
        ariaLabel: 'Navigation principale'
      }
    }
  ]
})
```

## Exemples Avancés

### Événements de transition

```typescript
<psh-sidebar
  [(open)]="isOpen"
  (transitionStart)="onTransitionStart($event)"
  (opened)="onSidebarOpened()"
  (closed)="onSidebarClosed()"
>
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>

// Component
onTransitionStart(opening: boolean) {
  if (opening) {
    console.log('La sidebar commence à s\'ouvrir');
  } else {
    console.log('La sidebar commence à se fermer');
  }
}

onSidebarOpened() {
  console.log('La sidebar est complètement ouverte');
}

onSidebarClosed() {
  console.log('La sidebar est complètement fermée');
}
```

### Désactiver le focus automatique

```typescript
<psh-sidebar
  [(open)]="isOpen"
  mode="overlay"
  [autoFocus]="false"
>
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>
```

### Largeur personnalisée

```typescript
<psh-sidebar
  [(open)]="isOpen"
  mode="fixed"
  [(width)]="280px"
>
  <psh-menu [items]="menuItems"></psh-menu>
</psh-sidebar>
```

## Bonnes Pratiques

1. **Structure**
   - Contenu organisé et accessible
   - Navigation claire
   - Hiérarchie visuelle

2. **Performance**
   - Animations optimisées
   - Gestion efficace des états
   - Nettoyage des ressources

3. **UX**
   - Transitions fluides
   - Feedback visuel
   - Comportement intuitif
   - Support mobile