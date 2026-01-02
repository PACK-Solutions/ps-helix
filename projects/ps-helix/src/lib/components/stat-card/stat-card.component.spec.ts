import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshStatCardComponent } from './stat-card.component';
import { StatCardVariant, StatCardLayout, StatTagVariant } from './stat-card.types';

describe('PshStatCardComponent', () => {
  let fixture: ComponentFixture<PshStatCardComponent>;

  const getContainer = () =>
    fixture.nativeElement.querySelector('[role="article"], [role="button"]') as HTMLElement;

  const getValueElement = () =>
    fixture.nativeElement.querySelector('.stat-value') as HTMLElement;

  const getDescriptionElement = () =>
    fixture.nativeElement.querySelector('.stat-description') as HTMLElement;

  const getIconContainer = () =>
    fixture.nativeElement.querySelector('.stat-icon') as HTMLElement;

  const getTag = () =>
    fixture.nativeElement.querySelector('psh-tag') as HTMLElement;

  const getLoadingState = () =>
    fixture.nativeElement.querySelector('.stat-loading') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshStatCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshStatCardComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render numeric value', () => {
      fixture.componentRef.setInput('value', 12345);
      fixture.detectChanges();

      expect(getValueElement().textContent).toContain('12345');
    });

    it('should render formatted text value', () => {
      fixture.componentRef.setInput('value', '$1,234.56');
      fixture.detectChanges();

      expect(getValueElement().textContent).toContain('$1,234.56');
    });

    it('should render description', () => {
      fixture.componentRef.setInput('description', 'Total Revenue');
      fixture.detectChanges();

      expect(getDescriptionElement().textContent).toContain('Total Revenue');
    });

    it('should render icon container with correct icon class', () => {
      fixture.componentRef.setInput('icon', 'chart-line');
      fixture.detectChanges();

      const iconContainer = getIconContainer();
      expect(iconContainer).toBeTruthy();
      const iconElement = iconContainer.querySelector('i');
      expect(iconElement).toBeTruthy();
      expect(iconElement!.className).toBe('ph ph-chart-line');
    });

    it('should not render icon container when no icon provided', () => {
      fixture.componentRef.setInput('value', '100');
      fixture.componentRef.setInput('description', 'Test');
      fixture.detectChanges();

      expect(getIconContainer()).toBeNull();
    });

    it('should render tag when tagVariant and tagLabel are provided', () => {
      fixture.componentRef.setInput('tagVariant', 'success');
      fixture.componentRef.setInput('tagLabel', '+12.6%');
      fixture.detectChanges();

      const tag = getTag();
      expect(tag).toBeTruthy();
      expect(tag.textContent).toContain('+12.6%');
    });

    it('should not render tag when tagLabel is missing', () => {
      fixture.componentRef.setInput('tagVariant', 'success');
      fixture.detectChanges();

      expect(getTag()).toBeFalsy();
    });

    it('should not render tag when tagVariant is missing', () => {
      fixture.componentRef.setInput('tagLabel', '+12.6%');
      fixture.detectChanges();

      expect(getTag()).toBeFalsy();
    });

    it('should support data input for value', () => {
      fixture.componentRef.setInput('data', {
        value: 999,
        description: 'Data Description',
        icon: 'star'
      });
      fixture.detectChanges();

      expect(getValueElement().textContent).toContain('999');
    });

    it('should prioritize direct inputs over data object', () => {
      fixture.componentRef.setInput('value', 'Direct Value');
      fixture.componentRef.setInput('data', {
        value: 'Data Value',
        description: 'Data Description',
        icon: 'star'
      });
      fixture.detectChanges();

      expect(getValueElement().textContent).toContain('Direct Value');
    });
  });

  describe('Loading state', () => {
    it('should show loading skeleton when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getLoadingState()).toBeTruthy();
    });

    it('should hide content during loading', () => {
      fixture.componentRef.setInput('value', '12345');
      fixture.componentRef.setInput('description', 'Test');
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getValueElement()).toBeFalsy();
      expect(getDescriptionElement()).toBeFalsy();
    });

    it('should have aria-busy="true" when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getContainer().getAttribute('aria-busy')).toBe('true');
    });
  });

  describe('Variants', () => {
    it('should have elevated as default variant', () => {
      expect(getContainer().className).toContain('variant-elevated');
    });

    it.each<[StatCardVariant]>([['default'], ['elevated'], ['outlined']])(
      'should apply variant-%s class for variant "%s"',
      (variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        expect(getContainer().className).toContain(`variant-${variant}`);
      }
    );
  });

  describe('Layouts', () => {
    it('should have horizontal layout by default', () => {
      expect(getContainer().className).toContain('stat-card--horizontal');
    });

    it.each<[StatCardLayout]>([['horizontal'], ['vertical']])(
      'should apply stat-card--%s class for layout "%s"',
      (layout) => {
        fixture.componentRef.setInput('layout', layout);
        fixture.detectChanges();

        expect(getContainer().className).toContain(`stat-card--${layout}`);
      }
    );

    it('should apply stat-card--row class when rowDirection is true', () => {
      fixture.componentRef.setInput('rowDirection', true);
      fixture.detectChanges();

      expect(getContainer().className).toContain('stat-card--row');
    });

    it('should render card-body wrapper in rowDirection mode', () => {
      fixture.componentRef.setInput('rowDirection', true);
      fixture.componentRef.setInput('value', '100');
      fixture.detectChanges();

      const cardBody = fixture.nativeElement.querySelector('.stat-card-body');
      expect(cardBody).toBeTruthy();
    });
  });

  describe('State classes', () => {
    it('should add hoverable class when hoverable is true', () => {
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();

      expect(getContainer().className).toContain('hoverable');
    });

    it('should not have hoverable class by default', () => {
      expect(getContainer().className).not.toContain('hoverable');
    });

    it('should add interactive class when interactive is true', () => {
      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      expect(getContainer().className).toContain('interactive');
    });

    it('should not have interactive class by default', () => {
      expect(getContainer().className).not.toContain('interactive');
    });

    it('should add loading class when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getContainer().className).toContain('loading');
    });

    it('should add disabled class when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getContainer().className).toContain('disabled');
    });

    it('should apply custom CSS class', () => {
      fixture.componentRef.setInput('cssClass', 'my-custom-class');
      fixture.detectChanges();

      expect(getContainer().className).toContain('my-custom-class');
    });

    it('should apply custom inline styles', () => {
      fixture.componentRef.setInput('customStyle', { 'background-color': 'red' });
      fixture.detectChanges();

      expect(getContainer().style.backgroundColor).toBe('red');
    });
  });

  describe('Interactive behavior', () => {
    it('should emit clicked event on click when interactive', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      getContainer().click();
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit clicked event when interactive is false', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', false);
      fixture.detectChanges();

      getContainer().click();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event when disabled', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getContainer().click();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event when loading', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      getContainer().click();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should emit clicked event on Enter key when interactive', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      getContainer().dispatchEvent(event);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit clicked event on Space key when interactive', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: ' ' });
      getContainer().dispatchEvent(event);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit clicked event on keyboard when disabled', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      getContainer().dispatchEvent(event);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event on keyboard when loading', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      getContainer().dispatchEvent(event);

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    describe('role attribute', () => {
      it('should have role="article" by default', () => {
        expect(getContainer().getAttribute('role')).toBe('article');
      });

      it('should have role="button" when interactive is true', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.detectChanges();

        expect(getContainer().getAttribute('role')).toBe('button');
      });
    });

    describe('aria-label attribute', () => {
      it('should generate aria-label from description and value', () => {
        fixture.componentRef.setInput('description', 'Total Sales');
        fixture.componentRef.setInput('value', '1234');
        fixture.detectChanges();

        expect(getContainer().getAttribute('aria-label')).toBe('Total Sales: 1234');
      });

      it('should include tag in aria-label when present', () => {
        fixture.componentRef.setInput('description', 'Revenue');
        fixture.componentRef.setInput('value', '$5000');
        fixture.componentRef.setInput('tagVariant', 'success');
        fixture.componentRef.setInput('tagLabel', '+15%');
        fixture.detectChanges();

        expect(getContainer().getAttribute('aria-label')).toBe('Revenue: $5000, +15%');
      });

      it('should use custom ariaLabel when provided', () => {
        fixture.componentRef.setInput('description', 'Test');
        fixture.componentRef.setInput('value', '100');
        fixture.componentRef.setInput('ariaLabel', 'Custom accessibility label');
        fixture.detectChanges();

        expect(getContainer().getAttribute('aria-label')).toBe('Custom accessibility label');
      });
    });

    describe('aria-disabled attribute', () => {
      it('should have aria-disabled="true" when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getContainer().getAttribute('aria-disabled')).toBe('true');
      });

      it('should not have aria-disabled when not disabled', () => {
        fixture.componentRef.setInput('disabled', false);
        fixture.detectChanges();

        expect(getContainer().getAttribute('aria-disabled')).toBeNull();
      });
    });

    describe('aria-busy attribute', () => {
      it('should have aria-busy="true" when loading', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        expect(getContainer().getAttribute('aria-busy')).toBe('true');
      });

      it('should not have aria-busy when not loading', () => {
        fixture.componentRef.setInput('loading', false);
        fixture.detectChanges();

        expect(getContainer().getAttribute('aria-busy')).toBeNull();
      });
    });

    describe('tabindex attribute', () => {
      it('should have tabindex="0" when interactive and not disabled', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.componentRef.setInput('disabled', false);
        fixture.detectChanges();

        expect(getContainer().getAttribute('tabindex')).toBe('0');
      });

      it('should not have tabindex when not interactive', () => {
        fixture.componentRef.setInput('interactive', false);
        fixture.detectChanges();

        expect(getContainer().getAttribute('tabindex')).toBeNull();
      });

      it('should not have tabindex when disabled even if interactive', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getContainer().getAttribute('tabindex')).toBeNull();
      });

      it('should still have tabindex when loading and interactive', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        expect(getContainer().getAttribute('tabindex')).toBe('0');
      });
    });

    describe('icon accessibility', () => {
      it('should have aria-hidden="true" on icon element', () => {
        fixture.componentRef.setInput('icon', 'chart-line');
        fixture.detectChanges();

        const iconContainer = getIconContainer();
        expect(iconContainer).toBeTruthy();
        const iconElement = iconContainer.querySelector('i.ph');
        expect(iconElement).toBeTruthy();
        expect(iconElement!.getAttribute('aria-hidden')).toBe('true');
      });
    });
  });

  describe('Icon styling', () => {
    it('should apply custom iconBackground', () => {
      fixture.componentRef.setInput('icon', 'star');
      fixture.componentRef.setInput('iconBackground', 'linear-gradient(135deg, #FF6B6B, #EE5A24)');
      fixture.detectChanges();

      expect(getIconContainer().style.background).toContain('linear-gradient');
    });

    it.each<[StatTagVariant]>([['success'], ['danger'], ['warning'], ['primary']])(
      'should apply default gradient for tagVariant "%s"',
      (variant) => {
        fixture.componentRef.setInput('icon', 'star');
        fixture.componentRef.setInput('tagVariant', variant);
        fixture.componentRef.setInput('tagLabel', '+10%');
        fixture.detectChanges();

        const iconStyle = getIconContainer().style.background;
        expect(iconStyle).toContain('linear-gradient');
      }
    );

    it('should prioritize iconBackground over tagVariant default', () => {
      fixture.componentRef.setInput('icon', 'star');
      fixture.componentRef.setInput('tagVariant', 'success');
      fixture.componentRef.setInput('tagLabel', '+10%');
      fixture.componentRef.setInput('iconBackground', '#FF0000');
      fixture.detectChanges();

      expect(getIconContainer().style.background).toBe('rgb(255, 0, 0)');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty value gracefully', () => {
      fixture.componentRef.setInput('value', '');
      fixture.detectChanges();

      expect(getValueElement().textContent).toBe('');
    });

    it('should handle empty description gracefully', () => {
      fixture.componentRef.setInput('description', '');
      fixture.detectChanges();

      expect(getDescriptionElement().textContent).toBe('');
    });

    it('should prevent interaction when both disabled and loading', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      getContainer().click();
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      getContainer().dispatchEvent(enterEvent);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should handle partial data object', () => {
      fixture.componentRef.setInput('data', {
        value: 'Partial',
        description: '',
        icon: ''
      });
      fixture.detectChanges();

      expect(getValueElement().textContent).toContain('Partial');
    });

    it('should support rowDirection from data object with CSS class and template structure', () => {
      fixture.componentRef.setInput('data', {
        value: '100',
        description: 'Test',
        icon: 'star',
        rowDirection: true
      });
      fixture.detectChanges();

      expect(getContainer().className).toContain('stat-card--row');
      const cardBody = fixture.nativeElement.querySelector('.stat-card-body');
      expect(cardBody).toBeTruthy();
    });

    it('should support tagVariant and tagLabel from data object', () => {
      fixture.componentRef.setInput('data', {
        value: '500',
        description: 'Revenue',
        icon: 'currency-dollar',
        tagVariant: 'success',
        tagLabel: '+25%'
      });
      fixture.detectChanges();

      const tag = getTag();
      expect(tag).toBeTruthy();
      expect(tag.textContent).toContain('+25%');
      const tagDiv = tag.querySelector('.tag');
      expect(tagDiv?.classList.contains('success')).toBe(true);
    });

    it('should support iconBackground from data object', () => {
      fixture.componentRef.setInput('data', {
        value: '100',
        description: 'Test',
        icon: 'star',
        iconBackground: '#00FF00'
      });
      fixture.detectChanges();

      const iconContainer = getIconContainer();
      expect(iconContainer).toBeTruthy();
      expect(iconContainer.style.background).toBe('rgb(0, 255, 0)');
    });

    it('should prioritize direct tagVariant over data object tagVariant', () => {
      fixture.componentRef.setInput('tagVariant', 'danger');
      fixture.componentRef.setInput('tagLabel', '+10%');
      fixture.componentRef.setInput('data', {
        value: '100',
        description: 'Test',
        icon: 'star',
        tagVariant: 'success',
        tagLabel: '+20%'
      });
      fixture.detectChanges();

      const tag = getTag();
      expect(tag).toBeTruthy();
      const tagDiv = tag.querySelector('.tag');
      expect(tagDiv?.classList.contains('danger')).toBe(true);
      expect(tagDiv?.classList.contains('success')).toBe(false);
      expect(tag.textContent).toContain('+10%');
    });
  });
});
