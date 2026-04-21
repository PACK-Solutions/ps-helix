import { NavigationSection } from '../types';

export const NAVIGATION_SECTIONS: NavigationSection[] = [
  {
    title: 'NAVIGATION.SECTIONS.FUNDAMENTALS',
    items: [
      {
        path: '/demo/introduction',
        label: 'NAVIGATION.INTRODUCTION',
        keywords: ['getting started', 'demarrage', 'debut', 'start', 'overview', 'apercu', 'guide', 'documentation', 'docs']
      },
      {
        path: '/demo/design-principles',
        label: 'NAVIGATION.DESIGN_PRINCIPLES',
        keywords: ['principes', 'principles', 'guidelines', 'regles', 'rules', 'best practices', 'bonnes pratiques', 'ux', 'ui', 'design system']
      },
      {
        path: '/demo/tone-and-voice',
        label: 'NAVIGATION.TONE_AND_VOICE',
        keywords: ['ton', 'voix', 'writing', 'ecriture', 'redaction', 'style', 'communication', 'langage', 'language', 'content', 'contenu']
      },
      {
        path: '/demo/i18n',
        label: 'NAVIGATION.I18N',
        keywords: ['traduction', 'translation', 'langue', 'language', 'internationalisation', 'multilingual', 'multilingue', 'localization', 'localisation', 'translate']
      },
      {
        path: '/demo/terminology',
        label: 'NAVIGATION.TERMINOLOGY',
        keywords: ['termes', 'terms', 'glossaire', 'glossary', 'vocabulaire', 'vocabulary', 'definitions', 'mots', 'words', 'lexique']
      },
    ],
  },
  {
    title: 'NAVIGATION.SECTIONS.STYLE',
    items: [
      {
        path: '/demo/typography',
        label: 'NAVIGATION.TYPOGRAPHY',
        keywords: ['police', 'font', 'texte', 'text', 'heading', 'titre', 'paragraph', 'paragraphe', 'taille', 'size', 'weight', 'graisse', 'lettres', 'letters']
      },
      {
        path: '/demo/colors',
        label: 'NAVIGATION.COLORS',
        keywords: ['couleur', 'palette', 'theme', 'teinte', 'hue', 'shade', 'nuance', 'background', 'fond', 'primary', 'secondary', 'accent', 'brand']
      },
      {
        path: '/demo/grid',
        label: 'NAVIGATION.GRID_SYSTEM',
        keywords: ['grille', 'layout', 'mise en page', 'colonnes', 'columns', 'responsive', 'flexbox', 'spacing', 'espacement', 'breakpoints', 'container']
      },
      {
        path: '/demo/icons',
        label: 'NAVIGATION.ICONS',
        keywords: ['icone', 'pictogramme', 'symbol', 'symbole', 'image', 'phosphor', 'svg', 'glyph', 'glyphe', 'visual', 'visuel']
      },
    ],
  },
  {
    title: 'NAVIGATION.SECTIONS.COMPONENTS',
    items: [
      {
        path: '/demo/alerts',
        label: 'NAVIGATION.ALERTS',
        keywords: ['notification', 'message', 'warning', 'avertissement', 'error', 'erreur', 'success', 'succes', 'info', 'danger', 'banner', 'banniere', 'feedback']
      },
      {
        path: '/demo/avatar',
        label: 'NAVIGATION.AVATAR',
        keywords: ['photo', 'image', 'profil', 'profile', 'user', 'utilisateur', 'picture', 'initiales', 'initials', 'portrait', 'icon']
      },
      {
        path: '/demo/badges',
        label: 'NAVIGATION.BADGES',
        keywords: ['etiquette', 'label', 'tag', 'compteur', 'counter', 'notification', 'status', 'statut', 'indicateur', 'indicator', 'chip', 'pill']
      },
      {
        path: '/demo/buttons',
        label: 'NAVIGATION.BUTTONS',
        keywords: ['bouton', 'click', 'clic', 'submit', 'soumettre', 'action', 'cta', 'primary', 'secondary', 'principal', 'secondaire', 'btn', 'press', 'appuyer']
      },
      {
        path: '/demo/cards',
        label: 'NAVIGATION.CARDS',
        keywords: ['carte', 'box', 'container', 'conteneur', 'panel', 'panneau', 'tile', 'tuile', 'block', 'bloc', 'encadre', 'frame']
      },
      {
        path: '/demo/horizontal-cards',
        label: 'NAVIGATION.HORIZONTAL_CARDS',
        keywords: ['carte horizontale', 'horizontal card', 'row card', 'carte ligne', 'media card', 'carte media', 'landscape', 'paysage']
      },
      {
        path: '/demo/info-cards',
        label: 'NAVIGATION.INFO_CARDS',
        keywords: ['carte info', 'info card', 'information', 'details', 'summary', 'resume', 'overview', 'apercu', 'highlight']
      },
      {
        path: '/demo/stat-cards',
        label: 'NAVIGATION.STAT_CARDS',
        keywords: ['statistiques', 'statistics', 'metrics', 'metriques', 'kpi', 'numbers', 'chiffres', 'dashboard', 'tableau de bord', 'data', 'donnees']
      },
      {
        path: '/demo/checkboxes',
        label: 'NAVIGATION.CHECKBOXES',
        keywords: ['case a cocher', 'check', 'coche', 'toggle', 'boolean', 'multiple', 'selection', 'tick', 'cocher', 'decocher', 'form', 'formulaire']
      },
      {
        path: '/demo/radios',
        label: 'NAVIGATION.RADIOS',
        keywords: ['bouton radio', 'option', 'choice', 'choix', 'single', 'unique', 'selection', 'group', 'groupe', 'form', 'formulaire', 'exclusive']
      },
      {
        path: '/demo/collapse',
        label: 'NAVIGATION.COLLAPSE',
        keywords: ['accordeon', 'accordion', 'expand', 'expandable', 'plier', 'deplier', 'toggle', 'show', 'hide', 'afficher', 'masquer', 'collapsible', 'fold']
      },
      {
        path: '/demo/dropdowns',
        label: 'NAVIGATION.DROPDOWNS',
        keywords: ['menu', 'liste deroulante', 'select', 'choix', 'options', 'popup', 'popover', 'overlay', 'actions', 'contextuel', 'contextual']
      },
      {
        path: '/demo/inputs',
        label: 'NAVIGATION.INPUTS',
        keywords: ['champ', 'field', 'text', 'texte', 'saisie', 'form', 'formulaire', 'input', 'textarea', 'entree', 'entry', 'type', 'ecrire', 'write']
      },
      {
        path: '/demo/menu',
        label: 'NAVIGATION.MENU',
        keywords: ['navigation', 'nav', 'liens', 'links', 'sidebar', 'header', 'footer', 'navbar', 'barre', 'bar', 'items', 'elements']
      },
      {
        path: '/demo/modals',
        label: 'NAVIGATION.MODALS',
        keywords: ['popup', 'dialog', 'dialogue', 'overlay', 'fenetre', 'window', 'modale', 'lightbox', 'confirm', 'confirmation', 'alert', 'prompt']
      },
      {
        path: '/demo/pagination',
        label: 'NAVIGATION.PAGINATION',
        keywords: ['page', 'pages', 'navigation', 'precedent', 'suivant', 'next', 'previous', 'paging', 'numbers', 'numeros', 'list', 'liste']
      },
      {
        path: '/demo/progressbar',
        label: 'NAVIGATION.PROGRESSBAR',
        keywords: ['barre de progression', 'progress', 'avancement', 'loading', 'pourcentage', 'percentage', 'completion', 'status', 'statut', 'indicator']
      },
      {
        path: '/demo/select',
        label: 'NAVIGATION.SELECT',
        keywords: ['liste deroulante', 'dropdown', 'choix', 'selection', 'options', 'picker', 'selecteur', 'combobox', 'form', 'formulaire', 'choose']
      },
      {
        path: '/demo/sidebar',
        label: 'NAVIGATION.SIDEBAR',
        keywords: ['menu lateral', 'navigation', 'drawer', 'panneau', 'panel', 'aside', 'lateral', 'side', 'cote', 'nav', 'left', 'gauche']
      },
      {
        path: '/demo/spinloader',
        label: 'NAVIGATION.SPINLOADER',
        keywords: ['loader', 'loading', 'chargement', 'spinner', 'attente', 'wait', 'busy', 'occupe', 'processing', 'traitement', 'animation', 'rotating']
      },
      {
        path: '/demo/stepper',
        label: 'NAVIGATION.STEPPER',
        keywords: ['etapes', 'steps', 'wizard', 'assistant', 'progression', 'workflow', 'process', 'processus', 'sequence', 'guide', 'multi-step', 'form']
      },
      {
        path: '/demo/switches',
        label: 'NAVIGATION.SWITCHES',
        keywords: ['interrupteur', 'toggle', 'on/off', 'activer', 'desactiver', 'enable', 'disable', 'boolean', 'switch', 'flip', 'slide', 'binary']
      },
      {
        path: '/demo/tab-bar',
        label: 'NAVIGATION.TAB_BAR',
        keywords: ['barre onglets', 'tab bar', 'navigation', 'mobile', 'bottom', 'bas', 'footer', 'nav', 'menu', 'app bar', 'toolbar']
      },
      {
        path: '/demo/tabs',
        label: 'NAVIGATION.TABS',
        keywords: ['onglet', 'tab', 'navigation', 'nav', 'panel', 'panneau', 'section', 'content', 'contenu', 'switch', 'view', 'vue']
      },
      {
        path: '/demo/tables',
        label: 'NAVIGATION.TABLES',
        keywords: ['tableau', 'data', 'donnees', 'grid', 'grille', 'liste', 'list', 'rows', 'lignes', 'columns', 'colonnes', 'cells', 'cellules', 'datagrid']
      },
      {
        path: '/demo/tags',
        label: 'NAVIGATION.TAGS',
        keywords: ['etiquette', 'label', 'badge', 'chip', 'categorie', 'category', 'keyword', 'mot-cle', 'filter', 'filtre', 'removable', 'supprimable']
      },
      {
        path: '/demo/toasts',
        label: 'NAVIGATION.TOASTS',
        keywords: ['notification', 'snackbar', 'message', 'popup', 'alert', 'feedback', 'flash', 'temporary', 'temporaire', 'info', 'success', 'error']
      },
      {
        path: '/demo/tooltips',
        label: 'NAVIGATION.TOOLTIPS',
        keywords: ['infobulle', 'hint', 'aide', 'help', 'hover', 'survol', 'popover', 'info', 'description', 'explanation', 'explication', 'tip']
      },
    ],
  },
];
