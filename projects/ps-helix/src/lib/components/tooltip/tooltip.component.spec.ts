import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PshTooltipComponent, TOOLTIP_CONFIG } from './tooltip.component';
import { TooltipPosition, TooltipVariant } from './tooltip.types';

describe('PshTooltipComponent', () => {
  let fixture: ComponentFixture<PshTooltipComponent>;

  const getTooltip = () =>
    fixture.nativeElement.querySelector('[role="tooltip"]') as HTMLElement | null;

  const getTriggerWrapper = () =>
    fixture.nativeElement.querySelector('.tooltip-wrapper') as HTMLElement;

  const showTooltip = () => {
    fixture.componentInstance.show();
    tick(0);
    fixture.detectChanges();
  };

  const hideTooltip = () => {
    fixture.componentInstance.hide();
    tick(0);
    fixture.detectChanges();
  };

  const hideTooltipImmediate = () => {
    fixture.componentInstance.hideImmediate();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshTooltipComponent],
      providers: [
        {
          provide: TOOLTIP_CONFIG,
          useValue: {
            variant: 'dark',
            position: 'top',
            showDelay: 0,
            hideDelay: 0,
            maxWidth: 200,
            autoFlip: false
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PshTooltipComponent);
    fixture.componentRef.setInput('content', 'Test tooltip content');
    fixture.detectChanges();
  });

  describe('Initial state', () => {
    it('should not display tooltip by default', () => {
      expect(getTooltip()).toBeFalsy();
    });

    it('should render trigger wrapper', () => {
      expect(getTriggerWrapper()).toBeTruthy();
    });
  });

  describe('Content rendering', () => {
    it('should display provided content when visible', fakeAsync(() => {
      showTooltip();

      const tooltip = getTooltip();
      expect(tooltip).toBeTruthy();
      expect(tooltip?.textContent).toContain('Test tooltip content');
    }));

    it('should apply maxWidth style when visible', fakeAsync(() => {
      fixture.componentRef.setInput('maxWidth', 300);
      fixture.detectChanges();

      showTooltip();

      const tooltip = getTooltip();
      expect(tooltip?.style.maxWidth).toBe('300px');
    }));
  });

  describe('Visibility behavior', () => {
    it('should show tooltip when show is called', fakeAsync(() => {
      showTooltip();
      expect(getTooltip()).toBeTruthy();
    }));

    it('should hide tooltip when hide is called', fakeAsync(() => {
      showTooltip();
      expect(getTooltip()).toBeTruthy();

      hideTooltip();
      expect(getTooltip()).toBeFalsy();
    }));

    it('should immediately hide tooltip when hideImmediate is called', fakeAsync(() => {
      showTooltip();
      expect(getTooltip()).toBeTruthy();

      hideTooltipImmediate();
      expect(getTooltip()).toBeFalsy();
    }));

    it('should respect showDelay timing', fakeAsync(() => {
      fixture.componentRef.setInput('showDelay', 100);
      fixture.detectChanges();

      fixture.componentInstance.show();
      tick(50);
      fixture.detectChanges();
      expect(getTooltip()).toBeFalsy();

      tick(50);
      fixture.detectChanges();
      expect(getTooltip()).toBeTruthy();
    }));

    it('should respect hideDelay timing', fakeAsync(() => {
      fixture.componentRef.setInput('hideDelay', 100);
      fixture.detectChanges();

      showTooltip();
      expect(getTooltip()).toBeTruthy();

      fixture.componentInstance.hide();
      tick(50);
      fixture.detectChanges();
      expect(getTooltip()).toBeTruthy();

      tick(50);
      fixture.detectChanges();
      expect(getTooltip()).toBeFalsy();
    }));

    it('should cancel pending show when hide is called', fakeAsync(() => {
      fixture.componentRef.setInput('showDelay', 100);
      fixture.detectChanges();

      fixture.componentInstance.show();
      tick(50);
      fixture.detectChanges();

      fixture.componentInstance.hide();
      tick(100);
      fixture.detectChanges();

      expect(getTooltip()).toBeFalsy();
    }));

    it('should cancel pending hide when show is called', fakeAsync(() => {
      fixture.componentRef.setInput('hideDelay', 100);
      fixture.detectChanges();

      showTooltip();
      fixture.componentInstance.hide();
      tick(50);
      fixture.detectChanges();

      fixture.componentInstance.show();
      tick(0);
      fixture.detectChanges();

      expect(getTooltip()).toBeTruthy();

      tick(100);
      fixture.detectChanges();
      expect(getTooltip()).toBeTruthy();
    }));
  });

  describe('Disabled state', () => {
    it('should not show tooltip when disabled', fakeAsync(() => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      fixture.componentInstance.show();
      tick(0);
      fixture.detectChanges();

      expect(getTooltip()).toBeFalsy();
    }));

    it('should not emit shown event when disabled', fakeAsync(() => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const shownSpy = jest.fn();
      fixture.componentInstance.shown.subscribe(shownSpy);

      fixture.componentInstance.show();
      tick(0);
      fixture.detectChanges();

      expect(shownSpy).not.toHaveBeenCalled();
    }));
  });

  describe('Accessibility', () => {
    it('should have role="tooltip" on tooltip element', fakeAsync(() => {
      showTooltip();
      expect(getTooltip()?.getAttribute('role')).toBe('tooltip');
    }));

    it('should set aria-describedby on trigger when visible', fakeAsync(() => {
      showTooltip();

      const wrapper = getTriggerWrapper();
      const tooltip = getTooltip();
      const tooltipId = tooltip?.getAttribute('id');

      expect(wrapper.getAttribute('aria-describedby')).toBe(tooltipId);
    }));

    it('should not have aria-describedby when tooltip is hidden', () => {
      const wrapper = getTriggerWrapper();
      expect(wrapper.getAttribute('aria-describedby')).toBeFalsy();
    });

    it('should generate unique IDs for tooltip and trigger', fakeAsync(() => {
      showTooltip();

      const wrapper = getTriggerWrapper();
      const tooltip = getTooltip();

      expect(wrapper.getAttribute('id')).toBeTruthy();
      expect(tooltip?.getAttribute('id')).toBeTruthy();
      expect(wrapper.getAttribute('id')).not.toBe(tooltip?.getAttribute('id'));
    }));

    it('should use custom ID when provided', fakeAsync(() => {
      fixture.componentRef.setInput('id', 'custom-tooltip');
      fixture.detectChanges();

      showTooltip();

      const wrapper = getTriggerWrapper();
      const tooltip = getTooltip();

      expect(wrapper.getAttribute('id')).toBe('custom-tooltip-trigger');
      expect(tooltip?.getAttribute('id')).toBe('custom-tooltip-tooltip');
    }));
  });

  describe('Variants', () => {
    it.each<[TooltipVariant]>([['light'], ['dark']])(
      'should apply "%s" variant class when visible',
      fakeAsync((variant: TooltipVariant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        showTooltip();

        const tooltip = getTooltip();
        expect(tooltip?.classList.contains(variant)).toBe(true);
      })
    );
  });

  describe('Positions', () => {
    it.each<[TooltipPosition]>([['top'], ['right'], ['bottom'], ['left']])(
      'should apply "%s" position class when visible',
      fakeAsync((position: TooltipPosition) => {
        fixture.componentRef.setInput('position', position);
        fixture.detectChanges();

        showTooltip();

        const tooltip = getTooltip();
        expect(tooltip?.classList.contains(position)).toBe(true);
      })
    );
  });

  describe('Output events', () => {
    it('should emit shown event when tooltip becomes visible', fakeAsync(() => {
      const shownSpy = jest.fn();
      fixture.componentInstance.shown.subscribe(shownSpy);

      showTooltip();

      expect(shownSpy).toHaveBeenCalledTimes(1);
    }));

    it('should emit hidden event when tooltip is hidden', fakeAsync(() => {
      showTooltip();

      const hiddenSpy = jest.fn();
      fixture.componentInstance.hidden.subscribe(hiddenSpy);

      hideTooltip();

      expect(hiddenSpy).toHaveBeenCalledTimes(1);
    }));

    it('should emit hidden event on immediate hide', fakeAsync(() => {
      showTooltip();

      const hiddenSpy = jest.fn();
      fixture.componentInstance.hidden.subscribe(hiddenSpy);

      hideTooltipImmediate();

      expect(hiddenSpy).toHaveBeenCalledTimes(1);
    }));
  });

  describe('Keyboard interaction', () => {
    it('should hide tooltip on Escape key press', fakeAsync(() => {
      showTooltip();

      fixture.nativeElement.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      );
      fixture.detectChanges();

      expect(getTooltip()).toBeFalsy();
    }));
  });
});
