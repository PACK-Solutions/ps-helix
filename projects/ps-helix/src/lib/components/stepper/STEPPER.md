# Stepper Component Documentation

## Table des Matières
- [Utilisation](#utilisation)
- [API](#api)
- [Variantes](#variantes)
- [Gestion des Erreurs](#gestion-des-erreurs)
- [Configuration Globale](#configuration-globale)
- [Types](#types)
- [Accessibilité](#accessibilité)
- [Bonnes Pratiques](#bonnes-pratiques)
- [Exemple Complet](#exemple-complet)

## Vue d'ensemble

Le composant Stepper est un composant de navigation horizontale pour les processus multi-étapes. Il fournit un retour visuel sur la progression à travers une série d'étapes séquentielles.

**Note :** Ce composant est conçu exclusivement pour les dispositions horizontales. Pour les affichages verticaux de type timeline, utilisez le composant Timeline (à venir).

## Utilisation

1. Importer le composant dans votre module ou composant standalone :
```typescript
import { PshStepperComponent, PshStepComponent } from 'ps-helix';

@Component({
  imports: [PshStepperComponent, PshStepComponent]
})
```

### Utilisation de Base

```html
<psh-stepper
  [(activeStep)]="currentStep"
  (stepChange)="handleStepChange($event)"
  (completed)="handleComplete()"
>
  <psh-step title="Compte" icon="user">
    Contenu de l'étape 1
  </psh-step>
  <psh-step title="Détails" icon="info">
    Contenu de l'étape 2
  </psh-step>
  <psh-step title="Confirmation" icon="check">
    Contenu de l'étape 3
  </psh-step>
</psh-stepper>
```

### Avec Validation de Formulaire

```html
<psh-stepper [linear]="true">
  <psh-step
    title="Informations"
    icon="user"
    [completed]="isStep1Valid()"
    [error]="step1Error"
  >
    <form [formGroup]="step1Form">
      <!-- Contenu du formulaire -->
    </form>
  </psh-step>

  <psh-step
    title="Validation"
    icon="check"
    [disabled]="!isStep1Valid()"
  >
    <!-- Contenu de validation -->
  </psh-step>
</psh-stepper>
```

## API

### PshStepperComponent

#### Model Inputs

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| activeStep | number | 0 | Index de l'étape active (support two-way binding) |

#### Input Signals

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| variant | StepperVariant | 'default' | Variante visuelle ('default' \| 'numbered' \| 'progress') |
| linear | boolean | true | Force la progression séquentielle des étapes |
| ariaLabels | StepperAriaLabels | {...} | Labels ARIA personnalisés pour l'accessibilité |
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
| effectiveAriaLabels() | StepperAriaLabels | Retourne les labels ARIA effectifs (configurés ou par défaut) |
| steps() | StepConfig[] | Retourne la configuration de toutes les étapes |

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
getStepAriaLabel(step: StepConfig, index: number): string;
getStepDescribedBy(step: StepConfig, index: number): string | null;
```

| Méthode | Description |
|---------|-------------|
| `next()` | Navigue vers l'étape suivante si possible |
| `previous()` | Navigue vers l'étape précédente |
| `goToStep(index)` | Navigue vers une étape spécifique par index |
| `reset()` | Réinitialise le stepper à l'étape 0 |
| `canGoNext()` | Vérifie si la navigation vers l'étape suivante est possible |
| `canGoPrevious()` | Vérifie si la navigation vers l'étape précédente est possible |
| `canActivateStep(index)` | Vérifie si une étape spécifique peut être activée |
| `isStepValid(index)` | Vérifie si une étape est valide (complétée et sans erreur) |
| `getStepAriaLabel(step, index)` | Génère le label ARIA pour une étape |
| `getStepDescribedBy(step, index)` | Retourne l'ID de description pour les messages (erreur, warning, success) |

### PshStepComponent

#### Inputs

| Nom | Type | Défaut | Description |
|-----|------|--------|-------------|
| title | string | required | Titre de l'étape affiché dans le header |
| subtitle | string | undefined | Sous-titre optionnel pour plus de contexte |
| icon | string | undefined | Nom de l'icône Phosphor à afficher |
| completed | boolean | false | Marque l'étape comme complétée |
| disabled | boolean | false | Désactive l'accès à l'étape |
| loading | boolean | false | Affiche un spinner dans le header (uniquement pour variant="progress") |
| error | string | undefined | Message d'erreur affiché sous le titre |
| warning | string | undefined | Message d'avertissement affiché sous le titre |
| success | string | undefined | Message de succès affiché sous le titre |

## Variantes

### Default

La variante par défaut affiche des icônes ou des points avec des labels inline.

```html
<psh-stepper variant="default">
  <psh-step title="Étape 1" icon="user">Contenu</psh-step>
  <psh-step title="Étape 2" icon="info">Contenu</psh-step>
</psh-stepper>
```

**Cas d'utilisation** : Processus standard avec icônes contextuelles.

### Numbered

Affiche des indicateurs numérotés au lieu des icônes.

```html
<psh-stepper variant="numbered">
  <psh-step title="Configuration">Contenu</psh-step>
  <psh-step title="Validation">Contenu</psh-step>
</psh-stepper>
```

**Cas d'utilisation** : Processus séquentiels et formulaires multi-pages.

### Progress

Affiche une animation de progression sur l'indicateur de l'étape active.

```html
<psh-stepper variant="progress">
  <psh-step title="Début" [loading]="isLoading">Contenu</psh-step>
  <psh-step title="Fin">Contenu</psh-step>
</psh-stepper>
```

**Cas d'utilisation** : Onboarding, processus d'installation et opérations asynchrones.

**Fonctionnalité** : Utilisez `[loading]="true"` pour afficher un spinner rotatif dans le header de l'étape.

## Gestion des Erreurs

Le stepper émet des événements `navigationError` pour signaler les problèmes de navigation. Cela permet d'afficher des messages d'erreur appropriés à l'utilisateur.

### Utilisation avec navigationError

```typescript
import { Component, signal } from '@angular/core';
import { PshStepperComponent, PshStepComponent, PshAlertComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshStepperComponent, PshStepComponent, PshAlertComponent],
  template: `
    @if (errorMessage()) {
      <psh-alert variant="danger" [dismissible]="true" (dismissed)="errorMessage.set('')">
        {{ errorMessage() }}
      </psh-alert>
    }

    <psh-stepper
      [(activeStep)]="activeStep"
      [linear]="true"
      [beforeStepChange]="validateStep"
      (navigationError)="handleNavigationError($event)"
    >
      <psh-step
        title="Informations"
        icon="user"
        [completed]="isStep1Valid()"
      >
        <form [formGroup]="form">
          <!-- Champs du formulaire -->
        </form>
      </psh-step>

      <psh-step title="Confirmation" icon="check">
        <p>Vérifiez vos informations</p>
      </psh-step>
    </psh-stepper>
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
    return this.form.valid;
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

### Réinitialisation du Stepper

Utilisez la méthode `reset()` pour revenir à l'étape initiale :

```typescript
@Component({
  template: `
    <psh-stepper #stepper [(activeStep)]="activeStep">
      <!-- Steps -->
    </psh-stepper>

    <psh-button (clicked)="resetStepper()">
      Recommencer
    </psh-button>
  `
})
export class ExampleComponent {
  stepperRef = viewChild<PshStepperComponent>('stepper');

  resetStepper(): void {
    this.stepperRef()?.reset();
  }
}
```

## Configuration Globale

Utilisez `STEPPER_CONFIG` pour définir les valeurs par défaut :

```typescript
import { STEPPER_CONFIG } from 'ps-helix';

@Component({
  providers: [
    {
      provide: STEPPER_CONFIG,
      useValue: {
        variant: 'default',
        linear: true,
        ariaLabels: {
          step: 'Étape',
          completed: 'Étape complétée',
          active: 'Étape active',
          incomplete: 'Étape incomplète',
          disabled: 'Étape désactivée'
        }
      }
    }
  ]
})
```

## Types

```typescript
type StepperVariant = 'default' | 'numbered' | 'progress';

interface StepConfig {
  title: string;
  subtitle?: string;
  icon?: string;
  disabled: boolean;
  completed: boolean;
  loading: boolean;
  error?: string;
  warning?: string;
  success?: string;
}

interface StepperConfig {
  variant: StepperVariant;
  linear: boolean;
  ariaLabels?: StepperAriaLabels;
}

interface StepperAriaLabels {
  step: string;
  completed: string;
  active: string;
  incomplete: string;
  disabled: string;
}
```

## Accessibilité

Le composant Stepper respecte les directives WCAG 2.1 AA avec un support complet de l'accessibilité.

### Navigation au Clavier

| Touche | Action |
|--------|--------|
| Flèches Gauche/Droite | Naviguer entre les headers d'étapes |
| Home | Aller à la première étape |
| End | Aller à la dernière étape |
| Enter/Espace | Activer l'étape focalisée |
| Tab | Déplacer le focus entre les éléments interactifs |

### Rôles ARIA

- `role="tablist"` sur le conteneur du stepper
- `role="tab"` sur chaque header d'étape
- `role="tabpanel"` sur chaque panneau de contenu

### États ARIA (gérés automatiquement)

- `aria-selected` : Indique l'étape active
- `aria-current="step"` : Marque l'étape courante
- `aria-disabled` : Indique les étapes désactivées
- `aria-describedby` : Lie les messages d'erreur aux étapes

### Annonces Dynamiques

- Messages d'erreur annoncés avec `aria-live="polite"`
- Outline de focus visible avec ratio de contraste minimum 3:1

### Labels ARIA Personnalisés

```html
<psh-stepper
  [ariaLabels]="{
    step: 'Étape',
    completed: 'Étape terminée',
    active: 'Étape en cours',
    incomplete: 'Étape à venir',
    disabled: 'Étape indisponible'
  }"
>
  <!-- Steps -->
</psh-stepper>
```

## Bonnes Pratiques

### Structure et Contenu

- Gardez le contenu des étapes focalisé et concis
- Fournissez des titres d'étapes clairs et descriptifs
- Utilisez les icônes de manière cohérente sur toutes les étapes
- Validez chaque étape avant de permettre la progression
- Gérez les états d'erreur explicitement

### Validation

- Implémentez `beforeStepChange` pour une logique de validation personnalisée
- Marquez clairement les étapes complétées
- Affichez les messages d'erreur inline avec les étapes
- Empêchez la navigation vers les étapes incomplètes en mode linéaire
- Écoutez `navigationError` pour afficher des messages d'erreur à l'utilisateur

### Performance

- Utilisez la stratégie de détection de changements OnPush
- Tirez parti des signals pour l'état réactif
- Implémentez un nettoyage approprié dans les composants
- Utilisez des fonctions trackBy pour les boucles

### Design Responsive

- Le stepper s'adapte automatiquement aux écrans mobiles
- Sur les petits viewports, les labels s'empilent verticalement
- Les connecteurs sont masqués sur mobile pour un meilleur espacement
- Testez sur différentes tailles d'écran pour assurer l'utilisabilité

## Exemple Complet

```typescript
import { Component, signal, viewChild, computed } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PshStepperComponent, PshStepComponent, PshButtonComponent, PshAlertComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [
    PshStepperComponent,
    PshStepComponent,
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

    <div class="progress-indicator">
      Progression: {{ stepper.progress() | number:'1.0-0' }}%
      ({{ stepper.completedSteps() }}/{{ stepper.steps().length }} étapes)
    </div>

    <psh-stepper
      #stepper
      [(activeStep)]="activeStep"
      [linear]="true"
      [beforeStepChange]="validateStepChange"
      (stepChange)="handleStepChange($event)"
      (completed)="handleComplete()"
      (navigationError)="handleError($event)"
    >
      <psh-step
        title="Informations Personnelles"
        icon="user"
        [completed]="isStep1Valid()"
        [error]="step1Error()"
      >
        <form [formGroup]="step1Form">
          <input formControlName="firstName" placeholder="Prénom" />
          <input formControlName="lastName" placeholder="Nom" />
          <input formControlName="email" placeholder="Email" />
        </form>
        <div class="actions">
          <psh-button variant="primary" (clicked)="nextStep()">
            Suivant
          </psh-button>
        </div>
      </psh-step>

      <psh-step
        title="Adresse"
        icon="map-pin"
        [completed]="isStep2Valid()"
        [disabled]="!isStep1Valid()"
      >
        <form [formGroup]="step2Form">
          <input formControlName="address" placeholder="Adresse" />
          <input formControlName="city" placeholder="Ville" />
        </form>
        <div class="actions">
          <psh-button appearance="text" (clicked)="previousStep()">Retour</psh-button>
          <psh-button variant="primary" (clicked)="nextStep()">Suivant</psh-button>
        </div>
      </psh-step>

      <psh-step
        title="Confirmation"
        icon="check"
        [disabled]="!isStep2Valid()"
      >
        <p>Vérifiez vos informations</p>
        <div class="actions">
          <psh-button appearance="text" (clicked)="previousStep()">Retour</psh-button>
          <psh-button variant="success" (clicked)="submit()">Soumettre</psh-button>
          <psh-button appearance="outline" (clicked)="resetStepper()">Recommencer</psh-button>
        </div>
      </psh-step>
    </psh-stepper>
  `
})
export class ExampleComponent {
  stepperRef = viewChild<PshStepperComponent>('stepper');
  activeStep = signal(0);
  step1Error = signal<string | undefined>(undefined);
  errorMessage = signal('');

  step1Form: FormGroup;
  step2Form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.step1Form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });

    this.step2Form = this.fb.group({
      address: ['', Validators.required],
      city: ['', Validators.required]
    });
  }

  nextStep(): void {
    this.stepperRef()?.next();
  }

  previousStep(): void {
    this.stepperRef()?.previous();
  }

  resetStepper(): void {
    this.stepperRef()?.reset();
    this.step1Form.reset();
    this.step2Form.reset();
    this.step1Error.set(undefined);
  }

  validateStepChange = async (from: number, to: number): Promise<boolean> => {
    if (from === 0 && !this.step1Form.valid) {
      this.step1Form.markAllAsTouched();
      this.step1Error.set('Veuillez compléter tous les champs requis');
      return false;
    }
    if (from === 1 && !this.step2Form.valid) {
      this.step2Form.markAllAsTouched();
      return false;
    }
    this.step1Error.set(undefined);
    return true;
  };

  handleStepChange(step: number): void {
    console.log('Étape active:', step);
  }

  handleComplete(): void {
    console.log('Toutes les étapes sont complétées!');
  }

  handleError(error: string): void {
    this.errorMessage.set(error);
    setTimeout(() => this.errorMessage.set(''), 5000);
  }

  isStep1Valid(): boolean {
    return this.step1Form.valid;
  }

  isStep2Valid(): boolean {
    return this.step2Form.valid;
  }

  submit(): void {
    if (this.step1Form.valid && this.step2Form.valid) {
      console.log('Soumission:', {
        ...this.step1Form.value,
        ...this.step2Form.value
      });
    }
  }
}
```

## Fonctionnalités

- Navigation horizontale par étapes
- Trois variantes visuelles (default, numbered, progress)
- Progression linéaire ou non-linéaire
- Support de validation de formulaires
- Navigation au clavier (ArrowLeft, ArrowRight, Enter, Space, Home, End)
- Indicateurs d'état (active, completed, disabled, error, warning, success)
- Entièrement accessible avec attributs ARIA
- Design responsive avec optimisations mobiles
- Transitions animées entre les étapes
- Labels ARIA personnalisables
- Hook de validation beforeStepChange
- Événement navigationError pour la gestion des erreurs
- Méthode reset() pour réinitialiser le stepper
- Propriétés calculées pour la progression (progress, completedSteps, isFirstStep, isLastStep)

## Composants Associés

Pour les affichages verticaux de type timeline, considérez l'utilisation du composant Timeline (à venir), qui est spécifiquement conçu pour les dispositions verticales chronologiques.
