# Stepper Component Documentation

## Overview

The Stepper component is a horizontal navigation component for multi-step processes. It provides visual feedback about the progress through a series of sequential steps.

**Note:** This component is designed exclusively for horizontal layouts. For vertical timeline displays, use the Timeline component (coming soon).

## Installation and Usage

### Installation

```typescript
import { PshStepperComponent, PshStepComponent } from 'ps-helix';

@Component({
  imports: [PshStepperComponent, PshStepComponent]
})
```

### Basic Usage

```html
<psh-stepper
  [(activeStep)]="currentStep"
  (stepChange)="handleStepChange($event)"
  (completed)="handleComplete()"
>
  <psh-step title="Account" icon="user">
    Step 1 content
  </psh-step>
  <psh-step title="Details" icon="info">
    Step 2 content
  </psh-step>
  <psh-step title="Confirmation" icon="check">
    Step 3 content
  </psh-step>
</psh-stepper>
```

### With Form Validation

```html
<psh-stepper [linear]="true">
  <psh-step
    title="Information"
    icon="user"
    [completed]="isStep1Valid()"
    [error]="step1Error"
  >
    <form [formGroup]="step1Form">
      <!-- Form content -->
    </form>
  </psh-step>

  <psh-step
    title="Validation"
    icon="check"
    [disabled]="!isStep1Valid()"
  >
    <!-- Validation content -->
  </psh-step>
</psh-stepper>
```

## API

### PshStepperComponent

#### Model Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| activeStep | number | 0 | Index of the active step |

#### Regular Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| variant | StepperVariant | 'default' | Visual variant |
| linear | boolean | true | Enforce linear progression |
| ariaLabels | Record<string, string> | {...} | ARIA labels for accessibility |
| beforeStepChange | (from: number, to: number) => Promise<boolean> \| boolean | undefined | Validation hook before step change |

#### Outputs

| Name | Type | Description |
|------|------|-------------|
| stepChange | EventEmitter<number> | Emitted when step changes |
| completed | EventEmitter<void> | Emitted when process completes |

#### Public Methods

```typescript
next(): Promise<void>;
previous(): Promise<void>;
goToStep(index: number): Promise<void>;
canGoNext(): boolean;
canGoPrevious(): boolean;
canActivateStep(index: number): boolean;
isStepValid(index: number): boolean;
```

### PshStepComponent

#### Inputs

| Name | Type | Default | Description |
|------|------|---------|-------------|
| title | string | required | Step title |
| subtitle | string | undefined | Optional subtitle |
| icon | string | undefined | Phosphor icon name |
| disabled | boolean | false | Disabled state |
| completed | boolean | false | Completed state |
| error | string | undefined | Error message |
| warning | string | undefined | Warning message |
| success | string | undefined | Success message |

## Variants

### Default

The default variant displays icons or dots with inline labels.

```html
<psh-stepper variant="default">
  <psh-step title="Step 1" icon="user">Content</psh-step>
  <psh-step title="Step 2" icon="info">Content</psh-step>
</psh-stepper>
```

### Numbered

Displays numbered indicators instead of icons.

```html
<psh-stepper variant="numbered">
  <psh-step title="Step 1">Content</psh-step>
  <psh-step title="Step 2">Content</psh-step>
</psh-stepper>
```

### Progress

Shows a progress animation on the active step indicator.

```html
<psh-stepper variant="progress">
  <psh-step title="Step 1">Content</psh-step>
  <psh-step title="Step 2">Content</psh-step>
</psh-stepper>
```

## Configuration

### Global Configuration

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
          step: 'Step',
          completed: 'Completed step',
          active: 'Active step',
          incomplete: 'Incomplete step',
          disabled: 'Disabled step'
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
  error?: string;
  warning?: string;
  success?: string;
}

interface StepperConfig {
  variant: StepperVariant;
  linear: boolean;
  ariaLabels?: Record<string, string>;
}
```

## Complete Example

```typescript
import { Component, signal, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PshStepperComponent, PshStepComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [PshStepperComponent, PshStepComponent, ReactiveFormsModule],
  template: `
    <psh-stepper
      #stepper
      [(activeStep)]="activeStep"
      [linear]="true"
      [beforeStepChange]="validateStepChange"
      (stepChange)="handleStepChange($event)"
      (completed)="handleComplete()"
    >
      <psh-step
        title="Personal Info"
        icon="user"
        [completed]="isStep1Valid()"
        [error]="step1Error()"
      >
        <form [formGroup]="step1Form">
          <input formControlName="firstName" placeholder="First Name" />
          <input formControlName="lastName" placeholder="Last Name" />
          <input formControlName="email" placeholder="Email" />
        </form>
        <button (click)="nextStep()">Next</button>
      </psh-step>

      <psh-step
        title="Address"
        icon="map-pin"
        [completed]="isStep2Valid()"
        [disabled]="!isStep1Valid()"
      >
        <form [formGroup]="step2Form">
          <input formControlName="address" placeholder="Address" />
          <input formControlName="city" placeholder="City" />
        </form>
        <button (click)="previousStep()">Back</button>
        <button (click)="nextStep()">Next</button>
      </psh-step>

      <psh-step
        title="Confirmation"
        icon="check"
        [disabled]="!isStep2Valid()"
      >
        <p>Review your information</p>
        <button (click)="previousStep()">Back</button>
        <button (click)="submit()">Submit</button>
      </psh-step>
    </psh-stepper>
  `
})
export class ExampleComponent {
  stepperRef = viewChild<PshStepperComponent>('stepper');
  activeStep = signal(0);
  step1Error = signal<string | undefined>(undefined);

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

  validateStepChange = async (from: number, to: number): Promise<boolean> => {
    if (from === 0 && !this.step1Form.valid) {
      this.step1Form.markAllAsTouched();
      this.step1Error.set('Please complete all required fields');
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
    console.log('Active step:', step);
  }

  handleComplete(): void {
    console.log('All steps completed!');
  }

  isStep1Valid(): boolean {
    return this.step1Form.valid;
  }

  isStep2Valid(): boolean {
    return this.step2Form.valid;
  }

  submit(): void {
    if (this.step1Form.valid && this.step2Form.valid) {
      console.log('Submitting:', {
        ...this.step1Form.value,
        ...this.step2Form.value
      });
    }
  }
}
```

## Best Practices

### Structure and Content

- Keep step content focused and concise
- Provide clear, descriptive step titles
- Use icons consistently across all steps
- Validate each step before allowing progression
- Handle error states explicitly

### Accessibility

- Provide descriptive ARIA labels
- Ensure keyboard navigation works correctly (Left/Right arrows, Enter, Space)
- Use proper ARIA states (aria-selected, aria-disabled, aria-current)
- Include error messages that are announced to screen readers
- Maintain focus management between steps

### Performance

- Use OnPush change detection strategy
- Leverage signals for reactive state
- Implement proper cleanup in components
- Use trackBy functions for loops

### Validation

- Implement beforeStepChange for custom validation logic
- Mark completed steps clearly
- Display error messages inline with steps
- Prevent navigation to incomplete steps in linear mode
- Provide immediate feedback on validation errors

### Responsive Design

- The stepper automatically adapts to mobile screens
- On small viewports, step labels stack vertically
- Connectors are hidden on mobile for better spacing
- Test on various screen sizes to ensure usability

## Features

- Horizontal step navigation
- Three visual variants (default, numbered, progress)
- Linear or non-linear progression
- Form validation support
- Keyboard navigation (ArrowLeft, ArrowRight, Enter, Space, Home, End)
- State indicators (active, completed, disabled, error, warning, success)
- Fully accessible with ARIA attributes
- Responsive design with mobile optimizations
- Animation transitions between steps
- Customizable ARIA labels
- beforeStepChange validation hook

## Related Components

For vertical timeline displays, consider using the Timeline component (coming soon), which is specifically designed for chronological vertical layouts.
