import { PshComponentDefaults } from '../provide-helix';

/**
 * Every string the library ships, in French.
 *
 * The library's own defaults are English — it is published on npm, and its code, its
 * documentation and its commits are English too. Before 7.0.0 they were neither: twenty-five
 * strings were French and thirty English, decided component by component, so a `psh-modal`
 * said "Close" above a `psh-select` that said "Sélectionner une option".
 *
 *     bootstrapApplication(App, {
 *       providers: [provideHelix({ components: PSH_FRENCH_DEFAULTS })],
 *     });
 *
 * Merge it with your own overrides rather than replacing it:
 *
 *     provideHelix({
 *       components: {
 *         ...PSH_FRENCH_DEFAULTS,
 *         modal: { ...PSH_FRENCH_DEFAULTS.modal, confirmLabel: 'Envoyer' },
 *       },
 *     })
 *
 * `npm run verify:i18n-preset` fails when a translatable default is added to a component and
 * not to this file — without it the preset would quietly fall behind, and the symptom would be
 * one English label in an otherwise French page.
 */
export const PSH_FRENCH_DEFAULTS: PshComponentDefaults = {
  alert: {
    labels: { dismiss: "Fermer l'alerte" },
  },
  avatar: {
    alt: 'Photo de profil',
  },
  button: {
    loadingText: 'Chargement…',
    disabledText: "Cette action n'est pas disponible",
  },
  collapse: {
    defaultHeaderText: 'Section pliable',
  },
  dropdown: {
    label: 'Menu déroulant',
  },
  infoCard: {
    copyButtonLabel: 'Copier',
    copyFeedbackText: 'Copié',
    emptyStateMessage: 'Aucune information disponible',
    notProvidedText: 'Non renseigné',
  },
  input: {
    showPasswordLabel: 'Afficher le mot de passe',
    hidePasswordLabel: 'Masquer le mot de passe',
  },
  modal: {
    dismissLabel: 'Fermer',
    confirmLabel: 'Valider',
    cancelLabel: 'Annuler',
  },
  pagination: {
    firstLabel: 'Première page',
    previousLabel: 'Page précédente',
    nextLabel: 'Page suivante',
    lastLabel: 'Dernière page',
    pageLabel: 'Page',
    ofLabel: 'sur',
    itemsLabel: 'éléments',
    itemsPerPageLabel: 'Éléments par page',
    ariaLabel: 'Pagination',
  },
  select: {
    placeholder: 'Sélectionner une option',
    multiplePlaceholder: 'Sélectionner des options',
    noResultsText: 'Aucun résultat',
    clearLabel: 'Effacer la sélection',
    searchPlaceholder: 'Rechercher…',
  },
  sidebar: {
    ariaLabel: 'Navigation latérale',
  },
  spinloader: {
    ariaLabel: 'Chargement en cours',
  },
  stateFlowIndicator: {
    ariaLabel: 'Indicateur de progression',
    ariaLabels: {
      step: 'Étape',
      completed: 'Étape complétée',
      active: 'Étape active',
      incomplete: 'Étape incomplète',
      disabled: 'Étape désactivée',
      warning: 'Étape avec avertissement',
      error: 'Étape en erreur',
    },
  },
  stepper: {
    ariaLabel: 'Navigation par étapes',
    ariaLabels: {
      step: 'Étape',
      completed: 'Étape complétée',
      active: 'Étape active',
      incomplete: 'Étape incomplète',
      disabled: 'Étape désactivée',
    },
  },
  tabBar: {
    ariaLabel: 'Navigation par onglets',
  },
  tabs: {
    ariaLabel: 'Navigation par onglets',
  },
  table: {
    emptyMessage: 'Aucune donnée disponible',
    noResultsMessage: 'Aucun résultat',
    globalSearchPlaceholder: 'Rechercher dans toutes les colonnes…',
    expandColumnLabel: 'Détail',
    expandRowLabel: 'Afficher le détail',
    collapseRowLabel: 'Masquer le détail',
  },
  tag: {
    closeLabel: 'Supprimer le tag',
  },
  textarea: {
    characterCountSuffix: 'caractères',
  },
  toast: {
    ariaLabel: 'Notifications',
  },
};
