import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  InjectionToken,
  afterNextRender
} from '@angular/core';
import { StepperVariant, StepConfig, StepperConfig, StepperAriaLabels } from './stepper.types';
import { PshStepComponent } from './step.component';

const DEFAULT_ARIA_LABELS: StepperAriaLabels = {
  step: 'Étape',
  completed: 'Étape complétée',
  active: 'Étape active',
  incomplete: 'Étape incomplète',
  disabled: 'Étape désactivée'
};

export const STEPPER_CONFIG = new InjectionToken<Partial<StepperConfig>>('STEPPER_CONFIG', {
  factory: () => ({
    variant: 'default',
    linear: true,
    ariaLabels: DEFAULT_ARIA_LABELS
  })
});

@Component({
  selector: 'psh-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.stepper-container]': 'true',
    '[class.numbered]': 'variant() === "numbered"',
    '[class.progress]': 'variant() === "progress"',
    '[attr.role]': '"region"',
    '[attr.aria-label]': '"Navigation par étapes"'
  }
})
export class PshStepperComponent {
  private config = inject(STEPPER_CONFIG);

  activeStep = model(0);
  variant = input<StepperVariant>(this.config.variant ?? 'default');
  linear = input(this.config.linear ?? true);

  ariaLabels = input<StepperAriaLabels>();
  beforeStepChange = input<(from: number, to: number) => Promise<boolean> | boolean>();

  stepChange = output<number>();
  completed = output<void>();
  navigationError = output<string>();

  stepComponents = contentChildren(PshStepComponent);

  steps = computed(() => this.stepComponents().map(step => ({
    title: step.title(),
    subtitle: step.subtitle(),
    icon: step.icon(),
    disabled: step.disabled(),
    completed: step.completed(),
    loading: step.loading(),
    error: step.error(),
    warning: step.warning(),
    success: step.success()
  })));

  effectiveAriaLabels = computed(() =>
    this.ariaLabels() ?? this.config.ariaLabels ?? DEFAULT_ARIA_LABELS
  );

  isFirstStep = computed(() => this.activeStep() === 0);
  isLastStep = computed(() => this.activeStep() === this.steps().length - 1);
  progress = computed(() =>
    this.steps().length > 0
      ? ((this.activeStep() + 1) / this.steps().length) * 100
      : 0
  );
  completedSteps = computed(() =>
    this.steps().filter(step => step.completed).length
  );

  constructor() {
    afterNextRender(() => {
      this.syncStepStates();
    });

    effect(() => {
      this.syncStepStates();
    });
  }

  private syncStepStates(): void {
    const components = this.stepComponents();
    if (components.length === 0) return;

    const active = this.activeStep();
    components.forEach((step, index) => {
      step.setIndex(index);
      step.setActive(index === active);
    });
  }

  async next(): Promise<void> {
    if (this.canGoNext()) {
      await this.goToStep(this.activeStep() + 1);
    }
  }

  async previous(): Promise<void> {
    if (this.canGoPrevious()) {
      await this.goToStep(this.activeStep() - 1);
    }
  }

  async goToStep(index: number): Promise<void> {
    if (index < 0 || index >= this.steps().length) {
      const errorMsg = `Invalid step index: ${index}. Valid range: 0-${this.steps().length - 1}`;
      this.navigationError.emit(errorMsg);
      return;
    }

    if (index === this.activeStep()) {
      return;
    }

    const beforeChange = this.beforeStepChange();
    if (beforeChange) {
      try {
        const canChange = await Promise.resolve(beforeChange(this.activeStep(), index));
        if (!canChange) {
          this.navigationError.emit(`Navigation from step ${this.activeStep()} to step ${index} was blocked by validation`);
          return;
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error in beforeStepChange';
        this.navigationError.emit(errorMsg);
        return;
      }
    }

    if (!this.canActivateStep(index)) {
      this.navigationError.emit(`Cannot activate step ${index}. Please complete previous steps first`);
      return;
    }

    this.activeStep.set(index);
    this.stepChange.emit(index);

    const currentStep = this.steps()[index];
    if (this.isLastStep() && currentStep?.completed) {
      this.completed.emit();
    }
  }

  canGoNext(): boolean {
    const nextIndex = this.activeStep() + 1;
    return nextIndex < this.steps().length && this.canActivateStep(nextIndex);
  }

  canGoPrevious(): boolean {
    return this.activeStep() > 0;
  }

  canActivateStep(index: number): boolean {
    if (index < 0 || index >= this.steps().length) {
      return false;
    }

    if (!this.linear()) return true;
    if (index === 0) return true;

    const step = this.steps()[index];
    if (step?.disabled) return false;

    return this.steps()
      .slice(0, index)
      .every(step => step.completed && !step.error);
  }

  isStepValid(index: number): boolean {
    const step = this.steps()[index];
    return step ? !!step.completed && !step.error : false;
  }

  getStepAriaLabel(step: StepConfig, index: number): string {
    const labels = this.effectiveAriaLabels();
    const status = step.completed ? labels.completed :
                  index === this.activeStep() ? labels.active :
                  step.disabled ? labels.disabled :
                  labels.incomplete;
    return `${labels.step} ${index + 1}: ${step.title} - ${status}`;
  }

  getStepDescribedBy(step: StepConfig, index: number): string | null {
    if (step.error) return `error-${index}`;
    if (step.warning) return `warning-${index}`;
    if (step.success) return `success-${index}`;
    return null;
  }

  reset(): void {
    this.activeStep.set(0);
    this.stepChange.emit(0);
  }

  handleStepClick(index: number): void {
    const step = this.steps()[index];
    if (step && !step.disabled && this.canActivateStep(index)) {
      this.goToStep(index);
    }
  }

  handleKeydown(event: KeyboardEvent, index: number): void {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.handleStepClick(index);
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (this.canGoNext()) {
          this.next();
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (this.canGoPrevious()) {
          this.previous();
        }
        break;
      case 'Home':
        event.preventDefault();
        if (this.canActivateStep(0)) {
          this.goToStep(0);
        }
        break;
      case 'End':
        event.preventDefault();
        const lastIndex = this.steps().length - 1;
        if (this.canActivateStep(lastIndex)) {
          this.goToStep(lastIndex);
        }
        break;
    }
  }
}
