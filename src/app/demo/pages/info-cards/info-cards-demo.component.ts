import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  PshInfoCardComponent,
  PshButtonComponent,
  PshBadgeComponent,
} from '@lib/components';
import { InfoCardData } from '@lib/components/info-card/info-card.types';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-info-cards-demo',
  imports: [
    CommonModule,
    TranslateModule,
    PshInfoCardComponent,
    PshButtonComponent,
    PshBadgeComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './info-cards-demo.component.html',
  styleUrl: './info-cards-demo.component.css'
})
export class InfoCardsDemoComponent {
  title = 'Cartes d\'Information';
  introText = 'Les cartes d\'information permettent d\'afficher des données structurées sous forme de paires label-valeur. Idéales pour les profils utilisateurs, les détails de commande ou les informations système.';

  isLoading = false;

  userProfileData: InfoCardData[] = [
    { label: 'Nom complet', value: 'Marie Dubois' },
    { label: 'Email', value: 'marie.dubois@example.com' },
    { label: 'Téléphone', value: '+33 6 12 34 56 78' },
    { label: 'Date de naissance', value: '15 Mars 1992' },
    { label: 'Ville', value: 'Paris, France' },
    { label: 'Profession', value: 'Développeuse Full-Stack' }
  ];

  orderDetailsData: InfoCardData[] = [
    { label: 'Numéro de commande', value: '#CMD-2025-0042' },
    { label: 'Date de commande', value: '30 Octobre 2025' },
    { label: 'Statut', value: 'En cours de livraison' },
    { label: 'Montant total', value: '149,99 €' },
    { label: 'Mode de paiement', value: 'Carte Bancaire' },
    { label: 'Livraison estimée', value: '2 Novembre 2025' }
  ];

  systemInfoData: InfoCardData[] = [
    { label: 'Version', value: 'v2.1.1' },
    { label: 'Environnement', value: 'Production' },
    { label: 'Dernière mise à jour', value: '28 Octobre 2025' },
    { label: 'Uptime', value: '99.98%' },
    { label: 'Serveur', value: 'AWS eu-west-1' }
  ];

  compactData: InfoCardData[] = [
    { label: 'ID', value: '12345' },
    { label: 'Type', value: 'Premium' },
    { label: 'Statut', value: 'Actif' }
  ];

  customWidthData: InfoCardData[] = [
    { label: 'Libellé court', value: 'Valeur très très longue qui pourrait déborder', labelWidth: '30%', valueWidth: '70%' },
    { label: 'Autre libellé', value: 'Courte', labelWidth: '30%', valueWidth: '70%' }
  ];

  emptyData: InfoCardData[] = [];

  elevatedVariantCode = `<psh-info-card
  title="Profil Utilisateur"
  [data]="userData"
  variant="elevated"
  icon="user-circle"
></psh-info-card>`;

  outlinedVariantCode = `<psh-info-card
  title="Détails de Commande"
  [data]="orderData"
  variant="outlined"
  icon="shopping-cart"
></psh-info-card>`;

  defaultVariantCode = `<psh-info-card
  title="Informations Système"
  [data]="systemData"
  variant="default"
  icon="gear"
></psh-info-card>`;

  statesCode = `<psh-info-card
  title="État Dynamique"
  [data]="data"
  variant="outlined"
  [loading]="isLoading"
  [interactive]="true"
  [hoverable]="true"
  [disabled]="isDisabled"
  (clicked)="handleClick($event)"
></psh-info-card>`;

  headerActionsCode = `<psh-info-card
  title="Profil Utilisateur"
  [data]="userData"
  variant="elevated"
  icon="user-circle"
>
  <div card-header-actions>
    <psh-button appearance="text" size="small">
      <i class="ph ph-pencil"></i>
    </psh-button>
  </div>
</psh-info-card>`;

  headerActionsWithBadgeCode = `<psh-info-card
  title="Détails du Projet"
  [data]="projectData"
  variant="outlined"
  icon="folder"
>
  <div card-header-actions>
    <psh-badge variant="success">Actif</psh-badge>
  </div>
</psh-info-card>`;

  bothSlotsCode = `<psh-info-card
  title="Commande"
  [data]="orderData"
  variant="elevated"
  icon="package"
>
  <div card-header-actions>
    <psh-badge variant="warning">En cours</psh-badge>
  </div>
  <div card-actions>
    <psh-button variant="primary">Suivre</psh-button>
  </div>
</psh-info-card>`;

  handleSimulateLoading(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  handleCardClick(event: MouseEvent | KeyboardEvent): void {
    alert('Carte cliquée !');
  }
}
