export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';
export type TextareaSize = 'small' | 'medium' | 'large';
export type TextareaVariant = 'outlined' | 'filled';

export const TEXTAREA_LABELS = {
  charactersUsed: 'characters used',
  charactersRemaining: 'characters remaining',
  maxLengthReached: 'Maximum length reached'
} as const;
