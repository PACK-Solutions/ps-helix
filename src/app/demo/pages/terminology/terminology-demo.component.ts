import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { PshButtonComponent } from '@lib/components';

@Component({
  selector: 'ds-terminology-demo',
  imports: [TranslateModule, DemoPageLayoutComponent, PshButtonComponent],
  templateUrl: './terminology-demo.component.html',
  styleUrls: ['./terminology-demo.component.css']
})
export class TerminologyDemoComponent {
  // Données pour les concepts du langage ubiquitaire
  ubiquitousLanguageConcepts = [
    {
      title: 'Vocabulaire Partagé',
      description: 'Un ensemble de termes communs utilisés par toute l\'équipe, des experts métier aux développeurs.',
      icon: 'users-three',
      benefits: [
        'Élimine les malentendus',
        'Facilite la communication',
        'Aligne les équipes sur les concepts'
      ]
    },
    {
      title: 'Cohérence Métier-Code',
      description: 'Le code reflète fidèlement les processus et règles métier grâce à un vocabulaire aligné.',
      icon: 'code',
      benefits: [
        'Code plus lisible et maintenable',
        'Réduction des bugs métier',
        'Facilite les évolutions'
      ]
    },
    {
      title: 'Évolution Continue',
      description: 'Le langage évolue avec la compréhension métier et s\'enrichit au fil des découvertes.',
      icon: 'arrow-clockwise',
      benefits: [
        'Adaptation aux changements métier',
        'Amélioration continue',
        'Capitalisation des apprentissages'
      ]
    }
  ];

  // Données pour les concepts DDD
  dddConcepts = [
    {
      title: 'Contextes Délimités',
      description: 'Chaque contexte métier a son propre langage ubiquitaire, évitant les conflits de terminologie.',
      icon: 'cube',
      examples: [
        'Contexte "Souscription" : Prospect, Police, Prime',
        'Contexte "Sinistres" : Déclaration, Expertise, Règlement',
        'Contexte "Clients" : Assuré, Bénéficiaire, Contact'
      ]
    },
    {
      title: 'Modélisation du Domaine',
      description: 'Le code utilise directement le vocabulaire métier pour nommer classes, méthodes et propriétés.',
      icon: 'hierarchy',
      examples: [
        'Classe "Police" au lieu de "Contract"',
        'Méthode "calculerPrime()" au lieu de "calculate()"',
        'Propriété "dateEffet" au lieu de "startDate"'
      ]
    }
  ];

  // Données pour les éléments du glossaire
  glossaryElements = [
    {
      name: 'Terme',
      description: 'Le mot ou expression métier précis et non ambigu',
      example: 'Police d\'assurance',
      importance: 'critical',
      icon: 'textbox'
    },
    {
      name: 'Définition',
      description: 'Description claire et détaillée du concept métier',
      example: 'Contrat d\'assurance liant l\'assureur et l\'assuré',
      importance: 'critical',
      icon: 'book-open'
    },
    {
      name: 'Contexte',
      description: 'Domaine d\'application où le terme est utilisé',
      example: 'Souscription, Gestion de contrats',
      importance: 'high',
      icon: 'map-pin'
    },
    {
      name: 'Synonymes',
      description: 'Termes équivalents ou variations acceptées',
      example: 'Contrat, Police, Convention',
      importance: 'medium',
      icon: 'arrows-clockwise'
    },
    {
      name: 'Exemples d\'Usage',
      description: 'Illustrations concrètes d\'utilisation du terme',
      example: 'Création d\'une police auto, Résiliation d\'une police',
      importance: 'high',
      icon: 'lightbulb'
    },
    {
      name: 'Relations',
      description: 'Liens avec d\'autres termes du glossaire',
      example: 'Police → Assuré, Prime, Risque',
      importance: 'medium',
      icon: 'graph'
    }
  ];

  // Données pour les bonnes pratiques
  bestPractices = [
    {
      category: 'Création et Maintenance',
      description: 'Comment créer et maintenir un glossaire vivant et à jour',
      icon: 'wrench',
      practices: [
        'Révisions régulières avec les experts métier',
        'Validation croisée entre contextes',
        'Versioning des définitions',
        'Historique des changements documenté',
        'Sessions de refinement du langage',
        'Integration dans les rituels agiles'
      ]
    },
    {
      category: 'Usage Quotidien',
      description: 'Comment intégrer efficacement le langage ubiquitaire dans le travail quotidien',
      icon: 'calendar',
      practices: [
        'Utilisation systématique dans le code',
        'Nommage cohérent des variables et méthodes',
        'Tests écrits en langage métier',
        'Documentation technique alignée',
        'Revues de code orientées vocabulaire',
        'Formation continue des équipes'
      ]
    },
    {
      category: 'Gouvernance',
      description: 'Comment assurer la qualité et la cohérence du langage à l\'échelle',
      icon: 'shield-check',
      practices: [
        'Responsables du glossaire par domaine',
        'Processus de validation des nouveaux termes',
        'Résolution des conflits de terminologie',
        'Standards de documentation',
        'Métriques de cohérence',
        'Audits périodiques du vocabulaire'
      ]
    },
    {
      category: 'Outils et Techniques',
      description: 'Outils et méthodologies pour supporter le langage ubiquitaire',
      icon: 'toolbox',
      practices: [
        'Event Storming pour découvrir le vocabulaire',
        'Domain Storytelling pour validation',
        'Outils de recherche dans le glossaire',
        'Intégration IDE pour suggestions',
        'Dashboards de cohérence terminologique',
        'Automatisation des contrôles'
      ]
    }
  ];

  openConfluence(): void {
    // Logique pour ouvrir le glossaire Confluence
    console.log('Ouverture du glossaire Confluence');
  }
}