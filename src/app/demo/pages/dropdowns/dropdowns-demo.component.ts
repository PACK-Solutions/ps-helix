import { Component } from '@angular/core';
import { PshDropdownComponent } from '@lib/components/dropdown/dropdown.component';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-dropdowns-demo',
  imports: [PshDropdownComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './dropdowns-demo.component.html',
  styleUrls: ['./dropdowns-demo.component.css'],
})
export class DropdownsDemoComponent {
  basicItems = [
    {
      content: 'Option 1',
      value: '1',
    },
    {
      content: 'Option 2',
      value: '2',
    },
    {
      content: 'Option 3',
      value: '3',
    },
  ];

  iconItems = [
    {
      content: 'Modifier',
      value: 'edit',
      icon: 'pencil-simple',
    },
    {
      content: 'Dupliquer',
      value: 'duplicate',
      icon: 'copy',
    },
    {
      content: 'Archiver',
      value: 'archive',
      icon: 'archive',
    },
    {
      content: 'Supprimer',
      value: 'delete',
      icon: 'trash',
      disabled: true,
    },
  ];

  statusItems = [
    {
      content: 'En cours',
      value: 'in-progress',
      disabled: true,
    },
    {
      content: 'En attente',
      value: 'pending',
    },
    {
      content: 'Terminé',
      value: 'completed',
    },
    {
      content: 'Annulé',
      value: 'cancelled',
    },
  ];

  selectItem(value: string): void {
    console.log('Selected:', value);
  }

  handleSelect(value: any): void {
    console.log('Selected:', value);
  }

  filledAppearanceCode = `<psh-dropdown appearance="filled" variant="primary">
  <span dropdown-trigger>Menu</span>
  <div dropdown-menu>
    <button class="dropdown-item">
      Option 1
    </button>
  </div>
</psh-dropdown>`;

  outlineAppearanceCode = `<psh-dropdown appearance="outline" variant="primary">
  <span dropdown-trigger>Menu</span>
  <div dropdown-menu>
    <button class="dropdown-item">
      Option 1
    </button>
  </div>
</psh-dropdown>`;

  textAppearanceCode = `<psh-dropdown appearance="text" variant="primary">
  <span dropdown-trigger>Menu</span>
  <div dropdown-menu>
    <button class="dropdown-item">
      Option 1
    </button>
  </div>
</psh-dropdown>`;

  semanticVariantCode = `<!-- Combinez librement apparence et variante semantique -->
<psh-dropdown appearance="outline" variant="danger">
  <span dropdown-trigger>Supprimer</span>
  <div dropdown-menu>
    <button class="dropdown-item">
      Confirmer la suppression
    </button>
  </div>
</psh-dropdown>`;

  iconTriggerCode = `<psh-dropdown icon="dots-three">
  <span dropdown-trigger>Actions</span>
  <div dropdown-menu>
    <button class="dropdown-item">
      Option
    </button>
  </div>
</psh-dropdown>`;

  iconPositionCode = `<!-- Icône à gauche + label (comportement par défaut) -->
<psh-dropdown icon="user" label="Compte">
  <div dropdown-menu>...</div>
</psh-dropdown>

<!-- Mode icon-only : ariaLabel obligatoire -->
<psh-dropdown
  icon="dots-three-vertical"
  iconPosition="only"
  ariaLabel="Ouvrir le menu d'actions"
>
  <div dropdown-menu>...</div>
</psh-dropdown>`;

  iconItemsCode = `<button class="dropdown-item">
  <i class="ph ph-pencil-simple"></i>
  Modifier
</button>
<button class="dropdown-item">
  <i class="ph ph-trash"></i>
  Supprimer
</button>`;

  statesCode = `<psh-dropdown
  appearance="filled"
  variant="primary"
  [disabled]="isFormInvalid"
  (selected)="handleSelect($event)"
>
  <span dropdown-trigger>Actions</span>
  <div dropdown-menu>
    <button
      class="dropdown-item"
      [class.disabled]="!canEdit"
    >
      Modifier
    </button>
  </div>
</psh-dropdown>`;

  handleOpened(): void {
    console.log('Dropdown opened');
  }
}
