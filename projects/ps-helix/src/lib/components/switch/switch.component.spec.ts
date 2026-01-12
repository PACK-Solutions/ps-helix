import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PshSwitchComponent, SWITCH_CONFIG } from './switch.component';
import { SwitchSize } from './switch.types';

@Component({
  template: `<psh-switch>Projected label</psh-switch>`,
  imports: [PshSwitchComponent]
})
class TestHostComponent {}

@Component({
  template: `<psh-switch [formControl]="control"></psh-switch>`,
  imports: [PshSwitchComponent, ReactiveFormsModule]
})
class ReactiveFormHostComponent {
  control = new FormControl(false);
}

describe('PshSwitchComponent', () => {
  let fixture: ComponentFixture<PshSwitchComponent>;

  const getSwitchInput = () =>
    fixture.nativeElement.querySelector('input[type="checkbox"]') as HTMLInputElement;

  const getHostElement = () => fixture.nativeElement as HTMLElement;

  const getLabelText = () =>
    fixture.nativeElement.querySelector('.switch-text') as HTMLElement;

  const getErrorMessage = () =>
    fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;

  const getSuccessMessage = () =>
    fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshSwitchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshSwitchComponent);
    fixture.componentRef.setInput('label', 'Test switch');
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render label text from input', () => {
      fixture.componentRef.setInput('label', 'Enable notifications');
      fixture.detectChanges();

      expect(getLabelText().textContent).toContain('Enable notifications');
    });

    it('should render projected content when no label input', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const labelText = hostFixture.nativeElement.querySelector('.switch-text');
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
      fixture.componentRef.setInput('success', 'Setting saved');
      fixture.detectChanges();

      const successEl = getSuccessMessage();
      expect(successEl).toBeTruthy();
      expect(successEl.textContent).toContain('Setting saved');
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
      const input = getSwitchInput();
      expect(input.checked).toBe(false);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(true);
    });

    it('should toggle from checked to unchecked on click', () => {
      fixture.componentRef.setInput('checked', true);
      fixture.detectChanges();

      const input = getSwitchInput();
      expect(input.checked).toBe(true);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(false);
    });

    it('should not toggle when disabled on click', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const input = getSwitchInput();
      expect(input.checked).toBe(false);

      input.click();
      fixture.detectChanges();

      expect(input.checked).toBe(false);
    });

    it('should update checked signal on toggle', () => {
      expect(fixture.componentInstance.checked()).toBe(false);

      getSwitchInput().click();
      fixture.detectChanges();

      expect(fixture.componentInstance.checked()).toBe(true);
    });
  });

  describe('Accessibility', () => {
    describe('aria-checked attribute', () => {
      it('should have aria-checked="false" when unchecked', () => {
        fixture.componentRef.setInput('checked', false);
        fixture.detectChanges();

        expect(getSwitchInput().getAttribute('aria-checked')).toBe('false');
      });

      it('should have aria-checked="true" when checked', () => {
        fixture.componentRef.setInput('checked', true);
        fixture.detectChanges();

        expect(getSwitchInput().getAttribute('aria-checked')).toBe('true');
      });
    });

    describe('aria-required attribute', () => {
      it('should have aria-required when required is true', () => {
        fixture.componentRef.setInput('required', true);
        fixture.detectChanges();

        expect(getSwitchInput().getAttribute('aria-required')).toBe('true');
      });

      it('should have aria-required="false" when required is false', () => {
        fixture.componentRef.setInput('required', false);
        fixture.detectChanges();

        expect(getSwitchInput().getAttribute('aria-required')).toBe('false');
      });
    });

    describe('aria-invalid attribute', () => {
      it('should have aria-invalid="true" when error is present', () => {
        fixture.componentRef.setInput('error', 'Error message');
        fixture.detectChanges();

        expect(getSwitchInput().getAttribute('aria-invalid')).toBe('true');
      });

      it('should have aria-invalid="false" when no error', () => {
        fixture.componentRef.setInput('error', '');
        fixture.detectChanges();

        expect(getSwitchInput().getAttribute('aria-invalid')).toBe('false');
      });
    });

    describe('aria-describedby attribute', () => {
      it('should link to error message via aria-describedby', () => {
        fixture.componentRef.setInput('error', 'Error occurred');
        fixture.detectChanges();

        const input = getSwitchInput();
        const errorEl = getErrorMessage();
        const describedBy = input.getAttribute('aria-describedby');

        expect(describedBy).toBeTruthy();
        expect(errorEl.id).toBe(describedBy);
      });

      it('should link to success message via aria-describedby', () => {
        fixture.componentRef.setInput('success', 'Looks good');
        fixture.detectChanges();

        const input = getSwitchInput();
        const successEl = getSuccessMessage();
        const describedBy = input.getAttribute('aria-describedby');

        expect(describedBy).toBeTruthy();
        expect(successEl.id).toBe(describedBy);
      });

      it('should link to both error and success messages', () => {
        fixture.componentRef.setInput('error', 'Error');
        fixture.componentRef.setInput('success', 'Success');
        fixture.detectChanges();

        const input = getSwitchInput();
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

        expect(getSwitchInput().getAttribute('aria-describedby')).toBeFalsy();
      });
    });

    describe('aria-label attribute', () => {
      it('should use custom ariaLabel when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom accessibility label');
        fixture.detectChanges();

        expect(getSwitchInput().getAttribute('aria-label')).toBe('Custom accessibility label');
      });

      it('should fallback to label when ariaLabel is not provided', () => {
        fixture.componentRef.setInput('label', 'Dark mode');
        fixture.componentRef.setInput('ariaLabel', undefined);
        fixture.detectChanges();

        expect(getSwitchInput().getAttribute('aria-label')).toBe('Dark mode');
      });

      it('should fallback to "Switch" when no label or ariaLabel', () => {
        fixture.componentRef.setInput('label', '');
        fixture.componentRef.setInput('ariaLabel', undefined);
        fixture.detectChanges();

        expect(getSwitchInput().getAttribute('aria-label')).toBe('Switch');
      });
    });
  });

  describe('Size variants', () => {
    it.each<[SwitchSize, boolean]>([
      ['small', true],
      ['medium', false],
      ['large', true]
    ])('should apply correct class for %s size', (size, hasClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.switch-container');
      expect(container.classList.contains(size)).toBe(hasClass);
    });
  });

  describe('Label position', () => {
    it('should apply label-left class when labelPosition is left', () => {
      fixture.componentRef.setInput('labelPosition', 'left');
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.switch-label');
      expect(label.classList.contains('label-left')).toBe(true);
    });

    it('should apply label-right class by default', () => {
      fixture.componentRef.setInput('labelPosition', 'right');
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.switch-label');
      expect(label.classList.contains('label-right')).toBe(true);
    });
  });

  describe('Disabled state', () => {
    it('should have disabled attribute on input when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getSwitchInput().disabled).toBe(true);
    });

    it('should apply switch-disabled class to host', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getHostElement().classList.contains('switch-disabled')).toBe(true);
    });
  });

  describe('Host classes', () => {
    it('should have switch-wrapper class', () => {
      expect(getHostElement().classList.contains('switch-wrapper')).toBe(true);
    });

    it('should apply switch-error class when error is present', () => {
      fixture.componentRef.setInput('error', 'Error');
      fixture.detectChanges();

      expect(getHostElement().classList.contains('switch-error')).toBe(true);
    });

    it('should apply switch-success class when success is present', () => {
      fixture.componentRef.setInput('success', 'Success');
      fixture.detectChanges();

      expect(getHostElement().classList.contains('switch-success')).toBe(true);
    });
  });

  describe('ControlValueAccessor', () => {
    it('should update checked state via writeValue', () => {
      fixture.componentInstance.writeValue(true);
      fixture.detectChanges();

      expect(getSwitchInput().checked).toBe(true);
    });

    it('should handle null value in writeValue', () => {
      fixture.componentInstance.writeValue(null as unknown as boolean);
      fixture.detectChanges();

      expect(getSwitchInput().checked).toBe(false);
    });

    it('should disable input via setDisabledState', () => {
      fixture.componentInstance.setDisabledState(true);
      fixture.detectChanges();

      expect(getSwitchInput().disabled).toBe(true);
    });

    it('should enable input via setDisabledState', () => {
      fixture.componentInstance.setDisabledState(true);
      fixture.detectChanges();
      fixture.componentInstance.setDisabledState(false);
      fixture.detectChanges();

      expect(getSwitchInput().disabled).toBe(false);
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
  });

  describe('Focus and blur methods', () => {
    it('should focus the input element when focus() is called', () => {
      fixture.componentInstance.focus();
      fixture.detectChanges();

      expect(document.activeElement).toBe(getSwitchInput());
    });

    it('should blur the input element when blur() is called', () => {
      fixture.componentInstance.focus();
      fixture.detectChanges();
      expect(document.activeElement).toBe(getSwitchInput());

      fixture.componentInstance.blur();
      fixture.detectChanges();

      expect(document.activeElement).not.toBe(getSwitchInput());
    });
  });

  describe('Input attributes', () => {
    it('should set custom id on input', () => {
      fixture.componentRef.setInput('id', 'custom-switch-id');
      fixture.detectChanges();

      expect(getSwitchInput().id).toBe('custom-switch-id');
    });

    it('should set name attribute on input', () => {
      fixture.componentRef.setInput('name', 'notification-switch');
      fixture.detectChanges();

      expect(getSwitchInput().name).toBe('notification-switch');
    });

    it('should fallback to id for name when name not provided', () => {
      fixture.componentRef.setInput('id', 'my-switch');
      fixture.componentRef.setInput('name', undefined);
      fixture.detectChanges();

      expect(getSwitchInput().name).toBe('my-switch');
    });

    it('should set required attribute on input', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      expect(getSwitchInput().required).toBe(true);
    });
  });

  describe('toggle() method', () => {
    it('should toggle checked state when called programmatically', () => {
      expect(fixture.componentInstance.checked()).toBe(false);

      fixture.componentInstance.toggle();
      fixture.detectChanges();

      expect(fixture.componentInstance.checked()).toBe(true);
    });

    it('should not toggle when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(fixture.componentInstance.checked()).toBe(false);

      fixture.componentInstance.toggle();
      fixture.detectChanges();

      expect(fixture.componentInstance.checked()).toBe(false);
    });

    it('should update checked signal when toggled programmatically', () => {
      expect(fixture.componentInstance.checked()).toBe(false);

      fixture.componentInstance.toggle();
      fixture.detectChanges();

      expect(fixture.componentInstance.checked()).toBe(true);
    });
  });

  describe('Model signals', () => {
    it('should update size signal when set programmatically', () => {
      expect(fixture.componentInstance.size()).toBe('medium');

      fixture.componentInstance.size.set('large');
      fixture.detectChanges();

      expect(fixture.componentInstance.size()).toBe('large');
    });

    it('should update disabled signal when set programmatically', () => {
      expect(fixture.componentInstance.disabled()).toBe(false);

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      expect(fixture.componentInstance.disabled()).toBe(true);
    });

    it('should update required signal when set programmatically', () => {
      expect(fixture.componentInstance.required()).toBe(false);

      fixture.componentInstance.required.set(true);
      fixture.detectChanges();

      expect(fixture.componentInstance.required()).toBe(true);
    });

    it('should update labelPosition signal when set programmatically', () => {
      expect(fixture.componentInstance.labelPosition()).toBe('right');

      fixture.componentInstance.labelPosition.set('left');
      fixture.detectChanges();

      expect(fixture.componentInstance.labelPosition()).toBe('left');
    });

    it('should update checked signal via update method', () => {
      expect(fixture.componentInstance.checked()).toBe(false);

      fixture.componentInstance.checked.update(v => !v);
      fixture.detectChanges();

      expect(fixture.componentInstance.checked()).toBe(true);
    });
  });
});

describe('PshSwitchComponent with custom SWITCH_CONFIG', () => {
  let fixture: ComponentFixture<PshSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshSwitchComponent],
      providers: [
        {
          provide: SWITCH_CONFIG,
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

    fixture = TestBed.createComponent(PshSwitchComponent);
    fixture.detectChanges();
  });

  it('should use checked value from config', () => {
    expect(fixture.componentInstance.checked()).toBe(true);
  });

  it('should use size value from config', () => {
    expect(fixture.componentInstance.size()).toBe('large');
  });

  it('should use required value from config', () => {
    expect(fixture.componentInstance.required()).toBe(true);
  });

  it('should use labelPosition value from config', () => {
    expect(fixture.componentInstance.labelPosition()).toBe('left');
  });
});
