import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  PshStatCardComponent,
} from '@lib/components';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-stat-cards-demo',
  imports: [
    CommonModule,
    TranslateModule,
    PshStatCardComponent,
    DemoPageLayoutComponent,
    CodeSnippetComponent,
  ],
  templateUrl: './stat-cards-demo.component.html',
  styleUrl: './stat-cards-demo.component.css'
})
export class StatCardsDemoComponent {
  title = 'Cartes de Statistiques';
  introText = 'Les cartes de statistiques permettent d\'afficher des métriques clés avec icône, valeur, description et indicateur de tendance. Idéales pour les tableaux de bord et les vues d\'ensemble.';

  isLoading = false;

  basicExampleCode = `<psh-stat-card
  value="8,430€"
  description="Revenu des 30 derniers jours"
  icon="coins"
  tagVariant="success"
  tagLabel="+12.6%"
  [interactive]="true"
  (clicked)="handleClick($event)"
></psh-stat-card>`;

  noTagCode = `<psh-stat-card
  value="1,234"
  description="Total des produits"
  icon="package"
  iconBackground="linear-gradient(135deg, #A78BFA, #7C3AED)"
></psh-stat-card>`;

  customGradientCode = `<psh-stat-card
  value="12.5k"
  description="Abonnés"
  icon="user-plus"
  tagVariant="success"
  tagLabel="+24.6%"
  iconBackground="linear-gradient(135deg, #EC4899, #BE185D)"
></psh-stat-card>`;

  interactiveCode = `<psh-stat-card
  [interactive]="true"
  (clicked)="handleClick($event)"
  ...autres props
></psh-stat-card>`;

  horizontalLayoutCode = `<psh-stat-card
  value="2,847"
  description="Utilisateurs actifs"
  icon="users-three"
  layout="horizontal"
  ...autres props
></psh-stat-card>`;

  verticalLayoutCode = `<psh-stat-card
  value="8,430€"
  description="Revenu des 30 derniers jours"
  icon="coins"
  layout="vertical"
  ...autres props
></psh-stat-card>`;

  rowDirectionCode = `<psh-stat-card
  value="4,321"
  description="Commandes en cours"
  icon="shopping-bag"
  [rowDirection]="true"
  ...autres props
></psh-stat-card>`;

  handleStatClick(event: MouseEvent | KeyboardEvent): void {
    console.log('Stat card clicked:', event);
  }

  handleSimulateLoading(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
