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
  /** Whether this row's value can be copied (overrides component-level copyable) */
  copyable?: boolean;
  /** Raw value to copy if different from the displayed value */
  copyValue?: string;
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
}

/**
 * Available card variant styles
 */
export type InfoCardVariant = 'default' | 'elevated' | 'outlined';