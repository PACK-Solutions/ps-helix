# Tooltip Component Documentation

## Installation et Utilisation

### Installation

```typescript
import { PshTooltipComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshTooltipComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Tooltip basique
<psh-tooltip content="Information contextuelle">
  <button>Survolez-moi</button>
</psh-tooltip>

// Tooltip avec position personnalisée
<psh-tooltip
  content="Tooltip à droite"
  position="right"
>
  <button>Position droite</button>
</psh-tooltip>

// Tooltip avec délais personnalisés
<psh-tooltip
  content="Apparition rapide"
  [showDelay]="0"
  [hideDelay]="0"
>
  <button>Rapide</button>
</psh-tooltip>

// Tooltip désactivé
<psh-tooltip
  content="Je ne m'afficherai pas"
  [disabled]="true"
>
  <button>Tooltip désactivé</button>
</psh-tooltip>

// Tooltip avec événements
<psh-tooltip
  content="Avec callbacks"
  (showed)="onTooltipShowed()"
  (hidden)="onTooltipHidden()"
>
  <button>Avec événements</button>
</psh-tooltip>

// Tooltip avec aria-label personnalisé
<psh-tooltip
  content="Infos sur l'action"
  ariaLabel="Description accessible de l'élément"
>
  <button>Bouton accessible</button>
</psh-tooltip>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | 'light' \| 'dark' | 'dark' | Style du tooltip |
| position | TooltipPosition | 'top' | Position du tooltip |
| showDelay | number | 200 | Délai d'apparition (ms) |
| hideDelay | number | 100 | Délai de disparition (ms) |
| maxWidth | number | 200 | Largeur maximale (px) |

### Regular Inputs (@input)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| content | string | **requis** | Contenu du tooltip |
| disabled | boolean | false | Désactive le tooltip |
| ariaLabel | string | - | Label ARIA pour l'accessibilité |
| id | string | auto | Identifiant unique (généré automatiquement) |

### Outputs (@output)
| Nom | Type | Description |
|-----|------|-------------|
| showed | void | Émis quand le tooltip apparaît |
| hidden | void | Émis quand le tooltip disparaît |

## Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: TOOLTIP_CONFIG,
      useValue: {
        variant: 'dark',
        position: 'top',
        showDelay: 200,
        hideDelay: 100,
        maxWidth: 200
      }
    }
  ]
})
```

## Exemples Avancés

### Utilisation avec les outputs

```typescript
import { Component } from '@angular/core';
import { PshTooltipComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshTooltipComponent],
  template: `
    <psh-tooltip
      content="Tooltip avec suivi"
      (showed)="onTooltipShowed()"
      (hidden)="onTooltipHidden()"
    >
      <button>Survolez-moi</button>
    </psh-tooltip>
  `
})
export class ExampleComponent {
  onTooltipShowed(): void {
    console.log('Tooltip affiché');
  }

  onTooltipHidden(): void {
    console.log('Tooltip masqué');
  }
}
```

### Contrôle dynamique de l'état

```typescript
import { Component, signal } from '@angular/core';
import { PshTooltipComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshTooltipComponent],
  template: `
    <psh-tooltip
      content="Ce tooltip peut être désactivé"
      [disabled]="isDisabled()"
    >
      <button>Élément avec tooltip</button>
    </psh-tooltip>

    <button (click)="toggleTooltip()">
      {{ isDisabled() ? 'Activer' : 'Désactiver' }} le tooltip
    </button>
  `
})
export class ExampleComponent {
  isDisabled = signal(false);

  toggleTooltip(): void {
    this.isDisabled.update(disabled => !disabled);
  }
}
```

## Bonnes Pratiques

1. **Utilisation**
   - Toujours fournir un contenu concis et informatif
   - Choisir une position adaptée au contexte et à l'espace disponible
   - Adapter les délais selon le cas d'usage (0ms pour les tooltips informationnels rapides)
   - Définir une largeur maximale raisonnable pour la lisibilité

2. **Accessibilité**
   - Le composant gère automatiquement le support clavier (focus/blur)
   - Le rôle tooltip et les attributs ARIA sont appliqués automatiquement
   - Utiliser `ariaLabel` pour fournir un contexte supplémentaire si nécessaire
   - Le contenu du tooltip doit être descriptif et compréhensible hors contexte

3. **Performance**
   - Le composant utilise des signals pour une réactivité optimale
   - La stratégie OnPush minimise les détections de changements
   - Les timeouts sont automatiquement nettoyés à la destruction
   - Éviter de mettre du contenu complexe dans les tooltips

4. **UX**
   - Les délais par défaut (200ms affichage, 100ms masquage) offrent une expérience naturelle
   - Les animations sont fluides grâce aux transitions CSS
   - Le positionnement intelligent s'adapte à l'espace disponible
   - Le contenu reste lisible avec un contraste suffisant dans les deux variantes

5. **Événements**
   - Utiliser les outputs `showed` et `hidden` pour les analytics ou logs
   - Éviter les effets de bord complexes dans ces callbacks
   - Les événements sont émis après les délais configurés