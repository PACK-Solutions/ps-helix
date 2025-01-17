# Badge Component Documentation

## Installation et Utilisation

### Installation

1. Installer le package via npm :
```bash
npm install @ps/helix
```

2. Importer le composant dans votre module ou composant standalone :
```typescript
import { LibBadgeComponent } from '@ps/helix';

@Component({
  // ...
  imports: [LibBadgeComponent],
  // ...
})
```

### Utilisation de Base

```typescript
import { Component } from '@angular/core';
import { LibBadgeComponent } from '@ps/helix';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [LibBadgeComponent],
  template: `
    <!-- Badge numérique -->
    <lib-badge
      variant="primary"
      [value]="5"
      displayType="counter"
      ariaLabel="5 notifications non lues"
    ></lib-badge>

    <!-- Badge avec formatter personnalisé -->
    <lib-badge
      variant="primary"
      [value]="price"
      [formatter]="priceFormatter"
      ariaLabel="Prix: 42.99€"
    ></lib-badge>

    <!-- Badge point de statut -->
    <lib-badge
      variant="success"
      displayType="dot"
      ariaLabel="Statut: actif"
    ></lib-badge>

    <!-- Badge avec chevauchement -->
    <div style="position: relative">
      <i class="ph ph-bell"></i>
      <lib-badge
        variant="danger"
        [value]="3"
        [overlap]="true"
        position="top-right"
        ariaLabel="3 notifications urgentes"
      ></lib-badge>
    </div>
  `
})
export class ExampleComponent {
  price = 42.99;
  
  priceFormatter = (value: number) => `${value.toFixed(2)}€`;
}
```

### Configuration par Défaut

Vous pouvez utiliser la directive DefaultBadgeDirective pour appliquer une configuration par défaut :

```typescript
import { DefaultBadgeDirective } from '@ps/helix';

@Component({
  template: `
    <lib-badge libDefaultBadge>
      Default Configuration
    </lib-badge>
  `,
  imports: [LibBadgeComponent, DefaultBadgeDirective]
})
```

La directive appliquera automatiquement :
- Variante: primary
- Taille: medium
- Type d'affichage: counter
- Position: top-right
- Max: 99
- ShowZero: false

### API

#### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | BadgeVariant | required | Style du badge |
| size | BadgeSize | 'medium' | Taille du badge |
| displayType | BadgeDisplayType | 'counter' | Type d'affichage |
| content | string | '' | Contenu textuel |
| visible | boolean | true | Visibilité du badge |
| value | T | undefined | Valeur à afficher |
| max | number | 99 | Valeur maximum |
| showZero | boolean | false | Afficher la valeur zéro |
| position | BadgePosition | 'top-right' | Position du badge |

#### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| overlap | boolean | false | Chevauchement sur l'élément parent |
| ariaLabel | string | undefined | Label ARIA personnalisé |
| formatter | (value: T) => string | undefined | Fonction de formatage personnalisée |

### Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: BADGE_CONFIG,
      useValue: {
        variant: 'primary',
        size: 'medium',
        displayType: 'counter',
        max: 99,
        showZero: false,
        position: 'top-right'
      }
    },
    {
      provide: BADGE_VALUE_FORMATTER,
      useValue: {
        format: (value: number, max: number = 99) => 
          value > max ? `${max}+` : `${value}`
      }
    },
    {
      provide: BADGE_STYLES,
      useValue: {
        'custom-badge': {
          border: '2px solid var(--primary-color)'
        }
      },
      multi: true
    }
  ]
})
```

## Variants Overview

### Counter Badge
**Description**: Badge numérique pour afficher des compteurs.

**Cas d'utilisation**:
- Nombre de notifications
- Messages non lus
- Éléments dans un panier

### Dot Badge
**Description**: Badge en forme de point pour indiquer un statut.

**Cas d'utilisation**:
- Indicateur de statut en ligne/hors ligne
- État de disponibilité
- Notifications simples

### Semantic Variants
- **Primary**: Actions principales, notifications importantes
- **Secondary**: Actions secondaires, informations complémentaires
- **Success**: États positifs, validations
- **Warning**: Avertissements, attention requise
- **Danger**: Erreurs, alertes critiques

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses
- `medium`: Taille par défaut
- `large`: Pour plus de visibilité

### Positions (avec overlap)
- `top-right`: En haut à droite (défaut)
- `top-left`: En haut à gauche
- `bottom-right`: En bas à droite
- `bottom-left`: En bas à gauche

### États
- `visible`: Contrôle la visibilité
- `overlap`: Pour le positionnement absolu
- `showZero`: Affichage des valeurs nulles

## Accessibilité

### Attributs ARIA
- `role="status"`: Pour les badges numériques
- `role="img"`: Pour les badges de type point
- `aria-label`: Description détaillée du badge

### Bonnes Pratiques
- Fournir des descriptions claires via aria-label
- Utiliser des contrastes suffisants
- Assurer la lisibilité des valeurs

## Bonnes Pratiques

1. **Hiérarchie Visuelle**
   - Utiliser les variantes sémantiques appropriées
   - Maintenir une cohérence dans l'utilisation
   - Limiter le nombre de badges par vue

2. **Accessibilité**
   - Fournir des textes descriptifs
   - Utiliser des contrastes suffisants
   - Support des lecteurs d'écran

3. **Responsive Design**
   - Adapter la taille selon le contexte
   - Gérer le chevauchement sur mobile
   - Maintenir la lisibilité

4. **Performance**
   - Utilisation des signals pour la réactivité
   - Gestion efficace des états
   - Détection de changements OnPush