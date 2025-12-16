// Demo specific types
import type { NavigationItem, NavigationSection } from './navigation.types';

export type {
  NavigationItem,
  NavigationSection
};

// Demo specific interfaces
export interface DemoConfig {
  showNavigation: boolean;
  showThemeToggle: boolean;
  showLanguageToggle: boolean;
}