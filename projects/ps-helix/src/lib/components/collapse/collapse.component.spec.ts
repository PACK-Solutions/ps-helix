import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PshCollapseComponent } from './collapse.component';
import { CollapseVariant, CollapseSize } from './collapse.types';

@Component({
  template: `
    <psh-collapse>
      <span collapse-header>Custom Header</span>
      <p>Projected content</p>
    </psh-collapse>
  `,
  imports: [PshCollapseComponent]
})
class TestHostComponent {}

@Component({
  template: `
    <psh-collapse [id]="'custom-collapse'">
      <span collapse-header>With ID</span>
      Content
    </psh-collapse>
  `,
  imports: [PshCollapseComponent]
})
class TestHostWithIdComponent {}

describe('PshCollapseComponent', () => {
  let fixture: ComponentFixture<PshCollapseComponent>;

  const getCollapseContainer = () =>
    fixture.nativeElement.querySelector('.collapse') as HTMLElement;

  const getHeaderButton = () =>
    fixture.nativeElement.querySelector('.collapse-header') as HTMLButtonElement;

  const getContentRegion = () =>
    fixture.nativeElement.querySelector('.collapse-content') as HTMLElement;

  const getIcon = () =>
    fixture.nativeElement.querySelector('i.ph') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshCollapseComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshCollapseComponent);
    fixture.detectChanges();
  });

  describe('Default rendering', () => {
    it('should render a collapse container', () => {
      expect(getCollapseContainer()).toBeTruthy();
    });

    it('should render a header button', () => {
      expect(getHeaderButton()).toBeTruthy();
      expect(getHeaderButton().tagName).toBe('BUTTON');
    });

    it('should render a content region', () => {
      expect(getContentRegion()).toBeTruthy();
    });

    it('should have type="button" on header', () => {
      expect(getHeaderButton().getAttribute('type')).toBe('button');
    });

    it('should render icon with aria-hidden', () => {
      expect(getIcon()).toBeTruthy();
      expect(getIcon().getAttribute('aria-hidden')).toBe('true');
    });

    it('should be collapsed by default', () => {
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
      expect(getCollapseContainer().getAttribute('data-state')).toBe('collapsed');
    });
  });

  describe('Content projection', () => {
    it('should project header content', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const headerContent = hostFixture.nativeElement.querySelector('[collapse-header]');
      expect(headerContent.textContent).toContain('Custom Header');
    });

    it('should project body content', async () => {
      const hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();

      const content = hostFixture.nativeElement.querySelector('.content-wrapper p');
      expect(content.textContent).toContain('Projected content');
    });
  });

  describe('User interactions - Click', () => {
    it('should expand on click when collapsed', () => {
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');

      getHeaderButton().click();
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');
      expect(getCollapseContainer().getAttribute('data-state')).toBe('expanded');
    });

    it('should collapse on click when expanded', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');

      getHeaderButton().click();
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
      expect(getCollapseContainer().getAttribute('data-state')).toBe('collapsed');
    });

    it('should not toggle when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getHeaderButton().click();
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
      expect(getCollapseContainer().getAttribute('data-state')).toBe('disabled');
    });
  });

  describe('User interactions - Keyboard', () => {
    it('should expand on Enter key when collapsed', () => {
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');

      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');
    });

    it('should expand on Space key when collapsed', () => {
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');

      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');
    });

    it('should collapse on Enter key when expanded', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();

      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
    });

    it('should collapse on Space key when expanded', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();

      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
    });

    it('should close on Escape key when expanded', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');

      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
    });

    it('should not respond to Escape when already collapsed', () => {
      const closedSpy = jest.fn();
      fixture.componentInstance.closed.subscribe(closedSpy);

      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
      expect(closedSpy).not.toHaveBeenCalled();
    });

    it('should not respond to keyboard when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
    });

    it('should not respond to Space when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
    });

    it('should not respond to irrelevant keys', () => {
      const toggledSpy = jest.fn();
      fixture.componentInstance.toggled.subscribe(toggledSpy);

      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));
      fixture.detectChanges();

      expect(toggledSpy).not.toHaveBeenCalled();
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Accessibility - ARIA attributes', () => {
    it('should have aria-expanded="false" when collapsed', () => {
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
    });

    it('should have aria-expanded="true" when expanded', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-controls pointing to content id', () => {
      const contentId = getContentRegion().id;
      expect(getHeaderButton().getAttribute('aria-controls')).toBe(contentId);
    });

    it('should have role="region" on content', () => {
      expect(getContentRegion().getAttribute('role')).toBe('region');
    });

    it('should have aria-labelledby pointing to header id', () => {
      const headerId = getHeaderButton().id;
      expect(getContentRegion().getAttribute('aria-labelledby')).toBe(headerId);
    });

    it('should have aria-hidden="true" on content when collapsed', () => {
      expect(getContentRegion().getAttribute('aria-hidden')).toBe('true');
    });

    it('should have aria-hidden="false" on content when expanded', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();

      expect(getContentRegion().getAttribute('aria-hidden')).toBe('false');
    });

    it('should have disabled attribute on button when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getHeaderButton().disabled).toBe(true);
    });

    it('should have matching header and content ids', () => {
      const headerId = getHeaderButton().id;
      const contentId = getContentRegion().id;
      const ariaControls = getHeaderButton().getAttribute('aria-controls');
      const ariaLabelledby = getContentRegion().getAttribute('aria-labelledby');

      expect(ariaControls).toBe(contentId);
      expect(ariaLabelledby).toBe(headerId);
    });
  });

  describe('Custom ID', () => {
    it('should use custom id for header and content when provided', async () => {
      const hostFixture = TestBed.createComponent(TestHostWithIdComponent);
      hostFixture.detectChanges();

      const header = hostFixture.nativeElement.querySelector('.collapse-header');
      const content = hostFixture.nativeElement.querySelector('.collapse-content');

      expect(header.id).toBe('custom-collapse-header');
      expect(content.id).toBe('custom-collapse-content');
    });

    it('should generate unique ids when no custom id provided', () => {
      const fixture1 = TestBed.createComponent(PshCollapseComponent);
      const fixture2 = TestBed.createComponent(PshCollapseComponent);
      fixture1.detectChanges();
      fixture2.detectChanges();

      const header1Id = fixture1.nativeElement.querySelector('.collapse-header').id;
      const header2Id = fixture2.nativeElement.querySelector('.collapse-header').id;

      expect(header1Id).not.toBe(header2Id);
    });
  });

  describe('Output events', () => {
    describe('toggled output', () => {
      it('should emit toggled with true when expanding via click', () => {
        const toggledSpy = jest.fn();
        fixture.componentInstance.toggled.subscribe(toggledSpy);

        getHeaderButton().click();
        fixture.detectChanges();

        expect(toggledSpy).toHaveBeenCalledTimes(1);
        expect(toggledSpy).toHaveBeenCalledWith(true);
      });

      it('should emit toggled with false when collapsing via click', () => {
        fixture.componentRef.setInput('expanded', true);
        fixture.detectChanges();

        const toggledSpy = jest.fn();
        fixture.componentInstance.toggled.subscribe(toggledSpy);

        getHeaderButton().click();
        fixture.detectChanges();

        expect(toggledSpy).toHaveBeenCalledTimes(1);
        expect(toggledSpy).toHaveBeenCalledWith(false);
      });

      it('should emit toggled via keyboard Enter', () => {
        const toggledSpy = jest.fn();
        fixture.componentInstance.toggled.subscribe(toggledSpy);

        getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
        fixture.detectChanges();

        expect(toggledSpy).toHaveBeenCalledTimes(1);
        expect(toggledSpy).toHaveBeenCalledWith(true);
      });

      it('should emit toggled via keyboard Space', () => {
        const toggledSpy = jest.fn();
        fixture.componentInstance.toggled.subscribe(toggledSpy);

        getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
        fixture.detectChanges();

        expect(toggledSpy).toHaveBeenCalledTimes(1);
        expect(toggledSpy).toHaveBeenCalledWith(true);
      });

      it('should not emit toggled when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const toggledSpy = jest.fn();
        fixture.componentInstance.toggled.subscribe(toggledSpy);

        getHeaderButton().click();
        fixture.detectChanges();

        expect(toggledSpy).not.toHaveBeenCalled();
      });
    });

    describe('opened output via open() method', () => {
      it('should emit opened when calling open() from collapsed state', () => {
        const openedSpy = jest.fn();
        fixture.componentInstance.opened.subscribe(openedSpy);

        fixture.componentInstance.open();
        fixture.detectChanges();

        expect(openedSpy).toHaveBeenCalledTimes(1);
        expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');
      });

      it('should not emit opened when already expanded', () => {
        fixture.componentRef.setInput('expanded', true);
        fixture.detectChanges();

        const openedSpy = jest.fn();
        fixture.componentInstance.opened.subscribe(openedSpy);

        fixture.componentInstance.open();
        fixture.detectChanges();

        expect(openedSpy).not.toHaveBeenCalled();
      });

      it('should not emit opened when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const openedSpy = jest.fn();
        fixture.componentInstance.opened.subscribe(openedSpy);

        fixture.componentInstance.open();
        fixture.detectChanges();

        expect(openedSpy).not.toHaveBeenCalled();
        expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
      });
    });

    describe('closed output via close() method', () => {
      it('should emit closed when calling close() from expanded state', () => {
        fixture.componentRef.setInput('expanded', true);
        fixture.detectChanges();

        const closedSpy = jest.fn();
        fixture.componentInstance.closed.subscribe(closedSpy);

        fixture.componentInstance.close();
        fixture.detectChanges();

        expect(closedSpy).toHaveBeenCalledTimes(1);
        expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
      });

      it('should not emit closed when already collapsed', () => {
        const closedSpy = jest.fn();
        fixture.componentInstance.closed.subscribe(closedSpy);

        fixture.componentInstance.close();
        fixture.detectChanges();

        expect(closedSpy).not.toHaveBeenCalled();
      });

      it('should not emit closed when disabled', () => {
        fixture.componentRef.setInput('expanded', true);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        const closedSpy = jest.fn();
        fixture.componentInstance.closed.subscribe(closedSpy);

        fixture.componentInstance.close();
        fixture.detectChanges();

        expect(closedSpy).not.toHaveBeenCalled();
      });

      it('should emit closed via Escape key when expanded', () => {
        fixture.componentRef.setInput('expanded', true);
        fixture.detectChanges();

        const closedSpy = jest.fn();
        fixture.componentInstance.closed.subscribe(closedSpy);

        getHeaderButton().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        fixture.detectChanges();

        expect(closedSpy).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('data-state attribute', () => {
    it('should have data-state="collapsed" when collapsed', () => {
      expect(getCollapseContainer().getAttribute('data-state')).toBe('collapsed');
    });

    it('should have data-state="expanded" when expanded', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();

      expect(getCollapseContainer().getAttribute('data-state')).toBe('expanded');
    });

    it('should have data-state="disabled" when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getCollapseContainer().getAttribute('data-state')).toBe('disabled');
    });

    it('should prioritize disabled over expanded for data-state', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getCollapseContainer().getAttribute('data-state')).toBe('disabled');
    });
  });

  describe('Variant classes', () => {
    it('should have default variant by default (no outline class)', () => {
      expect(getCollapseContainer().classList.contains('outline')).toBe(false);
    });

    it('should apply outline class when variant is outline', () => {
      fixture.componentRef.setInput('variant', 'outline');
      fixture.detectChanges();

      expect(getCollapseContainer().classList.contains('outline')).toBe(true);
    });

    it.each<[CollapseVariant, boolean]>([
      ['default', false],
      ['outline', true]
    ])('should have outline class=%s when variant is %s', (variant, hasOutline) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(getCollapseContainer().classList.contains('outline')).toBe(hasOutline);
    });

    it('should warn and fallback to default for invalid variant', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      fixture.componentRef.setInput('variant', 'invalid' as CollapseVariant);
      fixture.detectChanges();

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid variant'));
      expect(getCollapseContainer().classList.contains('outline')).toBe(false);

      warnSpy.mockRestore();
    });
  });

  describe('Size classes', () => {
    it('should have medium size by default (no small/large class)', () => {
      expect(getCollapseContainer().classList.contains('small')).toBe(false);
      expect(getCollapseContainer().classList.contains('large')).toBe(false);
    });

    it.each<[CollapseSize, string | null]>([
      ['small', 'small'],
      ['medium', null],
      ['large', 'large']
    ])('should apply correct class for size %s', (size, expectedClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      if (expectedClass) {
        expect(getCollapseContainer().classList.contains(expectedClass)).toBe(true);
      } else {
        expect(getCollapseContainer().classList.contains('small')).toBe(false);
        expect(getCollapseContainer().classList.contains('large')).toBe(false);
      }
    });

    it('should warn and fallback to medium for invalid size', () => {
      const warnSpy = jest.spyOn(console, 'warn').mockImplementation();

      fixture.componentRef.setInput('size', 'invalid' as CollapseSize);
      fixture.detectChanges();

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid size'));
      expect(getCollapseContainer().classList.contains('small')).toBe(false);
      expect(getCollapseContainer().classList.contains('large')).toBe(false);

      warnSpy.mockRestore();
    });
  });

  describe('Icon customization', () => {
    it('should have default caret-down icon', () => {
      expect(getIcon().classList.contains('ph-caret-down')).toBe(true);
    });

    it('should use custom icon when provided', () => {
      fixture.componentRef.setInput('icon', 'plus');
      fixture.detectChanges();

      expect(getIcon().classList.contains('ph-plus')).toBe(true);
      expect(getIcon().classList.contains('ph-caret-down')).toBe(false);
    });

    it('should apply expanded class to icon when expanded', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();

      expect(getIcon().classList.contains('expanded')).toBe(true);
    });

    it('should not have expanded class on icon when collapsed', () => {
      expect(getIcon().classList.contains('expanded')).toBe(false);
    });
  });

  describe('Disabled state', () => {
    it('should apply disabled class to container', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getCollapseContainer().classList.contains('disabled')).toBe(true);
    });

    it('should have disabled attribute on button', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getHeaderButton().disabled).toBe(true);
    });

    it('should prevent toggle via toggle() method when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      fixture.componentInstance.toggle();
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');
    });
  });

  describe('Expanded state via input', () => {
    it('should be expanded when expanded input is true', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();

      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');
      expect(getCollapseContainer().classList.contains('expanded')).toBe(true);
      expect(getContentRegion().getAttribute('aria-hidden')).toBe('false');
    });

    it('should apply expanded class to container when expanded', () => {
      fixture.componentRef.setInput('expanded', true);
      fixture.detectChanges();

      expect(getCollapseContainer().classList.contains('expanded')).toBe(true);
    });
  });

  describe('Multiple toggles', () => {
    it('should handle multiple rapid toggles correctly', () => {
      const toggledSpy = jest.fn();
      fixture.componentInstance.toggled.subscribe(toggledSpy);

      getHeaderButton().click();
      fixture.detectChanges();
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');

      getHeaderButton().click();
      fixture.detectChanges();
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('false');

      getHeaderButton().click();
      fixture.detectChanges();
      expect(getHeaderButton().getAttribute('aria-expanded')).toBe('true');

      expect(toggledSpy).toHaveBeenCalledTimes(3);
      expect(toggledSpy).toHaveBeenNthCalledWith(1, true);
      expect(toggledSpy).toHaveBeenNthCalledWith(2, false);
      expect(toggledSpy).toHaveBeenNthCalledWith(3, true);
    });
  });
});
