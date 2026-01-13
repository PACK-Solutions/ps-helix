import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PshButtonComponent } from './button.component';
import { ButtonAppearance, ButtonVariant, ButtonSize, ButtonIconPosition } from './button.types';

@Component({
  selector: 'test-host',
  imports: [PshButtonComponent],
  template: `<psh-button [loading]="loading">{{ buttonText }}</psh-button>`
})
class TestHostComponent {
  buttonText = 'Click me';
  loading = false;
}

@Component({
  selector: 'test-host-icon-only',
  imports: [PshButtonComponent],
  template: `<psh-button [icon]="'heart'" [iconPosition]="'only'" [iconOnlyText]="'Like'">Hidden text</psh-button>`
})
class TestHostIconOnlyComponent {}

@Component({
  selector: 'test-host-explicit-label',
  imports: [PshButtonComponent],
  template: `<psh-button [ariaLabel]="explicitLabel">{{ buttonText }}</psh-button>`
})
class TestHostExplicitLabelComponent {
  buttonText = 'Click me';
  explicitLabel = 'Custom label';
}

describe('PshButtonComponent', () => {
  let fixture: ComponentFixture<PshButtonComponent>;

  const getButton = () =>
    fixture.nativeElement.querySelector('button') as HTMLButtonElement;

  const getLoader = () =>
    fixture.nativeElement.querySelector('.loader[aria-hidden="true"]') as HTMLElement;

  const getIcon = () =>
    fixture.nativeElement.querySelector('i.ph[aria-hidden="true"]') as HTMLElement;

  const ALL_VARIANTS = ['primary', 'secondary', 'success', 'warning', 'danger'] as const;
  const ALL_SIZES = ['small', 'medium', 'large'] as const;
  const ALL_APPEARANCES = ['filled', 'outline', 'rounded', 'text'] as const;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshButtonComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render a button element', () => {
      expect(getButton()).toBeTruthy();
    });

    it('should display loading text when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getButton().textContent).toContain('Loading...');
    });

    it('should display custom loading text when provided', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('loadingText', 'Please wait...');
      fixture.detectChanges();

      expect(getButton().textContent).toContain('Please wait...');
    });

    it('should show loader element when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getLoader()).toBeTruthy();
    });

    it('should not show loader element when not loading', () => {
      expect(getLoader()).toBeFalsy();
    });

    it('should hide loading text for icon-only buttons', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('iconPosition', 'only');
      fixture.detectChanges();

      expect(getLoader()).toBeTruthy();
      expect(getButton().textContent?.trim()).toBe('');
    });
  });

  describe('Click behavior', () => {
    it('should emit clicked event on click', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      getButton().click();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit MouseEvent on click', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      getButton().click();

      expect(clickSpy).toHaveBeenCalledWith(expect.any(MouseEvent));
    });

    it('should NOT emit clicked when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      getButton().click();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should NOT emit clicked when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      getButton().click();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should emit on each click when enabled', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      getButton().click();
      getButton().click();
      getButton().click();

      expect(clickSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('data-state attribute', () => {
    it('should have data-state="default" in normal state', () => {
      expect(getButton().getAttribute('data-state')).toBe('default');
    });

    it('should have data-state="disabled" when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getButton().getAttribute('data-state')).toBe('disabled');
    });

    it('should have data-state="loading" when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getButton().getAttribute('data-state')).toBe('loading');
    });

    it('should prioritize disabled over loading for data-state', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getButton().getAttribute('data-state')).toBe('disabled');
    });
  });

  describe('Accessibility', () => {
    describe('aria-label attribute', () => {
      it('should not have aria-label when no content is projected', () => {
        expect(getButton().getAttribute('aria-label')).toBeFalsy();
      });

      it('should apply custom ariaLabel when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Submit form');
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Submit form');
      });

      it('should use loadingText as aria-label when loading', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Loading...');
      });

      it('should use custom loadingText as aria-label when loading', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.componentRef.setInput('loadingText', 'Saving...');
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Saving...');
      });

      it('should use disabledText as aria-label when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('This action is currently unavailable');
      });

      it('should use custom disabledText as aria-label when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.componentRef.setInput('disabledText', 'Not available');
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Not available');
      });

      it('should use iconOnlyText as aria-label for icon-only buttons', () => {
        fixture.componentRef.setInput('iconPosition', 'only');
        fixture.componentRef.setInput('iconOnlyText', 'Add to favorites');
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Add to favorites');
      });

      it('should fallback to "Button" for icon-only without iconOnlyText', () => {
        fixture.componentRef.setInput('iconPosition', 'only');
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Button');
      });

      it('should prioritize explicit ariaLabel over computed labels', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom label');
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Custom label');
      });

      it('should prioritize explicit ariaLabel over disabled state', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom disabled label');
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Custom disabled label');
      });

      it('should prioritize explicit ariaLabel over iconOnly', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom icon label');
        fixture.componentRef.setInput('iconPosition', 'only');
        fixture.componentRef.setInput('iconOnlyText', 'Icon only text');
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Custom icon label');
      });

      it('should prioritize loadingText over disabledText when both loading and disabled', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Loading...');
      });

      it('should prioritize disabledText over iconOnlyText when disabled and iconOnly', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.componentRef.setInput('iconPosition', 'only');
        fixture.componentRef.setInput('iconOnlyText', 'Icon action');
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('This action is currently unavailable');
      });

      it('should prioritize loadingText over iconOnlyText when loading and iconOnly', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.componentRef.setInput('iconPosition', 'only');
        fixture.componentRef.setInput('iconOnlyText', 'Icon action');
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-label')).toBe('Loading...');
      });
    });

    describe('aria-busy attribute', () => {
      it('should have aria-busy="false" by default', () => {
        expect(getButton().getAttribute('aria-busy')).toBe('false');
      });

      it('should have aria-busy="true" when loading', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        expect(getButton().getAttribute('aria-busy')).toBe('true');
      });
    });

    describe('disabled attribute', () => {
      it('should not be disabled by default', () => {
        expect(getButton().disabled).toBe(false);
      });

      it('should be disabled when disabled input is true', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getButton().disabled).toBe(true);
      });

      it('should be disabled when loading', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        expect(getButton().disabled).toBe(true);
      });
    });
  });

  describe('Button type attribute', () => {
    it('should have type="button" by default', () => {
      expect(getButton().getAttribute('type')).toBe('button');
    });

    it.each<['button' | 'submit' | 'reset']>([['button'], ['submit'], ['reset']])(
      'should have type="%s" when type input is "%s"',
      (type) => {
        fixture.componentRef.setInput('type', type);
        fixture.detectChanges();

        expect(getButton().getAttribute('type')).toBe(type);
      }
    );
  });

  describe('Icon visibility', () => {
    it('should not show icon by default', () => {
      expect(getIcon()).toBeFalsy();
    });

    it('should show icon with aria-hidden when icon is set', () => {
      fixture.componentRef.setInput('icon', 'heart');
      fixture.detectChanges();

      expect(getIcon()).toBeTruthy();
      expect(getIcon().getAttribute('aria-hidden')).toBe('true');
    });

    it.each<[ButtonIconPosition]>([['left'], ['right'], ['only']])(
      'should show icon when iconPosition is "%s"',
      (position) => {
        fixture.componentRef.setInput('icon', 'star');
        fixture.componentRef.setInput('iconPosition', position);
        fixture.detectChanges();

        expect(getIcon()).toBeTruthy();
      }
    );

    it('should hide icon when loading', () => {
      fixture.componentRef.setInput('icon', 'heart');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getIcon()).toBeFalsy();
    });

    it('should have correct icon class format with ph prefix', () => {
      fixture.componentRef.setInput('icon', 'heart');
      fixture.detectChanges();

      const icon = getIcon();
      expect(icon).toBeTruthy();
      expect(icon.classList.contains('ph')).toBe(true);
      expect(icon.classList.contains('ph-heart')).toBe(true);
    });

    it('should render icon before content when iconPosition is left', () => {
      fixture.componentRef.setInput('icon', 'heart');
      fixture.componentRef.setInput('iconPosition', 'left');
      fixture.detectChanges();

      const buttonContent = fixture.nativeElement.querySelector('.button-content');
      const children = Array.from(buttonContent.children) as HTMLElement[];
      const iconIndex = children.findIndex(el => el.tagName === 'I' && el.classList.contains('ph'));
      const contentIndex = children.findIndex(el => el.tagName === 'NG-CONTENT' || el.nodeName === '#text' || !el.classList.contains('ph'));

      expect(iconIndex).toBeLessThan(contentIndex === -1 ? children.length : contentIndex);
    });

    it('should render icon after content when iconPosition is right', () => {
      fixture.componentRef.setInput('icon', 'heart');
      fixture.componentRef.setInput('iconPosition', 'right');
      fixture.detectChanges();

      const buttonContent = fixture.nativeElement.querySelector('.button-content');
      const icon = buttonContent.querySelector('i.ph');
      expect(icon).toBeTruthy();
      expect(icon.previousElementSibling).toBeFalsy();
    });
  });

  describe('Variant classes', () => {
    it.each<[ButtonVariant]>([
      ['primary'],
      ['secondary'],
      ['success'],
      ['warning'],
      ['danger']
    ])('should apply "%s" variant class', (variant) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(getButton().classList.contains(variant)).toBe(true);
    });

    it('should have primary variant by default', () => {
      expect(getButton().classList.contains('primary')).toBe(true);
    });

    it('should switch between variants', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(getButton().classList.contains('primary')).toBe(true);

      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();
      expect(getButton().classList.contains('danger')).toBe(true);
      expect(getButton().classList.contains('primary')).toBe(false);
    });

    it.each<[ButtonVariant]>([
      ['primary'],
      ['secondary'],
      ['success'],
      ['warning'],
      ['danger']
    ])('should only have "%s" variant class and no other variant classes', (variant) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      const otherVariants = ALL_VARIANTS.filter(v => v !== variant);
      otherVariants.forEach(otherVariant => {
        expect(getButton().classList.contains(otherVariant)).toBe(false);
      });
    });
  });

  describe('Size classes', () => {
    it.each<[ButtonSize]>([['small'], ['medium'], ['large']])(
      'should apply "%s" size class',
      (size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        expect(getButton().classList.contains(size)).toBe(true);
      }
    );

    it('should have medium size by default', () => {
      expect(getButton().classList.contains('medium')).toBe(true);
    });

    it.each<[ButtonSize]>([['small'], ['medium'], ['large']])(
      'should only have "%s" size class and no other size classes',
      (size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        const otherSizes = ALL_SIZES.filter(s => s !== size);
        otherSizes.forEach(otherSize => {
          expect(getButton().classList.contains(otherSize)).toBe(false);
        });
      }
    );
  });

  describe('Appearance classes', () => {
    it.each<[ButtonAppearance]>([['filled'], ['outline'], ['rounded'], ['text']])(
      'should apply "%s" appearance class',
      (appearance) => {
        fixture.componentRef.setInput('appearance', appearance);
        fixture.detectChanges();

        expect(getButton().classList.contains(appearance)).toBe(true);
      }
    );

    it('should have filled appearance by default', () => {
      expect(getButton().classList.contains('filled')).toBe(true);
    });

    it.each<[ButtonAppearance]>([['filled'], ['outline'], ['rounded'], ['text']])(
      'should only have "%s" appearance class and no other appearance classes',
      (appearance) => {
        fixture.componentRef.setInput('appearance', appearance);
        fixture.detectChanges();

        const otherAppearances = ALL_APPEARANCES.filter(a => a !== appearance);
        otherAppearances.forEach(otherAppearance => {
          expect(getButton().classList.contains(otherAppearance)).toBe(false);
        });
      }
    );
  });

  describe('State classes', () => {
    it('should apply disabled class when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getButton().classList.contains('disabled')).toBe(true);
    });

    it('should apply loading class when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getButton().classList.contains('loading')).toBe(true);
    });

    it('should apply icon-only class when iconPosition is only', () => {
      fixture.componentRef.setInput('iconPosition', 'only');
      fixture.detectChanges();

      expect(getButton().classList.contains('icon-only')).toBe(true);
    });
  });

  describe('Combined states', () => {
    it('should handle disabled + loading + iconOnly simultaneously', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('iconPosition', 'only');
      fixture.componentRef.setInput('icon', 'heart');
      fixture.detectChanges();

      const button = getButton();
      expect(button.disabled).toBe(true);
      expect(button.getAttribute('data-state')).toBe('disabled');
      expect(button.classList.contains('icon-only')).toBe(true);
      expect(button.classList.contains('loading')).toBe(true);
      expect(button.classList.contains('disabled')).toBe(true);
    });

    it('should maintain disabled state when loading changes after disabled is set', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(getButton().getAttribute('data-state')).toBe('disabled');

      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(getButton().getAttribute('data-state')).toBe('disabled');

      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();
      expect(getButton().getAttribute('data-state')).toBe('disabled');
    });

    it('should return to default state when all special states are cleared', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();
      expect(getButton().getAttribute('data-state')).toBe('disabled');

      fixture.componentRef.setInput('disabled', false);
      fixture.componentRef.setInput('loading', false);
      fixture.detectChanges();
      expect(getButton().getAttribute('data-state')).toBe('default');
    });
  });

  describe('Loader behavior', () => {
    it('should show spinner loader for icon-only buttons when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('iconPosition', 'only');
      fixture.componentRef.setInput('icon', 'heart');
      fixture.detectChanges();

      expect(getLoader()).toBeTruthy();
    });

    it('should hide text but show spinner for icon-only loading buttons', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('iconPosition', 'only');
      fixture.detectChanges();

      expect(getLoader()).toBeTruthy();
      const buttonText = getButton().textContent?.trim();
      expect(buttonText).toBe('');
    });

    it('should show both spinner and text for regular loading buttons', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.componentRef.setInput('loadingText', 'Saving...');
      fixture.detectChanges();

      expect(getLoader()).toBeTruthy();
      expect(getButton().textContent).toContain('Saving...');
    });
  });
});

describe('PshButtonComponent with ng-content', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;

  const getButton = () =>
    hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
  });

  it('should render projected text content', () => {
    expect(getButton().textContent).toContain('Click me');
  });

  it('should update when projected content changes', () => {
    hostFixture.componentInstance.buttonText = 'Submit';
    hostFixture.detectChanges();

    expect(getButton().textContent).toContain('Submit');
  });

  it('should hide projected content when loading', () => {
    hostFixture.componentInstance.loading = true;
    hostFixture.detectChanges();

    expect(getButton().textContent).not.toContain('Click me');
    expect(getButton().textContent).toContain('Loading...');
  });

  describe('automatic aria-label detection', () => {
    it('should automatically set aria-label from projected content', () => {
      hostFixture.detectChanges();
      expect(getButton().getAttribute('aria-label')).toBe('Click me');
    });

    it('should update aria-label when projected content changes', () => {
      hostFixture.componentInstance.buttonText = 'Submit';
      hostFixture.detectChanges();

      expect(getButton().getAttribute('aria-label')).toBe('Submit');
    });

    it('should trim whitespace from projected content for aria-label', () => {
      hostFixture.componentInstance.buttonText = '   Trimmed   ';
      hostFixture.detectChanges();

      expect(getButton().getAttribute('aria-label')).toBe('Trimmed');
    });

    it('should use loading text aria-label when loading instead of projected content', () => {
      hostFixture.componentInstance.loading = true;
      hostFixture.detectChanges();

      expect(getButton().getAttribute('aria-label')).toBe('Loading...');
    });
  });
});

describe('PshButtonComponent icon-only with ng-content', () => {
  let hostFixture: ComponentFixture<TestHostIconOnlyComponent>;

  const getButton = () =>
    hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostIconOnlyComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostIconOnlyComponent);
    hostFixture.detectChanges();
  });

  it('should hide projected content for icon-only buttons', () => {
    expect(getButton().textContent).not.toContain('Hidden text');
  });

  it('should have proper aria-label for icon-only button', () => {
    expect(getButton().getAttribute('aria-label')).toBe('Like');
  });

  it('should show icon for icon-only button', () => {
    const icon = hostFixture.nativeElement.querySelector('i[aria-hidden="true"]');
    expect(icon).toBeTruthy();
  });
});

describe('PshButtonComponent full width', () => {
  let fixture: ComponentFixture<PshButtonComponent>;

  const getHost = () => fixture.nativeElement as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshButtonComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshButtonComponent);
    fixture.detectChanges();
  });

  it('should not have full-width class by default', () => {
    expect(getHost().classList.contains('full-width')).toBe(false);
  });

  it('should have full-width class when fullWidth is true', () => {
    fixture.componentRef.setInput('fullWidth', true);
    fixture.detectChanges();

    expect(getHost().classList.contains('full-width')).toBe(true);
  });
});

describe('PshButtonComponent explicit ariaLabel override', () => {
  let hostFixture: ComponentFixture<TestHostExplicitLabelComponent>;

  const getButton = () =>
    hostFixture.nativeElement.querySelector('button') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostExplicitLabelComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostExplicitLabelComponent);
    hostFixture.detectChanges();
  });

  it('should use explicit ariaLabel instead of projected content', () => {
    expect(getButton().getAttribute('aria-label')).toBe('Custom label');
  });

  it('should update aria-label when explicit ariaLabel changes', () => {
    hostFixture.componentInstance.explicitLabel = 'Updated label';
    hostFixture.detectChanges();

    expect(getButton().getAttribute('aria-label')).toBe('Updated label');
  });

  it('should keep explicit ariaLabel even when projected content changes', () => {
    hostFixture.componentInstance.buttonText = 'New text';
    hostFixture.detectChanges();

    expect(getButton().getAttribute('aria-label')).toBe('Custom label');
  });
});
