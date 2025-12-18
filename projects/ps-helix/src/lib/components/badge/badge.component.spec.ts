import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { PshBadgeComponent } from './badge.component';
import { BadgeVariant, BadgeSize, BadgeDisplayType, BadgePosition } from './badge.types';

@Component({
  selector: 'test-host',
  imports: [PshBadgeComponent],
  template: `<psh-badge [displayType]="'text'">{{ textContent }}</psh-badge>`
})
class TestHostComponent {
  textContent = 'Test Badge';
}

describe('PshBadgeComponent', () => {
  let fixture: ComponentFixture<PshBadgeComponent<unknown>>;

  const getBadgeElement = () =>
    fixture.nativeElement.querySelector('[role="status"], [role="img"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshBadgeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshBadgeComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render content input for counter display type', () => {
      fixture.componentRef.setInput('displayType', 'counter');
      fixture.componentRef.setInput('content', 'New');
      fixture.detectChanges();

      expect(getBadgeElement().textContent?.trim()).toBe('New');
    });

    it('should display counter value when displayType is counter', () => {
      fixture.componentRef.setInput('displayType', 'counter');
      fixture.componentRef.setInput('value', 5);
      fixture.detectChanges();

      expect(getBadgeElement().textContent?.trim()).toBe('5');
    });

    it('should render empty content for dot display type', () => {
      fixture.componentRef.setInput('displayType', 'dot');
      fixture.detectChanges();

      expect(getBadgeElement().textContent?.trim()).toBe('');
    });
  });

  describe('Counter value formatting', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('displayType', 'counter');
      fixture.detectChanges();
    });

    it('should display value as-is when below max', () => {
      fixture.componentRef.setInput('value', 50);
      fixture.componentRef.setInput('max', 99);
      fixture.detectChanges();

      expect(getBadgeElement().textContent?.trim()).toBe('50');
    });

    it('should display max+ when value exceeds max', () => {
      fixture.componentRef.setInput('value', 150);
      fixture.componentRef.setInput('max', 99);
      fixture.detectChanges();

      expect(getBadgeElement().textContent?.trim()).toBe('99+');
    });

    it('should use custom formatter when provided', () => {
      const formatter = (val: number) => `${val} items`;
      fixture.componentRef.setInput('value', 5);
      fixture.componentRef.setInput('formatter', formatter);
      fixture.detectChanges();

      expect(getBadgeElement().textContent?.trim()).toBe('5 items');
    });

    it('should show content fallback when value is 0 and showZero is false', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.componentRef.setInput('showZero', false);
      fixture.componentRef.setInput('content', 'Empty');
      fixture.detectChanges();

      expect(getBadgeElement().textContent?.trim()).toBe('Empty');
    });

    it('should display 0 when showZero is true', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.componentRef.setInput('showZero', true);
      fixture.detectChanges();

      expect(getBadgeElement().textContent?.trim()).toBe('0');
    });

    it('should handle non-numeric value as string', () => {
      fixture.componentRef.setInput('value', 'custom');
      fixture.detectChanges();

      expect(getBadgeElement().textContent?.trim()).toBe('custom');
    });
  });

  describe('Accessibility', () => {
    describe('role attribute', () => {
      it.each<[BadgeDisplayType, string]>([
        ['counter', 'status'],
        ['dot', 'img'],
        ['text', 'img']
      ])('displayType "%s" should have role="%s"', (displayType, expectedRole) => {
        fixture.componentRef.setInput('displayType', displayType);
        fixture.detectChanges();

        expect(getBadgeElement().getAttribute('role')).toBe(expectedRole);
      });
    });

    describe('aria-label attribute', () => {
      it('should use custom ariaLabel when provided', () => {
        fixture.componentRef.setInput('ariaLabel', 'Custom notification count');
        fixture.detectChanges();

        expect(getBadgeElement().getAttribute('aria-label')).toBe('Custom notification count');
      });

      it('should fall back to content when no ariaLabel', () => {
        fixture.componentRef.setInput('content', 'New');
        fixture.detectChanges();

        expect(getBadgeElement().getAttribute('aria-label')).toBe('New');
      });

      it('should fall back to displayValue when no content or ariaLabel', () => {
        fixture.componentRef.setInput('displayType', 'counter');
        fixture.componentRef.setInput('value', 42);
        fixture.detectChanges();

        expect(getBadgeElement().getAttribute('aria-label')).toBe('42');
      });

      it('should prioritize ariaLabel over content', () => {
        fixture.componentRef.setInput('ariaLabel', 'Priority label');
        fixture.componentRef.setInput('content', 'Content text');
        fixture.detectChanges();

        expect(getBadgeElement().getAttribute('aria-label')).toBe('Priority label');
      });
    });
  });

  describe('data-state attribute', () => {
    it('should have data-state="hidden" when visible is false', () => {
      fixture.componentRef.setInput('visible', false);
      fixture.detectChanges();

      expect(getBadgeElement().getAttribute('data-state')).toBe('hidden');
    });

    it('should have data-state="overlap" when overlap is true', () => {
      fixture.componentRef.setInput('overlap', true);
      fixture.detectChanges();

      expect(getBadgeElement().getAttribute('data-state')).toBe('overlap');
    });

    it.each<[BadgeDisplayType]>([['dot'], ['counter'], ['text']])(
      'should have data-state="%s" for displayType "%s"',
      (displayType) => {
        fixture.componentRef.setInput('displayType', displayType);
        fixture.detectChanges();

        expect(getBadgeElement().getAttribute('data-state')).toBe(displayType);
      }
    );

    it('should prioritize hidden state over overlap', () => {
      fixture.componentRef.setInput('visible', false);
      fixture.componentRef.setInput('overlap', true);
      fixture.detectChanges();

      expect(getBadgeElement().getAttribute('data-state')).toBe('hidden');
    });
  });

  describe('Click event', () => {
    it('should emit badgeClick when badge is clicked', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.badgeClick.subscribe(clickSpy);

      getBadgeElement().click();

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit on each click', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.badgeClick.subscribe(clickSpy);

      getBadgeElement().click();
      getBadgeElement().click();
      getBadgeElement().click();

      expect(clickSpy).toHaveBeenCalledTimes(3);
    });
  });

  describe('Variant classes', () => {
    it.each<[BadgeVariant]>([
      ['primary'],
      ['secondary'],
      ['success'],
      ['warning'],
      ['danger'],
      ['info'],
      ['disabled']
    ])('should apply "%s" variant class', (variant) => {
      fixture.componentRef.setInput('variant', variant);
      fixture.detectChanges();

      expect(getBadgeElement().classList.contains(variant)).toBe(true);
    });

    it('should switch between variants', () => {
      fixture.componentRef.setInput('variant', 'primary');
      fixture.detectChanges();
      expect(getBadgeElement().classList.contains('primary')).toBe(true);

      fixture.componentRef.setInput('variant', 'danger');
      fixture.detectChanges();
      expect(getBadgeElement().classList.contains('danger')).toBe(true);
      expect(getBadgeElement().classList.contains('primary')).toBe(false);
    });
  });

  describe('Size classes', () => {
    it.each<[BadgeSize]>([['small'], ['medium'], ['large']])(
      'should apply "%s" size class',
      (size) => {
        fixture.componentRef.setInput('size', size);
        fixture.detectChanges();

        expect(getBadgeElement().classList.contains(size)).toBe(true);
      }
    );
  });

  describe('Position classes', () => {
    it.each<[BadgePosition]>([
      ['top-right'],
      ['top-left'],
      ['bottom-right'],
      ['bottom-left']
    ])('should apply "%s" position class', (position) => {
      fixture.componentRef.setInput('position', position);
      fixture.detectChanges();

      expect(getBadgeElement().classList.contains(position)).toBe(true);
    });
  });
});

describe('PshBadgeComponent with ng-content', () => {
  let hostFixture: ComponentFixture<TestHostComponent>;

  const getBadgeElement = () =>
    hostFixture.nativeElement.querySelector('[role="img"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();
  });

  it('should render projected content for text display type', () => {
    expect(getBadgeElement().textContent?.trim()).toBe('Test Badge');
  });

  it('should update when projected content changes', () => {
    hostFixture.componentInstance.textContent = 'Updated Badge';
    hostFixture.detectChanges();

    expect(getBadgeElement().textContent?.trim()).toBe('Updated Badge');
  });
});
