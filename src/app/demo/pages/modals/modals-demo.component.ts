import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PshButtonComponent, PshModalComponent } from '@lib/components';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-modals-demo',
  imports: [TranslateModule, PshButtonComponent, PshModalComponent, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './modals-demo.component.html',
  styleUrls: ['./modals-demo.component.css'],
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
  <div modal-footer #modalFooter>
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
  <span modal-title>
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
