import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PshCheckboxComponent } from './checkbox.component';
import { CheckboxSize } from './checkbox.types';

@Component({
  template: `<psh-checkbox>Projected label</psh-checkbox>`,
  imports: [PshCheckboxComponent]
})
class TestHostComponent {}

@Component({
  template: `<psh-checkbox [formControl]="control" label="Form checkbox"></psh-checkbox>`,
  imports: [PshCheckboxComponent, ReactiveFormsModule]
})
class ReactiveFormHostComponent {
  control = new FormControl(false);
}

describe('PshCheckboxComponent', () => {
  let fixture: ComponentFixture<PshCheckboxComponent>;

  const getCheckboxInput = () =>
    fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;

  const getHostElement = () => fixture.nativeElement as HTMLElement;

  const getLabelText = () =>
    fixture.nativeElement.querySelector('.checkbox-text') as HTMLElement;

  const getErrorMessage = () =>
    fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;

  const getSuccessMessage = () =>
    fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshCheckboxComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshCheckboxComponent);
    fixture.componentRef.setInput('label', 'Test checkbox');
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

      const labelText = hostFixture.nativeElement.querySelector('.checkbox-text');
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
    it('should toggle from unchecked to checked on click', () => {
      const input = getCheckboxInput();
      expect(input.checked).toBe(false);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should toggle from checked to unchecked on click', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const input = getCheckboxInput();
      expect(input.checked).toBe(true);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(false);
    });

    it('should toggle on Space key press', () => {
      const input = getCheckboxInput();
      expect(input.checked).toBe(false);

      input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should toggle on Enter key press', () => {
      const input = getCheckboxInput();
      expect(input.checked).toBe(false);

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should not toggle when disabled on click', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = getCheckboxInput();
      expect(input.checked).toBe(false);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(false);
    });

    it('should not toggle when disabled on keyboard', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = getCheckboxInput();
      input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();

      expect(input.checked).toBe(false);
    });
  });

  describe('Accessibility', () => {
    describe('aria-checked attribute', () => {
      it.each<[boolean, boolean, 'true' | 'false' | 'mixed']>([
        [false, false, 'false'],
        [true, false, 'true'],
        [false, true, 'mixed'],
        [true, true, 'mixed']
      ])(
        'should have aria-checked="%s" when checked=%s and indeterminate=%s',
        (checked, indeterminate, expectedValue) => {
          fixture.componentRef.setInput('checked', checked);
          fixture.componentRef.setInput('indeterminate', indeterminate);
          fixture.detectChanges();

          expect(getCheckboxInput().getAttribute('aria-checked')).toBe(expectedValue);
        }
      );
    });

    describe('aria-required attribute', () => {
      it('should have aria-required when required is true', () => {
        fixture.componentRef.setInput('required', true);
        fixture.detectChanges();

        expect(getCheckboxInput().getAttribute('aria-required')).toBe('true');
      });

      it('should not have aria-required when required is false', () => {
        fixture.componentRef.setInput('required', false);
        fixture.detectChanges();

        expect(getCheckboxInput().getAttribute('aria-required')).toBeFalsy();
      });
    });

    describe('aria-invalid attribute', () => {
      it('should have aria-invalid="true" when error is present', () => {
        fixture.componentRef.setInput('error', 'Error message');
        fixture.detectChanges();

        expect(getCheckboxInput().getAttribute('aria-invalid')).toBe('true');
      });

      it('should not have aria-invalid when no error', () => {
        fixture.componentRef.setInput('error', '');
        fixture.detectChanges();

        expect(getCheckboxInput().getAttribute('aria-invalid')).toBeFalsy();
      });
    });

    describe('aria-describedby attribute', () => {
      it('should link to error message via aria-describedby', () => {
        fixture.componentRef.setInput('error', 'Error occurred');
        fixture.detectChanges();

        const input = getCheckboxInput();
        const errorEl = getErrorMessage();
        const describedBy = input.getAttribute('aria-describedby');

        expect(describedBy).toBeTruthy();
        expect(errorEl.id).toBe(describedBy);
      });

      it('should link to success message via aria-describedby', () => {
        fixture.componentRef.setInput('success', 'Looks good');
        fixture.detectChanges();

        const input = getCheckboxInput();
        const successEl = getSuccessMessage();
        const describedBy = input.getAttribute('aria-describedby');

        expect(describedBy).toBeTruthy();
        expect(successEl.id).toBe(describedBy);
      });

      it('should link to both error and success messages', () => {
        fixture.componentRef.setInput('error', 'Error');
        fixture.componentRef.setInput('success', 'Success');
        fixture.detectChanges();

        const input = getCheckboxInput();
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

        expect(getCheckboxInput().getAttribute('aria-describedby')).toBeFalsy();
      });
    });

    describe('aria-label attribute', () => {
      it('should use custom ariaLabel when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom accessibility label');
        fixture.detectChanges();

        expect(getCheckboxInput().getAttribute('aria-label')).toBe('Custom accessibility label');
      });

      it('should not have aria-label when ariaLabel is not provided', () => {
        fixture.componentRef.setInput('label', 'Terms and conditions');
        fixture.componentRef.setInput('ariaLabel', undefined);
        fixture.detectChanges();

        expect(getCheckboxInput().getAttribute('aria-label')).toBeFalsy();
      });
    });
  });

  describe('data-state attribute', () => {
    it.each<[string, Record<string, unknown>, string]>([
      ['unchecked by default', {}, 'unchecked'],
      ['checked when checked', { checked: true }, 'checked'],
      ['disabled takes priority', { disabled: true, checked: true }, 'disabled'],
      ['indeterminate state', { indeterminate: true }, 'indeterminate'],
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

    it('should prioritize indeterminate over error and checked', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.componentRef.setInput('error', 'Error');
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      expect(getHostElement().getAttribute('data-state')).toBe('indeterminate');
    });
  });

  describe('Size variants', () => {
    it.each<[CheckboxSize, string]>([
      ['small', 'checkbox-small'],
      ['large', 'checkbox-large']
    ])('should apply %s size class', (size, expectedClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      expect(getHostElement().classList.contains(expectedClass)).toBe(true);
    });

    it('should not have size class for medium (default)', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      expect(getHostElement().classList.contains('checkbox-small')).toBe(false);
      expect(getHostElement().classList.contains('checkbox-large')).toBe(false);
    });
  });

  describe('Label position', () => {
    it('should apply label-left class when labelPosition is left', () => {
      fixture.componentRef.setInput('labelPosition', 'left');
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.checkbox-label');
      expect(label.classList.contains('label-left')).toBe(true);
    });

    it('should not have label-left class by default (right position)', () => {
      fixture.componentRef.setInput('labelPosition', 'right');
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.checkbox-label');
      expect(label.classList.contains('label-left')).toBe(false);
    });
  });

  describe('Indeterminate behavior', () => {
    it('should clear indeterminate state after toggle', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.detectChanges();

      expect(getCheckboxInput().getAttribute('aria-checked')).toBe('mixed');

      getCheckboxInput().click();
      fixture.detectChanges();

      expect(getCheckboxInput().getAttribute('aria-checked')).toBe('true');
    });

    it('should become checked after toggling from indeterminate', () => {
      fixture.componentRef.setInput('indeterminate', true);
      fixture.componentRef.setInput('checked', false);
      fixture.detectChanges();

      getCheckboxInput().click();
      fixture.detectChanges();

      expect(getCheckboxInput().checked).toBe(true);
    });
  });

  describe('Disabled state', () => {
    it('should have disabled attribute on input when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getCheckboxInput().disabled).toBe(true);
    });

    it('should apply checkbox-disabled class to host', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getHostElement().classList.contains('checkbox-disabled')).toBe(true);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should update checked state via writeValue', () => {
      fixture.componentInstance.writeValue(true);
      fixture.detectChanges();

      expect(getCheckboxInput().checked).toBe(true);
    });

    it('should handle null value in writeValue', () => {
      fixture.componentInstance.writeValue(null as unknown as boolean);
      fixture.detectChanges();

      expect(getCheckboxInput().checked).toBe(false);
    });

    it('should handle undefined value in writeValue', () => {
      fixture.componentInstance.writeValue(undefined as unknown as boolean);
      fixture.detectChanges();

      expect(getCheckboxInput().checked).toBe(false);
    });

    it('should disable input via setDisabledState', () => {
      fixture.componentInstance.setDisabledState(true);
      fixture.detectChanges();

      expect(getCheckboxInput().disabled).toBe(true);
    });

    it('should enable input via setDisabledState', () => {
      fixture.componentInstance.setDisabledState(true);
      fixture.detectChanges();
      fixture.componentInstance.setDisabledState(false);
      fixture.detectChanges();

      expect(getCheckboxInput().disabled).toBe(false);
    });

    it('should work with reactive forms', async () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.detectChanges();

      const input = hostFixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.checked).toBe(false);

      hostFixture.componentInstance.control.setValue(true);
      hostFixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should update form control on toggle', async () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.detectChanges();

      const input = hostFixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.control.value).toBe(true);
    });

    it('should respect disabled state from form control', async () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.componentInstance.control.disable();
      hostFixture.detectChanges();

      const input = hostFixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('should call onChange callback when toggling', () => {
      const onChangeSpy = jest.fn();
      fixture.componentInstance.registerOnChange(onChangeSpy);

      getCheckboxInput().click();
      fixture.detectChanges();

      expect(onChangeSpy).toHaveBeenCalledWith(true);
    });

    it('should call onTouched callback when toggling', () => {
      const onTouchedSpy = jest.fn();
      fixture.componentInstance.registerOnTouched(onTouchedSpy);

      getCheckboxInput().click();
      fixture.detectChanges();

      expect(onTouchedSpy).toHaveBeenCalled();
    });
  });

  describe('Focus and blur methods', () => {
    it('should focus the input element when focus() is called', () => {
      fixture.componentInstance.focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(getCheckboxInput());
    });

    it('should blur the input element when blur() is called', () => {
      fixture.componentInstance.focus();
      fixture.detectChanges();
      expect(document.activeElement).toBe(getCheckboxInput());

      fixture.componentInstance.blur();
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(getCheckboxInput());
    });
  });

  describe('toggle() method with ControlValueAccessor', () => {
    it('should notify form control when toggled', () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.control.value).toBe(false);

      const input = hostFixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.control.value).toBe(true);

      input.click();
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.control.value).toBe(false);
    });

    it('should mark form control as touched after toggle', () => {
      const hostFixture = TestBed.createComponent(ReactiveFormHostComponent);
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.control.touched).toBe(false);

      const input = hostFixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;
      input.click();
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.control.touched).toBe(true);
    });
  });
});

// ── CVA emission safety tests ────────────────────────────────────────

@Component({
  template: `
    <psh-checkbox
      [formControl]="control"
      label="Test checkbox"
      (checkedChange)="onCheckedChange($event)"
      (disabledChange)="onDisabledChange($event)"
    ></psh-checkbox>
  `,
  imports: [PshCheckboxComponent, ReactiveFormsModule]
})
class CvaEmissionTestHost {
  control = new FormControl(false);
  onCheckedChange = jest.fn();
  onDisabledChange = jest.fn();
}

describe('PshCheckboxComponent CVA emission safety', () => {
  let fixture: ComponentFixture<CvaEmissionTestHost>;
  let host: CvaEmissionTestHost;

  const getCheckboxInput = () =>
    fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvaEmissionTestHost]
    }).compileComponents();

    fixture = TestBed.createComponent(CvaEmissionTestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should NOT emit checkedChange when form control sets value via setValue', () => {
    host.onCheckedChange.mockClear();

    host.control.setValue(true);
    fixture.detectChanges();

    expect(host.onCheckedChange).not.toHaveBeenCalled();
  });

  it('should NOT emit checkedChange when form control sets value via patchValue', () => {
    host.onCheckedChange.mockClear();

    host.control.patchValue(true);
    fixture.detectChanges();

    expect(host.onCheckedChange).not.toHaveBeenCalled();
  });

  it('should NOT emit disabledChange when form control is disabled', () => {
    host.onDisabledChange.mockClear();

    host.control.disable();
    fixture.detectChanges();

    expect(host.onDisabledChange).not.toHaveBeenCalled();
  });

  it('should NOT emit disabledChange when form control is enabled', () => {
    host.control.disable();
    fixture.detectChanges();
    host.onDisabledChange.mockClear();

    host.control.enable();
    fixture.detectChanges();

    expect(host.onDisabledChange).not.toHaveBeenCalled();
  });

  it('should emit checkedChange exactly once on user click', () => {
    host.onCheckedChange.mockClear();

    getCheckboxInput().click();
    fixture.detectChanges();

    expect(host.onCheckedChange).toHaveBeenCalledTimes(1);
    expect(host.onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('should NOT emit checkedChange on initial render', () => {
    expect(host.onCheckedChange).not.toHaveBeenCalled();
  });

  it('should emit checkedChange once when using formControl and (checkedChange) together', () => {
    host.onCheckedChange.mockClear();

    // Programmatic set should NOT fire
    host.control.setValue(true);
    fixture.detectChanges();
    expect(host.onCheckedChange).not.toHaveBeenCalled();

    // User click should fire exactly once (toggling from true back to false)
    getCheckboxInput().click();
    fixture.detectChanges();
    expect(host.onCheckedChange).toHaveBeenCalledTimes(1);
    expect(host.onCheckedChange).toHaveBeenCalledWith(false);
  });
});
