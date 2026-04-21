import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  PshCardComponent,
  PshButtonComponent,
  PshTagComponent,
} from '@lib/components';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-cards-demo',
  imports: [
    CommonModule,
    TranslateModule,
    PshCardComponent,
    PshButtonComponent,
    PshTagComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './cards-demo.component.html',
  styleUrls: ['./cards-demo.component.css']
})
export class CardsDemoComponent {
  title = 'Cartes';
  introText = 'Les cartes permettent d\'organiser et d\'afficher du contenu de manière structurée et élégante. Découvrez la nouvelle API métier avec titre, description, spacing cohérent et variantes enrichies.';

  isLoading = false;

  elevatedVariantCode = `<psh-card
  title="Mon titre"
  description="Description"
  variant="elevated"
>
  Contenu de la carte
</psh-card>`;

  outlinedVariantCode = `<psh-card
  title="Mon titre"
  description="Description"
  variant="outlined"
>
  Contenu de la carte
</psh-card>`;

  defaultVariantCode = `<psh-card
  title="Mon titre"
  description="Description"
  variant="default"
>
  Contenu de la carte
</psh-card>`;

  infoColorCode = `<psh-card
  title="Information"
  variant="outlined"
  colorVariant="info"
>
  Message informatif
</psh-card>`;

  successColorCode = `<psh-card
  title="Succès"
  variant="outlined"
  colorVariant="success"
>
  Opération réussie
</psh-card>`;

  warningColorCode = `<psh-card
  title="Attention"
  variant="outlined"
  colorVariant="warning"
>
  Action requise
</psh-card>`;

  dangerColorCode = `<psh-card
  title="Erreur"
  variant="outlined"
  colorVariant="danger"
>
  Erreur critique
</psh-card>`;

  headerIconSlotCode = `<psh-card title="Titre">
  <div card-header-icon>
    <i class="ph ph-bell"></i>
  </div>
  Contenu
</psh-card>`;

  headerExtraFooterSlotCode = `<psh-card title="Titre">
  <div card-header-extra>
    <psh-tag>Badge</psh-tag>
  </div>
  Contenu
  <div card-footer>
    Métadonnées
  </div>
</psh-card>`;

  cardActionsSlotCode = `<psh-card title="Titre">
  Contenu
  <div card-actions>
    <psh-button>Action 1</psh-button>
    <psh-button>Action 2</psh-button>
  </div>
</psh-card>`;

  handleCardClick(event: MouseEvent | KeyboardEvent): void {
    console.log('Card clicked:', event);
  }
}