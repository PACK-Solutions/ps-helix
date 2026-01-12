import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PshStepperComponent, STEPPER_CONFIG } from './stepper.component';
import { PshStepComponent } from './step.component';
import { StepperVariant } from './stepper.types';

@Component({
  selector: 'psh-test-host',
  standalone: true,
  imports: [PshStepperComponent, PshStepComponent],
  template: `
    <psh-stepper
      [activeStep]="activeStep"
      [variant]="variant"
      [linear]="linear"
      [beforeStepChange]="beforeStepChange"
      (stepChange)="onStepChange($event)"
      (completed)="onCompleted()"
      (navigationError)="onNavigationError($event)"
    >
      <psh-step
        [title]="'Step 1'"
        [subtitle]="'First step'"
        [completed]="step1Completed"
        [disabled]="step1Disabled"
        [error]="step1Error"
        [warning]="step1Warning"
        [success]="step1Success"
        [loading]="step1Loading"
        [icon]="step1Icon"
      >
        <p>Step 1 content</p>
      </psh-step>
      <psh-step
        [title]="'Step 2'"
        [subtitle]="'Second step'"
        [completed]="step2Completed"
        [disabled]="step2Disabled"
        [error]="step2Error"
      >
        <p>Step 2 content</p>
      </psh-step>
      <psh-step
        [title]="'Step 3'"
        [completed]="step3Completed"
        [disabled]="step3Disabled"
      >
        <p>Step 3 content</p>
      </psh-step>
    </psh-stepper>
  `
})
class TestHostComponent {
  activeStep = 0;
  variant: StepperVariant = 'default';
  linear = true;
  beforeStepChange?: (from: number, to: number) => Promise<boolean> | boolean;

  step1Completed = false;
  step1Disabled = false;
  step1Error?: string;
  step1Warning?: string;
  step1Success?: string;
  step1Loading = false;
  step1Icon?: string;

  step2Completed = false;
  step2Disabled = false;
  step2Error?: string;

  step3Completed = false;
  step3Disabled = false;

  stepChangeEvents: number[] = [];
  completedCount = 0;
  navigationErrors: string[] = [];

  onStepChange(index: number): void {
    this.stepChangeEvents.push(index);
  }

  onCompleted(): void {
    this.completedCount++;
  }

  onNavigationError(error: string): void {
    this.navigationErrors.push(error);
  }
}

describe('PshStepperComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  const getStepperHost = () =>
    fixture.nativeElement.querySelector('psh-stepper') as HTMLElement;

  const getStepHeaders = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.step-header')) as HTMLElement[];

  const getStepIndicators = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLElement[];

  const getStepIndicator = (index: number) =>
    getStepIndicators()[index] as HTMLElement;

  const getStepTitle = (index: number) => {
    const header = getStepHeaders()[index];
    return header?.querySelector('.step-title')?.textContent?.trim();
  };

  const getStepSubtitle = (index: number) => {
    const header = getStepHeaders()[index];
    return header?.querySelector('.step-subtitle')?.textContent?.trim();
  };

  const getStepErrorMessage = (index: number) => {
    const header = getStepHeaders()[index];
    return header?.querySelector('.step-error') as HTMLElement | null;
  };

  const getStepWarningMessage = (index: number) => {
    const header = getStepHeaders()[index];
    return header?.querySelector('.step-warning') as HTMLElement | null;
  };

  const getStepSuccessMessage = (index: number) => {
    const header = getStepHeaders()[index];
    return header?.querySelector('.step-success') as HTMLElement | null;
  };

  const getStepPanels = () =>
    Array.from(fixture.nativeElement.querySelectorAll('psh-step')) as HTMLElement[];

  const getConnectors = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.step-connector')) as HTMLElement[];

  const getStepper = () =>
    fixture.debugElement.children[0]!.componentInstance as PshStepperComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render all step titles', () => {
      expect(getStepTitle(0)).toBe('Step 1');
      expect(getStepTitle(1)).toBe('Step 2');
      expect(getStepTitle(2)).toBe('Step 3');
    });

    it('should render step subtitles when provided', () => {
      expect(getStepSubtitle(0)).toBe('First step');
      expect(getStepSubtitle(1)).toBe('Second step');
    });

    it('should not render subtitle when not provided', () => {
      const header = getStepHeaders()[2];
      expect(header?.querySelector('.step-subtitle')).toBeFalsy();
    });

    it('should render error message with role="alert"', () => {
      hostComponent.step1Error = 'Validation failed';
      fixture.detectChanges();

      const errorElement = getStepErrorMessage(0);
      expect(errorElement).toBeTruthy();
      expect(errorElement!.textContent).toContain('Validation failed');
      expect(errorElement!.getAttribute('role')).toBe('alert');
    });

    it('should render warning message with role="status"', () => {
      hostComponent.step1Warning = 'Please review';
      fixture.detectChanges();

      const warningElement = getStepWarningMessage(0);
      expect(warningElement).toBeTruthy();
      expect(warningElement!.textContent).toContain('Please review');
      expect(warningElement!.getAttribute('role')).toBe('status');
    });

    it('should render success message with role="status"', () => {
      hostComponent.step1Success = 'Completed successfully';
      fixture.detectChanges();

      const successElement = getStepSuccessMessage(0);
      expect(successElement).toBeTruthy();
      expect(successElement!.textContent).toContain('Completed successfully');
      expect(successElement!.getAttribute('role')).toBe('status');
    });

    it('should render connectors between steps but not after last step', () => {
      const connectors = getConnectors();
      expect(connectors.length).toBe(2);
    });

    it('should render step content panels', () => {
      const panels = getStepPanels();
      expect(panels.length).toBe(3);
    });

    it('should display only active step content', () => {
      const panels = getStepPanels();
      expect(panels[0]!.style.display).not.toBe('none');
      expect(panels[1]!.style.display).toBe('none');
      expect(panels[2]!.style.display).toBe('none');
    });
  });

  describe('Variants', () => {
    it.each<[StepperVariant, boolean, boolean]>([
      ['default', false, false],
      ['numbered', true, false],
      ['progress', false, true]
    ])('variant "%s" should apply correct host classes', (variant, hasNumbered, hasProgress) => {
      hostComponent.variant = variant;
      fixture.detectChanges();

      const host = getStepperHost();
      expect(host.classList.contains('numbered')).toBe(hasNumbered);
      expect(host.classList.contains('progress')).toBe(hasProgress);
    });

    it('should display step numbers in numbered variant', () => {
      hostComponent.variant = 'numbered';
      fixture.detectChanges();

      const indicator = getStepIndicator(0);
      expect(indicator.textContent?.trim()).toContain('1');
    });

    it('should display checkmark icon when step is completed', () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();

      const indicator = getStepIndicator(0);
      const checkIcon = indicator.querySelector('[class*="ph-check"]');
      expect(checkIcon).toBeTruthy();
    });

    it('should display custom icon when provided in default variant', () => {
      hostComponent.step1Icon = 'user';
      fixture.detectChanges();

      const indicator = getStepIndicator(0);
      const icon = indicator.querySelector('[class*="ph-user"]');
      expect(icon).toBeTruthy();
    });

    it('should display dot when no icon in default variant', () => {
      const indicator = getStepIndicator(0);
      const dot = indicator.querySelector('.step-dot');
      expect(dot).toBeTruthy();
    });
  });

  describe('Step states', () => {
    it('should apply active class to current step header', () => {
      const headers = getStepHeaders();
      expect(headers[0]!.classList.contains('active')).toBe(true);
      expect(headers[1]!.classList.contains('active')).toBe(false);
    });

    it('should apply completed class when step is completed', () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();

      const header = getStepHeaders()[0];
      expect(header!.classList.contains('completed')).toBe(true);
    });

    it('should apply disabled class when step is disabled', () => {
      hostComponent.step2Disabled = true;
      fixture.detectChanges();

      const header = getStepHeaders()[1];
      expect(header!.classList.contains('disabled')).toBe(true);
    });

    it('should apply error class when step has error', () => {
      hostComponent.step1Error = 'Error message';
      fixture.detectChanges();

      const header = getStepHeaders()[0];
      expect(header!.classList.contains('error')).toBe(true);
    });

    it('should apply warning class when step has warning', () => {
      hostComponent.step1Warning = 'Warning message';
      fixture.detectChanges();

      const header = getStepHeaders()[0];
      expect(header!.classList.contains('warning')).toBe(true);
    });

    it('should apply success class when step has success message', () => {
      hostComponent.step1Success = 'Success message';
      fixture.detectChanges();

      const header = getStepHeaders()[0];
      expect(header!.classList.contains('success')).toBe(true);
    });
  });

  describe('Navigation behavior', () => {
    it('should navigate to next step when next() is called', async () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();

      await getStepper().next();
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(1);
    });

    it('should not navigate past last step', async () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      hostComponent.activeStep = 2;
      fixture.detectChanges();

      await getStepper().next();
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(2);
    });

    it('should navigate to previous step when previous() is called', async () => {
      hostComponent.step1Completed = true;
      hostComponent.activeStep = 1;
      fixture.detectChanges();

      await getStepper().previous();
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(0);
    });

    it('should not navigate before first step', async () => {
      await getStepper().previous();
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(0);
    });

    it('should navigate to specific step with goToStep()', async () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      fixture.detectChanges();

      await getStepper().goToStep(2);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(2);
    });

    it('should emit navigationError for invalid step index', async () => {
      await getStepper().goToStep(10);
      fixture.detectChanges();

      expect(hostComponent.navigationErrors.length).toBe(1);
      expect(hostComponent.navigationErrors[0]).toContain('Invalid step index');
    });

    it('should not emit event when navigating to current step', async () => {
      const initialEvents = hostComponent.stepChangeEvents.length;

      await getStepper().goToStep(0);
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents.length).toBe(initialEvents);
    });

    it('should navigate when clicking step indicator', () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();

      getStepIndicator(1).click();
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(1);
    });

    it('should not navigate when clicking disabled step', () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Disabled = true;
      fixture.detectChanges();

      getStepIndicator(1).click();
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(0);
    });
  });

  describe('Linear navigation constraints', () => {
    it('should allow first step to be accessible', () => {
      expect(getStepper().canActivateStep(0)).toBe(true);
    });

    it('should block navigation to step when previous is not completed', () => {
      expect(getStepper().canActivateStep(1)).toBe(false);
    });

    it('should allow navigation when previous step is completed', () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();

      expect(getStepper().canActivateStep(1)).toBe(true);
    });

    it('should block navigation when previous step has error', () => {
      hostComponent.step1Completed = true;
      hostComponent.step1Error = 'Error';
      fixture.detectChanges();

      expect(getStepper().canActivateStep(1)).toBe(false);
    });

    it('should allow any step in non-linear mode', () => {
      hostComponent.linear = false;
      fixture.detectChanges();

      expect(getStepper().canActivateStep(2)).toBe(true);
    });

    it('should return correct canGoNext value', () => {
      expect(getStepper().canGoNext()).toBe(false);

      hostComponent.step1Completed = true;
      fixture.detectChanges();

      expect(getStepper().canGoNext()).toBe(true);
    });

    it('should return correct canGoPrevious value', () => {
      expect(getStepper().canGoPrevious()).toBe(false);

      hostComponent.step1Completed = true;
      hostComponent.activeStep = 1;
      fixture.detectChanges();

      expect(getStepper().canGoPrevious()).toBe(true);
    });
  });

  describe('beforeStepChange callback', () => {
    it('should proceed when callback returns true', async () => {
      hostComponent.step1Completed = true;
      hostComponent.beforeStepChange = () => true;
      fixture.detectChanges();

      await getStepper().goToStep(1);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(1);
    });

    it('should block when callback returns false', async () => {
      hostComponent.step1Completed = true;
      hostComponent.beforeStepChange = () => false;
      fixture.detectChanges();

      await getStepper().goToStep(1);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(0);
      expect(hostComponent.navigationErrors.length).toBe(1);
    });

    it('should proceed when callback returns Promise resolving to true', async () => {
      hostComponent.step1Completed = true;
      hostComponent.beforeStepChange = () => Promise.resolve(true);
      fixture.detectChanges();

      await getStepper().goToStep(1);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(1);
    });

    it('should block when callback returns Promise resolving to false', async () => {
      hostComponent.step1Completed = true;
      hostComponent.beforeStepChange = () => Promise.resolve(false);
      fixture.detectChanges();

      await getStepper().goToStep(1);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(0);
    });

    it('should emit navigationError when callback throws', async () => {
      hostComponent.step1Completed = true;
      hostComponent.beforeStepChange = () => {
        throw new Error('Validation error');
      };
      fixture.detectChanges();

      await getStepper().goToStep(1);
      fixture.detectChanges();

      expect(hostComponent.navigationErrors.length).toBe(1);
      expect(hostComponent.navigationErrors[0]).toContain('Validation error');
    });
  });

  describe('Output events', () => {
    it('should emit stepChange with correct index on navigation', async () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();

      await getStepper().goToStep(1);
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(1);
    });

    it('should not emit stepChange when navigation is blocked', async () => {
      const initialCount = hostComponent.stepChangeEvents.length;

      await getStepper().goToStep(1);
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents.length).toBe(initialCount);
    });

    it('should emit completed when reaching last step with completed state', async () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      hostComponent.step3Completed = true;
      fixture.detectChanges();

      await getStepper().goToStep(2);
      fixture.detectChanges();

      expect(hostComponent.completedCount).toBe(1);
    });

    it('should not emit completed when last step is not completed', async () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      hostComponent.step3Completed = false;
      fixture.detectChanges();

      await getStepper().goToStep(2);
      fixture.detectChanges();

      expect(hostComponent.completedCount).toBe(0);
    });
  });

  describe('Keyboard navigation', () => {
    const createKeyboardEvent = (key: string) => {
      const event = new KeyboardEvent('keydown', { key, bubbles: true });
      jest.spyOn(event, 'preventDefault');
      return event;
    };

    it('should activate step on Enter key', () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();

      const event = createKeyboardEvent('Enter');
      getStepIndicator(1).dispatchEvent(event);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should activate step on Space key', () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();

      const event = createKeyboardEvent(' ');
      getStepIndicator(1).dispatchEvent(event);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to next step on ArrowRight', () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();

      const event = createKeyboardEvent('ArrowRight');
      getStepIndicator(0).dispatchEvent(event);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(1);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to previous step on ArrowLeft', () => {
      hostComponent.step1Completed = true;
      hostComponent.activeStep = 1;
      fixture.detectChanges();

      const event = createKeyboardEvent('ArrowLeft');
      getStepIndicator(1).dispatchEvent(event);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(0);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to first step on Home key', () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      hostComponent.activeStep = 2;
      fixture.detectChanges();

      const event = createKeyboardEvent('Home');
      getStepIndicator(2).dispatchEvent(event);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(0);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should navigate to last step on End key', () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      fixture.detectChanges();

      const event = createKeyboardEvent('End');
      getStepIndicator(0).dispatchEvent(event);
      fixture.detectChanges();

      expect(getStepper().activeStep()).toBe(2);
      expect(event.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have role="region" on host', () => {
      expect(getStepperHost().getAttribute('role')).toBe('region');
    });

    it('should have aria-label on host', () => {
      expect(getStepperHost().getAttribute('aria-label')).toBe('Stepper navigation');
    });

    it('should have role="tablist" on header container', () => {
      const header = fixture.nativeElement.querySelector('.stepper-header');
      expect(header.getAttribute('role')).toBe('tablist');
    });

    it('should have role="tab" on each step indicator', () => {
      getStepIndicators().forEach(indicator => {
        expect(indicator.getAttribute('role')).toBe('tab');
      });
    });

    it('should have aria-selected="true" on active step', () => {
      expect(getStepIndicator(0).getAttribute('aria-selected')).toBe('true');
    });

    it('should have aria-selected="false" on inactive steps', () => {
      expect(getStepIndicator(1).getAttribute('aria-selected')).toBe('false');
      expect(getStepIndicator(2).getAttribute('aria-selected')).toBe('false');
    });

    it('should have aria-current="step" on active step', () => {
      expect(getStepIndicator(0).getAttribute('aria-current')).toBe('step');
    });

    it('should not have aria-current on inactive steps', () => {
      expect(getStepIndicator(1).getAttribute('aria-current')).toBeNull();
    });

    it('should have aria-disabled="true" on disabled step', () => {
      hostComponent.step2Disabled = true;
      fixture.detectChanges();

      expect(getStepIndicator(1).getAttribute('aria-disabled')).toBe('true');
    });

    it('should have aria-busy="true" on loading step', () => {
      hostComponent.step1Loading = true;
      fixture.detectChanges();

      expect(getStepIndicator(0).getAttribute('aria-busy')).toBe('true');
    });

    it('should have aria-describedby pointing to error message', () => {
      hostComponent.step1Error = 'Error';
      fixture.detectChanges();

      expect(getStepIndicator(0).getAttribute('aria-describedby')).toBe('error-0');
      expect(getStepErrorMessage(0)?.getAttribute('id')).toBe('error-0');
    });

    it('should have aria-live="polite" on status messages', () => {
      hostComponent.step1Error = 'Error';
      hostComponent.step1Warning = 'Warning';
      fixture.detectChanges();

      expect(getStepErrorMessage(0)?.getAttribute('aria-live')).toBe('polite');
    });

    it('should have role="tabpanel" on step content', () => {
      const panels = getStepPanels();
      panels.forEach(panel => {
        expect(panel.getAttribute('role')).toBe('tabpanel');
      });
    });

    it('should have correct tabindex on active panel', () => {
      const panels = getStepPanels();
      expect(panels[0]!.getAttribute('tabindex')).toBe('0');
      expect(panels[1]!.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Computed properties', () => {
    it('should return true for isFirstStep when on first step', () => {
      expect(getStepper().isFirstStep()).toBe(true);
    });

    it('should return false for isFirstStep when not on first step', () => {
      hostComponent.step1Completed = true;
      hostComponent.activeStep = 1;
      fixture.detectChanges();

      expect(getStepper().isFirstStep()).toBe(false);
    });

    it('should return true for isLastStep when on last step', () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      hostComponent.activeStep = 2;
      fixture.detectChanges();

      expect(getStepper().isLastStep()).toBe(true);
    });

    it('should return false for isLastStep when not on last step', () => {
      expect(getStepper().isLastStep()).toBe(false);
    });

    it('should calculate progress correctly', () => {
      expect(getStepper().progress()).toBeCloseTo(33.33, 1);

      hostComponent.step1Completed = true;
      hostComponent.activeStep = 1;
      fixture.detectChanges();

      expect(getStepper().progress()).toBeCloseTo(66.67, 1);
    });

    it('should count completedSteps correctly', () => {
      expect(getStepper().completedSteps()).toBe(0);

      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      fixture.detectChanges();

      expect(getStepper().completedSteps()).toBe(2);
    });
  });

  describe('Edge cases', () => {
    it('should handle programmatic activeStep change', () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      hostComponent.activeStep = 2;
      fixture.detectChanges();

      const headers = getStepHeaders();
      expect(headers[2]!.classList.contains('active')).toBe(true);
      expect(headers[0]!.classList.contains('active')).toBe(false);
    });

    it('should handle step state changes after initialization', () => {
      expect(getStepHeaders()[0]!.classList.contains('completed')).toBe(false);

      hostComponent.step1Completed = true;
      fixture.detectChanges();

      expect(getStepHeaders()[0]!.classList.contains('completed')).toBe(true);
    });

    it('should validate step correctly', () => {
      expect(getStepper().isStepValid(0)).toBe(false);

      hostComponent.step1Completed = true;
      fixture.detectChanges();

      expect(getStepper().isStepValid(0)).toBe(true);
    });

    it('should return false for isStepValid when step has error', () => {
      hostComponent.step1Completed = true;
      hostComponent.step1Error = 'Error';
      fixture.detectChanges();

      expect(getStepper().isStepValid(0)).toBe(false);
    });
  });
});

@Component({
  selector: 'psh-config-test-host',
  standalone: true,
  imports: [PshStepperComponent, PshStepComponent],
  template: `
    <psh-stepper>
      <psh-step [title]="'Step 1'" [completed]="true">
        <p>Step 1 content</p>
      </psh-step>
      <psh-step [title]="'Step 2'">
        <p>Step 2 content</p>
      </psh-step>
    </psh-stepper>
  `
})
class ConfigTestHostComponent {}

describe('PshStepperComponent with custom config', () => {
  let fixture: ComponentFixture<ConfigTestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfigTestHostComponent],
      providers: [
        {
          provide: STEPPER_CONFIG,
          useValue: {
            variant: 'numbered',
            linear: false,
            ariaLabels: {
              step: 'Stage',
              completed: 'Stage completed',
              active: 'Current stage',
              incomplete: 'Pending stage',
              disabled: 'Stage disabled'
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfigTestHostComponent);
    fixture.detectChanges();
  });

  const getStepper = () =>
    fixture.debugElement.children[0]!.componentInstance as PshStepperComponent;

  const getStepperHost = () =>
    fixture.nativeElement.querySelector('psh-stepper') as HTMLElement;

  it('should use variant from injected config', () => {
    expect(getStepper().variant()).toBe('numbered');
    expect(getStepperHost().classList.contains('numbered')).toBe(true);
  });

  it('should use linear setting from injected config', () => {
    expect(getStepper().linear()).toBe(false);
  });

  it('should use custom ariaLabels from injected config', () => {
    expect(getStepper().effectiveAriaLabels().step).toBe('Stage');
  });
});

describe('PshStepperComponent input overrides config', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [
        {
          provide: STEPPER_CONFIG,
          useValue: {
            variant: 'numbered',
            linear: false
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  const getStepper = () =>
    fixture.debugElement.children[0]!.componentInstance as PshStepperComponent;

  it('should allow input values to override config', () => {
    expect(getStepper().variant()).toBe('default');
    expect(getStepper().linear()).toBe(true);
  });
});

@Component({
  selector: 'psh-test-host',
  standalone: true,
  imports: [PshStepperComponent, PshStepComponent],
  template: `
    <psh-stepper [activeStep]="activeStep" [variant]="variant">
      <psh-step [title]="'Only Step'" [completed]="completed">
        <p>Single step content</p>
      </psh-step>
    </psh-stepper>
  `
})
class SingleStepHostComponent {
  activeStep = 0;
  variant: StepperVariant = 'default';
  completed = false;
}

describe('PshStepperComponent with single step', () => {
  let fixture: ComponentFixture<SingleStepHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleStepHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SingleStepHostComponent);
    fixture.detectChanges();
  });

  const getStepper = () =>
    fixture.debugElement.children[0]!.componentInstance as PshStepperComponent;

  const getConnectors = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.step-connector')) as HTMLElement[];

  it('should handle single step correctly', () => {
    expect(getStepper().steps().length).toBe(1);
    expect(getStepper().isFirstStep()).toBe(true);
    expect(getStepper().isLastStep()).toBe(true);
  });

  it('should not render connectors for single step', () => {
    expect(getConnectors().length).toBe(0);
  });

  it('should calculate 100% progress for single step', () => {
    expect(getStepper().progress()).toBe(100);
  });
});
