import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { PshTextareaComponent } from './textarea.component';

@Component({
  template: `<psh-textarea [formControl]="control"></psh-textarea>`,
  imports: [PshTextareaComponent, ReactiveFormsModule],
})
class TestHostFormComponent {
  control = new FormControl('', { nonNullable: true });
}

@Component({
  template: `
    <psh-textarea [formControl]="control" [required]="true"></psh-textarea>
  `,
  imports: [PshTextareaComponent, ReactiveFormsModule],
})
class TestHostRequiredFormComponent {
  control = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required],
  });
}

describe('PshTextareaComponent', () => {
  let fixture: ComponentFixture<PshTextareaComponent>;

  const getTextarea = () =>
    fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

  const getLabel = () =>
    fixture.nativeElement.querySelector('label') as HTMLLabelElement;

  const getHost = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshTextareaComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PshTextareaComponent);
    fixture.detectChanges();
  });

  describe('Basic rendering', () => {
    it('should render a textarea element', () => {
      expect(getTextarea()).toBeTruthy();
    });

    it('should render the label when provided', () => {
      fixture.componentRef.setInput('label', 'Description');
      fixture.detectChanges();
      expect(getLabel().textContent).toContain('Description');
    });

    it('should set rows attribute', () => {
      fixture.componentRef.setInput('rows', 8);
      fixture.detectChanges();
      expect(getTextarea().rows).toBe(8);
    });

    it('should set placeholder', () => {
      fixture.componentRef.setInput('placeholder', 'Type here...');
      fixture.detectChanges();
      expect(getTextarea().getAttribute('placeholder')).toBe('Type here...');
    });

    it('should apply maxlength attribute', () => {
      fixture.componentRef.setInput('maxLength', 120);
      fixture.detectChanges();
      expect(getTextarea().getAttribute('maxlength')).toBe('120');
    });
  });

  describe('Value binding (CVA)', () => {
    it('should update value on input event', () => {
      const textarea = getTextarea();
      textarea.value = 'hello';
      textarea.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      expect(fixture.componentInstance.value()).toBe('hello');
    });

    it('should reflect writeValue on the textarea', () => {
      fixture.componentInstance.writeValue('from outside');
      fixture.detectChanges();
      expect(getTextarea().value).toBe('from outside');
    });

    it('should coerce non-string writeValue to empty string', () => {
      fixture.componentInstance.writeValue(null);
      expect(fixture.componentInstance.value()).toBe('');
    });
  });

  describe('Disabled & readonly', () => {
    it('should disable textarea via setDisabledState', () => {
      fixture.componentInstance.setDisabledState(true);
      fixture.detectChanges();
      expect(getTextarea().disabled).toBe(true);
      expect(getHost().classList).toContain('disabled');
    });

    it('should mark textarea as readonly', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.detectChanges();
      expect(getTextarea().readOnly).toBe(true);
      expect(getHost().classList).toContain('readonly');
    });
  });

  describe('Touched & blur', () => {
    it('should mark as touched on blur', () => {
      getTextarea().dispatchEvent(new Event('blur'));
      fixture.detectChanges();
      expect(fixture.componentInstance.touched()).toBe(true);
    });

    it('should emit inputBlur on blur', () => {
      const spy = jest.fn();
      fixture.componentInstance.inputBlur.subscribe(spy);
      getTextarea().dispatchEvent(new Event('blur'));
      expect(spy).toHaveBeenCalled();
    });

    it('should emit inputFocus on focus', () => {
      const spy = jest.fn();
      fixture.componentInstance.inputFocus.subscribe(spy);
      getTextarea().dispatchEvent(new Event('focus'));
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('Variants & sizes', () => {
    it('should apply outlined variant class by default', () => {
      expect(getHost().classList).toContain('outlined');
    });

    it('should apply filled variant class', () => {
      fixture.componentRef.setInput('variant', 'filled');
      fixture.detectChanges();
      expect(getHost().classList).toContain('filled');
    });

    it('should apply small size class', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(getHost().classList).toContain('small');
    });

    it('should apply large size class', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(getHost().classList).toContain('large');
    });

    it('should apply full-width class', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();
      expect(getHost().classList).toContain('full-width');
    });
  });

  describe('Resize & autoSize', () => {
    it('should apply resize style by default', () => {
      expect(getTextarea().style.resize).toBe('vertical');
    });

    it('should force resize to none when autoSize is enabled', () => {
      fixture.componentRef.setInput('autoSize', true);
      fixture.detectChanges();
      expect(fixture.componentInstance.effectiveResize()).toBe('none');
      expect(getHost().classList).toContain('auto-size');
    });
  });

  describe('Character counter', () => {
    it('should not display counter by default', () => {
      expect(fixture.nativeElement.querySelector('.textarea-count')).toBeNull();
    });

    it('should display counter when showCharacterCount is true', () => {
      fixture.componentRef.setInput('showCharacterCount', true);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.textarea-count')).toBeTruthy();
    });

    it('should display counter when maxLength is set', () => {
      fixture.componentRef.setInput('maxLength', 10);
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.textarea-count')).toBeTruthy();
    });

    it('should mark over-limit when exceeding maxLength via writeValue', () => {
      fixture.componentRef.setInput('maxLength', 5);
      fixture.componentInstance.writeValue('too long');
      fixture.detectChanges();
      expect(fixture.componentInstance.isOverLimit()).toBe(true);
      expect(getHost().classList).toContain('over-limit');
    });
  });

  describe('Messages & accessibility', () => {
    it('should render error message with role="alert"', () => {
      fixture.componentRef.setInput('error', 'Required');
      fixture.detectChanges();
      const alert = fixture.nativeElement.querySelector('[role="alert"]');
      expect(alert.textContent.trim()).toBe('Required');
      expect(getTextarea().getAttribute('aria-invalid')).toBe('true');
    });

    it('should render success message with role="status"', () => {
      fixture.componentRef.setInput('success', 'Looks good');
      fixture.detectChanges();
      const status = fixture.nativeElement.querySelector('[role="status"]');
      expect(status.textContent.trim()).toBe('Looks good');
    });

    it('should render hint message', () => {
      fixture.componentRef.setInput('hint', 'A useful hint');
      fixture.detectChanges();
      const hint = fixture.nativeElement.querySelector('.textarea-hint');
      expect(hint.textContent.trim()).toBe('A useful hint');
    });

    it('should set aria-describedby when messages are present', () => {
      fixture.componentRef.setInput('hint', 'Some hint');
      fixture.detectChanges();
      const describedBy = getTextarea().getAttribute('aria-describedby');
      expect(describedBy).toContain('-hint');
    });

    it('should set aria-required when required is true', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();
      expect(getTextarea().getAttribute('aria-required')).toBe('true');
    });
  });

  describe('Reactive Forms integration', () => {
    it('should bind value via FormControl', () => {
      const host = TestBed.createComponent(TestHostFormComponent);
      host.detectChanges();

      host.componentInstance.control.setValue('from form');
      host.detectChanges();

      const textarea = host.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
      expect(textarea.value).toBe('from form');
    });

    it('should reflect invalid+touched state from NgControl', () => {
      const host = TestBed.createComponent(TestHostRequiredFormComponent);
      host.detectChanges();

      const textarea = host.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
      textarea.dispatchEvent(new Event('blur'));
      host.detectChanges();

      const hostEl = host.nativeElement.querySelector('psh-textarea') as HTMLElement;
      expect(hostEl.classList).toContain('error');
    });
  });

  describe('FormValueControl (Signal Forms)', () => {
    it('should expose value as a writable signal model', () => {
      fixture.componentInstance.value.set('signal value');
      expect(fixture.componentInstance.value()).toBe('signal value');
    });
  });
});
