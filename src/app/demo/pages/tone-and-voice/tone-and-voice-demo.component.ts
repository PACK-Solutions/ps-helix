import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';

@Component({
  selector: 'ds-tone-and-voice-demo',
  imports: [TranslateModule, DemoPageLayoutComponent],
  templateUrl: './tone-and-voice-demo.component.html',
  styleUrls: ['./tone-and-voice-demo.component.css']
})
export class ToneAndVoiceDemoComponent {
  audiences = [
    {
      type: 'B2B',
      title: 'Assureurs',
      description: 'Les professionnels du secteur, souvent habitués à des termes techniques et à des interactions formelles.',
      objective: 'Instaurer confiance et crédibilité tout en facilitant la collaboration.',
      tone: [
        'Professionnel, précis, soutenu',
        'Axé sur la fiabilité et l\'expertise'
      ],
      voice: [
        'Experte et crédible',
        'Orientée vers des solutions, avec un langage direct et factuel'
      ],
      examples: [
        {
          type: 'Email',
          content: 'Nous avons intégré de nouvelles fonctionnalités pour vous permettre de mieux gérer vos contrats. Consultez notre documentation ou contactez votre gestionnaire pour plus d\'informations.'
        },
        {
          type: 'Message d\'erreur',
          content: 'Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer ou contacter votre gestionnaire dédié.'
        }
      ]
    },
    {
      type: 'B2C',
      title: 'Clients finaux',
      description: 'Les utilisateurs finaux, souvent moins familiers avec le jargon métier et cherchant une expérience claire et rassurante.',
      objective: 'Offrir une communication accessible et bienveillante.',
      tone: [
        'Chaleureux, rassurant, accessible',
        'Axé sur la clarté et l\'inclusion'
      ],
      voice: [
        'Bienveillante et éducative',
        'Axée sur le soutien, avec un langage clair et simple'
      ],
      examples: [
        {
          type: 'Message d\'information',
          content: 'Votre contrat est bien enregistré. Vous pouvez consulter son statut à tout moment dans votre espace personnel.'
        },
        {
          type: 'Message d\'erreur',
          content: 'Oups, il semble que nous ayons rencontré un problème. Essayez de nouveau ou contactez notre service client pour obtenir de l\'aide.'
        }
      ]
    }
  ];

  principles = [
    {
      title: 'Clarté avant tout',
      description: 'Les messages doivent être compréhensibles dès la première lecture, sans ambiguïté.',
      icon: 'text-aa'
    },
    {
      title: 'Cohérence dans tous les canaux',
      description: 'Que ce soit dans une interface utilisateur, un email ou une notification, le ton doit refléter les mêmes valeurs et principes.',
      icon: 'arrows-in'
    },
    {
      title: 'Éviter le jargon technique',
      description: 'Expliquez les concepts complexes avec des termes simples et accessibles.',
      icon: 'translate'
    },
    {
      title: 'Accessibilité',
      description: 'Assurez-vous que le contenu est lisible et compréhensible pour tous les utilisateurs, y compris ceux avec des besoins spécifiques.',
      icon: 'wheelchair'
    }
  ];
}