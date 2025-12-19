import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  PLATFORM_ID,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CardVariant, CardColorVariant, CardDensity, CardActionsAlignment } from './card.types';

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
 * pleine largeur sur mobile (< 640px) grâce au CSS intégré.
 *
 * @example
 * <psh-card
 *   title="Mon titre"
 *   description="Ma description"
 *   variant="elevated"
 * >
 *   <p>Contenu principal</p>
 *   <div card-actions>
 *     <psh-button variant="primary">Action</psh-button>
 *   </div>
 * </psh-card>
 */
@Component({
  selector: 'psh-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class PshCardComponent implements OnInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private resizeListener?: () => void;
  private readonly isMobileSignal = signal(false);
  private readonly mobileBreakpoint = 640;

  // Model inputs - propriétés modifiables
  /** Variante visuelle de la carte (default, elevated, outlined) */
  variant = model<CardVariant>('default');

  /** Effet de survol activé (animation translateY) */
  hoverable = model(false);

  /** Carte cliquable (ajoute cursor pointer et gestion du focus) */
  interactive = model(false);

  // Regular inputs - propriétés en lecture seule
  /** Titre principal de la carte */
  title = input<string>('');

  /** Description/sous-titre optionnel */
  description = input<string>('');

  /** Variante de couleur pour cartes spéciales (info, success, warning, danger) */
  colorVariant = input<CardColorVariant>('default');

  /** Niveau de densité du spacing (compact, normal, spacious) */
  density = input<CardDensity>('normal');

  /** Afficher le divider entre header et body */
  showHeaderDivider = input<boolean>(true);

  /** Afficher le divider entre body et footer */
  showFooterDivider = input<boolean>(true);

  /** Afficher le divider entre footer et actions */
  showActionsDivider = input<boolean>(true);

  /** Alignement des actions dans la zone card-actions */
  actionsAlignment = input<CardActionsAlignment>('right');

  /** Classes CSS additionnelles */
  cssClass = input<string>('');

  /** Styles inline personnalisés */
  customStyle = input<Record<string, string>>({});

  /** État de chargement - affiche un skeleton */
  loading = input<boolean>(false);

  /** État désactivé - réduit l'opacité */
  disabled = input<boolean>(false);

  // Outputs
  /** Émis lors du clic sur la carte (si interactive) */
  clicked = output<MouseEvent | KeyboardEvent>();

  // Computed values
  /** Classes CSS calculées selon les propriétés */
  computedClasses = computed(() => {
    const classes = ['card'];
    classes.push(`variant-${this.variant()}`);
    classes.push(`color-${this.colorVariant()}`);
    classes.push(`density-${this.density()}`);

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

  /** Indique si le header doit être affiché */
  hasHeader = computed(() => {
    return !!(this.title() || this.description());
  });

  /** Classe d'alignement pour la zone d'actions */
  actionsAlignmentClass = computed(() => {
    return `actions-align-${this.actionsAlignment()}`;
  });

  /** Indique si l'écran est en mode mobile (< 640px) */
  isMobile = computed(() => this.isMobileSignal());

  ngOnInit(): void {
    this.setupResizeListener();
  }

  ngOnDestroy(): void {
    this.removeResizeListener();
  }

  /**
   * Vérifie si la taille de l'écran est mobile
   */
  private checkScreenSize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isMobileSignal.set(window.innerWidth < this.mobileBreakpoint);
    }
  }

  /**
   * Configure l'écouteur de redimensionnement pour détecter les changements de viewport
   */
  private setupResizeListener(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
      this.resizeListener = () => this.checkScreenSize();
      window.addEventListener('resize', this.resizeListener);
    }
  }

  /**
   * Supprime l'écouteur de redimensionnement
   */
  private removeResizeListener(): void {
    if (isPlatformBrowser(this.platformId) && this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
    }
  }

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
