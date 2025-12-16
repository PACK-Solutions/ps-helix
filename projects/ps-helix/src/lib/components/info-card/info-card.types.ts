/**
 * Represents a single data row in the info card
 */
export interface InfoCardData {
  /** Label text for the data field */
  label: string;
  /** Value to display (will be converted to string) */
  value: string | number | boolean | null | undefined;
  /** Optional custom width for the label column */
  labelWidth?: string;
  /** Optional custom width for the value column */
  valueWidth?: string;
  /** Optional custom CSS class for styling */
  customClass?: string;
}

/**
 * Configuration options for the info card
 */
export interface InfoCardOptions {
  /** Whether to show empty state when no data */
  showEmptyState?: boolean;
  /** Custom message to display in empty state */
  emptyStateMessage?: string;
  /** Default width for all label columns */
  labelWidth?: string;
  /** Default width for all value columns */
  valueWidth?: string;
  /** Whether to show dividers between rows */
  showDividers?: boolean;
  /** Density of spacing (compact, normal, spacious) */
  density?: 'compact' | 'normal' | 'spacious';
}

/**
 * Available card variant styles
 */
export type InfoCardVariant = 'default' | 'elevated' | 'outlined';