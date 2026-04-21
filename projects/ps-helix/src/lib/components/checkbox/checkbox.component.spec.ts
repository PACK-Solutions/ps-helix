import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PshCheckboxComponent } from './checkbox.component';
import { CheckboxSize } from './checkbox.types';

@Component({
  template: `<psh-checkbox>Projected label</psh-checkbox>`,
  imports: [PshCheckboxComponent]
})
class TestHostComponent {}

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
});
