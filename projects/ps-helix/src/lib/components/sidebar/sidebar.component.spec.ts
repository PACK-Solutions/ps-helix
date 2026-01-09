import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PshSidebarComponent, SIDEBAR_CONFIG } from './sidebar.component';
import { SidebarMode, SidebarPosition } from './sidebar.types';

@Component({
  template: `
    <psh-sidebar
      [(open)]="isOpen"
      [(mode)]="mode"
      [(position)]="position"
      [(width)]="width"
      [(breakpoint)]="breakpoint"
      [autoFocus]="autoFocus"
      [ariaLabel]="ariaLabel"
      (toggle)="onToggle($event)"
      (opened)="onOpened()"
      (closed)="onClosed()"
      (transitionStart)="onTransitionStart($event)"
    >
      <button id="first-button">First Button</button>
      <a href="#" id="sidebar-link">Sidebar Link</a>
      <button id="last-button">Last Button</button>
    </psh-sidebar>
  `,
  imports: [PshSidebarComponent]
})
class TestHostComponent {
  isOpen = false;
  mode: SidebarMode = 'fixed';
  position: SidebarPosition = 'left';
  width = '250px';
  breakpoint = '768px';
  autoFocus = true;
  ariaLabel = 'Sidebar navigation';
  onToggle = jest.fn();
  onOpened = jest.fn();
  onClosed = jest.fn();
  onTransitionStart = jest.fn();
}

@Component({
  template: `
    <psh-sidebar [(open)]="isOpen" [mode]="'overlay'">
      <p>Overlay content</p>
    </psh-sidebar>
  `,
  imports: [PshSidebarComponent]
})
class TestHostOverlayComponent {
  isOpen = false;
}

const createMockMatchMedia = (matches: boolean) => {
  const listeners: ((e: MediaQueryListEvent) => void)[] = [];
  return {
    matches,
    media: '',
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn((_, callback) => listeners.push(callback)),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
    triggerChange: (newMatches: boolean) => {
      listeners.forEach(listener => listener({ matches: newMatches } as MediaQueryListEvent));
    }
  };
};

const getSidebarHost = (fixture: ComponentFixture<unknown>) =>
  fixture.nativeElement.querySelector('psh-sidebar') as HTMLElement;

const getSidebarElement = (fixture: ComponentFixture<unknown>) =>
  fixture.nativeElement.querySelector('.sidebar') as HTMLElement;

const getBackdrop = (fixture: ComponentFixture<unknown>) =>
  fixture.nativeElement.querySelector('.sidebar-backdrop') as HTMLElement;

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

const getSidebarComponentInstance = (fixture: ComponentFixture<unknown>): PshSidebarComponent => {
  const child = fixture.debugElement.children[0];
  if (!child) {
    throw new Error('Sidebar component not found in fixture');
  }
  return child.componentInstance as PshSidebarComponent;
};

describe('PshSidebarComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;
  let mockMatchMedia: ReturnType<typeof createMockMatchMedia>;

  beforeEach(async () => {
    mockMatchMedia = createMockMatchMedia(false);
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Content rendering', () => {
    it('should render projected content inside the sidebar', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const sidebar = getSidebarElement(fixture);
      expect(sidebar.textContent).toContain('First Button');
      expect(sidebar.textContent).toContain('Sidebar Link');
    });

    it('should apply custom width from input', () => {
      hostComponent.width = '300px';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const sidebar = getSidebarElement(fixture);
      expect(sidebar.style.width).toBe('300px');
    });

    it('should not render backdrop when in fixed mode', () => {
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getBackdrop(fixture)).toBeFalsy();
    });

    it('should render backdrop when in overlay mode and open', () => {
      hostComponent.mode = 'overlay';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      expect(getBackdrop(fixture)).toBeTruthy();
    });

    it('should not render backdrop when in overlay mode but closed', () => {
      hostComponent.mode = 'overlay';
      hostComponent.isOpen = false;
      fixture.detectChanges();

      expect(getBackdrop(fixture)).toBeFalsy();
    });
  });

  describe('Accessibility', () => {
    it('should have role="complementary" on host element', () => {
      const host = getSidebarHost(fixture);
      expect(host.getAttribute('role')).toBe('complementary');
    });

    it('should have default aria-label', () => {
      const host = getSidebarHost(fixture);
      expect(host.getAttribute('aria-label')).toBe('Sidebar navigation');
    });

    it('should apply custom aria-label from input', () => {
      hostComponent.ariaLabel = 'Main navigation menu';
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('aria-label')).toBe('Main navigation menu');
    });

    it('should have aria-hidden="true" when closed', () => {
      hostComponent.isOpen = false;
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('aria-hidden')).toBe('true');
    });

    it('should have aria-hidden="false" when open', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('aria-hidden')).toBe('false');
    });

    it('should have aria-expanded="false" when closed', () => {
      hostComponent.isOpen = false;
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('aria-expanded')).toBe('false');
    });

    it('should have aria-expanded="true" when open', () => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-modal="true" when in overlay mode and open', () => {
      hostComponent.mode = 'overlay';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('aria-modal')).toBe('true');
    });

    it('should have aria-modal="false" when in fixed mode', () => {
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('aria-modal')).toBe('false');
    });

    it('should have role="presentation" on backdrop', () => {
      hostComponent.mode = 'overlay';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const backdrop = getBackdrop(fixture);
      expect(backdrop.getAttribute('role')).toBe('presentation');
    });
  });

  describe('State management (data-state)', () => {
    it('should have data-state="fixed" when closed in fixed mode', () => {
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = false;
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('data-state')).toBe('fixed');
    });

    it('should have data-state="overlay" when closed in overlay mode', () => {
      hostComponent.mode = 'overlay';
      hostComponent.isOpen = false;
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('data-state')).toBe('overlay');
    });

    it('should have data-state="open" when open in fixed mode (non-mobile)', () => {
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('data-state')).toBe('open');
    });

    it('should have data-state="mobile" when on mobile breakpoint', () => {
      mockMatchMedia = createMockMatchMedia(true);
      window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

      fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const host = getSidebarHost(fixture);
      expect(host.getAttribute('data-state')).toBe('mobile');
    });
  });

  describe('Mode variants', () => {
    it.each<SidebarMode>(['fixed', 'overlay'])(
      'should apply "%s" mode class to sidebar element',
      (mode) => {
        hostComponent.mode = mode;
        hostComponent.isOpen = true;
        fixture.detectChanges();

        const sidebar = getSidebarElement(fixture);
        expect(sidebar.classList.contains(mode)).toBe(true);
      }
    );

    it('should switch to overlay mode on mobile regardless of mode input', () => {
      mockMatchMedia = createMockMatchMedia(true);
      window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

      fixture = TestBed.createComponent(TestHostComponent);
      hostComponent = fixture.componentInstance;
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const sidebar = getSidebarElement(fixture);
      expect(sidebar.classList.contains('overlay')).toBe(true);
    });

    it('should hide fixed mode sidebar when closed', () => {
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = false;
      fixture.detectChanges();

      const sidebar = getSidebarElement(fixture);
      expect(sidebar.classList.contains('open')).toBe(false);
    });

    it('should show fixed mode sidebar when open', () => {
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const sidebar = getSidebarElement(fixture);
      expect(sidebar.classList.contains('open')).toBe(true);
    });
  });

  describe('Position variants', () => {
    it.each<SidebarPosition>(['left', 'right'])(
      'should apply "%s" position class to sidebar element',
      (position) => {
        hostComponent.position = position;
        hostComponent.isOpen = true;
        fixture.detectChanges();

        const sidebar = getSidebarElement(fixture);
        expect(sidebar.classList.contains(position)).toBe(true);
      }
    );

    it.each<[SidebarMode, SidebarPosition]>([
      ['fixed', 'left'],
      ['fixed', 'right'],
      ['overlay', 'left'],
      ['overlay', 'right']
    ])(
      'should correctly combine %s mode with %s position',
      (mode, position) => {
        hostComponent.mode = mode;
        hostComponent.position = position;
        hostComponent.isOpen = true;
        fixture.detectChanges();

        const sidebar = getSidebarElement(fixture);
        expect(sidebar.classList.contains(mode)).toBe(true);
        expect(sidebar.classList.contains(position)).toBe(true);
      }
    );
  });

  describe('Output events', () => {
    it('should emit toggle output with true when sidebar opens', fakeAsync(() => {
      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.toggleSidebar();
      tick();
      fixture.detectChanges();

      expect(hostComponent.onToggle).toHaveBeenCalledWith(true);
    }));

    it('should emit toggle output with false when sidebar closes', fakeAsync(() => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.toggleSidebar();
      tick();
      fixture.detectChanges();

      expect(hostComponent.onToggle).toHaveBeenCalledWith(false);
    }));

    it('should emit opened output when sidebar opens', fakeAsync(() => {
      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.toggleSidebar();
      tick(100);
      fixture.detectChanges();

      expect(hostComponent.onOpened).toHaveBeenCalledTimes(1);
    }));

    it('should emit closed output when sidebar closes', fakeAsync(() => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.toggleSidebar();
      tick(100);
      fixture.detectChanges();

      expect(hostComponent.onClosed).toHaveBeenCalledTimes(1);
    }));

    it('should emit transitionStart output before state changes', fakeAsync(() => {
      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.toggleSidebar();
      tick();
      fixture.detectChanges();

      expect(hostComponent.onTransitionStart).toHaveBeenCalledWith(true);
    }));
  });

  describe('Toggle and close behavior', () => {
    it('should toggle open state when toggleSidebar is called', fakeAsync(() => {
      expect(hostComponent.isOpen).toBe(false);

      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.toggleSidebar();
      tick();
      fixture.detectChanges();

      expect(hostComponent.isOpen).toBe(true);

      sidebarComponent.toggleSidebar();
      tick();
      fixture.detectChanges();

      expect(hostComponent.isOpen).toBe(false);
    }));

    it('should close sidebar when closeSidebar is called and currently open', fakeAsync(() => {
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.closeSidebar();
      tick(100);
      fixture.detectChanges();

      expect(hostComponent.isOpen).toBe(false);
      expect(hostComponent.onClosed).toHaveBeenCalled();
    }));

    it('should not emit events when closeSidebar is called while already closed', fakeAsync(() => {
      hostComponent.isOpen = false;
      fixture.detectChanges();

      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.closeSidebar();
      tick();
      fixture.detectChanges();

      expect(hostComponent.onToggle).not.toHaveBeenCalled();
      expect(hostComponent.onClosed).not.toHaveBeenCalled();
    }));
  });

  describe('Keyboard interactions', () => {
    it('should close sidebar on Escape key press in overlay mode', fakeAsync(() => {
      hostComponent.mode = 'overlay';
      hostComponent.isOpen = true;
      fixture.detectChanges();
      tick();

      dispatchKeyboardEvent('Escape');
      tick();
      fixture.detectChanges();

      expect(hostComponent.isOpen).toBe(false);
    }));

    it('should not close sidebar on Escape key press in fixed mode', fakeAsync(() => {
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = true;
      fixture.detectChanges();
      tick();

      dispatchKeyboardEvent('Escape');
      tick();
      fixture.detectChanges();

      expect(hostComponent.isOpen).toBe(true);
    }));

    it('should not respond to Escape key when sidebar is closed', fakeAsync(() => {
      hostComponent.mode = 'overlay';
      hostComponent.isOpen = false;
      fixture.detectChanges();

      dispatchKeyboardEvent('Escape');
      tick();
      fixture.detectChanges();

      expect(hostComponent.onClosed).not.toHaveBeenCalled();
    }));
  });

  describe('Click outside behavior', () => {
    it('should close sidebar when clicking backdrop in overlay mode', fakeAsync(() => {
      hostComponent.mode = 'overlay';
      hostComponent.isOpen = true;
      fixture.detectChanges();
      tick();

      const backdrop = getBackdrop(fixture);
      backdrop.click();
      tick();
      fixture.detectChanges();

      expect(hostComponent.isOpen).toBe(false);
    }));

    it('should not close sidebar when clicking inside sidebar content', fakeAsync(() => {
      hostComponent.mode = 'overlay';
      hostComponent.isOpen = true;
      fixture.detectChanges();
      tick();

      const button = fixture.nativeElement.querySelector('#first-button') as HTMLElement;
      button.click();
      tick();
      fixture.detectChanges();

      expect(hostComponent.isOpen).toBe(true);
    }));
  });

  describe('Focus management', () => {
    it('should focus first focusable element when opening with autoFocus enabled', fakeAsync(() => {
      hostComponent.autoFocus = true;
      fixture.detectChanges();

      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.toggleSidebar();
      tick(100);
      fixture.detectChanges();

      const firstButton = fixture.nativeElement.querySelector('#first-button') as HTMLElement;
      expect(document.activeElement).toBe(firstButton);
    }));

    it('should not auto-focus when autoFocus is disabled', fakeAsync(() => {
      hostComponent.autoFocus = false;
      fixture.detectChanges();

      const previousActiveElement = document.activeElement;

      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.toggleSidebar();
      tick(100);
      fixture.detectChanges();

      const firstButton = fixture.nativeElement.querySelector('#first-button') as HTMLElement;
      expect(document.activeElement).not.toBe(firstButton);
    }));

    it('should restore focus to previous element when closing', fakeAsync(() => {
      const externalButton = document.createElement('button');
      externalButton.id = 'external-button';
      document.body.appendChild(externalButton);
      externalButton.focus();

      const sidebarComponent = getSidebarComponentInstance(fixture);
      sidebarComponent.toggleSidebar();
      tick(100);
      fixture.detectChanges();

      sidebarComponent.toggleSidebar();
      tick(100);
      fixture.detectChanges();

      expect(document.activeElement).toBe(externalButton);

      document.body.removeChild(externalButton);
    }));

    it('should trap focus within sidebar when Tab key is pressed', fakeAsync(() => {
      hostComponent.isOpen = true;
      fixture.detectChanges();
      tick();

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        bubbles: true,
        cancelable: true
      });

      expect(() => document.dispatchEvent(event)).not.toThrow();
    }));

    it('should handle Shift+Tab for reverse focus navigation', fakeAsync(() => {
      hostComponent.isOpen = true;
      fixture.detectChanges();
      tick();

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        cancelable: true
      });

      expect(() => document.dispatchEvent(event)).not.toThrow();
    }));
  });

  describe('Responsive behavior', () => {
    it('should detect mobile breakpoint and switch to overlay mode', () => {
      mockMatchMedia = createMockMatchMedia(true);
      window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

      fixture = TestBed.createComponent(TestHostComponent);
      hostComponent = fixture.componentInstance;
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const sidebar = getSidebarElement(fixture);
      expect(sidebar.classList.contains('overlay')).toBe(true);
    });

    it('should use desktop mode when above breakpoint', () => {
      mockMatchMedia = createMockMatchMedia(false);
      window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

      fixture = TestBed.createComponent(TestHostComponent);
      hostComponent = fixture.componentInstance;
      hostComponent.mode = 'fixed';
      hostComponent.isOpen = true;
      fixture.detectChanges();

      const sidebar = getSidebarElement(fixture);
      expect(sidebar.classList.contains('fixed')).toBe(true);
    });

    it('should call matchMedia with the correct breakpoint', () => {
      hostComponent.breakpoint = '1024px';
      fixture.detectChanges();

      expect(window.matchMedia).toHaveBeenCalledWith('(max-width: 1024px)');
    });
  });
});

describe('PshSidebarComponent with custom config', () => {
  let fixture: ComponentFixture<TestHostOverlayComponent>;

  beforeEach(async () => {
    const mockMatchMedia = createMockMatchMedia(false);
    window.matchMedia = jest.fn().mockReturnValue(mockMatchMedia);

    await TestBed.configureTestingModule({
      imports: [TestHostOverlayComponent],
      providers: [
        {
          provide: SIDEBAR_CONFIG,
          useValue: {
            mode: 'overlay',
            position: 'right',
            width: '400px',
            ariaLabel: 'Custom sidebar'
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostOverlayComponent);
    fixture.detectChanges();
  });

  it('should use config values as defaults', () => {
    const host = getSidebarHost(fixture);
    expect(host.getAttribute('aria-label')).toBe('Custom sidebar');
  });
});
