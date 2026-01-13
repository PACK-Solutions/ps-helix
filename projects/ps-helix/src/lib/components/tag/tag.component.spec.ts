import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PshTagComponent, TAG_CONFIG } from './tag.component';
import { TagVariant, TagSize, TagConfig } from './tag.types';

@Component({
  selector: 'test-host',
  imports: [PshTagComponent],
  template: `<psh-tag [ariaLabel]="ariaLabel">{{ projectedContent }}</psh-tag>`
})
class TestHostComponent {
  projectedContent = 'Projected Tag';
  ariaLabel: string | undefined;
}

@Component({
  selector: 'test-host-interactive',
  imports: [PshTagComponent],
  template: `<psh-tag [interactive]="true" [closable]="true">Interactive Tag</psh-tag>`
})
class TestHostInteractiveComponent {}

describe('PshTagComponent', () => {
  let fixture: ComponentFixture<PshTagComponent>;

  const getTagElement = () =>
    fixture.nativeElement.querySelector('.tag') as HTMLElement;

  const getCloseButton = () =>
    fixture.nativeElement.querySelector('.tag-close') as HTMLButtonElement;

  const getIconElement = () =>
    fixture.nativeElement.querySelector('.tag i:not(.tag-close i)') as HTMLElement;

  const getContentSpan = () =>
    fixture.nativeElement.querySelector('.tag-content') as HTMLSpanElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshTagComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshTagComponent);
    fixture.detectChanges();
  });

  describe('Default rendering', () => {
    it('should render with default values', () => {
      expect(getTagElement()).toBeTruthy();
      expect(getTagElement().classList.contains('primary')).toBe(true);
      expect(getTagElement().classList.contains('disabled')).toBe(false);
    });

    it('should display default content "Tag"', () => {
      expect(getTagElement().textContent?.trim()).toBe('Tag');
    });

    it('should not render close button by default', () => {
      expect(getCloseButton()).toBeNull();
    });

    it('should not render icon by default', () => {
      expect(getIconElement()).toBeNull();
    });
  });

  describe('Variant classes', () => {
    const allVariants: TagVariant[] = ['primary', 'secondary', 'success', 'warning', 'danger'];

    it.each<[TagVariant]>([
      ['primary'],
      ['secondary'],
      ['success'],
      ['warning'],
      ['danger']
    ])('should apply "%s" variant class', (variant) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(getTagElement().classList.contains(variant)).toBe(true);
    });

    it('should switch between variants correctly', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(getTagElement().classList.contains('primary')).toBe(true);

      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();
      expect(getTagElement().classList.contains('danger')).toBe(true);
      expect(getTagElement().classList.contains('primary')).toBe(false);
    });

    it('should have exactly one variant class at a time', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      const activeVariants = allVariants.filter(v =>
        getTagElement().classList.contains(v)
      );
      expect(activeVariants).toHaveLength(1);
      expect(activeVariants[0]).toBe('success');
    });

    it.each<[TagVariant]>([
      ['primary'],
      ['secondary'],
      ['success'],
      ['warning'],
      ['danger']
    ])('should ensure mutual exclusivity when switching to "%s"', (targetVariant) => {
      allVariants.forEach(initialVariant => {
        fixture.componentRef.setInput('variant', initialVariant);
        fixture.detectChanges();
        fixture.componentRef.setInput('variant', targetVariant);
        fixture.detectChanges();

        const activeVariants = allVariants.filter(v =>
          getTagElement().classList.contains(v)
        );
        expect(activeVariants).toEqual([targetVariant]);
      });
    });
  });

  describe('Size classes', () => {
    const allSizes: TagSize[] = ['small', 'medium', 'large'];

    it.each<[TagSize]>([['small'], ['medium'], ['large']])(
      'should apply appropriate class for "%s" size',
      (size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        if (size === 'medium') {
          expect(getTagElement().classList.contains('small')).toBe(false);
          expect(getTagElement().classList.contains('large')).toBe(false);
        } else {
          expect(getTagElement().classList.contains(size)).toBe(true);
        }
      }
    );

    it('should have at most one size class at a time', () => {
      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();

      const sizeClasses = ['small', 'large'];
      const activeSizes = sizeClasses.filter(s =>
        getTagElement().classList.contains(s)
      );
      expect(activeSizes).toHaveLength(1);
    });

    it('should ensure mutual exclusivity between size classes', () => {
      fixture.componentRef.setInput('size', 'small');
      fixture.detectChanges();
      expect(getTagElement().classList.contains('small')).toBe(true);

      fixture.componentRef.setInput('size', 'large');
      fixture.detectChanges();
      expect(getTagElement().classList.contains('large')).toBe(true);
      expect(getTagElement().classList.contains('small')).toBe(false);
    });
  });

  describe('Icon rendering', () => {
    it('should render icon when provided', () => {
      fixture.componentRef.setInput('icon', 'star');
      fixture.detectChanges();

      const icon = getIconElement();
      expect(icon).toBeTruthy();
      expect(icon.classList.contains('ph-star')).toBe(true);
    });

    it('should have aria-hidden on icon', () => {
      fixture.componentRef.setInput('icon', 'star');
      fixture.detectChanges();

      expect(getIconElement().getAttribute('aria-hidden')).toBe('true');
    });

    it('should not render icon when not provided', () => {
      expect(getIconElement()).toBeNull();
    });

    it('should have ph base class on icon', () => {
      fixture.componentRef.setInput('icon', 'check');
      fixture.detectChanges();

      const icon = getIconElement();
      expect(icon.classList.contains('ph')).toBe(true);
      expect(icon.classList.contains('ph-check')).toBe(true);
    });

    it('should update icon class when icon changes', () => {
      fixture.componentRef.setInput('icon', 'star');
      fixture.detectChanges();
      expect(getIconElement().classList.contains('ph-star')).toBe(true);

      fixture.componentRef.setInput('icon', 'heart');
      fixture.detectChanges();
      expect(getIconElement().classList.contains('ph-heart')).toBe(true);
      expect(getIconElement().classList.contains('ph-star')).toBe(false);
    });
  });

  describe('Closable behavior', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();
    });

    it('should render close button when closable is true', () => {
      expect(getCloseButton()).toBeTruthy();
    });

    it('should have correct aria-label on close button', () => {
      expect(getCloseButton().getAttribute('aria-label')).toBe('Supprimer le tag');
    });

    it('should use custom closeLabel when provided', () => {
      fixture.componentRef.setInput('closeLabel', "Fermer l'element");
      fixture.detectChanges();

      expect(getCloseButton().getAttribute('aria-label')).toBe("Fermer l'element");
    });

    it('should emit closed event when close button is clicked', () => {
      const closeSpy = jest.fn();
      fixture.componentInstance.closed.subscribe(closeSpy);

      getCloseButton().click();

      expect(closeSpy).toHaveBeenCalledTimes(1);
    });

    it('should stop propagation when close button is clicked', () => {
      const clickSpy = jest.fn();
      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      getCloseButton().click();

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit closed event when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const closeSpy = jest.fn();
      fixture.componentInstance.closed.subscribe(closeSpy);

      getCloseButton().click();

      expect(closeSpy).not.toHaveBeenCalled();
    });

    it('should disable close button when tag is disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getCloseButton().disabled).toBe(true);
    });

    it('should have type="button" on close button', () => {
      expect(getCloseButton().getAttribute('type')).toBe('button');
    });

    it('should have close icon with aria-hidden', () => {
      const closeIcon = getCloseButton().querySelector('i');
      expect(closeIcon).toBeTruthy();
      expect(closeIcon?.classList.contains('ph-x')).toBe(true);
      expect(closeIcon?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Interactive behavior', () => {
    describe('Click handling', () => {
      it('should emit clicked event when interactive and clicked', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.clicked.subscribe(clickSpy);

        getTagElement().click();

        expect(clickSpy).toHaveBeenCalledTimes(1);
      });

      it('should emit MouseEvent object when clicked', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        let emittedEvent: MouseEvent | null = null;
        fixture.componentInstance.clicked.subscribe(e => emittedEvent = e);

        getTagElement().click();

        expect(emittedEvent).toBeInstanceOf(MouseEvent);
      });

      it('should not emit clicked event when not interactive', () => {
        const clickSpy = jest.fn();
        fixture.componentInstance.clicked.subscribe(clickSpy);

        getTagElement().click();

        expect(clickSpy).not.toHaveBeenCalled();
      });

      it('should not emit clicked event when disabled', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.clicked.subscribe(clickSpy);

        getTagElement().click();

        expect(clickSpy).not.toHaveBeenCalled();
      });
    });

    describe('Keyboard handling', () => {
      it('should emit clicked on Enter key when interactive', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.clicked.subscribe(clickSpy);

        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        getTagElement().dispatchEvent(event);

        expect(clickSpy).toHaveBeenCalledTimes(1);
      });

      it('should emit clicked on Space key when interactive', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.clicked.subscribe(clickSpy);

        const event = new KeyboardEvent('keydown', { key: ' ' });
        getTagElement().dispatchEvent(event);

        expect(clickSpy).toHaveBeenCalledTimes(1);
      });

      it('should not emit on other keys', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.clicked.subscribe(clickSpy);

        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        getTagElement().dispatchEvent(event);

        expect(clickSpy).not.toHaveBeenCalled();
      });

      it('should prevent default on Enter key', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true });
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

        getTagElement().dispatchEvent(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
      });

      it('should prevent default on Space key', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

        getTagElement().dispatchEvent(event);

        expect(preventDefaultSpy).toHaveBeenCalled();
      });

      it('should not emit when disabled', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const clickSpy = jest.fn();
        fixture.componentInstance.clicked.subscribe(clickSpy);

        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        getTagElement().dispatchEvent(event);

        expect(clickSpy).not.toHaveBeenCalled();
      });

      it('should not emit when not interactive', () => {
        const clickSpy = jest.fn();
        fixture.componentInstance.clicked.subscribe(clickSpy);

        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        getTagElement().dispatchEvent(event);

        expect(clickSpy).not.toHaveBeenCalled();
      });

      it('should not prevent default on Tab key', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
        const preventDefaultSpy = jest.spyOn(event, 'preventDefault');

        getTagElement().dispatchEvent(event);

        expect(preventDefaultSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('Disabled state', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
    });

    it('should apply disabled class', () => {
      expect(getTagElement().classList.contains('disabled')).toBe(true);
    });

    it('should have aria-disabled attribute', () => {
      expect(getTagElement().getAttribute('aria-disabled')).toBe('true');
    });

    it('should have data-state="disabled"', () => {
      expect(getTagElement().getAttribute('data-state')).toBe('disabled');
    });

    it('should not have aria-disabled when not disabled', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      expect(getTagElement().getAttribute('aria-disabled')).toBeNull();
    });
  });

  describe('Accessibility', () => {
    describe('role attribute', () => {
      it('should have role="status" when not interactive', () => {
        expect(getTagElement().getAttribute('role')).toBe('status');
      });

      it('should have role="button" when interactive', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        expect(getTagElement().getAttribute('role')).toBe('button');
      });
    });

    describe('tabindex attribute', () => {
      it('should have tabindex="-1" when not interactive', () => {
        expect(getTagElement().getAttribute('tabindex')).toBe('-1');
      });

      it('should have tabindex="0" when interactive', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        expect(getTagElement().getAttribute('tabindex')).toBe('0');
      });

      it('should have tabindex="-1" when interactive but disabled', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getTagElement().getAttribute('tabindex')).toBe('-1');
      });
    });

    describe('aria-label attribute', () => {
      it('should use custom ariaLabel when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom label');
        fixture.detectChanges();

        expect(getTagElement().getAttribute('aria-label')).toBe('Custom label');
      });

      it('should fall back to content when no ariaLabel', () => {
        fixture.componentRef.setInput('content', 'Status tag');
        fixture.detectChanges();

        expect(getTagElement().getAttribute('aria-label')).toBe('Status tag');
      });

      it('should fall back to "Tag" when content is empty', () => {
        fixture.componentRef.setInput('content', '');
        fixture.detectChanges();

        expect(getTagElement().getAttribute('aria-label')).toBe('Tag');
      });

      it('should prioritize ariaLabel over content', () => {
        fixture.componentRef.setInput('ariaLabel', 'Priority label');
        fixture.componentRef.setInput('content', 'Content text');
        fixture.detectChanges();

        expect(getTagElement().getAttribute('aria-label')).toBe('Priority label');
      });

      it('should match visible content when using content input', () => {
        fixture.componentRef.setInput('content', 'Status Active');
        fixture.detectChanges();

        const visibleText = getTagElement().textContent?.trim();
        const ariaLabel = getTagElement().getAttribute('aria-label');

        expect(ariaLabel).toBe(visibleText);
      });
    });

    describe('focus management', () => {
      it('should be focusable when interactive', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        getTagElement().focus();
        expect(document.activeElement).toBe(getTagElement());
      });

      it('should not be focusable via tab when not interactive', () => {
        expect(getTagElement().getAttribute('tabindex')).toBe('-1');
      });

      it('should remove from tab order when disabled', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getTagElement().getAttribute('tabindex')).toBe('-1');
      });
    });
  });

  describe('data-state attribute', () => {
    it('should have data-state="default" when not disabled', () => {
      expect(getTagElement().getAttribute('data-state')).toBe('default');
    });

    it('should have data-state="disabled" when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getTagElement().getAttribute('data-state')).toBe('disabled');
    });
  });

  describe('Dynamic property toggling', () => {
    it('should toggle disabled state dynamically', () => {
      expect(getTagElement().classList.contains('disabled')).toBe(false);

      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(getTagElement().classList.contains('disabled')).toBe(true);

      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      expect(getTagElement().classList.contains('disabled')).toBe(false);
    });

    it('should toggle interactive state dynamically', () => {
      expect(getTagElement().getAttribute('role')).toBe('status');

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();
      expect(getTagElement().getAttribute('role')).toBe('button');
      expect(getTagElement().getAttribute('tabindex')).toBe('0');

      fixture.componentRef.setInput('interactive', false);
      fixture.detectChanges();
      expect(getTagElement().getAttribute('role')).toBe('status');
      expect(getTagElement().getAttribute('tabindex')).toBe('-1');
    });

    it('should toggle closable state dynamically', () => {
      expect(getCloseButton()).toBeNull();

      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();
      expect(getCloseButton()).toBeTruthy();

      fixture.componentRef.setInput('closable', false);
      fixture.detectChanges();
      expect(getCloseButton()).toBeNull();
    });

    it('should toggle icon dynamically', () => {
      expect(getIconElement()).toBeNull();

      fixture.componentRef.setInput('icon', 'star');
      fixture.detectChanges();
      expect(getIconElement()).toBeTruthy();

      fixture.componentRef.setInput('icon', undefined);
      fixture.detectChanges();
      expect(getIconElement()).toBeNull();
    });
  });

  describe('DOM structure', () => {
    it('should have tag-content span for text', () => {
      expect(getContentSpan()).toBeTruthy();
      expect(getContentSpan().classList.contains('tag-content')).toBe(true);
    });

    it('should render icon before content', () => {
      fixture.componentRef.setInput('icon', 'star');
      fixture.detectChanges();

      const children = Array.from(getTagElement().children);
      const iconIndex = children.findIndex(el => el.tagName === 'I');
      const contentIndex = children.findIndex(el => el.classList.contains('tag-content'));

      expect(iconIndex).toBeLessThan(contentIndex);
    });

    it('should render close button after content', () => {
      fixture.componentRef.setInput('closable', true);
      fixture.detectChanges();

      const children = Array.from(getTagElement().children);
      const contentIndex = children.findIndex(el => el.classList.contains('tag-content'));
      const buttonIndex = children.findIndex(el => el.classList.contains('tag-close'));

      expect(contentIndex).toBeLessThan(buttonIndex);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty content string', () => {
      fixture.componentRef.setInput('content', '');
      fixture.detectChanges();

      expect(getTagElement().getAttribute('aria-label')).toBe('Tag');
    });

    it('should handle whitespace-only content', () => {
      fixture.componentRef.setInput('content', '   ');
      fixture.detectChanges();

      expect(getTagElement().getAttribute('aria-label')).toBe('   ');
    });

    it('should handle special characters in content', () => {
      fixture.componentRef.setInput('content', '<script>alert("xss")</script>');
      fixture.detectChanges();

      expect(getContentSpan().textContent).toContain('<script>');
      expect(getTagElement().querySelector('script')).toBeNull();
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(1000);
      fixture.componentRef.setInput('content', longContent);
      fixture.detectChanges();

      expect(getContentSpan().textContent?.trim()).toBe(longContent);
    });

    it('should handle rapid state changes', () => {
      for (let i = 0; i < 10; i++) {
        fixture.componentRef.setInput('disabled', i % 2 === 0);
        fixture.componentRef.setInput('interactive', i % 2 === 1);
        fixture.detectChanges();
      }

      expect(getTagElement().classList.contains('disabled')).toBe(false);
      expect(getTagElement().getAttribute('role')).toBe('button');
    });

    it('should handle combined interactive and disabled states', () => {
      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getTagElement().getAttribute('role')).toBe('button');
      expect(getTagElement().getAttribute('tabindex')).toBe('-1');
      expect(getTagElement().getAttribute('aria-disabled')).toBe('true');
    });
  });
});

describe('PshTagComponent with ng-content', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;

  const getTagElement = () =>
    hostFixture.nativeElement.querySelector('.tag') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
  });

  it('should render projected content', () => {
    expect(getTagElement().textContent?.trim()).toBe('Projected Tag');
  });

  it('should update when projected content changes', () => {
    hostFixture.componentInstance.projectedContent = 'Updated Tag';
    hostFixture.detectChanges();

    expect(getTagElement().textContent?.trim()).toBe('Updated Tag');
  });

  describe('Accessibility with projected content', () => {
    it('should use provided ariaLabel for screen readers', () => {
      hostFixture.componentInstance.ariaLabel = 'Projected Tag';
      hostFixture.detectChanges();

      expect(getTagElement().getAttribute('aria-label')).toBe('Projected Tag');
    });

    it('should require explicit ariaLabel when using ng-content for WCAG compliance', () => {
      const ariaLabel = getTagElement().getAttribute('aria-label');
      const visibleText = getTagElement().textContent?.trim();

      expect(ariaLabel).toBe('Tag');
      expect(visibleText).toBe('Projected Tag');
      expect(ariaLabel).not.toBe(visibleText);
    });

    it('should have coherent aria-label when ariaLabel is provided', () => {
      hostFixture.componentInstance.ariaLabel = 'Projected Tag';
      hostFixture.detectChanges();

      const ariaLabel = getTagElement().getAttribute('aria-label');
      const visibleText = getTagElement().textContent?.trim();

      expect(ariaLabel).toBe(visibleText);
    });
  });
});

describe('PshTagComponent with TAG_CONFIG injection', () => {
  describe('Custom configuration', () => {
    const customConfig: Partial<TagConfig> = {
      variant: 'danger',
      size: 'large',
      closable: true,
      disabled: false,
      interactive: true,
      closeLabel: 'Remove item'
    };

    let fixture: ComponentFixture<PshTagComponent>;

    const getTagElement = () =>
      fixture.nativeElement.querySelector('.tag') as HTMLElement;

    const getCloseButton = () =>
      fixture.nativeElement.querySelector('.tag-close') as HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PshTagComponent],
        providers: [
          { provide: TAG_CONFIG, useValue: customConfig }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(PshTagComponent);
      fixture.detectChanges();
    });

    it('should use variant from injected config', () => {
      expect(getTagElement().classList.contains('danger')).toBe(true);
    });

    it('should use size from injected config', () => {
      expect(getTagElement().classList.contains('large')).toBe(true);
    });

    it('should use closable from injected config', () => {
      expect(getCloseButton()).toBeTruthy();
    });

    it('should use closeLabel from injected config', () => {
      expect(getCloseButton().getAttribute('aria-label')).toBe('Remove item');
    });

    it('should use interactive from injected config', () => {
      expect(getTagElement().getAttribute('role')).toBe('button');
      expect(getTagElement().getAttribute('tabindex')).toBe('0');
    });

    it('should allow input to override config values', () => {
      fixture.componentRef.setInput('variant', 'success');
      fixture.detectChanges();

      expect(getTagElement().classList.contains('success')).toBe(true);
      expect(getTagElement().classList.contains('danger')).toBe(false);
    });
  });

  describe('Partial configuration', () => {
    const partialConfig: Partial<TagConfig> = {
      variant: 'warning'
    };

    let fixture: ComponentFixture<PshTagComponent>;

    const getTagElement = () =>
      fixture.nativeElement.querySelector('.tag') as HTMLElement;

    const getCloseButton = () =>
      fixture.nativeElement.querySelector('.tag-close') as HTMLButtonElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PshTagComponent],
        providers: [
          { provide: TAG_CONFIG, useValue: partialConfig }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(PshTagComponent);
      fixture.detectChanges();
    });

    it('should use provided config value', () => {
      expect(getTagElement().classList.contains('warning')).toBe(true);
    });

    it('should fall back to defaults for missing config values', () => {
      expect(getCloseButton()).toBeNull();
      expect(getTagElement().getAttribute('role')).toBe('status');
    });
  });

  describe('Empty configuration', () => {
    let fixture: ComponentFixture<PshTagComponent>;

    const getTagElement = () =>
      fixture.nativeElement.querySelector('.tag') as HTMLElement;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PshTagComponent],
        providers: [
          { provide: TAG_CONFIG, useValue: {} }
        ]
      }).compileComponents();

      fixture = TestBed.createComponent(PshTagComponent);
      fixture.detectChanges();
    });

    it('should use all default values', () => {
      expect(getTagElement().classList.contains('primary')).toBe(true);
      expect(getTagElement().classList.contains('small')).toBe(false);
      expect(getTagElement().classList.contains('large')).toBe(false);
      expect(getTagElement().getAttribute('role')).toBe('status');
    });
  });
});

describe('PshTagComponent keyboard navigation with closable', () => {
  let hostFixture: ComponentFixture<TestHostInteractiveComponent>;

  const getTagElement = () =>
    hostFixture.nativeElement.querySelector('.tag') as HTMLElement;

  const getCloseButton = () =>
    hostFixture.nativeElement.querySelector('.tag-close') as HTMLButtonElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostInteractiveComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostInteractiveComponent);
    hostFixture.detectChanges();
  });

  it('should allow focus on both tag and close button', () => {
    expect(getTagElement().getAttribute('tabindex')).toBe('0');
    expect(getCloseButton().disabled).toBe(false);
  });

  it('should maintain separate focus targets for tag and close button', () => {
    getTagElement().focus();
    expect(document.activeElement).toBe(getTagElement());

    getCloseButton().focus();
    expect(document.activeElement).toBe(getCloseButton());
  });
});
