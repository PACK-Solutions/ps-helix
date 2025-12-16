/**
 * Interface for a navigation item
 */
export interface NavigationItem {
  /** Path for routing */
  path: string;
  /** Label key for translation */
  label: string;
  /** Keywords for search (bilingual FR/EN with synonyms) */
  keywords?: string[];
}

/**
 * Interface for a navigation section
 */
export interface NavigationSection {
  /** Section title key for translation */
  title: string;
  /** Navigation items in this section */
  items: NavigationItem[];
}

/**
 * Demo specific configuration
 */
export interface DemoConfig {
  showNavigation: boolean;
  showThemeToggle: boolean;
  showLanguageToggle: boolean;
}