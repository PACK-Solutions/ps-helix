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
import { StatCardData, StatTagVariant, StatCardLayout, StatCardVariant } from './stat-card.types';

const ICON_GRADIENT_DEFAULTS: Record<StatTagVariant, string> = {
  success: 'linear-gradient(135deg, #34D399, #059669)',
  danger: 'linear-gradient(135deg, #F87171, #DC2626)',
  warning: 'linear-gradient(135deg, #FBBF24, #D97706)',
  primary: 'linear-gradient(135deg, #60A5FA, #2563EB)'
};
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
  tagVariant = input<StatTagVariant>();

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

  // Inputs de compatibilité (deprecated)
  /**
   * @deprecated Utiliser les inputs individuels (value, description, icon, etc.)
   */
  data = input<StatCardData>();

  // Outputs
  /** Émis lors du clic sur la carte */
  clicked = output<MouseEvent | KeyboardEvent>();

  // Computed values
  /** Valeur calculée (priorité: input direct > data.value) */
  private computedValue = computed(() => {
    const directValue = this.value();
    const dataValue = this.data()?.value;
    return directValue ?? dataValue ?? '';
  });

  /** Description calculée (priorité: input direct > data.description) */
  private computedDescription = computed(() => {
    const directDesc = this.description();
    const dataDesc = this.data()?.description;
    return directDesc ?? dataDesc ?? '';
  });

  /** Icône calculée (priorité: input direct > data.icon) */
  private computedIcon = computed(() => {
    const directIcon = this.icon();
    const dataIcon = this.data()?.icon;
    return directIcon ?? dataIcon ?? '';
  });

  /** Variante de tag calculée */
  private computedTagVariant = computed(() => {
    const directVariant = this.tagVariant();
    const dataVariant = this.data()?.tagVariant;
    return directVariant ?? dataVariant;
  });

  /** Label de tag calculé */
  private computedTagLabel = computed(() => {
    const directLabel = this.tagLabel();
    const dataLabel = this.data()?.tagLabel;
    return directLabel ?? dataLabel;
  });

  /** Background d'icône calculé avec valeur par défaut intelligente */
  private computedIconBackground = computed(() => {
    const directBg = this.iconBackground();
    const dataBg = this.data()?.iconBackground;
    const customBg = directBg ?? dataBg;

    if (customBg) return customBg;

    const variant = this.computedTagVariant();
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

  /** RowDirection calculé (priorité: input direct > data.rowDirection) */
  useRowDirection = computed(() =>
    this.rowDirection() || this.data()?.rowDirection || false
  );

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