# Tooltip Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
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

// Tooltip avec position personnalisee
<psh-tooltip
  content="Tooltip a droite"
  position="right"
>
  <button>Position droite</button>
</psh-tooltip>

// Tooltip avec delais personnalises
<psh-tooltip
  content="Apparition rapide"
  [showDelay]="0"
  [hideDelay]="0"
>
  <button>Rapide</button>
</psh-tooltip>

// Tooltip desactive
<psh-tooltip
  content="Je ne m'afficherai pas"
  [disabled]="true"
>
  <button>Tooltip desactive</button>
</psh-tooltip>

// Tooltip avec evenements
<psh-tooltip
  content="Avec callbacks"
  (shown)="onTooltipShown()"
  (hidden)="onTooltipHidden()"
>
  <button>Avec evenements</button>
</psh-tooltip>

// Tooltip avec auto-flip desactive
<psh-tooltip
  content="Position fixe"
  position="top"
  [autoFlip]="false"
>
  <button>Sans auto-flip</button>
</psh-tooltip>
```

## API

### Inputs (@input)
| Nom | Type | Defaut | Description |
|-----|------|---------|-------------|
| content | string | **requis** | Contenu du tooltip |
| variant | 'light' \| 'dark' | 'dark' | Style du tooltip |
| position | TooltipPosition | 'top' | Position preferee du tooltip |
| showDelay | number | 200 | Delai d'apparition (ms) |
| hideDelay | number | 100 | Delai de disparition (ms) |
| maxWidth | number | 200 | Largeur maximale (px) |
| autoFlip | boolean | true | Inverse automatiquement la position si le tooltip depasse l'ecran |
| disabled | boolean | false | Desactive le tooltip |
| id | string | auto | Identifiant unique (genere automatiquement) |

### Outputs (@output)
| Nom | Type | Description |
|-----|------|-------------|
| shown | void | Emis quand le tooltip apparait |
| hidden | void | Emis quand le tooltip disparait |

## Configuration Globale

```typescript
import { TOOLTIP_CONFIG } from 'ps-helix';

@Component({
  providers: [
    {
      provide: TOOLTIP_CONFIG,
      useValue: {
        variant: 'dark',
        position: 'top',
        showDelay: 200,
        hideDelay: 100,
        maxWidth: 200,
        autoFlip: true
      }
    }
  ]
})
```

## Auto-Flip

Le tooltip detecte automatiquement s'il depasse la viewport et inverse sa position si necessaire :
- `top` devient `bottom` si pas assez d'espace en haut
- `bottom` devient `top` si pas assez d'espace en bas
- `left` devient `right` si pas assez d'espace a gauche
- `right` devient `left` si pas assez d'espace a droite

Pour desactiver ce comportement, utilisez `[autoFlip]="false"`.

## Accessibilite

- Le composant gere automatiquement le support clavier (focus/blur)
- Appuyez sur `Escape` pour fermer le tooltip immediatement
- Le role `tooltip` et les attributs ARIA sont appliques automatiquement
- `aria-describedby` est utilise pour lier le declencheur au contenu du tooltip

## Exemples Avances

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
      (shown)="onTooltipShown()"
      (hidden)="onTooltipHidden()"
    >
      <button>Survolez-moi</button>
    </psh-tooltip>
  `
})
export class ExampleComponent {
  onTooltipShown(): void {
    console.log('Tooltip affiche');
  }

  onTooltipHidden(): void {
    console.log('Tooltip masque');
  }
}
```

### Controle dynamique de l'etat

```typescript
import { Component, signal } from '@angular/core';
import { PshTooltipComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshTooltipComponent],
  template: `
    <psh-tooltip
      content="Ce tooltip peut etre desactive"
      [disabled]="isDisabled()"
    >
      <button>Element avec tooltip</button>
    </psh-tooltip>

    <button (click)="toggleTooltip()">
      {{ isDisabled() ? 'Activer' : 'Desactiver' }} le tooltip
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
   - Choisir une position adaptee au contexte et a l'espace disponible
   - Adapter les delais selon le cas d'usage (0ms pour les tooltips informationnels rapides)
   - Definir une largeur maximale raisonnable pour la lisibilite

2. **Accessibilite**
   - Le composant gere automatiquement le support clavier (focus/blur)
   - Le role tooltip et les attributs ARIA sont appliques automatiquement
   - Le contenu du tooltip doit etre descriptif et comprehensible hors contexte

3. **Performance**
   - Le composant utilise des signals pour une reactivite optimale
   - La strategie OnPush minimise les detections de changements
   - Les timeouts sont automatiquement nettoyes a la destruction
   - Eviter de mettre du contenu complexe dans les tooltips

4. **UX**
   - Les delais par defaut (200ms affichage, 100ms masquage) offrent une experience naturelle
   - Les animations sont fluides grace aux transitions CSS
   - Le positionnement intelligent s'adapte a l'espace disponible
   - Le contenu reste lisible avec un contraste suffisant dans les deux variantes

5. **Evenements**
   - Utiliser les outputs `shown` et `hidden` pour les analytics ou logs
   - Eviter les effets de bord complexes dans ces callbacks
   - Les evenements sont emis apres les delais configures

## Migration depuis la version precedente

### Breaking Changes

| Avant | Apres |
|-------|-------|
| `showed` output | `shown` output |
| `ariaLabel` input | Supprime (non necessaire) |
| `model()` pour variant/position/etc. | `input()` |

### Exemple de migration

```typescript
// Avant
<psh-tooltip
  content="Info"
  [(variant)]="myVariant"
  (showed)="onShow()"
  ariaLabel="Description"
>

// Apres
<psh-tooltip
  content="Info"
  [variant]="myVariant"
  (shown)="onShow()"
>
```
