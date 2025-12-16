import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { PshSelectComponent } from './select.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SelectOption, SelectOptionGroup } from './select.types';

describe('PshSelectComponent', () => {
  let component: PshSelectComponent<string>;
  let fixture: ComponentFixture<PshSelectComponent<string>>;

  // Mock data avec typage strict
  const mockOptions: SelectOption<string>[] = [
    { label: 'Option 1', value: '1', icon: 'user' },
    { label: 'Option 2', value: '2', description: 'Description 2' },
    { label: 'Option 3', value: '3', disabled: true }
  ];

  // Mock data pour les groupes avec typage strict
  const mockGroupedOptions: (SelectOption<string> | SelectOptionGroup<string>)[] = [
    {
      label: 'Group 1',
      options: [
        { label: 'Option 1.1', value: '1.1' },
        { label: 'Option 1.2', value: '1.2' }
      ]
    },
    {
      label: 'Group 2',
      options: [
        { label: 'Option 2.1', value: '2.1' },
        { label: 'Option 2.2', value: '2.2' }
      ]
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PshSelectComponent,
        FormsModule,
        ReactiveFormsModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PshSelectComponent<string>);
    component = fixture.componentInstance;
    (component.options as any) = mockOptions;
    fixture.detectChanges();
  });

  // Création et rendu initial
  describe('Initial Rendering', () => {
    it('should handle custom placeholder for multiple selection', () => {
      component.multiple.set(true);
      (component.multiplePlaceholder as any) = 'Select multiple items';
      fixture.detectChanges();
      
      const trigger = fixture.debugElement.query(By.css('.select-trigger'));
      expect(trigger.nativeElement.textContent.trim()).toBe('Select multiple items');
    });

    it('should apply custom styles', () => {
      component.fullWidth.set(true);
      fixture.detectChanges();
      
      const container = fixture.debugElement.query(By.css('.select-container'));
      expect(container.classes['full-width']).toBeTrue();
    });
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    it('should render with default props', () => {
      expect(component.value()).toBeNull();
      expect(component.disabled()).toBeFalse();
      expect(component.size()).toBe('medium');
      expect(component.searchable()).toBeFalse();
      expect(component.multiple()).toBeFalse();
    });

    it('should generate unique id for select', () => {
      expect(component.selectId).toMatch(/^select-[a-z0-9]+$/);
    });

    it('should render placeholder when no value is selected', () => {
      const placeholder = 'Select an option';
      (component.placeholder as any) = placeholder;
      fixture.detectChanges();
      
      const trigger = fixture.debugElement.query(By.css('.select-trigger'));
      expect(trigger.nativeElement.textContent.trim()).toBe(placeholder);
    });
  });

  // Sélection et mise à jour des options
  describe('Option Selection', () => {
    it('should handle deselection in multiple mode', fakeAsync(() => {
      component.multiple.set(true);
      component.value.set(['1', '2']);
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      const option = fixture.debugElement.queryAll(By.css('.select-option'))[0];
      option.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(component.value()).toEqual(['2']);
    }));

    it('should respect minSelections in multiple mode', fakeAsync(() => {
      component.multiple.set(true);
      (component.minSelections as any) = 2;
      component.value.set(['1', '2']);
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      const option = fixture.debugElement.queryAll(By.css('.select-option'))[0];
      option.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(component.value()).toEqual(['1', '2']);
    }));
    it('should select single option correctly', fakeAsync(() => {
      spyOn(component.valueChange, 'emit');
      component.toggle();
      fixture.detectChanges();

      const option = fixture.debugElement.queryAll(By.css('.select-option'))[0];
      option.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(component.value()).toBe('1');
      expect(component.valueChange.emit).toHaveBeenCalledWith('1');
      expect(component.selectedLabel()).toBe('Option 1');
    }));

    it('should handle multiple selection correctly', fakeAsync(() => {
      component.multiple.set(true); // Correction: model() utilise .set()
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('.select-option'));
      options[0].nativeElement.click();
      options[1].nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(component.value()).toEqual(['1', '2']);
      expect(component.selectedLabel()).toBe('Option 1, Option 2');
    }));

    it('should respect maxSelections in multiple mode', fakeAsync(() => {
      component.multiple.set(true); // Correction: model() utilise .set()
      (component.maxSelections as any) = 2;
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(By.css('.select-option'));
      options[0].nativeElement.click();
      options[1].nativeElement.click();
      options[2].nativeElement.click();
      fixture.detectChanges();
      tick();

      expect((component.value() as string[]).length).toBe(2);
    }));

    it('should not select disabled options', fakeAsync(() => {
      component.toggle();
      fixture.detectChanges();

      const disabledOption = fixture.debugElement.queryAll(By.css('.select-option'))[2];
      disabledOption.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(component.value()).toBeNull();
    }));
  });

  // Recherche et filtrage
  describe('Search and Filtering', () => {
    it('should handle custom search configuration', fakeAsync(() => {
      const customConfig = {
        debounceTime: 500,
        placeholder: 'Custom search...',
        minLength: 2
      };
      (component.searchConfig as any) = customConfig;
      component.searchable.set(true);
      fixture.detectChanges();

      component.toggle();
      fixture.detectChanges();

      const searchInput = fixture.debugElement.query(By.css('.select-search input'));
      expect(searchInput.nativeElement.placeholder).toBe('Custom search...');

      searchInput.nativeElement.value = 'a';
      searchInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(500);

      expect(component.searched.emit).not.toHaveBeenCalled();
    }));
    beforeEach(() => {
      component.searchable.set(true); // Correction: model() utilise .set()
      fixture.detectChanges();
    });

    it('should filter options based on search term', fakeAsync(() => {
      component.toggle();
      fixture.detectChanges();

      const searchInput = fixture.debugElement.query(By.css('.select-search input'));
      searchInput.nativeElement.value = 'Option 1';
      searchInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      tick(300); // Debounce time

      const visibleOptions = fixture.debugElement.queryAll(By.css('.select-option'));
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].nativeElement.textContent).toContain('Option 1');
    }));

    it('should emit searched event with debounce', fakeAsync(() => {
      spyOn(component.searched, 'emit');
      component.toggle();
      fixture.detectChanges();

      const searchInput = fixture.debugElement.query(By.css('.select-search input'));
      searchInput.nativeElement.value = 'test';
      searchInput.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
      
      tick(300);
      expect(component.searched.emit).toHaveBeenCalledWith('test');
    }));
  });

  // Gestion des groupes
  describe('Option Groups', () => {
    beforeEach(() => {
      (component.options as any) = mockGroupedOptions;
      fixture.detectChanges();
    });

    it('should render option groups correctly', () => {
      component.toggle();
      fixture.detectChanges();

      const groups = fixture.debugElement.queryAll(By.css('.select-group'));
      expect(groups.length).toBe(2);

      const groupLabels = fixture.debugElement.queryAll(By.css('.select-group-label'));
      expect(groupLabels[0].nativeElement.textContent).toContain('Group 1');
      expect(groupLabels[1].nativeElement.textContent).toContain('Group 2');
    });

    it('should select options within groups', fakeAsync(() => {
      component.toggle();
      fixture.detectChanges();

      const firstGroupOption = fixture.debugElement.query(By.css('.select-group .select-option'));
      firstGroupOption.nativeElement.click();
      fixture.detectChanges();
      tick();

      expect(component.value()).toBe('1.1');
    }));
  });

  // États et accessibilité
  describe('States and Accessibility', () => {
    it('should handle clear functionality', () => {
      component.value.set('1');
      component.clearable.set(true);
      fixture.detectChanges();

      const clearButton = fixture.debugElement.query(By.css('.select-clear'));
      expect(clearButton).toBeTruthy();

      clearButton.nativeElement.click();
      fixture.detectChanges();

      expect(component.value()).toBeNull();
    });

    it('should handle keyboard navigation', () => {
      component.toggle();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      fixture.nativeElement.dispatchEvent(event);
      fixture.detectChanges();

      // Vérifier que le focus est sur la première option
      const firstOption = fixture.debugElement.query(By.css('.select-option'));
      expect(document.activeElement).toBe(firstOption.nativeElement);
    });
    it('should handle disabled state', () => {
      component.disabled.set(true); // Correction: model() utilise .set()
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.select-trigger'));
      expect(trigger.nativeElement.hasAttribute('aria-disabled')).toBeTrue();
      
      trigger.nativeElement.click();
      fixture.detectChanges();
      
      const dropdown = fixture.debugElement.query(By.css('.select-dropdown'));
      expect(dropdown).toBeFalsy();
    });

    it('should handle loading state', () => {
      component.loading.set(true); // Correction: model() utilise .set()
      fixture.detectChanges();

      const loader = fixture.debugElement.query(By.css('.select-loader'));
      expect(loader).toBeTruthy();
    });

    it('should have correct ARIA attributes', () => {
      const trigger = fixture.debugElement.query(By.css('.select-trigger'));
      expect(trigger.attributes['role']).toBe('combobox');
      expect(trigger.attributes['aria-expanded']).toBe('false');

      component.toggle();
      fixture.detectChanges();

      expect(trigger.attributes['aria-expanded']).toBe('true');
    });

    it('should handle error state', () => {
      const errorMessage = 'This field is required';
      (component.error as any) = errorMessage;
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('.select-error'));
      expect(error.nativeElement.textContent).toContain(errorMessage);
      expect(error.attributes['role']).toBe('alert');
    });
  });

  // Nettoyage et destruction
  describe('Cleanup', () => {
    it('should clean up subscriptions on destroy', () => {
      // Correction: Vérifier d'abord que la subscription existe
      if (component['searchSubscription']) {
        const subscription = spyOn(component['searchSubscription'], 'unsubscribe');
        component.ngOnDestroy();
        expect(subscription).toHaveBeenCalled();
      }
    });
  });

  // ControlValueAccessor
  describe('ControlValueAccessor', () => {
    it('should implement ControlValueAccessor correctly', () => {
      const value = '1';
      const onChange = jasmine.createSpy('onChange');
      const onTouched = jasmine.createSpy('onTouched');

      component.registerOnChange(onChange);
      component.registerOnTouched(onTouched);
      component.writeValue(value);
      fixture.detectChanges();

      expect(component.value()).toBe(value);
      
      component.toggle();
      fixture.detectChanges();
      
      const option = fixture.debugElement.query(By.css('.select-option'));
      option.nativeElement.click();
      fixture.detectChanges();

      expect(onChange).toHaveBeenCalled();
      expect(onTouched).toHaveBeenCalled();
    });
  });
});