import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshAlertComponent } from './alert.component';
import { By } from '@angular/platform-browser';
import { AlertType } from './alert.types';

describe('PshAlertComponent', () => {
  let component: PshAlertComponent;
  let fixture: ComponentFixture<PshAlertComponent>;

  const getAlert = () => fixture.debugElement.query(By.css('.alert'));
  const getDismissButton = () => fixture.debugElement.query(By.css('.alert-dismiss'));
  const getMessage = () => fixture.debugElement.query(By.css('.alert-message'));
  const getIcon = () => fixture.debugElement.query(By.css('[aria-hidden="true"]'));

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshAlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render alert container', () => {
      expect(getAlert()).toBeTruthy();
    });

    it('should display content from input', () => {
      fixture.componentRef.setInput('content', 'Test alert message');
      fixture.detectChanges();

      expect(getMessage().nativeElement.textContent).toContain('Test alert message');
    });

    it('should display icon by default', () => {
      expect(getIcon()).toBeTruthy();
    });

    it('should hide icon when showIcon is false', () => {
      fixture.componentRef.setInput('showIcon', false);
      fixture.detectChanges();

      expect(getIcon()).toBeFalsy();
    });
  });

  describe('Closable behavior', () => {
    it('should not show dismiss button by default', () => {
      expect(getDismissButton()).toBeFalsy();
    });

    it('should show dismiss button when closable is true', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      expect(getDismissButton()).toBeTruthy();
    });

    it('should emit closed event when dismiss button is clicked', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const closedSpy = jest.fn();
      component.closed.subscribe(closedSpy);

      getDismissButton().nativeElement.click();

      expect(closedSpy).toHaveBeenCalled();
    });

    it('should have type="button" on dismiss button', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      expect(getDismissButton().attributes['type']).toBe('button');
    });

    it('should have default aria-label on dismiss button', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      expect(getDismissButton().attributes['aria-label']).toBe('Dismiss alert');
    });

    it('should use custom dismissLabel when provided', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.componentRef.setInput('dismissLabel', 'Fermer');
      fixture.detectChanges();

      expect(getDismissButton().attributes['aria-label']).toBe('Fermer');
    });
  });

  describe('Accessibility - aria-live', () => {
    it.each<[AlertType, string]>([
      ['info', 'polite'],
      ['success', 'polite'],
      ['warning', 'assertive'],
      ['danger', 'assertive']
    ])('type "%s" should have aria-live="%s"', (type, expected) => {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();

      expect(getAlert().attributes['aria-live']).toBe(expected);
    });

    it('should allow overriding aria-live', () => {
      fixture.componentRef.setInput('type', 'info');
      fixture.componentRef.setInput('ariaLive', 'assertive');
      fixture.detectChanges();

      expect(getAlert().attributes['aria-live']).toBe('assertive');
    });
  });

  describe('Accessibility - role', () => {
    it.each<[AlertType, string]>([
      ['info', 'status'],
      ['success', 'status'],
      ['warning', 'alert'],
      ['danger', 'alert']
    ])('type "%s" should have role="%s" by default', (type, expected) => {
      fixture.componentRef.setInput('type', type);
      fixture.detectChanges();

      expect(getAlert().attributes['role']).toBe(expected);
    });

    it('should allow overriding role', () => {
      fixture.componentRef.setInput('type', 'info');
      fixture.componentRef.setInput('role', 'alert');
      fixture.detectChanges();

      expect(getAlert().attributes['role']).toBe('alert');
    });
  });

  describe('Accessibility - aria-label', () => {
    it('should not have aria-label by default', () => {
      expect(getAlert().attributes['aria-label']).toBeFalsy();
    });

    it('should apply custom aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Important notification');
      fixture.detectChanges();

      expect(getAlert().attributes['aria-label']).toBe('Important notification');
    });
  });

  describe('Accessibility - icon', () => {
    it('should hide icon from assistive technologies', () => {
      const icon = getIcon();
      expect(icon.attributes['aria-hidden']).toBe('true');
    });
  });

  describe('CSS Contract - data-state', () => {
    it('should reflect type in data-state when not closable', () => {
      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();

      expect(getAlert().attributes['data-state']).toBe('danger');
    });

    it('should have data-state="closable" when closable', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      expect(getAlert().attributes['data-state']).toBe('closable');
    });
  });

  describe('CSS Contract - type class', () => {
    it.each<AlertType>(['info', 'success', 'warning', 'danger'])(
      'should apply "%s" class for type',
      (type) => {
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();

        expect(getAlert().classes[type]).toBe(true);
      }
    );
  });

  describe('CSS Contract - size class', () => {
    it('should not apply size class for medium (default)', () => {
      expect(getAlert().classes['small']).toBeFalsy();
      expect(getAlert().classes['large']).toBeFalsy();
    });

    it('should apply small class when size is small', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      expect(getAlert().classes['small']).toBe(true);
    });

    it('should apply large class when size is large', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      expect(getAlert().classes['large']).toBe(true);
    });
  });

  describe('CSS Contract - icon position', () => {
    it('should not have icon-right class by default', () => {
      const content = fixture.debugElement.query(By.css('.alert-content'));
      expect(content.classes['icon-right']).toBeFalsy();
    });

    it('should apply icon-right class when iconPosition is right', () => {
      fixture.componentRef.setInput('iconPosition', 'right');
      fixture.detectChanges();

      const content = fixture.debugElement.query(By.css('.alert-content'));
      expect(content.classes['icon-right']).toBe(true);
    });
  });
});
