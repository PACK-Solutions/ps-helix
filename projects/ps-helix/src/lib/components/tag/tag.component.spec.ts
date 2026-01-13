import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PshTagComponent } from './tag.component';
import { TagVariant, TagSize } from './tag.types';

@Component({
  selector: 'test-host',
  imports: [PshTagComponent],
  template: `<psh-tag>{{ projectedContent }}</psh-tag>`
})
class TestHostComponent {
  projectedContent = 'Projected Tag';
}

describe('PshTagComponent', () => {
  let fixture: ComponentFixture<PshTagComponent>;

  const getTagElement = () =>
    fixture.nativeElement.querySelector('.tag') as HTMLElement;

  const getCloseButton = () =>
    fixture.nativeElement.querySelector('.tag-close') as HTMLButtonElement;

  const getIconElement = () =>
    fixture.nativeElement.querySelector('.tag i:not(.tag-close i)') as HTMLElement;

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
  });

  describe('Size classes', () => {
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
});
