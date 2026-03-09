import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';

@Component({
  selector: 'ds-typography-demo',
  imports: [TranslateModule, DemoPageLayoutComponent],
  templateUrl: './typography-demo.component.html',
  styleUrls: ['./typography-demo.component.css']
})
export class TypographyDemoComponent {
  
  // Principes typographiques fondamentaux
  typographyPrinciples = [
    {
      title: 'Hiérarchie Visuelle',
      description: 'Créer une structure claire et logique qui guide naturellement l\'œil de l\'utilisateur à travers l\'information.',
      icon: 'stack',
      benefits: [
        'Navigation intuitive du contenu',
        'Compréhension immédiate de l\'importance',
        'Réduction de la charge cognitive',
        'Expérience de lecture optimisée'
      ]
    },
    {
      title: 'Lisibilité Optimale',
      description: 'Assurer une lecture confortable et efficace dans toutes les conditions d\'utilisation et sur tous les supports.',
      icon: 'eye',
      benefits: [
        'Contraste optimal pour tous',
        'Tailles de police adaptées',
        'Espacement équilibré',
        'Support multi-écrans'
      ]
    },
    {
      title: 'Cohérence Sémantique',
      description: 'Établir un langage typographique cohérent qui renforce l\'identité et facilite la compréhension.',
      icon: 'text-aa',
      benefits: [
        'Reconnaissance immédiate des patterns',
        'Apprentissage accéléré de l\'interface',
        'Confiance utilisateur renforcée',
        'Maintenance simplifiée'
      ]
    },
    {
      title: 'Accessibilité Universelle',
      description: 'Garantir que le contenu textuel est accessible à tous, incluant les utilisateurs avec des besoins spécifiques.',
      icon: 'wheelchair',
      benefits: [
        'Conformité WCAG 2.1 AA',
        'Support des lecteurs d\'écran',
        'Adaptation aux préférences utilisateur',
        'Inclusion maximale'
      ]
    }
  ];

  // Échelle typographique avec usage et contextes
  typographyScale = [
    {
      name: 'Display Large',
      variable: '--font-size-4xl',
      size: '2.25rem',
      pixels: '36px',
      usage: 'Titres héros, pages d\'accueil',
      lineHeight: '--line-height-tight',
      weight: '--font-weight-bold',
      examples: ['Titre principal d\'une landing page', 'Bannières promotionnelles']
    },
    {
      name: 'Display Medium',
      variable: '--font-size-3xl',
      size: '1.875rem',
      pixels: '30px',
      usage: 'Titres de sections importantes',
      lineHeight: '--line-height-tight',
      weight: '--font-weight-semibold',
      examples: ['Titres de pages internes', 'Sections principales']
    },
    {
      name: 'Heading Large',
      variable: '--font-size-2xl',
      size: '1.5rem',
      pixels: '24px',
      usage: 'Titres de sous-sections',
      lineHeight: '--line-height-normal',
      weight: '--font-weight-semibold',
      examples: ['Blocs de contenu', 'Cartes importantes']
    },
    {
      name: 'Heading Medium',
      variable: '--font-size-xl',
      size: '1.25rem',
      pixels: '20px',
      usage: 'Sous-titres, labels importants',
      lineHeight: '--line-height-normal',
      weight: '--font-weight-medium',
      examples: ['Formulaires', 'Sections de cartes']
    },
    {
      name: 'Body Large',
      variable: '--font-size-lg',
      size: '1.125rem',
      pixels: '18px',
      usage: 'Corps de texte important',
      lineHeight: '--line-height-relaxed',
      weight: '--font-weight-normal',
      examples: ['Introductions', 'Descriptions principales']
    },
    {
      name: 'Body',
      variable: '--font-size-base',
      size: '1rem',
      pixels: '16px',
      usage: 'Corps de texte standard',
      lineHeight: '--line-height-relaxed',
      weight: '--font-weight-normal',
      examples: ['Paragraphes', 'Contenu général']
    },
    {
      name: 'Body Small',
      variable: '--font-size-sm',
      size: '0.875rem',
      pixels: '14px',
      usage: 'Texte secondaire, descriptions',
      lineHeight: '--line-height-normal',
      weight: '--font-weight-normal',
      examples: ['Sous-titres', 'Métadonnées']
    },
    {
      name: 'Caption',
      variable: '--font-size-xs',
      size: '0.75rem',
      pixels: '12px',
      usage: 'Légendes, annotations',
      lineHeight: '--line-height-normal',
      weight: '--font-weight-normal',
      examples: ['Notes de bas de page', 'Timestamps']
    }
  ];

  // Règles typographiques et bonnes pratiques
  typographyRules = [
    {
      category: 'Hiérarchie et Contraste',
      description: 'Établir une hiérarchie claire pour guider la lecture',
      icon: 'ranking',
      rules: [
        'Utiliser maximum 3 poids de police par design',
        'Maintenir un contraste minimum de 4.5:1 pour le texte normal',
        'Contraste minimum de 3:1 pour les gros textes (18px+)',
        'Espacer les niveaux de hiérarchie de façon cohérente',
        'Éviter plus de 4 tailles de police sur une même page',
        'Utiliser les variables CSS systématiquement'
      ]
    },
    {
      category: 'Lisibilité et Espacement',
      description: 'Optimiser le confort de lecture et la compréhension',
      icon: 'text-align-center',
      rules: [
        'Longueur de ligne optimale : 45-75 caractères',
        'Espacement des lignes : 150% pour le corps, 120% pour les titres',
        'Espacement des paragraphes : 1.5x la taille de la police',
        'Marges suffisantes autour des blocs de texte',
        'Alignement cohérent selon le contexte',
        'Éviter la justification pour les interfaces'
      ]
    },
    {
      category: 'Responsive et Adaptation',
      description: 'Assurer une excellente expérience sur tous les appareils',
      icon: 'devices',
      rules: [
        'Tailles fluides avec clamp() pour la responsivité',
        'Augmentation progressive des tailles sur desktop',
        'Réduction des espacements sur mobile',
        'Test sur différentes résolutions',
        'Adaptation aux préférences système (font-size)',
        'Performance optimisée pour le chargement'
      ]
    },
    {
      category: 'Accessibilité et Inclusion',
      description: 'Garantir l\'accessibilité universelle du contenu textuel',
      icon: 'wheelchair',
      rules: [
        'Support des technologies d\'assistance',
        'Respect des préférences de mouvement réduit',
        'Couleurs non porteuses d\'information seule',
        'Focus visible et cohérent',
        'Support du zoom jusqu\'à 200%',
        'Langage clair et structures logiques'
      ]
    }
  ];

  // Cas d'usage avec exemples concrets
  usageExamples = [
    {
      context: 'Formulaires et Interfaces',
      description: 'Optimiser la saisie et la navigation dans les formulaires complexes',
      icon: 'textbox',
      guidelines: [
        'Labels en font-weight-medium pour la clarté',
        'Tailles suffisantes pour la lecture mobile',
        'Contraste renforcé pour les états d\'erreur',
        'Hiérarchie claire entre labels et aide'
      ],
      example: {
        title: 'Exemple de Formulaire',
        demo: 'Label du champ en font-size-sm/font-weight-medium, Placeholder en font-size-base/couleur secondaire'
      }
    },
    {
      context: 'Contenu Éditorial',
      description: 'Maximiser l\'engagement et la compréhension pour les contenus longs',
      icon: 'article',
      guidelines: [
        'Line-height-relaxed pour le confort de lecture',
        'Tailles généreuses pour réduire la fatigue',
        'Espacement vertical rythmé',
        'Introduction en font-size-lg pour l\'accroche'
      ],
      example: {
        title: 'Exemple d\'Article',
        demo: 'Titre en font-size-2xl, Introduction en font-size-lg, Corps en font-size-base avec line-height-relaxed'
      }
    },
    {
      context: 'Tableaux de Bord',
      description: 'Faciliter la lecture rapide et l\'analyse de données',
      icon: 'chart-line',
      guidelines: [
        'Tailles compactes pour maximiser la densité',
        'Poids contrastés pour la hiérarchie',
        'Alignement numérique pour les colonnes',
        'États visuels clairs pour les alertes'
      ],
      example: {
        title: 'Exemple de Dashboard',
        demo: 'Métriques en font-size-xl/font-weight-bold, Labels en font-size-sm, Valeurs en font-weight-semibold'
      }
    }
  ];

  // Outils et ressources pour la typographie
  typographyTools = [
    {
      category: 'Outils de Validation',
      description: 'Vérifier la conformité et la qualité typographique',
      icon: 'check-circle',
      tools: [
        'WebAIM Contrast Checker pour les contrastes',
        'WAVE pour l\'accessibilité globale',
        'Lighthouse pour les performances',
        'axe DevTools pour les tests automatisés'
      ]
    },
    {
      category: 'Ressources de Référence',
      description: 'Guides et standards pour approfondir vos connaissances',
      icon: 'book-open',
      tools: [
        'WCAG 2.1 Guidelines pour l\'accessibilité',
        'Material Design Typography pour l\'inspiration',
        'Type Scale Calculator pour les proportions',
        'Google Fonts pour les alternatives'
      ]
    }
  ];
}