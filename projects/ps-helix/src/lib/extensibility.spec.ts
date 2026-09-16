import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PshAlertComponent } from './components/alert/alert.component';
import { PshAvatarComponent } from './components/avatar/avatar.component';
import { PshFlowStepComponent } from './components/state-flow-indicator/flow-step.component';
import { PshMenuComponent } from './components/menu/menu.component';
import { PshSelectComponent } from './components/select/select.component';
import { PshStateFlowIndicatorComponent } from './components/state-flow-indicator/state-flow-indicator.component';
import { PshTabBarComponent } from './components/tab-bar/tab-bar.component';
import { PshTableComponent } from './components/table/table.component';

/**
 * The audit's B5 test: rebuild the cases that forced `::ng-deep`, using only the library's
 * own extension points.
 *
 * One component out of thirty exposed a public `TemplateRef` before 7.0.0 (`psh-table`, for
 * body cells). Everything else rendered from a closed interface — `MenuItem`, `TabBarItem`,
 * `SelectOption` — so an avatar in a select option, a filter in a table header or an
 * illustrated empty state had exactly one route: reach into the component's DOM.
 *
 * Each case below checks two things: that the custom content renders, and that the ARIA the
 * component owns is still intact. A template that replaces a `role="option"` or loses
 * `aria-selected` has traded one problem for a worse one.
 */

@Component({
  selector: 'psh-extensibility-host',
  imports: [
    PshAlertComponent,
    PshAvatarComponent,
    PshMenuComponent,
    PshSelectComponent,
    PshStateFlowIndicatorComponent,
    PshFlowStepComponent,
    PshTabBarComponent,
    PshTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <!-- A select option with an avatar and a second line. -->
    <psh-select [options]="people" [optionTemplate]="richOption" label="Owner" />
    <ng-template #richOption let-person let-selected="selected">
      <psh-avatar [initials]="person.label" size="small" />
      <span class="test-option-label">{{ person.label }}</span>
      <span class="test-option-role">{{ person.description }}</span>
      @if (selected) {
        <span class="test-option-check">✓</span>
      }
    </ng-template>

    <!-- A table header with a filter, and an illustrated empty state. -->
    <psh-table
      [columns]="columns"
      [data]="rows()"
      [headerTemplate]="filterHeader"
      [emptyTemplate]="illustratedEmpty"
      [rowClass]="rowClass"
    />
    <ng-template #filterHeader let-column let-sort="sort" let-toggleSort="toggleSort">
      <span class="test-header-label">{{ column.label }}</span>
      <button type="button" class="test-header-sort" (click)="toggleSort()">{{ sort ?? '—' }}</button>
      <input class="test-header-filter" [attr.aria-label]="'Filter ' + column.label" />
    </ng-template>
    <ng-template #illustratedEmpty let-message>
      <img class="test-empty-art" src="/empty.svg" alt="" />
      <p class="test-empty-message">{{ message }}</p>
      <button type="button" class="test-empty-cta">Add the first one</button>
    </ng-template>

    <!-- A menu item with a coloured count. -->
    <psh-menu [items]="menuItems" [itemTemplate]="richMenuItem" />
    <ng-template #richMenuItem let-item>
      <span class="test-menu-label">{{ item.content }}</span>
      <span class="test-menu-count">{{ item.badge }}</span>
    </ng-template>

    <!-- A tab with its own markup. -->
    <psh-tab-bar [items]="tabs" [itemTemplate]="richTab" />
    <ng-template #richTab let-tab let-active="active">
      <span class="test-tab-label" [class.test-tab-active]="active">{{ tab.label }}</span>
    </ng-template>

    <!-- An alert with an action, which had nowhere to go. -->
    <psh-alert color="danger" content="Upload failed">
      <button psh-alert-actions type="button" class="test-alert-retry">Retry</button>
    </psh-alert>

    <!-- A flow step whose content used to be discarded without a word. -->
    <psh-state-flow-indicator [activeStep]="0">
      <psh-flow-step title="Details">
        <p class="test-flow-panel">The panel nobody could render.</p>
      </psh-flow-step>
      <psh-flow-step title="Review">
        <p class="test-flow-panel-2">Second panel.</p>
      </psh-flow-step>
    </psh-state-flow-indicator>
  `,
})
class ExtensibilityHostComponent {
  readonly people = [
    { value: 'ada', label: 'Ada', description: 'Maintainer' },
    { value: 'linus', label: 'Linus', description: 'Reviewer' },
  ];
  readonly columns = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'status', label: 'Status' },
  ];
  readonly rows = signal<{ id: number; name: string; status: string }[]>([]);
  readonly rowClass = (row: { status?: unknown }) =>
    row.status === 'overdue' ? 'test-row-overdue' : undefined;
  readonly menuItems = [{ id: 'inbox', content: 'Inbox', badge: '12' }];
  readonly tabs = [
    { id: 'home', label: 'Home', icon: 'house' },
    { id: 'search', label: 'Search', icon: 'magnifying-glass' },
  ];
}

describe('the six cases that used to force ::ng-deep', () => {
  let root: HTMLElement;

  beforeEach(() => {
    const fixture = TestBed.createComponent(ExtensibilityHostComponent);
    document.body.appendChild(fixture.nativeElement);
    fixture.detectChanges();
    root = fixture.nativeElement;
  });

  afterEach(() => {
    root.remove();
    document.querySelectorAll('.psh-overlay-layer').forEach(el => el.remove());
  });

  describe('psh-table — a filterable header', () => {
    it('renders the custom header content', () => {
      expect(root.querySelectorAll('.test-header-filter').length).toBe(2);
      expect(root.querySelector('.test-header-label')?.textContent).toBe('Name');
    });

    it('keeps the header a th with its scope', () => {
      const th = root.querySelector('thead th');
      expect(th?.tagName).toBe('TH');
      expect(th?.getAttribute('scope')).toBe('col');
    });

    it('still owns aria-sort, so a custom header cannot drop it', () => {
      const sortable = root.querySelector('thead th.psh-sortable');
      expect(sortable?.getAttribute('aria-sort')).toBe('none');
    });
  });

  describe('psh-table — an illustrated empty state', () => {
    it('renders the illustration and the call to action', () => {
      expect(root.querySelector('.test-empty-art')).toBeTruthy();
      expect(root.querySelector('.test-empty-cta')?.textContent).toBe('Add the first one');
    });

    it('hands the resolved message to the template', () => {
      expect(root.querySelector('.test-empty-message')?.textContent).toBe('No data available');
    });
  });

  describe('psh-menu — an item with a count', () => {
    it('renders the custom item content', () => {
      expect(root.querySelector('.test-menu-count')?.textContent).toBe('12');
    });

    it('keeps role="menuitem" on the element around it', () => {
      expect(root.querySelector('[role="menuitem"] .test-menu-label')).toBeTruthy();
    });
  });

  describe('psh-tab-bar — a tab with its own markup', () => {
    it('renders the custom tab content', () => {
      expect(root.querySelectorAll('.test-tab-label').length).toBe(2);
    });

    it('keeps role="tab", aria-selected and the roving tabindex', () => {
      // Scoped to the tab-bar: the state-flow-indicator in the same fixture is a tablist too.
      const tabs = Array.from(root.querySelectorAll('psh-tab-bar [role="tab"]'));
      expect(tabs.length).toBe(2);
      expect(tabs[0]?.getAttribute('aria-selected')).toBe('true');
      expect(tabs.filter(t => t.getAttribute('tabindex') === '0').length).toBe(1);
    });

    it('passes the active flag through the context', () => {
      expect(root.querySelector('.test-tab-active')?.textContent).toBe('Home');
    });
  });

  describe('psh-alert — an action beside the message', () => {
    it('renders the projected action', () => {
      expect(root.querySelector('.test-alert-retry')?.textContent).toBe('Retry');
    });

    it('leaves the message slot alone', () => {
      expect(root.querySelector('.psh-alert-message')?.textContent?.trim()).toBe('Upload failed');
    });
  });

  describe('psh-flow-step — the panel that was discarded', () => {
    it('renders the projected content', () => {
      expect(root.querySelector('.test-flow-panel')?.textContent).toBe(
        'The panel nobody could render.',
      );
    });

    it('shows the active step and hides the others', () => {
      const panels = Array.from(root.querySelectorAll('psh-flow-step')) as HTMLElement[];
      expect(panels.length).toBe(2);
      expect(panels[0]?.style.display).toBe('block');
      expect(panels[1]?.style.display).toBe('none');
    });

    it('labels each panel by its tab, like psh-step', () => {
      const panel = root.querySelector('psh-flow-step');
      expect(panel?.getAttribute('role')).toBe('tabpanel');
      const labelledBy = panel?.getAttribute('aria-labelledby');
      expect(labelledBy).toBeTruthy();
      const tab = document.getElementById(labelledBy!);
      expect(tab?.getAttribute('role')).toBe('tab');
    });
  });
});

/**
 * The avatar's initials fallback existed but could not run: the `<img>` had no `(error)`
 * handler, so a 404 left the browser's broken-image icon where a name should be.
 */
@Component({
  selector: 'psh-avatar-host',
  imports: [PshAvatarComponent],
  changeDetection: ChangeDetectionStrategy.Eager,
  template: `
    <psh-avatar [src]="src()" initials="AD" [interactive]="true" (clicked)="clicks = clicks + 1" />
  `,
})
class AvatarHostComponent {
  readonly src = signal<string | undefined>('/missing.png');
  clicks = 0;
}

describe('psh-avatar', () => {
  it('falls back to the initials when the image fails', () => {
    const fixture = TestBed.createComponent(AvatarHostComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    expect(root.querySelector('img')).toBeTruthy();
    expect(root.querySelector('.psh-avatar-initials')).toBeNull();

    root.querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(root.querySelector('img')).toBeNull();
    expect(root.querySelector('.psh-avatar-initials')?.textContent).toBe('AD');
  });

  it('retries when the src changes, rather than staying failed forever', () => {
    const fixture = TestBed.createComponent(AvatarHostComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    root.querySelector('img')!.dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(root.querySelector('img')).toBeNull();

    fixture.componentInstance.src.set('/other.png');
    fixture.detectChanges();

    expect(root.querySelector('img')).toBeTruthy();
  });

  it('emits clicked when interactive, and is reachable by keyboard', () => {
    const fixture = TestBed.createComponent(AvatarHostComponent);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;

    const avatar = root.querySelector('.psh-avatar') as HTMLElement;
    expect(avatar.getAttribute('role')).toBe('button');
    expect(avatar.getAttribute('tabindex')).toBe('0');

    avatar.click();
    avatar.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.clicks).toBe(2);
  });
});
