import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshCardComponent } from './card.component';
import { ChangeDetectionStrategy, Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CardVariant, CardColorVariant, CardDensity, CardActionsAlignment } from './card.types';

describe('PshCardComponent', () => {
  let component: PshCardComponent;
  let fixture: ComponentFixture<PshCardComponent>;
  let cardElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PshCardComponent);
    component = fixture.componentInstance;
    cardElement = fixture.debugElement.query(By.css('[role="article"]'));
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

    it('should have default values for all inputs', () => {
      expect(component.appearance()).toBe('flat');
      expect(component.hoverable()).toBe(false);
      expect(component.interactive()).toBe(false);
      expect(component.title()).toBe('');
      expect(component.description()).toBe('');
      expect(component.color()).toBe('neutral');
      expect(component.density()).toBe('normal');
      expect(component.showHeaderDivider()).toBe(true);
      expect(component.showFooterDivider()).toBe(true);
      expect(component.showActionsDivider()).toBe(true);
      expect(component.actionsAlignment()).toBe('right');
      expect(component.loading()).toBe(false);
      expect(component.disabled()).toBe(false);
    });
  });

  describe('Card Variants', () => {
    const variants: CardVariant[] = ['flat', 'elevated', 'outline'];

    variants.forEach((variant) => {
      it(`should apply ${variant} variant class`, () => {
        fixture.componentRef.setInput('appearance', variant);
        fixture.detectChanges();

        const classes = cardElement.nativeElement.className;
        expect(classes).toContain(`appearance-${variant}`);
      });
    });

    it('should update variant class when variant changes', () => {
      fixture.componentRef.setInput('appearance', 'flat');
      fixture.detectChanges();
      expect(cardElement.nativeElement.className).toContain('psh-appearance-flat');

      fixture.componentRef.setInput('appearance', 'elevated');
      fixture.detectChanges();
      expect(cardElement.nativeElement.className).toContain('psh-appearance-elevated');
      expect(cardElement.nativeElement.className).not.toContain('psh-appearance-flat');
    });
  });

  describe('Color Variants', () => {
    const colorVariants: CardColorVariant[] = ['neutral', 'info', 'success', 'warning', 'danger'];

    colorVariants.forEach((colorVariant) => {
      it(`should apply ${colorVariant} color variant class`, () => {
        fixture.componentRef.setInput('color', colorVariant);
        fixture.detectChanges();

        const classes = cardElement.nativeElement.className;
        expect(classes).toContain(`color-${colorVariant}`);
      });
    });
  });

  describe('Density Levels', () => {
    const densities: CardDensity[] = ['compact', 'normal', 'spacious'];

    densities.forEach((density) => {
      it(`should apply ${density} density class`, () => {
        fixture.componentRef.setInput('density', density);
        fixture.detectChanges();

        const classes = cardElement.nativeElement.className;
        expect(classes).toContain(`density-${density}`);
      });
    });
  });

  describe('Actions Alignment', () => {
    const alignments: CardActionsAlignment[] = ['left', 'center', 'right', 'space-between'];

    alignments.forEach((alignment) => {
      it(`should apply ${alignment} alignment class to actions container`, () => {
        fixture.componentRef.setInput('actionsAlignment', alignment);
        fixture.detectChanges();

        const actionsElement = fixture.debugElement.query(By.css('.psh-card-actions'));
        expect(actionsElement.nativeElement.className).toContain(`actions-align-${alignment}`);
      });
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

    it('should show skeleton when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const skeleton = fixture.debugElement.query(By.css('.psh-card-loading'));
      expect(skeleton).toBeTruthy();
      expect(skeleton.nativeElement.querySelectorAll('.psh-skeleton-line').length).toBe(3);
    });

    it('should hide main content when loading', () => {
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();

      let skeleton = fixture.debugElement.query(By.css('.psh-card-loading'));
      expect(skeleton).toBeNull();

      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      skeleton = fixture.debugElement.query(By.css('.psh-card-loading'));
      expect(skeleton).toBeTruthy();
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

  describe('Title and Description', () => {
    it('should render an empty header (hidden via CSS) when title, description and header slots are all empty', () => {
      // Le .card-header est désormais rendu inconditionnellement puis masqué en CSS
      // via `.psh-card-header:not(:has(*))`. En unit test (jsdom n'applique pas le CSS),
      // on vérifie le critère réel de masquage : le header ne contient aucun élément.
      fixture.componentRef.setInput('title', '');
      fixture.componentRef.setInput('description', '');
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.psh-card-header'));
      expect(header).toBeTruthy();
      expect(header.nativeElement.children.length).toBe(0);
    });

    it('should show header when title is provided', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.psh-card-header'));
      expect(header).toBeTruthy();
    });

    it('should render title text', () => {
      const testTitle = 'My Card Title';
      fixture.componentRef.setInput('title', testTitle);
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('.psh-card-title'));
      expect(titleElement).toBeTruthy();
      expect(titleElement.nativeElement.textContent.trim()).toBe(testTitle);
    });

    it('should show header when description is provided', () => {
      fixture.componentRef.setInput('description', 'Test Description');
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.psh-card-header'));
      expect(header).toBeTruthy();
    });

    it('should render description text', () => {
      const testDescription = 'My card description';
      fixture.componentRef.setInput('description', testDescription);
      fixture.detectChanges();

      const descriptionElement = fixture.debugElement.query(By.css('.psh-card-description'));
      expect(descriptionElement).toBeTruthy();
      expect(descriptionElement.nativeElement.textContent.trim()).toBe(testDescription);
    });

    it('should show both title and description when both are provided', () => {
      fixture.componentRef.setInput('title', 'Title');
      fixture.componentRef.setInput('description', 'Description');
      fixture.detectChanges();

      const titleElement = fixture.debugElement.query(By.css('.psh-card-title'));
      const descriptionElement = fixture.debugElement.query(By.css('.psh-card-description'));

      expect(titleElement).toBeTruthy();
      expect(descriptionElement).toBeTruthy();
    });
  });

  describe('Dividers', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();
    });

    it('should show header divider by default', () => {
      const header = fixture.debugElement.query(By.css('.psh-card-header'));
      expect(header.nativeElement.className).toContain('psh-has-divider');
    });

    it('should hide header divider when showHeaderDivider is false', () => {
      fixture.componentRef.setInput('showHeaderDivider', false);
      fixture.detectChanges();

      const header = fixture.debugElement.query(By.css('.psh-card-header'));
      expect(header.nativeElement.className).not.toContain('psh-has-divider');
    });

    it('should show footer divider by default', () => {
      const footer = fixture.debugElement.query(By.css('.psh-card-footer'));
      expect(footer.nativeElement.className).toContain('psh-has-divider');
    });

    it('should hide footer divider when showFooterDivider is false', () => {
      fixture.componentRef.setInput('showFooterDivider', false);
      fixture.detectChanges();

      const footer = fixture.debugElement.query(By.css('.psh-card-footer'));
      expect(footer.nativeElement.className).not.toContain('psh-has-divider');
    });

    it('should show actions divider by default', () => {
      const actions = fixture.debugElement.query(By.css('.psh-card-actions'));
      expect(actions.nativeElement.className).toContain('psh-has-divider');
    });

    it('should hide actions divider when showActionsDivider is false', () => {
      fixture.componentRef.setInput('showActionsDivider', false);
      fixture.detectChanges();

      const actions = fixture.debugElement.query(By.css('.psh-card-actions'));
      expect(actions.nativeElement.className).not.toContain('psh-has-divider');
    });
  });

  describe('Custom Classes and Styles', () => {
    it('should apply custom CSS class', () => {
      const customClass = 'my-custom-class';
      fixture.componentRef.setInput('cssClass', customClass);
      fixture.detectChanges();

      expect(cardElement.nativeElement.className).toContain(customClass);
    });

    it('should apply multiple custom CSS classes', () => {
      const customClasses = 'class-one class-two class-three';
      fixture.componentRef.setInput('cssClass', customClasses);
      fixture.detectChanges();

      const classes = cardElement.nativeElement.className;
      expect(classes).toContain('class-one');
      expect(classes).toContain('class-two');
      expect(classes).toContain('class-three');
    });

    it('should apply custom inline styles', () => {
      const customStyles = { 'background-color': 'red', 'border-radius': '20px' };
      fixture.componentRef.setInput('customStyle', customStyles);
      fixture.detectChanges();

      const style = cardElement.nativeElement.style;
      expect(style.backgroundColor).toBe('red');
      expect(style.borderRadius).toBe('20px');
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

  describe('Computed Properties', () => {
    it('should compute classes correctly', () => {
      fixture.componentRef.setInput('appearance', 'elevated');
      fixture.componentRef.setInput('color', 'success');
      fixture.componentRef.setInput('density', 'compact');
      fixture.componentRef.setInput('hoverable', true);
      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const classes = component.computedClasses();
      expect(classes).toContain('psh-card');
      expect(classes).toContain('psh-appearance-elevated');
      expect(classes).toContain('psh-color-success');
      expect(classes).toContain('psh-density-compact');
      expect(classes).toContain('psh-hoverable');
      expect(classes).toContain('psh-interactive');
    });

    it('should compute hasHeader correctly', () => {
      fixture.componentRef.setInput('title', '');
      fixture.componentRef.setInput('description', '');
      expect(component.hasHeader()).toBe(false);

      fixture.componentRef.setInput('title', 'Title');
      expect(component.hasHeader()).toBe(true);

      fixture.componentRef.setInput('title', '');
      fixture.componentRef.setInput('description', 'Description');
      expect(component.hasHeader()).toBe(true);

      fixture.componentRef.setInput('title', 'Title');
      fixture.componentRef.setInput('description', 'Description');
      expect(component.hasHeader()).toBe(true);
    });

    it('should compute actionsAlignmentClass correctly', () => {
      fixture.componentRef.setInput('actionsAlignment', 'left');
      expect(component.actionsAlignmentClass()).toBe('psh-actions-align-left');

      fixture.componentRef.setInput('actionsAlignment', 'center');
      expect(component.actionsAlignmentClass()).toBe('psh-actions-align-center');

      fixture.componentRef.setInput('actionsAlignment', 'right');
      expect(component.actionsAlignmentClass()).toBe('psh-actions-align-right');

      fixture.componentRef.setInput('actionsAlignment', 'space-between');
      expect(component.actionsAlignmentClass()).toBe('psh-actions-align-space-between');
    });

    it('should merge custom styles correctly', () => {
      const customStyles = { color: 'blue', 'font-size': '16px' };
      fixture.componentRef.setInput('customStyle', customStyles);

      const computedStyles = component.computedStyles();
      expect(computedStyles).toEqual(customStyles);
    });

    it('should compute actionsClasses with alignment only when not mobile', () => {
      fixture.componentRef.setInput('actionsAlignment', 'center');
      component.isMobile.set(false);

      const classes = component.actionsClasses();
      expect(classes).toBe('psh-actions-align-center');
      expect(classes).not.toContain('psh-mobile-full-width-buttons');
    });

    it('should compute actionsClasses with mobile-full-width-buttons when mobile', () => {
      fixture.componentRef.setInput('actionsAlignment', 'right');
      component.isMobile.set(true);

      const classes = component.actionsClasses();
      expect(classes).toContain('psh-actions-align-right');
      expect(classes).toContain('psh-mobile-full-width-buttons');
    });
  });

  describe('Responsive Behavior', () => {
    it('should initialize isMobile signal on init', () => {
      const isMobile = component.isMobile();
      expect(typeof isMobile).toBe('boolean');
    });

    it('should have isMobile signal that reflects viewport width', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 500,
      });

      component.isMobile.set(true);
      fixture.detectChanges();

      expect(component.isMobile()).toBe(true);
    });

    it('should set isMobile to false for desktop viewport', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });

      component.isMobile.set(false);
      fixture.detectChanges();

      expect(component.isMobile()).toBe(false);
    });

    it('should add mobile-full-width-buttons class when isMobile is true', () => {
      component.isMobile.set(true);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(By.css('.psh-card-actions'));
      expect(actionsElement.nativeElement.className).toContain('psh-mobile-full-width-buttons');
    });

    it('should not have mobile-full-width-buttons class when isMobile is false', () => {
      component.isMobile.set(false);
      fixture.detectChanges();

      const actionsElement = fixture.debugElement.query(By.css('.psh-card-actions'));
      expect(actionsElement.nativeElement.className).not.toContain('psh-mobile-full-width-buttons');
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should setup ResizeObserver on init in browser environment', () => {
      const newFixture = TestBed.createComponent(PshCardComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      expect(newComponent['resizeObserver']).toBeDefined();
      newFixture.destroy();
    });

    it('should disconnect ResizeObserver on destroy', () => {
      const newFixture = TestBed.createComponent(PshCardComponent);
      const newComponent = newFixture.componentInstance;
      newFixture.detectChanges();

      const resizeObserver = newComponent['resizeObserver'];
      const disconnectSpy = jest.spyOn(resizeObserver!, 'disconnect');

      newFixture.destroy();

      expect(disconnectSpy).toHaveBeenCalled();
    });
  });

  describe('Content Structure', () => {
    it('should always render card-body', () => {
      const body = fixture.debugElement.query(By.css('.psh-card-body'));
      expect(body).toBeTruthy();
    });

    it('should always render card-footer', () => {
      const footer = fixture.debugElement.query(By.css('.psh-card-footer'));
      expect(footer).toBeTruthy();
    });

    it('should always render card-actions', () => {
      const actions = fixture.debugElement.query(By.css('.psh-card-actions'));
      expect(actions).toBeTruthy();
    });

    it('should render an empty header when nothing is provided, and populate it when title is set', () => {
      fixture.componentRef.setInput('title', '');
      fixture.componentRef.setInput('description', '');
      fixture.detectChanges();

      let header = fixture.debugElement.query(By.css('.psh-card-header'));
      expect(header).toBeTruthy();
      expect(header.nativeElement.children.length).toBe(0);

      fixture.componentRef.setInput('title', 'Title');
      fixture.detectChanges();

      header = fixture.debugElement.query(By.css('.psh-card-header'));
      expect(header).toBeTruthy();
      expect(header.nativeElement.children.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string values correctly', () => {
      fixture.componentRef.setInput('title', '');
      fixture.componentRef.setInput('description', '');
      fixture.componentRef.setInput('cssClass', '');
      fixture.detectChanges();

      expect(component.hasHeader()).toBe(false);
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
  });
});

/**
 * Header projeté sans [title]/[description].
 *
 * On instancie <psh-card> via des composants hôtes de test afin de projeter du contenu
 * dans les slots de header. Le header doit se rendre dès qu'un slot est utilisé, même
 * sans title/description.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'test-host-header-content',
  imports: [PshCardComponent],
  template: `
    <psh-card>
      <div card-header-content>
        <h3>Titre projeté</h3>
      </div>
    </psh-card>
  `,
})
class HeaderContentHostComponent {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'test-host-header-icon',
  imports: [PshCardComponent],
  template: `
    <psh-card>
      <i card-header-icon class="ph ph-star" aria-hidden="true"></i>
    </psh-card>
  `,
})
class HeaderIconHostComponent {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'test-host-header-extra',
  imports: [PshCardComponent],
  template: `
    <psh-card>
      <span card-header-extra>badge</span>
    </psh-card>
  `,
})
class HeaderExtraHostComponent {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'test-host-no-header',
  imports: [PshCardComponent],
  template: ` <psh-card>Corps sans header</psh-card> `,
})
class NoHeaderHostComponent {}

describe('PshCardComponent - projected header slots', () => {
  it('should render the header when only [card-header-content] is projected (no title)', () => {
    const fixture = TestBed.createComponent(HeaderContentHostComponent);
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.psh-card-header'));
    expect(header).toBeTruthy();
    expect(header.nativeElement.children.length).toBeGreaterThan(0);
    // Aucun titre par défaut : le markup vient uniquement du contenu projeté.
    expect(fixture.debugElement.query(By.css('.psh-card-title'))).toBeNull();
    expect(header.nativeElement.querySelector('[card-header-content]')).toBeTruthy();
  });

  it('should render the header when only [card-header-icon] is projected (no title)', () => {
    const fixture = TestBed.createComponent(HeaderIconHostComponent);
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.psh-card-header'));
    expect(header).toBeTruthy();
    expect(header.nativeElement.querySelector('[card-header-icon]')).toBeTruthy();
  });

  it('should render the header when only [card-header-extra] is projected (no title)', () => {
    const fixture = TestBed.createComponent(HeaderExtraHostComponent);
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.psh-card-header'));
    expect(header).toBeTruthy();
    expect(header.nativeElement.querySelector('[card-header-extra]')).toBeTruthy();
  });

  it('should keep the header empty (childless) when no title/description nor header slot is provided', () => {
    const fixture = TestBed.createComponent(NoHeaderHostComponent);
    fixture.detectChanges();

    const header = fixture.debugElement.query(By.css('.psh-card-header'));
    expect(header).toBeTruthy();
    // Header vide → masqué en CSS via `.psh-card-header:not(:has(*))`.
    expect(header.nativeElement.children.length).toBe(0);
  });
});
