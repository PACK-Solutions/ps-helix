import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshHorizontalCardComponent } from './horizontal-card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HorizontalCardVariant } from './horizontal-card.types';

describe('PshHorizontalCardComponent', () => {
  let component: PshHorizontalCardComponent;
  let fixture: ComponentFixture<PshHorizontalCardComponent>;
  let cardElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshHorizontalCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PshHorizontalCardComponent);
    component = fixture.componentInstance;
    // The card *is* the host element now, and `debugElement.query` searches descendants.
    cardElement = fixture.debugElement;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render the card container with article role', () => {
      expect(cardElement).toBeTruthy();
      expect(cardElement.nativeElement.getAttribute('role')).toBe('article');
    });
  });

  describe('Card Variants', () => {
    const variants: HorizontalCardVariant[] = ['flat', 'elevated', 'outline'];

    it.each(variants)('should apply %s variant class', (variant) => {
      fixture.componentRef.setInput('appearance', variant);
      fixture.detectChanges();

      const classes = cardElement.nativeElement.className;
      expect(classes).toContain(`appearance-${variant}`);
    });

    it('should have elevated as default variant', () => {
      expect(cardElement.nativeElement.className).toContain('psh-appearance-elevated');
    });

    it('should update variant class when variant changes', () => {
      fixture.componentRef.setInput('appearance', 'elevated');
      fixture.detectChanges();
      expect(cardElement.nativeElement.className).toContain('psh-appearance-elevated');

      fixture.componentRef.setInput('appearance', 'outline');
      fixture.detectChanges();
      expect(cardElement.nativeElement.className).toContain('psh-appearance-outline');
      expect(cardElement.nativeElement.className).not.toContain('psh-appearance-elevated');
    });
  });

  describe('Hoverable State', () => {
    it('should not have hoverable class by default', () => {
      expect(cardElement.nativeElement.className).not.toContain('psh-hoverable');
    });

    it('should add hoverable class when hoverable is true', () => {
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.className).toContain('psh-hoverable');
    });

    it('should remove hoverable class when hoverable is set to false', () => {
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();
      expect(cardElement.nativeElement.className).toContain('psh-hoverable');

      fixture.componentRef.setInput('hoverable', false);
      fixture.detectChanges();
      expect(cardElement.nativeElement.className).not.toContain('psh-hoverable');
    });
  });

  describe('Interactive State', () => {
    it('should not be interactive by default', () => {
      expect(cardElement.nativeElement.className).not.toContain('psh-interactive');
      expect(cardElement.nativeElement.getAttribute('tabindex')).toBeNull();
    });

    it('should add interactive class when interactive is true', () => {
      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.className).toContain('psh-interactive');
    });

    it('should set tabindex to 0 when interactive is true', () => {
      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should not set tabindex when interactive is false', () => {
      fixture.componentRef.setInput('interactive', false);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('tabindex')).toBeNull();
    });

    it('should remove tabindex when disabled even if interactive', () => {
      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('tabindex')).toBeNull();
    });
  });

  describe('Loading State', () => {
    it('should not have loading class by default', () => {
      expect(cardElement.nativeElement.className).not.toContain('psh-loading');
    });

    it('should add loading class when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.className).toContain('psh-loading');
    });

    it('should set aria-busy to true when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('aria-busy')).toBe('true');
    });

    it('should not have aria-busy attribute when not loading', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('aria-busy')).toBeNull();
    });

    it('should show side skeleton when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const sideSkeleton = fixture.debugElement.query(By.css('.psh-horizontal-skeleton'));
      expect(sideSkeleton).toBeTruthy();
    });

    it('should show content skeleton when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const skeleton = fixture.debugElement.query(By.css('.psh-horizontal-loading'));
      expect(skeleton).toBeTruthy();
      expect(skeleton.nativeElement.querySelectorAll('.psh-skeleton-line').length).toBe(3);
    });

    it('should hide skeleton when not loading', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      const skeleton = fixture.debugElement.query(By.css('.psh-horizontal-loading'));
      expect(skeleton).toBeNull();
    });
  });

  describe('Disabled State', () => {
    it('should not have disabled class by default', () => {
      expect(cardElement.nativeElement.className).not.toContain('psh-disabled');
    });

    it('should add disabled class when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.className).toContain('psh-disabled');
    });

    it('should set aria-disabled to true when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not have aria-disabled attribute when not disabled', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('aria-disabled')).toBeNull();
    });
  });

  describe('CSS Custom Properties', () => {
    it('should apply sideWidth as CSS custom property', () => {
      fixture.componentRef.setInput('sideWidth', 'var(--psh-size-64)');
      fixture.detectChanges();

      const style = cardElement.nativeElement.style;
      expect(style.getPropertyValue('--psh-horizontal-side-width')).toBe('var(--psh-size-64)');
    });

    it('should apply gap as CSS custom property', () => {
      fixture.componentRef.setInput('gap', 'var(--psh-spacing-lg)');
      fixture.detectChanges();

      const style = cardElement.nativeElement.style;
      expect(style.getPropertyValue('--psh-horizontal-gap')).toBe('var(--psh-spacing-lg)');
    });

    it('should apply sidePadding as CSS custom property', () => {
      fixture.componentRef.setInput('sidePadding', 'var(--psh-spacing-sm)');
      fixture.detectChanges();

      const style = cardElement.nativeElement.style;
      expect(style.getPropertyValue('--psh-horizontal-side-padding')).toBe('var(--psh-spacing-sm)');
    });

    it('should apply contentPadding as CSS custom property', () => {
      fixture.componentRef.setInput('contentPadding', 'var(--psh-spacing-xl)');
      fixture.detectChanges();

      const style = cardElement.nativeElement.style;
      expect(style.getPropertyValue('--psh-horizontal-content-padding')).toBe('var(--psh-spacing-xl)');
    });

    it('should apply mobileHeight as CSS custom property', () => {
      fixture.componentRef.setInput('mobileHeight', 'var(--psh-size-32)');
      fixture.detectChanges();

      const style = cardElement.nativeElement.style;
      expect(style.getPropertyValue('--psh-horizontal-mobile-height')).toBe('var(--psh-size-32)');
    });
  });

  describe('Click Handling', () => {
    it('should not emit clicked event when not interactive', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', false);
      fixture.detectChanges();

      cardElement.nativeElement.click();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should emit clicked event when interactive', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      cardElement.nativeElement.click();
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit clicked event when disabled', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      cardElement.nativeElement.click();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event when loading', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      cardElement.nativeElement.click();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should pass mouse event to clicked output', () => {
      let emittedEvent: MouseEvent | KeyboardEvent | undefined;
      component.clicked.subscribe((event) => {
        emittedEvent = event;
      });

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const mouseEvent = new MouseEvent('click');
      cardElement.nativeElement.dispatchEvent(mouseEvent);

      expect(emittedEvent).toBeInstanceOf(MouseEvent);
    });
  });

  describe('Keyboard Handling', () => {
    it('should emit clicked event on Enter key when interactive', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      cardElement.nativeElement.dispatchEvent(event);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit clicked event on Space key when interactive', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: ' ' });
      cardElement.nativeElement.dispatchEvent(event);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit clicked event on other keys', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const otherKeys = ['Tab', 'Escape', 'ArrowDown', 'a', '1'];
      otherKeys.forEach((key) => {
        const event = new KeyboardEvent('keydown', { key });
        cardElement.nativeElement.dispatchEvent(event);
      });

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event on keyboard when not interactive', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', false);
      fixture.detectChanges();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      cardElement.nativeElement.dispatchEvent(enterEvent);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event on keyboard when disabled', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      cardElement.nativeElement.dispatchEvent(enterEvent);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event on keyboard when loading', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      cardElement.nativeElement.dispatchEvent(enterEvent);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should pass keyboard event to clicked output', () => {
      let emittedEvent: MouseEvent | KeyboardEvent | undefined;
      component.clicked.subscribe((event) => {
        emittedEvent = event;
      });

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const keyboardEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      cardElement.nativeElement.dispatchEvent(keyboardEvent);

      expect(emittedEvent).toBeInstanceOf(KeyboardEvent);
    });
  });

  describe('Accessibility Attributes', () => {
    it('should have article role', () => {
      expect(cardElement.nativeElement.getAttribute('role')).toBe('article');
    });

    it('should have tabindex 0 when interactive and not disabled', () => {
      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('tabindex')).toBe('0');
    });

    it('should not have tabindex when not interactive', () => {
      fixture.componentRef.setInput('interactive', false);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('tabindex')).toBeNull();
    });

    it('should not have tabindex when disabled', () => {
      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('tabindex')).toBeNull();
    });

    it('should have aria-disabled when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not have aria-disabled when not disabled', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('aria-disabled')).toBeNull();
    });

    it('should have aria-busy when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('aria-busy')).toBe('true');
    });

    it('should not have aria-busy when not loading', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      expect(cardElement.nativeElement.getAttribute('aria-busy')).toBeNull();
    });
  });

  describe('Content Structure', () => {
    it('should render horizontal-side container', () => {
      const side = fixture.debugElement.query(By.css('.psh-horizontal-side'));
      expect(side).toBeTruthy();
    });

    it('should render horizontal-content container', () => {
      const content = fixture.debugElement.query(By.css('.psh-horizontal-content'));
      expect(content).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values correctly', () => {
      fixture.componentRef.setInput('cssClass', '');
      fixture.detectChanges();

      expect(cardElement.nativeElement.className).not.toContain('undefined');
    });

    it('should handle simultaneous state changes', () => {
      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('hoverable', true);
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const classes = cardElement.nativeElement.className;
      expect(classes).toContain('psh-interactive');
      expect(classes).toContain('psh-hoverable');
      expect(classes).toContain('psh-loading');
      expect(classes).toContain('psh-disabled');
    });

    it('should prevent interaction when both disabled and loading', () => {
      const clickSpy = jest.fn();
      component.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      cardElement.nativeElement.click();
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      cardElement.nativeElement.dispatchEvent(enterEvent);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should combine variant with other state classes', () => {
      fixture.componentRef.setInput('appearance', 'outline');
      fixture.componentRef.setInput('hoverable', true);
      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const classes = cardElement.nativeElement.className;
      expect(classes).toContain('psh-appearance-outline');
      expect(classes).toContain('psh-hoverable');
      expect(classes).toContain('psh-interactive');
    });
  });
});
