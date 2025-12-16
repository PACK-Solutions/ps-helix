import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';

@Component({
  selector: 'ds-grid-demo',
  imports: [TranslateModule, DemoPageLayoutComponent],
  templateUrl: './grid-demo.component.html',
  styleUrls: ['./grid-demo.component.css']
})
export class GridDemoComponent {
  Math = Math;

  spacingPrinciples = [
    {
      title: 'Cohérence Visuelle',
      description: 'Un système d\'espacement unifié qui crée une harmonie visuelle et une structure prévisible à travers toute l\'application.',
      icon: 'ruler',
      benefits: [
        'Hiérarchie spatiale claire',
        'Rythme visuel harmonieux',
        'Reconnaissance des patterns',
        'Maintenance simplifiée'
      ]
    },
    {
      title: 'Système Hybride 8/4',
      description: 'Flexibilité d\'un système qui combine la base de 8px pour les espacements majeurs avec des incréments de 4px pour les ajustements fins.',
      icon: 'sliders',
      benefits: [
        'Précision des ajustements',
        'Respect de la grille de base',
        'Adaptabilité aux besoins',
        'Équilibre optimal'
      ]
    },
    {
      title: 'Responsive par Nature',
      description: 'Les espacements s\'adaptent intelligemment aux différentes tailles d\'écran pour maintenir une expérience optimale sur tous les appareils.',
      icon: 'devices',
      benefits: [
        'Adaptation fluide mobile-desktop',
        'Densité appropriée par contexte',
        'Lisibilité préservée',
        'Performance optimisée'
      ]
    },
    {
      title: 'Accessibilité Intégrée',
      description: 'Les espacements garantissent des zones de touch minimales et des marges suffisantes pour une navigation confortable et accessible.',
      icon: 'hand-tap',
      benefits: [
        'Zones tactiles 44x44px minimum',
        'Espacement focus visible',
        'Navigation keyboard optimale',
        'Conformité WCAG'
      ]
    }
  ];

  smallSpacings = [
    {
      name: 'XXS',
      variable: '--spacing-xxs',
      pixels: 2,
      usage: 'Bordures fines, séparations subtiles'
    },
    {
      name: 'XS',
      variable: '--spacing-xs',
      pixels: 4,
      usage: 'Espacement minimal entre éléments proches'
    },
    {
      name: 'SM',
      variable: '--spacing-sm',
      pixels: 8,
      usage: 'Padding interne de composants compacts'
    }
  ];

  mediumSpacings = [
    {
      name: 'MD',
      variable: '--spacing-md',
      pixels: 16,
      usage: 'Espacement standard entre éléments'
    },
    {
      name: 'LG',
      variable: '--spacing-lg',
      pixels: 24,
      usage: 'Séparation entre groupes d\'éléments'
    },
    {
      name: 'XL',
      variable: '--spacing-xl',
      pixels: 32,
      usage: 'Espacement entre sections'
    }
  ];

  largeSpacings = [
    {
      name: '2XL',
      variable: '--spacing-2xl',
      pixels: 48,
      usage: 'Grandes marges entre sections principales'
    },
    {
      name: '3XL',
      variable: '--spacing-3xl',
      pixels: 64,
      usage: 'Séparation majeure de contenu'
    },
    {
      name: '4XL',
      variable: '--spacing-4xl',
      pixels: 80,
      usage: 'Espacement maximal pour layouts aérés'
    }
  ];

  spacingCategories = [
    {
      title: 'Petits Espacements',
      description: 'Pour les détails fins, bordures et espacements minimaux entre éléments proches. Idéal pour les composants compacts et les ajustements de précision.',
      icon: 'dots-three',
      color: 'var(--info-color)',
      spacings: this.smallSpacings
    },
    {
      title: 'Espacements Moyens',
      description: 'Pour les espacements standards entre éléments et groupes. La base du système pour créer une hiérarchie visuelle claire et équilibrée.',
      icon: 'rows',
      color: 'var(--success-color)',
      spacings: this.mediumSpacings
    },
    {
      title: 'Grands Espacements',
      description: 'Pour séparer les sections majeures et créer des layouts aérés. Utilisés pour les marges importantes et la structuration globale des pages.',
      icon: 'arrows-out-simple',
      color: 'var(--warning-color)',
      spacings: this.largeSpacings
    }
  ];


  breakpoints = [
    {
      name: 'Mobile',
      icon: 'device-mobile',
      range: '< 768px',
      description: 'Optimisation pour smartphones avec espacements réduits et layouts en colonne unique',
      strategies: [
        'Réduction des espacements de 20-30%',
        'Layouts en colonne unique',
        'Padding minimal pour maximiser l\'espace',
        'Touch targets minimum 44x44px'
      ],
      example: {
        container: 'padding: var(--spacing-sm)',
        sections: 'gap: var(--spacing-md)',
        cards: 'margin-bottom: var(--spacing-md)'
      }
    },
    {
      name: 'Tablette',
      icon: 'device-tablet',
      range: '768px - 1024px',
      description: 'Zone intermédiaire avec layouts adaptables en 2 colonnes et espacements moyens',
      strategies: [
        'Espacements standards du système',
        'Layouts 2 colonnes pour cartes',
        'Padding équilibré',
        'Mix de navigation tactile et souris'
      ],
      example: {
        container: 'padding: var(--spacing-md)',
        sections: 'gap: var(--spacing-lg)',
        cards: 'margin-bottom: var(--spacing-lg)'
      }
    },
    {
      name: 'Desktop',
      icon: 'desktop',
      range: '1024px - 1400px',
      description: 'Layouts multi-colonnes avec espacements généreux et densité d\'information optimale',
      strategies: [
        'Espacements complets du système',
        'Layouts 3-4 colonnes pour grilles',
        'Padding généreux pour aération',
        'Navigation souris optimisée'
      ],
      example: {
        container: 'padding: var(--spacing-xl)',
        sections: 'gap: var(--spacing-2xl)',
        cards: 'margin-bottom: var(--spacing-xl)'
      }
    },
    {
      name: 'Large Desktop',
      icon: 'monitor',
      range: '> 1400px',
      description: 'Écrans larges avec max-width conteneurs et espacements maximaux pour éviter la dispersion',
      strategies: [
        'Max-width: 1400px pour conteneurs',
        'Espacements maximaux entre sections',
        'Grilles jusqu\'à 4-6 colonnes',
        'Centrage et marges automatiques'
      ],
      example: {
        container: 'padding: var(--spacing-2xl); max-width: 1400px',
        sections: 'gap: var(--spacing-3xl)',
        cards: 'margin-bottom: var(--spacing-2xl)'
      }
    }
  ];

  spacingRules = [
    {
      category: 'Hiérarchie Spatiale',
      description: 'Créer une structure visuelle claire par l\'espacement',
      icon: 'arrows-out-cardinal',
      rules: [
        'Éléments liés: espacements plus petits (xs, sm)',
        'Groupes distincts: espacements moyens (md, lg)',
        'Sections séparées: espacements larges (xl, 2xl)',
        'Progression cohérente de l\'espace',
        'Ratio constant entre niveaux hiérarchiques',
        'Éviter les espacements arbitraires'
      ]
    },
    {
      category: 'Système de Grille',
      description: 'Respecter la base 8px et utiliser les incréments 4px',
      icon: 'grid-nine',
      rules: [
        'Base 8px pour 90% des espacements',
        'Incréments 4px uniquement pour ajustements fins',
        'Jamais d\'espacements en pixels arbitraires',
        'Toujours utiliser les variables CSS',
        'Maintenir l\'alignement sur la grille',
        'Documenter les exceptions au système'
      ]
    },
    {
      category: 'Responsive et Adaptation',
      description: 'Adapter les espacements selon la taille d\'écran',
      icon: 'arrows-in',
      rules: [
        'Réduire les espacements sur mobile (20-30%)',
        'Utiliser clamp() pour espacements fluides',
        'Breakpoints: 768px, 1024px, 1400px',
        'Touch targets minimum 44x44px',
        'Tester sur devices réels',
        'Priorité au contenu sur mobile'
      ]
    },
    {
      category: 'Accessibilité',
      description: 'Garantir des espacements accessibles et utilisables',
      icon: 'wheelchair',
      rules: [
        'Zones tactiles minimum 44x44px',
        'Focus outline visible avec margin suffisant',
        'Espacement entre éléments interactifs',
        'Support zoom jusqu\'à 200%',
        'Lisibilité préservée en responsive',
        'Navigation keyboard fluide'
      ]
    }
  ];

  utilityClasses = [
    {
      category: 'Classes Margin',
      icon: 'arrows-out',
      description: 'Contrôle des marges externes des éléments',
      classes: [
        { name: 'm-{size}', usage: 'Margin uniforme sur tous les côtés' },
        { name: 'mt-{size}', usage: 'Margin top uniquement' },
        { name: 'mb-{size}', usage: 'Margin bottom uniquement' },
        { name: 'ml-{size}', usage: 'Margin left uniquement' },
        { name: 'mr-{size}', usage: 'Margin right uniquement' },
        { name: 'mx-{size}', usage: 'Margin horizontal (left + right)' },
        { name: 'my-{size}', usage: 'Margin vertical (top + bottom)' }
      ],
      example: '<div class="mb-lg mt-xl">Contenu avec marges</div>'
    },
    {
      category: 'Classes Padding',
      icon: 'frame-corners',
      description: 'Contrôle des espacements internes des éléments',
      classes: [
        { name: 'p-{size}', usage: 'Padding uniforme sur tous les côtés' },
        { name: 'pt-{size}', usage: 'Padding top uniquement' },
        { name: 'pb-{size}', usage: 'Padding bottom uniquement' },
        { name: 'pl-{size}', usage: 'Padding left uniquement' },
        { name: 'pr-{size}', usage: 'Padding right uniquement' },
        { name: 'px-{size}', usage: 'Padding horizontal (left + right)' },
        { name: 'py-{size}', usage: 'Padding vertical (top + bottom)' }
      ],
      example: '<div class="p-xl px-2xl">Contenu avec padding</div>'
    },
    {
      category: 'Classes Gap',
      icon: 'columns',
      description: 'Espacement entre éléments flex ou grid',
      classes: [
        { name: 'gap-{size}', usage: 'Gap uniforme entre tous les enfants' },
        { name: 'gap-x-{size}', usage: 'Gap horizontal (column-gap)' },
        { name: 'gap-y-{size}', usage: 'Gap vertical (row-gap)' }
      ],
      example: '<div class="gap-md">Enfants avec espacement</div>'
    }
  ];
}
