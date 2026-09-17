import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PshDropdownComponent } from '../components/dropdown/dropdown.component';
import { PshStateFlowIndicatorComponent } from '../components/state-flow-indicator/state-flow-indicator.component';
import { PshFlowStepComponent } from '../components/state-flow-indicator/flow-step.component';
import { PshStepperComponent } from '../components/stepper/stepper.component';
import { PshStepComponent } from '../components/stepper/step.component';
import { PshTabBarComponent } from '../components/tab-bar/tab-bar.component';
import { PshTabsComponent } from '../components/tabs/tabs.component';
import { PshTabComponent } from '../components/tabs/tab.component';

/**
 * A composite widget is **one** tab stop.
 *
 * `tablist`, `menu` and `menubar` all say the same thing: Tab moves to the widget and then out
 * of it again, and the arrow keys move within. Implemented with `tabindex`, that means exactly
 * one item carries `0` and every other carries `-1` — the roving tabindex.
 *
 * Four of these widgets shipped `tabindex="0"` on every item, so a six-step stepper cost six
 * presses of Tab to walk past, and the arrow keys that were already implemented did nothing
 * for that. `psh-tabs` and `psh-tab-bar` had it right; the point of this suite is that the
 * rule now holds for all of them and keeps holding.
 *
 * **`psh-menu` is deliberately absent.** It declares `role="menubar"` with `role="menuitem"`
 * links, which would put it here — but it is a sidebar navigation, and taking Tab away from
 * the links of a sidebar to satisfy a role it should probably not be claiming would be a
 * regression dressed as a fix. The roles are the thing to settle there, not the tabindex.
 */

/** The items of the widget rooted at `root`, in document order. */
function items(root: ParentNode, role: string): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(`[role="${role}"]`));
}

function tabStops(elements: HTMLElement[]): HTMLElement[] {
  return elements.filter(el => el.getAttribute('tabindex') === '0');
}

/** Exactly one stop, and it is the element at `expectedIndex`. */
function expectSingleStopAt(elements: HTMLElement[], expectedIndex: number): void {
  expect(elements.length).toBeGreaterThan(1);
  const stops = tabStops(elements);
  expect(stops.length).toBe(1);
  expect(stops[0]).toBe(elements[expectedIndex]);
  for (const [index, el] of elements.entries()) {
    if (index !== expectedIndex) expect(el.getAttribute('tabindex')).toBe('-1');
  }
}

@Component({
  selector: 'psh-roving-host',
  imports: [
    PshStepperComponent,
    PshStepComponent,
    PshStateFlowIndicatorComponent,
    PshFlowStepComponent,
    PshTabsComponent,
    PshTabComponent,
    PshTabBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <psh-stepper [(activeStep)]="step">
      <psh-step title="One" />
      <psh-step title="Two" />
      <psh-step title="Three" />
    </psh-stepper>

    <psh-state-flow-indicator [(activeStep)]="flow">
      <psh-flow-step title="One" />
      <psh-flow-step title="Two" />
      <psh-flow-step title="Three" />
    </psh-state-flow-indicator>

    <psh-tabs [(activeIndex)]="tab">
      <psh-tab header="One" />
      <psh-tab header="Two" />
      <psh-tab header="Three" />
    </psh-tabs>

    <psh-tab-bar [items]="barItems" [(activeIndex)]="bar" />
  `,
})
class RovingHostComponent {
  step = 0;
  flow = 0;
  tab = 0;
  bar = 0;
  barItems = [
    { id: 'a', label: 'One' },
    { id: 'b', label: 'Two' },
    { id: 'c', label: 'Three' },
  ];
}

describe('a composite widget is one tab stop', () => {
  let fixture: ComponentFixture<RovingHostComponent>;
  let root: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(RovingHostComponent);
    root = fixture.nativeElement;
    document.body.appendChild(root);
    fixture.detectChanges();
  });

  afterEach(() => root.remove());

  function widget(selector: string): HTMLElement {
    const el = root.querySelector<HTMLElement>(selector);
    expect(el).toBeTruthy();
    return el!;
  }

  it('psh-stepper puts the only stop on the active step', () => {
    expectSingleStopAt(items(widget('psh-stepper'), 'tab'), 0);

    fixture.componentInstance.step = 2;
    fixture.detectChanges();
    expectSingleStopAt(items(widget('psh-stepper'), 'tab'), 2);
  });

  it('psh-state-flow-indicator puts the only stop on the active step', () => {
    expectSingleStopAt(items(widget('psh-state-flow-indicator'), 'tab'), 0);

    fixture.componentInstance.flow = 1;
    fixture.detectChanges();
    expectSingleStopAt(items(widget('psh-state-flow-indicator'), 'tab'), 1);
  });

  it('psh-tabs puts the only stop on the selected tab', () => {
    expectSingleStopAt(items(widget('psh-tabs'), 'tab'), 0);

    fixture.componentInstance.tab = 2;
    fixture.detectChanges();
    expectSingleStopAt(items(widget('psh-tabs'), 'tab'), 2);
  });

  it('psh-tab-bar puts the only stop on the selected tab', () => {
    expectSingleStopAt(items(widget('psh-tab-bar'), 'tab'), 0);

    fixture.componentInstance.bar = 1;
    fixture.detectChanges();
    expectSingleStopAt(items(widget('psh-tab-bar'), 'tab'), 1);
  });
});

@Component({
  selector: 'psh-roving-dropdown-host',
  imports: [PshDropdownComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `<psh-dropdown [items]="items" label="Menu" />`,
})
class RovingDropdownHostComponent {
  items = [
    { value: '1', content: 'One' },
    { value: '2', content: 'Two' },
    { value: '3', content: 'Three' },
  ];
}

describe('psh-dropdown is one tab stop while open', () => {
  let fixture: ComponentFixture<RovingDropdownHostComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RovingDropdownHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
  });

  afterEach(() => fixture.nativeElement.remove());

  it('leaves one stop on the focused item, not one per item', () => {
    const trigger = fixture.nativeElement.querySelector('button') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    // The panel is teleported to the body, so it is not under the fixture's own element.
    const menuItems = items(document, 'menuitem');
    expectSingleStopAt(menuItems, 0);
  });
});
