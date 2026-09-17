import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { PshTagComponent } from '../tag/tag.component';
import { StatCardLayout } from './stat-card.types';
import { PSH_COLORS, PshColor, PshSurfaceAppearance } from '../../types/semantic.types';
import { STAT_CARD_CONFIG } from './stat-card.tokens';

/**
 * Icon background per semantic colour. These were four hardcoded hex pairs that ignored
 * the theme entirely — a `danger` stat card rendered the same red in light and dark mode,
 * and none of them matched the brand. Derived from the colour tokens instead, with
 * color-mix supplying the lighter stop so no second token is needed.
 */
const ICON_GRADIENT_DEFAULTS: Record<PshColor, string> = Object.fromEntries(
  PSH_COLORS.map(color => [
    color,
    `linear-gradient(135deg, color-mix(in srgb, var(--psh-${color}-color) 65%, white), var(--psh-${color}-color))`,
  ]),
) as Record<PshColor, string>;
@Component({
  selector: 'psh-stat-card',
  imports: [PshTagComponent],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    '[class]': 'computedClasses()',
    '(click)': 'handleClick($event)',
    '(keydown)': 'handleKeydown($event)',
    '[attr.role]': 'interactive() ? "button" : "article"',
    '[attr.tabindex]': 'interactive() && !disabled() ? 0 : null',
    '[attr.aria-label]': 'computedAriaLabel()',
    '[attr.aria-disabled]': 'disabled() ? "true" : null',
    '[attr.aria-busy]': 'loading() ? "true" : null',
  },
})
export class PshStatCardComponent {
  private readonly config = inject(STAT_CARD_CONFIG);


  // Inputs principaux
  /** Valeur principale de la statistique (nombre ou texte formaté) */
  readonly value = input<string | number>();

  /** Description de la statistique */
  readonly description = input<string>();

  /** Nom de l'icône Phosphor (sans le préfixe 'ph-') */
  readonly icon = input<string>();

  // Inputs optionnels
  /** Variante du tag d'évolution (détermine la couleur) */
  readonly tagColor = input<PshColor>();

  /** Label du tag d'évolution (ex: '+12.6%', '-8.1%') */
  readonly tagLabel = input<string>();

  /** Couleur de fond personnalisée pour l'icône (CSS gradient ou couleur) */
  readonly iconBackground = input<string>();

  /** Variante visuelle de la carte de base */
  readonly appearance = input<PshSurfaceAppearance>(this.config.appearance ?? 'elevated');

  /** Carte cliquable avec feedback visuel */
  readonly interactive = input(this.config.interactive ?? false);

  /** Effet de survol */
  readonly hoverable = input(this.config.hoverable ?? false);

  /** État de chargement */
  readonly loading = input(false);

  /** État désactivé */
  readonly disabled = input(false);



  /** Label ARIA pour l'accessibilité */
  readonly ariaLabel = input<string>();

  /** Disposition de la carte: 'horizontal' (icône à gauche) ou 'vertical' (icône en haut) */
  readonly layout = input<StatCardLayout>(this.config.layout ?? 'horizontal');

  /** Active la direction row pour le card-body (icône et contenu côte à côte en flex-row) */
  readonly rowDirection = input(this.config.rowDirection ?? false);

  // Outputs
  /** Émis lors du clic sur la carte */
  clicked = output<MouseEvent | KeyboardEvent>();

  // Computed values
  private readonly computedValue = computed(() => this.value() ?? '');

  private readonly computedDescription = computed(() => this.description() ?? '');

  private readonly computedIcon = computed(() => this.icon() ?? '');

  private readonly computedTagVariant = computed(() => this.tagColor());

  private readonly computedTagLabel = computed(() => this.tagLabel());

  private readonly computedIconBackground = computed(() => {
    const customBg = this.iconBackground();
    if (customBg) return customBg;

    const variant = this.tagColor();
    return variant ? ICON_GRADIENT_DEFAULTS[variant] : null;
  });

  /** Style de l'icône avec couleur de fond personnalisée */
  readonly iconStyle = computed(() => {
    const background = this.computedIconBackground();
    return background ? { background } : null;
  });

  /** Vérifie si un tag doit être affiché */
  readonly hasTag = computed(() =>
    !!(this.computedTagVariant() && this.computedTagLabel())
  );

  /** Vérifie si une icône doit être affichée */
  readonly hasIcon = computed(() => !!this.computedIcon());

  readonly useRowDirection = computed(() => this.rowDirection());

  /** Label ARIA calculé */
  readonly computedAriaLabel = computed(() => {
    const customLabel = this.ariaLabel();
    if (customLabel) return customLabel;

    const value = this.computedValue();
    const desc = this.computedDescription();
    const tag = this.computedTagLabel();

    return tag
      ? `${desc}: ${value}, ${tag}`
      : `${desc}: ${value}`;
  });

  /** Classes CSS calculées */
  readonly computedClasses = computed(() => {
    const classes = ['psh-stat-card'];
    const layout = this.layout();

    classes.push(`psh-appearance-${this.appearance()}`);

    if (layout === 'vertical') {
      classes.push('psh-stat-card--vertical');
    } else {
      classes.push('psh-stat-card--horizontal');
    }

    if (this.useRowDirection()) {
      classes.push('psh-stat-card--row');
    }

    if (this.hoverable()) classes.push('psh-hoverable');
    if (this.interactive()) classes.push('psh-interactive');
    if (this.loading()) classes.push('psh-loading');
    if (this.disabled()) classes.push('psh-disabled');

    return classes.join(' ');
  });


  // Exposer les valeurs calculées pour le template
  protected get displayValue() { return this.computedValue(); }
  protected get displayDescription() { return this.computedDescription(); }
  protected get displayIcon() { return this.computedIcon(); }
  protected get displayTagVariant() { return this.computedTagVariant(); }
  protected get displayTagLabel() { return this.computedTagLabel(); }

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