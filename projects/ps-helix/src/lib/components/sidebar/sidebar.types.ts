/**
 * Display modes for the sidebar
 */
export type SidebarMode = 'fixed' | 'overlay';

/**
 * Possible positions for the sidebar
 */
export type SidebarPosition = 'left' | 'right';

/**
 * Complete sidebar configuration
 */
export interface SidebarConfig {
  /** Display mode */
  mode: SidebarMode;
  /** Sidebar position */
  position: SidebarPosition;
  /** Sidebar width */
  width: string;
  /** Mobile breakpoint */
  breakpoint: string;
  /** Enable auto-focus on open */
  autoFocus: boolean;
  /** ARIA label for the sidebar */
  ariaLabel: string;
  /** Close sidebar when clicking the backdrop (overlay mode only) */
  closeOnBackdrop: boolean;
  /** Close sidebar when pressing Escape key (overlay mode only) */
  closeOnEscape: boolean;
}
