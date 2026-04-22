export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  isDark: boolean;
  name: Theme;
  customerTheme?: {
    primaryColor: string;
    secondaryColor?: string;
  };
}
