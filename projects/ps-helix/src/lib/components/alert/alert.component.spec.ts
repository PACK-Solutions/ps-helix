import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshAlertComponent } from './alert.component';
import { By } from '@angular/platform-browser';

describe('PshAlertComponent', () => {
  let component: PshAlertComponent;
  let fixture: ComponentFixture<PshAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshAlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initial Rendering', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render with default props', () => {
      expect(component.type()).toBe('info');
      expect(component.size()).toBe('medium');
      expect(component.closable()).toBeFalse();
      expect(component.showIcon()).toBeTrue();
      expect(component.iconPosition()).toBe('left');
      expect(component.role()).toBe('alert');
    });

    it('should render alert container with correct base class', () => {
      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement).toBeTruthy();
    });

    it('should display content from content input', () => {
      fixture.componentRef.setInput('content', 'Test alert message');
      fixture.detectChanges();

      const messageElement = fixture.debugElement.query(By.css('.alert-message'));
      expect(messageElement.nativeElement.textContent).toContain('Test alert message');
    });
  });

  describe('Alert Types', () => {
    it('should apply info class by default', () => {
      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.classes['info']).toBeTrue();
    });

    it('should apply success class when type is success', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.classes['success']).toBeTrue();
    });

    it('should apply warning class when type is warning', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.classes['warning']).toBeTrue();
    });

    it('should apply danger class when type is danger', () => {
      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.classes['danger']).toBeTrue();
    });

    it('should display info icon for info type', () => {
      const icon = fixture.debugElement.query(By.css('i.ph'));
      expect(icon.classes['ph-info']).toBeTrue();
    });

    it('should display check-circle icon for success type', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('i.ph'));
      expect(icon.classes['ph-check-circle']).toBeTrue();
    });

    it('should display warning icon for warning type', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('i.ph'));
      expect(icon.classes['ph-warning']).toBeTrue();
    });

    it('should display warning-octagon icon for danger type', () => {
      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('i.ph'));
      expect(icon.classes['ph-warning-octagon']).toBeTrue();
    });
  });

  describe('Sizes', () => {
    it('should not have size class for medium (default)', () => {
      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.classes['small']).toBeFalsy();
      expect(alertElement.classes['large']).toBeFalsy();
    });

    it('should apply small class when size is small', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.classes['small']).toBeTrue();
    });

    it('should apply large class when size is large', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.classes['large']).toBeTrue();
    });
  });

  describe('Icon', () => {
    it('should display icon when showIcon is true', () => {
      const icon = fixture.debugElement.query(By.css('i.ph'));
      expect(icon).toBeTruthy();
    });

    it('should hide icon when showIcon is false', () => {
      fixture.componentRef.setInput('showIcon', false);
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('i.ph'));
      expect(icon).toBeFalsy();
    });

    it('should use custom icon when provided', () => {
      fixture.componentRef.setInput('icon', 'star');
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('i.ph'));
      expect(icon.classes['ph-star']).toBeTrue();
    });

    it('should position icon on left by default', () => {
      const content = fixture.debugElement.query(By.css('.alert-content'));
      expect(content.classes['icon-right']).toBeFalsy();
    });

    it('should position icon on right when iconPosition is right', () => {
      fixture.componentRef.setInput('iconPosition', 'right');
      fixture.detectChanges();

      const content = fixture.debugElement.query(By.css('.alert-content'));
      expect(content.classes['icon-right']).toBeTrue();
    });

    it('should have aria-hidden on icon', () => {
      const icon = fixture.debugElement.query(By.css('i.ph'));
      expect(icon.attributes['aria-hidden']).toBe('true');
    });
  });

  describe('Closable', () => {
    it('should not display dismiss button when closable is false', () => {
      const dismissButton = fixture.debugElement.query(By.css('.alert-dismiss'));
      expect(dismissButton).toBeFalsy();
    });

    it('should display dismiss button when closable is true', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const dismissButton = fixture.debugElement.query(By.css('.alert-dismiss'));
      expect(dismissButton).toBeTruthy();
    });

    it('should emit closed event when dismiss button is clicked', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      spyOn(component.closed, 'emit');

      const dismissButton = fixture.debugElement.query(By.css('.alert-dismiss'));
      dismissButton.nativeElement.click();
      fixture.detectChanges();

      expect(component.closed.emit).toHaveBeenCalled();
    });

    it('should use default dismiss label', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const dismissButton = fixture.debugElement.query(By.css('.alert-dismiss'));
      expect(dismissButton.attributes['aria-label']).toBe('Dismiss alert');
    });

    it('should use custom dismiss label when provided', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.componentRef.setInput('dismissLabel', 'Close this alert');
      fixture.detectChanges();

      const dismissButton = fixture.debugElement.query(By.css('.alert-dismiss'));
      expect(dismissButton.attributes['aria-label']).toBe('Close this alert');
    });

    it('should have type button on dismiss button', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const dismissButton = fixture.debugElement.query(By.css('.alert-dismiss'));
      expect(dismissButton.attributes['type']).toBe('button');
    });
  });

  describe('Accessibility', () => {
    it('should have role status for info type', () => {
      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['role']).toBe('status');
    });

    it('should have role status for success type', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['role']).toBe('status');
    });

    it('should have role alert for warning type', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['role']).toBe('alert');
    });

    it('should have role alert for danger type', () => {
      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['role']).toBe('alert');
    });

    it('should have aria-live polite for info type', () => {
      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['aria-live']).toBe('polite');
    });

    it('should have aria-live polite for success type', () => {
      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['aria-live']).toBe('polite');
    });

    it('should have aria-live assertive for warning type', () => {
      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['aria-live']).toBe('assertive');
    });

    it('should have aria-live assertive for danger type', () => {
      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['aria-live']).toBe('assertive');
    });

    it('should apply custom ariaLabel when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Important notification');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['aria-label']).toBe('Important notification');
    });

    it('should override aria-live when explicitly set', () => {
      fixture.componentRef.setInput('ariaLive', 'assertive');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['aria-live']).toBe('assertive');
    });

    it('should set aria-describedby when ariaLabel is provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Test label');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['aria-describedby']).toBe('alert-label');
    });
  });

  describe('Data State', () => {
    it('should have data-state matching type for non-closable alerts', () => {
      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['data-state']).toBe('info');
    });

    it('should have data-state closable when alert is closable', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['data-state']).toBe('closable');
    });

    it('should update data-state when type changes', () => {
      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();

      const alertElement = fixture.debugElement.query(By.css('.alert'));
      expect(alertElement.attributes['data-state']).toBe('danger');
    });
  });

  describe('Computed Values', () => {
    it('should return correct default icon for each type', () => {
      expect(component.defaultIcon()).toBe('info');

      fixture.componentRef.setInput('type', 'success');
      fixture.detectChanges();
      expect(component.defaultIcon()).toBe('check-circle');

      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();
      expect(component.defaultIcon()).toBe('warning');

      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();
      expect(component.defaultIcon()).toBe('warning-octagon');
    });

    it('should return custom icon when provided via getIcon', () => {
      fixture.componentRef.setInput('icon', 'bell');
      fixture.detectChanges();

      expect(component.getIcon()).toBe('bell');
    });

    it('should return default icon when no custom icon via getIcon', () => {
      expect(component.getIcon()).toBe('info');
    });

    it('should compute correct role based on type', () => {
      expect(component.computedRole()).toBe('status');

      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();
      expect(component.computedRole()).toBe('alert');

      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();
      expect(component.computedRole()).toBe('alert');
    });

    it('should compute correct ariaLive based on type', () => {
      expect(component.computedAriaLive()).toBe('polite');

      fixture.componentRef.setInput('type', 'warning');
      fixture.detectChanges();
      expect(component.computedAriaLive()).toBe('assertive');
    });

    it('should return closable state when closable is true', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      expect(component.state()).toBe('closable');
    });

    it('should return type as state when not closable', () => {
      expect(component.state()).toBe('info');

      fixture.componentRef.setInput('type', 'danger');
      fixture.detectChanges();
      expect(component.state()).toBe('danger');
    });
  });

  describe('handleClose', () => {
    it('should emit closed event when handleClose is called', () => {
      spyOn(component.closed, 'emit');

      component.handleClose();

      expect(component.closed.emit).toHaveBeenCalled();
    });
  });
});
