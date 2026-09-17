import { PshFieldAppearance } from '../../types/semantic.types';
/**
 * @deprecated since 7.0.0 — use {@link PshFieldAppearance}. Surface treatment now shares one
 * vocabulary across the library.
 */
export type TextareaVariant = PshFieldAppearance;
export type TextareaSize = 'small' | 'medium' | 'large';
export type TextareaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export interface TextareaConfig {
  appearance: TextareaVariant;
  size: TextareaSize;
  resize: TextareaResize;
  required: boolean;
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
