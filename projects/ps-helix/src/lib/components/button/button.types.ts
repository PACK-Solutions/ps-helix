/**
 * Apparences disponibles pour le bouton.
 *
 * Contrat du design system : l'apparence decrit uniquement la facon dont
 * le bouton remplit l'espace (fond plein, contour, plat). L'arrondi n'est
 * pas expose par composant : il est gere globalement via le token
 * `--border-radius` du design system.
 */
export type ButtonAppearance = 'filled' | 'outline' | 'text';

/**
 * Variantes semantiques disponibles pour le bouton (couleur d'intention).
 */
export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

/**
 * Tailles disponibles pour le bouton
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Positions possibles de l'icône
 */
export type ButtonIconPosition = 'left' | 'right' | 'only';
