import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DemoPageLayoutComponent } from '../../layout/demo-page-layout.component';
import { CodeSnippetComponent } from '../../shared/code-snippet.component';

@Component({
  selector: 'ds-introduction-demo',
  imports: [TranslateModule, DemoPageLayoutComponent, CodeSnippetComponent],
  templateUrl: './introduction-demo.component.html',
  styleUrls: ['./introduction-demo.component.css'],
})
export class IntroductionDemoComponent {
  npmUrl = 'https://www.npmjs.com/package/ps-helix';
  npmVersion = '3.0.0';
  keyFeatures = [
    {
      icon: 'lightning',
      title: 'Performance Optimale',
      description: 'Composants légers et réactifs basés sur les signals Angular 21, optimisés pour maximiser l\'efficacité et la productivité.'
    },
    {
      icon: 'heart',
      title: 'Centré Utilisateur',
      description: 'Chaque composant est conçu en fonction des besoins réels des utilisateurs et des meilleures pratiques UX.'
    },
    {
      icon: 'wheelchair',
      title: 'Accessibilité Native',
      description: 'Développé selon les directives WCAG 2.1 AA, garantissant une expérience inclusive pour tous les utilisateurs.'
    },
    {
      icon: 'code',
      title: 'Expérience Développeur',
      description: '28 composants standalone avec API intuitive, TypeScript strict et documentation complète pour une intégration rapide.'
    }
  ];

  setupSteps = [
    {
      number: 1,
      title: 'Installer le Package',
      description: 'Installez ps-helix via pnpm (recommande) ou npm dans votre projet Angular.',
      codeLabel: 'Terminal',
      codeSnippet: `# Avec pnpm (recommande)
pnpm add ps-helix

# Avec npm
npm install ps-helix`,
      note: 'Assurez-vous d\'utiliser Angular 21 ou superieur. pnpm offre des performances optimales.'
    },
    {
      number: 2,
      title: 'Importer les Styles Globaux',
      description: 'Ajoutez l\'import des styles Helix dans votre fichier styles.css principal.',
      codeLabel: 'src/styles.css',
      codeSnippet: `@import 'ps-helix/styles.css';`,
      note: 'Ceci inclut : reset CSS, thèmes, tokens de design, utilitaires et système responsive'
    },
    {
      number: 3,
      title: 'Configurer Phosphor Icons CDN',
      description: 'Ajoutez les liens CDN pour Phosphor Icons dans votre index.html pour accéder à toutes les variantes d\'icônes.',
      codeLabel: 'src/index.html',
      codeSnippet: `<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/light/style.css">`,
      note: 'Version 2.0.3 recommandée pour la compatibilité'
    },
    {
      number: 4,
      title: 'Importer les Composants',
      description: 'Tous les composants sont standalone. Importez-les directement dans vos composants.',
      codeLabel: 'app.component.ts',
      codeSnippet: `import { Component } from '@angular/core';
import { PshButtonComponent } from 'ps-helix';

@Component({
  selector: 'app-root',
  imports: [PshButtonComponent],
  template: \`
    <psh-button variant="primary">
      Cliquez ici
    </psh-button>
  \`
})
export class AppComponent {}`,
      note: 'Pas besoin de NgModules, tous les composants sont standalone'
    },
    {
      number: 5,
      title: 'Configurer le ThemeService (Optionnel)',
      description: 'Le ThemeService gère automatiquement les thèmes light/dark et les couleurs personnalisées.',
      codeLabel: 'app.component.ts',
      codeSnippet: `import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from 'ps-helix';

@Component({
  selector: 'app-root',
  template: \`
    <button (click)="themeService.toggleTheme()">
      Thème: {{ themeService.themeName() }}
    </button>
  \`
})
export class AppComponent implements OnInit {
  themeService = inject(ThemeService);

  ngOnInit() {
    // Le thème est initialisé automatiquement
  }
}`,
      note: 'Le service est providedIn: \'root\' - aucune configuration nécessaire'
    },
    {
      number: 6,
      title: 'Personnaliser les Couleurs (Optionnel)',
      description: 'Pour utiliser vos couleurs de marque, créez un service implémentant InsurerContextService et configurez le provider INSURER_CONTEXT_SERVICE. Consultez le guide complet dans la documentation THEME.md.',
      codeLabel: 'Aperçu rapide',
      codeSnippet: `// 1. Créer AppThemeContextService implements InsurerContextService
// 2. Définir primaryColor() et secondaryColor() avec signals
// 3. Provider: { provide: INSURER_CONTEXT_SERVICE, useExisting: ... }

// Exemple complet dans la documentation THEME.md`,
      note: 'Guide détaillé disponible : consultez THEME.md pour la configuration complète'
    }
  ];

  quickExamples = [
    {
      icon: 'cursor-click',
      title: 'Button Component',
      description: 'Bouton polyvalent avec plusieurs variantes et états',
      code: `<psh-button
  variant="primary"
  size="medium"
  appearance="filled"
  (clicked)="handleClick()">
  Soumettre
</psh-button>`
    },
    {
      icon: 'text-align-left',
      title: 'Input Component',
      description: 'Champ de saisie avec validation intégrée',
      code: `<psh-input
  label="Email"
  placeholder="votre@email.com"
  type="email"
  [formControl]="emailControl"
  required>
</psh-input>`
    },
    {
      icon: 'notification',
      title: 'Toast Notifications',
      description: 'Service de notifications toast avec plusieurs niveaux',
      code: `import { inject } from '@angular/core';
import { PshToastService } from 'ps-helix';

export class MyComponent {
  private toastService = inject(PshToastService);

  showSuccess() {
    this.toastService.success('Opération réussie !');
  }
}`
    },
    {
      icon: 'square',
      title: 'Modal Component',
      description: 'Dialogue modal avec gestion de l\'état via signals',
      code: `<psh-modal
  [(open)]="isOpen"
  title="Confirmer l'action"
  size="medium">
  <p>Êtes-vous sûr de vouloir continuer ?</p>
  <div class="actions">
    <psh-button (clicked)="isOpen.set(false)">
      Annuler
    </psh-button>
    <psh-button
      variant="primary"
      (clicked)="confirm()">
      Confirmer
    </psh-button>
  </div>
</psh-modal>`
    }
  ];

  services = [
    {
      name: 'ThemeService',
      icon: 'palette',
      description: 'Service de gestion des thèmes light/dark et des couleurs personnalisées avec génération automatique de variantes.',
      features: [
        'Basculer entre thème clair et sombre',
        'Persistance dans localStorage',
        'Couleurs personnalisées via injection token',
        'Génération automatique de variantes de couleurs',
        'Calcul automatique de couleurs de texte accessibles',
        'Signals réactifs pour les mises à jour en temps réel'
      ],
      codeLabel: 'Utilisation basique',
      codeExample: `import { inject } from '@angular/core';
import { ThemeService } from 'ps-helix';

export class MyComponent {
  themeService = inject(ThemeService);

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  get currentTheme() {
    return this.themeService.themeName();
  }

  get isDark() {
    return this.themeService.isDarkTheme();
  }
}`
    },
    {
      name: 'PshToastService',
      icon: 'bell',
      description: 'Service de notifications toast pour afficher des messages temporaires avec différents niveaux de sévérité.',
      features: [
        'Méthodes success(), error(), warning(), info(), danger()',
        'Durée d\'affichage configurable',
        'Position configurable',
        'Icônes automatiques selon le type',
        'File d\'attente automatique des notifications',
        'Animations fluides d\'entrée/sortie'
      ],
      codeLabel: 'Utilisation du service',
      codeExample: `import { inject } from '@angular/core';
import { PshToastService } from 'ps-helix';

export class MyComponent {
  private toastService = inject(PshToastService);

  showNotifications() {
    this.toastService.success('Enregistré avec succès');

    this.toastService.error('Erreur lors de la sauvegarde');

    this.toastService.info('Nouvelle mise à jour disponible', {
      duration: 5000
    });

    this.toastService.warning('Attention : action irréversible');
  }
}`
    },
    {
      name: 'TranslationService',
      icon: 'translate',
      description: 'Service d\'internationalisation flexible basé sur ngx-translate pour la gestion multi-langues.',
      features: [
        'Support de ngx-translate par défaut',
        'Interface abstraite pour d\'autres providers',
        'Traduction synchrone et asynchrone',
        'Changement de langue dynamique',
        'Observable pour les changements de langue',
        'Paramètres de traduction dynamiques'
      ],
      codeLabel: 'Configuration dans main.ts',
      codeExample: `import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

bootstrapApplication(AppComponent, {
  providers: [
    ...TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader
      }
    }).providers || []
  ]
});`
    },
    {
      name: 'ScrollService',
      icon: 'arrow-up',
      description: 'Service utilitaire pour la gestion du défilement et la navigation fluide dans l\'application.',
      features: [
        'scrollToTop() - Retour en haut de page',
        'scrollToElement(selector) - Navigation vers un élément',
        'disableScroll() - Désactiver le scroll (pour les modals)',
        'enableScroll() - Réactiver le scroll',
        'Animations de défilement fluides',
        'Support cross-browser'
      ],
      codeLabel: 'Utilisation du service',
      codeExample: `import { inject } from '@angular/core';
import { ScrollService } from 'ps-helix';

export class MyComponent {
  private scrollService = inject(ScrollService);

  backToTop() {
    this.scrollService.scrollToTop();
  }

  goToSection(id: string) {
    this.scrollService.scrollToElement(\`#\${id}\`);
  }
}`
    }
  ];

  iconWeights = [
    { name: 'Regular', class: 'ph', fullClass: 'ph ph-heart' },
    { name: 'Fill', class: 'ph-fill', fullClass: 'ph-fill ph-heart' },
    { name: 'Bold', class: 'ph-bold', fullClass: 'ph-bold ph-heart' },
    { name: 'Light', class: 'ph-light', fullClass: 'ph-light ph-heart' }
  ];

  phosphorCdnCode = `<!-- Dans votre src/index.html -->
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/regular/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/fill/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/bold/style.css">
<link rel="stylesheet" href="https://unpkg.com/@phosphor-icons/web@2.0.3/src/light/style.css">`;

  iconUsageCode = `<!-- Icône regular (par défaut) -->
<i class="ph ph-heart"></i>

<!-- Icône fill -->
<i class="ph-fill ph-heart"></i>

<!-- Icône bold -->
<i class="ph-bold ph-heart"></i>

<!-- Icône light -->
<i class="ph-light ph-heart"></i>

<!-- Avec aria-label pour l'accessibilité -->
<button aria-label="J'aime">
  <i class="ph ph-heart" aria-hidden="true"></i>
</button>`;
}
