import { PshColor, PshSurfaceAppearance } from '../../types/semantic.types';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import { PshViewportService } from '../../a11y/viewport.service';
import { DOCUMENT } from '@angular/common';
import { CardDensity, CardActionsAlignment } from './card.types';
import { CARD_CONFIG } from './card.tokens';

/**
 * Composant carte métier - conteneur structuré pour contenu professionnel
 *
 * Ce composant fournit une structure de carte métier avec :
 * - Header enrichi avec titre, description et slots pour icônes/badges
 * - Body avec spacing généreux et bien défini
 * - Footer optionnel pour métadonnées
 * - Zone d'actions avec alignement configurable
 * - Support de différentes densités et variantes de couleur
 * - Dividers automatiques entre les sections
 *
 * Les boutons placés dans le slot card-actions deviennent automatiquement
 * pleine largeur sur mobile (< 640px) grâce à une directive automatique.
 *
 * @example
 * <psh-card
 *   title="Mon titre"
 *   description="Ma description"
 *   appearance="elevated"
 * >
 *   <p>Contenu principal</p>
 *   <div psh-card-actions>
 *     <psh-button color="primary">Action</psh-button>
 *   </div>
 * </psh-card>
 */
@Component({
  selector: 'psh-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  // Rooted on the host, not on a wrapper `<div>`. The wrapper is why `cssClass` had to
  // exist: a consumer's `<psh-card class="…">` landed on the host while every style lived
  // one level down, out of reach. With the card *being* the host, the native `class` and
  // `style` attributes do the job and the passthrough inputs are gone.
  host: {
    '[class]': 'computedClasses()',
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeydown($event)',
    role: 'article',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.tabindex]': 'interactive() && !disabled() ? 0 : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
})
export class PshCardComponent {
  private readonly config = inject(CARD_CONFIG);

  private platformId = inject(PLATFORM_ID);
  private readonly document = inject(DOCUMENT);

  // Model inputs - propriétés modifiables
  /** Variante visuelle de la carte (default, elevated, outlined) */
  // input(), not model(): the card never writes its own appearance back, so a model()
  // only added a `variantChange` output that could never fire.
  readonly appearance = input<PshSurfaceAppearance>(this.config.appearance ?? 'flat');

  /** Effet de survol activé (animation translateY) */
  readonly hoverable = input(this.config.hoverable ?? false);

  /** Carte cliquable (ajoute cursor pointer et gestion du focus) */
  readonly interactive = input(this.config.interactive ?? false);

  // Regular inputs - propriétés en lecture seule
  /** Titre principal de la carte */
  readonly title = input<string>('');

  /** Description/sous-titre optionnel */
  readonly description = input<string>('');

  /** Couleur sémantique de la carte. `neutral` = aucune emphase (l'ancien `flat`). */
  readonly color = input<PshColor>(this.config.color ?? 'neutral');

  /** Niveau de densité du spacing (compact, normal, spacious) */
  readonly density = input<CardDensity>(this.config.density ?? 'normal');

  /** Afficher le divider entre header et body */
  readonly showHeaderDivider = input<boolean>(this.config.showHeaderDivider ?? true);

  /** Afficher le divider entre body et footer */
  readonly showFooterDivider = input<boolean>(this.config.showFooterDivider ?? true);

  /** Afficher le divider entre footer et actions */
  readonly showActionsDivider = input<boolean>(this.config.showActionsDivider ?? true);

  /** Alignement des actions dans la zone card-actions */
  readonly actionsAlignment = input<CardActionsAlignment>(this.config.actionsAlignment ?? 'right');

  /** Activer/désactiver le padding du body */
  readonly bodyPadding = input<boolean>(this.config.bodyPadding ?? true);

  /** État de chargement - affiche un skeleton */
  readonly loading = input<boolean>(false);

  /** État désactivé - réduit l'opacité */
  readonly disabled = input<boolean>(false);

  /**
   * Name of the article, for a card with no visible `title`. A card that has one is already
   * named by it, so this stays unset by default rather than competing with it.
   */
  readonly ariaLabel = input<string>();

  // Outputs
  /** Émis lors du clic sur la carte (si interactive) */
  clicked = output<MouseEvent | KeyboardEvent>();

  // Computed values
  /** Classes CSS calculées selon les propriétés */
  readonly computedClasses = computed(() => {
    const classes = ['psh-card'];
    classes.push(`psh-appearance-${this.appearance()}`);
    classes.push(`psh-color-${this.color()}`);
    classes.push(`psh-density-${this.density()}`);

    if (this.hoverable()) classes.push('psh-hoverable');
    if (this.interactive()) classes.push('psh-interactive');
    if (this.loading()) classes.push('psh-loading');
    if (this.disabled()) classes.push('psh-disabled');

    return classes.join(' ');
  });

  /** Indique si le header doit être affiché */
  readonly hasHeader = computed(() => {
    return !!(this.title() || this.description());
  });

  /** Classe d'alignement pour la zone d'actions */
  readonly actionsAlignmentClass = computed(() => {
    return `psh-actions-align-${this.actionsAlignment()}`;
  });

  readonly actionsClasses = computed(() => {
    const classes = [this.actionsAlignmentClass()];
    if (this.isMobile()) {
      classes.push('psh-mobile-full-width-buttons');
    }
    return classes.join(' ');
  });

  /**
   * Shared with every other card on the page — one media query, not one `ResizeObserver` per
   * instance on `document.documentElement`.
   */
  protected readonly isMobile = inject(PshViewportService).below('sm');

  /**
   * Gère le clic sur la carte
   * Émet l'événement clicked seulement si la carte est interactive
   * et non désactivée
   */
  handleClick(event: MouseEvent): void {
    if (this.interactive() && !this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }

  /**
   * Gère la navigation au clavier (Enter et Space)
   * Permet d'activer la carte au clavier pour l'accessibilité
   */
  handleKeydown(event: KeyboardEvent): void {
    if (this.interactive() && !this.disabled() && !this.loading()) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        this.clicked.emit(event);
      }
    }
  }
}
