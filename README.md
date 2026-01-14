# Helix Design System

Bibliothèque de composants Angular moderne et complète avec 28 composants standalone, système de thèmes, internationalisation et accessibilité optimale.

[![Version](https://img.shields.io/badge/version-2.1.1-blue.svg)](https://www.npmjs.com/package/ps-helix)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular](https://img.shields.io/badge/Angular-20.0.0-red.svg)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.0-blue.svg)](https://www.typescriptlang.org/)

## Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Structure du projet](#structure-du-projet)
- [Fonctionnalités principales](#fonctionnalités-principales)
- [Prérequis](#prérequis)
- [Installation et développement](#installation-et-développement)
- [Architecture technique](#architecture-technique)
- [Composants disponibles](#composants-disponibles)
- [Services](#services)
- [Système de thèmes](#système-de-thèmes)
- [Internationalisation](#internationalisation)
- [Scripts disponibles](#scripts-disponibles)
- [Documentation](#documentation)
- [Contribution](#contribution)
- [Licence](#licence)

## Vue d'ensemble

Helix est un design system professionnel construit avec Angular 20+, offrant une collection complète de composants réutilisables pour créer des applications web modernes et accessibles.

### Auteur
PACK Solutions

### Points clés
- 28 composants standalone prêts à l'emploi
- Architecture basée sur les signals Angular
- Conformité WCAG 2.1 AA pour l'accessibilité
- Support complet TypeScript en mode strict
- Système de thèmes personnalisable (clair/sombre)
- Internationalisation intégrée avec ngx-translate
- 6000+ icônes Phosphor avec variantes de poids
- Design responsive mobile-first
- Aucun module NgModule requis

## Structure du projet

Le projet est organisé en deux parties principales :

```
helix-design-system/
├── projects/ps-helix/          # Bibliothèque de composants (npm package)
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/     # 28 composants standalone
│   │   │   ├── services/       # Services (Theme, Translation, Toast, Scroll)
│   │   │   └── styles/         # Tokens CSS, thèmes et utilitaires
│   │   └── public-api.ts       # Exports publics de la bibliothèque
│   ├── package.json            # Configuration npm de la lib
│   ├── README.md               # Documentation de la bibliothèque
│   └── THEME.md                # Guide de personnalisation des thèmes
│
└── src/                        # Application de démonstration
    ├── app/
    │   ├── demo/               # Pages de démo pour chaque composant
    │   │   ├── components/     # Composants de démo réutilisables
    │   │   ├── layout/         # Layouts de l'app de démo
    │   │   ├── pages/          # Pages pour chaque composant
    │   │   ├── services/       # Services de navigation et raccourcis
    │   │   └── shared/         # Composants partagés (code snippet, search)
    │   ├── home/               # Page d'accueil
    │   └── i18n/               # Traductions pour la démo
    └── index.html
```

### Bibliothèque (ps-helix)
La bibliothèque contient tous les composants, services et styles réutilisables. Elle est publiée sur npm et peut être installée dans n'importe quel projet Angular.

### Application de démonstration
L'application de démonstration présente tous les composants avec :
- Exemples d'utilisation interactifs
- Documentation de chaque composant
- Snippets de code copiables
- Navigation entre composants
- Recherche rapide avec raccourcis clavier (Ctrl+K)
- Support multilingue (EN/FR/ES/DE)
- Toggle thème clair/sombre

## Fonctionnalités principales

### Composants (28)
- **Formulaires** : Button, Input, Checkbox, Radio, Select, Switch
- **Layout** : Card, Modal, Sidebar, Collapse, Tabs, TabBar
- **Feedback** : Alert, Toast, Spinloader, Progressbar, Tooltip
- **Données** : Table, Badge, Tag, Avatar, StatCard, InfoCard, HorizontalCard
- **Navigation** : Menu, Pagination, Stepper, Dropdown

### Services
- **ThemeService** : Gestion des thèmes clair/sombre et couleurs personnalisées
- **ToastService** : Notifications toast avec file d'attente
- **TranslationService** : Wrapper pour ngx-translate
- **ScrollService** : Utilitaires de scroll et gestion du défilement

### Design Tokens
- Système d'espacement cohérent (8px base)
- Palette de couleurs avec rampes complètes
- Typographie responsive
- Animations et transitions
- Breakpoints responsive
- Variables CSS personnalisables

### Accessibilité
- Navigation clavier complète
- Support lecteurs d'écran
- Gestion du focus visible
- Rôles ARIA appropriés
- Contraste de couleurs conforme
- Labels et descriptions accessibles

## Prérequis

### Versions requises
- **Node.js** : 18.x ou supérieur
- **pnpm** : 10.x ou supérieur (recommandé) ou **npm** : 9.x ou supérieur
- **Angular** : 20.0.0 ou supérieur
- **Angular CLI** : 20.0.0 ou supérieur
- **TypeScript** : 5.8.0 ou supérieur

### Dépendances peer
```json
{
  "@angular/common": "^20.0.0",
  "@angular/core": "^20.0.0",
  "@angular/forms": "^20.0.0",
  "@ngx-translate/core": "^15.0.0",
  "rxjs": "^7.8.0"
}
```

### Dépendances incluses
- **@phosphor-icons/web** : 2.0.3 - Bibliothèque d'icônes
- **date-fns** : ^3.3.1 - Utilitaires de dates
- **tslib** : ^2.6.0 - Runtime TypeScript

## Pourquoi pnpm ?

Ce projet utilise **pnpm** comme gestionnaire de paquets recommandé. Voici les avantages principaux :

### Performance
- Installation jusqu'à **2x plus rapide** que npm
- Cache global partagé entre tous les projets
- Téléchargement parallèle optimisé

### Économie d'espace disque
- Liens symboliques vers un store centralisé
- Pas de duplication des dépendances entre projets
- Réduction significative de l'espace utilisé

### Sécurité et fiabilité
- Structure `node_modules` stricte (pas de "phantom dependencies")
- Fichier lock déterministe (`pnpm-lock.yaml`)
- Meilleure isolation des dépendances

### Compatibilité
- **npm reste utilisable** si vous le préférez
- Commandes similaires (`pnpm install`, `pnpm run`, etc.)
- Migration transparente depuis npm

Pour installer pnpm :
```bash
npm install -g pnpm
```

## Installation et développement

### Cloner le projet
```bash
git clone <repository-url>
cd helix-design-system
```

### Installer les dépendances

**Avec pnpm (recommandé) :**
```bash
pnpm install
```

**Avec npm :**
```bash
npm install
```

### Lancer l'application de démonstration

**Avec pnpm :**
```bash
pnpm run dev
```

**Avec npm :**
```bash
npm run dev
```

L'application sera accessible sur `http://localhost:4200`

### Construire la bibliothèque

**Avec pnpm :**
```bash
pnpm run build:lib
```

**Avec npm :**
```bash
npm run build:lib
```

La bibliothèque sera générée dans `dist/ps-helix/`

### Mode développement de la bibliothèque

**Avec pnpm :**
```bash
pnpm run watch:lib
```

**Avec npm :**
```bash
npm run watch:lib
```

Reconstruction automatique à chaque modification

### Publier la bibliothèque

**Avec pnpm :**
```bash
pnpm run publish:lib
```

**Avec npm :**
```bash
npm run publish:lib
```

Publie la bibliothèque sur npm (nécessite les droits d'accès)

## Architecture technique

### Composants Standalone
Tous les composants sont standalone (pas de NgModules) :

```typescript
import { Component } from '@angular/core';
import { PshButtonComponent, PshCardComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshButtonComponent, PshCardComponent],
  template: `
    <psh-card>
      <psh-button variant="primary">Action</psh-button>
    </psh-card>
  `
})
export class ExampleComponent {}
```

### Réactivité par Signals
Utilisation des signals Angular pour une performance optimale :

```typescript
import { Component, signal } from '@angular/core';
import { PshModalComponent } from 'ps-helix';

@Component({
  selector: 'app-example',
  imports: [PshModalComponent],
  template: `
    <button (click)="isOpen.set(true)">Ouvrir</button>
    <psh-modal [(open)]="isOpen" title="Confirmation">
      <p>Êtes-vous sûr ?</p>
    </psh-modal>
  `
})
export class ExampleComponent {
  isOpen = signal(false);
}
```

### Type Safety
Tous les types sont exportés pour un développement type-safe :

```typescript
import { ButtonVariant, ButtonSize, AlertType } from 'ps-helix';

const variant: ButtonVariant = 'primary';  // Type-safe
const size: ButtonSize = 'medium';         // Type-safe
const alertType: AlertType = 'success';    // Type-safe
```

### Injection de dépendances moderne
Utilisation de `inject()` au lieu du constructeur :

```typescript
import { Component, inject } from '@angular/core';
import { ThemeService, ToastService } from 'ps-helix';

@Component({
  selector: 'app-example',
  template: `<button (click)="afficherToast()">Toast</button>`
})
export class ExampleComponent {
  private themeService = inject(ThemeService);
  private toastService = inject(ToastService);

  afficherToast() {
    this.toastService.success('Message envoyé !');
  }
}
```

## Composants disponibles

### Composants de formulaire (6)

#### PshButtonComponent
Bouton versatile avec variantes, tailles et états multiples.
```typescript
<psh-button
  variant="primary"
  size="medium"
  [disabled]="false"
  (clicked)="handleClick()">
  Cliquez ici
</psh-button>
```

#### PshInputComponent
Champ de saisie avec validation, messages d'erreur et intégration FormControl.
```typescript
<psh-input
  label="Email"
  type="email"
  [formControl]="emailControl"
  [required]="true">
</psh-input>
```

#### PshCheckboxComponent
Case à cocher avec états personnalisables.

#### PshRadioComponent
Bouton radio pour sélection unique.

#### PshSelectComponent
Menu déroulant avec recherche, filtrage et rendu personnalisé.

#### PshSwitchComponent
Interrupteur bascule avec états on/off.

### Composants de layout (6)

#### PshCardComponent
Conteneur de contenu flexible avec header, body et footer.

#### PshModalComponent
Dialogue modal avec overlay et navigation clavier.

#### PshSidebarComponent
Barre latérale pliable avec comportement responsive.

#### PshCollapseComponent
Section de contenu extensible/réductible avec animation.

#### PshTabsComponent + PshTabComponent
Organisation de contenu par onglets avec navigation clavier.

#### PshTabBarComponent
Barre de navigation inférieure pour applications mobile-first.

### Composants de feedback (5)

#### PshAlertComponent
Messages d'alerte avec niveaux de gravité.
```typescript
<psh-alert
  type="success"
  message="Opération réussie !">
</psh-alert>
```

#### PshToastComponent + ToastService
Système de notifications toast avec gestion de file.

#### PshSpinloaderComponent
Spinner de chargement avec différentes tailles.

#### PshProgressbarComponent
Indicateur de progression avec affichage du pourcentage.

#### PshTooltipComponent
Info-bulles contextuelles avec positions multiples.

### Composants d'affichage de données (7)

#### PshTableComponent
Tableau de données avec tri, pagination et rendu personnalisé.

#### PshBadgeComponent
Badges et indicateurs de statut avec couleurs variées.

#### PshTagComponent
Tags supprimables pour labels et filtres.

#### PshAvatarComponent
Avatar utilisateur avec image, initiales ou icône de secours.

#### PshStatCardComponent
Carte statistique pour tableaux de bord.

#### PshInfoCardComponent
Carte d'information avec icône et contenu.

#### PshHorizontalCardComponent
Composant de carte à disposition horizontale.

### Composants de navigation (4)

#### PshMenuComponent
Menu déroulant avec éléments imbriqués.

#### PshPaginationComponent
Contrôles de pagination avec numéros de page.

#### PshStepperComponent + PshStepComponent
Navigation wizard étape par étape avec validation.

#### PshDropdownComponent
Conteneur de déclencheur et contenu déroulant.

## Services

### ThemeService

Gestion des thèmes d'application et couleurs de marque personnalisées.

**Méthodes :**
- `setDarkTheme(isDark: boolean)` - Définir le mode thème
- `toggleTheme()` - Basculer entre clair et sombre
- `updateTheme(name: 'light' | 'dark')` - Mettre à jour le thème par nom
- `applyInsurerTheme()` - Appliquer les couleurs de marque personnalisées

**Signals calculés :**
- `themeName()` - Retourne le nom du thème actuel
- `isDarkTheme()` - Retourne un booléen pour le mode sombre
- `themeInfo()` - Retourne les informations complètes du thème

**Exemple :**
```typescript
import { Component, inject } from '@angular/core';
import { ThemeService } from 'ps-helix';

@Component({
  template: `
    <button (click)="themeService.toggleTheme()">
      Thème : {{ themeService.themeName() }}
    </button>
  `
})
export class ExempleComponent {
  themeService = inject(ThemeService);
}
```

### ToastService

Affichage de messages de notification temporaires.

**Méthodes :**
- `success(message: string, options?)` - Toast de succès
- `error(message: string, options?)` - Toast d'erreur
- `warning(message: string, options?)` - Toast d'avertissement
- `info(message: string, options?)` - Toast d'information

**Options :**
- `duration?: number` - Durée d'affichage en millisecondes (défaut: 3000)
- `position?: ToastPosition` - Position du toast

**Exemple :**
```typescript
import { Component, inject } from '@angular/core';
import { ToastService } from 'ps-helix';

@Component({
  template: `<button (click)="sauvegarder()">Sauvegarder</button>`
})
export class ExempleComponent {
  private toastService = inject(ToastService);

  sauvegarder() {
    this.toastService.success('Données sauvegardées avec succès !');
  }
}
```

### ScrollService

Service utilitaire pour la gestion du scroll.

**Méthodes :**
- `scrollToTop()` - Scroll vers le haut de page
- `scrollToElement(selector: string)` - Scroll vers un élément spécifique
- `disableScroll()` - Désactiver le scroll (utile pour les modales)
- `enableScroll()` - Réactiver le scroll

### TranslationService

Service wrapper pour la fonctionnalité ngx-translate.

**Méthodes :**
- `setLanguage(lang: string)` - Changer la langue de l'application
- `getTranslation(key: string)` - Obtenir une traduction
- `instant(key: string)` - Obtenir une traduction instantanée (synchrone)

## Système de thèmes

### Couleurs par défaut
- **Couleur primaire** : `#0F02C4` (Bleu profond)
- **Couleur secondaire** : `#7B3AEC` (Violet)

### Personnalisation des couleurs

Le système utilise un système d'injection token pour la personnalisation :

```typescript
// 1. Créer un service de contexte thème
import { Injectable, signal } from '@angular/core';
import { InsurerContextService } from 'ps-helix';

@Injectable({
  providedIn: 'root'
})
export class AppThemeContextService implements InsurerContextService {
  private primaryColorSignal = signal('#FF0000');
  private secondaryColorSignal = signal('#00AA00');

  primaryColor = this.primaryColorSignal.asReadonly();
  secondaryColor = this.secondaryColorSignal.asReadonly();
}

// 2. Fournir le service avec le token
import { INSURER_CONTEXT_SERVICE } from 'ps-helix';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: INSURER_CONTEXT_SERVICE,
      useExisting: AppThemeContextService
    }
  ]
};
```

### Variables CSS disponibles

Le système génère automatiquement des variables CSS :

**Couleur primaire :**
- `--primary-color`
- `--primary-color-light`
- `--primary-color-lighter`
- `--primary-color-dark`
- `--primary-color-darker`
- `--primary-color-text`
- `--primary-color-rgb`

**Couleur secondaire :**
- `--secondary-color`
- `--secondary-color-light`
- `--secondary-color-lighter`
- `--secondary-color-dark`
- `--secondary-color-darker`
- `--secondary-color-text`
- `--secondary-color-rgb`

Pour plus de détails, consultez [THEME.md](./projects/ps-helix/THEME.md)

## Internationalisation

### Configuration

Le système utilise ngx-translate pour l'internationalisation :

```typescript
// main.ts
import { TranslateModule } from '@ngx-translate/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    ...TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }).providers || []
  ]
});
```

### Utilisation

```typescript
import { Component, inject } from '@angular/core';
import { TranslationService } from 'ps-helix';

@Component({
  template: `
    <select (change)="changerLangue($event)">
      <option value="fr">Français</option>
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  `
})
export class SelecteurLangueComponent {
  private translationService = inject(TranslationService);

  changerLangue(event: Event) {
    const langue = (event.target as HTMLSelectElement).value;
    this.translationService.setLanguage(langue);
  }
}
```

### Langues supportées dans la démo
- Français (fr)
- Anglais (en)
- Espagnol (es)
- Allemand (de)

## Scripts disponibles

### Développement

**Avec pnpm (recommandé) :**
```bash
pnpm run dev        # Lancer l'application de démonstration
pnpm run build      # Construire l'application de démonstration
pnpm test           # Lancer les tests
```

**Avec npm :**
```bash
npm run dev         # Lancer l'application de démonstration
npm run build       # Construire l'application de démonstration
npm test            # Lancer les tests
```

### Bibliothèque

**Avec pnpm (recommandé) :**
```bash
pnpm run build:lib    # Construire la bibliothèque
pnpm run watch:lib    # Mode watch (reconstruction auto)
pnpm run publish:lib  # Publier sur npm
```

**Avec npm :**
```bash
npm run build:lib     # Construire la bibliothèque
npm run watch:lib     # Mode watch (reconstruction auto)
npm run publish:lib   # Publier sur npm
```

## Documentation

### Documentation de la bibliothèque
- **README principal** : [projects/ps-helix/README.md](./projects/ps-helix/README.md)
- **Guide des thèmes** : [projects/ps-helix/THEME.md](./projects/ps-helix/THEME.md)

### Documentation des composants
Chaque composant possède sa propre documentation dans son dossier :
- Fichiers `.md` dans `projects/ps-helix/src/lib/components/[composant]/`

### Application de démonstration
L'application de démonstration est la meilleure source d'exemples :
- Exemples interactifs pour chaque composant
- Code source complet dans `src/app/demo/pages/`
- Snippets de code copiables
- Documentation visuelle

### Ressources externes
- **Icônes Phosphor** : [https://phosphoricons.com/](https://phosphoricons.com/)
- **Documentation Angular** : [https://angular.dev/](https://angular.dev/)
- **Documentation TypeScript** : [https://www.typescriptlang.org/](https://www.typescriptlang.org/)
- **ngx-translate** : [https://github.com/ngx-translate/core](https://github.com/ngx-translate/core)

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le dépôt
2. Créez une branche feature : `git checkout -b feature/ma-feature`
3. Committez vos changements : `git commit -am 'Ajout nouvelle feature'`
4. Poussez vers la branche : `git push origin feature/ma-feature`
5. Soumettez une pull request

### Guidelines de développement

- Suivre le guide de style Angular
- Utiliser TypeScript en mode strict
- Écrire des tests pour les nouveaux composants
- Documenter toutes les APIs publiques
- Assurer la conformité accessibilité (WCAG 2.1 AA)
- Garder les composants petits et focalisés
- Utiliser les signals pour l'état réactif

## Support navigateurs

Le design system supporte :

- **Chrome** : 2 dernières versions
- **Firefox** : 2 dernières versions
- **Safari** : 2 dernières versions
- **Edge** : 2 dernières versions
- **Mobile** : iOS Safari 14+, Chrome Android dernière version

**Note** : Internet Explorer n'est pas supporté.

## Licence

MIT License

Copyright (c) 2025 PACK Solutions

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Version** : 2.1.1
**Construit avec** : Angular 20.0.0, TypeScript 5.8.0, Phosphor Icons 2.0.3
**Auteur** : Fabrice PEREZ | Product Designer chez PACK Solutions
**Dernière mise à jour** : Décembre 2025
