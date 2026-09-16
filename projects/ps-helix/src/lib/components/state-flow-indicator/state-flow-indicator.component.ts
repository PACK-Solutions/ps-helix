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
import { PshNavigationError } from '../../types/semantic.types';
import { StateFlowIndicatorSize, FlowStepConfig, StateFlowIndicatorConfig, StateFlowIndicatorAriaLabels } from './state-flow-indicator.types';
import { PshFlowStepComponent } from './flow-step.component';

const DEFAULT_ARIA_LABELS: StateFlowIndicatorAriaLabels = {
  step: 'Étape',
  completed: 'Étape complétée',
  active: 'Étape active',
  incomplete: 'Étape incomplète',
  disabled: 'Étape désactivée',
  warning: 'Étape avec avertissement',
  error: 'Étape en erreur'
};

const STATE_FLOW_INDICATOR_DEFAULTS = {
  linear: true,
  ariaLabels: DEFAULT_ARIA_LABELS
} satisfies Partial<StateFlowIndicatorConfig>;

export const STATE_FLOW_INDICATOR_CONFIG = new InjectionToken<Partial<StateFlowIndicatorConfig>>('STATE_FLOW_INDICATOR_CONFIG', {
  factory: () => STATE_FLOW_INDICATOR_DEFAULTS,
});

@Component({
  selector: 'psh-state-flow-indicator',
  templateUrl: './state-flow-indicator.component.html',
  styleUrls: ['./state-flow-indicator.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.psh-state-flow-indicator]': 'true',
    '[class.psh-size-small]': 'size() === "small"',
    '[class.psh-size-medium]': 'size() === "medium"',
    '[class.psh-size-large]': 'size() === "large"',
    '[attr.role]': '"region"',
    '[attr.aria-label]': 'ariaLabel()'
  }
})
export class PshStateFlowIndicatorComponent {
  private config = inject(STATE_FLOW_INDICATOR_CONFIG);

  activeStep = model(0);
  linear = input(this.config.linear ?? true);
  size = input<StateFlowIndicatorSize>('medium');

  ariaLabels = input<StateFlowIndicatorAriaLabels>();

  /** Name of the progress landmark. Was hard-coded, in French, with no way out. */
  readonly ariaLabel = input<string>('Indicateur de progression');
  beforeStepChange = input<(from: number, to: number) => Promise<boolean> | boolean>();

  stepChange = output<number>();
  completed = output<void>();
  navigationError = output<PshNavigationError>();

  stepComponents = contentChildren(PshFlowStepComponent);

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
      this.navigationError.emit({
        action: 'goToStep',
        reason: 'out-of-bounds',
        target: index,
        message: `Invalid step index: ${index}. Valid range: 0-${this.steps().length - 1}`,
      });
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
          this.navigationError.emit({
            action: 'goToStep',
            reason: 'blocked',
            target: index,
            message: `Navigation from step ${this.activeStep()} to step ${index} was blocked by validation`,
          });
          return;
        }
      } catch (error) {
        this.navigationError.emit({
          action: 'goToStep',
          reason: 'rejected',
          target: index,
          message: error instanceof Error ? error.message : 'Unknown error in beforeStepChange',
          cause: error,
        });
        return;
      }
    }

    if (!this.canActivateStep(index)) {
      this.navigationError.emit({
        action: 'goToStep',
        reason: 'prerequisite-incomplete',
        target: index,
        message: `Cannot activate step ${index}. Please complete previous steps first`,
      });
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
      .every(s => s.completed && !s.error);
  }

  isStepValid(index: number): boolean {
    const step = this.steps()[index];
    return step ? !!step.completed && !step.error : false;
  }

  getStepAriaLabel(step: FlowStepConfig, index: number): string {
    const labels = this.effectiveAriaLabels();
    let status: string;
    if (step.error) {
      status = labels.error;
    } else if (step.warning) {
      status = labels.warning;
    } else if (step.completed) {
      status = labels.completed;
    } else if (index === this.activeStep()) {
      status = labels.active;
    } else if (step.disabled) {
      status = labels.disabled;
    } else {
      status = labels.incomplete;
    }
    return `${labels.step} ${index + 1}: ${step.title} - ${status}`;
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
      case 'End': {
        event.preventDefault();
        const lastIndex = this.steps().length - 1;
        if (this.canActivateStep(lastIndex)) {
          this.goToStep(lastIndex);
        }
        break;
      }
    }
  }
}
