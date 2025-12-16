# SpinLoader Component Documentation

## Installation et Utilisation

### Installation

1. Installer le package via npm :
```bash
npm install ps-helix
```

2. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshSpinLoaderComponent } from 'ps-helix';

@Component({
  // ...
  imports: [PshSpinLoaderComponent],
  // ...
})
```

### Utilisation de Base

```typescript
// Spinner basique
<psh-spinloader></psh-spinloader>

// Spinner avec variante et couleur
<psh-spinloader
  variant="dots"
  color="primary"
  size="medium"
></psh-spinloader>
```

## API

### Model Inputs (@model)

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | SpinLoaderVariant | 'circle' | Style d'animation ('circle', 'dots', 'pulse') |
| size | SpinLoaderSize | 'medium' | Taille ('small', 'medium', 'large') |
| color | SpinLoaderColor | 'primary' | Couleur ('primary', 'secondary', 'success', 'warning', 'danger') |

## Variants Overview

### Circle Spinner
**Description**: Animation circulaire classique.

**Cas d'utilisation**:
- Chargement général
- Indicateur de progression
- États d'attente

### Dots Spinner
**Description**: Points rebondissants animés.

**Cas d'utilisation**:
- Chargement dynamique
- Feedback interactif
- Interfaces ludiques

### Pulse Spinner
**Description**: Barres pulsantes.

**Cas d'utilisation**:
- Chargement de données
- Indicateur d'activité
- États de traitement

## États et Modificateurs

### Tailles
- `small`: Pour les espaces réduits (24px)
- `medium`: Taille par défaut (32px)
- `large`: Pour plus de visibilité (48px)

### Couleurs
- `primary`: Couleur principale
- `secondary`: Actions secondaires
- `success`: États positifs
- `warning`: Attention requise
- `danger`: États critiques

## Accessibilité

### Attributs ARIA
- `role="status"`: Indique un état de chargement
- `aria-live="polite"`: Annonce les changements d'état
- `aria-label`: Description de l'action en cours

### Bonnes Pratiques
- Fournir des descriptions claires
- Utiliser des contrastes suffisants
- Éviter les animations trop rapides

## Configuration Globale

```typescript
@Component({
  providers: [
    {
      provide: SPINLOADER_CONFIG,
      useValue: {
        variant: 'circle',
        size: 'medium',
        color: 'primary'
      }
    }
  ]
})
```

## Exemple Complet

```typescript
import { Component } from '@angular/core';
import { PshSpinLoaderComponent } from 'ps-helix';

@Component({
  selector: 'app-loading-demo',
  standalone: true,
  imports: [PshSpinLoaderComponent],
  template: `
    <div role="status" aria-label="Chargement en cours">
      <psh-spinloader
        variant="circle"
        color="primary"
        size="medium"
      ></psh-spinloader>
      <span class="sr-only">Chargement...</span>
    </div>
  `
})
export class LoadingDemoComponent {}
```

## Bonnes Pratiques

1. **Utilisation Appropriée**
   - Utiliser pour des actions de chargement
   - Adapter la taille au contexte
   - Choisir la variante selon l'action

2. **Accessibilité**
   - Fournir des descriptions ARIA
   - Éviter les flashs lumineux
   - Supporter les préférences de réduction de mouvement

3. **Performance**
   - Animations CSS optimisées
   - Détection de changements OnPush
   - Nettoyage des ressources

4. **Responsive Design**
   - S'adapte à toutes les tailles d'écran
   - Tailles relatives au conteneur
   - Gestion des petits écrans