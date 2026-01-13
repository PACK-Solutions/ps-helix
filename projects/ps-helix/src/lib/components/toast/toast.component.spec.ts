import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshToastComponent } from './toast.component';
import { PshToastService } from './toast.service';
import { TOAST_CONFIG } from './toast.tokens';
import { ToastConfig, ToastPosition, ToastType } from './toast.types';

describe('PshToastComponent', () => {
  let fixture: ComponentFixture<PshToastComponent>;
  let toastService: PshToastService;

  const defaultConfig: Partial<ToastConfig> = {
    position: 'top-right',
    duration: 5000,
    maxToasts: 5,
    pauseOnHover: true,
    showIcon: true,
    showCloseButton: true
  };

  const getToastContainer = () =>
    fixture.nativeElement.querySelector('[role="region"]') as HTMLElement;

  const getToastItems = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="alert"]')) as HTMLElement[];

  const getCloseButton = (toast: HTMLElement) =>
    toast.querySelector('button[aria-label]') as HTMLButtonElement | null;

  const getToastContent = (toast: HTMLElement) =>
    toast.querySelector('.toast-content')?.textContent?.trim() ?? '';

  const createTestModule = (config: Partial<ToastConfig> = defaultConfig) => {
    return TestBed.configureTestingModule({
      imports: [PshToastComponent],
      providers: [
        { provide: TOAST_CONFIG, useValue: config }
      ]
    }).compileComponents();
  };

  beforeEach(async () => {
    await createTestModule();
    fixture = TestBed.createComponent(PshToastComponent);
    toastService = TestBed.inject(PshToastService);
    fixture.detectChanges();
  });

  afterEach(() => {
    toastService['_toasts'].set([]);
  });

  describe('Content rendering', () => {
    it('should render toast message when service.show() is called', () => {
      toastService.show({ message: 'Test notification', type: 'info' });
      fixture.detectChanges();

      const toasts = getToastItems();
      expect(toasts.length).toBe(1);
      expect(getToastContent(toasts[0]!)).toBe('Test notification');
    });

    it('should display decorative icon by default', () => {
      toastService.show({ message: 'Test message', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      const icon = toast.querySelector('[aria-hidden="true"]');
      expect(icon).toBeTruthy();
    });

    it('should hide icon when config.showIcon is false', async () => {
      await TestBed.resetTestingModule();
      await createTestModule({ ...defaultConfig, showIcon: false });
      fixture = TestBed.createComponent(PshToastComponent);
      toastService = TestBed.inject(PshToastService);
      fixture.detectChanges();

      toastService.show({ message: 'Test message', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      const icons = toast.querySelectorAll('[aria-hidden="true"]');
      const closeButtonIcon = toast.querySelector('button [aria-hidden="true"]');
      const toastIcon = Array.from(icons).find(icon => icon !== closeButtonIcon);
      expect(toastIcon).toBeFalsy();
    });

    it('should show close button by default', () => {
      toastService.show({ message: 'Test message', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      expect(getCloseButton(toast)).toBeTruthy();
    });

    it('should hide close button when config.showCloseButton is false', async () => {
      await TestBed.resetTestingModule();
      await createTestModule({ ...defaultConfig, showCloseButton: false });
      fixture = TestBed.createComponent(PshToastComponent);
      toastService = TestBed.inject(PshToastService);
      fixture.detectChanges();

      toastService.show({ message: 'Test message', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      expect(getCloseButton(toast)).toBeFalsy();
    });

    it('should hide close button when toast.showCloseButton is false', () => {
      toastService.show({ message: 'Test message', type: 'info', showCloseButton: false });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      expect(getCloseButton(toast)).toBeFalsy();
    });
  });

  describe('Toast type variants', () => {
    it.each<[ToastType]>([
      ['info'],
      ['success'],
      ['warning'],
      ['danger']
    ])('should render toast with type "%s"', (type) => {
      toastService.show({ message: `${type} message`, type });
      fixture.detectChanges();

      const toasts = getToastItems();
      expect(toasts.length).toBe(1);
      expect(getToastContent(toasts[0]!)).toBe(`${type} message`);
    });
  });

  describe('Accessibility', () => {
    it('should have container with role="region"', () => {
      expect(getToastContainer().getAttribute('role')).toBe('region');
    });

    it('should have container with aria-label="Notifications"', () => {
      expect(getToastContainer().getAttribute('aria-label')).toBe('Notifications');
    });

    it('should have toast items with role="alert"', () => {
      toastService.show({ message: 'Test', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      expect(toast.getAttribute('role')).toBe('alert');
    });

    it('should have toast items with aria-live="polite"', () => {
      toastService.show({ message: 'Test', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      expect(toast.getAttribute('aria-live')).toBe('polite');
    });

    it('should have toast items with aria-atomic="true"', () => {
      toastService.show({ message: 'Test', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      expect(toast.getAttribute('aria-atomic')).toBe('true');
    });

    it('should have close button with accessible aria-label', () => {
      toastService.show({ message: 'Test', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      const closeButton = getCloseButton(toast);
      expect(closeButton?.getAttribute('aria-label')).toBe('Close notification');
    });

    it('should support custom closeButtonAriaLabel from toast', () => {
      toastService.show({ message: 'Test', type: 'info', closeButtonAriaLabel: 'Fermer' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      const closeButton = getCloseButton(toast);
      expect(closeButton?.getAttribute('aria-label')).toBe('Fermer');
    });

    it('should support custom closeButtonAriaLabel from config', async () => {
      await TestBed.resetTestingModule();
      await createTestModule({ ...defaultConfig, closeButtonAriaLabel: 'Dismiss' });
      fixture = TestBed.createComponent(PshToastComponent);
      toastService = TestBed.inject(PshToastService);
      fixture.detectChanges();

      toastService.show({ message: 'Test', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      const closeButton = getCloseButton(toast);
      expect(closeButton?.getAttribute('aria-label')).toBe('Dismiss');
    });

    it('should have close button with type="button"', () => {
      toastService.show({ message: 'Test', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      const closeButton = getCloseButton(toast);
      expect(closeButton?.getAttribute('type')).toBe('button');
    });

    it('should have icon with aria-hidden="true"', () => {
      toastService.show({ message: 'Test', type: 'info' });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      const icon = toast.querySelector('.toast-icon');
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Dismiss behavior', () => {
    it('should remove toast when close button is clicked', () => {
      toastService.show({ message: 'Test', type: 'info' });
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);

      const toast = getToastItems()[0]!;
      getCloseButton(toast)?.click();
      fixture.detectChanges();

      expect(getToastItems().length).toBe(0);
    });

    it('should dismiss most recent toast on Escape key', () => {
      toastService.show({ message: 'First', type: 'info' });
      toastService.show({ message: 'Second', type: 'success' });
      fixture.detectChanges();

      expect(getToastItems().length).toBe(2);

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      fixture.detectChanges();

      const toasts = getToastItems();
      expect(toasts.length).toBe(1);
      expect(getToastContent(toasts[0]!)).toBe('First');
    });

    it('should have no effect when Escape is pressed with no toasts', () => {
      expect(getToastItems().length).toBe(0);

      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);
      fixture.detectChanges();

      expect(getToastItems().length).toBe(0);
    });

    it('should auto-dismiss toast after duration', () => {
      jest.useFakeTimers();

      toastService.show({ message: 'Test', type: 'info', duration: 3000 });
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);

      jest.advanceTimersByTime(3000);
      fixture.detectChanges();

      expect(getToastItems().length).toBe(0);

      jest.useRealTimers();
    });

    it('should not auto-dismiss toast when duration is 0', () => {
      jest.useFakeTimers();

      toastService.show({ message: 'Test', type: 'info', duration: 0 });
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);

      jest.advanceTimersByTime(10000);
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);

      jest.useRealTimers();
    });
  });

  describe('Pause on hover', () => {
    it('should pause auto-dismiss on mouseenter', () => {
      jest.useFakeTimers();

      toastService.show({ message: 'Test', type: 'info', duration: 3000 });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      toast.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      jest.advanceTimersByTime(5000);
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);

      jest.useRealTimers();
    });

    it('should resume auto-dismiss on mouseleave', () => {
      jest.useFakeTimers();

      toastService.show({ message: 'Test', type: 'info', duration: 3000 });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      toast.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      jest.advanceTimersByTime(2000);

      toast.dispatchEvent(new MouseEvent('mouseleave'));
      fixture.detectChanges();

      jest.advanceTimersByTime(3000);
      fixture.detectChanges();

      expect(getToastItems().length).toBe(0);

      jest.useRealTimers();
    });

    it('should not pause when pauseOnHover is false', async () => {
      jest.useFakeTimers();

      await TestBed.resetTestingModule();
      await createTestModule({ ...defaultConfig, pauseOnHover: false });
      fixture = TestBed.createComponent(PshToastComponent);
      toastService = TestBed.inject(PshToastService);
      fixture.detectChanges();

      toastService.show({ message: 'Test', type: 'info', duration: 3000 });
      fixture.detectChanges();

      const toast = getToastItems()[0]!;
      toast.dispatchEvent(new MouseEvent('mouseenter'));
      fixture.detectChanges();

      jest.advanceTimersByTime(3000);
      fixture.detectChanges();

      expect(getToastItems().length).toBe(0);

      jest.useRealTimers();
    });
  });

  describe('Position variants', () => {
    it.each<[ToastPosition]>([
      ['top-right'],
      ['top-left'],
      ['bottom-right'],
      ['bottom-left']
    ])('should apply position class "%s"', (position) => {
      toastService.setPosition(position);
      fixture.detectChanges();

      const container = getToastContainer();
      expect(container.classList.contains(position)).toBe(true);
    });
  });

  describe('Service integration', () => {
    it('should display toast from show()', () => {
      toastService.show({ message: 'Show test', type: 'info' });
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);
      expect(getToastContent(getToastItems()[0]!)).toBe('Show test');
    });

    it('should remove toast from remove()', () => {
      const id = toastService.show({ message: 'Test', type: 'info' });
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);

      toastService.remove(id);
      fixture.detectChanges();

      expect(getToastItems().length).toBe(0);
    });

    it('should display info toast from info()', () => {
      toastService.info('Info message');
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);
      expect(getToastContent(getToastItems()[0]!)).toBe('Info message');
    });

    it('should display success toast from success()', () => {
      toastService.success('Success message');
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);
      expect(getToastContent(getToastItems()[0]!)).toBe('Success message');
    });

    it('should display warning toast from warning()', () => {
      toastService.warning('Warning message');
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);
      expect(getToastContent(getToastItems()[0]!)).toBe('Warning message');
    });

    it('should display danger toast from error()', () => {
      toastService.error('Error message');
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);
      expect(getToastContent(getToastItems()[0]!)).toBe('Error message');
    });

    it('should display danger toast from danger()', () => {
      toastService.danger('Danger message');
      fixture.detectChanges();

      expect(getToastItems().length).toBe(1);
      expect(getToastContent(getToastItems()[0]!)).toBe('Danger message');
    });

    it('should respect maxToasts limit', () => {
      for (let i = 1; i <= 7; i++) {
        toastService.show({ message: `Toast ${i}`, type: 'info' });
      }
      fixture.detectChanges();

      const toasts = getToastItems();
      expect(toasts.length).toBe(5);
      expect(getToastContent(toasts[0]!)).toBe('Toast 3');
      expect(getToastContent(toasts[4]!)).toBe('Toast 7');
    });
  });

  describe('Multiple toasts', () => {
    it('should render multiple toasts simultaneously', () => {
      toastService.show({ message: 'First', type: 'info' });
      toastService.show({ message: 'Second', type: 'success' });
      toastService.show({ message: 'Third', type: 'warning' });
      fixture.detectChanges();

      expect(getToastItems().length).toBe(3);
    });

    it('should render each toast with unique content', () => {
      toastService.show({ message: 'First', type: 'info' });
      toastService.show({ message: 'Second', type: 'success' });
      fixture.detectChanges();

      const toasts = getToastItems();
      const contents = toasts.map(t => getToastContent(t));
      expect(contents).toContain('First');
      expect(contents).toContain('Second');
    });

    it('should dismiss toasts independently', () => {
      toastService.show({ message: 'First', type: 'info' });
      const secondId = toastService.show({ message: 'Second', type: 'success' });
      toastService.show({ message: 'Third', type: 'warning' });
      fixture.detectChanges();

      toastService.remove(secondId);
      fixture.detectChanges();

      const toasts = getToastItems();
      expect(toasts.length).toBe(2);
      const contents = toasts.map(t => getToastContent(t));
      expect(contents).toContain('First');
      expect(contents).toContain('Third');
      expect(contents).not.toContain('Second');
    });
  });
});
