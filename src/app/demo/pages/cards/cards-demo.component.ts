import { Component, ChangeDetectionStrategy } from '@angular/core';
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
    TranslateModule,
    PshCardComponent,
    PshButtonComponent,
    PshTagComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './cards-demo.component.html',
  styleUrls: ['./cards-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardsDemoComponent {
  title = 'Cartes';
  introText = 'Les cartes permettent d\'organiser et d\'afficher du contenu de manière structurée et élégante. Découvrez la nouvelle API métier avec titre, description, spacing cohérent et variantes enrichies.';

  isLoading = false;

  elevatedVariantCode = `<psh-card
  title="Mon titre"
  description="Description"
  appearance="elevated"
>
  Contenu de la carte
</psh-card>`;

  outlinedVariantCode = `<psh-card
  title="Mon titre"
  description="Description"
  appearance="outline"
>
  Contenu de la carte
</psh-card>`;

  defaultVariantCode = `<psh-card
  title="Mon titre"
  description="Description"
  appearance="flat"
>
  Contenu de la carte
</psh-card>`;

  infoColorCode = `<psh-card
  title="Information"
  appearance="outline"
  color="info"
>
  Message informatif
</psh-card>`;

  successColorCode = `<psh-card
  title="Succès"
  appearance="outline"
  color="success"
>
  Opération réussie
</psh-card>`;

  warningColorCode = `<psh-card
  title="Attention"
  appearance="outline"
  color="warning"
>
  Action requise
</psh-card>`;

  dangerColorCode = `<psh-card
  title="Erreur"
  appearance="outline"
  color="danger"
>
  Erreur critique
</psh-card>`;

  headerIconSlotCode = `<psh-card title="Titre">
  <div psh-card-header-icon>
    <i class="ph ph-bell"></i>
  </div>
  Contenu
</psh-card>`;

  headerExtraFooterSlotCode = `<psh-card title="Titre">
  <div psh-card-header-actions>
    <psh-tag>Badge</psh-tag>
  </div>
  Contenu
  <div psh-card-footer>
    Métadonnées
  </div>
</psh-card>`;

  cardActionsSlotCode = `<psh-card title="Titre">
  Contenu
  <div psh-card-actions>
    <psh-button>Action 1</psh-button>
    <psh-button>Action 2</psh-button>
  </div>
</psh-card>`;

  // Header entièrement personnalisé, SANS [title] : le header se rend dès qu'un
  // slot de header est projeté. Le style du titre est défini dans la portée CSS
  // du composant consommateur (pas de ::ng-deep).
  customHeaderSlotCode = `<psh-card appearance="outline" density="compact">
  <!-- Titre + icône composés par le consommateur -->
  <div psh-card-header-content class="premium-header">
    <i class="ph ph-currency-eur" aria-hidden="true"></i>
    <h3>Versement initial</h3>
  </div>

  <!-- Valeur alignée à droite -->
  <span psh-card-header-actions>
    <psh-tag color="success">1 500 €</psh-tag>
  </span>

  Le style du titre est défini dans la portée du composant consommateur.
</psh-card>`;

  handleCardClick(event: MouseEvent | KeyboardEvent): void {
    console.log('Card clicked:', event);
  }
}