import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PshInfoCardComponent } from './info-card.component';
import { InfoCardData, InfoCardVariant } from './info-card.types';

@Component({
  template: `
    <psh-info-card [title]="title" [data]="data" [autoFullWidthOnMobile]="autoFullWidthOnMobile">
      <button card-actions>Action Button</button>
    </psh-info-card>
  `,
  imports: [PshInfoCardComponent]
})
class TestHostComponent {
  title = 'Test Card';
  data: InfoCardData[] = [];
  autoFullWidthOnMobile = true;
}

describe('PshInfoCardComponent', () => {
  let fixture: ComponentFixture<PshInfoCardComponent>;

  const getRegion = () =>
    fixture.nativeElement.querySelector('[role="region"]') as HTMLElement;

  const getContentList = () =>
    fixture.nativeElement.querySelector('[role="list"]') as HTMLElement;

  const getListItems = () =>
    fixture.nativeElement.querySelectorAll('[role="listitem"]') as NodeListOf<HTMLElement>;

  const getEmptyState = () =>
    fixture.nativeElement.querySelector('[data-testid="info-card-empty-state"]') as HTMLElement;

  const getLoadingIndicator = () =>
    fixture.nativeElement.querySelector('.info-card-loading') as HTMLElement;

  const getTitleElement = () =>
    fixture.nativeElement.querySelector('.info-card-title') as HTMLElement;

  const getIcon = () =>
    fixture.nativeElement.querySelector('[aria-hidden="true"]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshInfoCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshInfoCardComponent);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render title when provided', () => {
      fixture.componentRef.setInput('title', 'User Information');
      fixture.detectChanges();

      expect(getTitleElement().textContent).toContain('User Information');
    });

    it('should not render title element when title is empty', () => {
      fixture.componentRef.setInput('title', '');
      fixture.detectChanges();

      expect(getTitleElement()).toBeFalsy();
    });

    it('should render data rows with correct labels and values', () => {
      const testData: InfoCardData[] = [
        { label: 'Name', value: 'John Doe' },
        { label: 'Email', value: 'john@example.com' }
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.detectChanges();

      const rows = getListItems();
      expect(rows.length).toBe(2);

      const firstRow = rows[0] as HTMLElement;
      const secondRow = rows[1] as HTMLElement;
      expect(firstRow.querySelector('[data-label="Name"]')).toBeTruthy();
      expect(firstRow.querySelector('[data-value="John Doe"]')).toBeTruthy();
      expect(secondRow.querySelector('[data-label="Email"]')).toBeTruthy();
      expect(secondRow.querySelector('[data-value="john@example.com"]')).toBeTruthy();
    });

    it('should display fallback text for null/undefined values', () => {
      const testData: InfoCardData[] = [
        { label: 'Phone', value: null },
        { label: 'Address', value: undefined }
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.detectChanges();

      const rows = getListItems();
      const firstRow = rows[0] as HTMLElement;
      const secondRow = rows[1] as HTMLElement;
      expect(firstRow.textContent).toContain('Non renseigné');
      expect(secondRow.textContent).toContain('Non renseigné');
    });

    it('should show empty state when data array is empty', () => {
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();

      const emptyState = getEmptyState();
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent).toContain('Aucune information disponible');
    });

    it('should display custom empty state message from options', () => {
      fixture.componentRef.setInput('data', []);
      fixture.componentRef.setInput('options', {
        showEmptyState: true,
        emptyStateMessage: 'No data available'
      });
      fixture.detectChanges();

      expect(getEmptyState().textContent).toContain('No data available');
    });

    it('should show loading skeleton when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getLoadingIndicator()).toBeTruthy();
    });

    it('should hide content during loading state', () => {
      fixture.componentRef.setInput('data', [{ label: 'Test', value: 'Value' }]);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getListItems().length).toBe(0);
      expect(getLoadingIndicator()).toBeTruthy();
    });
  });

  describe('Icon visibility', () => {
    it('should render icon by default', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.detectChanges();

      expect(getIcon()).toBeTruthy();
    });

    it('should have correct data-icon attribute matching input', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.componentRef.setInput('icon', 'user');
      fixture.detectChanges();

      expect(getIcon().getAttribute('data-icon')).toBe('user');
    });

    it('should hide icon when icon input is empty string', () => {
      fixture.componentRef.setInput('title', 'Test Title');
      fixture.componentRef.setInput('icon', '');
      fixture.detectChanges();

      expect(getIcon()).toBeFalsy();
    });
  });

  describe('Variants', () => {
    it('should have outlined as default variant', () => {
      expect(getRegion().className).toContain('variant-outlined');
    });

    it.each<[InfoCardVariant]>([['default'], ['elevated'], ['outlined']])(
      'should apply variant-%s class for variant "%s"',
      (variant) => {
        fixture.componentRef.setInput('variant', variant);
        fixture.detectChanges();

        expect(getRegion().className).toContain(`variant-${variant}`);
      }
    );
  });

  describe('State classes', () => {
    it('should add hoverable class when hoverable is true', () => {
      fixture.componentRef.setInput('hoverable', true);
      fixture.detectChanges();

      expect(getRegion().className).toContain('hoverable');
    });

    it('should not have hoverable class by default', () => {
      expect(getRegion().className).not.toContain('hoverable');
    });

    it('should add interactive class when interactive is true', () => {
      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      expect(getRegion().className).toContain('interactive');
    });

    it('should not have interactive class by default', () => {
      expect(getRegion().className).not.toContain('interactive');
    });

    it('should add loading class when loading is true', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getRegion().className).toContain('loading');
    });

    it('should add disabled class when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getRegion().className).toContain('disabled');
    });
  });

  describe('Interactive behavior', () => {
    it('should emit clicked event on click when interactive', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      getRegion().click();
      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit clicked event when interactive is false', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', false);
      fixture.detectChanges();

      getRegion().click();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event when disabled', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      getRegion().click();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event when loading', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      getRegion().click();
      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should emit clicked event on Enter key when interactive', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      getRegion().dispatchEvent(event);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit clicked event on Space key when interactive', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: ' ' });
      getRegion().dispatchEvent(event);

      expect(clickSpy).toHaveBeenCalledTimes(1);
    });

    it('should not emit clicked event on keyboard when disabled', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      getRegion().dispatchEvent(event);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should not emit clicked event on keyboard when loading', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      getRegion().dispatchEvent(event);

      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    describe('role attribute', () => {
      it('should have role="region" on main container', () => {
        expect(getRegion().getAttribute('role')).toBe('region');
      });
    });

    describe('aria-label attribute', () => {
      it('should compute aria-label from title', () => {
        fixture.componentRef.setInput('title', 'User Profile');
        fixture.detectChanges();

        expect(getRegion().getAttribute('aria-label')).toBe('Information card: User Profile');
      });

      it('should have default aria-label when no title', () => {
        fixture.componentRef.setInput('title', '');
        fixture.detectChanges();

        expect(getRegion().getAttribute('aria-label')).toBe('Information card');
      });

      it('should use custom ariaLabel input when provided', () => {
        fixture.componentRef.setInput('title', 'User Profile');
        fixture.componentRef.setInput('ariaLabel', 'Custom label');
        fixture.detectChanges();

        expect(getRegion().getAttribute('aria-label')).toBe('Custom label');
      });
    });

    describe('aria-disabled attribute', () => {
      it('should have aria-disabled="true" when disabled', () => {
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getRegion().getAttribute('aria-disabled')).toBe('true');
      });

      it('should not have aria-disabled when not disabled', () => {
        fixture.componentRef.setInput('disabled', false);
        fixture.detectChanges();

        expect(getRegion().getAttribute('aria-disabled')).toBeNull();
      });
    });

    describe('aria-busy attribute', () => {
      it('should have aria-busy="true" when loading', () => {
        fixture.componentRef.setInput('loading', true);
        fixture.detectChanges();

        expect(getRegion().getAttribute('aria-busy')).toBe('true');
      });

      it('should not have aria-busy when not loading', () => {
        fixture.componentRef.setInput('loading', false);
        fixture.detectChanges();

        expect(getRegion().getAttribute('aria-busy')).toBeNull();
      });
    });

    describe('tabindex attribute', () => {
      it('should have tabindex="0" when interactive and not disabled', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.componentRef.setInput('disabled', false);
        fixture.detectChanges();

        expect(getRegion().getAttribute('tabindex')).toBe('0');
      });

      it('should not have tabindex when not interactive', () => {
        fixture.componentRef.setInput('interactive', false);
        fixture.detectChanges();

        expect(getRegion().getAttribute('tabindex')).toBeNull();
      });

      it('should not have tabindex when disabled even if interactive', () => {
        fixture.componentRef.setInput('interactive', true);
        fixture.componentRef.setInput('disabled', true);
        fixture.detectChanges();

        expect(getRegion().getAttribute('tabindex')).toBeNull();
      });
    });

    describe('content list accessibility', () => {
      it('should have role="list" on content container', () => {
        expect(getContentList().getAttribute('role')).toBe('list');
      });

      it('should have role="listitem" on data rows', () => {
        fixture.componentRef.setInput('data', [{ label: 'Test', value: 'Value' }]);
        fixture.detectChanges();

        const rows = getListItems();
        expect(rows.length).toBe(1);
        const firstRow = rows[0] as HTMLElement;
        expect(firstRow.getAttribute('role')).toBe('listitem');
      });
    });

    describe('empty state accessibility', () => {
      it('should have role="status" on empty state', () => {
        fixture.componentRef.setInput('data', []);
        fixture.detectChanges();

        expect(getEmptyState().getAttribute('role')).toBe('status');
      });

      it('should have aria-live="polite" on empty state', () => {
        fixture.componentRef.setInput('data', []);
        fixture.detectChanges();

        expect(getEmptyState().getAttribute('aria-live')).toBe('polite');
      });
    });
  });

  describe('Per-item customization', () => {
    it('should apply customClass to individual row', () => {
      const testData: InfoCardData[] = [
        { label: 'Name', value: 'John', customClass: 'highlight-row' },
        { label: 'Email', value: 'john@example.com' }
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.detectChanges();

      const rows = getListItems();
      const firstRow = rows[0] as HTMLElement;
      const secondRow = rows[1] as HTMLElement;
      expect(firstRow.className).toContain('highlight-row');
      expect(secondRow.className).not.toContain('highlight-row');
    });

    it('should apply per-item labelWidth', () => {
      const testData: InfoCardData[] = [
        { label: 'Name', value: 'John', labelWidth: '200px' }
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.info-card-label') as HTMLElement;
      expect(label.style.width).toBe('200px');
    });

    it('should apply per-item valueWidth', () => {
      const testData: InfoCardData[] = [
        { label: 'Name', value: 'John', valueWidth: '300px' }
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.detectChanges();

      const value = fixture.nativeElement.querySelector('.info-card-value') as HTMLElement;
      expect(value.style.width).toBe('300px');
    });

    it('should use per-item labelWidth over options.labelWidth', () => {
      const testData: InfoCardData[] = [
        { label: 'Name', value: 'John', labelWidth: '150px' }
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('options', { labelWidth: '100px' });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.info-card-label') as HTMLElement;
      expect(label.style.width).toBe('150px');
    });

    it('should use per-item valueWidth over options.valueWidth', () => {
      const testData: InfoCardData[] = [
        { label: 'Name', value: 'John', valueWidth: '250px' }
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('options', { valueWidth: '200px' });
      fixture.detectChanges();

      const value = fixture.nativeElement.querySelector('.info-card-value') as HTMLElement;
      expect(value.style.width).toBe('250px');
    });

    it('should fall back to options.labelWidth when per-item labelWidth is not set', () => {
      const testData: InfoCardData[] = [
        { label: 'Name', value: 'John' }
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('options', { labelWidth: '120px' });
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.info-card-label') as HTMLElement;
      expect(label.style.width).toBe('120px');
    });

    it('should fall back to options.valueWidth when per-item valueWidth is not set', () => {
      const testData: InfoCardData[] = [
        { label: 'Name', value: 'John' }
      ];
      fixture.componentRef.setInput('data', testData);
      fixture.componentRef.setInput('options', { valueWidth: '180px' });
      fixture.detectChanges();

      const value = fixture.nativeElement.querySelector('.info-card-value') as HTMLElement;
      expect(value.style.width).toBe('180px');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty data array gracefully', () => {
      fixture.componentRef.setInput('data', []);
      fixture.detectChanges();

      expect(getEmptyState()).toBeTruthy();
      expect(getListItems().length).toBe(0);
    });

    it('should handle data with empty labels', () => {
      fixture.componentRef.setInput('data', [{ label: '', value: 'Some value' }]);
      fixture.detectChanges();

      const rows = getListItems();
      expect(rows.length).toBe(1);
    });

    it('should prevent interaction when both disabled and loading', () => {
      const clickSpy = jest.fn();
      fixture.componentInstance.clicked.subscribe(clickSpy);

      fixture.componentRef.setInput('interactive', true);
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      getRegion().click();
      const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
      getRegion().dispatchEvent(enterEvent);

      expect(clickSpy).not.toHaveBeenCalled();
    });

    it('should apply custom CSS class to container', () => {
      fixture.componentRef.setInput('cssClass', 'my-custom-class');
      fixture.detectChanges();

      expect(getRegion().className).toContain('my-custom-class');
    });

    it('should apply custom inline styles', () => {
      fixture.componentRef.setInput('customStyle', { 'background-color': 'red' });
      fixture.detectChanges();

      expect(getRegion().style.backgroundColor).toBe('red');
    });
  });
});

describe('PshInfoCardComponent - Content Projection', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  const getActionsContainer = () =>
    fixture.nativeElement.querySelector('.info-card-actions') as HTMLElement;

  const getProjectedButton = () =>
    fixture.nativeElement.querySelector('[card-actions]') as HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render card-actions container', () => {
    expect(getActionsContainer()).toBeTruthy();
  });

  it('should project content into card-actions slot', () => {
    const button = getProjectedButton();
    expect(button).toBeTruthy();
    expect(button.textContent).toContain('Action Button');
  });

  it('should apply mobile-full-width-buttons class when mobile and autoFullWidthOnMobile is true', () => {
    const infoCardDebugEl = fixture.debugElement.children[0];
    const infoCard = infoCardDebugEl?.componentInstance as PshInfoCardComponent;
    infoCard.isMobile.set(true);
    fixture.detectChanges();

    expect(getActionsContainer().className).toContain('mobile-full-width-buttons');
  });

  it('should not apply mobile-full-width-buttons class when autoFullWidthOnMobile is false', () => {
    hostComponent.autoFullWidthOnMobile = false;
    const infoCardDebugEl = fixture.debugElement.children[0];
    const infoCard = infoCardDebugEl?.componentInstance as PshInfoCardComponent;
    infoCard.isMobile.set(true);
    fixture.detectChanges();

    expect(getActionsContainer().className).not.toContain('mobile-full-width-buttons');
  });

  it('should not apply mobile-full-width-buttons class when not mobile', () => {
    const infoCardDebugEl = fixture.debugElement.children[0];
    const infoCard = infoCardDebugEl?.componentInstance as PshInfoCardComponent;
    infoCard.isMobile.set(false);
    fixture.detectChanges();

    expect(getActionsContainer().className).not.toContain('mobile-full-width-buttons');
  });
});
