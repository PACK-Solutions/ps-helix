import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PshStateFlowIndicatorComponent, STATE_FLOW_INDICATOR_CONFIG } from './state-flow-indicator.component';
import { PshFlowStepComponent } from './flow-step.component';
import { StateFlowIndicatorSize } from './state-flow-indicator.types';

@Component({
  selector: 'psh-test-host',
  imports: [PshStateFlowIndicatorComponent, PshFlowStepComponent],
  template: `
    <psh-state-flow-indicator
      [activeStep]="activeStep"
      [linear]="linear"
      [size]="size"
      [beforeStepChange]="beforeStepChange"
      (stepChange)="onStepChange($event)"
      (completed)="onCompleted()"
      (navigationError)="onNavigationError($event)"
    >
      <psh-flow-step
        [title]="'Step 1'"
        [completed]="step1Completed"
        [disabled]="step1Disabled"
        [error]="step1Error"
        [warning]="step1Warning"
        [loading]="step1Loading"
      />
      <psh-flow-step
        [title]="'Step 2'"
        [completed]="step2Completed"
        [disabled]="step2Disabled"
        [error]="step2Error"
      />
      <psh-flow-step
        [title]="'Step 3'"
        [completed]="step3Completed"
        [disabled]="step3Disabled"
      />
    </psh-state-flow-indicator>
  `
})
class TestHostComponent {
  activeStep = 0;
  linear = true;
  size: StateFlowIndicatorSize = 'medium';
  beforeStepChange?: (from: number, to: number) => Promise<boolean> | boolean;

  step1Completed = false;
  step1Disabled = false;
  step1Error?: string;
  step1Warning?: string;
  step1Loading = false;

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

describe('PshStateFlowIndicatorComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  const getIndicatorHost = () =>
    fixture.nativeElement.querySelector('psh-state-flow-indicator') as HTMLElement;

  const getSegments = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.flow-segment')) as HTMLElement[];

  const getSegment = (index: number) =>
    getSegments()[index] as HTMLElement;

  const getTabs = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="tab"]')) as HTMLElement[];

  const getSegmentTitle = (index: number) => {
    const segment = getSegments()[index];
    return segment?.querySelector('.flow-segment-title')?.textContent?.trim();
  };

  const getIndicator = () =>
    fixture.debugElement.children[0]!.componentInstance as PshStateFlowIndicatorComponent;

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
      expect(getSegmentTitle(0)).toBe('Step 1');
      expect(getSegmentTitle(1)).toBe('Step 2');
      expect(getSegmentTitle(2)).toBe('Step 3');
    });

    it('should render correct number of segments', () => {
      expect(getSegments().length).toBe(3);
    });

    it('should apply first class to first segment', () => {
      expect(getSegment(0).classList.contains('first')).toBe(true);
      expect(getSegment(1).classList.contains('first')).toBe(false);
    });

    it('should apply last class to last segment', () => {
      expect(getSegment(2).classList.contains('last')).toBe(true);
      expect(getSegment(1).classList.contains('last')).toBe(false);
    });
  });

  describe('Size variants', () => {
    it('should apply size-medium class by default', () => {
      expect(getIndicatorHost().classList.contains('size-medium')).toBe(true);
    });

    it('should apply size-small class', () => {
      hostComponent.size = 'small';
      fixture.detectChanges();
      expect(getIndicatorHost().classList.contains('size-small')).toBe(true);
    });

    it('should apply size-large class', () => {
      hostComponent.size = 'large';
      fixture.detectChanges();
      expect(getIndicatorHost().classList.contains('size-large')).toBe(true);
    });
  });

  describe('Step states', () => {
    it('should mark active step with active class', () => {
      expect(getSegment(0).classList.contains('active')).toBe(true);
      expect(getSegment(1).classList.contains('active')).toBe(false);
    });

    it('should mark completed step with completed class', () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();
      expect(getSegment(0).classList.contains('completed')).toBe(true);
    });

    it('should show check icon for completed step', () => {
      hostComponent.step1Completed = true;
      fixture.detectChanges();
      const icon = getSegment(0).querySelector('.ph-check-circle');
      expect(icon).toBeTruthy();
    });

    it('should mark disabled step with disabled class', () => {
      hostComponent.step2Disabled = true;
      fixture.detectChanges();
      expect(getSegment(1).classList.contains('disabled')).toBe(true);
    });

    it('should mark error step with error class', () => {
      hostComponent.step1Error = 'Error occurred';
      fixture.detectChanges();
      expect(getSegment(0).classList.contains('error')).toBe(true);
    });

    it('should show error icon for error step', () => {
      hostComponent.step1Error = 'Error occurred';
      fixture.detectChanges();
      const icon = getSegment(0).querySelector('.ph-x-circle');
      expect(icon).toBeTruthy();
    });

    it('should mark warning step with warning class', () => {
      hostComponent.step1Warning = 'Needs attention';
      fixture.detectChanges();
      expect(getSegment(0).classList.contains('warning')).toBe(true);
    });

    it('should show warning icon for warning step', () => {
      hostComponent.step1Warning = 'Needs attention';
      fixture.detectChanges();
      const icon = getSegment(0).querySelector('.ph-warning');
      expect(icon).toBeTruthy();
    });

    it('should show spinner icon for loading step', () => {
      hostComponent.step1Loading = true;
      fixture.detectChanges();
      const icon = getSegment(0).querySelector('.ph-circle-notch.spinner');
      expect(icon).toBeTruthy();
    });
  });

  describe('Navigation', () => {
    it('should navigate to next step', fakeAsync(() => {
      hostComponent.step1Completed = true;
      hostComponent.linear = false;
      fixture.detectChanges();

      const indicator = getIndicator();
      indicator.next();
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(1);
    }));

    it('should navigate to previous step', fakeAsync(() => {
      hostComponent.activeStep = 1;
      hostComponent.linear = false;
      fixture.detectChanges();

      const indicator = getIndicator();
      indicator.previous();
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(0);
    }));

    it('should not skip steps in linear mode', fakeAsync(() => {
      const indicator = getIndicator();
      indicator.goToStep(2);
      tick();
      fixture.detectChanges();

      expect(hostComponent.navigationErrors.length).toBeGreaterThan(0);
    }));

    it('should allow navigation to any step in non-linear mode', fakeAsync(() => {
      hostComponent.linear = false;
      fixture.detectChanges();

      const indicator = getIndicator();
      indicator.goToStep(2);
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(2);
    }));

    it('should allow clicking on completed step to go back', () => {
      hostComponent.step1Completed = true;
      hostComponent.activeStep = 1;
      hostComponent.linear = false;
      fixture.detectChanges();

      getSegment(0).click();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(0);
    });

    it('should not allow clicking on disabled step', () => {
      hostComponent.step2Disabled = true;
      hostComponent.linear = false;
      fixture.detectChanges();

      getSegment(1).click();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents.length).toBe(0);
    });

    it('should emit navigationError for invalid index', fakeAsync(() => {
      const indicator = getIndicator();
      indicator.goToStep(5);
      tick();
      fixture.detectChanges();

      expect(hostComponent.navigationErrors.length).toBe(1);
    }));

    it('should emit completed when last step is completed and active', fakeAsync(() => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      hostComponent.step3Completed = true;
      hostComponent.linear = false;
      fixture.detectChanges();

      const indicator = getIndicator();
      indicator.goToStep(2);
      tick();
      fixture.detectChanges();

      expect(hostComponent.completedCount).toBe(1);
    }));
  });

  describe('beforeStepChange', () => {
    it('should block navigation when returning false', fakeAsync(() => {
      hostComponent.beforeStepChange = () => false;
      hostComponent.linear = false;
      fixture.detectChanges();

      const indicator = getIndicator();
      indicator.goToStep(1);
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents.length).toBe(0);
      expect(hostComponent.navigationErrors.length).toBe(1);
    }));

    it('should allow navigation when returning true', fakeAsync(() => {
      hostComponent.beforeStepChange = () => true;
      hostComponent.linear = false;
      fixture.detectChanges();

      const indicator = getIndicator();
      indicator.goToStep(1);
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(1);
    }));

    it('should support async validation', fakeAsync(() => {
      hostComponent.beforeStepChange = () => Promise.resolve(true);
      hostComponent.linear = false;
      fixture.detectChanges();

      const indicator = getIndicator();
      indicator.goToStep(1);
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(1);
    }));
  });

  describe('Keyboard navigation', () => {
    it('should handle Enter key', () => {
      hostComponent.linear = false;
      fixture.detectChanges();

      const tab = getTabs()[1];
      tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(1);
    });

    it('should handle Space key', () => {
      hostComponent.linear = false;
      fixture.detectChanges();

      const tab = getTabs()[1];
      tab.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(1);
    });

    it('should handle ArrowRight key', fakeAsync(() => {
      hostComponent.linear = false;
      fixture.detectChanges();

      const tab = getTabs()[0];
      tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(1);
    }));

    it('should handle ArrowLeft key', fakeAsync(() => {
      hostComponent.activeStep = 1;
      hostComponent.linear = false;
      fixture.detectChanges();

      const tab = getTabs()[1];
      tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(0);
    }));

    it('should handle Home key', fakeAsync(() => {
      hostComponent.activeStep = 2;
      hostComponent.linear = false;
      fixture.detectChanges();

      const tab = getTabs()[2];
      tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(0);
    }));

    it('should handle End key', fakeAsync(() => {
      hostComponent.linear = false;
      fixture.detectChanges();

      const tab = getTabs()[0];
      tab.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      tick();
      fixture.detectChanges();

      expect(hostComponent.stepChangeEvents).toContain(2);
    }));
  });

  describe('Accessibility', () => {
    it('should have role="region" on host', () => {
      expect(getIndicatorHost().getAttribute('role')).toBe('region');
    });

    it('should have role="tablist" on track', () => {
      const track = fixture.nativeElement.querySelector('.flow-track');
      expect(track.getAttribute('role')).toBe('tablist');
    });

    it('should have role="tab" on each segment', () => {
      const tabs = getTabs();
      expect(tabs.length).toBe(3);
    });

    it('should set aria-selected on active step', () => {
      expect(getSegment(0).getAttribute('aria-selected')).toBe('true');
      expect(getSegment(1).getAttribute('aria-selected')).toBe('false');
    });

    it('should set aria-current="step" on active step', () => {
      expect(getSegment(0).getAttribute('aria-current')).toBe('step');
      expect(getSegment(1).getAttribute('aria-current')).toBeNull();
    });

    it('should set aria-disabled on disabled steps', () => {
      hostComponent.step2Disabled = true;
      fixture.detectChanges();
      expect(getSegment(1).getAttribute('aria-disabled')).toBe('true');
    });

    it('should set aria-busy on loading step', () => {
      hostComponent.step1Loading = true;
      fixture.detectChanges();
      expect(getSegment(0).getAttribute('aria-busy')).toBe('true');
    });

    it('should have descriptive aria-label on each step', () => {
      const label = getSegment(0).getAttribute('aria-label');
      expect(label).toContain('Step 1');
      expect(label).toContain('active');
    });
  });

  describe('Computed properties', () => {
    it('should compute isFirstStep', () => {
      const indicator = getIndicator();
      expect(indicator.isFirstStep()).toBe(true);
    });

    it('should compute isLastStep', () => {
      const indicator = getIndicator();
      expect(indicator.isLastStep()).toBe(false);
    });

    it('should compute progress', () => {
      const indicator = getIndicator();
      expect(Math.round(indicator.progress())).toBe(33);
    });

    it('should compute completedSteps', () => {
      hostComponent.step1Completed = true;
      hostComponent.step2Completed = true;
      fixture.detectChanges();

      const indicator = getIndicator();
      expect(indicator.completedSteps()).toBe(2);
    });
  });

  describe('Reset', () => {
    it('should reset to step 0', fakeAsync(() => {
      hostComponent.linear = false;
      fixture.detectChanges();

      const indicator = getIndicator();
      indicator.goToStep(2);
      tick();
      fixture.detectChanges();

      indicator.reset();
      fixture.detectChanges();

      expect(indicator.activeStep()).toBe(0);
    }));
  });

  describe('Custom config', () => {
    it('should use injected config', async () => {
      await TestBed.resetTestingModule().configureTestingModule({
        imports: [TestHostComponent],
        providers: [
          {
            provide: STATE_FLOW_INDICATOR_CONFIG,
            useValue: { linear: false }
          }
        ]
      }).compileComponents();

      const customFixture = TestBed.createComponent(TestHostComponent);
      customFixture.detectChanges();

      const indicator = customFixture.debugElement.children[0]!.componentInstance as PshStateFlowIndicatorComponent;
      expect(indicator.linear()).toBe(false);
    });
  });
});
