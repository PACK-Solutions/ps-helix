export type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

export type TooltipVariant = 'light' | 'dark';

export interface TooltipConfig {
  variant: TooltipVariant;
  position: TooltipPosition;
  showDelay: number;
  hideDelay: number;
  maxWidth: number;
  autoFlip: boolean;
}
