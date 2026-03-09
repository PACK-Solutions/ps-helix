# Menu Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshMenuComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshMenuComponent],
  // ...
})
```

### Utilisation de Base

```typescript
import { MenuItem } from 'ps-helix';

@Component({
  template: `
    <!-- Menu basique -->
    <psh-menu
      [items]="menuItems"
      (itemClick)="handleItemClick($event)"
    />

    <!-- Menu horizontal -->
    <psh-menu
      [items]="menuItems"
      mode="horizontal"
    />

    <!-- Menu pliable -->
    <psh-menu
      [items]="menuItems"
      [collapsible]="true"
      [(collapsed)]="isCollapsed"
      (submenuToggle)="handleSubmenuToggle($event)"
    />
  `
})
export class ExampleComponent {
  isCollapsed = false;

  menuItems: MenuItem[] = [
    { id: 'home', content: 'Home', icon: 'house', path: '/home' },
    {
      id: 'settings',
      content: 'Settings',
      icon: 'gear',
      children: [
        { id: 'profile', content: 'Profile', path: '/settings/profile' },
        { id: 'security', content: 'Security', path: '/settings/security' }
      ]
    }
  ];

  handleItemClick(item: MenuItem) {
    console.log('Menu item clicked:', item);
  }

  handleSubmenuToggle(event: { item: MenuItem; expanded: boolean }) {
    console.log('Submenu toggled:', event.item.content, 'Expanded:', event.expanded);
  }
}
```

## API

### Inputs
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| mode | MenuMode | 'vertical' | Mode d'affichage (vertical ou horizontal) |
| variant | MenuVariant | 'default' | Style du menu |
| collapsible | boolean | false | Activer le mode pliable |
| ariaLabels | Record<string, string> | {...} | Labels ARIA personnalisés |
| items | MenuItem<T>[] | [] | Liste des éléments du menu |

### Model (Two-way binding)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| collapsed | boolean | false | État plié du menu (utiliser [(collapsed)]) |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| itemClick | EventEmitter<MenuItem<T>> | Émis lors du clic sur un item sans children |
| submenuToggle | EventEmitter<{item, expanded}> | Émis lors du toggle d'un sous-menu |

### Interface MenuItem<T>
```typescript
interface MenuItem<T = string> {
  id: string;           // Identifiant unique
  content: string;      // Contenu à afficher
  icon?: string;        // Icône Phosphor
  path?: string;        // Chemin de navigation
  disabled?: boolean;   // État désactivé
  active?: boolean;     // État actif
  children?: MenuItem<T>[]; // Sous-menu
  divider?: boolean;    // Séparateur
  badge?: string | number; // Badge
  value?: T;           // Valeur associée
}
```

## Variants Overview

### Vertical Menu
**Description**: Menu vertical avec support des sous-menus.

**Cas d'utilisation**:
- Navigation principale
- Menus latéraux
- Hiérarchie profonde

### Horizontal Menu
**Description**: Menu horizontal pour la navigation supérieure.

**Cas d'utilisation**:
- Barre de navigation
- Menu principal
- Navigation simple

### Collapsible Menu
**Description**: Menu pliable pour économiser l'espace.

**Cas d'utilisation**:
- Interfaces responsives
- Sidebars
- Navigation compacte

## États et Modificateurs

### Modes
- `vertical`: Menu vertical (défaut)
- `horizontal`: Menu horizontal

### Variantes
- `default`: Style par défaut
- `compact`: Version compacte
- `expanded`: Version étendue

### États
- `collapsed`: État plié
- `expanded`: Sous-menu déplié
- `disabled`: Élément désactivé
- `active`: Élément actif

## Accessibilité

### Attributs ARIA
- `role="navigation"`: Pour le menu
- `role="menubar"`: Pour la liste
- `role="menuitem"`: Pour les éléments
- `aria-expanded`: État d'expansion
- `aria-disabled`: État désactivé

### Navigation Clavier (WCAG 2.1 AA)

Le composant implémente une navigation clavier complète:
- **Enter/Space**: Activer un item ou toggle un sous-menu
- **Arrow Down**: Naviguer vers l'item suivant
- **Arrow Up**: Naviguer vers l'item précédent
- **Arrow Right**: Ouvrir un sous-menu (si fermé)
- **Arrow Left**: Fermer un sous-menu (si ouvert)
- **Home**: Aller au premier item
- **End**: Aller au dernier item
- **Escape**: Fermer le menu (si pliable)

Le composant gère automatiquement le focus, le skip des items désactivés et le cycle de navigation.

## Bonnes Pratiques

1. **Structure des Données**
   - IDs uniques pour chaque élément
   - Hiérarchie claire des éléments
   - Valeurs typées avec génériques
   - Utiliser `path` pour les liens de navigation

2. **Accessibilité**
   - Labels ARIA descriptifs personnalisables
   - Navigation clavier complète automatique
   - États visuels clairs et distincts
   - Support natif des lecteurs d'écran

3. **Performance**
   - Utilisation des signals pour la réactivité
   - Détection de changements OnPush
   - Gestion efficace des états

4. **Responsive Design**
   - Mode pliable pour mobile
   - Adaptation horizontale/verticale
   - Gestion des longs contenus

## Exemple Complet

```typescript
import { Component } from '@angular/core';
import { PshMenuComponent, MenuItem } from 'ps-helix';

interface CustomValue {
  id: number;
  type: string;
}

@Component({
  selector: 'app-menu-demo',
  imports: [PshMenuComponent],
  template: `
    <psh-menu
      [items]="menuItems"
      mode="vertical"
      variant="default"
      [collapsible]="true"
      [(collapsed)]="isCollapsed"
      (itemClick)="handleItemClick($event)"
      (submenuToggle)="handleSubmenuToggle($event)"
    />
  `
})
export class MenuDemoComponent {
  isCollapsed = false;

  menuItems: MenuItem<CustomValue>[] = [
    {
      id: 'home',
      content: 'Home',
      icon: 'house',
      value: { id: 1, type: 'page' }
    },
    {
      id: 'settings',
      content: 'Settings',
      icon: 'gear',
      children: [
        {
          id: 'profile',
          content: 'Profile',
          value: { id: 2, type: 'settings' }
        }
      ]
    },
    {
      id: 'notifications',
      content: 'Notifications',
      icon: 'bell',
      badge: '3',
      value: { id: 3, type: 'notifications' }
    }
  ];

  handleItemClick(item: MenuItem<CustomValue>) {
    console.log('Item clicked:', item.value);
  }

  handleSubmenuToggle(event: { item: MenuItem<CustomValue>; expanded: boolean }) {
    console.log('Submenu toggled:', event.item.content, 'Expanded:', event.expanded);
  }
}
```