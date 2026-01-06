# Tabs Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshTabsComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshTabsComponent]
})
```

### Utilisation de Base

```typescript
// Tabs basique avec contenu par défaut
<psh-tabs></psh-tabs>

// Tabs avec contenu personnalisé
<psh-tabs [(activeIndex)]="activeIndex">
  <div tabContent data-header="Accueil" data-icon="house">
    Contenu de l'onglet Accueil
  </div>
  <div tabContent data-header="Profil" data-icon="user">
    Contenu de l'onglet Profil
  </div>
</psh-tabs>
```

## API

### Model Inputs (@model)
| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | TabsVariant | 'default' | Style des onglets |
| size | TabsSize | 'medium' | Taille des onglets |
| activeIndex | number | 0 | Index de l'onglet actif |
| animated | boolean | true | Animation activée |

### Outputs
| Nom | Type | Description |
|-----|------|-------------|
| activeIndexChange | EventEmitter<number> | Émis lors du changement d'onglet |

### Attributs des Onglets
| Attribut | Type | Description |
|----------|------|-------------|
| data-header | string | Titre de l'onglet |
| data-icon | string | Icône Phosphor |

## Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: TABS_CONFIG,
      useValue: {
        variant: 'default',
        size: 'medium',
        activeIndex: 0,
        animated: true
      }
    }
  ]
})
```

## Variants Overview

### Default Tabs
**Description**: Style par défaut avec fond.

**Cas d'utilisation**:
- Navigation principale
- Sections de contenu
- Interfaces standards

### Underline Tabs
**Description**: Style minimaliste avec soulignement.

**Cas d'utilisation**:
- Interfaces épurées
- Navigation secondaire
- Sous-sections

### Pills Tabs
**Description**: Style avec fond coloré.

**Cas d'utilisation**:
- Mise en avant
- Navigation distincte
- Interfaces modernes

## États et Modificateurs

### Tailles
- `small`: Pour les interfaces denses
- `medium`: Taille par défaut
- `large`: Pour plus de visibilité

### États
- `active`: Onglet actif
- `animated`: Transitions animées

## Accessibilité

### Attributs ARIA
- `role="tablist"`: Pour le conteneur
- `role="tab"`: Pour chaque onglet
- `role="tabpanel"`: Pour le contenu
- `aria-selected`: État de sélection
- `aria-controls`: Lien avec le contenu

### Bonnes Pratiques
- Navigation au clavier
- Focus visible
- États distincts

## Exemple Complet

```typescript
@Component({
  template: `
    <psh-tabs
      [(activeIndex)]="activeIndex"
      variant="pills"
      size="medium"
      [animated]="true"
      (activeIndexChange)="handleTabChange($event)"
    >
      <div tabContent data-header="Accueil" data-icon="house">
        Contenu de l'onglet Accueil
      </div>
      <div tabContent data-header="Profil" data-icon="user">
        Contenu de l'onglet Profil
      </div>
    </psh-tabs>
  `
})
export class TabsExampleComponent {
  activeIndex = 0;

  handleTabChange(index: number) {
    console.log('Active tab:', index);
  }
}
```