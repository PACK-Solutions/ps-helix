export interface NavigationItem {
  path: string;
  label: string;
}

export interface NavigationSection {
  title: string;
  items: NavigationItem[];
}