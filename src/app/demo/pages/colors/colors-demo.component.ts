import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import {
  contrastRatio,
  parseColor,
  resolveCssVariable,
  wcagLevel,
  type WcagLevel,
} from '../../utils/contrast.util';
import { ThemeService, type ContrastReport } from 'ps-helix';

interface ContrastInfo {
  ratio: number;
  ratioLabel: string;
  level: WcagLevel;
  levelKey: 'aaa' | 'aa' | 'aa-large' | 'fail';
  resolvedValue: string;
  background: string;
  backgroundValue: string;
}

type ContrastReference = 'surface' | 'text';

@Component({
  selector: 'ds-colors-demo',
  imports: [TranslateModule, DemoPageLayoutComponent, FormsModule],
  templateUrl: './colors-demo.component.html',
  styleUrls: ['./colors-demo.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorsDemoComponent implements AfterViewInit, OnDestroy {
  private themeObserver?: MutationObserver;
  private readonly themeService = inject(ThemeService);

  readonly contrastReference = signal<ContrastReference>('surface');
  readonly contrastInfos = signal<Record<string, ContrastInfo>>({});

  readonly previewPrimary = signal<string>('#0B0191');
  readonly previewSecondary = signal<string>('#5E5E5E');
  readonly previewReport = signal<ContrastReport | null>(null);

  readonly levelToneLabels: Record<WcagLevel, string> = {
    AAA: 'AAA',
    AA: 'AA',
    'AA Large': 'AA Large',
    Fail: 'Échec',
  };

  runPreview(): void {
    const report = this.themeService.previewCustomerTheme(
      this.previewPrimary(),
      this.previewSecondary(),
    );
    this.previewReport.set(report);
  }

  ngAfterViewInit(): void {
    this.computeContrasts();
    this.themeObserver = new MutationObserver(() => this.computeContrasts());
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'style'],
    });
  }

  ngOnDestroy(): void {
    this.themeObserver?.disconnect();
  }

  setContrastReference(reference: ContrastReference): void {
    this.contrastReference.set(reference);
    this.computeContrasts();
  }

  private computeContrasts(): void {
    const reference = this.contrastReference();
    const backgroundVar = reference === 'text' ? '--text-color' : '--surface-0';
    const backgroundLabel =
      reference === 'text' ? 'texte principal' : 'fond principal';
    const backgroundValue = resolveCssVariable(backgroundVar);
    const bg = parseColor(backgroundValue);
    if (!bg) {
      this.contrastInfos.set({});
      return;
    }

    const next: Record<string, ContrastInfo> = {};
    for (const palette of this.colorPalettes) {
      for (const color of palette.colors) {
        const value = resolveCssVariable(color.variable);
        const fg = parseColor(value);
        if (!fg) continue;
        const ratio = contrastRatio(fg, bg);
        const level = wcagLevel(ratio);
        next[color.variable] = {
          ratio,
          ratioLabel: `${ratio.toFixed(2)} : 1`,
          level,
          levelKey: this.toLevelKey(level),
          resolvedValue: value,
          background: backgroundLabel,
          backgroundValue,
        };
      }
    }
    this.contrastInfos.set(next);
  }

  private toLevelKey(level: WcagLevel): ContrastInfo['levelKey'] {
    switch (level) {
      case 'AAA':
        return 'aaa';
      case 'AA':
        return 'aa';
      case 'AA Large':
        return 'aa-large';
      default:
        return 'fail';
    }
  }

  colorPrinciples = [
    {
      title: 'Cohérence Visuelle',
      description: 'Un système de couleurs unifié qui assure une identité visuelle forte et reconnaissable à travers toute l\'application.',
      icon: 'palette',
      benefits: [
        'Identité de marque renforcée',
        'Navigation intuitive',
        'Reconnaissance immédiate',
        'Maintenance simplifiée'
      ]
    },
    {
      title: 'Accessibilité WCAG',
      description: 'Tous les contrastes respectent les standards WCAG 2.1 AA pour garantir une lisibilité optimale pour tous les utilisateurs.',
      icon: 'eye',
      benefits: [
        'Contraste minimum 4.5:1',
        'Support malvoyants',
        'Lisibilité maximale',
        'Conformité légale'
      ]
    },
    {
      title: 'Sémantique Claire',
      description: 'Chaque couleur porte un sens spécifique qui guide intuitivement l\'utilisateur dans ses actions et sa compréhension.',
      icon: 'lightbulb',
      benefits: [
        'Communication immédiate',
        'Réduction des erreurs',
        'Feedback visuel clair',
        'Expérience intuitive'
      ]
    },
    {
      title: 'Thématisation Flexible',
      description: 'Support natif des modes clair et sombre avec transitions fluides et cohérence visuelle préservée.',
      icon: 'moon-stars',
      benefits: [
        'Confort visuel adaptatif',
        'Économie d\'énergie',
        'Préférences utilisateur',
        'Contexte d\'usage optimisé'
      ]
    }
  ];

  colorPalettes = [
    {
      category: 'Couleurs Primaires',
      description: 'Définissent l\'identité visuelle principale et guident l\'attention sur les actions importantes.',
      icon: 'star',
      accentColor: 'primary',
      colors: [
        { name: 'Primary', variable: '--primary-color', usage: 'Actions principales, liens, éléments clés' },
        { name: 'Primary Light', variable: '--primary-color-light', usage: 'États de survol, variations subtiles' },
        { name: 'Primary Lighter', variable: '--primary-color-lighter', usage: 'Arrière-plans, indicateurs doux' },
        { name: 'Primary Dark', variable: '--primary-color-dark', usage: 'Texte, accents forts' }
      ]
    },
    {
      category: 'Couleurs Sémantiques',
      description: 'Communiquent un état ou un message spécifique de manière universelle et intuitive.',
      icon: 'info',
      accentColor: 'secondary',
      colors: [
        { name: 'Secondary', variable: '--secondary-color', usage: 'Actions secondaires, support' },
        { name: 'Success', variable: '--success-color', usage: 'Validations, confirmations' },
        { name: 'Warning', variable: '--warning-color', usage: 'Alertes, attention requise' },
        { name: 'Danger', variable: '--danger-color', usage: 'Erreurs, actions destructives' }
      ]
    },
    {
      category: 'Couleurs de Surface',
      description: 'Établissent la hiérarchie spatiale et la profondeur de l\'interface.',
      icon: 'squares-four',
      accentColor: 'success',
      colors: [
        { name: 'Surface Card', variable: '--surface-card', usage: 'Cartes, conteneurs élevés' },
        { name: 'Surface Ground', variable: '--surface-ground', usage: 'Arrière-plan principal' },
        { name: 'Surface Border', variable: '--surface-border', usage: 'Séparations, délimitations' },
        { name: 'Surface Hover', variable: '--surface-hover', usage: 'États de survol' }
      ]
    },
    {
      category: 'Couleurs de Texte',
      description: 'Assurent la lisibilité optimale et la hiérarchie du contenu textuel.',
      icon: 'text-aa',
      accentColor: 'warning',
      colors: [
        { name: 'Text Color', variable: '--text-color', usage: 'Texte principal, contenu important' },
        { name: 'Text Secondary', variable: '--text-color-secondary', usage: 'Descriptions, texte de support' }
      ]
    }
  ];

  usageContexts = [
    {
      context: 'Interfaces Interactives',
      description: 'Guidage visuel clair pour les actions utilisateur et les états interactifs.',
      icon: 'cursor-click',
      guidelines: [
        'Boutons primaires en couleur principale',
        'États hover avec variations de luminosité',
        'Focus avec contour visible et contrasté',
        'Disabled avec opacité réduite'
      ],
      example: 'Bouton Call-to-Action → Primary Color + Primary Dark au hover'
    },
    {
      context: 'Feedback et États',
      description: 'Communication instantanée des résultats d\'actions et états système.',
      icon: 'chat-circle-dots',
      guidelines: [
        'Success pour validations et confirmations',
        'Warning pour actions nécessitant attention',
        'Danger pour erreurs et suppressions',
        'Info pour messages neutres'
      ],
      example: 'Notification de succès → Success Color avec icône de validation'
    },
    {
      context: 'Navigation et Hiérarchie',
      description: 'Organisation visuelle du contenu et guidage dans l\'architecture d\'information.',
      icon: 'map-trifold',
      guidelines: [
        'Éléments actifs en couleur primaire',
        'Navigation secondaire en tons neutres',
        'Badges de statut en couleurs sémantiques',
        'Séparateurs en surface border'
      ],
      example: 'Menu actif → Primary Color + Surface Hover en arrière-plan'
    }
  ];

  accessibilityRules = [
    {
      category: 'Contrastes et Lisibilité',
      description: 'Garantir une lisibilité optimale selon les standards WCAG',
      icon: 'eye-closed',
      rules: [
        'Contraste minimum 4.5:1 pour texte normal (< 18px)',
        'Contraste minimum 3:1 pour gros texte (≥ 18px)',
        'Éviter les couleurs comme seul moyen d\'information',
        'Tester avec simulateurs de daltonisme',
        'Vérifier la lisibilité en niveaux de gris',
        'Utiliser des outils de validation automatique'
      ]
    },
    {
      category: 'Thématisation Adaptative',
      description: 'Support des préférences utilisateur et contextes d\'usage',
      icon: 'sun-horizon',
      rules: [
        'Mode sombre avec luminosité inversée cohérente',
        'Respect de prefers-color-scheme système',
        'Transitions fluides entre thèmes',
        'Conservation des contrastes en mode sombre',
        'Test de toutes les couleurs dans les deux modes',
        'Éviter les changements brutaux de couleur'
      ]
    },
    {
      category: 'Usage Sémantique',
      description: 'Application cohérente des codes couleur universels',
      icon: 'traffic-sign',
      rules: [
        'Rouge/Danger pour actions destructives',
        'Vert/Success pour validations positives',
        'Orange/Warning pour alertes et attention',
        'Bleu/Info pour informations neutres',
        'Éviter le rouge et vert ensemble (daltonisme)',
        'Doubler avec icônes pour renforcer le sens'
      ]
    }
  ];

  implementationGuide = [
    {
      step: 'Import des Variables',
      description: 'Intégrer le système de couleurs dans votre projet',
      icon: 'download-simple',
      code: `@import '@helix/design-system/styles';`,
      notes: [
        'Import automatique de toutes les variables',
        'Support thème clair et sombre inclus',
        'Pas de configuration supplémentaire requise'
      ]
    },
    {
      step: 'Utilisation des Variables CSS',
      description: 'Appliquer les couleurs via les variables CSS',
      icon: 'code',
      code: `.my-button {
  background: var(--primary-color);
  color: var(--primary-color-text);
  border: 1px solid var(--surface-border);
}

.my-button:hover {
  background: var(--primary-color-dark);
}`,
      notes: [
        'Toujours utiliser les variables CSS',
        'Ne jamais coder en dur les valeurs hexadécimales',
        'Permet la thématisation automatique'
      ]
    },
    {
      step: 'Support Mode Sombre',
      description: 'Le système bascule automatiquement selon le thème',
      icon: 'moon',
      code: `[data-theme="dark"] {
  --primary-color: #4040FF;
  --surface-card: #1e293b;
  --text-color: rgba(255, 255, 255, 0.95);
}`,
      notes: [
        'Basculement automatique via data-theme',
        'Pas de code JavaScript nécessaire',
        'Valeurs optimisées pour chaque thème'
      ]
    }
  ];
}