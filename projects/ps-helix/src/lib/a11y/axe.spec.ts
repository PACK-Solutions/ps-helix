import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { axe } from 'jest-axe';

import { PshCheckboxComponent } from '../components/checkbox/checkbox.component';
import { PshSwitchComponent } from '../components/switch/switch.component';
import { PshRadioComponent } from '../components/radio/radio.component';
import { PshInputComponent } from '../components/input/input.component';
import { PshBadgeComponent } from '../components/badge/badge.component';

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
  template: `<psh-checkbox [label]="label" [error]="error" [disabled]="disabled"></psh-checkbox>`,
  imports: [PshCheckboxComponent],
})
class CheckboxHost {
  label = 'Accept the terms';
  error: string | null = null;
  disabled = false;
}

@Component({
  template: `<psh-switch [label]="label" [error]="error"></psh-switch>`,
  imports: [PshSwitchComponent],
})
class SwitchHost {
  label = 'Enable notifications';
  error = '';
}

@Component({
  template: `<psh-radio [label]="label" name="group" [value]="1"></psh-radio>`,
  imports: [PshRadioComponent],
})
class RadioHost {
  label = 'Option one';
}

@Component({
  template: `<psh-input [label]="label" [error]="error"></psh-input>`,
  imports: [PshInputComponent],
})
class InputHost {
  label = 'Full name';
  error: string | null = null;
}

@Component({
  template: `<psh-badge [value]="5" ariaLabel="5 unread messages"></psh-badge>`,
  imports: [PshBadgeComponent],
})
class BadgeHost {}

describe('a11y (jest-axe)', () => {
  it('checkbox has no violations (default)', async () => {
    const f = TestBed.createComponent(CheckboxHost);
    await expectNoViolations(f);
  });

  it('checkbox has no violations (error + disabled)', async () => {
    const f = TestBed.createComponent(CheckboxHost);
    f.componentInstance.error = 'This field is required';
    f.componentInstance.disabled = true;
    await expectNoViolations(f);
  });

  it('switch has no violations (default)', async () => {
    const f = TestBed.createComponent(SwitchHost);
    await expectNoViolations(f);
  });

  it('switch has no violations (error)', async () => {
    const f = TestBed.createComponent(SwitchHost);
    f.componentInstance.error = 'Please toggle this';
    await expectNoViolations(f);
  });

  it('radio has no violations', async () => {
    const f = TestBed.createComponent(RadioHost);
    await expectNoViolations(f);
  });

  it('input has no violations (default)', async () => {
    const f = TestBed.createComponent(InputHost);
    await expectNoViolations(f);
  });

  it('input has no violations (error)', async () => {
    const f = TestBed.createComponent(InputHost);
    f.componentInstance.error = 'Invalid value';
    await expectNoViolations(f);
  });

  it('badge has no violations', async () => {
    const f = TestBed.createComponent(BadgeHost);
    await expectNoViolations(f);
  });
});
