# State Flow Indicator Component Documentation

## Table des Matières
- [Utilisation](#utilisation)
- [API](#api)
- [Tailles](#tailles)
- [Gestion des Erreurs](#gestion-des-erreurs)
- [Configuration Globale](#configuration-globale)
- [Types](#types)
- [Accessibilité](#accessibilité)
- [Bonnes Pratiques](#bonnes-pratiques)
- [Exemple Complet](#exemple-complet)

## Vue d'ensemble

Le composant State Flow Indicator est un indicateur de progression visuel en forme de segments chevron (flèche). Il affiche la progression à travers une série d'étapes séquentielles avec des états visuels distincts (actif, complété, erreur, avertissement, chargement).

**Différence avec le Stepper :** Le State Flow Indicator est un indicateur visuel pur, sans panneaux de contenu projetés ni variantes visuelles. Pour un composant de navigation multi-étapes avec contenu intégré, utilisez le composant [Stepper](../stepper/STEPPER.md).

## Utilisation

1. Importer les composants dans votre composant standalone :
```typescript
import { PshStateFlowIndicatorComponent, PshFlowStepComponent } from 'ps-helix';

@Component({
  imports: [PshStateFlowIndicatorComponent, PshFlowStepComponent]
})
```

### Utilisation de Base

```html
<psh-state-flow-indicator
  [(activeStep)]="currentStep"
  (stepChange)="handleStepChange($event)"
  (completed)="handleComplete()"
>
  <psh-flow-step title="Commande" />
  <psh-flow-step title="Paiement" />
  <psh-flow-step title="Livraison" />
  <psh-flow-step title="Confirmation" />
</psh-state-flow-indicator>
```

### Avec Validation

```html
<psh-state-flow-indicator
  [(activeStep)]="currentStep"
  [linear]="true"
  [beforeStepChange]="validateStep"
  (navigationError)="handleError($event)"
>
  <psh-flow-step
    title="Informations"
    [completed]="isStep1Valid()"
    [error]="step1Error"
  />
  <psh-flow-step
    title="Vérification"
    [disabled]="!isStep1Valid()"
  />
  <psh-flow-step
    title="Terminé"
    [disabled]="!isStep2Valid()"
  />
</psh-state-flow-indicator>
```

### Mode Non-Linéaire

En mode non-linéaire, l'utilisateur peut naviguer librement entre les étapes sans avoir à compléter les précédentes.

```html
<psh-state-flow-indicator
  [(activeStep)]="currentStep"
  [linear]="false"
>
  <psh-flow-step title="Général" />
  <psh-flow-step title="Apparence" />
  <psh-flow-step title="Avancé" />
</psh-state-flow-indicator>
```

### Avec États Visuels

```html
<psh-state-flow-indicator [(activeStep)]="currentStep">
  <psh-flow-step title="Upload" [completed]="true" />
  <psh-flow-step title="Traitement" [loading]="true" />
  <psh-flow-step title="Validation" [warning]="'Fichier volumineux'" />
  <psh-flow-step title="Erreur" [error]="'Échec de conversion'" />
  <psh-flow-step title="Publication" [disabled]="true" />
</psh-state-flow-indicator>
```

## API

### PshStateFlowIndicatorComponent

#### Model Inputs

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| activeStep | number | 0 | Index de l'étape active (support two-way binding) |

#### Input Signals

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| linear | boolean | true | Force la progression séquentielle des étapes |
| size | StateFlowIndicatorSize | 'medium' | Taille du composant ('small' \| 'medium' \| 'large') |
| ariaLabels | StateFlowIndicatorAriaLabels | {...} | Labels ARIA personnalisés pour l'accessibilité |
| beforeStepChange | (from: number, to: number) => Promise\<boolean\> \| boolean | undefined | Hook de validation avant changement d'étape |

#### Outputs

| Nom | Type | Description |
|-----|------|-------------|
| stepChange | OutputEmitterRef\<number\> | Émis lors du changement d'étape active |
| completed | OutputEmitterRef\<void\> | Émis lorsque la dernière étape complétée est atteinte |
| navigationError | OutputEmitterRef\<string\> | Émis lors d'une erreur de navigation (validation bloquée, index invalide) |

#### Propriétés Calculées (Computed)

| Nom | Type | Description |
|-----|------|-------------|
| isFirstStep() | boolean | Retourne true si on est à la première étape |
| isLastStep() | boolean | Retourne true si on est à la dernière étape |
| progress() | number | Retourne le pourcentage de progression (0-100) |
| completedSteps() | number | Retourne le nombre d'étapes complétées |
| effectiveAriaLabels() | StateFlowIndicatorAriaLabels | Retourne les labels ARIA effectifs (configurés ou par défaut) |
| steps() | FlowStepConfig[] | Retourne la configuration de toutes les étapes |

#### Méthodes Publiques

```typescript
next(): Promise<void>;
previous(): Promise<void>;
goToStep(index: number): Promise<void>;
reset(): void;
canGoNext(): boolean;
canGoPrevious(): boolean;
canActivateStep(index: number): boolean;
isStepValid(index: number): boolean;
getStepAriaLabel(step: FlowStepConfig, index: number): string;
```

| Méthode | Description |
|---------|-------------|
| `next()` | Navigue vers l'étape suivante si possible |
| `previous()` | Navigue vers l'étape précédente |
| `goToStep(index)` | Navigue vers une étape spécifique par index |
| `reset()` | Réinitialise l'indicateur à l'étape 0 |
| `canGoNext()` | Vérifie si la navigation vers l'étape suivante est possible |
| `canGoPrevious()` | Vérifie si la navigation vers l'étape précédente est possible |
| `canActivateStep(index)` | Vérifie si une étape spécifique peut être activée |
| `isStepValid(index)` | Vérifie si une étape est valide (complétée et sans erreur) |
| `getStepAriaLabel(step, index)` | Génère le label ARIA pour une étape |

### PshFlowStepComponent

#### Inputs

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| title | string | required | Titre de l'étape affiché dans le segment |
| disabled | boolean | false | Désactive l'accès à l'étape |
| completed | boolean | false | Marque l'étape comme complétée |
| loading | boolean | false | Affiche un spinner rotatif dans le segment |
| error | string | undefined | Message d'erreur (affiche une icône d'erreur) |
| warning | string | undefined | Message d'avertissement (affiche une icône d'avertissement) |

#### Signaux Publics (lecture seule)

| Nom | Type | Description |
|-----|------|-------------|
| index | Signal\<number\> | Index de l'étape dans la liste |
| isActive | Signal\<boolean\> | Indique si l'étape est actuellement active |

## Tailles

Le composant propose trois tailles via l'input `size`.

### Small

Taille compacte, adaptée aux espaces restreints.

```html
<psh-state-flow-indicator size="small">
  <psh-flow-step title="Étape 1" />
  <psh-flow-step title="Étape 2" />
</psh-state-flow-indicator>
```

### Medium (défaut)

Taille standard pour la plupart des cas d'utilisation.

```html
<psh-state-flow-indicator size="medium">
  <psh-flow-step title="Étape 1" />
  <psh-flow-step title="Étape 2" />
</psh-state-flow-indicator>
```

### Large

Taille plus imposante pour une meilleure visibilité.

```html
<psh-state-flow-indicator size="large">
  <psh-flow-step title="Étape 1" />
  <psh-flow-step title="Étape 2" />
</psh-state-flow-indicator>
```

## Gestion des Erreurs

Le composant émet des événements `navigationError` pour signaler les problèmes de navigation. Cela permet d'afficher des messages d'erreur appropriés à l'utilisateur.

### Utilisation avec navigationError

```typescript
import { Component, signal } from '@angular/core';
import { PshStateFlowIndicatorComponent, PshFlowStepComponent, PshAlertComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshStateFlowIndicatorComponent, PshFlowStepComponent, PshAlertComponent],
  template: `
    @if (errorMessage()) {
      <psh-alert variant="danger" [dismissible]="true" (dismissed)="errorMessage.set('')">
        {{ errorMessage() }}
      </psh-alert>
    }

    <psh-state-flow-indicator
      [(activeStep)]="activeStep"
      [linear]="true"
      [beforeStepChange]="validateStep"
      (navigationError)="handleNavigationError($event)"
    >
      <psh-flow-step
        title="Informations"
        [completed]="isStep1Valid()"
      />
      <psh-flow-step title="Confirmation" />
    </psh-state-flow-indicator>
  `
})
export class ExampleComponent {
  activeStep = signal(0);
  errorMessage = signal('');

  validateStep = async (from: number, to: number): Promise<boolean> => {
    if (from === 0 && !this.isStep1Valid()) {
      return false;
    }
    return true;
  };

  handleNavigationError(error: string): void {
    this.errorMessage.set(error);
    setTimeout(() => this.errorMessage.set(''), 5000);
  }

  isStep1Valid(): boolean {
    return true;
  }
}
```

### Types d'Erreurs Émises

| Situation | Message d'erreur |
|-----------|------------------|
| Index invalide | `Invalid step index: X. Valid range: 0-Y` |
| Validation bloquée | `Navigation from step X to step Y was blocked by validation` |
| Étape non accessible | `Cannot activate step X. Please complete previous steps first` |
| Erreur dans beforeStepChange | Message de l'erreur ou `Unknown error in beforeStepChange` |

### Réinitialisation

Utilisez la méthode `reset()` pour revenir à l'étape initiale :

```typescript
@Component({
  template: `
    <psh-state-flow-indicator #indicator [(activeStep)]="activeStep">
      <psh-flow-step title="Étape 1" />
      <psh-flow-step title="Étape 2" />
    </psh-state-flow-indicator>

    <psh-button (clicked)="resetIndicator()">
      Recommencer
    </psh-button>
  `
})
export class ExampleComponent {
  indicatorRef = viewChild<PshStateFlowIndicatorComponent>('indicator');

  resetIndicator(): void {
    this.indicatorRef()?.reset();
  }
}
```

## Configuration Globale

Utilisez `STATE_FLOW_INDICATOR_CONFIG` pour définir les valeurs par défaut :

```typescript
import { STATE_FLOW_INDICATOR_CONFIG } from 'ps-helix';

@Component({
  providers: [
    {
      provide: STATE_FLOW_INDICATOR_CONFIG,
      useValue: {
        linear: true,
        ariaLabels: {
          step: 'Étape',
          completed: 'Étape complétée',
          active: 'Étape active',
          incomplete: 'Étape incomplète',
          disabled: 'Étape désactivée',
          warning: 'Étape avec avertissement',
          error: 'Étape en erreur'
        }
      }
    }
  ]
})
```

### Valeurs par Défaut des Labels ARIA

| Clé | Valeur par défaut |
|-----|-------------------|
| step | Étape |
| completed | Étape complétée |
| active | Étape active |
| incomplete | Étape incomplète |
| disabled | Étape désactivée |
| warning | Étape avec avertissement |
| error | Étape en erreur |

## Types

```typescript
type StateFlowIndicatorSize = 'small' | 'medium' | 'large';

interface FlowStepConfig {
  title: string;
  disabled: boolean;
  completed: boolean;
  loading: boolean;
  error?: string;
  warning?: string;
}

interface StateFlowIndicatorConfig {
  linear: boolean;
  ariaLabels?: StateFlowIndicatorAriaLabels;
}

interface StateFlowIndicatorAriaLabels {
  step: string;
  completed: string;
  active: string;
  incomplete: string;
  disabled: string;
  warning: string;
  error: string;
}
```

## Accessibilité

Le composant State Flow Indicator respecte les directives WCAG 2.1 AA avec un support complet de l'accessibilité.

### Navigation au Clavier

| Touche | Action |
|--------|--------|
| Flèche Droite | Naviguer vers l'étape suivante |
| Flèche Gauche | Naviguer vers l'étape précédente |
| Home | Aller à la première étape |
| End | Aller à la dernière étape |
| Enter / Espace | Activer l'étape focalisée |

### Rôles ARIA

- `role="region"` sur le conteneur principal (`psh-state-flow-indicator`)
- `role="tablist"` sur la piste de segments (`flow-track`)
- `role="tab"` sur chaque segment d'étape

### États ARIA (gérés automatiquement)

- `aria-selected` : Indique l'étape active
- `aria-current="step"` : Marque l'étape courante
- `aria-disabled` : Indique les étapes désactivées ou non accessibles
- `aria-label` : Description complète de l'étape et de son état
- `aria-busy` : Indique qu'une étape est en cours de chargement

### Labels ARIA Personnalisés

```html
<psh-state-flow-indicator
  [ariaLabels]="{
    step: 'Étape',
    completed: 'Étape terminée',
    active: 'Étape en cours',
    incomplete: 'Étape à venir',
    disabled: 'Étape indisponible',
    warning: 'Étape avec avertissement',
    error: 'Étape en erreur'
  }"
>
  <!-- Steps -->
</psh-state-flow-indicator>
```

## Bonnes Pratiques

### Structure et Contenu

- Fournissez des titres d'étapes courts et explicites
- Limitez le nombre d'étapes (3 à 7 recommandé) pour garder l'indicateur lisible
- Utilisez le State Flow Indicator comme indicateur visuel de progression, et le Stepper pour les processus avec contenu intégré

### Validation

- Implémentez `beforeStepChange` pour une logique de validation personnalisée
- Marquez clairement les étapes complétées avec `[completed]="true"`
- Utilisez `[error]` et `[warning]` pour signaler les problèmes visuellement
- Écoutez `navigationError` pour afficher des messages d'erreur à l'utilisateur
- En mode linéaire, empêchez la navigation vers les étapes incomplètes

### Performance

- Utilisez la stratégie de détection de changements OnPush (déjà configurée dans le composant)
- Tirez parti des signals pour l'état réactif
- Implémentez un nettoyage approprié dans les composants

### Design Responsive

- Le composant utilise des container queries pour s'adapter automatiquement
- En dessous de 640px, les polices et icônes sont réduites
- En dessous de 480px, les segments s'empilent verticalement sans forme de chevron
- Testez sur différentes tailles d'écran pour assurer l'utilisabilité

## Exemple Complet

```typescript
import { Component, signal, viewChild, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import {
  PshStateFlowIndicatorComponent,
  PshFlowStepComponent,
  PshButtonComponent,
  PshAlertComponent
} from 'ps-helix';

@Component({
  selector: 'app-order-flow',
  imports: [
    PshStateFlowIndicatorComponent,
    PshFlowStepComponent,
    PshButtonComponent,
    PshAlertComponent,
    ReactiveFormsModule
  ],
  template: `
    @if (errorMessage()) {
      <psh-alert variant="danger" [dismissible]="true" (dismissed)="errorMessage.set('')">
        {{ errorMessage() }}
      </psh-alert>
    }

    <div class="progress-info">
      Progression: {{ indicator.progress() | number:'1.0-0' }}%
      ({{ indicator.completedSteps() }}/{{ indicator.steps().length }} étapes)
    </div>

    <psh-state-flow-indicator
      #indicator
      [(activeStep)]="activeStep"
      [linear]="true"
      size="medium"
      [beforeStepChange]="validateStepChange"
      (stepChange)="handleStepChange($event)"
      (completed)="handleComplete()"
      (navigationError)="handleError($event)"
    >
      <psh-flow-step
        title="Commande"
        [completed]="isStep1Valid()"
        [error]="step1Error()"
      />
      <psh-flow-step
        title="Paiement"
        [completed]="isStep2Valid()"
        [disabled]="!isStep1Valid()"
      />
      <psh-flow-step
        title="Livraison"
        [completed]="isStep3Valid()"
        [disabled]="!isStep2Valid()"
      />
      <psh-flow-step
        title="Confirmation"
        [disabled]="!isStep3Valid()"
      />
    </psh-state-flow-indicator>

    <!-- Contenu de l'étape active -->
    @switch (activeStep()) {
      @case (0) {
        <form [formGroup]="orderForm">
          <input formControlName="product" placeholder="Produit" />
          <input formControlName="quantity" placeholder="Quantité" type="number" />
        </form>
      }
      @case (1) {
        <form [formGroup]="paymentForm">
          <input formControlName="cardNumber" placeholder="Numéro de carte" />
        </form>
      }
      @case (2) {
        <form [formGroup]="deliveryForm">
          <input formControlName="address" placeholder="Adresse" />
          <input formControlName="city" placeholder="Ville" />
        </form>
      }
      @case (3) {
        <p>Vérifiez vos informations avant de confirmer.</p>
      }
    }

    <div class="actions">
      @if (!indicator.isFirstStep()) {
        <psh-button appearance="text" (clicked)="previous()">
          Retour
        </psh-button>
      }
      @if (!indicator.isLastStep()) {
        <psh-button variant="primary" (clicked)="next()">
          Suivant
        </psh-button>
      } @else {
        <psh-button variant="success" (clicked)="submit()">
          Confirmer
        </psh-button>
      }
      <psh-button appearance="outline" (clicked)="reset()">
        Recommencer
      </psh-button>
    </div>
  `
})
export class OrderFlowComponent {
  indicatorRef = viewChild<PshStateFlowIndicatorComponent>('indicator');
  activeStep = signal(0);
  step1Error = signal<string | undefined>(undefined);
  errorMessage = signal('');

  orderForm: FormGroup;
  paymentForm: FormGroup;
  deliveryForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.orderForm = this.fb.group({
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]]
    });

    this.paymentForm = this.fb.group({
      cardNumber: ['', Validators.required]
    });

    this.deliveryForm = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  next(): void {
    this.indicatorRef()?.next();
  }

  previous(): void {
    this.indicatorRef()?.previous();
  }

  reset(): void {
    this.indicatorRef()?.reset();
    this.orderForm.reset({ quantity: 1 });
    this.paymentForm.reset();
    this.deliveryForm.reset();
    this.step1Error.set(undefined);
  }

  validateStepChange = async (from: number, to: number): Promise<boolean> => {
    if (from === 0 && !this.orderForm.valid) {
      this.orderForm.markAllAsTouched();
      this.step1Error.set('Veuillez compléter la commande');
      return false;
    }
    if (from === 1 && !this.paymentForm.valid) {
      this.paymentForm.markAllAsTouched();
      return false;
    }
    if (from === 2 && !this.deliveryForm.valid) {
      this.deliveryForm.markAllAsTouched();
      return false;
    }
    this.step1Error.set(undefined);
    return true;
  };

  handleStepChange(step: number): void {
    console.log('Étape active:', step);
  }

  handleComplete(): void {
    console.log('Processus terminé');
  }

  handleError(error: string): void {
    this.errorMessage.set(error);
    setTimeout(() => this.errorMessage.set(''), 5000);
  }

  isStep1Valid(): boolean {
    return this.orderForm.valid;
  }

  isStep2Valid(): boolean {
    return this.paymentForm.valid;
  }

  isStep3Valid(): boolean {
    return this.deliveryForm.valid;
  }

  submit(): void {
    if (this.orderForm.valid && this.paymentForm.valid && this.deliveryForm.valid) {
      console.log('Soumission:', {
        ...this.orderForm.value,
        ...this.paymentForm.value,
        ...this.deliveryForm.value
      });
    }
  }
}
```

## Fonctionnalités

- Indicateur de progression visuel en segments chevron
- Progression linéaire ou non-linéaire
- Trois tailles configurables (small, medium, large)
- États visuels distincts (actif, complété, désactivé, chargement, erreur, avertissement)
- Navigation au clavier (ArrowLeft, ArrowRight, Enter, Space, Home, End)
- Entièrement accessible avec attributs ARIA
- Design responsive avec container queries (empilage vertical sous 480px)
- Hook de validation beforeStepChange (synchrone ou asynchrone)
- Événement navigationError pour la gestion des erreurs
- Méthode reset() pour réinitialiser l'indicateur
- Propriétés calculées pour la progression (progress, completedSteps, isFirstStep, isLastStep)
- Labels ARIA personnalisables
- Configuration globale via injection token

## Composants Associés

Pour les processus multi-étapes avec contenu intégré et variantes visuelles, utilisez le composant [Stepper](../stepper/STEPPER.md).
