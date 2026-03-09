import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PshRadioComponent, RADIO_CONFIG, RADIO_STYLES } from './radio.component';
import { RadioSize } from './radio.types';

@Component({
  template: `<psh-radio>Projected label</psh-radio>`,
  imports: [PshRadioComponent]
})
class TestHostComponent {}

@Component({
  template: `
    <psh-radio
      name="test-group"
      [value]="value"
      [checked]="checked"
      (valueChange)="onValueChange($event)"
      (checkedChange)="onCheckedChange($event)"
    >
      Option
    </psh-radio>
  `,
  imports: [PshRadioComponent]
})
class TestHostWithOutputsComponent {
  value = 'option1';
  checked = false;
  onValueChange = jest.fn();
  onCheckedChange = jest.fn();
}

describe('PshRadioComponent', () => {
  let fixture: ComponentFixture<PshRadioComponent>;

  const getRadioInput = () =>
    fixture.nativeElement.querySelector('input[type="radio"]') as HTMLInputElement;

  const getHostElement = () => fixture.nativeElement as HTMLElement;

  const getLabelText = () =>
    fixture.nativeElement.querySelector('.radio-text') as HTMLElement;

  const getErrorMessage = () =>
    fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;

  const getSuccessMessage = () =>
    fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshRadioComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshRadioComponent);
    fixture.componentRef.setInput('label', 'Test radio');
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render label text from input', () => {
      fixture.componentRef.setInput('label', 'Accept terms');
      fixture.detectChanges();

      expect(getLabelText().textContent).toContain('Accept terms');
    });

    it('should render projected content when no label input', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const labelText = hostFixture.nativeElement.querySelector('.radio-text');
      expect(labelText.textContent).toContain('Projected label');
    });

    it('should render error message with role="alert"', () => {
      fixture.componentRef.setInput('error', 'This field is required');
      fixture.detectChanges();

      const errorEl = getErrorMessage();
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent).toContain('This field is required');
    });

    it('should render success message with role="status"', () => {
      fixture.componentRef.setInput('success', 'Validated successfully');
      fixture.detectChanges();

      const successEl = getSuccessMessage();
      expect(successEl).toBeTruthy();
      expect(successEl.textContent).toContain('Validated successfully');
    });

    it('should not render error message when empty', () => {
      fixture.componentRef.setInput('error', '');
      fixture.detectChanges();

      expect(getErrorMessage()).toBeFalsy();
    });

    it('should not render success message when empty', () => {
      fixture.componentRef.setInput('success', '');
      fixture.detectChanges();

      expect(getSuccessMessage()).toBeFalsy();
    });
  });

  describe('User interactions', () => {
    it('should become checked on click', () => {
      const input = getRadioInput();
      expect(input.checked).toBe(false);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should stay checked when clicking an already checked radio', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const input = getRadioInput();
      expect(input.checked).toBe(true);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should select on Space key press', () => {
      const input = getRadioInput();
      expect(input.checked).toBe(false);

      input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should select on Enter key press', () => {
      const input = getRadioInput();
      expect(input.checked).toBe(false);

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should not select when disabled on click', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = getRadioInput();
      expect(input.checked).toBe(false);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(false);
    });

    it('should not select when disabled on keyboard', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = getRadioInput();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();

      expect(input.checked).toBe(false);
    });
  });

  describe('Output events', () => {
    let hostFixture: ComponentFixture<TestHostWithOutputsComponent>;

    beforeEach(async () => {
      hostFixture = TestBed.createComponent(TestHostWithOutputsComponent);
      hostFixture.detectChanges();
    });

    it('should emit checkedChange when selected', () => {
      const input = hostFixture.nativeElement.querySelector('input[type="radio"]');
      input.click();
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.onCheckedChange).toHaveBeenCalledWith(true);
    });

    it('should emit valueChange with configured value when selected', () => {
      const input = hostFixture.nativeElement.querySelector('input[type="radio"]');
      input.click();
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.onValueChange).toHaveBeenCalledWith('option1');
    });

    it('should not emit events when clicking already checked radio', () => {
      hostFixture.componentInstance.checked = true;
      hostFixture.detectChanges();

      hostFixture.componentInstance.onCheckedChange.mockClear();
      hostFixture.componentInstance.onValueChange.mockClear();

      const input = hostFixture.nativeElement.querySelector('input[type="radio"]');
      input.click();
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.onCheckedChange).not.toHaveBeenCalled();
      expect(hostFixture.componentInstance.onValueChange).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    describe('aria-checked attribute', () => {
      it.each<[boolean, string]>([
        [false, 'false'],
        [true, 'true']
      ])(
        'should have aria-checked="%s" when checked=%s',
        (checked, expectedValue) => {
          fixture.componentRef.setInput('checked', checked);
          fixture.detectChanges();

          expect(getRadioInput().getAttribute('aria-checked')).toBe(expectedValue);
        }
      );
    });

    describe('aria-required attribute', () => {
      it('should have aria-required when required is true', () => {
        fixture.componentRef.setInput('required', true);
        fixture.detectChanges();

        expect(getRadioInput().getAttribute('aria-required')).toBe('true');
      });

      it('should not have aria-required when required is false', () => {
        fixture.componentRef.setInput('required', false);
        fixture.detectChanges();

        expect(getRadioInput().getAttribute('aria-required')).toBeFalsy();
      });
    });

    describe('aria-invalid attribute', () => {
      it('should have aria-invalid="true" when error is present', () => {
        fixture.componentRef.setInput('error', 'Error message');
        fixture.detectChanges();

        expect(getRadioInput().getAttribute('aria-invalid')).toBe('true');
      });

      it('should not have aria-invalid when no error', () => {
        fixture.componentRef.setInput('error', '');
        fixture.detectChanges();

        expect(getRadioInput().getAttribute('aria-invalid')).toBeFalsy();
      });
    });

    describe('aria-describedby attribute', () => {
      it('should link to error message via aria-describedby', () => {
        fixture.componentRef.setInput('error', 'Error occurred');
        fixture.detectChanges();

        const input = getRadioInput();
        const errorEl = getErrorMessage();
        const describedBy = input.getAttribute('aria-describedby');

        expect(describedBy).toBeTruthy();
        expect(errorEl.id).toBe(describedBy);
      });

      it('should link to success message via aria-describedby', () => {
        fixture.componentRef.setInput('success', 'Looks good');
        fixture.detectChanges();

        const input = getRadioInput();
        const successEl = getSuccessMessage();
        const describedBy = input.getAttribute('aria-describedby');

        expect(describedBy).toBeTruthy();
        expect(successEl.id).toBe(describedBy);
      });

      it('should link to both error and success messages', () => {
        fixture.componentRef.setInput('error', 'Error');
        fixture.componentRef.setInput('success', 'Success');
        fixture.detectChanges();

        const input = getRadioInput();
        const errorEl = getErrorMessage();
        const successEl = getSuccessMessage();
        const describedBy = input.getAttribute('aria-describedby');

        expect(describedBy).toContain(errorEl.id);
        expect(describedBy).toContain(successEl.id);
      });

      it('should not have aria-describedby when no messages', () => {
        fixture.componentRef.setInput('error', '');
        fixture.componentRef.setInput('success', '');
        fixture.detectChanges();

        expect(getRadioInput().getAttribute('aria-describedby')).toBeFalsy();
      });
    });

    describe('aria-label attribute', () => {
      it('should use custom ariaLabel when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom accessibility label');
        fixture.detectChanges();

        expect(getRadioInput().getAttribute('aria-label')).toBe('Custom accessibility label');
      });

      it('should use label as aria-label when no ariaLabel provided', () => {
        fixture.componentRef.setInput('label', 'Terms and conditions');
        fixture.componentRef.setInput('ariaLabel', undefined);
        fixture.detectChanges();

        expect(getRadioInput().getAttribute('aria-label')).toBe('Terms and conditions');
      });
    });
  });

  describe('data-state attribute', () => {
    it.each<[string, Record<string, unknown>, string]>([
      ['unchecked by default', {}, 'unchecked'],
      ['checked when checked', { checked: true }, 'checked'],
      ['disabled takes priority', { disabled: true, checked: true }, 'disabled'],
      ['error state', { error: 'Error' }, 'error'],
      ['success state', { success: 'Success' }, 'success']
    ])('should have correct data-state: %s', (_, inputs, expectedState) => {
      Object.entries(inputs).forEach(([key, value]) => {
        fixture.componentRef.setInput(key, value);
      });
      fixture.detectChanges();

      expect(getHostElement().getAttribute('data-state')).toBe(expectedState);
    });

    it('should prioritize disabled over other states', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('error', 'Error');
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      expect(getHostElement().getAttribute('data-state')).toBe('disabled');
    });

    it('should prioritize error over success and checked', () => {
      fixture.componentRef.setInput('error', 'Error');
      fixture.componentRef.setInput('success', 'Success');
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      expect(getHostElement().getAttribute('data-state')).toBe('error');
    });
  });

  describe('Size variants', () => {
    it.each<[RadioSize, string]>([
      ['small', 'radio-small'],
      ['large', 'radio-large']
    ])('should apply %s size class', (size, expectedClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      expect(getHostElement().classList.contains(expectedClass)).toBe(true);
    });

    it('should not have size class for medium (default)', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      expect(getHostElement().classList.contains('radio-small')).toBe(false);
      expect(getHostElement().classList.contains('radio-large')).toBe(false);
    });
  });

  describe('Label position', () => {
    it('should apply label-left class when labelPosition is left', () => {
      fixture.componentRef.setInput('labelPosition', 'left');
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.radio-label');
      expect(label.classList.contains('label-left')).toBe(true);
    });

    it('should not have label-left class by default (right position)', () => {
      fixture.componentRef.setInput('labelPosition', 'right');
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.radio-label');
      expect(label.classList.contains('label-left')).toBe(false);
    });
  });

  describe('Disabled state', () => {
    it('should have disabled attribute on input when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getRadioInput().disabled).toBe(true);
    });

    it('should apply radio-disabled class to host', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getHostElement().classList.contains('radio-disabled')).toBe(true);
    });
  });

  describe('Radio input attributes', () => {
    it('should apply name attribute to input', () => {
      fixture.componentRef.setInput('name', 'payment-method');
      fixture.detectChanges();

      expect(getRadioInput().getAttribute('name')).toBe('payment-method');
    });

    it('should apply value attribute to input', () => {
      fixture.componentRef.setInput('value', 'credit-card');
      fixture.detectChanges();

      expect(getRadioInput().getAttribute('value')).toBe('credit-card');
    });

    it('should apply required attribute when required is true', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      expect(getRadioInput().required).toBe(true);
    });
  });

  describe('State classes on host', () => {
    it('should apply radio-error class when error is present', () => {
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();

      expect(getHostElement().classList.contains('radio-error')).toBe(true);
    });

    it('should apply radio-success class when success is present', () => {
      fixture.componentRef.setInput('success', 'Success message');
      fixture.detectChanges();

      expect(getHostElement().classList.contains('radio-success')).toBe(true);
    });

    it('should not have error class when no error', () => {
      fixture.componentRef.setInput('error', '');
      fixture.detectChanges();

      expect(getHostElement().classList.contains('radio-error')).toBe(false);
    });

    it('should not have success class when no success', () => {
      fixture.componentRef.setInput('success', '');
      fixture.detectChanges();

      expect(getHostElement().classList.contains('radio-success')).toBe(false);
    });
  });

  describe('Arrow key navigation', () => {
    it('should call focusNextRadio on ArrowDown key', () => {
      const input = getRadioInput();
      const focusNextSpy = jest.spyOn(fixture.componentInstance as any, 'focusNextRadio');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      fixture.detectChanges();

      expect(focusNextSpy).toHaveBeenCalled();
    });

    it('should call focusNextRadio on ArrowRight key', () => {
      const input = getRadioInput();
      const focusNextSpy = jest.spyOn(fixture.componentInstance as any, 'focusNextRadio');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      fixture.detectChanges();

      expect(focusNextSpy).toHaveBeenCalled();
    });

    it('should call focusPreviousRadio on ArrowUp key', () => {
      const input = getRadioInput();
      const focusPrevSpy = jest.spyOn(fixture.componentInstance as any, 'focusPreviousRadio');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      fixture.detectChanges();

      expect(focusPrevSpy).toHaveBeenCalled();
    });

    it('should call focusPreviousRadio on ArrowLeft key', () => {
      const input = getRadioInput();
      const focusPrevSpy = jest.spyOn(fixture.componentInstance as any, 'focusPreviousRadio');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      fixture.detectChanges();

      expect(focusPrevSpy).toHaveBeenCalled();
    });

    it('should not navigate when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = getRadioInput();
      const focusNextSpy = jest.spyOn(fixture.componentInstance as any, 'focusNextRadio');

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      fixture.detectChanges();

      expect(focusNextSpy).not.toHaveBeenCalled();
    });
  });

  describe('updateProjectedContent method', () => {
    it('should set hasProjectedContent to true when called with true', () => {
      fixture.componentInstance.updateProjectedContent(true);
      fixture.detectChanges();

      expect((fixture.componentInstance as any).hasProjectedContent()).toBe(true);
    });

    it('should set hasProjectedContent to false when called with false', () => {
      fixture.componentInstance.updateProjectedContent(true);
      fixture.detectChanges();

      fixture.componentInstance.updateProjectedContent(false);
      fixture.detectChanges();

      expect((fixture.componentInstance as any).hasProjectedContent()).toBe(false);
    });
  });

  describe('computedAriaLabel with projected content', () => {
    it('should return undefined when hasProjectedContent is true and no label/ariaLabel', () => {
      fixture.componentRef.setInput('label', '');
      fixture.componentRef.setInput('ariaLabel', undefined);
      fixture.componentInstance.updateProjectedContent(true);
      fixture.detectChanges();

      expect((fixture.componentInstance as any).computedAriaLabel()).toBeUndefined();
    });

    it('should return "Radio" fallback when no label, ariaLabel, or projected content', () => {
      fixture.componentRef.setInput('label', '');
      fixture.componentRef.setInput('ariaLabel', undefined);
      fixture.componentInstance.updateProjectedContent(false);
      fixture.detectChanges();

      expect((fixture.componentInstance as any).computedAriaLabel()).toBe('Radio');
    });
  });
});

describe('PshRadioComponent with custom configuration', () => {
  let fixture: ComponentFixture<PshRadioComponent>;

  describe('RADIO_CONFIG injection', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PshRadioComponent],
        providers: [
          {
            provide: RADIO_CONFIG,
            useValue: {
              checked: true,
              disabled: false,
              required: true,
              size: 'large',
              labelPosition: 'left'
            }
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(PshRadioComponent);
      fixture.componentRef.setInput('label', 'Config test');
      fixture.detectChanges();
    });

    it('should use checked from config', () => {
      expect(fixture.componentInstance.checked()).toBe(true);
    });

    it('should use required from config', () => {
      expect(fixture.componentInstance.required()).toBe(true);
    });

    it('should use size from config', () => {
      expect(fixture.componentInstance.size()).toBe('large');
    });

    it('should use labelPosition from config', () => {
      expect(fixture.componentInstance.labelPosition()).toBe('left');
    });
  });

  describe('RADIO_STYLES injection', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PshRadioComponent],
        providers: [
          {
            provide: RADIO_STYLES,
            useValue: [
              { '--radio-color': 'blue' },
              { '--radio-size': '20px' }
            ]
          }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(PshRadioComponent);
      fixture.componentRef.setInput('label', 'Style test');
      fixture.detectChanges();
    });

    it('should merge custom styles into customStyles computed', () => {
      const styles = (fixture.componentInstance as any).customStyles();
      expect(styles['--radio-color']).toBe('blue');
      expect(styles['--radio-size']).toBe('20px');
    });
  });
});

// ── Emission safety tests ────────────────────────────────────────────

@Component({
  template: `
    <psh-radio
      name="test-group"
      [value]="'radio1'"
      [checked]="checked"
      (checkedChange)="onCheckedChange($event)"
      (disabledChange)="onDisabledChange($event)"
    >
      Option
    </psh-radio>
  `,
  imports: [PshRadioComponent]
})
class EmissionTestHost {
  checked = false;
  onCheckedChange = jest.fn();
  onDisabledChange = jest.fn();
}

describe('PshRadioComponent emission safety', () => {
  let fixture: ComponentFixture<EmissionTestHost>;
  let host: EmissionTestHost;

  const getRadioInput = () =>
    fixture.nativeElement.querySelector('input[type="radio"]') as HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmissionTestHost]
    }).compileComponents();

    fixture = TestBed.createComponent(EmissionTestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should NOT emit checkedChange when parent sets [checked] programmatically', () => {
    host.onCheckedChange.mockClear();

    host.checked = true;
    fixture.detectChanges();

    expect(host.onCheckedChange).not.toHaveBeenCalled();
  });

  it('should emit checkedChange exactly once on user click', () => {
    host.onCheckedChange.mockClear();

    getRadioInput().click();
    fixture.detectChanges();

    expect(host.onCheckedChange).toHaveBeenCalledTimes(1);
    expect(host.onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should NOT emit checkedChange on initial render', () => {
    expect(host.onCheckedChange).not.toHaveBeenCalled();
  });

  it('should NOT emit checkedChange when clicking already checked radio', () => {
    getRadioInput().click();
    fixture.detectChanges();
    host.onCheckedChange.mockClear();

    getRadioInput().click();
    fixture.detectChanges();

    expect(host.onCheckedChange).not.toHaveBeenCalled();
  });
});
