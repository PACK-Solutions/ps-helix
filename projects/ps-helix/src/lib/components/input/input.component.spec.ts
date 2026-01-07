import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { PshInputComponent } from './input.component';
import { InputType, InputVariant, InputSize } from './input.types';

@Component({
  template: `<psh-input><span input-label>Custom Label</span></psh-input>`,
  imports: [PshInputComponent]
})
class TestHostLabelComponent {}

@Component({
  template: `<psh-input [formControl]="control"></psh-input>`,
  imports: [PshInputComponent, ReactiveFormsModule]
})
class TestHostFormComponent {
  control = new FormControl('');
}

describe('PshInputComponent', () => {
  let fixture: ComponentFixture<PshInputComponent>;

  const getInput = () =>
    fixture.nativeElement.querySelector('input') as HTMLInputElement;

  const getLabel = () =>
    fixture.nativeElement.querySelector('label') as HTMLLabelElement;

  const getErrorMessage = () =>
    fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;

  const getSuccessMessage = () =>
    fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;

  const getHintMessage = () =>
    fixture.nativeElement.querySelector('#hint-message') as HTMLElement;

  const getPasswordToggle = () =>
    fixture.nativeElement.querySelector('button.password-toggle') as HTMLButtonElement;

  const getSuggestionsList = () =>
    fixture.nativeElement.querySelector('[role="listbox"]') as HTMLElement;

  const getSuggestionOptions = () =>
    fixture.nativeElement.querySelectorAll('[role="option"]') as NodeListOf<HTMLElement>;

  const getLoader = () =>
    fixture.nativeElement.querySelector('.input-loader') as HTMLElement;

  const ALL_TYPES: InputType[] = ['text', 'password', 'email', 'tel', 'url', 'search', 'date', 'number'];
  const ALL_VARIANTS: InputVariant[] = ['outlined', 'filled'];
  const ALL_SIZES: InputSize[] = ['small', 'medium', 'large'];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshInputComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render an input element', () => {
      expect(getInput()).toBeTruthy();
    });

    it('should display label text from input property', () => {
      fixture.componentRef.setInput('label', 'Email Address');
      fixture.detectChanges();

      expect(getLabel().textContent).toContain('Email Address');
    });

    it('should render projected label content', async () => {
      const hostFixture = TestBed.createComponent(TestHostLabelComponent);
      hostFixture.detectChanges();

      const label = hostFixture.nativeElement.querySelector('label');
      expect(label.textContent).toContain('Custom Label');
    });

    it('should hide label when showLabel is false', () => {
      fixture.componentRef.setInput('label', 'Hidden Label');
      fixture.componentRef.setInput('showLabel', false);
      fixture.detectChanges();

      expect(getLabel()).toBeFalsy();
    });

    it('should render error message with role="alert"', () => {
      fixture.componentRef.setInput('error', 'This field is required');
      fixture.detectChanges();

      const errorEl = getErrorMessage();
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent).toContain('This field is required');
    });

    it('should render success message with role="status"', () => {
      fixture.componentRef.setInput('success', 'Email is valid');
      fixture.detectChanges();

      const successEl = getSuccessMessage();
      expect(successEl).toBeTruthy();
      expect(successEl.textContent).toContain('Email is valid');
    });

    it('should render hint message', () => {
      fixture.componentRef.setInput('hint', 'Enter your email address');
      fixture.detectChanges();

      const hintEl = getHintMessage();
      expect(hintEl).toBeTruthy();
      expect(hintEl.textContent).toContain('Enter your email address');
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

    it('should not render hint message when empty', () => {
      fixture.componentRef.setInput('hint', '');
      fixture.detectChanges();

      expect(getHintMessage()).toBeFalsy();
    });

    it('should show loader when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getLoader()).toBeTruthy();
    });

    it('should not show loader when loading is false', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      expect(getLoader()).toBeFalsy();
    });

    it('should display placeholder text', () => {
      fixture.componentRef.setInput('placeholder', 'Enter text here');
      fixture.detectChanges();

      expect(getInput().getAttribute('placeholder')).toBe('Enter text here');
    });
  });

  describe('User interactions', () => {
    it('should emit valueChange on input', () => {
      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      const input = getInput();
      input.value = 'test value';
      input.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenCalledWith('test value');
    });

    it('should emit inputFocus when input receives focus', () => {
      const focusSpy = jest.fn();
      fixture.componentInstance.inputFocus.subscribe(focusSpy);

      getInput().dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      expect(focusSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit inputBlur when input loses focus', () => {
      const blurSpy = jest.fn();
      fixture.componentInstance.inputBlur.subscribe(blurSpy);

      getInput().dispatchEvent(new FocusEvent('blur'));
      fixture.detectChanges();

      expect(blurSpy).toHaveBeenCalledTimes(1);
    });

    it('should not allow input when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getInput().disabled).toBe(true);
    });

    it('should not allow editing when readonly', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();

      expect(getInput().readOnly).toBe(true);
    });

    it('should update input value when value model changes', () => {
      fixture.componentRef.setInput('value', 'new value');
      fixture.detectChanges();

      expect(getInput().value).toBe('new value');
    });
  });

  describe('Password input behavior', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('type', 'password');
      fixture.detectChanges();
    });

    it('should show password toggle button for password type', () => {
      expect(getPasswordToggle()).toBeTruthy();
    });

    it('should not show password toggle button for non-password types', () => {
      fixture.componentRef.setInput('type', 'text');
      fixture.detectChanges();

      expect(getPasswordToggle()).toBeFalsy();
    });

    it('should toggle input type when password toggle is clicked', () => {
      expect(getInput().type).toBe('password');

      getPasswordToggle().click();
      fixture.detectChanges();

      expect(getInput().type).toBe('text');

      getPasswordToggle().click();
      fixture.detectChanges();

      expect(getInput().type).toBe('password');
    });

    it('should have correct aria-label on password toggle based on visibility', () => {
      expect(getPasswordToggle().getAttribute('aria-label')).toBe('Afficher le mot de passe');

      getPasswordToggle().click();
      fixture.detectChanges();

      expect(getPasswordToggle().getAttribute('aria-label')).toBe('Masquer le mot de passe');
    });

    it('should disable password toggle when input is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getPasswordToggle().disabled).toBe(true);
    });

    it('should disable password toggle when input is readonly', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();

      expect(getPasswordToggle().disabled).toBe(true);
    });
  });

  describe('data-state attribute', () => {
    it('should have data-state="default" in normal state', () => {
      expect(getInput().getAttribute('data-state')).toBe('default');
    });

    it('should have data-state="disabled" when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('disabled');
    });

    it('should have data-state="readonly" when readonly', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('readonly');
    });

    it('should have data-state="loading" when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('loading');
    });

    it('should have data-state="error" when error is present', () => {
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('error');
    });

    it('should have data-state="success" when success is present', () => {
      fixture.componentRef.setInput('success', 'Success message');
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('success');
    });

    it('should have data-state="focused" when input is focused', () => {
      getInput().dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('focused');
    });

    it('should prioritize disabled over other states', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('error', 'Error');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('disabled');
    });

    it('should prioritize readonly over loading and error', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.componentRef.setInput('error', 'Error');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('readonly');
    });

    it('should prioritize loading over error and success', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('error', 'Error');
      fixture.componentRef.setInput('success', 'Success');
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('loading');
    });

    it('should prioritize error over success', () => {
      fixture.componentRef.setInput('error', 'Error');
      fixture.componentRef.setInput('success', 'Success');
      fixture.detectChanges();

      expect(getInput().getAttribute('data-state')).toBe('error');
    });
  });

  describe('Accessibility', () => {
    describe('aria-label attribute', () => {
      it('should use ariaLabel when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom aria label');
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-label')).toBe('Custom aria label');
      });

      it('should fallback to label when ariaLabel is not provided', () => {
        fixture.componentRef.setInput('label', 'Email');
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-label')).toBe('Email');
      });

      it('should fallback to placeholder when neither ariaLabel nor label is provided', () => {
        fixture.componentRef.setInput('placeholder', 'Enter email');
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-label')).toBe('Enter email');
      });

      it('should prioritize ariaLabel over label', () => {
        fixture.componentRef.setInput('ariaLabel', 'Aria Label');
        fixture.componentRef.setInput('label', 'Label');
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-label')).toBe('Aria Label');
      });
    });

    describe('aria-invalid attribute', () => {
      it('should have aria-invalid="true" when error is present', () => {
        fixture.componentRef.setInput('error', 'Invalid input');
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-invalid')).toBe('true');
      });

      it('should not have aria-invalid when no error', () => {
        fixture.componentRef.setInput('error', '');
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-invalid')).toBe('false');
      });
    });

    describe('aria-required attribute', () => {
      it('should have aria-required="true" when required', () => {
        fixture.componentRef.setInput('required', true);
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-required')).toBe('true');
      });

      it('should not have aria-required when not required', () => {
        fixture.componentRef.setInput('required', false);
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-required')).toBe('false');
      });
    });

    describe('aria-describedby attribute', () => {
      it('should link to error message via aria-describedby', () => {
        fixture.componentRef.setInput('error', 'Error occurred');
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-describedby')).toBe('error-message');
      });

      it('should link to success message via aria-describedby', () => {
        fixture.componentRef.setInput('success', 'Looks good');
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-describedby')).toBe('success-message');
      });

      it('should link to hint message via aria-describedby', () => {
        fixture.componentRef.setInput('hint', 'Helpful hint');
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-describedby')).toBe('hint-message');
      });

      it('should not have aria-describedby when no messages', () => {
        fixture.componentRef.setInput('error', null);
        fixture.componentRef.setInput('success', null);
        fixture.componentRef.setInput('hint', null);
        fixture.detectChanges();

        expect(getInput().getAttribute('aria-describedby')).toBeFalsy();
      });
    });

    describe('required attribute', () => {
      it('should have required attribute when required', () => {
        fixture.componentRef.setInput('required', true);
        fixture.detectChanges();

        expect(getInput().required).toBe(true);
      });

      it('should not have required attribute when not required', () => {
        fixture.componentRef.setInput('required', false);
        fixture.detectChanges();

        expect(getInput().required).toBe(false);
      });

      it('should show required indicator on label', () => {
        fixture.componentRef.setInput('label', 'Email');
        fixture.componentRef.setInput('required', true);
        fixture.detectChanges();

        const label = getLabel();
        expect(label.classList.contains('required')).toBe(true);
      });
    });
  });

  describe('Input type variants', () => {
    it.each<[InputType]>([
      ['text'],
      ['email'],
      ['tel'],
      ['url'],
      ['search'],
      ['date'],
      ['number']
    ])('should set input type to "%s"', (type) => {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();

      expect(getInput().type).toBe(type);
    });

    it('should handle password type with visibility toggle', () => {
      fixture.componentRef.setInput('type', 'password');
      fixture.detectChanges();

      expect(getInput().type).toBe('password');
      expect(getPasswordToggle()).toBeTruthy();
    });
  });

  describe('Variant classes', () => {
    it.each<[InputVariant]>([['outlined'], ['filled']])(
      'should apply "%s" variant class',
      (variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const container = fixture.nativeElement.querySelector('.input-container');
        expect(container.classList.contains(variant)).toBe(true);
      }
    );

    it('should have outlined variant by default', () => {
      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('outlined')).toBe(true);
    });

    it.each<[InputVariant]>([['outlined'], ['filled']])(
      'should only have "%s" variant class and no other variant classes',
      (variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        const container = fixture.nativeElement.querySelector('.input-container');
        const otherVariants = ALL_VARIANTS.filter(v => v !== variant);
        otherVariants.forEach(otherVariant => {
          expect(container.classList.contains(otherVariant)).toBe(false);
        });
      }
    );
  });

  describe('Size classes', () => {
    it.each<[InputSize]>([['small'], ['large']])(
      'should apply "%s" size class',
      (size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        const container = fixture.nativeElement.querySelector('.input-container');
        expect(container.classList.contains(size)).toBe(true);
      }
    );

    it('should not have size class for medium (default)', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('small')).toBe(false);
      expect(container.classList.contains('large')).toBe(false);
    });
  });

  describe('Full width', () => {
    it('should not have full-width class by default', () => {
      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('full-width')).toBe(false);
    });

    it('should have full-width class when fullWidth is true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('full-width')).toBe(true);
    });
  });

  describe('Autocomplete suggestions', () => {
    const suggestions = ['Apple', 'Apricot', 'Banana', 'Blueberry'];

    beforeEach(() => {
      fixture.componentRef.setInput('suggestions', suggestions);
      fixture.componentRef.setInput('autocompleteConfig', { minLength: 1, debounceTime: 0 });
      fixture.detectChanges();
    });

    it('should not show suggestions initially', () => {
      expect(getSuggestionsList()).toBeFalsy();
    });

    it('should show suggestions list with role="listbox" when typing', fakeAsync(() => {
      const input = getInput();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      expect(getSuggestionsList()).toBeTruthy();
      expect(getSuggestionsList().getAttribute('role')).toBe('listbox');
    }));

    it('should show suggestion items with role="option"', fakeAsync(() => {
      const input = getInput();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      const options = getSuggestionOptions();
      expect(options.length).toBeGreaterThan(0);
      options.forEach(option => {
        expect(option.getAttribute('role')).toBe('option');
      });
    }));

    it('should filter suggestions based on input value', fakeAsync(() => {
      const input = getInput();
      input.value = 'ap';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      const options = getSuggestionOptions();
      expect(options.length).toBe(2);
      expect(options[0]?.textContent).toContain('Apple');
      expect(options[1]?.textContent).toContain('Apricot');
    }));

    it('should select suggestion on click', fakeAsync(() => {
      const suggestionSelectSpy = jest.fn();
      fixture.componentInstance.suggestionSelect.subscribe(suggestionSelectSpy);

      const input = getInput();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      const firstOption = getSuggestionOptions()[0];
      firstOption?.click();
      fixture.detectChanges();

      expect(suggestionSelectSpy).toHaveBeenCalledWith('Apple');
    }));

    it('should navigate suggestions with ArrowDown', fakeAsync(() => {
      const input = getInput();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      const options = getSuggestionOptions();
      expect(options[0]?.getAttribute('aria-selected')).toBe('true');
    }));

    it('should navigate suggestions with ArrowUp', fakeAsync(() => {
      const input = getInput();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      fixture.detectChanges();

      const options = getSuggestionOptions();
      expect(options[0]?.getAttribute('aria-selected')).toBe('true');
    }));

    it('should select highlighted suggestion with Enter', fakeAsync(() => {
      const suggestionSelectSpy = jest.fn();
      fixture.componentInstance.suggestionSelect.subscribe(suggestionSelectSpy);

      const input = getInput();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(suggestionSelectSpy).toHaveBeenCalledWith('Apple');
    }));

    it('should close suggestions with Escape', fakeAsync(() => {
      const input = getInput();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      expect(getSuggestionsList()).toBeTruthy();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(getSuggestionsList()).toBeFalsy();
    }));

    it('should close suggestions on blur after delay', (done) => {
      fixture.componentRef.setInput('suggestions', suggestions);
      fixture.componentRef.setInput('autocompleteConfig', { minLength: 1, debounceTime: 0 });
      fixture.detectChanges();

      const input = getInput();
      input.value = 'a';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));

      setTimeout(() => {
        fixture.detectChanges();
        expect(getSuggestionsList()).toBeTruthy();

        input.dispatchEvent(new FocusEvent('blur'));

        setTimeout(() => {
          fixture.detectChanges();
          expect(getSuggestionsList()).toBeFalsy();
          done();
        }, 250);
      }, 10);
    });

    it('should wrap around when navigating past last suggestion', fakeAsync(() => {
      fixture.componentRef.setInput('suggestions', ['One', 'Two']);
      fixture.detectChanges();

      const input = getInput();
      input.value = 'o';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      fixture.detectChanges();

      const options = getSuggestionOptions();
      expect(options[0]?.getAttribute('aria-selected')).toBe('true');
    }));
  });

  describe('Async suggestions', () => {
    it('should support async suggestion function', fakeAsync(() => {
      const asyncSuggestions = jest.fn().mockResolvedValue(['Result 1', 'Result 2']);
      fixture.componentRef.setInput('suggestions', asyncSuggestions);
      fixture.componentRef.setInput('autocompleteConfig', { minLength: 1, debounceTime: 0 });
      fixture.detectChanges();

      const input = getInput();
      input.value = 'test';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new FocusEvent('focus'));
      tick(0);
      fixture.detectChanges();

      tick(100);
      fixture.detectChanges();

      expect(asyncSuggestions).toHaveBeenCalledWith('test');
    }));
  });

  describe('State classes', () => {
    it('should apply error class when error is present', () => {
      fixture.componentRef.setInput('error', 'Error');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('error')).toBe(true);
    });

    it('should apply success class when success is present', () => {
      fixture.componentRef.setInput('success', 'Success');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('success')).toBe(true);
    });

    it('should apply disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('disabled')).toBe(true);
    });

    it('should apply readonly class when readonly', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('readonly')).toBe(true);
    });

    it('should apply loading class when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('loading')).toBe(true);
    });

    it('should apply focused class when focused', () => {
      getInput().dispatchEvent(new FocusEvent('focus'));
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('focused')).toBe(true);
    });
  });

  describe('Icon display', () => {
    it('should apply has-start-icon class when iconStart is set', () => {
      fixture.componentRef.setInput('iconStart', 'envelope');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('has-start-icon')).toBe(true);
    });

    it('should apply has-end-icon class when iconEnd is set', () => {
      fixture.componentRef.setInput('iconEnd', 'check');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('has-end-icon')).toBe(true);
    });

    it('should apply has-end-icon class for password type', () => {
      fixture.componentRef.setInput('type', 'password');
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('has-end-icon')).toBe(true);
    });

    it('should hide icons from screen readers', () => {
      fixture.componentRef.setInput('iconStart', 'envelope');
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('i[aria-hidden="true"]');
      expect(icon).toBeTruthy();
    });
  });

  describe('Combined states', () => {
    it('should handle disabled + error simultaneously', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();

      const input = getInput();
      expect(input.disabled).toBe(true);
      expect(input.getAttribute('data-state')).toBe('disabled');
      expect(getErrorMessage()).toBeTruthy();
    });

    it('should handle loading + fullWidth simultaneously', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      const container = fixture.nativeElement.querySelector('.input-container');
      expect(container.classList.contains('loading')).toBe(true);
      expect(container.classList.contains('full-width')).toBe(true);
      expect(getLoader()).toBeTruthy();
    });

    it('should return to default state when special states are cleared', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('error', 'Error');
      fixture.detectChanges();
      expect(getInput().getAttribute('data-state')).toBe('disabled');

      fixture.componentRef.setInput('disabled', false);
      fixture.componentRef.setInput('error', null);
      fixture.detectChanges();
      expect(getInput().getAttribute('data-state')).toBe('default');
    });
  });
});

describe('PshInputComponent with Reactive Forms', () => {
  let hostFixture: ComponentFixture<TestHostFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostFormComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostFormComponent);
    hostFixture.detectChanges();
  });

  const getInput = () =>
    hostFixture.nativeElement.querySelector('input') as HTMLInputElement;

  it('should update form control value on input', () => {
    const input = getInput();
    input.value = 'form value';
    input.dispatchEvent(new Event('input'));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.control.value).toBe('form value');
  });

  it('should update input value when form control changes', () => {
    hostFixture.componentInstance.control.setValue('programmatic value');
    hostFixture.detectChanges();

    expect(getInput().value).toBe('programmatic value');
  });

  it('should disable input when form control is disabled', () => {
    hostFixture.componentInstance.control.disable();
    hostFixture.detectChanges();

    expect(getInput().disabled).toBe(true);
  });

  it('should mark as touched on blur', () => {
    expect(hostFixture.componentInstance.control.touched).toBe(false);

    getInput().dispatchEvent(new FocusEvent('blur'));
    hostFixture.detectChanges();

    expect(hostFixture.componentInstance.control.touched).toBe(true);
  });
});
