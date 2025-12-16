import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';

@Component({
  selector: 'ds-design-principles-demo',
  imports: [TranslateModule, DemoPageLayoutComponent],
  templateUrl: './design-principles-demo.component.html',
  styleUrls: ['./design-principles-demo.component.css']
})
export class DesignPrinciplesDemoComponent {
  principles = [
    {
      title: 'Cohérence',
      description: 'Maintenir une expérience cohérente à travers toutes les interfaces pour renforcer la confiance et la familiarité.',
      icon: 'squares-four',
      examples: [
        'Utilisation cohérente des composants',
        'Patterns d\'interaction uniformes',
        'Langage visuel harmonieux'
      ]
    },
    {
      title: 'Simplicité',
      description: 'Créer des interfaces claires et intuitives qui permettent aux utilisateurs d\'accomplir leurs tâches efficacement.',
      icon: 'sparkle',
      examples: [
        'Navigation intuitive',
        'Hiérarchie visuelle claire',
        'Réduction de la charge cognitive'
      ]
    },
    {
      title: 'Accessibilité',
      description: 'Concevoir des interfaces inclusives qui fonctionnent pour tous les utilisateurs, quelles que soient leurs capacités.',
      icon: 'wheelchair',
      examples: [
        'Support des technologies d\'assistance',
        'Contraste et lisibilité optimisés',
        'Navigation au clavier'
      ]
    },
    {
      title: 'Performance',
      description: 'Optimiser chaque interaction pour offrir une expérience rapide et fluide.',
      icon: 'lightning',
      examples: [
        'Temps de chargement minimisés',
        'Animations fluides',
        'Feedback instantané'
      ]
    },
    {
      title: 'Flexibilité',
      description: 'Créer des composants adaptables qui fonctionnent dans différents contextes et configurations.',
      icon: 'arrows-out',
      examples: [
        'Design responsive',
        'Composants modulaires',
        'Thèmes personnalisables'
      ]
    },
    {
      title: 'Feedback',
      description: 'Fournir un retour clair et immédiat pour chaque action de l\'utilisateur.',
      icon: 'chat-circle',
      examples: [
        'Messages d\'état clairs',
        'Animations de transition',
        'Indicateurs de progression'
      ]
    }
  ];
}