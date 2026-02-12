import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { PshSelectComponent } from './select.component';
import { SelectOption, SelectOptionGroup } from './select.types';

@Component({
  template: `
    <psh-select
      [options]="options"
      [formControl]="control"
    />
  `,
  imports: [PshSelectComponent, ReactiveFormsModule]
})
class TestHostComponent {
  options: SelectOption<string>[] = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ];
  control = new FormControl<string | null>(null);
}

describe('PshSelectComponent', () => {
  let fixture: ComponentFixture<PshSelectComponent>;

  const mockOptions: SelectOption<string>[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
    { label: 'Cherry', value: 'cherry' }
  ];

  const mockOptionsWithDescriptions: SelectOption<string>[] = [
    { label: 'Apple', value: 'apple', description: 'A red fruit' },
    { label: 'Banana', value: 'banana', description: 'A yellow fruit' }
  ];

  const mockOptionsWithDisabled: SelectOption<string>[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana', disabled: true },
    { label: 'Cherry', value: 'cherry' }
  ];

  const mockOptionGroups: (SelectOption<string> | SelectOptionGroup<string>)[] = [
    {
      label: 'Fruits',
      options: [
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
      ]
    },
    {
      label: 'Vegetables',
      options: [
        { label: 'Carrot', value: 'carrot' },
        { label: 'Broccoli', value: 'broccoli' }
      ]
    }
  ];

  const mockOptionsWithIcons: SelectOption<string>[] = [
    { label: 'Home', value: 'home', icon: 'house' },
    { label: 'Settings', value: 'settings', icon: 'gear' }
  ];

  const mockDisabledGroup: (SelectOption<string> | SelectOptionGroup<string>)[] = [
    {
      label: 'Disabled Group',
      disabled: true,
      options: [
        { label: 'Option A', value: 'a' },
        { label: 'Option B', value: 'b' }
      ]
    },
    {
      label: 'Enabled Group',
      options: [
        { label: 'Option C', value: 'c' }
      ]
    }
  ];

  const getCombobox = () =>
    fixture.nativeElement.querySelector('[role="combobox"]') as HTMLElement;

  const getListbox = () =>
    fixture.nativeElement.querySelector('[role="listbox"]') as HTMLElement;

  const getOptions = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="option"]')) as HTMLElement[];

  const getOption = (index: number) =>
    getOptions()[index] as HTMLElement;

  const getLabel = () =>
    fixture.nativeElement.querySelector('.select-label') as HTMLElement;

  const getErrorMessage = () =>
    fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;

  const getSuccessMessage = () =>
    fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;

  const getHintMessage = () =>
    fixture.nativeElement.querySelector('.select-hint') as HTMLElement;

  const getClearButton = () =>
    fixture.nativeElement.querySelector('.select-clear') as HTMLButtonElement;

  const getSearchInput = () =>
    fixture.nativeElement.querySelector('.select-search input') as HTMLInputElement;

  const getNoResultsMessage = () =>
    fixture.nativeElement.querySelector('.select-no-results') as HTMLElement;

  const getGroupLabels = () =>
    Array.from(fixture.nativeElement.querySelectorAll('.select-group-label')) as HTMLElement[];

  const openSelect = () => {
    getCombobox().click();
    fixture.detectChanges();
  };

  const pressKey = (key: string, target: HTMLElement = getCombobox()) => {
    const event = new KeyboardEvent('keydown', { key, bubbles: true });
    target.dispatchEvent(event);
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PshSelectComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PshSelectComponent);
    fixture.componentRef.setInput('options', mockOptions);
    fixture.detectChanges();
  });

  describe('Content rendering', () => {
    it('should render a combobox trigger', () => {
      expect(getCombobox()).toBeTruthy();
    });

    it('should display placeholder text when no value is selected', () => {
      const combobox = getCombobox();
      expect(combobox.textContent).toContain('Sélectionner une option');
    });

    it('should display custom placeholder when provided', () => {
      fixture.componentRef.setInput('placeholder', 'Choose an item');
      fixture.detectChanges();

      expect(getCombobox().textContent).toContain('Choose an item');
    });

    it('should display label when provided', () => {
      fixture.componentRef.setInput('label', 'Select a fruit');
      fixture.detectChanges();

      const label = getLabel();
      expect(label).toBeTruthy();
      expect(label.textContent).toContain('Select a fruit');
    });

    it('should show dropdown with listbox role when opened', () => {
      expect(getListbox()).toBeFalsy();

      openSelect();

      expect(getListbox()).toBeTruthy();
    });

    it('should render all options with option role', () => {
      openSelect();

      const options = getOptions();
      expect(options.length).toBe(3);
    });

    it('should display option labels', () => {
      openSelect();

      const options = getOptions();
      expect(options[0]!.textContent).toContain('Apple');
      expect(options[1]!.textContent).toContain('Banana');
      expect(options[2]!.textContent).toContain('Cherry');
    });

    it('should display option descriptions when provided', () => {
      fixture.componentRef.setInput('options', mockOptionsWithDescriptions);
      fixture.detectChanges();
      openSelect();

      const options = getOptions();
      expect(options[0]!.textContent).toContain('A red fruit');
      expect(options[1]!.textContent).toContain('A yellow fruit');
    });

    it('should display "Aucun résultat" when no options match search', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();
      openSelect();

      const searchInput = getSearchInput();
      searchInput.value = 'xyz';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(getNoResultsMessage()).toBeTruthy();
      expect(getNoResultsMessage().textContent).toContain('Aucun résultat');
    });

    it('should display error message with alert role', () => {
      fixture.componentRef.setInput('error', 'This field is required');
      fixture.detectChanges();

      const errorMsg = getErrorMessage();
      expect(errorMsg).toBeTruthy();
      expect(errorMsg.textContent).toContain('This field is required');
    });

    it('should display success message with status role', () => {
      fixture.componentRef.setInput('success', 'Valid selection');
      fixture.detectChanges();

      const successMsg = getSuccessMessage();
      expect(successMsg).toBeTruthy();
      expect(successMsg.textContent).toContain('Valid selection');
    });

    it('should display hint message when provided', () => {
      fixture.componentRef.setInput('hint', 'Select your favorite fruit');
      fixture.detectChanges();

      const hintMsg = getHintMessage();
      expect(hintMsg).toBeTruthy();
      expect(hintMsg.textContent).toContain('Select your favorite fruit');
    });

    it('should render option groups with group labels', () => {
      fixture.componentRef.setInput('options', mockOptionGroups);
      fixture.detectChanges();
      openSelect();

      const groupLabels = getGroupLabels();
      expect(groupLabels.length).toBe(2);
      expect(groupLabels[0]!.textContent).toContain('Fruits');
      expect(groupLabels[1]!.textContent).toContain('Vegetables');
    });

    it('should render all options within groups', () => {
      fixture.componentRef.setInput('options', mockOptionGroups);
      fixture.detectChanges();
      openSelect();

      const options = getOptions();
      expect(options.length).toBe(4);
    });
  });

  describe('Open/Close behavior', () => {
    it('should open on trigger click', () => {
      expect(getListbox()).toBeFalsy();

      openSelect();

      expect(getListbox()).toBeTruthy();
    });

    it('should close on second trigger click', () => {
      openSelect();
      expect(getListbox()).toBeTruthy();

      getCombobox().click();
      fixture.detectChanges();

      expect(getListbox()).toBeFalsy();
    });

    it('should emit opened event when opening', () => {
      const openedSpy = jest.fn();
      fixture.componentInstance.opened.subscribe(openedSpy);

      openSelect();

      expect(openedSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit closed event when closing', () => {
      const closedSpy = jest.fn();
      fixture.componentInstance.closed.subscribe(closedSpy);

      openSelect();
      getCombobox().click();
      fixture.detectChanges();

      expect(closedSpy).toHaveBeenCalledTimes(1);
    });

    it('should close on outside click', fakeAsync(() => {
      openSelect();
      expect(getListbox()).toBeTruthy();

      document.body.click();
      tick();
      fixture.detectChanges();

      expect(getListbox()).toBeFalsy();
    }));

    it('should close on Escape key', () => {
      openSelect();
      expect(getListbox()).toBeTruthy();

      pressKey('Escape');

      expect(getListbox()).toBeFalsy();
    });

    it('should close on Tab key', () => {
      openSelect();
      expect(getListbox()).toBeTruthy();

      pressKey('Tab');

      expect(getListbox()).toBeFalsy();
    });
  });

  describe('Selection behavior', () => {
    it('should select option on click and update displayed label', () => {
      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      expect(getCombobox().textContent).toContain('Apple');
    });

    it('should emit valueChange with selected value', () => {
      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(1).click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenCalledWith('banana');
    });

    it('should close after single selection', () => {
      openSelect();
      expect(getListbox()).toBeTruthy();

      getOption(0).click();
      fixture.detectChanges();

      expect(getListbox()).toBeFalsy();
    });

    it('should show selected option with aria-selected="true"', () => {
      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      openSelect();

      expect(getOption(0).getAttribute('aria-selected')).toBe('true');
      expect(getOption(1).getAttribute('aria-selected')).toBe('false');
    });

    it('should NOT select disabled options', () => {
      fixture.componentRef.setInput('options', mockOptionsWithDisabled);
      fixture.detectChanges();

      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(1).click();
      fixture.detectChanges();

      expect(valueChangeSpy).not.toHaveBeenCalled();
      expect(getCombobox().textContent).toContain('Sélectionner une option');
    });

    it('should keep dropdown open after selection in multiple mode', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.detectChanges();

      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      expect(getListbox()).toBeTruthy();
    });

    it('should toggle selection on re-click in multiple mode', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.detectChanges();

      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenLastCalledWith(['apple']);

      getOption(0).click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenLastCalledWith([]);
    });

    it('should display multiple selected labels separated by comma', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.detectChanges();

      openSelect();
      getOption(0).click();
      fixture.detectChanges();
      getOption(1).click();
      fixture.detectChanges();

      getCombobox().click();
      fixture.detectChanges();

      expect(getCombobox().textContent).toContain('Apple');
      expect(getCombobox().textContent).toContain('Banana');
    });
  });

  describe('Clear button', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('clearable', true);
      fixture.detectChanges();
    });

    it('should NOT show clear button when no value is selected', () => {
      expect(getClearButton()).toBeFalsy();
    });

    it('should show clear button when value is selected', () => {
      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      expect(getClearButton()).toBeTruthy();
    });

    it('should clear selection and emit event when clear button clicked', () => {
      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      getClearButton().click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenLastCalledWith(null);
      expect(getCombobox().textContent).toContain('Sélectionner une option');
    });

    it('should clear to empty array in multiple mode', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.detectChanges();

      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      getCombobox().click();
      fixture.detectChanges();

      getClearButton().click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenLastCalledWith([]);
    });
  });

  describe('Keyboard navigation', () => {
    it('should open dropdown on Enter key', () => {
      pressKey('Enter');

      expect(getListbox()).toBeTruthy();
    });

    it('should open dropdown on Space key', () => {
      pressKey(' ');

      expect(getListbox()).toBeTruthy();
    });

    it('should open dropdown on ArrowDown key', () => {
      pressKey('ArrowDown');

      expect(getListbox()).toBeTruthy();
    });

    it('should focus first option with ArrowDown', () => {
      openSelect();

      pressKey('ArrowDown');

      const combobox = getCombobox();
      const activeDescendant = combobox.getAttribute('aria-activedescendant');
      expect(activeDescendant).toContain('apple');
    });

    it('should focus second option after two ArrowDown presses', () => {
      openSelect();

      pressKey('ArrowDown');
      pressKey('ArrowDown');

      const combobox = getCombobox();
      const activeDescendant = combobox.getAttribute('aria-activedescendant');
      expect(activeDescendant).toContain('banana');
    });

    it('should navigate backward with ArrowUp to previous option', () => {
      openSelect();

      pressKey('ArrowDown');
      pressKey('ArrowDown');
      pressKey('ArrowUp');

      const combobox = getCombobox();
      const activeDescendant = combobox.getAttribute('aria-activedescendant');
      expect(activeDescendant).toContain('apple');
    });

    it('should wrap to first option when pressing ArrowDown on last option', () => {
      openSelect();

      pressKey('ArrowDown');
      pressKey('ArrowDown');
      pressKey('ArrowDown');
      pressKey('ArrowDown');

      const combobox = getCombobox();
      const activeDescendant = combobox.getAttribute('aria-activedescendant');
      expect(activeDescendant).toContain('apple');
    });

    it('should wrap to last option when pressing ArrowUp on first option', () => {
      openSelect();

      pressKey('ArrowDown');
      pressKey('ArrowUp');

      const combobox = getCombobox();
      const activeDescendant = combobox.getAttribute('aria-activedescendant');
      expect(activeDescendant).toContain('cherry');
    });

    it('should focus first option on Home key', () => {
      openSelect();

      pressKey('ArrowDown');
      pressKey('ArrowDown');
      pressKey('Home');

      const combobox = getCombobox();
      const activeDescendant = combobox.getAttribute('aria-activedescendant');
      expect(activeDescendant).toContain('apple');
    });

    it('should focus last option on End key', () => {
      openSelect();

      pressKey('End');

      const combobox = getCombobox();
      const activeDescendant = combobox.getAttribute('aria-activedescendant');
      expect(activeDescendant).toContain('cherry');
    });

    it('should select focused option on Enter', () => {
      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      pressKey('ArrowDown');
      pressKey('Enter');

      expect(valueChangeSpy).toHaveBeenCalledWith('apple');
    });

    it('should select focused option on Space', () => {
      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      pressKey('ArrowDown');
      pressKey(' ');

      expect(valueChangeSpy).toHaveBeenCalledWith('apple');
    });
  });

  describe('Searchable mode', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();
    });

    it('should show search input when searchable', () => {
      openSelect();

      expect(getSearchInput()).toBeTruthy();
    });

    it('should filter options based on typed text', () => {
      openSelect();

      const searchInput = getSearchInput();
      searchInput.value = 'app';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const options = getOptions();
      expect(options.length).toBe(1);
      expect(options[0]!.textContent).toContain('Apple');
    });

    it('should emit searched event with search term', () => {
      const searchedSpy = jest.fn();
      fixture.componentInstance.searched.subscribe(searchedSpy);

      openSelect();

      const searchInput = getSearchInput();
      searchInput.value = 'ban';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(searchedSpy).toHaveBeenCalledWith('ban');
    });

    it('should show no results message when no matches', () => {
      openSelect();

      const searchInput = getSearchInput();
      searchInput.value = 'xyz';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      expect(getNoResultsMessage()).toBeTruthy();
      expect(getOptions().length).toBe(0);
    });

    it('should filter by description as well', () => {
      fixture.componentRef.setInput('options', mockOptionsWithDescriptions);
      fixture.detectChanges();
      openSelect();

      const searchInput = getSearchInput();
      searchInput.value = 'yellow';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      const options = getOptions();
      expect(options.length).toBe(1);
      expect(options[0]!.textContent).toContain('Banana');
    });
  });

  describe('Disabled state', () => {
    it('should have aria-disabled="true" when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-disabled')).toBe('true');
    });

    it('should have tabindex="-1" when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(getCombobox().getAttribute('tabindex')).toBe('-1');
    });

    it('should NOT open when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      openSelect();

      expect(getListbox()).toBeFalsy();
    });

    it('should NOT emit opened event when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const openedSpy = jest.fn();
      fixture.componentInstance.opened.subscribe(openedSpy);

      openSelect();

      expect(openedSpy).not.toHaveBeenCalled();
    });

    it('should apply disabled class to host', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('disabled')).toBe(true);
    });
  });

  describe('Loading state', () => {
    it('should have aria-busy="true" when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-busy')).toBe('true');
    });

    it('should have tabindex="-1" when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(getCombobox().getAttribute('tabindex')).toBe('-1');
    });

    it('should NOT open when loading', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      openSelect();

      expect(getListbox()).toBeFalsy();
    });

    it('should apply loading class to host', () => {
      fixture.componentRef.setInput('loading', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('loading')).toBe(true);
    });
  });

  describe('Size variants', () => {
    it.each([
      ['small', 'small'],
      ['large', 'large']
    ])('should apply %s class when size is %s', (size, expectedClass) => {
      fixture.componentRef.setInput('size', size);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains(expectedClass)).toBe(true);
    });

    it('should NOT apply small or large class when size is medium', () => {
      fixture.componentRef.setInput('size', 'medium');
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('small')).toBe(false);
      expect(fixture.nativeElement.classList.contains('large')).toBe(false);
    });
  });

  describe('State classes', () => {
    it('should apply error class when error is set', () => {
      fixture.componentRef.setInput('error', 'Error message');
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('error')).toBe(true);
    });

    it('should apply success class when success is set', () => {
      fixture.componentRef.setInput('success', 'Success message');
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('success')).toBe(true);
    });

    it('should apply full-width class when fullWidth is true', () => {
      fixture.componentRef.setInput('fullWidth', true);
      fixture.detectChanges();

      expect(fixture.nativeElement.classList.contains('full-width')).toBe(true);
    });
  });

  describe('Accessibility attributes', () => {
    it('should have role="combobox" on trigger', () => {
      expect(getCombobox().getAttribute('role')).toBe('combobox');
    });

    it('should have aria-expanded="false" when closed', () => {
      expect(getCombobox().getAttribute('aria-expanded')).toBe('false');
    });

    it('should have aria-expanded="true" when open', () => {
      openSelect();

      expect(getCombobox().getAttribute('aria-expanded')).toBe('true');
    });

    it('should have aria-required="true" when required', () => {
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-required')).toBe('true');
    });

    it('should have aria-required="false" when not required', () => {
      fixture.componentRef.setInput('required', false);
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-required')).toBe('false');
    });

    it('should have aria-invalid="true" when error is present', () => {
      fixture.componentRef.setInput('error', 'Error');
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-invalid')).toBe('true');
    });

    it('should have aria-invalid="false" when no error', () => {
      expect(getCombobox().getAttribute('aria-invalid')).toBe('false');
    });

    it('should have aria-describedby pointing to error message when error exists', () => {
      fixture.componentRef.setInput('error', 'Error');
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-describedby')).toBe('error-message');
    });

    it('should have aria-describedby pointing to success message when success exists', () => {
      fixture.componentRef.setInput('success', 'Success');
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-describedby')).toBe('success-message');
    });

    it('should have aria-describedby pointing to hint message when hint exists', () => {
      fixture.componentRef.setInput('hint', 'Hint');
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-describedby')).toBe('hint-message');
    });

    it('should use ariaLabel as aria-label when provided', () => {
      fixture.componentRef.setInput('ariaLabel', 'Custom aria label');
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-label')).toBe('Custom aria label');
    });

    it('should fall back to label for aria-label', () => {
      fixture.componentRef.setInput('label', 'Label text');
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-label')).toBe('Label text');
    });

    it('should fall back to placeholder for aria-label', () => {
      fixture.componentRef.setInput('placeholder', 'Placeholder text');
      fixture.detectChanges();

      expect(getCombobox().getAttribute('aria-label')).toBe('Placeholder text');
    });

    it('should have aria-multiselectable on listbox in multiple mode', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.detectChanges();
      openSelect();

      expect(getListbox().getAttribute('aria-multiselectable')).toBe('true');
    });

    it('should have unique id on each option', () => {
      openSelect();

      const options = getOptions();
      const ids = options.map(opt => opt.getAttribute('id'));
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(options.length);
      ids.forEach(id => expect(id).toBeTruthy());
    });

    it('should have aria-disabled on disabled options', () => {
      fixture.componentRef.setInput('options', mockOptionsWithDisabled);
      fixture.detectChanges();
      openSelect();

      expect(getOption(1).getAttribute('aria-disabled')).toBe('true');
    });

    it('should have tabindex="0" when enabled', () => {
      expect(getCombobox().getAttribute('tabindex')).toBe('0');
    });

    it('should have tabindex="-1" on disabled options', () => {
      fixture.componentRef.setInput('options', mockOptionsWithDisabled);
      fixture.detectChanges();
      openSelect();

      expect(getOption(1).getAttribute('tabindex')).toBe('-1');
    });

    it('should have aria-haspopup="listbox" on combobox', () => {
      expect(getCombobox().getAttribute('aria-haspopup')).toBe('listbox');
    });

    it('should have aria-controls pointing to listbox id', () => {
      const combobox = getCombobox();
      const expectedListboxId = combobox.getAttribute('id') + '-listbox';
      expect(combobox.getAttribute('aria-controls')).toBe(expectedListboxId);
    });

    it('should have listbox with matching id for aria-controls', () => {
      openSelect();

      const combobox = getCombobox();
      const listbox = getListbox();
      expect(listbox.getAttribute('id')).toBe(combobox.getAttribute('aria-controls'));
    });
  });

  describe('Label behavior', () => {
    it('should associate label with select via for attribute', () => {
      fixture.componentRef.setInput('label', 'Select fruit');
      fixture.detectChanges();

      const label = getLabel();
      const combobox = getCombobox();

      expect(label.getAttribute('for')).toBe(combobox.getAttribute('id'));
    });

    it('should show required indicator when required', () => {
      fixture.componentRef.setInput('label', 'Select fruit');
      fixture.componentRef.setInput('required', true);
      fixture.detectChanges();

      const label = getLabel();
      expect(label.classList.contains('required')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty options array', () => {
      fixture.componentRef.setInput('options', []);
      fixture.detectChanges();
      openSelect();

      expect(getNoResultsMessage()).toBeTruthy();
    });

    it('should work with custom compareWith function', () => {
      const objectOptions: SelectOption<{ id: number }>[] = [
        { label: 'Option 1', value: { id: 1 } },
        { label: 'Option 2', value: { id: 2 } }
      ];

      fixture.componentRef.setInput('options', objectOptions);
      fixture.componentRef.setInput('compareWith', (a: { id: number }, b: { id: number }) => a.id === b.id);
      fixture.detectChanges();

      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      expect(getCombobox().textContent).toContain('Option 1');
    });

    it('should respect maxSelections in multiple mode', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.componentRef.setInput('maxSelections', 2);
      fixture.detectChanges();

      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(0).click();
      fixture.detectChanges();
      getOption(1).click();
      fixture.detectChanges();
      getOption(2).click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenLastCalledWith(['apple', 'banana']);
    });

    it('should respect minSelections in multiple mode', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.componentRef.setInput('minSelections', 1);
      fixture.detectChanges();

      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenCalledTimes(1);
      expect(valueChangeSpy).toHaveBeenCalledWith(['apple']);

      getOption(0).click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Icon rendering', () => {
    it('should render icons when provided in options', () => {
      fixture.componentRef.setInput('options', mockOptionsWithIcons);
      fixture.detectChanges();
      openSelect();

      const icons = fixture.nativeElement.querySelectorAll('.select-option i.ph');
      expect(icons.length).toBe(2);
      expect(icons[0].classList.contains('ph-house')).toBe(true);
      expect(icons[1].classList.contains('ph-gear')).toBe(true);
    });

    it('should NOT render icons when not provided', () => {
      openSelect();

      const options = getOptions();
      options.forEach(opt => {
        const icon = opt.querySelector('i.ph:not(.ph-check)');
        expect(icon).toBeFalsy();
      });
    });
  });

  describe('Disabled groups', () => {
    it('should mark all options in disabled group as disabled', () => {
      fixture.componentRef.setInput('options', mockDisabledGroup);
      fixture.detectChanges();
      openSelect();

      const options = getOptions();
      expect(options[0]!.getAttribute('aria-disabled')).toBe('true');
      expect(options[1]!.getAttribute('aria-disabled')).toBe('true');
      expect(options[2]!.getAttribute('aria-disabled')).toBeNull();
    });

    it('should NOT select options from disabled group', () => {
      fixture.componentRef.setInput('options', mockDisabledGroup);
      fixture.detectChanges();

      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      expect(valueChangeSpy).not.toHaveBeenCalled();
    });

    it('should allow selecting options from enabled group', () => {
      fixture.componentRef.setInput('options', mockDisabledGroup);
      fixture.detectChanges();

      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(2).click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenCalledWith('c');
    });
  });

  describe('Selection from groups', () => {
    it('should select option from within a group', () => {
      fixture.componentRef.setInput('options', mockOptionGroups);
      fixture.detectChanges();

      const valueChangeSpy = jest.fn();
      fixture.componentInstance.valueChange.subscribe(valueChangeSpy);

      openSelect();
      getOption(2).click();
      fixture.detectChanges();

      expect(valueChangeSpy).toHaveBeenCalledWith('carrot');
    });

    it('should display selected option label from group', () => {
      fixture.componentRef.setInput('options', mockOptionGroups);
      fixture.detectChanges();

      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      expect(getCombobox().textContent).toContain('Apple');
    });
  });

  describe('Multiple placeholder', () => {
    it('should display multiplePlaceholder when in multiple mode with no selection', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.componentRef.setInput('multiplePlaceholder', 'Select items');
      fixture.detectChanges();

      expect(getCombobox().textContent).toContain('Select items');
    });

    it('should display selected labels instead of placeholder when items selected', () => {
      fixture.componentRef.setInput('multiple', true);
      fixture.componentRef.setInput('multiplePlaceholder', 'Select items');
      fixture.detectChanges();

      openSelect();
      getOption(0).click();
      fixture.detectChanges();

      expect(getCombobox().textContent).toContain('Apple');
      expect(getCombobox().textContent).not.toContain('Select items');
    });
  });

  describe('Search term reset', () => {
    it('should clear search term when dropdown closes', () => {
      fixture.componentRef.setInput('searchable', true);
      fixture.detectChanges();

      openSelect();
      const searchInput = getSearchInput();
      searchInput.value = 'app';
      searchInput.dispatchEvent(new Event('input'));
      fixture.detectChanges();

      pressKey('Escape');
      openSelect();

      expect(getSearchInput().value).toBe('');
      expect(getOptions().length).toBe(3);
    });
  });
});

describe('PshSelectComponent with ControlValueAccessor', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  const getCombobox = () =>
    fixture.nativeElement.querySelector('[role="combobox"]') as HTMLElement;

  const getOptions = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="option"]')) as HTMLElement[];

  const openSelect = () => {
    getCombobox().click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should sync value with form control', () => {
    openSelect();
    getOptions()[0]!.click();
    fixture.detectChanges();

    expect(hostComponent.control.value).toBe('opt1');
  });

  it('should update display when form control value changes', () => {
    hostComponent.control.setValue('opt2');
    fixture.detectChanges();

    expect(getCombobox().textContent).toContain('Option 2');
  });

  it('should be disabled when form control is disabled', () => {
    hostComponent.control.disable();
    fixture.detectChanges();

    expect(getCombobox().getAttribute('aria-disabled')).toBe('true');
  });

  it('should be enabled when form control is enabled', () => {
    hostComponent.control.disable();
    fixture.detectChanges();
    hostComponent.control.enable();
    fixture.detectChanges();

    expect(getCombobox().getAttribute('aria-disabled')).toBe('false');
  });
});

// ── CVA emission safety tests ────────────────────────────────────────

@Component({
  template: `
    <psh-select
      [options]="options"
      [formControl]="control"
      (valueChange)="onValueChange($event)"
      (disabledChange)="onDisabledChange($event)"
    />
  `,
  imports: [PshSelectComponent, ReactiveFormsModule]
})
class CvaEmissionTestHost {
  options: SelectOption<string>[] = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' }
  ];
  control = new FormControl<string | null>(null);
  onValueChange = jest.fn();
  onDisabledChange = jest.fn();
}

describe('PshSelectComponent CVA emission safety', () => {
  let fixture: ComponentFixture<CvaEmissionTestHost>;
  let host: CvaEmissionTestHost;

  const getCombobox = () =>
    fixture.nativeElement.querySelector('[role="combobox"]') as HTMLElement;

  const getOptions = () =>
    Array.from(fixture.nativeElement.querySelectorAll('[role="option"]')) as HTMLElement[];

  const openSelect = () => {
    getCombobox().click();
    fixture.detectChanges();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CvaEmissionTestHost]
    }).compileComponents();

    fixture = TestBed.createComponent(CvaEmissionTestHost);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should NOT emit valueChange when form control sets value via setValue', () => {
    host.onValueChange.mockClear();

    host.control.setValue('opt1');
    fixture.detectChanges();

    expect(host.onValueChange).not.toHaveBeenCalled();
  });

  it('should NOT emit valueChange when form control sets value via patchValue', () => {
    host.onValueChange.mockClear();

    host.control.patchValue('opt2');
    fixture.detectChanges();

    expect(host.onValueChange).not.toHaveBeenCalled();
  });

  it('should NOT emit disabledChange when form control is disabled', () => {
    host.onDisabledChange.mockClear();

    host.control.disable();
    fixture.detectChanges();

    expect(host.onDisabledChange).not.toHaveBeenCalled();
  });

  it('should NOT emit disabledChange when form control is enabled', () => {
    host.control.disable();
    fixture.detectChanges();
    host.onDisabledChange.mockClear();

    host.control.enable();
    fixture.detectChanges();

    expect(host.onDisabledChange).not.toHaveBeenCalled();
  });

  it('should emit valueChange exactly once on user selection', () => {
    host.onValueChange.mockClear();

    openSelect();
    getOptions()[0]!.click();
    fixture.detectChanges();

    expect(host.onValueChange).toHaveBeenCalledTimes(1);
    expect(host.onValueChange).toHaveBeenCalledWith('opt1');
  });

  it('should NOT emit valueChange on initial render', () => {
    expect(host.onValueChange).not.toHaveBeenCalled();
  });

  it('should emit valueChange once when using formControlName and (valueChange) together', () => {
    host.onValueChange.mockClear();

    // Programmatic set should NOT fire
    host.control.setValue('opt1');
    fixture.detectChanges();
    expect(host.onValueChange).not.toHaveBeenCalled();

    // User selection should fire exactly once
    openSelect();
    getOptions()[1]!.click();
    fixture.detectChanges();
    expect(host.onValueChange).toHaveBeenCalledTimes(1);
    expect(host.onValueChange).toHaveBeenCalledWith('opt2');
  });
});
