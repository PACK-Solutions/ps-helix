import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  PshButtonComponent,
  PshInputComponent,
  PshModalComponent,
  PshSelectComponent,
} from '@lib/components';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-modals-demo',
  imports: [
    TranslateModule,
    PshButtonComponent,
    PshInputComponent,
    PshModalComponent,
    PshSelectComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './modals-demo.component.html',
  styleUrls: ['./modals-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalsDemoComponent {
  basicModalOpen = false;
  customModalOpen = false;
  largeModalOpen = false;
  smallModalOpen = false;
  mediumModalOpen = false;
  noFooterModalOpen = false;
  noBackdropModalOpen = false;
  confirmationModalOpen = false;
  customTitleModalOpen = false;
  formModalOpen = false;
  scrollModalOpen = false;

  /**
   * A select inside a modal is the case jsdom cannot answer: the panel is teleported to the
   * body, so whether it lands above the modal, and whether it still follows a scrolling
   * ancestor, only shows in a real browser.
   */
  readonly assignees = [
    { value: 'al', label: 'Ada Lovelace', description: 'Analyste' },
    { value: 'gh', label: 'Grace Hopper', description: 'Compilation' },
    { value: 'at', label: 'Alan Turing', description: 'Cryptanalyse' },
    { value: 'kj', label: 'Katherine Johnson', description: 'Trajectoires' },
  ];
  readonly priorities = [
    { value: 'low', label: 'Basse' },
    { value: 'normal', label: 'Normale' },
    { value: 'high', label: 'Haute' },
  ];
  assignee: string | null = null;
  priority: string | null = 'normal';

  readonly longContent = Array.from(
    { length: 8 },
    (_, index) =>
      `Paragraphe ${index + 1} — le corps de la modale dépasse sa hauteur maximale, donc il ` +
      `défile. Le select en bas reste utilisable, et son panneau suit le défilement.`,
  );

  readonly selectInModalCode = `<psh-modal [(open)]="open" title="Affecter le dossier">
  <psh-select label="Assigné à" [options]="assignees" [(value)]="assignee" [searchable]="true" />
</psh-modal>`;

  handleConfirm(): void {
    this.basicModalOpen = false;
  }

  handleCustomConfirm(): void {
    this.customModalOpen = false;
  }

  basicModalCode = `<psh-modal
  [(open)]="isOpen"
  title="Titre"
  (confirmed)="handleConfirm()"
>
  Contenu de la modale
</psh-modal>`;

  confirmationModalCode = `<psh-modal
  [(open)]="confirmOpen"
  title="Confirmer"
  size="small"
  (confirmed)="confirm()"
>
  Message de confirmation
</psh-modal>`;

  customFooterCode = `<psh-modal #modal [(open)]="isOpen">
  Contenu
  <div psh-modal-footer #modalFooter>
    <psh-button [fullWidth]="modal.isMobileScreen()">Annuler</psh-button>
    <psh-button [fullWidth]="modal.isMobileScreen()">Confirmer</psh-button>
  </div>
</psh-modal>`;

  noFooterCode = `<psh-modal
  [(open)]="isOpen"
  title="Information"
  [showFooter]="false"
>
  Information simple
</psh-modal>`;

  customTitleCode = `<psh-modal [(open)]="isOpen">
  <span psh-modal-title>
    <i class="ph ph-warning"></i>
    Titre avec icone
  </span>
  <p>Contenu de la modale</p>
</psh-modal>`;

  closeOptionsCode = `<psh-modal
  [closeOnBackdrop]="false"
  [closeOnEscape]="false"
>
  Contenu
</psh-modal>`;

  showCloseCode = `<psh-modal
  [showClose]="false"
>
  Contenu
</psh-modal>`;

  preventScrollCode = `<psh-modal
  [preventScroll]="true"
>
  Contenu
</psh-modal>`;

  handleConfirmAction(): void {
    this.confirmationModalOpen = false;
  }
}
