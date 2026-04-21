# SpinLoader Component Documentation

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
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

### Inputs (Signals)

| Nom | Type | Défaut | Description |
|-----|------|---------|-------------|
| variant | SpinLoaderVariant | 'circle' | Style d'animation ('circle', 'dots', 'pulse') |
| size | SpinLoaderSize | 'medium' | Taille ('small', 'medium', 'large') |
| color | SpinLoaderColor | 'primary' | Couleur ('primary', 'secondary', 'success', 'warning', 'danger') |
| label | string \| undefined | undefined | Label textuel optionnel affiché sous l'indicateur |
| ariaLabel | string | 'Chargement en cours' | Label ARIA pour l'accessibilité |
| ariaLive | 'polite' \| 'assertive' | 'polite' | Niveau de politesse pour les lecteurs d'écran |

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

## Label Dynamique

Le composant accepte un input `label` pour afficher un message textuel sous l'indicateur. Ce label peut être mis à jour dynamiquement pour fournir un feedback en temps réel.

### Exemple avec Label Statique

```typescript
<psh-spinloader
  variant="circle"
  color="primary"
  label="Chargement des données..."
></psh-spinloader>
```

### Exemple avec Label Dynamique (Angular Signals)

```typescript
import { Component, signal } from '@angular/core';
import { PshSpinLoaderComponent } from 'ps-helix';

@Component({
  selector: 'app-data-loader',
  standalone: true,
  imports: [PshSpinLoaderComponent],
  template: `
    <psh-spinloader
      variant="circle"
      color="primary"
      [label]="loadingMessage()"
      [ariaLabel]="loadingMessage()"
    ></psh-spinloader>
  `
})
export class DataLoaderComponent {
  loadingMessage = signal('Chargement des données...');

  async loadData() {
    this.loadingMessage.set('Connexion au serveur...');
    await this.connectToServer();

    this.loadingMessage.set('Récupération des données...');
    await this.fetchData();

    this.loadingMessage.set('Traitement des données...');
    await this.processData();
  }
}
```

### Exemple Multi-Étapes

```typescript
import { Component, signal } from '@angular/core';
import { PshSpinLoaderComponent } from 'ps-helix';

@Component({
  selector: 'app-stepper-loader',
  standalone: true,
  imports: [PshSpinLoaderComponent],
  template: `
    <psh-spinloader
      variant="dots"
      color="primary"
      [label]="'Étape ' + currentStep() + ' sur ' + totalSteps()"
      ariaLabel="Chargement en plusieurs étapes"
    ></psh-spinloader>
  `
})
export class StepperLoaderComponent {
  currentStep = signal(1);
  totalSteps = signal(3);

  async processSteps() {
    for (let i = 1; i <= this.totalSteps(); i++) {
      this.currentStep.set(i);
      await this.processStep(i);
    }
  }
}
```

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

## Known Issues & Limitations

### Memory Leak - Event Listener Cleanup (En cours de correction)

**Problème**: Le composant n'effectue actuellement pas le nettoyage des event listeners `matchMedia` lors de sa destruction.

**Impact**:
- Dans les applications où le composant est créé et détruit fréquemment, des event listeners peuvent s'accumuler en mémoire
- Cela peut entraîner une légère dégradation des performances sur des sessions très longues
- L'impact reste minimal dans la plupart des cas d'usage normaux

**Workaround Temporaire**:
```typescript
import { Component, OnDestroy, effect, signal } from '@angular/core';

@Component({
  selector: 'app-safe-loader',
  template: `<psh-spinloader />`
})
export class SafeLoaderComponent implements OnDestroy {
  private mediaQuery?: MediaQueryList;
  private handler?: (e: MediaQueryListEvent) => void;

  constructor() {
    effect(() => {
      if (typeof window !== 'undefined') {
        this.mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        this.handler = (e: MediaQueryListEvent) => {
          // votre logique
        };
        this.mediaQuery.addEventListener('change', this.handler);
      }
    });
  }

  ngOnDestroy() {
    if (this.mediaQuery && this.handler) {
      this.mediaQuery.removeEventListener('change', this.handler);
    }
  }
}
```

**Statut**: Ce problème sera corrigé dans une prochaine version mineure. La correction consiste à implémenter `OnDestroy` dans le composant et nettoyer l'event listener.

### Limitations Connues

1. **Animations en SSR**: Les animations sont désactivées côté serveur (SSR) pour éviter les erreurs. Elles s'activent automatiquement côté client.

2. **Label Long**: Les labels très longs (>50 caractères) peuvent déborder sur les petits écrans. Privilégiez des messages courts et concis.

3. **Changements Rapides**: Des changements très rapides de variant (< 100ms) peuvent créer de brèves incohérences visuelles pendant les transitions CSS.

## Roadmap & Améliorations Futures

- [ ] Correction du memory leak des event listeners
- [ ] Support des animations personnalisées via CSS custom properties
- [ ] Option pour désactiver les animations programmatiquement
- [ ] Indicateur de progression (0-100%) optionnel
- [ ] Support des thèmes personnalisés via injection token