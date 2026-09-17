import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import {
  PshAlertComponent,
  PshAvatarComponent,
  PshBadgeComponent,
  PshButtonComponent,
  PshSelectComponent,
  PshTableComponent,
} from '@lib/components';
import type { TableColumn, TableRow } from '@lib/components/table/table.types';

/**
 * The seven extension points added in 7.0.0 had **no mention** in the demo — and they are the
 * feature that removes a whole class of `::ng-deep` overrides. A consumer could not discover
 * them.
 */
@Component({
  selector: 'ds-templates-demo',
  imports: [
    TranslateModule,
    DemoPageLayoutComponent,
    PshAlertComponent,
    PshAvatarComponent,
    PshBadgeComponent,
    PshButtonComponent,
    PshSelectComponent,
    PshTableComponent,
  ],
  templateUrl: './templates-demo.component.html',
  styleUrls: ['./templates-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplatesDemoComponent {
  readonly assignee = signal<string | null>(null);
  readonly retried = signal(false);

  readonly people = [
    { value: 'ada', label: 'Ada Lovelace', description: 'Analyste' },
    { value: 'grace', label: 'Grace Hopper', description: 'Compilation' },
    { value: 'alan', label: 'Alan Turing', description: 'Cryptanalyse' },
  ];

  readonly columns: TableColumn[] = [
    { key: 'name', label: 'Nom', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
  ];

  readonly rows: TableRow[] = [
    { id: 1, name: 'Ada Lovelace', status: 'actif' },
    { id: 2, name: 'Grace Hopper', status: 'suspendu' },
    { id: 3, name: 'Alan Turing', status: 'actif' },
  ];

  /** Highlights a row from its data — no `::ng-deep` on `tr:nth-child()`. */
  readonly rowClass = (row: TableRow): string =>
    row['status'] === 'suspendu' ? 'row-suspended' : '';

  readonly selectSnippet = `<psh-select [options]="people" [optionTemplate]="personOption" />

<ng-template #personOption let-option let-selected="selected">
  <psh-avatar size="small" [initials]="initials(option.label)" />
  {{ option.label }}
  @if (selected) { <psh-badge color="success" content="assigné" /> }
</ng-template>`;

  readonly tableSnippet = `<psh-table
  [columns]="columns" [data]="rows"
  [rowClass]="rowClass"
  [headerTemplate]="header"
  [emptyTemplate]="empty" />

<ng-template #header let-column let-sort="sort" let-toggleSort="toggleSort">
  {{ column.label }}   <!-- toggleSort() si vous voulez un déclencheur à vous -->
</ng-template>

// et la classe d'une ligne vient de sa donnée :
rowClass = (row: TableRow) => row['status'] === 'suspendu' ? 'row-suspended' : '';`;

  readonly alertSnippet = `<psh-alert color="danger" content="La synchronisation a échoué.">
  <psh-button psh-alert-actions size="small" appearance="outline">
    Réessayer
  </psh-button>
</psh-alert>`;

  readonly menuSnippet = `<psh-menu [items]="items" [itemTemplate]="menuItem" />

<ng-template #menuItem let-item let-withLabel="withLabel">
  <i class="ph ph-{{ item.icon }}"></i>
  @if (withLabel) { {{ item.content }} }
  @if (item.badge) { <psh-badge color="danger" [content]="item.badge" /> }
</ng-template>`;

  initials(label: string): string {
    return label
      .split(' ')
      .map(part => part[0])
      .join('')
      .slice(0, 2);
  }
}
