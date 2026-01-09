import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshProgressbarComponent } from './progressbar.component';
import { ProgressbarVariant, ProgressbarSize, ProgressbarMode, ProgressbarLabelPosition } from './progressbar.types';

describe('PshProgressbarComponent', () => {
  let fixture: ComponentFixture<PshProgressbarComponent>;

  const getProgressbar = () =>
    fixture.nativeElement.querySelector('[role="progressbar"]') as HTMLElement;

  const getLabel = () =>
    fixture.nativeElement.querySelector('.progress-label') as HTMLElement;

  const getProgressTrack = () =>
    fixture.nativeElement.querySelector('.progress-track') as HTMLElement;

  const getHostElement = () =>
    fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshProgressbarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshProgressbarComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should display default percentage label (0%)', () => {
      expect(getLabel().textContent).toContain('0%');
    });

    it('should display correct percentage based on value', () => {
      fixture.componentRef.setInput('value', 50);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(getLabel().textContent).toContain('50%');
    });

    it('should display custom label when provided', () => {
      fixture.componentRef.setInput('label', 'Uploading files...');
      fixture.detectChanges();

      expect(getLabel().textContent).toContain('Uploading files...');
    });

    it('should display "Loading..." for indeterminate mode', () => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('showLabel', true);
      fixture.detectChanges();

      const progressbar = getProgressbar();
      expect(progressbar.getAttribute('aria-valuetext')).toBe('Loading...');
    });

    it('should display custom label in indeterminate mode when provided', () => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('label', 'Processing...');
      fixture.detectChanges();

      const progressbar = getProgressbar();
      expect(progressbar.getAttribute('aria-valuetext')).toBe('Processing...');
    });

    it('should hide label when showLabel is false', () => {
      fixture.componentRef.setInput('showLabel', false);
      fixture.detectChanges();

      expect(getLabel()).toBeFalsy();
    });

    it('should show visible label in indeterminate mode', () => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('showLabel', true);
      fixture.detectChanges();

      const label = getLabel();
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Loading...');
    });

    it('should show custom label in indeterminate mode', () => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('label', 'Please wait...');
      fixture.componentRef.setInput('showLabel', true);
      fixture.detectChanges();

      const label = getLabel();
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Please wait...');
    });
  });

  describe('Percentage calculation', () => {
    it('should calculate correct percentage', () => {
      fixture.componentRef.setInput('value', 25);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      const track = getProgressTrack();
      expect(track.style.width).toBe('25%');
    });

    it('should handle custom max value', () => {
      fixture.componentRef.setInput('value', 5);
      fixture.componentRef.setInput('max', 10);
      fixture.detectChanges();

      const track = getProgressTrack();
      expect(track.style.width).toBe('50%');
    });

    it('should clamp percentage to 100 when value exceeds max', () => {
      fixture.componentRef.setInput('value', 150);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      const track = getProgressTrack();
      expect(track.style.width).toBe('100%');
    });

    it('should return 0 when max is 0', () => {
      fixture.componentRef.setInput('value', 50);
      fixture.componentRef.setInput('max', 0);
      fixture.detectChanges();

      const track = getProgressTrack();
      expect(track.style.width).toBe('0%');
    });

    it('should clamp negative values to 0', () => {
      fixture.componentRef.setInput('value', -10);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      const track = getProgressTrack();
      expect(track.style.width).toBe('0%');
    });
  });

  describe('Variants', () => {
    it.each<[ProgressbarVariant]>([
      ['primary'],
      ['secondary'],
      ['success'],
      ['warning'],
      ['danger']
    ])('should apply variant class "%s" to progress track', (variant) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      const track = getProgressTrack();
      expect(track.classList.contains(variant)).toBe(true);
    });
  });

  describe('Sizes', () => {
    it.each<[ProgressbarSize, boolean]>([
      ['small', true],
      ['medium', false],
      ['large', true]
    ])('size "%s" should apply correct host class', (size, hasClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      const host = getHostElement();
      if (size === 'medium') {
        expect(host.classList.contains('small')).toBe(false);
        expect(host.classList.contains('large')).toBe(false);
      } else {
        expect(host.classList.contains(size)).toBe(hasClass);
      }
    });
  });

  describe('Modes', () => {
    it.each<[ProgressbarMode]>([
      ['default'],
      ['striped'],
      ['animated'],
      ['indeterminate']
    ])('should set data-state="%s" for mode "%s"', (mode) => {
      fixture.componentRef.setInput('mode', mode);
      fixture.detectChanges();

      expect(getHostElement().getAttribute('data-state')).toBe(mode);
    });

    it('should apply striped class for striped mode', () => {
      fixture.componentRef.setInput('mode', 'striped');
      fixture.detectChanges();

      const progressbar = getProgressbar();
      expect(progressbar.classList.contains('striped')).toBe(true);
    });

    it('should apply striped and animated classes for animated mode', () => {
      fixture.componentRef.setInput('mode', 'animated');
      fixture.detectChanges();

      const progressbar = getProgressbar();
      expect(progressbar.classList.contains('striped')).toBe(true);
      expect(progressbar.classList.contains('animated')).toBe(true);
    });

    it('should apply indeterminate class for indeterminate mode', () => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.detectChanges();

      const progressbar = getProgressbar();
      expect(progressbar.classList.contains('indeterminate')).toBe(true);
    });

    it('should use percentage width for indeterminate mode (CSS handles animation)', () => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('value', 50);
      fixture.detectChanges();

      const track = getProgressTrack();
      expect(track.style.width).toBe('50%');
    });
  });

  describe('Label positions', () => {
    it.each<[ProgressbarLabelPosition, string | null]>([
      ['top', null],
      ['bottom', 'label-bottom'],
      ['inline', 'label-inline']
    ])('position "%s" should apply class "%s"', (position, expectedClass) => {
      fixture.componentRef.setInput('labelPosition', position);
      fixture.detectChanges();

      const host = getHostElement();
      if (expectedClass) {
        expect(host.classList.contains(expectedClass)).toBe(true);
      } else {
        expect(host.classList.contains('label-bottom')).toBe(false);
        expect(host.classList.contains('label-inline')).toBe(false);
      }
    });
  });

  describe('Accessibility', () => {
    it('should have role="progressbar"', () => {
      expect(getProgressbar()).toBeTruthy();
    });

    it('should have aria-live="polite" on host element', () => {
      expect(getHostElement().getAttribute('aria-live')).toBe('polite');
    });

    it('should have aria-valuemin="0"', () => {
      expect(getProgressbar().getAttribute('aria-valuemin')).toBe('0');
    });

    it('should have correct aria-valuemax', () => {
      fixture.componentRef.setInput('max', 200);
      fixture.detectChanges();

      expect(getProgressbar().getAttribute('aria-valuemax')).toBe('200');
    });

    it('should have correct aria-valuenow', () => {
      fixture.componentRef.setInput('value', 75);
      fixture.detectChanges();

      expect(getProgressbar().getAttribute('aria-valuenow')).toBe('75');
    });

    it('should have correct aria-valuetext with percentage', () => {
      fixture.componentRef.setInput('value', 33);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(getProgressbar().getAttribute('aria-valuetext')).toBe('33%');
    });

    it('should support custom ariaLabel', () => {
      fixture.componentRef.setInput('ariaLabel', 'File upload progress');
      fixture.detectChanges();

      expect(getProgressbar().getAttribute('aria-valuetext')).toBe('File upload progress');
    });

    it('should omit aria-valuenow for indeterminate mode', () => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.detectChanges();

      expect(getProgressbar().getAttribute('aria-valuenow')).toBeNull();
    });

    it('should have aria-valuetext "Loading..." for indeterminate mode', () => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.detectChanges();

      expect(getProgressbar().getAttribute('aria-valuetext')).toBe('Loading...');
    });
  });

  describe('Output events', () => {
    it('should emit completed event when value reaches max', () => {
      const completedSpy = jest.fn();
      fixture.componentInstance.completed.subscribe(completedSpy);

      fixture.componentRef.setInput('value', 100);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(completedSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit thresholdReached at 25%', () => {
      const thresholdSpy = jest.fn();
      fixture.componentInstance.thresholdReached.subscribe(thresholdSpy);

      fixture.componentRef.setInput('value', 25);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(thresholdSpy).toHaveBeenCalledWith(25);
    });

    it('should emit thresholdReached at 50%', () => {
      const thresholdSpy = jest.fn();
      fixture.componentInstance.thresholdReached.subscribe(thresholdSpy);

      fixture.componentRef.setInput('value', 50);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(thresholdSpy).toHaveBeenCalledWith(25);
      expect(thresholdSpy).toHaveBeenCalledWith(50);
    });

    it('should emit thresholdReached at 75%', () => {
      const thresholdSpy = jest.fn();
      fixture.componentInstance.thresholdReached.subscribe(thresholdSpy);

      fixture.componentRef.setInput('value', 75);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      expect(thresholdSpy).toHaveBeenCalledWith(25);
      expect(thresholdSpy).toHaveBeenCalledWith(50);
      expect(thresholdSpy).toHaveBeenCalledWith(75);
    });

    it('should not emit duplicate threshold events', () => {
      const thresholdSpy = jest.fn();
      fixture.componentInstance.thresholdReached.subscribe(thresholdSpy);

      fixture.componentRef.setInput('value', 30);
      fixture.detectChanges();

      fixture.componentRef.setInput('value', 35);
      fixture.detectChanges();

      const calls25 = thresholdSpy.mock.calls.filter((call: number[]) => call[0] === 25);
      expect(calls25.length).toBe(1);
    });

    it('should not emit duplicate completed events when value stays at max', () => {
      const completedSpy = jest.fn();
      fixture.componentInstance.completed.subscribe(completedSpy);

      fixture.componentRef.setInput('value', 100);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();

      fixture.componentRef.setInput('value', 100);
      fixture.detectChanges();

      fixture.componentRef.setInput('value', 100);
      fixture.detectChanges();

      expect(completedSpy).toHaveBeenCalledTimes(1);
    });

    it('should re-emit completed event after value drops and reaches max again', () => {
      const completedSpy = jest.fn();
      fixture.componentInstance.completed.subscribe(completedSpy);

      fixture.componentRef.setInput('value', 100);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();
      expect(completedSpy).toHaveBeenCalledTimes(1);

      fixture.componentRef.setInput('value', 50);
      fixture.detectChanges();

      fixture.componentRef.setInput('value', 100);
      fixture.detectChanges();
      expect(completedSpy).toHaveBeenCalledTimes(2);
    });

    it('should re-emit threshold events after value drops below 25%', () => {
      const thresholdSpy = jest.fn();
      fixture.componentInstance.thresholdReached.subscribe(thresholdSpy);

      fixture.componentRef.setInput('value', 30);
      fixture.detectChanges();
      expect(thresholdSpy).toHaveBeenCalledWith(25);

      fixture.componentRef.setInput('value', 10);
      fixture.detectChanges();

      thresholdSpy.mockClear();

      fixture.componentRef.setInput('value', 30);
      fixture.detectChanges();
      expect(thresholdSpy).toHaveBeenCalledWith(25);
    });
  });

  describe('data-state attribute', () => {
    it('should default to "default" mode', () => {
      expect(getHostElement().getAttribute('data-state')).toBe('default');
    });

    it.each<[ProgressbarMode]>([
      ['default'],
      ['striped'],
      ['animated'],
      ['indeterminate']
    ])('should reflect mode "%s" in data-state', (mode) => {
      fixture.componentRef.setInput('mode', mode);
      fixture.detectChanges();

      expect(getHostElement().getAttribute('data-state')).toBe(mode);
    });
  });
});
