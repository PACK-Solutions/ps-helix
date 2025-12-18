import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshAlertComponent } from './alert.component';
import { AlertType } from './alert.types';

describe('PshAlertComponent', () => {
  let fixture: ComponentFixture<PshAlertComponent>;

  const getAlertRegion = () =>
    fixture.nativeElement.querySelector('[role="alert"], [role="status"]') as HTMLElement;

  const getDismissButton = () =>
    fixture.nativeElement.querySelector('button[aria-label]') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshAlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshAlertComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render text content from input', () => {
      fixture.componentRef.setInput('content', 'Test alert message');
      fixture.detectChanges();

      expect(getAlertRegion().textContent).toContain('Test alert message');
    });

    it('should display decorative icon by default', () => {
      const icon = fixture.nativeElement.querySelector('[aria-hidden="true"]');
      expect(icon).toBeTruthy();
    });

    it('should hide icon when showIcon is false', () => {
      fixture.componentRef.setInput('showIcon', false);
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('[aria-hidden="true"]');
      expect(icon).toBeFalsy();
    });
  });

  describe('Dismiss behavior', () => {
    it('should not show dismiss button by default', () => {
      expect(getDismissButton()).toBeFalsy();
    });

    it('should show accessible dismiss button when closable', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const button = getDismissButton();
      expect(button).toBeTruthy();
      expect(button.getAttribute('type')).toBe('button');
      expect(button.getAttribute('aria-label')).toBe('Dismiss alert');
    });

    it('should emit closed event on button click', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const closedSpy = jest.fn();
      fixture.componentInstance.closed.subscribe(closedSpy);

      getDismissButton().click();

      expect(closedSpy).toHaveBeenCalledTimes(1);
    });

    it('should support custom dismiss label', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.componentRef.setInput('dismissLabel', 'Fermer');
      fixture.detectChanges();

      expect(getDismissButton().getAttribute('aria-label')).toBe('Fermer');
    });
  });

  describe('Accessibility', () => {
    describe('role attribute', () => {
      it.each<[AlertType, string]>([
        ['info', 'status'],
        ['success', 'status'],
        ['warning', 'alert'],
        ['danger', 'alert']
      ])('type "%s" should have role="%s"', (type, expectedRole) => {
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('role')).toBe(expectedRole);
      });

      it('should allow overriding role', () => {
        fixture.componentRef.setInput('type', 'info');
        fixture.componentRef.setInput('role', 'alert');
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('role')).toBe('alert');
      });
    });

    describe('aria-live attribute', () => {
      it.each<[AlertType, string]>([
        ['info', 'polite'],
        ['success', 'polite'],
        ['warning', 'assertive'],
        ['danger', 'assertive']
      ])('type "%s" should have aria-live="%s"', (type, expectedLive) => {
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('aria-live')).toBe(expectedLive);
      });

      it('should allow overriding aria-live', () => {
        fixture.componentRef.setInput('type', 'info');
        fixture.componentRef.setInput('ariaLive', 'assertive');
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('aria-live')).toBe('assertive');
      });
    });

    describe('aria-label attribute', () => {
      it('should not have aria-label by default', () => {
        expect(getAlertRegion().getAttribute('aria-label')).toBeFalsy();
      });

      it('should apply custom aria-label when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Important notification');
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('aria-label')).toBe('Important notification');
      });
    });
  });

  describe('data-state attribute', () => {
    it.each<[AlertType]>([['info'], ['success'], ['warning'], ['danger']])(
      'should have data-state="%s" for type "%s" when not closable',
      (type) => {
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();

        expect(getAlertRegion().getAttribute('data-state')).toBe(type);
      }
    );

    it('should have data-state="closable" when closable is true', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      expect(getAlertRegion().getAttribute('data-state')).toBe('closable');
    });
  });
});
