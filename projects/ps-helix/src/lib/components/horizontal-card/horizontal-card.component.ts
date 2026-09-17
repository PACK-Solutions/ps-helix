import { PshSurfaceAppearance } from '../../types/semantic.types';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { HORIZONTAL_CARD_CONFIG } from './horizontal-card.tokens';

/**
 * Composant carte horizontale autonome
 *
 * Composant complètement indépendant pour créer une mise en page
 * horizontale avec contenu latéral.
 *
 * Ce composant est particulièrement adapté pour :
 * - Cartes produits avec image latérale
 * - Profils utilisateurs avec avatar
 * - Articles avec illustration
 *
 * Le layout bascule automatiquement en vertical sur mobile.
 *
 * @example
 * <psh-horizontal-card appearance="elevated" sideWidth="var(--psh-size-48)">
 *   <div psh-horizontal-card-side>
 *     <img src="image.jpg" alt="Product">
 *   </div>
 *   <h3 psh-horizontal-card-header>Titre du produit</h3>
 *   <p>Description du produit</p>
 *   <div psh-horizontal-card-actions>
 *     <psh-button>Voir</psh-button>
 *   </div>
 * </psh-horizontal-card>
 */
@Component({
  selector: 'psh-horizontal-card',
  templateUrl: './horizontal-card.component.html',
  styleUrls: ['./horizontal-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClasses()',
    '[style]': 'computedStyles()',
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeydown($event)',
    role: 'article',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.tabindex]': 'interactive() && !disabled() ? 0 : null',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
})
export class PshHorizontalCardComponent {
  private readonly config = inject(HORIZONTAL_CARD_CONFIG);


  /** Variante de la carte de base */
  readonly appearance = input<PshSurfaceAppearance>(this.config.appearance ?? 'elevated');

  /** Carte cliquable */
  readonly interactive = input(this.config.interactive ?? false);

  /** Effet de survol */
  readonly hoverable = input(this.config.hoverable ?? false);

  /** État de chargement */
  readonly loading = input(false);

  /** État désactivé */
  readonly disabled = input(false);

  /** Name of the article, for a card with no visible title. */
  readonly ariaLabel = input<string>();



  /** Largeur du contenu latéral (utiliser les tokens de sizing comme var(--psh-size-48)) */
  readonly sideWidth = input<string>(this.config.sideWidth ?? 'var(--psh-size-48)');

  /** Gap entre le contenu latéral et principal */
  readonly gap = input<string>(this.config.gap ?? 'var(--psh-spacing-md)');

  /** Padding du contenu latéral */
  readonly sidePadding = input<string>(this.config.sidePadding ?? '0');

  /** Padding du contenu principal */
  readonly contentPadding = input<string>(this.config.contentPadding ?? 'var(--psh-spacing-md)');

  /** Hauteur du contenu latéral sur mobile (utiliser les tokens de sizing) */
  readonly mobileHeight = input<string>(this.config.mobileHeight ?? 'var(--psh-size-48)');

  /** Émis lors du clic sur la carte */
  clicked = output<MouseEvent | KeyboardEvent>();

  /** Classes CSS calculées selon les propriétés */
  readonly computedClasses = computed(() => {
    const classes = ['psh-horizontal-card'];
    classes.push(`psh-appearance-${this.appearance()}`);

    if (this.hoverable()) classes.push('psh-hoverable');
    if (this.interactive()) classes.push('psh-interactive');
    if (this.loading()) classes.push('psh-loading');
    if (this.disabled()) classes.push('psh-disabled');

    return classes.join(' ');
  });

  /**
   * The geometry inputs, as custom properties on the host.
   *
   * Unlike the other cards this is not a `customStyle` passthrough in disguise: these five
   * properties are how `sideWidth`, `gap` and friends reach the stylesheet. The consumer's own
   * `style` attribute merges with them on the host, so nothing was lost by dropping the
   * passthrough.
   */
  readonly computedStyles = computed(() => {
    return {
      '--psh-horizontal-side-width': this.sideWidth(),
      '--psh-horizontal-gap': this.gap(),
      '--psh-horizontal-side-padding': this.sidePadding(),
      '--psh-horizontal-content-padding': this.contentPadding(),
      '--psh-horizontal-mobile-height': this.mobileHeight(),
    };
  });

  /**
   * Gère le clic sur la carte
   */
  handleClick(event: MouseEvent): void {
    if (this.interactive() && !this.disabled() && !this.loading()) {
      this.clicked.emit(event);
    }
  }

  /**
   * Gère la navigation au clavier
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