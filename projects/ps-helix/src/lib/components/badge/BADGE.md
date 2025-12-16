# Badge Component Documentation

## Installation et Utilisation

### Installation

```bash
npm install ps-helix
```

### Import du Composant

```typescript
import { PshBadgeComponent } from 'ps-helix';

@Component({
  standalone: true,
  imports: [PshBadgeComponent],
})
export class MyComponent {}
```

### Utilisation de Base

```typescript
// Badge numérique
<psh-badge
  variant="primary"
  [value]="5"
  displayType="counter"
  ariaLabel="5 notifications non lues"
></psh-badge>

// Badge avec formatter personnalisé
<psh-badge
  variant="primary"
  [value]="price"
  [formatter]="priceFormatter"
  ariaLabel="Prix: 42.99€"
></psh-badge>

// Badge point de statut
<psh-badge
  variant="success"
  displayType="dot"
  ariaLabel="Statut: actif"
></psh-badge>

// Badge avec chevauchement
<div style="position: relative">
  <i class="ph ph-bell"></i>
  <psh-badge
    variant="danger"
    [value]="3"
    [overlap]="true"
    position="top-right"
    ariaLabel="3 notifications urgentes"
  ></psh-badge>
</div>

// Badge cliquable
<psh-badge
  variant="primary"
  [value]="10"
  (badgeClick)="handleBadgeClick()"
  ariaLabel="10 nouveaux éléments"
></psh-badge>
```

## API

### Inputs (@input)

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | BadgeVariant | 'primary' | Style du badge ('primary' \| 'secondary' \| 'success' \| 'warning' \| 'danger' \| 'info' \| 'disabled') |
| size | BadgeSize | 'medium' | Taille du badge ('small' \| 'medium' \| 'large') |
| displayType | BadgeDisplayType | 'text' | Type d'affichage ('dot' \| 'counter' \| 'text') |
| content | string | '' | Contenu textuel du badge |
| visible | boolean | true | Contrôle la visibilité du badge |
| value | T | undefined | Valeur à afficher (type générique) |
| max | number | 99 | Valeur maximale avant affichage du suffixe + |
| showZero | boolean | false | Afficher le badge quand la valeur est 0 |
| position | BadgePosition | 'top-right' | Position du badge en mode overlap |
| overlap | boolean | false | Active le mode superposition |
| ariaLabel | string | undefined | Label ARIA personnalisé |
| formatter | (value: T) => string | undefined | Fonction de formatage personnalisée |

### Outputs (@output)

| Nom | Type | Description |
|-----|------|-------------|
| badgeClick | void | Émis lors d'un clic sur le badge |
| valueChange | T | Émis lors d'un changement de valeur |

### Types

```typescript
type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'disabled';
type BadgeSize = 'small' | 'medium' | 'large';
type BadgeDisplayType = 'dot' | 'counter' | 'text';
type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
```

## Configuration par Défaut

Le composant Badge inclut une configuration par défaut :

```typescript
const DEFAULT_CONFIG = {
  variant: 'primary',
  size: 'medium',
  displayType: 'text',
  max: 99,
  showZero: false,
  position: 'top-right'
};
```

## Exemples d'Utilisation

### Counter Badge

Badge numérique pour afficher des compteurs.

**Cas d'utilisation**:
- Nombre de notifications
- Messages non lus
- Éléments dans un panier

```typescript
<psh-badge
  variant="danger"
  displayType="counter"
  [value]="notificationCount"
  [max]="99"
  ariaLabel="{{notificationCount}} notifications non lues"
></psh-badge>
```

### Dot Badge

Badge en forme de point pour indiquer un statut.

**Cas d'utilisation**:
- Indicateur de statut en ligne/hors ligne
- État de disponibilité
- Notifications simples

```typescript
<psh-badge
  variant="success"
  displayType="dot"
  ariaLabel="Utilisateur en ligne"
></psh-badge>
```

### Text Badge

Badge textuel pour afficher des labels.

**Cas d'utilisation**:
- Étiquettes de statut
- Labels informatifs
- Indicateurs textuels

```typescript
<psh-badge variant="warning" displayType="text">
  Beta
</psh-badge>
```

### Badge avec Formatter Personnalisé

```typescript
export class MyComponent {
  price = 42.99;

  priceFormatter = (value: number) => `${value.toFixed(2)}€`;

  numberFormatter = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };
}
```

```html
<psh-badge
  variant="primary"
  displayType="counter"
  [value]="price"
  [formatter]="priceFormatter"
></psh-badge>

<psh-badge
  variant="primary"
  displayType="counter"
  [value]="1250"
  [formatter]="numberFormatter"
></psh-badge>
```

### Badge avec Événements

```typescript
export class MyComponent {
  handleBadgeClick() {
    console.log('Badge clicked!');
  }

  handleValueChange(newValue: number) {
    console.log('Value changed:', newValue);
  }
}
```

```html
<psh-badge
  variant="primary"
  [value]="count"
  (badgeClick)="handleBadgeClick()"
  (valueChange)="handleValueChange($event)"
></psh-badge>
```

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses
- `medium`: Taille par défaut (équilibrée)
- `large`: Pour plus de visibilité

### Positions (avec overlap)
- `top-right`: En haut à droite (défaut)
- `top-left`: En haut à gauche
- `bottom-right`: En bas à droite
- `bottom-left`: En bas à gauche

### Visibilité
- `visible`: Contrôle l'affichage du badge
- `showZero`: Affiche le badge même avec une valeur de 0

## Accessibilité

### Attributs ARIA

Le composant gère automatiquement les attributs ARIA :
- `role="status"`: Pour les badges numériques (counter)
- `role="img"`: Pour les badges de type point (dot)
- `aria-label`: Description détaillée calculée automatiquement

### Bonnes Pratiques

1. **Labels ARIA**: Fournissez toujours un `ariaLabel` descriptif pour les badges numériques et les points indicateurs
   ```html
   <psh-badge ariaLabel="5 messages non lus" [value]="5" />
   ```

2. **Contexte**: Assurez-vous que le badge est accompagné d'un élément visuel ou textuel qui donne le contexte
   ```html
   <button>
     <i class="ph ph-bell"></i>
     <psh-badge [value]="3" ariaLabel="3 notifications" />
   </button>
   ```

3. **Contraste**: Vérifiez que les couleurs respectent les ratios de contraste WCAG AA (4.5:1 minimum)

4. **Focus**: Le badge est cliquable et gère automatiquement le focus pour la navigation au clavier

## Bonnes Pratiques d'Utilisation

### 1. Hiérarchie Visuelle
- Utiliser les variantes sémantiques appropriées
- Maintenir une cohérence dans l'utilisation
- Limiter le nombre de badges par vue

```typescript
// ✅ Bon usage
<psh-badge variant="danger" [value]="urgentCount" />
<psh-badge variant="warning" [value]="pendingCount" />

// ❌ Mauvais usage - trop de badges
<div>
  <psh-badge variant="primary" [value]="1" />
  <psh-badge variant="success" [value]="2" />
  <psh-badge variant="warning" [value]="3" />
  <psh-badge variant="danger" [value]="4" />
</div>
```

### 2. Utilisation des Signals

Le composant utilise les signals Angular 20 pour une réactivité optimale :

```typescript
// ✅ Bon usage - utilisation avec signals
export class MyComponent {
  notificationCount = signal(5);

  increment() {
    this.notificationCount.update(v => v + 1);
  }
}
```

```html
<psh-badge [value]="notificationCount()" />
```

### 3. Performance

- Le composant utilise `ChangeDetectionStrategy.OnPush` pour optimiser les performances
- Les computed signals minimisent les recalculs inutiles
- Préférez les inputs simples aux observables complexes

### 4. Responsive Design
- Adapter la taille selon le contexte (small sur mobile, medium/large sur desktop)
- Gérer le chevauchement sur mobile avec prudence
- Maintenir la lisibilité à toutes les tailles d'écran

## Architecture Technique

### Computed Signals

Le composant utilise plusieurs computed signals pour optimiser les performances :

- `computedRole`: Calcule le rôle ARIA dynamiquement
- `computedAriaLabel`: Génère un label ARIA approprié
- `state`: Détermine l'état visuel du badge
- `displayValue`: Calcule la valeur à afficher avec formatage

### Avantages

1. **Performance**: OnPush + Signals = recalculs minimaux
2. **Réactivité**: Mises à jour automatiques via signals
3. **Maintenabilité**: Code organisé et décomposé
4. **Accessibilité**: Support ARIA automatique
5. **Flexibilité**: Types génériques + formatters personnalisés

## Migration depuis l'Ancienne Version

Si vous utilisez l'ancienne version avec `model()`:

```typescript
// ❌ Ancienne version (model)
<psh-badge [(variant)]="myVariant" />

// ✅ Nouvelle version (input)
<psh-badge [variant]="myVariant" />
```

Le two-way binding avec `model()` a été supprimé car non nécessaire pour un composant de présentation. Utilisez les outputs si vous avez besoin de réagir aux interactions.
