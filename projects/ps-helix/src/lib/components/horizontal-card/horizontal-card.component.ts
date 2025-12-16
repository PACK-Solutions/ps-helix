import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorizontalCardVariant } from './horizontal-card.types';

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
 * <psh-horizontal-card variant="elevated" sideWidth="var(--size-48)">
 *   <div horizontal-side>
 *     <img src="image.jpg" alt="Product">
 *   </div>
 *   <h3 horizontal-header>Titre du produit</h3>
 *   <p>Description du produit</p>
 *   <div horizontal-actions>
 *     <psh-button>Voir</psh-button>
 *   </div>
 * </psh-horizontal-card>
 */
@Component({
  selector: 'psh-horizontal-card',
  imports: [CommonModule],
  templateUrl: './horizontal-card.component.html',
  styleUrls: ['./horizontal-card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PshHorizontalCardComponent {

  /** Variante de la carte de base */
  variant = input<HorizontalCardVariant>('elevated');

  /** Carte cliquable */
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

  /** Largeur du contenu latéral (utiliser les tokens de sizing comme var(--size-48)) */
  sideWidth = input<string>('var(--size-48)');

  /** Gap entre le contenu latéral et principal */
  gap = input<string>('var(--spacing-md)');

  /** Padding du contenu latéral */
  sidePadding = input<string>('0');

  /** Padding du contenu principal */
  contentPadding = input<string>('var(--spacing-md)');

  /** Hauteur du contenu latéral sur mobile (utiliser les tokens de sizing) */
  mobileHeight = input<string>('var(--size-48)');

  /** Émis lors du clic sur la carte */
  clicked = output<MouseEvent | KeyboardEvent>();

  /** Classes CSS calculées selon les propriétés */
  computedClasses = computed(() => {
    const classes = ['horizontal-card'];
    classes.push(`variant-${this.variant()}`);

    if (this.hoverable()) classes.push('hoverable');
    if (this.interactive()) classes.push('interactive');
    if (this.loading()) classes.push('loading');
    if (this.disabled()) classes.push('disabled');
    if (this.cssClass()) classes.push(this.cssClass());

    return classes.join(' ');
  });

  /** Styles calculés */
  computedStyles = computed(() => {
    return {
      '--horizontal-side-width': this.sideWidth(),
      '--horizontal-gap': this.gap(),
      '--horizontal-side-padding': this.sidePadding(),
      '--horizontal-content-padding': this.contentPadding(),
      '--horizontal-mobile-height': this.mobileHeight(),
      ...this.customStyle()
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