export type TextareaVariant = 'outlined' | 'filled';
export type TextareaSize = 'small' | 'medium' | 'large';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaConfig {
  variant: TextareaVariant;
  size: TextareaSize;
  resize: TextareaResize;
  disabled: boolean;
  required: boolean;
  readonly: boolean;
  fullWidth: boolean;
  showLabel: boolean;
  showCharacterCount: boolean;
  autoSize: boolean;
  rows: number;
  maxLength?: number;
  label: string;
  placeholder: string;
  hint: string | null | undefined;
  error: string | null | undefined;
  success: string | null | undefined;
  ariaLabel: string | null;
}

export const TEXTAREA_LABELS = {
  characterCountSuffix: 'caractères',
  characterCountSeparator: '/',
} as const;
