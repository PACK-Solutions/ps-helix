import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { axe } from 'jest-axe';

import { PshCheckboxComponent } from '../components/checkbox/checkbox.component';
import { PshSwitchComponent } from '../components/switch/switch.component';
import { PshRadioComponent } from '../components/radio/radio.component';
import { PshInputComponent } from '../components/input/input.component';
import { PshBadgeComponent } from '../components/badge/badge.component';
import { PshButtonComponent } from '../components/button/button.component';
import { PshTagComponent } from '../components/tag/tag.component';
import { PshAlertComponent } from '../components/alert/alert.component';
import { PshAvatarComponent } from '../components/avatar/avatar.component';
import { PshProgressbarComponent } from '../components/progressbar/progressbar.component';
import { PshSpinLoaderComponent } from '../components/spinloader/spinloader.component';
import { PshTextareaComponent } from '../components/textarea/textarea.component';
import { PshCardComponent } from '../components/card/card.component';
import { PshPaginationComponent } from '../components/pagination/pagination.component';
import { PshTooltipComponent } from '../components/tooltip/tooltip.component';
import { PshTabsComponent } from '../components/tabs/tabs.component';
import { PshTabComponent } from '../components/tabs/tab.component';
import { PshSelectComponent } from '../components/select/select.component';
import { PshDropdownComponent } from '../components/dropdown/dropdown.component';
import { PshMenuComponent } from '../components/menu/menu.component';
import { PshTabBarComponent } from '../components/tab-bar/tab-bar.component';
import { SelectOption } from '../components/select/select.types';
import { DropdownItem } from '../components/dropdown/dropdown.types';
import { MenuItem } from '../components/menu/menu.types';
import { TabBarItem } from '../components/tab-bar/tab-bar.types';

/** Runs axe-core on a rendered fixture and asserts no accessibility violations. */
async function expectNoViolations(fixture: ComponentFixture<unknown>): Promise<void> {
  fixture.detectChanges();
  document.body.appendChild(fixture.nativeElement);
  try {
    const results = await axe(fixture.nativeElement, {
      // Colour contrast cannot be computed without layout (jsdom).
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  } finally {
    fixture.nativeElement.remove();
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-checkbox [label]="label" [error]="error" [disabled]="disabled"></psh-checkbox>`,
  imports: [PshCheckboxComponent],
})
class CheckboxHost {
  label = 'Accept the terms';
  error: string | null = null;
  disabled = false;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-switch [label]="label" [error]="error"></psh-switch>`,
  imports: [PshSwitchComponent],
})
class SwitchHost {
  label = 'Enable notifications';
  error = '';
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-radio [label]="label" name="group" [value]="1"></psh-radio>`,
  imports: [PshRadioComponent],
})
class RadioHost {
  label = 'Option one';
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-input [label]="label" [error]="error"></psh-input>`,
  imports: [PshInputComponent],
})
class InputHost {
  label = 'Full name';
  error: string | null = null;
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-badge [value]="5" ariaLabel="5 unread messages"></psh-badge>`,
  imports: [PshBadgeComponent],
})
class BadgeHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-button>Save changes</psh-button>`,
  imports: [PshButtonComponent],
})
class ButtonHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-tag content="Beta"></psh-tag>`,
  imports: [PshTagComponent],
})
class TagHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-alert type="info">Your changes were saved.</psh-alert>`,
  imports: [PshAlertComponent],
})
class AlertHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-avatar initials="JD" ariaLabel="John Doe"></psh-avatar>`,
  imports: [PshAvatarComponent],
})
class AvatarHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-progressbar [value]="60" ariaLabel="Upload progress"></psh-progressbar>`,
  imports: [PshProgressbarComponent],
})
class ProgressbarHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-spinloader></psh-spinloader>`,
  imports: [PshSpinLoaderComponent],
})
class SpinloaderHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-textarea label="Your comments"></psh-textarea>`,
  imports: [PshTextareaComponent],
})
class TextareaHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-card title="Card title" description="A short description">Body content</psh-card>`,
  imports: [PshCardComponent],
})
class CardHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-pagination [totalPages]="10" [currentPage]="3"></psh-pagination>`,
  imports: [PshPaginationComponent],
})
class PaginationHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-tooltip content="More information"><button type="button">Info</button></psh-tooltip>`,
  imports: [PshTooltipComponent],
})
class TooltipHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <psh-tabs>
      <psh-tab header="First">Content A</psh-tab>
      <psh-tab header="Second">Content B</psh-tab>
    </psh-tabs>
  `,
  imports: [PshTabsComponent, PshTabComponent],
})
class TabsHost {}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-select label="Fruit" [options]="options"></psh-select>`,
  imports: [PshSelectComponent],
})
class SelectHost {
  options: SelectOption<string>[] = [
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' },
  ];
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-dropdown label="Actions" [items]="items"></psh-dropdown>`,
  imports: [PshDropdownComponent],
})
class DropdownHost {
  items: DropdownItem[] = [
    { content: 'Edit', value: 'edit' },
    { content: 'Delete', value: 'delete' },
  ];
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-menu [items]="items"></psh-menu>`,
  imports: [PshMenuComponent],
})
class MenuHost {
  items: MenuItem[] = [
    { id: 'home', content: 'Home' },
    { id: 'settings', content: 'Settings' },
  ];
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-tab-bar [items]="items"></psh-tab-bar>`,
  imports: [PshTabBarComponent],
})
class TabBarHost {
  items: TabBarItem[] = [
    { id: 'a', label: 'Tab A', icon: 'house' },
    { id: 'b', label: 'Tab B', icon: 'gear' },
  ];
}

describe('a11y (jest-axe)', () => {
  it('checkbox — default', async () => {
    await expectNoViolations(TestBed.createComponent(CheckboxHost));
  });

  it('checkbox — error + disabled', async () => {
    const f = TestBed.createComponent(CheckboxHost);
    f.componentInstance.error = 'This field is required';
    f.componentInstance.disabled = true;
    await expectNoViolations(f);
  });

  it('switch — default', async () => {
    await expectNoViolations(TestBed.createComponent(SwitchHost));
  });

  it('switch — error', async () => {
    const f = TestBed.createComponent(SwitchHost);
    f.componentInstance.error = 'Please toggle this';
    await expectNoViolations(f);
  });

  it('radio', async () => {
    await expectNoViolations(TestBed.createComponent(RadioHost));
  });

  it('input — default', async () => {
    await expectNoViolations(TestBed.createComponent(InputHost));
  });

  it('input — error', async () => {
    const f = TestBed.createComponent(InputHost);
    f.componentInstance.error = 'Invalid value';
    await expectNoViolations(f);
  });

  it('badge', async () => {
    await expectNoViolations(TestBed.createComponent(BadgeHost));
  });

  it('button', async () => {
    await expectNoViolations(TestBed.createComponent(ButtonHost));
  });

  it('tag', async () => {
    await expectNoViolations(TestBed.createComponent(TagHost));
  });

  it('alert', async () => {
    await expectNoViolations(TestBed.createComponent(AlertHost));
  });

  it('avatar', async () => {
    await expectNoViolations(TestBed.createComponent(AvatarHost));
  });

  it('progressbar', async () => {
    await expectNoViolations(TestBed.createComponent(ProgressbarHost));
  });

  it('spinloader', async () => {
    await expectNoViolations(TestBed.createComponent(SpinloaderHost));
  });

  it('textarea', async () => {
    await expectNoViolations(TestBed.createComponent(TextareaHost));
  });

  it('card', async () => {
    await expectNoViolations(TestBed.createComponent(CardHost));
  });

  it('pagination', async () => {
    await expectNoViolations(TestBed.createComponent(PaginationHost));
  });

  it('tooltip', async () => {
    await expectNoViolations(TestBed.createComponent(TooltipHost));
  });

  it('tabs', async () => {
    await expectNoViolations(TestBed.createComponent(TabsHost));
  });

  it('select — closed', async () => {
    await expectNoViolations(TestBed.createComponent(SelectHost));
  });

  it('dropdown — closed', async () => {
    await expectNoViolations(TestBed.createComponent(DropdownHost));
  });

  it('menu', async () => {
    await expectNoViolations(TestBed.createComponent(MenuHost));
  });

  it('tab-bar', async () => {
    await expectNoViolations(TestBed.createComponent(TabBarHost));
  });
});
