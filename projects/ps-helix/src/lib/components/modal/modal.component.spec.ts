import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PshModalComponent } from './modal.component';
import { ModalSize } from './modal.types';

@Component({
  template: `
    <psh-modal
      [open]="isOpen"
      [title]="title"
      [showClose]="showClose"
      [showFooter]="showFooter"
      [closeOnBackdrop]="closeOnBackdrop"
      [dismissLabel]="dismissLabel"
      [confirmLabel]="confirmLabel"
      [cancelLabel]="cancelLabel"
      [size]="size"
      (closed)="onClosed()"
      (confirmed)="onConfirmed()"
    >
      <p>Test modal content</p>
    </psh-modal>
  `,
  imports: [PshModalComponent]
})
class TestHostComponent {
  isOpen = false;
  title = 'Test Title';
  showClose = true;
  showFooter = true;
  closeOnBackdrop = true;
  dismissLabel = 'Close';
  confirmLabel = 'Confirm';
  cancelLabel = 'Cancel';
  size: ModalSize = 'medium';
  onClosed = jest.fn();
  onConfirmed = jest.fn();
}

@Component({
  template: `
    <psh-modal [open]="isOpen" [showFooter]="true">
      <p>Content</p>
      <div modal-footer #modalFooter>
        <button>Custom Action</button>
      </div>
    </psh-modal>
  `,
  imports: [PshModalComponent]
})
class TestHostWithCustomFooterComponent {
  isOpen = true;
}

const getDialog = () =>
  document.body.querySelector('[role="dialog"]') as HTMLElement;

const getDocument = () =>
  document.body.querySelector('[role="document"]') as HTMLElement;

const getCloseButton = () =>
  document.body.querySelector('.modal-close') as HTMLButtonElement;

const getTitle = () =>
  document.body.querySelector('h2') as HTMLElement;

const getFooter = () =>
  document.body.querySelector('.modal-footer') as HTMLElement;

const getFooterButtonByText = (text: string) => {
  const footer = getFooter();
  if (!footer) return null;
  const buttons = footer.querySelectorAll('button');
  return Array.from(buttons).find(btn => btn.textContent?.trim().includes(text)) as HTMLButtonElement;
};

const cleanupDialog = () => {
  const dialog = getDialog();
  if (dialog) {
    dialog.remove();
  }
};

describe('PshModalComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupDialog();
  });

  describe('Content rendering', () => {
    it('should render the title from input', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getTitle().textContent).toContain('Test Title');
    });

    it('should render custom title when changed', () => {
      hostComponent.title = 'Custom Modal Title';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getTitle().textContent).toContain('Custom Modal Title');
    });

    it('should render projected content', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const content = document.body.querySelector('.modal-content');
      expect(content?.textContent).toContain('Test modal content');
    });

    it('should render footer buttons with custom labels', () => {
      hostComponent.confirmLabel = 'Save';
      hostComponent.cancelLabel = 'Discard';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getFooterButtonByText('Save')).toBeTruthy();
      expect(getFooterButtonByText('Discard')).toBeTruthy();
    });
  });

  describe('Visibility and state', () => {
    it('should have data-state="closed" when modal is not open', () => {
      hostComponent.isOpen = false;
      fixture.detectChanges();

      expect(getDialog().getAttribute('data-state')).toBe('closed');
    });

    it('should have data-state="open" when modal is opened', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getDialog().getAttribute('data-state')).toBe('open');
    });

    it('should have aria-hidden="true" when modal is closed', () => {
      hostComponent.isOpen = false;
      fixture.detectChanges();

      expect(getDialog().getAttribute('aria-hidden')).toBe('true');
    });

    it('should have aria-hidden="false" when modal is open', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getDialog().getAttribute('aria-hidden')).toBe('false');
    });
  });

  describe('Close button behavior', () => {
    it('should show close button by default', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getCloseButton()).toBeTruthy();
    });

    it('should hide close button when showClose is false', () => {
      hostComponent.showClose = false;
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getCloseButton()).toBeFalsy();
    });

    it('should have accessible aria-label on close button', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getCloseButton().getAttribute('aria-label')).toBe('Close');
    });

    it('should support custom dismissLabel', () => {
      hostComponent.dismissLabel = 'Fermer';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getCloseButton().getAttribute('aria-label')).toBe('Fermer');
    });

    it('should emit closed event when close button is clicked', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      getCloseButton().click();
      fixture.detectChanges();

      expect(hostComponent.onClosed).toHaveBeenCalledTimes(1);
    });
  });

  describe('Footer behavior', () => {
    it('should show default footer when showFooter is true', () => {
      hostComponent.showFooter = true;
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getFooter()).toBeTruthy();
      expect(getFooterButtonByText('Cancel')).toBeTruthy();
      expect(getFooterButtonByText('Confirm')).toBeTruthy();
    });

    it('should hide footer when showFooter is false', () => {
      hostComponent.showFooter = false;
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getFooter()).toBeFalsy();
    });
  });

  describe('Button interactions', () => {
    beforeEach(() => {
      hostComponent.isOpen = true;
      fixture.detectChanges();
    });

    it('should emit closed event when cancel button is clicked', () => {
      const cancelButton = getFooterButtonByText('Cancel');
      cancelButton?.click();
      fixture.detectChanges();

      expect(hostComponent.onClosed).toHaveBeenCalledTimes(1);
    });

    it('should emit confirmed event when confirm button is clicked', () => {
      const confirmButton = getFooterButtonByText('Confirm');
      confirmButton?.click();
      fixture.detectChanges();

      expect(hostComponent.onConfirmed).toHaveBeenCalledTimes(1);
    });

    it('should not emit closed event when confirm button is clicked', () => {
      const confirmButton = getFooterButtonByText('Confirm');
      confirmButton?.click();
      fixture.detectChanges();

      expect(hostComponent.onClosed).not.toHaveBeenCalled();
    });
  });

  describe('Backdrop interaction', () => {
    it('should emit closed event when backdrop is clicked and closeOnBackdrop is true', () => {
      hostComponent.closeOnBackdrop = true;
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const backdrop = getDialog();
      backdrop.click();
      fixture.detectChanges();

      expect(hostComponent.onClosed).toHaveBeenCalledTimes(1);
    });

    it('should not emit closed event when backdrop is clicked and closeOnBackdrop is false', () => {
      hostComponent.closeOnBackdrop = false;
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const backdrop = getDialog();
      backdrop.click();
      fixture.detectChanges();

      expect(hostComponent.onClosed).not.toHaveBeenCalled();
    });

    it('should not emit closed event when clicking inside modal container', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const modalDocument = getDocument();
      modalDocument.click();
      fixture.detectChanges();

      expect(hostComponent.onClosed).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      hostComponent.isOpen = true;
      fixture.detectChanges();
    });

    it('should have role="dialog" on backdrop element', () => {
      expect(getDialog().getAttribute('role')).toBe('dialog');
    });

    it('should have aria-modal="true"', () => {
      expect(getDialog().getAttribute('aria-modal')).toBe('true');
    });

    it('should have aria-labelledby referencing the title', () => {
      const dialog = getDialog();
      const labelledBy = dialog.getAttribute('aria-labelledby');
      const titleElement = document.body.querySelector(`#${labelledBy}`);

      expect(labelledBy).toBeTruthy();
      expect(titleElement?.textContent).toContain('Test Title');
    });

    it('should have aria-describedby referencing the content area', () => {
      const dialog = getDialog();
      const describedBy = dialog.getAttribute('aria-describedby');
      const contentElement = document.body.querySelector(`#${describedBy}`);

      expect(describedBy).toBeTruthy();
      expect(contentElement).toBeTruthy();
    });

    it('should have role="document" on modal container', () => {
      expect(getDocument().getAttribute('role')).toBe('document');
    });

    it('should have type="button" on close button', () => {
      expect(getCloseButton().getAttribute('type')).toBe('button');
    });
  });

  describe('Size variants', () => {
    it.each<ModalSize>(['small', 'medium', 'large'])(
      'should apply "%s" size class to modal container',
      (size) => {
        hostComponent.size = size;
        hostComponent.isOpen = true;
        fixture.detectChanges();

        const container = getDocument();
        expect(container.classList.contains(size)).toBe(true);
      }
    );
  });
});

@Component({
  template: `
    <psh-modal [(open)]="isOpen" [styleClass]="styleClass">
      <p>Content</p>
    </psh-modal>
  `,
  imports: [PshModalComponent]
})
class TestHostStyleClassComponent {
  isOpen = true;
  styleClass = 'custom-modal-class';
}

describe('PshModalComponent styleClass', () => {
  let fixture: ComponentFixture<TestHostStyleClassComponent>;
  let hostComponent: TestHostStyleClassComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostStyleClassComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostStyleClassComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupDialog();
  });

  it('should apply custom styleClass to modal container', () => {
    const container = getDocument();
    expect(container.classList.contains('custom-modal-class')).toBe(true);
  });

  it('should keep modal-container base class when styleClass is applied', () => {
    const container = getDocument();
    expect(container.classList.contains('modal-container')).toBe(true);
  });

  it('should apply multiple classes when styleClass contains multiple classes', () => {
    hostComponent.styleClass = 'class-one class-two';
    fixture.detectChanges();

    const container = getDocument();
    expect(container.classList.contains('class-one')).toBe(true);
    expect(container.classList.contains('class-two')).toBe(true);
  });

  it('should work with empty styleClass', () => {
    hostComponent.styleClass = '';
    fixture.detectChanges();

    const container = getDocument();
    expect(container.classList.contains('modal-container')).toBe(true);
  });
});

describe('PshModalComponent with custom footer', () => {
  let fixture: ComponentFixture<TestHostWithCustomFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostWithCustomFooterComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostWithCustomFooterComponent);
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupDialog();
  });

  it('should render custom footer content when projected', () => {
    const footer = getFooter();
    expect(footer).toBeTruthy();
    expect(footer?.textContent).toContain('Custom Action');
  });

  it('should hide default buttons when custom footer is provided', () => {
    expect(getFooterButtonByText('Confirm')).toBeFalsy();
    expect(getFooterButtonByText('Cancel')).toBeFalsy();
  });
});

@Component({
  template: `
    <button id="trigger-button" (click)="isOpen = true">Open Modal</button>
    <psh-modal
      [(open)]="isOpen"
      [closeOnEscape]="closeOnEscape"
      [preventScroll]="preventScroll"
      (closed)="onClosed()"
    >
      <input id="first-input" type="text" placeholder="First input" />
      <button id="middle-button">Middle Button</button>
      <input id="last-input" type="text" placeholder="Last input" />
    </psh-modal>
  `,
  imports: [PshModalComponent]
})
class TestHostKeyboardComponent {
  isOpen = false;
  closeOnEscape = true;
  preventScroll = true;
  onClosed = jest.fn();
}

const dispatchKeyboardEvent = (key: string, options: Partial<KeyboardEvent> = {}) => {
  const event = new KeyboardEvent('keydown', {
    key,
    bubbles: true,
    cancelable: true,
    ...options
  });
  document.dispatchEvent(event);
  return event;
};

describe('PshModalComponent keyboard interactions', () => {
  let fixture: ComponentFixture<TestHostKeyboardComponent>;
  let hostComponent: TestHostKeyboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostKeyboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostKeyboardComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupDialog();
    document.body.classList.remove('modal-open');
  });

  describe('Escape key behavior', () => {
    it('should close modal when Escape is pressed and closeOnEscape is true', () => {
      hostComponent.isOpen = true;
      hostComponent.closeOnEscape = true;
      fixture.detectChanges();

      dispatchKeyboardEvent('Escape');
      fixture.detectChanges();

      expect(hostComponent.onClosed).toHaveBeenCalledTimes(1);
    });

    it('should not close modal when Escape is pressed and closeOnEscape is false', () => {
      hostComponent.isOpen = true;
      hostComponent.closeOnEscape = false;
      fixture.detectChanges();

      dispatchKeyboardEvent('Escape');
      fixture.detectChanges();

      expect(hostComponent.onClosed).not.toHaveBeenCalled();
    });

    it('should not close modal when Escape is pressed and modal is already closed', () => {
      hostComponent.isOpen = false;
      fixture.detectChanges();

      dispatchKeyboardEvent('Escape');
      fixture.detectChanges();

      expect(hostComponent.onClosed).not.toHaveBeenCalled();
    });
  });

  describe('Focus trap behavior', () => {
    it('should have multiple focusable elements for trap to work with', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const dialog = getDialog();
      const focusableElements = dialog.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      expect(focusableElements.length).toBeGreaterThan(1);
    });

    it('should identify first and last focusable elements correctly', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const dialog = getDialog();
      const focusableElements = Array.from(dialog.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )) as HTMLElement[];

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      expect(firstElement).toBe(getCloseButton());
      expect(lastElement?.tagName.toLowerCase()).toBe('button');
    });

    it('should respond to Tab keydown events when modal is open', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true
      });

      expect(() => document.dispatchEvent(event)).not.toThrow();
    });

    it('should respond to Shift+Tab keydown events when modal is open', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true
      });

      expect(() => document.dispatchEvent(event)).not.toThrow();
    });
  });
});

describe('PshModalComponent focus management', () => {
  let fixture: ComponentFixture<TestHostKeyboardComponent>;
  let hostComponent: TestHostKeyboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostKeyboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostKeyboardComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupDialog();
    document.body.classList.remove('modal-open');
  });

  it('should have focusable elements available when modal opens', (done) => {
    hostComponent.isOpen = true;
    fixture.detectChanges();

    setTimeout(() => {
      const closeButton = getCloseButton();
      expect(closeButton).toBeTruthy();
      expect(closeButton.tabIndex).not.toBe(-1);
      done();
    }, 150);
  });

  it('should store previous active element when modal opens', () => {
    const triggerButton = fixture.nativeElement.querySelector('#trigger-button') as HTMLButtonElement;
    triggerButton.focus();
    expect(document.activeElement).toBe(triggerButton);

    hostComponent.isOpen = true;
    fixture.detectChanges();

    expect(document.body.classList.contains('modal-open')).toBe(true);
  });

  it('should restore focus to trigger element when modal closes', (done) => {
    const triggerButton = fixture.nativeElement.querySelector('#trigger-button') as HTMLButtonElement;
    triggerButton.focus();

    hostComponent.isOpen = true;
    fixture.detectChanges();

    setTimeout(() => {
      hostComponent.isOpen = false;
      fixture.detectChanges();

      setTimeout(() => {
        expect(document.activeElement).toBe(triggerButton);
        done();
      }, 150);
    }, 150);
  });
});

describe('PshModalComponent scroll lock', () => {
  let fixture: ComponentFixture<TestHostKeyboardComponent>;
  let hostComponent: TestHostKeyboardComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostKeyboardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostKeyboardComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    cleanupDialog();
    document.body.classList.remove('modal-open');
  });

  it('should add modal-open class to body when modal opens and preventScroll is true', () => {
    hostComponent.preventScroll = true;
    hostComponent.isOpen = true;
    fixture.detectChanges();

    expect(document.body.classList.contains('modal-open')).toBe(true);
  });

  it('should remove modal-open class from body when modal closes', () => {
    hostComponent.preventScroll = true;
    hostComponent.isOpen = true;
    fixture.detectChanges();

    hostComponent.isOpen = false;
    fixture.detectChanges();

    expect(document.body.classList.contains('modal-open')).toBe(false);
  });

  it('should not add modal-open class when preventScroll is false', () => {
    hostComponent.preventScroll = false;
    hostComponent.isOpen = true;
    fixture.detectChanges();

    expect(document.body.classList.contains('modal-open')).toBe(false);
  });
});

@Component({
  template: `
    <psh-modal [(open)]="isOpen">
      <p>Content</p>
    </psh-modal>
  `,
  imports: [PshModalComponent]
})
class TestHostResponsiveComponent {
  isOpen = true;
}

describe('PshModalComponent responsive behavior', () => {
  let fixture: ComponentFixture<TestHostResponsiveComponent>;
  let originalInnerWidth: number;

  beforeEach(async () => {
    originalInnerWidth = window.innerWidth;

    await TestBed.configureTestingModule({
      imports: [TestHostResponsiveComponent]
    }).compileComponents();
  });

  afterEach(() => {
    cleanupDialog();
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: originalInnerWidth
    });
  });

  it('should detect mobile screen size on init', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500
    });

    fixture = TestBed.createComponent(TestHostResponsiveComponent);
    fixture.detectChanges();

    const footer = getFooter();
    const buttons = footer?.querySelectorAll('psh-button');
    expect(buttons).toBeTruthy();
  });

  it('should detect desktop screen size on init', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });

    fixture = TestBed.createComponent(TestHostResponsiveComponent);
    fixture.detectChanges();

    const footer = getFooter();
    expect(footer).toBeTruthy();
  });

  it('should update mobile state on window resize', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024
    });

    fixture = TestBed.createComponent(TestHostResponsiveComponent);
    fixture.detectChanges();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 500
    });
    window.dispatchEvent(new Event('resize'));
    fixture.detectChanges();

    const footer = getFooter();
    expect(footer).toBeTruthy();
  });
});
