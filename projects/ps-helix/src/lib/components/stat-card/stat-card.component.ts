import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PshTagComponent } from '../tag/tag.component';
import { StatCardLayout, StatCardVariant } from './stat-card.types';
import { PshColor, PSH_COLORS } from '../../types/semantic.types';

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
  imports: [CommonModule, PshTagComponent],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PshStatCardComponent {

  // Inputs principaux
  /** Valeur principale de la statistique (nombre ou texte formaté) */
  value = input<string | number>();

  /** Description de la statistique */
  description = input<string>();

  /** Nom de l'icône Phosphor (sans le préfixe 'ph-') */
  icon = input<string>();

  // Inputs optionnels
  /** Variante du tag d'évolution (détermine la couleur) */
  tagColor = input<PshColor>();

  /** Label du tag d'évolution (ex: '+12.6%', '-8.1%') */
  tagLabel = input<string>();

  /** Couleur de fond personnalisée pour l'icône (CSS gradient ou couleur) */
  iconBackground = input<string>();

  /** Variante visuelle de la carte de base */
  variant = input<StatCardVariant>('elevated');

  /** Carte cliquable avec feedback visuel */
  interactive = input(false);

  /** Effet de survol */
  hoverable = input(false);

  /** État de chargement */
  loading = input(false);

  /** État désactivé */
  disabled = input(false);

  /** Classes CSS additionnelles */
  cssClass = input<string>('');

  /** Styles inline personnalisés */
  customStyle = input<Record<string, string>>({});

  /** Label ARIA pour l'accessibilité */
  ariaLabel = input<string>();

  /** Disposition de la carte: 'horizontal' (icône à gauche) ou 'vertical' (icône en haut) */
  layout = input<StatCardLayout>('horizontal');

  /** Active la direction row pour le card-body (icône et contenu côte à côte en flex-row) */
  rowDirection = input(false);

  // Outputs
  /** Émis lors du clic sur la carte */
  clicked = output<MouseEvent | KeyboardEvent>();

  // Computed values
  private computedValue = computed(() => this.value() ?? '');

  private computedDescription = computed(() => this.description() ?? '');

  private computedIcon = computed(() => this.icon() ?? '');

  private computedTagVariant = computed(() => this.tagColor());

  private computedTagLabel = computed(() => this.tagLabel());

  private computedIconBackground = computed(() => {
    const customBg = this.iconBackground();
    if (customBg) return customBg;

    const variant = this.tagColor();
    return variant ? ICON_GRADIENT_DEFAULTS[variant] : null;
  });

  /** Style de l'icône avec couleur de fond personnalisée */
  iconStyle = computed(() => {
    const background = this.computedIconBackground();
    return background ? { background } : null;
  });

  /** Vérifie si un tag doit être affiché */
  hasTag = computed(() =>
    !!(this.computedTagVariant() && this.computedTagLabel())
  );

  /** Vérifie si une icône doit être affichée */
  hasIcon = computed(() => !!this.computedIcon());

  useRowDirection = computed(() => this.rowDirection());

  /** Label ARIA calculé */
  computedAriaLabel = computed(() => {
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
  computedClasses = computed(() => {
    const classes = ['stat-card'];
    const layout = this.layout();

    classes.push(`variant-${this.variant()}`);

    if (layout === 'vertical') {
      classes.push('stat-card--vertical');
    } else {
      classes.push('stat-card--horizontal');
    }

    if (this.useRowDirection()) {
      classes.push('stat-card--row');
    }

    if (this.hoverable()) classes.push('hoverable');
    if (this.interactive()) classes.push('interactive');
    if (this.loading()) classes.push('loading');
    if (this.disabled()) classes.push('disabled');
    if (this.cssClass()) classes.push(this.cssClass());

    return classes.join(' ');
  });

  /** Styles calculés */
  computedStyles = computed(() => {
    return { ...this.customStyle() };
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